class Player {
  constructor() { this.reset(); }

  reset() {
    this.health = CONST.PLAYER.MAX_HEALTH;
    this.stamina = CONST.PLAYER.MAX_STAMINA;
    this.guaro = 0;
    this.state = 'idle';
    this.punchPhase = null; // 'windup' | 'active' | 'recovery'
    this.stateTimer = 0;
    this.animFrame = 0;
    this.animTimer = 0;
    this.invincible = false;
    this.swayOffset = 0;
    this.swayDir = 1;
    this.combo = 0;
    this.roundsWon = 0;
    this.lastPunchSide = null;
    this.sameSideCount = 0;
    this.rampage = false;
    this.rampageTimer = 0;
    this.guaroOverflowHits = 0;
    this.rampageSway = 0;
    this._punchSide = null; // 'left' | 'right' | 'special'
    this.comboLinkSide = null;
    this.comboLinkTimer = 0;
  }

  resetRound() {
    this.health = CONST.PLAYER.MAX_HEALTH;
    this.stamina = CONST.PLAYER.MAX_STAMINA;
    this.state = 'idle';
    this.punchPhase = null;
    this.stateTimer = 0;
    this.combo = 0;
    this.rampage = false;
    this.rampageTimer = 0;
    this.guaroOverflowHits = 0;
    this._punchSide = null;
    this.comboLinkSide = null;
    this.comboLinkTimer = 0;
    this.invincible = false;
    this.lastPunchSide = null;
    this.sameSideCount = 0;
  }

  _clearComboLink() {
    this.comboLinkSide = null;
    this.comboLinkTimer = 0;
  }

  _endRampage() {
    this.rampage = false;
    this.rampageTimer = 0;
    this.guaroOverflowHits = 0;
    this.guaro = 0;
  }

  _punchPhaseActiveFrames() {
    return this.rampage ? CONST.PLAYER.RAMPAGE_PUNCH_ACTIVE : CONST.PLAYER.PUNCH_ACTIVE;
  }

  _punchPhaseRecoveryFrames() {
    return this.rampage ? CONST.PLAYER.RAMPAGE_PUNCH_RECOVERY : CONST.PLAYER.PUNCH_RECOVERY;
  }

  _punchPhaseWindupFrames() {
    return this.rampage ? CONST.PLAYER.RAMPAGE_PUNCH_WINDUP : CONST.PLAYER.PUNCH_WINDUP;
  }

  _windedIfOutOfStamina() {
    if (this.stamina > 0 || this.rampage) return;
    this.state = 'winded';
    this.punchPhase = null;
    this._punchSide = null;
    this.stateTimer = CONST.PLAYER.WINDED_DURATION;
  }

  openComboLink() {
    if (this._punchSide !== 'left' && this._punchSide !== 'right') return;
    this.comboLinkSide = this._punchSide === 'left' ? 'right' : 'left';
    this.comboLinkTimer = CONST.PLAYER.COMBO_LINK_FRAMES;
  }

  _punchStaminaCost() {
    return this.rampage
      ? Math.floor(CONST.PLAYER.PUNCH_STAMINA_COST * CONST.PLAYER.RAMPAGE_STAMINA_COST_MULT)
      : CONST.PLAYER.PUNCH_STAMINA_COST;
  }

  _tryComboLink(input) {
    // Only allow links during recovery so we never skip a mid-active swing hit.
    if (this.punchPhase !== 'recovery') return false;
    if (this.comboLinkTimer <= 0 || !this.comboLinkSide) return false;
    const side = this.comboLinkSide;
    const pressed = (side === 'left' && input.punchLeft) || (side === 'right' && input.punchRight);
    if (!pressed) return false;

    const staminaCost = this._punchStaminaCost();
    if (this.stamina < staminaCost) return false;

    this.stamina -= staminaCost;
    if (this.lastPunchSide === side) this.sameSideCount++;
    else { this.sameSideCount = 0; this.lastPunchSide = side; }
    this._startChainPunch(side);
    this._windedIfOutOfStamina();
    return true;
  }

  _startChainPunch(side) {
    this._clearComboLink();
    this._punchSide = side;
    this.punchPhase = 'active';
    this.animFrame = 0;
    this.animTimer = 0;
    this.state = side === 'left' ? 'punch_left' : 'punch_right';
    this.stateTimer = this._punchPhaseActiveFrames();
    // Signal Game to allow this chain swing to register a new hit.
    this._newSwing = true;
  }

