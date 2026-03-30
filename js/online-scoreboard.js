class OnlineScoreboard {
  constructor() {
    this.enabled = false;
    this.onlinePlayers = [];
    this.globalScores = [];
    this.onlineCount = 0;
    this.playerId = null;
    this.playerName = '???';
    this._db = null;
    this._presenceRef = null;
    this._pendingState = null;
    this._pendingScore = 0;
  }

  init() {
    var cfg = window.FIREBASE_CONFIG;
    if (!cfg || !cfg.databaseURL || cfg.databaseURL === '') return;
    this._loadSDK();
  }

  _loadSDK() {
    var self = this;
    var base = 'https://www.gstatic.com/firebasejs/10.14.1/';
    this._loadScript(base + 'firebase-app-compat.js', function() {
      self._loadScript(base + 'firebase-database-compat.js', function() {
        self._connect();
      });
    });
  }

  _loadScript(src, onLoad) {
    var s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = onLoad;
    s.onerror = function() {
      console.warn('Online scoreboard: failed to load ' + src);
    };
    document.head.appendChild(s);
  }

  _connect() {
    if (typeof firebase === 'undefined') return;
    var cfg = window.FIREBASE_CONFIG;

    try {
      if (!firebase.apps.length) firebase.initializeApp(cfg);
      this._db = firebase.database();
      this.enabled = true;
      this.playerId = this._getOrCreateId();
      this.playerName = localStorage.getItem('pichasitos_player_name') || '???';
      this._setupPresence();
      this._listenScores();
      this._listenOnline();

      if (this._pendingState) {
        this.updateState(this._pendingState, this._pendingScore);
      }
    } catch (e) {
      console.warn('Online scoreboard unavailable:', e.message);
      this.enabled = false;
    }
  }

  _getOrCreateId() {
    var id = localStorage.getItem('pichasitos_player_id');
    if (!id) {
      id = 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
      localStorage.setItem('pichasitos_player_id', id);
    }
    return id;
  }

  _setupPresence() {
    if (!this._db) return;
    var self = this;
    var ref = this._db.ref('presence/' + this.playerId);

    this._db.ref('.info/connected').on('value', function(snap) {
      if (snap.val() !== true) return;
      ref.set({
        name: self.playerName,
        state: self._pendingState || 'attract',
        score: self._pendingScore || 0,
        joinedAt: firebase.database.ServerValue.TIMESTAMP,
        lastSeen: firebase.database.ServerValue.TIMESTAMP,
      });
      ref.onDisconnect().remove();
      self._presenceRef = ref;
    });
  }

  updateState(state, score) {
    this._pendingState = state;
    this._pendingScore = score || 0;
    if (!this._presenceRef) return;
    this._presenceRef.update({
      state: state || 'attract',
      score: score || 0,
      name: this.playerName,
      lastSeen: firebase.database.ServerValue.TIMESTAMP,
    });
  }

  setPlayerName(name) {
    this.playerName = name || '???';
    localStorage.setItem('pichasitos_player_name', this.playerName);
    if (this._presenceRef) this._presenceRef.update({ name: this.playerName });
  }

  submitScore(name, score, opponents, circuit, lastDefeated) {
    if (!this._db) return;
    this._db.ref('scores').push({
      name: name || '???',
      score: score || 0,
      opponents: opponents || 0,
      circuit: circuit || 0,
      lastDefeated: lastDefeated || '',
      playerId: this.playerId,
      date: firebase.database.ServerValue.TIMESTAMP,
    });
  }

  _listenScores() {
    if (!this._db) return;
    var self = this;
    this._db.ref('scores').orderByChild('score').limitToLast(20).on('value', function(snap) {
      var arr = [];
      snap.forEach(function(c) { arr.push(c.val()); });
      self.globalScores = arr.sort(function(a, b) { return (b.score || 0) - (a.score || 0); }).slice(0, 10);
    });
  }

  _listenOnline() {
    if (!this._db) return;
    var self = this;
    this._db.ref('presence').on('value', function(snap) {
      var arr = [];
      snap.forEach(function(c) { var d = c.val(); d.id = c.key; arr.push(d); });
      self.onlinePlayers = arr;
      self.onlineCount = arr.length;
    });
  }
}

OnlineScoreboard.STATE_LABELS = {
  'attract': 'EN LOBBY',
  'intro': 'EMPEZANDO',
  'circuit_intro': 'NUEVO CIRCUITO',
  'opponent_intro': 'VS OPONENTE',
  'fight': 'PICHASEANDO',
  'round_end': 'ENTRE RONDAS',
  'fight_win': 'VICTORIA',
  'fight_lose': 'DERROTA',
  'continue_screen': 'CONTINUE?',
  'game_over': 'GAME OVER',
  'victory': 'CAMPEON!',
  'name_entry': 'FIRMANDO',
  'operator': 'OPERADOR',
};
