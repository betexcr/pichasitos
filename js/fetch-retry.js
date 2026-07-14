/**
 * fetchWithTimeout — AbortController timeout + limited retries.
 * Soft helpers for production resilience (manifest, etc.).
 */
(function (root) {
  /**
   * @param {string} url
   * @param {{ timeoutMs?: number, retries?: number, cache?: RequestCache }} [opts]
   * @returns {Promise<Response>}
   */
  function fetchWithTimeout(url, opts) {
    opts = opts || {};
    var timeoutMs = opts.timeoutMs != null ? opts.timeoutMs : 12000;
    var retries = opts.retries != null ? opts.retries : 1;
    var cache = opts.cache || 'no-store';

    function attempt(remaining) {
      var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      var timer = null;
      if (controller) {
        timer = setTimeout(function () {
          try { controller.abort(); } catch (e) { /* ignore */ }
        }, timeoutMs);
      }

      var init = { cache: cache };
      if (controller) init.signal = controller.signal;

      return fetch(url, init)
        .then(function (res) {
          if (timer) clearTimeout(timer);
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res;
        })
        .catch(function (err) {
          if (timer) clearTimeout(timer);
          if (remaining > 0) return attempt(remaining - 1);
          throw err;
        });
    }

    return attempt(retries);
  }

  root.fetchWithTimeout = fetchWithTimeout;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { fetchWithTimeout: fetchWithTimeout };
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
