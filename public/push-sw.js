// Push Notification Service Worker
// Handles push events and notification clicks

self.addEventListener('push', function(event) {
  // Push event received
  if (!event.data) {
    // Push event has no data
    return;
  }

  let data;
  try {
    data = event.data.json();
    // Push data parsed
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
         // Notification shown
      })
      .catch(error => {
        console.error('[Push SW] Failed to show notification:', error);
      })
  );
});

self.addEventListener('notificationclick', function(event) {
  // Notification clicked

  event.notification.close();

  const notificationData = event.notification.data || {};
  let url = '/dashboard';

  // Determine URL based on notification type
  if (notificationData.url) {
    url = notificationData.url;
  } else if (notificationData.reservationId) {
    url = `/dashboard/reservations/${notificationData.reservationId}`;
  } else if (notificationData.type === 'reservation_created' ||
             notificationData.type === 'reservation_confirmed' ||
             notificationData.type === 'reservation_cancelled' ||
             notificationData.type === 'reservation_updated') {
    url = '/dashboard/reservations';
  }

  // Handle button actions if present
  if (event.action) {
    // Action clicked
    // You can add custom handling for different actions here
    if (event.action === 'view_reservation' && notificationData.reservationId) {
      url = `/dashboard/reservations/${notificationData.reservationId}`;
    } else if (event.action === 'confirm_reservation' && notificationData.reservationId) {
      url = `/dashboard/reservations/${notificationData.reservationId}?action=confirm`;
    } else if (event.action === 'cancel_reservation' && notificationData.reservationId) {
      url = `/dashboard/reservations/${notificationData.reservationId}?action=cancel`;
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
          // Found existing client
          return client.focus();
        }
      }
      
      // If no matching client found, open a new window/tab
      // Opening new client
      return clients.openWindow(url);
    }).catch(error => {
      console.error('[Push SW] Error handling notification click:', error);
      // Fallback to opening a new window
      return clients.openWindow(url);
    })
  );
});

self.addEventListener('pushsubscriptionchange', function(event) {
  // Subscription changed

  // Handle subscription change (e.g., when subscription expires)
  // In a real implementation, you would send the new subscription to your server
  event.waitUntil(
    Promise.resolve().then(async () => {
      // Push subscription changed
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
  // Service worker installed
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  // Service worker activated
  // Take control of all clients immediately
  event.waitUntil(self.clients.claim());
});

// Handle messages from the main thread
self.addEventListener('message', function(event) {
  // Message received
  
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