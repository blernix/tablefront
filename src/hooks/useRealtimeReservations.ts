import { useState, useEffect, useRef, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { Reservation, ReservationEvent } from '@/types';

interface UseRealtimeReservationsOptions {
  enabled?: boolean;
  onEvent?: (event: ReservationEvent) => void;
  onError?: (error: Event) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
}

export const useRealtimeReservations = (
  options: UseRealtimeReservationsOptions = {}
) => {
  const {
    enabled = false, // ⚠️ TEMPORARILY DISABLED SSE to debug fetch issues
    onEvent,
    onError,
    onConnected,
    onDisconnected,
  } = options;

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef<number>(0);

  // Use refs to store callbacks to avoid stale closures
  const onEventRef = useRef(onEvent);
  const onErrorRef = useRef(onError);
  const onConnectedRef = useRef(onConnected);
  const onDisconnectedRef = useRef(onDisconnected);

  // Update refs when callbacks change
  useEffect(() => {
    onEventRef.current = onEvent;
    onErrorRef.current = onError;
    onConnectedRef.current = onConnected;
    onDisconnectedRef.current = onDisconnected;
  }, [onEvent, onError, onConnected, onDisconnected]);

  // Function to connect to SSE stream
  const connect = useCallback(() => {
    if (!enabled) {
      return;
    }

    // Close existing connection if any
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    // Get the base URL for the API
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const streamUrl = `${baseUrl}/api/notifications/stream`;

    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token found, skipping SSE connection');
      return;
    }

    // EventSource doesn't support custom headers, so we use query parameter for auth
    // The server's authenticateFlexible middleware supports this as a fallback
    // In production with same-origin, cookies will be used automatically
    const urlWithAuth = `${streamUrl}?token=${encodeURIComponent(token)}`;

    const eventSource = new EventSource(urlWithAuth);
    eventSourceRef.current = eventSource;

    // Handle connection open
    eventSource.onopen = () => {
      console.log('SSE connection established');
      retryCountRef.current = 0;
      onConnectedRef.current?.();
    };

    // Handle connected event from server
    eventSource.addEventListener('connected', (event) => {
      console.log('SSE connected event received:', event.data);
      onConnectedRef.current?.();
    });

    // Handle reservation events
    const handleReservationEvent = (eventType: string) => (event: MessageEvent) => {
      try {
        const eventData: ReservationEvent = JSON.parse(event.data);
        console.log(`SSE event received: ${eventType}`, eventData);

        // Call the provided callback
        onEventRef.current?.(eventData);
      } catch (error) {
        console.error('Error parsing SSE event data:', error, event.data);
      }
    };

    // Listen for specific reservation events
    eventSource.addEventListener('reservation_created', handleReservationEvent('reservation_created'));
    eventSource.addEventListener('reservation_updated', handleReservationEvent('reservation_updated'));
    eventSource.addEventListener('reservation_cancelled', handleReservationEvent('reservation_cancelled'));
    eventSource.addEventListener('reservation_confirmed', handleReservationEvent('reservation_confirmed'));
    eventSource.addEventListener('reservation_completed', handleReservationEvent('reservation_completed'));

    // Handle errors
    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      onErrorRef.current?.(error);

      // Close the connection
      eventSource.close();
      eventSourceRef.current = null;
      onDisconnectedRef.current?.();
      
      // Try to reconnect with exponential backoff
      if (enabled) {
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        
        // Calculate exponential backoff delay (1s, 2s, 4s, 8s, ... max 30s)
        const baseDelay = 1000; // 1 second
        const maxDelay = 30000; // 30 seconds
        const delay = Math.min(baseDelay * Math.pow(2, retryCountRef.current), maxDelay);
        retryCountRef.current += 1;
        
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log(`Attempting to reconnect SSE... (retry ${retryCountRef.current}, delay ${delay}ms)`);
          connect();
        }, delay);
      }
    };
  }, [enabled]); // Only depend on enabled, callbacks are accessed via refs

  // Function to manually disconnect
  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      console.log('Manually disconnecting SSE');
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    onDisconnectedRef.current?.();
  }, []);

  // Function to manually reconnect
  const reconnect = useCallback(() => {
    disconnect();
    connect();
  }, [disconnect, connect]);

  // Setup connection on mount and cleanup on unmount
  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Connect on mount
    connect();

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden && eventSourceRef.current) {
        console.log('Page hidden, closing SSE connection');
        eventSourceRef.current.close();
        eventSourceRef.current = null;
        onDisconnectedRef.current?.();
      } else if (!document.hidden && !eventSourceRef.current) {
        console.log('Page visible, reconnecting SSE');
        connect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      // Remove visibility listener
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      // Close SSE connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      // Clear any pending reconnect timers
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      // Notify disconnection
      onDisconnectedRef.current?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]); // Only re-connect if enabled changes

  // Return connection status and controls
  const isConnected = !!eventSourceRef.current;

  return {
    isConnected,
    connect,
    disconnect,
    reconnect,
  };
};

