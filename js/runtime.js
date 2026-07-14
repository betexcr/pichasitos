/**
 * Small runtime helpers shared across game scripts (script-tag load order).
 * Loaded after logger.js / constants.js / optional test-mode.js.
 */
const Runtime = Object.freeze({
  /** @returns {boolean} */
  isTestMode() {
    return typeof TestMode !== 'undefined' && TestMode.isActive();
  },
});
