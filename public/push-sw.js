// Push Notification Service Worker
// Handles push events and notification clicks

self.addEventListener('push', function(event) {
  console.log('[Push SW] Push event received:', event);

  if (!event.data) {
    console.log('[Push SW] Push event has no data');
    return;
  }

  let data;
  try {
    data = event.data.json();
    console.log('[Push SW] Push data:', data);
  } catch (error) {
    console.error('[Push SW] Failed to parse push data:', error);
    return;
  }

  const title = data.title || 'TableMaster';
  const options = {
    body: data.body || 'Nouvelle notification',
    icon: data.icon || '/icons/icon-192x192.png',
    badge: data.badge || '/icons/badge-72x72.png',
    tag: data.tag,
    data: data.data || {},
    actions: data.actions || [],
    image: data.image,
    timestamp: Date.now(),
    vibrate: [200, 100, 200], // Vibration pattern for mobile devices
  };

  // Keep the service worker alive until the notification is shown
  event.waitUntil(
    self.registration.showNotification(title, options)
      .then(() => {
        console.log('[Push SW] Notification shown:', title);
      })
      .catch(error => {
        console.error('[Push SW] Failed to show notification:', error);
      })
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Push SW] Notification click:', event.notification);

  event.notification.close();

  const notificationData = event.notification.data || {};
  let url = '/dashboard';

  // Determine URL based on notification type
  if (notificationData.url) {
    url = notificationData.url;
  } else if (notificationData.reservationId) {
    url = `/reservations/${notificationData.reservationId}`;
  } else if (notificationData.type === 'reservation_created' || 
             notificationData.type === 'reservation_confirmed' ||
             notificationData.type === 'reservation_cancelled' ||
             notificationData.type === 'reservation_updated') {
    url = '/dashboard/reservations';
  }

  // Handle button actions if present
  if (event.action) {
    console.log('[Push SW] Action clicked:', event.action);
    // You can add custom handling for different actions here
    if (event.action === 'view_reservation' && notificationData.reservationId) {
      url = `/reservations/${notificationData.reservationId}`;
    }
  }

  // Focus or open the appropriate page
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(function(clientList) {
      // Check if there's already a window/tab open with the target URL
      for (const client of clientList) {
        if (client.url === url || client.url.includes(url.split('?')[0])) {
          console.log('[Push SW] Found existing client:', client.url);
          return client.focus();
        }
      }
      
      // If no matching client found, open a new window/tab
      console.log('[Push SW] Opening new client for URL:', url);
      return clients.openWindow(url);
    }).catch(error => {
      console.error('[Push SW] Error handling notification click:', error);
      // Fallback to opening a new window
      return clients.openWindow(url);
    })
  );
});

self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('[Push SW] Subscription changed:', event);

  // Handle subscription change (e.g., when subscription expires)
  // In a real implementation, you would send the new subscription to your server
  event.waitUntil(
    Promise.resolve().then(async () => {
      console.log('[Push SW] Push subscription changed, new subscription:', event.newSubscription);
      // You could send the new subscription to your server here
      // await fetch('/api/notifications/subscribe', {
      //   method: 'POST',
      //   body: JSON.stringify(event.newSubscription)
      // });
    }).catch(error => {
      console.error('[Push SW] Error handling subscription change:', error);
    })
  );
});

// Log service worker lifecycle events
self.addEventListener('install', function(event) {
  console.log('[Push SW] Service worker installed');
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('[Push SW] Service worker activated');
  // Take control of all clients immediately
  event.waitUntil(self.clients.claim());
});

// Handle messages from the main thread
self.addEventListener('message', function(event) {
  console.log('[Push SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'GET_SUBSCRIPTION') {
    // Return current subscription to the client
    self.registration.pushManager.getSubscription()
      .then(subscription => {
        event.ports[0].postMessage({ subscription });
      })
      .catch(error => {
        event.ports[0].postMessage({ error: error.message });
      });
  }
});