/**
 * Shared JSDoc typedefs for PICHASITOS persistence / network payloads.
 * Types-only ambient declarations for checkJs.
 */

/**
 * @typedef {Object} ScoreEntry
 * @property {string} name
 * @property {number} score
 * @property {number} opponents
 * @property {number} circuit
 * @property {string} lastDefeated
 * @property {number} [date]
 * @property {string} [playerId]
 */

/**
 * @typedef {Object} PresencePayload
 * @property {string} name
 * @property {string} state
 * @property {number} score
 * @property {number|object} joinedAt
 * @property {number|object} lastSeen
 */

/**
 * @typedef {Object} ClockAdvanceResult
 * @property {number} renderSteps
 * @property {number} logicSteps
 */

/**
 * @typedef {Object} FightModifiers
 * @property {number} [healthMult]
 * @property {number} [damageMult]
 * @property {number} [speedMult]
 */

/**
 * @typedef {Object} ScoreSanitizerApi
 * @property {number} NAME_MAX
 * @property {number} SCORE_MAX
 * @property {number} OPPONENTS_MAX
 * @property {number} CIRCUIT_MAX
 * @property {function(*): string} sanitizePlayerName
 * @property {function(*): ScoreEntry|null} sanitizeScoreEntry
 * @property {function(string|null): ScoreEntry[]} parseHighScores
 * @property {function(*, number): number} parseNonNegInt
 * @property {function(): string} createPlayerId
 * @property {function(*, *, *, *, *, *): Object|null} buildOnlineScorePayload
 */

/** @type {*} */
var CONST;
/** @type {string|undefined} */
var PICHASITOS_CACHE_VERSION;
/** @type {*} */
var firebase;
