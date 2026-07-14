/**
 * Lightweight logger. Debug is off unless ?debug=1 or localStorage.pichasitos_debug=1.
 * Never log player names or other PII.
 * Optional remote beacon via OnlineScoreboard.reportClientError when enabled in FIREBASE_CONFIG.
 */
const Logger = (() => {
  var _beaconFn = null;
  var _beaconCount = 0;
  var BEACON_MAX = 5;

  function _debugEnabled() {
    try {
      if (typeof localStorage !== 'undefined' && localStorage.getItem('pichasitos_debug') === '1') {
        return true;
      }
      if (typeof location !== 'undefined' && /[?&]debug=1(?:&|$)/.test(location.search)) {
        return true;
      }
    } catch (e) { /* ignore */ }
    return false;
  }

  function setBeacon(fn) {
    _beaconFn = typeof fn === 'function' ? fn : null;
  }

  function debug() {
    if (!_debugEnabled()) return;
    console.warn.apply(console, ['[PICHASITOS]'].concat([].slice.call(arguments)));
  }

  function warn() {
    console.warn.apply(console, ['[PICHASITOS]'].concat([].slice.call(arguments)));
  }

  function error(err, context) {
    const msg = err && err.message ? err.message : String(err);
    const stack = err && err.stack ? String(err.stack).slice(0, 500) : '';
    console.error('[PICHASITOS]', context || 'error', msg, stack);
    if (_beaconFn && _beaconCount < BEACON_MAX) {
      _beaconCount++;
      try {
        _beaconFn({
          message: String(msg).slice(0, 200),
          stack: stack.slice(0, 400),
          context: String(context || 'error').slice(0, 32),
        });
      } catch (e) { /* ignore beacon failures */ }
    }
  }

  return Object.freeze({ debug, warn, error, isDebug: _debugEnabled, setBeacon: setBeacon });
})();
