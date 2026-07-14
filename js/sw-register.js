(function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').then(function () {
      if (typeof Logger !== 'undefined' && Logger.isDebug()) {
        Logger.debug('service worker registered');
      }
    }).catch(function (err) {
      if (typeof Logger !== 'undefined') {
        Logger.warn('service worker register failed', err && err.message);
      }
    });
  });
})();
