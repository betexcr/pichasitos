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
  }

  update(input) {
    const swaySpeed = this.rampage ? 0.12 : 0.04;
    const swayMax = this.rampage ? CONST.PLAYER.RAMPAGE_SWAY_INTENSITY : 1.5;
    this.swayOffset += swaySpeed * this.swayDir;
    if (Math.abs(this.swayOffset) > swayMax) this.swayDir *= -1;

    if (this.rampage) {
      this.rampageTimer--;
      this.rampageSway = Math.sin(this.rampageTimer * 0.3) * 2;
      if (this.rampageTimer <= 0) {
        this.rampage = false;
        this.guaroOverflowHits = 0;
        this.guaro = 0;
      }
    }

    const staminaRegen = this.rampage ? CONST.PLAYER.STAMINA_REGEN * 2.5 : CONST.PLAYER.STAMINA_REGEN;
    if (this.state === 'idle' || this.state === 'block') {
      this.stamina = Math.min(CONST.PLAYER.MAX_STAMINA, this.stamina + staminaRegen);
    }

    this.animTimer++;
    if (this.animTimer >= 8) { this.animTimer = 0; this.animFrame = (this.animFrame + 1) % 2; }

    // Handle ongoing state timer
    if (this.stateTimer > 0) {
      this.stateTimer--;

      // Punch phase transitions
      if (this.stateTimer <= 0 && this.punchPhase) {
        if (this.punchPhase === 'windup') {
          this.punchPhase = 'active';
          if (this._punchSide === 'special') {
            this.state = 'special';
            this.stateTimer = CONST.PLAYER.SPECIAL_ACTIVE;
          } else {
            this.state = this._punchSide === 'left' ? 'punch_left' : 'punch_right';
            this.stateTimer = this.rampage ? Math.max(2, CONST.PLAYER.PUNCH_ACTIVE - 1) : CONST.PLAYER.PUNCH_ACTIVE;
          }
          return;
        }
        if (this.punchPhase === 'active') {
          this.punchPhase = 'recovery';
          this.state = 'recovery';
          if (this._punchSide === 'special') {
            this.stateTimer = CONST.PLAYER.SPECIAL_RECOVERY;
          } else {
            this.stateTimer = this.rampage ? Math.max(3, CONST.PLAYER.PUNCH_RECOVERY - 2) : CONST.PLAYER.PUNCH_RECOVERY;
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

    const staminaCost = this.rampage
      ? Math.floor(CONST.PLAYER.PUNCH_STAMINA_COST * CONST.PLAYER.RAMPAGE_STAMINA_COST_MULT)
      : CONST.PLAYER.PUNCH_STAMINA_COST;

    if (input.punchLeft && this.stamina >= staminaCost) {
      this.stamina -= staminaCost;
      if (this.lastPunchSide === 'left') this.sameSideCount++; else { this.sameSideCount = 0; this.lastPunchSide = 'left'; }
      this._startPunch('left');
      if (this.stamina <= 0 && !this.rampage) { this.state = 'winded'; this.punchPhase = null; this._punchSide = null; this.stateTimer = CONST.PLAYER.WINDED_DURATION; }
      return;
    }
    if (input.punchRight && this.stamina >= staminaCost) {
      this.stamina -= staminaCost;
      if (this.lastPunchSide === 'right') this.sameSideCount++; else { this.sameSideCount = 0; this.lastPunchSide = 'right'; }
      this._startPunch('right');
      if (this.stamina <= 0 && !this.rampage) { this.state = 'winded'; this.punchPhase = null; this._punchSide = null; this.stateTimer = CONST.PLAYER.WINDED_DURATION; }
      return;
    }

    if (input.left) { this.state = 'dodge_left'; this.stateTimer = CONST.PLAYER.DODGE_FRAMES; this.invincible = true; return; }
    if (input.right) { this.state = 'dodge_right'; this.stateTimer = CONST.PLAYER.DODGE_FRAMES; this.invincible = true; return; }
    if (input.down) { this.state = 'duck'; this.stateTimer = CONST.PLAYER.DODGE_FRAMES; this.invincible = true; return; }
    if (input.up) { this.state = 'block'; return; }
    this.state = 'idle';
  }

  _startPunch(side) {
    this._punchSide = side;
    this.punchPhase = 'windup';
    if (side === 'special') {
      this.state = 'windup_left';
      this.stateTimer = CONST.PLAYER.SPECIAL_WINDUP;
    } else {
      this.state = side === 'left' ? 'windup_left' : 'windup_right';
      this.stateTimer = this.rampage ? Math.max(2, CONST.PLAYER.PUNCH_WINDUP - 2) : CONST.PLAYER.PUNCH_WINDUP;
    }
  }

  takeHit(damage) {
    if (this.invincible) return false;
    if (this.state === 'dodge_left' || this.state === 'dodge_right' || this.state === 'duck') return false;

    // Getting hit during wind-up: take EXTRA damage (punished for committing)
    if (this.punchPhase === 'windup') damage = Math.floor(damage * 1.25);
    if (this.state === 'block') damage = Math.floor(damage * CONST.PLAYER.BLOCK_DAMAGE_MULT);
    if (this.rampage) { damage = Math.floor(damage * 0.7); this.rampage = false; this.rampageTimer = 0; this.guaroOverflowHits = 0; this.guaro = 0; }

    this.health = Math.max(0, this.health - damage);
    this.state = 'hurt'; this.stateTimer = CONST.PLAYER.HURT_DURATION; this.combo = 0;
    this.punchPhase = null; this._punchSide = null;
    if (this.health <= 0) { this.state = 'ko'; this.stateTimer = 90; }
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

  getAnimState() {
    switch (this.state) {
      case 'windup_left': return 'windup_left';
      case 'windup_right': return 'windup_right';
      case 'punch_left': return 'punch_left';
      case 'punch_right': return 'punch_right';
      case 'special': return 'special';
      case 'recovery': return 'recovery';
      case 'block': return 'block';
      case 'hurt': case 'winded': return 'hurt';
      case 'ko': return 'ko';
      default: return 'idle';
    }
  }

  getDrawOffset() {
    const ry = this.rampage ? this.rampageSway : 0;
    switch (this.state) {
      case 'dodge_left': return { x: -20, y: ry };
      case 'dodge_right': return { x: 20, y: ry };
      case 'duck': return { x: 0, y: 15 };
      case 'windup_left': return { x: -2, y: ry };
      case 'windup_right': return { x: 2, y: ry };
      default: return { x: this.swayOffset, y: ry };
    }
  }

  isWindingUp() { return this.punchPhase === 'windup'; }
  isRecovering() { return this.punchPhase === 'recovery'; }
  isAlive() { return this.health > 0; }
  isKO() { return this.state === 'ko'; }
  canAct() { return this.state === 'idle' && this.stateTimer <= 0 && !this.punchPhase; }
}