  update(input) {
    if (this.comboLinkTimer > 0) this.comboLinkTimer--;

    const swaySpeed = this.rampage ? 0.12 : 0.04;
    const swayMax = this.rampage ? CONST.PLAYER.RAMPAGE_SWAY_INTENSITY : 1.5;
    this.swayOffset += swaySpeed * this.swayDir;
    if (Math.abs(this.swayOffset) > swayMax) this.swayDir *= -1;

    if (this.rampage) {
      this.rampageTimer--;
      this.rampageSway = Math.sin(this.rampageTimer * 0.3) * 2;
      if (this.rampageTimer <= 0) this._endRampage();
    }

    const staminaRegen = this.rampage ? CONST.PLAYER.STAMINA_REGEN * 2.5 : CONST.PLAYER.STAMINA_REGEN;
    if (this.state === 'idle' || this.state === 'block') {
      this.stamina = Math.min(CONST.PLAYER.MAX_STAMINA, this.stamina + staminaRegen);
    }

    this.animTimer++;
    if (this.animTimer >= 14) { this.animTimer = 0; this.animFrame = (this.animFrame + 1) % 2; }

    // Handle ongoing state timer
    if (this.stateTimer > 0) {
      this.stateTimer--;

      if (this._tryComboLink(input)) return;

      // Punch phase transitions
      if (this.stateTimer <= 0 && this.punchPhase) {
        if (this.punchPhase === 'windup') {
          this.punchPhase = 'active';
          this.animFrame = 0;
          this.animTimer = 0;
          if (this._punchSide === 'special') {
            this.state = 'special';
            this.stateTimer = CONST.PLAYER.SPECIAL_ACTIVE;
          } else {
            this.state = this._punchSide === 'left' ? 'punch_left' : 'punch_right';
            this.stateTimer = this._punchPhaseActiveFrames();
          }
          return;
        }
        if (this.punchPhase === 'active') {
          this.punchPhase = 'recovery';
          this.state = 'recovery';
          if (this._punchSide === 'special') {
            this.stateTimer = CONST.PLAYER.SPECIAL_RECOVERY;
          } else {
            this.stateTimer = this._punchPhaseRecoveryFrames();
          }
          return;
        }
        if (this.punchPhase === 'recovery') {
          this.punchPhase = null;
          this._punchSide = null;
          this.state = 'idle';
          return;
        }
      }

      if (this.stateTimer <= 0) {
        if (this.state === 'ko') return;
        if (this.state === 'dodge_left' || this.state === 'dodge_right' || this.state === 'duck') this.invincible = false;
        this.state = 'idle';
        this.punchPhase = null;
        this._punchSide = null;
      }
      return;
    }

    if (this.state === 'ko' || this.state === 'winded') return;

    // Special attack (Zarpe)
    if (input.special && this.guaro >= CONST.PLAYER.MAX_GUARO) {
      this._startPunch('special');
      this.guaro = 0;
      return;
    }

    const staminaCost = this._punchStaminaCost();

    if (input.punchLeft && this.stamina >= staminaCost) {
      this.stamina -= staminaCost;
      if (this.lastPunchSide === 'left') this.sameSideCount++; else { this.sameSideCount = 0; this.lastPunchSide = 'left'; }
      this._startPunch('left');
      this._windedIfOutOfStamina();
      return;
    }
    if (input.punchRight && this.stamina >= staminaCost) {
      this.stamina -= staminaCost;
      if (this.lastPunchSide === 'right') this.sameSideCount++; else { this.sameSideCount = 0; this.lastPunchSide = 'right'; }
      this._startPunch('right');
      this._windedIfOutOfStamina();
      return;
    }

    if (input.left) { this.state = 'dodge_left'; this.stateTimer = CONST.PLAYER.DODGE_FRAMES; this.invincible = true; return; }
    if (input.right) { this.state = 'dodge_right'; this.stateTimer = CONST.PLAYER.DODGE_FRAMES; this.invincible = true; return; }
    if (input.down) { this.state = 'duck'; this.stateTimer = CONST.PLAYER.DODGE_FRAMES; this.invincible = true; return; }
    if (input.up) { this.state = 'block'; return; }
    this.state = 'idle';
  }

  _startPunch(side) {
    this._clearComboLink();
    this._punchSide = side;
    this.punchPhase = 'windup';
    this.animFrame = 0;
    this.animTimer = 0;
    if (side === 'special') {
      this.state = 'windup_left';
      this.stateTimer = CONST.PLAYER.SPECIAL_WINDUP;
    } else {
      this.state = side === 'left' ? 'windup_left' : 'windup_right';
      this.stateTimer = this._punchPhaseWindupFrames();
    }
  }

