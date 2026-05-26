// Push Notification Service Worker
// Handles push events and notification clicks

// Will be set by main app via postMessage
let API_BASE_URL = '';

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
  event.notification.close();

  const notificationData = event.notification.data || {};

  // If a button action was clicked, try to process it via API directly (no app open)
  if (event.action === 'confirm_reservation' || event.action === 'cancel_reservation') {
    const reservationId = notificationData.reservationId;
    if (!reservationId) {
      // No reservation ID, fallback to opening app
      return event.waitUntil(clients.openWindow('/dashboard/reservations'));
    }

    const newStatus = event.action === 'confirm_reservation' ? 'confirmed' : 'cancelled';
    const statusLabel = newStatus === 'confirmed' ? 'confirmée' : 'annulée';
    const apiUrl = API_BASE_URL || '';

    event.waitUntil(
      fetch(`${apiUrl}/api/reservations/${reservationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include',
      })
        .then(function(response) {
          if (!response.ok) throw new Error('API error ' + response.status);
          return response.json();
        })
        .then(function() {
          return self.registration.showNotification(
            'TableMaster',
            {
              body: 'Réservation ' + statusLabel + ' ✓',
              icon: '/icons/icon-192x192.png',
              badge: '/icons/badge-72x72.png',
              tag: 'action-result-' + reservationId,
              timestamp: Date.now(),
            }
          );
        })
        .catch(function(error) {
          console.error('[Push SW] API call failed, opening app:', error);
          // If fetch fails (dev env, network issue, unauthenticated),
          // fall back to opening the app with action param
          return clients.openWindow(
            `/dashboard/reservations/${reservationId}?action=${event.action === 'confirm_reservation' ? 'confirm' : 'cancel'}`
          );
        })
    );
    return;
  }

  // No action button clicked — user tapped the notification itself
  // Open the reservation detail
  let url = '/dashboard';
  if (notificationData.url) {
    url = notificationData.url.split('?')[0].replace(/^https?:\/\/[^/]+/, '');
  } else if (notificationData.reservationId) {
    url = `/dashboard/reservations/${notificationData.reservationId}`;
  }

  event.waitUntil(
    clients.openWindow(url).catch(function(error) {
      console.error('[Push SW] Error opening window:', error);
      return clients.matchAll({ type: 'window' }).then(function(clientList) {
        if (clientList.length > 0) return clientList[0].focus();
        return clients.openWindow('/dashboard');
      });
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
  if (event.data && event.data.type === 'SET_API_URL') {
    API_BASE_URL = event.data.apiUrl || '';
  }

  if (event.data && event.data.type === 'GET_SUBSCRIPTION') {
    self.registration.pushManager.getSubscription()
      .then(subscription => {
        event.ports[0].postMessage({ subscription });
      })
      .catch(error => {
        event.ports[0].postMessage({ error: error.message });
      });
  }
});