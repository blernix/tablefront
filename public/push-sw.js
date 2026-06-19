// Push Notification Service Worker
// Handles push events and notification clicks

self.addEventListener('push', function(event) {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch (error) {
    console.error('[Push SW] Failed to parse push data:', error);
    return;
  }

  var options = {
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

  var baseUrl = '/dashboard';
  var action = null;

  if (event.action === 'confirm_reservation') {
    action = 'confirm';
  } else if (event.action === 'cancel_reservation') {
    action = 'cancel';
  }

  if (reservationId) {
    baseUrl = '/dashboard/reservations/' + reservationId;
  } else if (notificationData.url) {
    baseUrl = notificationData.url.split('?')[0].replace(/^https?:\/\/[^/]+/, '') || '/dashboard';
  }

  // Build URL with both query param AND hash fragment as redundant signal
  // Hash fragment survives PWA window reuse scenarios better than query params
  var url = baseUrl;
  if (action) {
    url += '?action=' + action + '#action=' + action;
  }

  console.log('[Push SW] Opening URL:', url, '| event.action:', event.action, '| reservationId:', reservationId);

  event.waitUntil(
    clients.openWindow(url).catch(function(error) {
      console.error('[Push SW] Error opening window:', error);
      return clients.matchAll({ type: 'window' }).then(function(list) {
        if (list.length > 0) return list[0].focus();
        return clients.openWindow(url);
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