  takeHit(damage) {
    if (Runtime.isTestMode()) return false;
    if (this.invincible) return false;
    if (this.state === 'dodge_left' || this.state === 'dodge_right' || this.state === 'duck') return false;

    // Getting hit during wind-up: take EXTRA damage (punished for committing)
    if (this.punchPhase === 'windup') {
      damage = Math.floor(damage * (CONST.PLAYER.WINDUP_PUNISH_MULT || 1.12));
    }
    if (this.state === 'block') damage = Math.floor(damage * CONST.PLAYER.BLOCK_DAMAGE_MULT);
    if (this.rampage) {
      damage = Math.floor(damage * 0.7);
      this._endRampage();
    }

    this.health = Math.max(0, this.health - damage);
    this.state = 'hurt'; this.stateTimer = CONST.PLAYER.HURT_DURATION; this.combo = 0;
    this.punchPhase = null; this._punchSide = null;
    this._clearComboLink();
    if (this.health <= 0) { this.state = 'ko'; this.stateTimer = 90; }
    return true;
  }

  /**
   * Chip damage while blocking — applies health/stamina/KO without the hurt interrupt.
   * Still cancels rampage and clears combo like a real hit.
   */
  takeChip(damage) {
    if (Runtime.isTestMode()) return false;
    damage = Math.max(0, Math.floor(damage));
    if (damage <= 0) return false;
    if (this.rampage) this._endRampage();
    this.health = Math.max(0, this.health - damage);
    this.stamina = Math.max(0, this.stamina - (CONST.PLAYER.CHIP_STAMINA_DAMAGE || 5));
    this.combo = 0;
    this._clearComboLink();
    if (this.health <= 0) {
      this.state = 'ko';
      this.stateTimer = 90;
      this.punchPhase = null;
      this._punchSide = null;
    }
    return true;
  }

  consumeNewSwing() {
    if (!this._newSwing) return false;
    this._newSwing = false;
    return true;
  }

  landedHit() {
    this.combo++;
    if (this.rampage) return;
    this.guaro = Math.min(CONST.PLAYER.MAX_GUARO, this.guaro + CONST.PLAYER.GUARO_PER_HIT);
    if (this.guaro >= CONST.PLAYER.MAX_GUARO) {
      this.guaroOverflowHits++;
      if (this.guaroOverflowHits >= CONST.PLAYER.GUARO_OVERFLOW_HITS) this.triggerRampage();
    }
  }

  triggerRampage() {
    this.rampage = true; this.rampageTimer = CONST.PLAYER.RAMPAGE_DURATION;
    this.guaroOverflowHits = 0; this.guaro = CONST.PLAYER.MAX_GUARO;
  }

  isPunching() {
    return this.punchPhase === 'active';
  }

  getPunchDamage() {
    const mult = this.rampage ? CONST.PLAYER.RAMPAGE_DAMAGE_MULT : 1;
    if (this._punchSide === 'special') return Math.floor(CONST.PLAYER.SPECIAL_DAMAGE * mult);
    let dmg = CONST.PLAYER.PUNCH_DAMAGE + Math.min(this.combo * 1.5, CONST.PLAYER.COMBO_DAMAGE_CAP);
    if (this.sameSideCount >= 3) dmg *= CONST.PLAYER.STALE_MOVE_PENALTY;
    return Math.floor(dmg * mult);
  }

  getPunchSide() {
    if (this._punchSide === 'left' || this._punchSide === 'special') return 'left';
    if (this._punchSide === 'right') return 'right';
    return null;
  }

  setVictory() { this.state = 'victory'; this.stateTimer = 0; }

  getAnimState() {
    switch (this.state) {
      case 'dodge_left': return 'dodge_left';
      case 'dodge_right': return 'dodge_right';
      case 'duck': return 'dodge_back';
      case 'windup_left': return 'windup_left';
      case 'windup_right': return 'windup_right';
      case 'punch_left': return 'punch_left';
      case 'punch_right': return 'punch_right';
      case 'special': return 'special';
      case 'recovery': return 'recovery';
      case 'block': return 'block';
      case 'hurt': case 'winded': return 'hurt';
      case 'ko': return 'ko';
      case 'victory': return 'victory';
      default: return 'idle';
    }
  }

  getDrawOffset() {
    const ry = this.rampage ? this.rampageSway : 0;
    switch (this.state) {
      case 'windup_left': return { x: -2, y: ry };
      case 'windup_right': return { x: 2, y: ry };
      default: return { x: 0, y: ry };
    }
  }

  isWindingUp() { return this.punchPhase === 'windup'; }
  isRecovering() { return this.punchPhase === 'recovery'; }
  isAlive() { return this.health > 0; }
  isKO() { return this.state === 'ko'; }
  canAct() { return this.state === 'idle' && this.stateTimer <= 0 && !this.punchPhase; }
}
