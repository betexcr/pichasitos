/**
 * Pure helpers for scoreboard / localStorage sanitization.
 * Usable from browser scripts and Node tests (no DOM deps).
 */
(function (root) {
  var NAME_MAX = 8;
  var NAME_CHARSET = /^[A-Z0-9 ]+$/;
  var SCORE_MAX = 9999999;
  var OPPONENTS_MAX = 32;
  var CIRCUIT_MAX = 8;

  function sanitizePlayerName(name) {
    var s = String(name == null ? '' : name).toUpperCase().replace(/[^A-Z0-9 ]/g, '');
    if (!s) s = '???';
    if (s.length > NAME_MAX) s = s.slice(0, NAME_MAX);
    return s;
  }

  function clampInt(n, min, max, fallback) {
    var v = typeof n === 'number' ? n : parseInt(n, 10);
    if (!isFinite(v)) return fallback;
    return Math.max(min, Math.min(max, Math.floor(v)));
  }

  function sanitizeScoreEntry(raw) {
    if (!raw || typeof raw !== 'object') return null;
    return {
      name: sanitizePlayerName(raw.name),
      score: clampInt(raw.score, 0, SCORE_MAX, 0),
      opponents: clampInt(raw.opponents, 0, OPPONENTS_MAX, 0),
      circuit: clampInt(raw.circuit, 0, CIRCUIT_MAX, 0),
      lastDefeated: String(raw.lastDefeated == null ? '' : raw.lastDefeated).slice(0, 32),
      date: typeof raw.date === 'number' && isFinite(raw.date) ? raw.date : Date.now(),
      playerId: raw.playerId != null ? String(raw.playerId).slice(0, 128) : undefined,
    };
  }

  function parseHighScores(jsonText) {
    try {
      var data = JSON.parse(jsonText || '[]');
      if (!Array.isArray(data)) return [];
      return data.map(sanitizeScoreEntry).filter(Boolean).slice(0, 10);
    } catch (e) {
      return [];
    }
  }

  function parseNonNegInt(raw, fallback) {
    var v = parseInt(raw, 10);
    if (!isFinite(v) || v < 0) return fallback;
    return Math.floor(v);
  }

  function createPlayerId() {
    var bytes;
    try {
      if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        bytes = new Uint8Array(9);
        crypto.getRandomValues(bytes);
      }
    } catch (e) {
      bytes = null;
    }
    if (!bytes) {
      bytes = new Uint8Array(9);
      for (var i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
    }
    var hex = '';
    for (var j = 0; j < bytes.length; j++) {
      hex += (bytes[j] < 16 ? '0' : '') + bytes[j].toString(16);
    }
    return 'p_' + hex;
  }

  function buildOnlineScorePayload(name, score, opponents, circuit, lastDefeated, playerId) {
    var entry = sanitizeScoreEntry({
      name: name,
      score: score,
      opponents: opponents,
      circuit: circuit,
      lastDefeated: lastDefeated,
      playerId: playerId,
    });
    if (!entry) return null;
    if (entry.score > SCORE_MAX || entry.score < 0) return null;
    return {
      name: entry.name,
      score: entry.score,
      opponents: entry.opponents,
      circuit: entry.circuit,
      lastDefeated: entry.lastDefeated,
      playerId: entry.playerId || '',
    };
  }

  var ScoreSanitizer = {
    NAME_MAX: NAME_MAX,
    NAME_CHARSET: NAME_CHARSET,
    SCORE_MAX: SCORE_MAX,
    OPPONENTS_MAX: OPPONENTS_MAX,
    CIRCUIT_MAX: CIRCUIT_MAX,
    sanitizePlayerName: sanitizePlayerName,
    sanitizeScoreEntry: sanitizeScoreEntry,
    parseHighScores: parseHighScores,
    parseNonNegInt: parseNonNegInt,
    createPlayerId: createPlayerId,
    buildOnlineScorePayload: buildOnlineScorePayload,
    clampInt: clampInt,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScoreSanitizer;
  }
  /** @type {any} */
  var g = root;
  g.ScoreSanitizer = ScoreSanitizer;
})(typeof globalThis !== 'undefined' ? globalThis : this);
