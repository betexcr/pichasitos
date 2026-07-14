/**
 * Optional Firebase Realtime Database scoreboard + presence.
 * Requires score-sanitize.js + logger.js. Uses Anonymous Auth when online.
 * App Check initializes only when FIREBASE_CONFIG.appCheckSiteKey is set.
 */
class OnlineScoreboard {
  constructor() {
    /** @type {boolean} */
    this.enabled = false;
    /** @type {Array<PresencePayload & { id?: string }>} */
    this.onlinePlayers = [];
    /** @type {ScoreEntry[]} */
    this.globalScores = [];
    /** @type {number} */
    this.onlineCount = 0;
    /** @type {string|null} */
    this.playerId = null;
    /** @type {string} */
    this.playerName = '???';
    /** @type {any} */
    this._db = null;
    /** @type {any} */
    this._presenceRef = null;
    /** @type {string|null} */
    this._pendingState = null;
    /** @type {number} */
    this._pendingScore = 0;
    /** @type {number} */
    this._lastPresenceWriteAt = 0;
    /** @type {string|null} */
    this._lastPresenceKey = null;
    /** @type {boolean} */
    this._presenceFlushScheduled = false;
    /** @type {number} */
    this._lastScoreSubmitAt = 0;
    /** @type {boolean} */
    this._authReady = false;
  }

  init() {
    var cfg = window.FIREBASE_CONFIG;
    if (!cfg || !cfg.databaseURL || cfg.databaseURL === '') return;
    this._loadSDK();
  }

  _loadSDK() {
    var self = this;
    var base = 'vendor/firebase/';
    var cfg = window.FIREBASE_CONFIG || {};

    function loadAuthThenConnect() {
      self._loadScript(base + 'firebase-auth-compat.js', function () {
        if (cfg.appCheckSiteKey) {
          self._loadScript(base + 'firebase-app-check-compat.js', function () {
            self._connect();
          });
        } else {
          self._connect();
        }
      });
    }

    this._loadScript(base + 'firebase-app-compat.js', function () {
      self._loadScript(base + 'firebase-database-compat.js', loadAuthThenConnect);
    });
  }

  _loadScript(src, onLoad) {
    var s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = onLoad;
    s.onerror = function () {
      Logger.warn('Online scoreboard: failed to load ' + src);
    };
    document.head.appendChild(s);
  }

  _connect() {
    if (typeof firebase === 'undefined') return;
    var cfg = window.FIREBASE_CONFIG;
    var self = this;

    try {
      if (!firebase.apps.length) firebase.initializeApp(cfg);

      if (cfg.appCheckSiteKey && firebase.appCheck) {
        try {
          var provider = firebase.appCheck.ReCaptchaV3Provider
            ? new firebase.appCheck.ReCaptchaV3Provider(cfg.appCheckSiteKey)
            : cfg.appCheckSiteKey;
          firebase.appCheck().activate(provider, true);
        } catch (appCheckErr) {
          Logger.warn('App Check init failed', appCheckErr && appCheckErr.message);
        }
      }

      firebase.auth().signInAnonymously()
        .then(function () {
          var user = firebase.auth().currentUser;
          if (!user) throw new Error('anonymous auth returned no user');
          self.playerId = user.uid;
          self._authReady = true;
          self._db = firebase.database();
          self.enabled = true;
          self.playerName = ScoreSanitizer.sanitizePlayerName(
            localStorage.getItem('pichasitos_player_name') || '???'
          );
          self._setupPresence();
          self._listenScores();
          self._listenOnline();
          self._wireErrorBeacon();
          if (self._pendingState) {
            self.updateState(self._pendingState, self._pendingScore);
          }
        })
        .catch(function (e) {
          Logger.warn('Online scoreboard auth failed:', e && e.message);
          self.enabled = false;
        });
    } catch (e) {
      Logger.warn('Online scoreboard unavailable:', /** @type {Error} */ (e).message);
      this.enabled = false;
    }
  }

  _wireErrorBeacon() {
    var cfg = window.FIREBASE_CONFIG || {};
    if (!cfg.errorBeacon) return;
    var self = this;
    Logger.setBeacon(function (payload) {
      self.reportClientError(payload);
    });
  }

  /**
   * @param {{ message?: string, stack?: string, context?: string }} payload
   */
  reportClientError(payload) {
    if (!this._db || !this._authReady || !this.playerId) return;
    var cfg = window.FIREBASE_CONFIG || {};
    if (!cfg.errorBeacon) return;
    var row = {
      message: String((payload && payload.message) || 'error').slice(0, 200),
      stack: String((payload && payload.stack) || '').slice(0, 400),
      context: String((payload && payload.context) || 'error').slice(0, 32),
      playerId: this.playerId,
      date: firebase.database.ServerValue.TIMESTAMP,
    };
    this._db.ref('clientErrors').push(row).catch(function (e) {
      Logger.warn('error beacon write failed', e && e.message);
    });
  }

