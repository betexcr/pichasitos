/**
 * Local arcade credits, earnings, and high scores (localStorage).
 * Requires score-sanitize.js loaded first (see index.html).
 */
class Arcade {
  constructor() {
    /** @type {number} */
    this.credits = 0;
    /** @type {number} */
    this.totalEarnings = ScoreSanitizer.parseNonNegInt(
      localStorage.getItem('pichasitos_earnings'), 0
    );
    /** @type {number} */
    this.gamesPlayed = ScoreSanitizer.parseNonNegInt(
      localStorage.getItem('pichasitos_games'), 0
    );
    /** @type {ScoreEntry[]} */
    this.highScores = ScoreSanitizer.parseHighScores(
      localStorage.getItem('pichasitos_scores')
    );
  }

  insertCoin() {
    this.credits++;
    this.totalEarnings += CONST.TEJA_VALUE;
    this._save();
  }

  /** @returns {boolean} */
  hasCredits() { return this.credits > 0; }

  /** @returns {boolean} */
  startGame() {
    if (this.credits <= 0) return false;
    this.credits--;
    this.gamesPlayed++;
    this._save();
    return true;
  }

  /** @returns {boolean} */
  spendCredit() {
    if (this.credits <= 0) return false;
    this.credits--;
    this._save();
    return true;
  }

  /**
   * @param {string} name
   * @param {number} score
   * @param {number} opponents
   * @param {number} circuit
   * @param {string} lastDefeated
   */
  addHighScore(name, score, opponents, circuit, lastDefeated) {
    const entry = ScoreSanitizer.sanitizeScoreEntry({
      name, score, opponents, circuit, lastDefeated, date: Date.now(),
    });
    if (!entry) return;
    this.highScores.push(entry);
    this.highScores.sort((a, b) => (b.score || 0) - (a.score || 0));
    if (this.highScores.length > 10) this.highScores = this.highScores.slice(0, 10);
    this._save();
  }

  /**
   * @param {number} score
   * @returns {boolean}
   */
  isHighScore(score) {
    if (this.highScores.length < 10) return true;
    return score > (this.highScores[this.highScores.length - 1].score || 0);
  }

  /**
   * @returns {{ totalEarnings: number, gamesPlayed: number, credits: number, highScores: ScoreEntry[] }}
   */
  getStats() {
    return {
      totalEarnings: this.totalEarnings,
      gamesPlayed: this.gamesPlayed,
      credits: this.credits,
      highScores: this.highScores,
    };
  }

  _save() {
    localStorage.setItem('pichasitos_earnings', String(this.totalEarnings));
    localStorage.setItem('pichasitos_games', String(this.gamesPlayed));
    localStorage.setItem('pichasitos_scores', JSON.stringify(this.highScores));
  }

  resetStats() {
    this.totalEarnings = 0;
    this.gamesPlayed = 0;
    this.highScores = [];
    this._save();
  }
}
