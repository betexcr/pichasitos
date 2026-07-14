import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import ScoreSanitizer from '../js/score-sanitize.js';

/**
 * Mirrors Arcade localStorage boot logic for Node (no CONST / DOM).
 */
function loadArcadeScoresFromStorage(getItem) {
  return ScoreSanitizer.parseHighScores(getItem('pichasitos_scores'));
}

describe('arcade storage boot', () => {
  const store = {};
  beforeEach(() => {
    Object.keys(store).forEach((k) => delete store[k]);
  });

  it('boots with empty board when scores JSON is corrupt', () => {
    store.pichasitos_scores = '{broken';
    const scores = loadArcadeScoresFromStorage((k) => store[k] || null);
    expect(scores).toEqual([]);
  });

  it('loads sanitized high scores', () => {
    store.pichasitos_scores = JSON.stringify([
      { name: 'OK', score: 100 },
      { name: '', score: 'bad' },
    ]);
    const scores = loadArcadeScoresFromStorage((k) => store[k] || null);
    expect(scores[0].name).toBe('OK');
    expect(scores[0].score).toBe(100);
    expect(scores[1].name).toBe('???');
    expect(scores[1].score).toBe(0);
  });
});