  _setupPresence() {
    if (!this._db || !this.playerId) return;
    var self = this;
    var ref = this._db.ref('presence/' + this.playerId);

    this._db.ref('.info/connected').on('value', function (snap) {
      if (snap.val() !== true) return;
      ref.set({
        name: self.playerName,
        state: self._pendingState || 'attract',
        score: self._pendingScore || 0,
        joinedAt: firebase.database.ServerValue.TIMESTAMP,
        lastSeen: firebase.database.ServerValue.TIMESTAMP,
      }).catch(function (e) {
        Logger.warn('presence set failed', e && e.message);
      });
      ref.onDisconnect().remove();
      self._presenceRef = ref;
      self._lastPresenceWriteAt = Date.now();
      self._lastPresenceKey = self._presenceKey(self._pendingState, self._pendingScore, self.playerName);
    });
  }

  _presenceKey(state, score, name) {
    return String(state || '') + '|' + String(score || 0) + '|' + String(name || '');
  }

  updateState(state, score) {
    this._pendingState = state;
    this._pendingScore = score || 0;
    if (!this._presenceRef) return;

    var key = this._presenceKey(state, score, this.playerName);
    if (key === this._lastPresenceKey) return;

    var now = Date.now();
    var elapsed = now - this._lastPresenceWriteAt;
    var self = this;

    function flush() {
      self._presenceFlushScheduled = false;
      if (!self._presenceRef) return;
      var nextKey = self._presenceKey(self._pendingState, self._pendingScore, self.playerName);
      if (nextKey === self._lastPresenceKey) return;
      self._lastPresenceWriteAt = Date.now();
      self._lastPresenceKey = nextKey;
      self._presenceRef.update({
        state: self._pendingState || 'attract',
        score: self._pendingScore || 0,
        name: self.playerName,
        lastSeen: firebase.database.ServerValue.TIMESTAMP,
      }).catch(function (e) {
        Logger.warn('presence update failed', e && e.message);
      });
    }

    // Throttle: write immediately if ≥3s since last write; else schedule one flush.
    if (elapsed >= 3000) {
      flush();
      return;
    }
    if (!this._presenceFlushScheduled) {
      this._presenceFlushScheduled = true;
      setTimeout(flush, 3000 - elapsed);
    }
  }

  setPlayerName(name) {
    this.playerName = ScoreSanitizer.sanitizePlayerName(name);
    localStorage.setItem('pichasitos_player_name', this.playerName);
    if (this._presenceRef) {
      this._presenceRef.update({ name: this.playerName }).catch(function (e) {
        Logger.warn('presence name update failed', e && e.message);
      });
      this._lastPresenceKey = this._presenceKey(this._pendingState, this._pendingScore, this.playerName);
      this._lastPresenceWriteAt = Date.now();
    }
  }

  submitScore(name, score, opponents, circuit, lastDefeated) {
    if (!this._db || !this._authReady) return;
    var now = Date.now();
    if (now - this._lastScoreSubmitAt < 60000) {
      Logger.warn('score submit rate-limited');
      return;
    }
    var payload = ScoreSanitizer.buildOnlineScorePayload(
      name, score, opponents, circuit, lastDefeated, this.playerId
    );
    if (!payload) return;
    payload.date = /** @type {any} */ (firebase.database.ServerValue.TIMESTAMP);
    var self = this;
    this._db.ref('scores').push(payload)
      .then(function () {
        self._lastScoreSubmitAt = Date.now();
      })
      .catch(function (e) {
        Logger.warn('score submit failed', e && e.message);
      });
  }

  _listenScores() {
    if (!this._db) return;
    var self = this;
    this._db.ref('scores').orderByChild('score').limitToLast(20).on('value', function (snap) {
      var arr = [];
      snap.forEach(function (c) {
        var clean = ScoreSanitizer.sanitizeScoreEntry(c.val());
        if (clean) arr.push(clean);
      });
      self.globalScores = arr.sort(function (a, b) {
        return (b.score || 0) - (a.score || 0);
      }).slice(0, 10);
    });
  }

  _listenOnline() {
    if (!this._db) return;
    var self = this;
    this._db.ref('presence').on('value', function (snap) {
      var arr = [];
      snap.forEach(function (c) {
        var d = c.val();
        d.id = c.key;
        arr.push(d);
      });
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