// Hook for managing reservations with real-time updates
export const useRealtimeReservationsManager = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Helper function to convert event reservation to Reservation interface
  const convertEventReservationToReservation = (eventReservation: ReservationEvent['reservation']): Reservation => {
    return {
      _id: eventReservation.id,
      restaurantId: eventReservation.restaurantId,
      customerName: eventReservation.customerName,
      customerEmail: eventReservation.customerEmail,
      customerPhone: '', // Not provided in event
      date: eventReservation.date,
      time: eventReservation.time,
      numberOfGuests: eventReservation.numberOfGuests,
      status: eventReservation.status as 'pending' | 'confirmed' | 'cancelled' | 'completed',
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  // Function to update reservations based on SSE events
  const handleReservationEvent = useCallback((event: ReservationEvent) => {
    setReservations(prevReservations => {
      const { type, reservation: eventReservation } = event;

      switch (type) {
        case 'reservation_created':
          // Add new reservation to the beginning of the list
          const newReservation = convertEventReservationToReservation(eventReservation);
          return [newReservation, ...prevReservations];

        case 'reservation_updated':
        case 'reservation_confirmed':
        case 'reservation_completed':
          // Update existing reservation
          return prevReservations.map(r =>
            r._id === eventReservation.id
              ? {
                  ...r,
                  ...convertEventReservationToReservation(eventReservation),
                  // Keep original fields not in event
                  customerPhone: r.customerPhone,
                  notes: r.notes,
                  createdAt: r.createdAt,
                }
              : r
          );

        case 'reservation_cancelled':
          // Remove cancelled reservation from the list
          return prevReservations.filter(r => r._id !== eventReservation.id);

        default:
          return prevReservations;
      }
    });
  }, []);

  // Memoize SSE callbacks to prevent reconnections
  const handleConnected = useCallback(() => {
    console.log('SSE connected');
    setIsConnected(true);
  }, []);

  const handleDisconnected = useCallback(() => {
    console.log('SSE disconnected');
    setIsConnected(false);
  }, []);

  const handleError = useCallback((error: Event) => {
    console.error('SSE error:', error);
    setIsConnected(false);
  }, []);

  // Use the real-time hook with memoized callbacks
  const { connect, disconnect, reconnect } = useRealtimeReservations({
    onEvent: handleReservationEvent,
    onConnected: handleConnected,
    onDisconnected: handleDisconnected,
    onError: handleError,
  });

  // Track loading state to prevent multiple simultaneous calls
  const isLoadingRef = useRef(false);

  // Function to refresh reservations manually
  const refreshReservations = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isLoadingRef.current) {
      console.log('Already loading reservations, skipping...');
      return;
    }

    try {
      isLoadingRef.current = true;
      const response = await apiClient.getReservations();
      setReservations(response.reservations);
    } catch (error) {
      console.error('Error refreshing reservations:', error);
    } finally {
      isLoadingRef.current = false;
    }
  }, []);

  // Load initial reservations ONCE on mount
  useEffect(() => {
    refreshReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

  return {
    reservations,
    isConnected,
    refreshReservations,
    connect,
    disconnect,
    reconnect,
  };
};