import { useEffect, useState, useCallback, useRef } from 'react';
import { apiClient } from '@/lib/api';
import { NotificationPreferences, PushSubscription } from '@/types';

interface UsePushNotificationsReturn {
  // State
  isSupported: boolean;
  permission: NotificationPermission | null;
  isSubscribed: boolean;
  isLoading: boolean;
  error: string | null;
  preferences: NotificationPreferences | null;
  
  // Actions
  requestPermission: () => Promise<NotificationPermission>;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  updatePreferences: (prefs: Partial<Omit<NotificationPreferences, 'userId' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  loadPreferences: () => Promise<void>;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  
  const subscriptionRef = useRef<PushSubscription | null>(null);

  // Check browser support and current state
  // Check if user is already subscribed
  const checkSubscription = useCallback(async () => {
    if (!isSupported) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
      
      if (subscription) {
        subscriptionRef.current = {
          endpoint: subscription.endpoint,
          keys: {
            auth: arrayBufferToBase64Url(subscription.getKey('auth')!),
            p256dh: arrayBufferToBase64Url(subscription.getKey('p256dh')!),
          },
        };
      }
    } catch (err) {
      console.error('Error checking subscription:', err);
    }
  }, [isSupported]);

  // Check browser support and current state
  useEffect(() => {
    const checkSupport = () => {
      const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
      setIsSupported(supported);
      
      if (supported) {
        setPermission(Notification.permission);
        checkSubscription();
      }
    };

    checkSupport();
  }, [checkSubscription]);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      throw new Error('Push notifications not supported');
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (err) {
      console.error('Error requesting permission:', err);
      setError('Failed to request notification permission');
      throw err;
    }
  }, [isSupported]);
  // Load notification preferences
  const loadPreferences = useCallback(async () => {
    if (!isSupported) return;

    try {
      const { preferences } = await apiClient.notifications.getNotificationPreferences();
      setPreferences(preferences);
    } catch (err) {
      console.error('Error loading notification preferences:', err);
      // Don't set error state for preferences loading failure
    }
  }, [isSupported]);

  // Subscribe to push notifications
  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      throw new Error('Push notifications not supported');
    }

    if (permission !== 'granted') {
      const newPermission = await requestPermission();
      if (newPermission !== 'granted') {
        setError('Notification permission denied');
        return false;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get VAPID public key from server
      const { publicKey } = await apiClient.notifications.getVapidPublicKey();
      
      if (!publicKey) {
        throw new Error('VAPID public key not available');
      }

      // Convert base64 URL safe key to Uint8Array
      const applicationServerKey = urlBase64ToUint8Array(publicKey);

      // Register service worker for push notifications
      let registration;
      try {
        registration = await navigator.serviceWorker.register('/push-sw.js');
        await navigator.serviceWorker.ready;
      } catch (swError) {
        console.warn('Failed to register push service worker, trying main service worker:', swError);
        registration = await navigator.serviceWorker.ready;
      }

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey as BufferSource,
      });

      // Convert subscription to send to server
      const subscriptionData: PushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          auth: arrayBufferToBase64Url(subscription.getKey('auth')!),
          p256dh: arrayBufferToBase64Url(subscription.getKey('p256dh')!),
        },
      };

      // Send subscription to server
      await apiClient.notifications.subscribe(subscriptionData, navigator.userAgent);
      
      subscriptionRef.current = subscriptionData;
      setIsSubscribed(true);
      
      // Load preferences after subscription
      await loadPreferences();
      
      return true;
    } catch (err) {
      console.error('Error subscribing to push notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to subscribe to push notifications');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, permission, requestPermission, loadPreferences]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported || !isSubscribed) {
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        
        // Notify server about unsubscribe
        if (subscriptionRef.current) {
          await apiClient.notifications.unsubscribe(subscriptionRef.current.endpoint);
        }
        
        subscriptionRef.current = null;
        setIsSubscribed(false);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error unsubscribing from push notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to unsubscribe from push notifications');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, isSubscribed]);


  // Update notification preferences
  const updatePreferences = useCallback(async (
    prefs: Partial<Omit<NotificationPreferences, 'userId' | 'createdAt' | 'updatedAt'>>
  ) => {
    try {
      const { preferences: updatedPreferences } = await apiClient.notifications.updateNotificationPreferences(prefs);
      setPreferences(updatedPreferences);
    } catch (err) {
      console.error('Error updating notification preferences:', err);
      setError(err instanceof Error ? err.message : 'Failed to update notification preferences');
      throw err;
    }
  }, []);

  // Load preferences on mount if subscribed
  useEffect(() => {
    if (isSubscribed) {
      loadPreferences();
    }
  }, [isSubscribed, loadPreferences]);

  return {
    // State
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    error,
    preferences,
    
    // Actions
    requestPermission,
    subscribe,
    unsubscribe,
    updatePreferences,
    loadPreferences,
  };
}

// Utility function to convert base64 URL safe string to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

// Utility function to convert ArrayBuffer to base64 URL safe string
function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const uint8Array = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}