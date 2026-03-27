class Arcade {
  constructor() {
    this.credits = 0;
    this.totalEarnings = parseInt(localStorage.getItem('pichasitos_earnings') || '0');
    this.gamesPlayed = parseInt(localStorage.getItem('pichasitos_games') || '0');
    this.highScores = JSON.parse(localStorage.getItem('pichasitos_scores') || '[]');
  }

  insertCoin() {
    this.credits++;
    this.totalEarnings += CONST.TEJA_VALUE;
    this._save();
  }

  hasCredits() { return this.credits > 0; }

  startGame() {
    if (this.credits <= 0) return false;
    this.credits--;
    this.gamesPlayed++;
    this._save();
    return true;
  }

  spendCredit() {
    if (this.credits <= 0) return false;
    this.credits--;
    this._save();
    return true;
  }

  addHighScore(name, score, opponents, circuit) {
    this.highScores.push({ name, score: score || 0, opponents: opponents || 0, circuit: circuit || 0, date: Date.now() });
    this.highScores.sort((a, b) => (b.score || 0) - (a.score || 0));
    if (this.highScores.length > 10) this.highScores = this.highScores.slice(0, 10);
    this._save();
  }

  isHighScore(score) {
    if (this.highScores.length < 10) return true;
    return score > (this.highScores[this.highScores.length - 1].score || 0);
  }

  getStats() {
    return {
      totalEarnings: this.totalEarnings,
      gamesPlayed: this.gamesPlayed,
      credits: this.credits,
      highScores: this.highScores,
    };
  }

  _save() {
    localStorage.setItem('pichasitos_earnings', this.totalEarnings);
    localStorage.setItem('pichasitos_games', this.gamesPlayed);
    localStorage.setItem('pichasitos_scores', JSON.stringify(this.highScores));
  }

  resetStats() {
    this.totalEarnings = 0; this.gamesPlayed = 0; this.highScores = [];
    this._save();
  }
}
