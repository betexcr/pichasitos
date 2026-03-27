class Game {
  constructor() {
    this.canvas = document.getElementById('game');
    this.renderer = new Renderer(this.canvas);
    this.audio = new AudioSystem();
    this.arcade = new Arcade();
    this.ui = new UIManager(this.renderer);

    this.state = CONST.STATES.ATTRACT;
    this.tick = 0; this.stateTick = 0; this.logicAccum = 0;
    this.player = null; this.opponent = null;
    this.currentOpponentIndex = 0; this.currentCircuit = 0;
    this.round = 1; this.roundTime = CONST.ROUND_TIME;
    this.continueTimeLeft = CONST.CONTINUE_TIME;
    this.koLine = ''; this.roundWinner = null;
    this.playerRoundsWon = 0; this.opponentRoundsWon = 0;
    this.playerHitThisSwing = false; this.opponentHitThisAttack = false;
    this.idleTimer = 0; this.operatorKeyTimer = 0;
    this._introSpeechDone = false;
    this._oppIntroSpeechDone = false;

    this.score = 0;
    this.roundDamageTaken = 0;
    this.winLine = '';
    this.koWinLine = '';
    this.roundStartLine = '';

    this.nameEntry = { chars: ['A','A','A'], pos: 0, done: false };

    this.input = { left:false,right:false,up:false,down:false,punchLeft:false,punchRight:false,special:false,start:false,coin:false };
    this._pressedThisFrame = {};
    this._setupInput();
    this._loop();
  }

  _setupInput() {
    const keyMap = {
      [CONST.KEYS.LEFT]:'left',[CONST.KEYS.RIGHT]:'right',[CONST.KEYS.UP]:'up',[CONST.KEYS.DOWN]:'down',
      [CONST.KEYS.PUNCH_LEFT]:'punchLeft',[CONST.KEYS.PUNCH_RIGHT]:'punchRight',[CONST.KEYS.SPECIAL]:'special',
      [CONST.KEYS.START]:'start',[CONST.KEYS.COIN]:'coin',
    };
    document.addEventListener('keydown', (e) => {
      e.preventDefault();
      const action = keyMap[e.key];
      if (action) { if (!this.input[action]) this._pressedThisFrame[action]=true; this.input[action]=true; this.idleTimer=0; }
      if (e.key===CONST.KEYS.COIN && this.input.start) { this.operatorKeyTimer++; if (this.operatorKeyTimer>90) this._enterOperatorMode(); }
      else if (e.key===CONST.KEYS.START && this.input.coin) { this.operatorKeyTimer++; if (this.operatorKeyTimer>90) this._enterOperatorMode(); }
    });
    document.addEventListener('keyup', (e) => {
      const action = keyMap[e.key];
      if (action) this.input[action]=false;
      if (e.key===CONST.KEYS.COIN||e.key===CONST.KEYS.START) this.operatorKeyTimer=0;
    });
  }

  _pressed(action) { return !!this._pressedThisFrame[action]; }
  _consumePress(action) { if (this._pressedThisFrame[action]) { delete this._pressedThisFrame[action]; return true; } return false; }

  _addScore(points) {
    this.score += points;
  }

  _loop() {
    try {
      this.tick++; this.stateTick++; this.logicAccum++;
      if (this.renderer.isHitStopped()) {
        this._render();
        this.renderer.postProcess();
        requestAnimationFrame(() => this._loop());
        return;
      }
      if (this.logicAccum >= 2) { this.logicAccum = 0; this._update(); this._pressedThisFrame = {}; }
      this._render();
      this.renderer.postProcess();
    } catch (e) {
      console.error('PICHASITOS loop error:', e);
      this.renderer.ctx.fillStyle = '#000';
      this.renderer.ctx.fillRect(0, 0, CONST.WIDTH, CONST.HEIGHT);
      this.renderer.ctx.fillStyle = '#F00';
      this.renderer.ctx.font = 'bold 10px monospace';
      this.renderer.ctx.fillText('ERROR: ' + e.message, 10, 30);
      this.renderer.ctx.fillStyle = '#FFF';
      this.renderer.ctx.fillText('Check console (F12)', 10, 50);
    }
    requestAnimationFrame(() => this._loop());
  }

  _update() {
    this.idleTimer++;
    if (this._consumePress('coin')) { this.arcade.insertCoin(); this.audio.coinInsert(); }
    switch (this.state) {
      case CONST.STATES.ATTRACT: this._updateAttract(); break;
      case CONST.STATES.INTRO: this._updateIntro(); break;
      case CONST.STATES.CIRCUIT_INTRO: this._updateCircuitIntro(); break;
      case CONST.STATES.OPPONENT_INTRO: this._updateOpponentIntro(); break;
      case CONST.STATES.FIGHT: this._updateFight(); break;
      case CONST.STATES.ROUND_END: this._updateRoundEnd(); break;
      case CONST.STATES.FIGHT_WIN: this._updateFightWin(); break;
      case CONST.STATES.FIGHT_LOSE: this._updateFightLose(); break;
      case CONST.STATES.CONTINUE_SCREEN: this._updateContinue(); break;
      case CONST.STATES.GAME_OVER: this._updateGameOver(); break;
      case CONST.STATES.VICTORY: this._updateVictory(); break;
      case CONST.STATES.NAME_ENTRY: this._updateNameEntry(); break;
      case CONST.STATES.OPERATOR: this._updateOperator(); break;
    }
    if (this.state===CONST.STATES.FIGHT && this.idleTimer>CONST.IDLE_TIMEOUT*30) { this._changeState(CONST.STATES.ATTRACT); this.audio.stopMusic(); }
  }

  _changeState(newState) { this.state = newState; this.stateTick = 0; }

  _updateAttract() {
    if (this._consumePress('start') && this.arcade.hasCredits()) {
      this.arcade.startGame(); this.audio.menuConfirm();
      this.currentOpponentIndex = 0; this.currentCircuit = 0;
      this.score = 0;
      this._introSpeechDone = false;
      this._changeState(CONST.STATES.INTRO); this.audio.startMusic('fiesta');
    }
  }

  _updateIntro() {
    if (!this._introSpeechDone && this.stateTick === 2) {
      this.audio.speakNarrator(CONST.TEXT.INTRO_LINES.join(' '));
      this._introSpeechDone = true;
    }
    if (this._consumePress('start') && this.stateTick > 60) { this.audio.menuConfirm(); this._changeState(CONST.STATES.CIRCUIT_INTRO); }
  }

  _updateCircuitIntro() {
    if (this._consumePress('start') && this.stateTick > 30) { this.audio.menuConfirm(); this._oppIntroSpeechDone = false; this._changeState(CONST.STATES.OPPONENT_INTRO); }
  }

  _updateOpponentIntro() {
    if (!this._oppIntroSpeechDone && this.stateTick === 10) {
      const isBull = this.currentOpponentIndex >= OPPONENT_DATA.length;
      const opp = isBull ? TORO_DATA : OPPONENT_DATA[this.currentOpponentIndex];
      if (opp.quote) this.audio.speakOpponent(opp.quote, opp.name);
      this._oppIntroSpeechDone = true;
    }
    if (this._consumePress('start') && this.stateTick > 30) { this.audio.menuConfirm(); this._startFight(); }
  }

  _startFight() {
    const isBull = this.currentOpponentIndex >= OPPONENT_DATA.length;
    const oppData = isBull ? TORO_DATA : OPPONENT_DATA[this.currentOpponentIndex];
    this.player = new Player(); this.opponent = new OpponentAI(oppData);
    this.round = 1; this.roundTime = CONST.ROUND_TIME;
    this.playerRoundsWon = 0; this.opponentRoundsWon = 0;
    this.playerHitThisSwing = false; this.opponentHitThisAttack = false;
    this.roundDamageTaken = 0;
    const rsl = CONST.TEXT.ROUND_START_LINES || [CONST.TEXT.ROUND_START];
    this.roundStartLine = rsl[Math.floor(Math.random() * rsl.length)];
    this.audio.stopMusic(); this.audio.startMusic(isBull ? 'boss' : 'fight');
    this.audio.roundStart(); this._changeState(CONST.STATES.FIGHT);
  }

  _updateFight() {
    if (!this.player || !this.opponent) return;
    this.roundTime -= 1/CONST.LOGIC_FPS;
    if (this.renderer.crowdExcitement > 0) this.renderer.crowdExcitement = Math.max(0, this.renderer.crowdExcitement - 0.003);

    const pInput = {
      left:this._consumePress('left'), right:this._consumePress('right'), up:this.input.up,
      down:this._consumePress('down'), punchLeft:this._consumePress('punchLeft'),
      punchRight:this._consumePress('punchRight'), special:this._consumePress('special'),
    };
    this.player.update(pInput);
    const playerStateForAI = this.player.isWindingUp() ? 'windup' : this.player.state;
    this.opponent.update(playerStateForAI, this.tick);

    if (!this.player.isPunching()) this.playerHitThisSwing = false;
    if (!this.opponent.isAttacking()) this.opponentHitThisAttack = false;

    if (this.opponent.signaturePhraseTimer === 49 && this.opponent.signaturePhrase) {
      this.audio.speakOpponent(this.opponent.signaturePhrase, this.opponent.data.name);
    }
    if (this.opponent.signatureEffect && this.opponent.signatureEffectTimer === this.opponent.currentPattern.attackFrames + 14) {
      this.audio.signatureAttack(this.opponent.signatureEffect);
    }

    const wasRampage = this.player.rampage;

    if (this.player.isPunching() && !this.playerHitThisSwing) {
      this.playerHitThisSwing = true;
      const canPierce = this.player.state === 'special' || this.player.rampage;
      if (!this.opponent.isBlocking() || canPierce) {
        if (this.opponent.state !== 'ko') {
          const dmg = this.player.getPunchDamage();
          const actual = this.opponent.takeHit(dmg);
          if (actual > 0) {
            this.player.landedHit();
            const isCombo = this.player.combo >= 3;
            this._addScore(isCombo ? CONST.POINTS.COMBO_HIT : CONST.POINTS.HIT);
            if (this.player.state === 'special') this._addScore(CONST.POINTS.SPECIAL_HIT);

            this.renderer.oppHitFlashTimer = 8;
            this.renderer.comboCount = this.player.combo;
            this.renderer.comboTimer = 45;
            this.renderer.crowdExcitement = Math.min(1, (this.renderer.crowdExcitement || 0) + 0.15);
            this.renderer.addDamageNumber(this.renderer.W/2 + (Math.random()-0.5)*20, 80, actual, isCombo ? CONST.COLORS.GOLD : CONST.COLORS.WHITE);

            const hitX = this.renderer.W / 2 + (this.player.state === 'punchLeft' ? -8 : 8) + (Math.random() - 0.5) * 10;
            const hitY = 85 + (Math.random() - 0.5) * 16;

            if (this.player.rampage) {
              this.audio.rampageHit(); this.renderer.addHitParticles(hitX, hitY, 14);
              this.renderer.triggerScreenShake(3, 5);
              this.renderer.triggerHitStop(3);
              this.renderer.triggerImpactStar(hitX, hitY, 22, 12);
              this.renderer.triggerSweatDrops(this.renderer.W / 2, 75, 5);
            } else {
              this.audio.punchHit(); this.renderer.addHitParticles(hitX, hitY, actual > 15 ? 12 : 7);
              this.renderer.triggerScreenShake(1.5, 3);
              this.renderer.triggerHitStop(2);
              this.renderer.triggerImpactStar(hitX, hitY, actual > 15 ? 18 : 14, 10);
              this.renderer.triggerSweatDrops(this.renderer.W / 2, 75, actual > 15 ? 4 : 2);
            }
            if (this.player.state === 'special') {
              this.audio.specialAttack(); this.renderer.triggerScreenShake(6, 12); this.renderer.triggerFlash();
              this.audio.speakNarrator(CONST.TEXT.DEMASIADO_GUARO);
              this.renderer.triggerHitStop(5);
              this.renderer.triggerImpactFrame(8);
              this.renderer.triggerGuaroSplash();
              this.renderer.crowdExcitement = Math.min(1, (this.renderer.crowdExcitement || 0) + 0.4);
            }
          }
        }
      } else { this.audio.block(); }
    }

    if (this.player.rampage && !wasRampage) {
      this._addScore(CONST.POINTS.RAMPAGE_ACTIVATE);
      this.audio.rampageStart(); this.audio.crowdCheer(); this.renderer.triggerScreenShake(6, 15); this.renderer.triggerFlash();
    }
    if (!this.player.rampage && wasRampage && this.player.state !== 'hurt') this.audio.rampageEnd();

    const playerWasRampage = this.player.rampage;
    const healthBefore = this.player.health;
    if (this.opponent.isAttacking() && !this.opponentHitThisAttack) {
      this.opponentHitThisAttack = true;
      const unblockable = this.opponent.isAttackUnblockable();
      if (this.player.state==='dodge_left'||this.player.state==='dodge_right'||this.player.state==='duck') {
        this.opponent.recordPlayerDodge(this.player.state); this.audio.dodge();
        this._addScore(CONST.POINTS.DODGE);
        this.renderer.setDodgeGhost(this.renderer.W/2, 170, 'idle', 0);
        this.renderer.addDodgeDust(this.renderer.W/2, 200, this.player.state === 'dodge_left' ? 'left' : 'right');
      } else if (this.player.state==='block' && !unblockable) {
        const dmg = Math.floor(this.opponent.getAttackDamage()*CONST.PLAYER.BLOCK_DAMAGE_MULT);
        this.player.health = Math.max(0, this.player.health-dmg);
        this.player.stamina = Math.max(0, this.player.stamina-(CONST.PLAYER.CHIP_STAMINA_DAMAGE||5));
        this.audio.block(); this.renderer.addBlockParticles(this.renderer.W/2, 170);
        this._addScore(CONST.POINTS.BLOCK);
        if (this.player.health<=0) { this.player.state='ko'; this.player.stateTimer=90; }
      } else {
        const hit = this.player.takeHit(this.opponent.getAttackDamage());
        if (hit) {
          this.audio.hurt(); this.renderer.addHitParticles(this.renderer.W/2, 180, 5);
          this.renderer.hitFlashTimer = 4;
          this.renderer.addDamageNumber(this.renderer.W/2 + (Math.random()-0.5)*20, 170, this.opponent.getAttackDamage(), CONST.COLORS.RED);
          if (this.opponent.isAttackStun()) this.player.stateTimer += 30;
          const pattern = this.opponent.currentPattern;
          if (pattern && pattern.screenShake) {
            this.renderer.triggerScreenShake(6, 10); this.renderer.addDustParticles(this.renderer.W/2, 200);
            this.renderer.triggerHitStop(3);
          }
          if (playerWasRampage && !this.player.rampage) this.audio.rampageEnd();
        }
      }
    }
    this.roundDamageTaken += Math.max(0, healthBefore - this.player.health);

    if (this.opponent.isKO()) {
      this.koLine = CONST.TEXT.KO_LINES[Math.floor(Math.random()*CONST.TEXT.KO_LINES.length)];
      this.roundWinner = 'player'; this.playerRoundsWon++;
      this._addScore(CONST.POINTS.ROUND_KO);
      const timeBonus = Math.floor(Math.max(0, this.roundTime) * CONST.POINTS.TIME_BONUS_PER_SEC);
      this._addScore(timeBonus);
      if (this.roundDamageTaken === 0) this._addScore(CONST.POINTS.PERFECT_ROUND);
      this.audio.ko(); this.audio.crowdCheer(); this.renderer.addKOBurst(this.renderer.W/2, 90); this.renderer.addDustParticles(this.renderer.W/2, 140);
      this.renderer.addConfetti(this.renderer.W/2, 60, 30);
      this.renderer.crowdExcitement = 1;
      this.renderer.triggerHitStop(5);
      this.renderer.triggerImpactFrame(8);
      this._changeState(CONST.STATES.ROUND_END); return;
    }
    if (this.player.isKO()) {
      this.roundWinner = 'opponent'; this.opponentRoundsWon++;
      this.audio.ko(); this._changeState(CONST.STATES.ROUND_END); return;
    }
    if (this.roundTime <= 0) {
      if (this.player.health >= this.opponent.health) {
        this.roundWinner='player'; this.playerRoundsWon++;
        this._addScore(CONST.POINTS.ROUND_DECISION);
      } else { this.roundWinner='opponent'; this.opponentRoundsWon++; }
      this.koLine = 'TIEMPO!'; this._changeState(CONST.STATES.ROUND_END);
    }
  }

  _updateRoundEnd() {
    if (this.stateTick >= 70 && !this._roundEndIris) {
      this._roundEndIris = true;
      this.renderer.startIrisWipe(this.renderer.W/2, this.renderer.H/2, 20);
    }
    if (this.stateTick > 90) {
      this._roundEndIris = false;
      this.renderer.irisWipe = null;
      if (this.playerRoundsWon >= Math.ceil(CONST.ROUNDS_PER_FIGHT/2)) {
        this.audio.roundWin();
        this.winLine = CONST.TEXT.WIN_LINES[Math.floor(Math.random()*CONST.TEXT.WIN_LINES.length)];
        this.koWinLine = CONST.TEXT.KO_LINES[Math.floor(Math.random()*CONST.TEXT.KO_LINES.length)];
        this._changeState(CONST.STATES.FIGHT_WIN); return;
      }
      if (this.opponentRoundsWon >= Math.ceil(CONST.ROUNDS_PER_FIGHT/2)) { this.audio.roundLose(); this._changeState(CONST.STATES.FIGHT_LOSE); return; }
      this.round++; this.roundTime = CONST.ROUND_TIME;
      this.roundDamageTaken = 0;
      const rsl2 = CONST.TEXT.ROUND_START_LINES || [CONST.TEXT.ROUND_START];
      this.roundStartLine = rsl2[Math.floor(Math.random() * rsl2.length)];
      this.player.resetRound(); this.opponent.resetRound();
      this.audio.roundStart(); this._changeState(CONST.STATES.FIGHT);
    }
  }

  _updateFightWin() {
    if (this._consumePress('start') && this.stateTick > 40) {
      const fightBonus = CONST.POINTS.FIGHT_WIN_BASE * (this.currentOpponentIndex + 1);
      this._addScore(fightBonus);
      this._advanceToNextOpponent();
    }
  }

  _advanceToNextOpponent() {
    this.currentOpponentIndex++;
    if (this.currentOpponentIndex > OPPONENT_DATA.length) {
      this._addScore(CONST.POINTS.BOSS_DEFEAT);
      this.audio.stopMusic(); this.audio.victoryFanfare();
      this._changeState(CONST.STATES.VICTORY); return;
    }
    if (this.currentOpponentIndex >= OPPONENT_DATA.length) {
      this.audio.stopMusic(); this._oppIntroSpeechDone = false; this._changeState(CONST.STATES.OPPONENT_INTRO); return;
    }
    const newCircuit = OPPONENT_DATA[this.currentOpponentIndex].circuit;
    if (newCircuit !== this.currentCircuit) {
      this.currentCircuit = newCircuit; this.audio.stopMusic(); this.audio.startMusic('fiesta');
      this._changeState(CONST.STATES.CIRCUIT_INTRO); return;
    }
    this._oppIntroSpeechDone = false;
    this._changeState(CONST.STATES.OPPONENT_INTRO);
  }

  _updateFightLose() {
    if (this.stateTick > 60) {
      this.audio.stopMusic(); this.continueTimeLeft = CONST.CONTINUE_TIME;
      this._changeState(CONST.STATES.CONTINUE_SCREEN);
    }
  }

  _updateContinue() {
    this.continueTimeLeft -= 1/CONST.LOGIC_FPS;
    const prev = Math.ceil(this.continueTimeLeft+1/CONST.LOGIC_FPS);
    const curr = Math.ceil(this.continueTimeLeft);
    if (prev!==curr && this.continueTimeLeft>0) this.audio.countdown();
    if (this.arcade.hasCredits() && (this._consumePress('start')||this._consumePress('coin'))) {
      if (!this.arcade.hasCredits()) return;
      this.arcade.spendCredit(); this.audio.menuConfirm(); this.audio.startMusic('fight'); this._startFight(); return;
    }
    if (this.continueTimeLeft <= 0) {
      this._startNameEntry();
    }
  }

  _startNameEntry() {
    this.nameEntry = { chars: ['A','A','A'], pos: 0, done: false };
    this._changeState(CONST.STATES.NAME_ENTRY);
  }

  _updateNameEntry() {
    const ne = this.nameEntry;
    const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';

    if (ne.done) {
      if (this.stateTick > 60) {
        const name = ne.chars.join('');
        this.arcade.addHighScore(name, this.score, this.currentOpponentIndex, this.currentCircuit);
        this._changeState(CONST.STATES.GAME_OVER);
      }
      return;
    }

    if (this._consumePress('up') || this._consumePress('left')) {
      this.audio.menuSelect && this.audio.menuSelect();
      let idx = ALPHABET.indexOf(ne.chars[ne.pos]);
      idx = (idx - 1 + ALPHABET.length) % ALPHABET.length;
      ne.chars[ne.pos] = ALPHABET[idx];
    }
    if (this._consumePress('down') || this._consumePress('right')) {
      this.audio.menuSelect && this.audio.menuSelect();
      let idx = ALPHABET.indexOf(ne.chars[ne.pos]);
      idx = (idx + 1) % ALPHABET.length;
      ne.chars[ne.pos] = ALPHABET[idx];
    }
    if (this._consumePress('punchLeft') || this._consumePress('punchRight') || this._consumePress('start')) {
      this.audio.menuConfirm();
      ne.pos++;
      if (ne.pos >= 3) {
        ne.done = true;
        this.stateTick = 0;
      }
    }
  }

  _updateGameOver() { if (this.stateTick > 120) this._changeState(CONST.STATES.ATTRACT); }

  _updateVictory() {
    if (this._consumePress('start') && this.stateTick > 60) {
      this._startNameEntry();
      return;
    }
    if (this.stateTick > 600) {
      this._startNameEntry();
    }
  }

  _enterOperatorMode() { this._changeState(CONST.STATES.OPERATOR); this.operatorKeyTimer = 0; }
  _updateOperator() { if (this._consumePress('start')) this._changeState(CONST.STATES.ATTRACT); }

  _render() {
    this.renderer.clear();
    switch (this.state) {
      case CONST.STATES.ATTRACT:
        this.ui.drawAttractMode(this.tick, this.arcade.credits, this.arcade.highScores); break;
      case CONST.STATES.INTRO:
        this.ui.drawIntro(this.stateTick); break;
      case CONST.STATES.CIRCUIT_INTRO:
        this.ui.drawCircuitIntro(this.currentCircuit, this.stateTick); break;
      case CONST.STATES.OPPONENT_INTRO: {
        const isBull = this.currentOpponentIndex >= OPPONENT_DATA.length;
        if (isBull) this.ui.drawBullIntro(this.stateTick);
        else this.ui.drawOpponentIntro(OPPONENT_DATA[this.currentOpponentIndex], this.stateTick);
        break;
      }
      case CONST.STATES.FIGHT:
        if (this.player && this.opponent) {
          this.renderer.drawFightScene(this.player, this.opponent, this.tick);
          this.renderer.drawHUD(this.player, this.opponent, this.roundTime, this.round, this.currentCircuit, this.score);
          if (this.stateTick < 60) {
            const t = this.stateTick / 60;
            const alpha = 1 - t;
            const zoomScale = t < 0.15 ? 4 - (t / 0.15) * 1.5 : 2.5;
            this.renderer.ctx.globalAlpha = alpha;
            this.renderer.drawCenteredText(this.roundStartLine || CONST.TEXT.ROUND_START, 100, CONST.COLORS.GOLD, zoomScale);
            this.renderer.ctx.globalAlpha = 1;
          }
        }
        break;
      case CONST.STATES.ROUND_END:
        if (this.player && this.opponent) {
          this.renderer.drawFightScene(this.player, this.opponent, this.tick);
          this.renderer.drawHUD(this.player, this.opponent, this.roundTime, this.round, this.currentCircuit, this.score);
          this.ui.drawRoundEnd(this.roundWinner, this.stateTick, this.koLine);
        }
        break;
      case CONST.STATES.FIGHT_WIN: {
        const isBull = this.currentOpponentIndex >= OPPONENT_DATA.length;
        const name = isBull ? 'EL TORO' : OPPONENT_DATA[this.currentOpponentIndex].name;
        this.ui.drawFightWin(name, this.stateTick, this.score, this.winLine, this.koWinLine);
        break;
      }
      case CONST.STATES.FIGHT_LOSE:
        if (this.player && this.opponent) {
          this.renderer.drawFightScene(this.player, this.opponent, this.tick);
          this.renderer.ctx.fillStyle = 'rgba(0,0,0,0.5)';
          this.renderer.ctx.fillRect(0, 0, this.renderer.W, this.renderer.H);
          this.renderer.drawCenteredText(CONST.TEXT.LOSE_LINES[0], 100, CONST.COLORS.RED, 2);
        }
        break;
      case CONST.STATES.CONTINUE_SCREEN:
        this.ui.drawContinueScreen(this.continueTimeLeft, this.arcade.credits, this.tick, this.score); break;
      case CONST.STATES.GAME_OVER:
        this.ui.drawGameOver(this.stateTick, this.score); break;
      case CONST.STATES.VICTORY:
        this.ui.drawVictory(this.stateTick, this.score); break;
      case CONST.STATES.NAME_ENTRY:
        this.ui.drawNameEntry(this.nameEntry, this.score, this.stateTick, this.tick); break;
      case CONST.STATES.OPERATOR:
        this.ui.drawOperatorScreen(this.arcade.getStats()); break;
    }
    this.renderer.drawGuaroSplashOverlay(this.tick);
    if (this.renderer.irisWipe) this.renderer.updateIrisWipe();
  }
}

window.addEventListener('DOMContentLoaded', () => { window.game = new Game(); });
