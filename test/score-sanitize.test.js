import { describe, it, expect } from 'vitest';
import ScoreSanitizer from '../js/score-sanitize.js';

describe('ScoreSanitizer.parseHighScores', () => {
  it('returns empty array for corrupt JSON', () => {
    expect(ScoreSanitizer.parseHighScores('{not json')).toEqual([]);
    expect(ScoreSanitizer.parseHighScores('null')).toEqual([]);
    expect(ScoreSanitizer.parseHighScores('"x"')).toEqual([]);
  });

  it('keeps valid entries and clamps fields', () => {
    const scores = ScoreSanitizer.parseHighScores(JSON.stringify([
      { name: 'bob!!!', score: 1e12, opponents: -3, circuit: 99, lastDefeated: 'x'.repeat(100) },
    ]));
    expect(scores).toHaveLength(1);
    expect(scores[0].name).toBe('BOB');
    expect(scores[0].score).toBe(ScoreSanitizer.SCORE_MAX);
    expect(scores[0].opponents).toBe(0);
    expect(scores[0].circuit).toBe(ScoreSanitizer.CIRCUIT_MAX);
    expect(scores[0].lastDefeated.length).toBeLessThanOrEqual(32);
  });

  it('caps list at 10', () => {
    const raw = Array.from({ length: 15 }, (_, i) => ({ name: 'A' + i, score: i }));
    expect(ScoreSanitizer.parseHighScores(JSON.stringify(raw))).toHaveLength(10);
  });
});

describe('ScoreSanitizer.sanitizePlayerName', () => {
  it('uppercases and strips invalid chars', () => {
    expect(ScoreSanitizer.sanitizePlayerName('ab<script>')).toBe('ABSCRIPT');
  });

  it('falls back to ??? for empty', () => {
    expect(ScoreSanitizer.sanitizePlayerName('')).toBe('???');
    expect(ScoreSanitizer.sanitizePlayerName(null)).toBe('???');
  });
});

describe('ScoreSanitizer.buildOnlineScorePayload', () => {
  it('builds a clamped payload', () => {
    const p = ScoreSanitizer.buildOnlineScorePayload('teo', 500, 2, 1, 'Clarisa', 'p_abc');
    expect(p).toMatchObject({
      name: 'TEO',
      score: 500,
      opponents: 2,
      circuit: 1,
      lastDefeated: 'Clarisa',
      playerId: 'p_abc',
    });
  });
});

describe('ScoreSanitizer.createPlayerId', () => {
  it('returns p_ prefixed hex id', () => {
    const id = ScoreSanitizer.createPlayerId();
    expect(id).toMatch(/^p_[0-9a-f]+$/);
    expect(id.length).toBeGreaterThan(10);
  });
});

describe('ScoreSanitizer.parseNonNegInt', () => {
  it('falls back on bad values', () => {
    expect(ScoreSanitizer.parseNonNegInt('nope', 0)).toBe(0);
    expect(ScoreSanitizer.parseNonNegInt('-5', 0)).toBe(0);
    expect(ScoreSanitizer.parseNonNegInt('42', 0)).toBe(42);
  });
});
