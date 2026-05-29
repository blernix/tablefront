// Push Notification Service Worker
// Handles push events and notification clicks

// Set by main app via postMessage
let API_BASE_URL = '';
let AUTH_TOKEN = '';

self.addEventListener('push', function(event) {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch (error) {
    console.error('[Push SW] Failed to parse push data:', error);
    return;
  }

  const options = {
    body: data.body || 'Nouvelle notification',
    icon: data.icon || '/icons/icon-192x192.png',
    badge: data.badge || '/icons/badge-72x72.png',
    tag: data.tag,
    data: data.data || {},
    actions: data.actions || [],
    image: data.image,
    timestamp: Date.now(),
    vibrate: [200, 100, 200],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'TableMaster', options)
      .catch(function(error) {
        console.error('[Push SW] Failed to show notification:', error);
      })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  var notificationData = event.notification.data || {};
  var reservationId = notificationData.reservationId;

  // Button action clicked: process directly via API, don't open the app
  if (event.action === 'confirm_reservation' || event.action === 'cancel_reservation') {
    if (!reservationId) {
      return event.waitUntil(clients.openWindow('/dashboard/reservations'));
    }

    var newStatus = event.action === 'confirm_reservation' ? 'confirmed' : 'cancelled';
    var statusLabel = newStatus === 'confirmed' ? 'confirmée' : 'annulée';
    var apiUrl = API_BASE_URL || '';

    var headers = { 'Content-Type': 'application/json' };
    if (AUTH_TOKEN) {
      headers['Authorization'] = 'Bearer ' + AUTH_TOKEN;
    }

    event.waitUntil(
      fetch(apiUrl + '/api/reservations/' + reservationId, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({ status: newStatus }),
      })
        .then(function(response) {
          if (!response.ok) throw new Error('Status ' + response.status);
          return response.json();
        })
        .then(function() {
          // Success: show a brief confirmation notification
          return self.registration.showNotification('TableMaster', {
            body: 'Réservation ' + statusLabel + ' ✓',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/badge-72x72.png',
            tag: 'action-' + reservationId,
            timestamp: Date.now(),
          });
        })
        .catch(function(error) {
          console.warn('[Push SW] Direct API call failed, opening app:', error.message);
          // Fallback: open app with action param
          var fallbackAction = event.action === 'confirm_reservation' ? 'confirm' : 'cancel';
          return clients.openWindow('/dashboard/reservations/' + reservationId + '?action=' + fallbackAction);
        })
    );
    return;
  }

  // No action button — user tapped the notification itself
  // Open the reservation detail
  var url = '/dashboard';
  if (reservationId) {
    url = '/dashboard/reservations/' + reservationId;
  } else if (notificationData.url) {
    url = notificationData.url.split('?')[0].replace(/^https?:\/\/[^/]+/, '');
  }

  event.waitUntil(
    clients.openWindow(url).catch(function(error) {
      console.error('[Push SW] Error opening window:', error);
      return clients.matchAll({ type: 'window' }).then(function(list) {
        if (list.length > 0) return list[0].focus();
        return clients.openWindow('/dashboard');
      });
    })
  );
});

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', function(event) {
  if (!event.data) return;

  if (event.data.type === 'SET_API_URL') {
    API_BASE_URL = event.data.apiUrl || '';
  }

  if (event.data.type === 'SET_AUTH_TOKEN') {
    AUTH_TOKEN = event.data.token || '';
  }

  if (event.data.type === 'GET_SUBSCRIPTION') {
    self.registration.pushManager.getSubscription()
      .then(function(sub) {
        event.ports[0].postMessage({ subscription: sub });
      })
      .catch(function(error) {
        event.ports[0].postMessage({ error: error.message });
      });
  }
});
