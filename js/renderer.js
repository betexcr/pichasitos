class Renderer {
  static _hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  constructor(canvas) {
    this.canvas = canvas || document.getElementById('game');
    this.canvas.width = CONST.WIDTH;
    this.canvas.height = CONST.HEIGHT;
    this.W = CONST.WIDTH;
    this.H = CONST.HEIGHT;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.glowCanvas = document.getElementById('glow');
    if (this.glowCanvas) {
      this.glowCanvas.width = CONST.WIDTH;
      this.glowCanvas.height = CONST.HEIGHT;
      try {
        this.glowCtx = this.glowCanvas.getContext('2d');
      } catch (e) {
        this.glowCtx = null;
      }
    }
    this.screenWrap = document.getElementById('screen-wrap');

    this.sprites = new SpriteSystem();

    this.screenShakeX = 0;
    this.screenShakeY = 0;
    this.screenShakeTimer = 0;
    this.screenShakeIntensity = 0;

    this.particles = [];
    this.flashAlpha = 0;
    this.flashColor = CONST.COLORS.WHITE;

    this.hitFlashTimer = 0;
    this.oppHitFlashTimer = 0;
    this.damageNumbers = [];
    this.comboCount = 0;
    this.comboTimer = 0;
    this.crowdExcitement = 0;

    this.irisWipe = null;
    this.hitStop = 0;

    this._impactStar = null;
    this._sweatDrops = [];

    this.lowHealthPulse = 0;
    this._prevPlayerHealth = -1;
    this._prevOppHealth = -1;
    this._healthFlashTimer = 0;
    this._oppHealthFlashTimer = 0;
    this._healthFlashPct = 0;
    this._oppHealthFlashPct = 0;

    this._stars = [];
    for (let i = 0; i < 65; i++) {
      this._stars.push({
        x: Math.random() * CONST.WIDTH,
        y: Math.random() * 58,
        twinkle: Math.random() * Math.PI * 2,
        size: Math.random() < 0.15 ? 3 : Math.random() < 0.35 ? 2 : 1,
        brightness: 0.5 + Math.random() * 0.5,
      });
    }

    this._clouds = [];
    for (let i = 0; i < 4; i++) {
      this._clouds.push({
        x: Math.random() * CONST.WIDTH,
        y: 10 + Math.random() * 30,
        w: 16 + Math.random() * 20,
        speed: 0.01 + Math.random() * 0.02,
      });
    }

    this._dustMotes = [];
    for (let i = 0; i < 20; i++) {
      this._dustMotes.push({
        x: Math.random() * CONST.WIDTH,
        y: 145 + Math.random() * 70,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.05 - Math.random() * 0.1,
        alpha: 0.15 + Math.random() * 0.2,
        size: 1,
        phase: Math.random() * Math.PI * 2,
      });
    }

    this._shootingStar = null;
    this._shootingStarCooldown = 200 + Math.floor(Math.random() * 400);

    this._fireflies = [];
    for (let i = 0; i < 12; i++) {
      this._fireflies.push({
        x: Math.random() * CONST.WIDTH,
        y: 60 + Math.random() * 80,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.08,
        phase: Math.random() * Math.PI * 2,
        brightness: 0,
        targetBrightness: 0,
        blinkTimer: Math.floor(Math.random() * 120),
        color: Math.random() < 0.7 ? '#FFE87C' : (Math.random() < 0.5 ? '#BFFF00' : '#FFA500'),
      });
    }

    this._speedLines = [];
    this._impactFrame = 0;

    this._guaroSplash = 0;
    this._guaroSplashMax = 90;

    const shirtColors = ['#C41E3A','#0047AB','#EAA221','#228B22','#CC5500','#FFF','#FF69B4','#800080','#FF6347','#4682B4','#8B4513','#DAA520'];
    const hatTypes = ['none','none','none','cap','sombrero','none','none','cap'];
    const skins = [CONST.COLORS.SKIN_LIGHT, CONST.COLORS.SKIN_MEDIUM, CONST.COLORS.SKIN_DARK];
    this._crowdSeeds = [];
    for (let row = 0; row < 2; row++) {
      const count = row === 0 ? 30 : 22;
      for (let i = 0; i < count; i++) {
        this._crowdSeeds.push({
          x: (i / count) * CONST.WIDTH + (Math.random() - 0.5) * 6,
          y: (row === 0 ? 80 : 74) + Math.random() * 8,
          row: row,
          height: 6 + Math.floor(Math.random() * 4),
          color: shirtColors[Math.floor(Math.random() * shirtColors.length)],
          skin: skins[Math.floor(Math.random() * skins.length)],
          phase: Math.random() * Math.PI * 2,
          waving: Math.random() < 0.2,
          hat: hatTypes[Math.floor(Math.random() * hatTypes.length)],
          hatColor: shirtColors[Math.floor(Math.random() * shirtColors.length)],
          holdingBeer: Math.random() < 0.15,
        });
      }
    }

    this._dirtDetails = [];
    for (let i = 0; i < 20; i++) {
      this._dirtDetails.push({
        x: Math.random() * CONST.WIDTH,
        y: 145 + Math.random() * (CONST.HEIGHT - 150),
        type: Math.random() < 0.4 ? 'speck' : Math.random() < 0.7 ? 'scuff' : 'footprint',
        size: 1 + Math.floor(Math.random() * 3),
      });
    }

    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  _resize() {
    const isTouch = document.body.classList.contains('touch-device');
    const touchPad = isTouch ? 180 : 0;
    const touchTop = isTouch ? 44 : 0;
    const availH = window.innerHeight - touchPad - touchTop;
    const scaleX = window.innerWidth / CONST.WIDTH;
    const scaleY = availH / CONST.HEIGHT;
    const scale = Math.max(1, Math.min(scaleX, scaleY));
    const w = Math.floor(CONST.WIDTH * scale);
    const h = Math.floor(CONST.HEIGHT * scale);
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.canvas.style.imageRendering = 'pixelated';
    if (this.screenWrap) {
      this.screenWrap.style.width = w + 'px';
      this.screenWrap.style.height = h + 'px';
      if (isTouch) {
        this.screenWrap.style.marginTop = touchTop + 'px';
      } else {
        this.screenWrap.style.marginTop = '';
      }
    }
  }

  postProcess() {
    if (this.glowCtx) {
      try {
        this.glowCtx.clearRect(0, 0, CONST.WIDTH, CONST.HEIGHT);
        this.glowCtx.globalCompositeOperation = 'source-over';
        this.glowCtx.drawImage(this.canvas, 0, 0);
        this.glowCtx.globalCompositeOperation = 'lighter';
        this.glowCtx.globalAlpha = 0.07;
        this.glowCtx.drawImage(this.canvas, -1, 0);
        this.glowCtx.drawImage(this.canvas, 1, 0);
        this.glowCtx.drawImage(this.canvas, 0, -1);
        this.glowCtx.drawImage(this.canvas, 0, 1);
        this.glowCtx.globalAlpha = 1;
        this.glowCtx.globalCompositeOperation = 'source-over';
      } catch (e) {
        this.glowCtx = null;
      }
    }

    if (this._impactFrame > 0) {
      const c = this.ctx;
      c.fillStyle = `rgba(255,255,255,${this._impactFrame * 0.04})`;
      c.fillRect(0, 0, CONST.WIDTH, CONST.HEIGHT);
      this._impactFrame--;
    }
  }

  // ── Sarchi Decorative Patterns ──

  drawSarchiRosette(x, y, size) {
    const c = this.ctx;
    const colors = [CONST.COLORS.RED, CONST.COLORS.BLUE, CONST.COLORS.YELLOW, CONST.COLORS.GREEN, CONST.COLORS.ORANGE];
    const s = Math.max(2, Math.floor(size));
    const ps = Math.max(1, Math.floor(s / 4));

    c.fillStyle = CONST.COLORS.DARK_BROWN;
    c.beginPath();
    c.arc(x, y, s + 1, 0, Math.PI * 2);
    c.fill();

    const petals = 8;
    for (let i = 0; i < petals; i++) {
      const angle = (i / petals) * Math.PI * 2;
      const pSize = i % 2 === 0 ? ps * 2 : Math.max(1, Math.floor(ps * 1.4));
      const dist = i % 2 === 0 ? s : s * 0.85;
      const px = x + Math.round(Math.cos(angle) * dist);
      const py = y + Math.round(Math.sin(angle) * dist);
      c.fillStyle = colors[i % colors.length];
      c.fillRect(px - Math.floor(pSize/2), py - Math.floor(pSize/2), pSize, pSize);
      c.fillStyle = 'rgba(255,255,255,0.2)';
      c.fillRect(px - Math.floor(pSize/2), py - Math.floor(pSize/2), pSize, 1);
    }

    for (let i = 0; i < petals; i++) {
      const angle = (i / petals) * Math.PI * 2 + Math.PI / petals;
      const px = x + Math.round(Math.cos(angle) * s * 0.55);
      const py = y + Math.round(Math.sin(angle) * s * 0.55);
      c.fillStyle = colors[(i + 2) % colors.length];
      c.fillRect(px - 1, py - 1, ps + 1, ps + 1);
    }

    c.fillStyle = CONST.COLORS.GOLD;
    const cps = Math.max(2, ps * 2);
    c.fillRect(x - Math.floor(cps/2), y - Math.floor(cps/2), cps, cps);
    c.fillStyle = 'rgba(255,255,255,0.35)';
    c.fillRect(x - Math.floor(cps/2), y - Math.floor(cps/2), cps, 1);
  }

  drawSarchiBorder(x, y, w, h) {
    if (arguments.length === 0) { x = 0; y = 0; w = CONST.WIDTH; h = CONST.HEIGHT; }
    const c = this.ctx;
    const colors = [CONST.COLORS.RED, CONST.COLORS.BLUE, CONST.COLORS.YELLOW, CONST.COLORS.GREEN, CONST.COLORS.ORANGE];
    const t = 3;

    c.fillStyle = CONST.COLORS.DARK_BROWN;
    c.fillRect(x, y, w, t);
    c.fillRect(x, y + h - t, w, t);
    c.fillRect(x, y, t, h);
    c.fillRect(x + w - t, y, t, h);

    for (let i = 0; i < w; i += 6) {
      c.fillStyle = colors[Math.floor(i / 6) % colors.length];
      const seg = Math.min(6, w - i);
      c.fillRect(x + i, y + 1, seg, 1);
      c.fillRect(x + i, y + h - 2, seg, 1);
    }
    for (let i = 0; i < h; i += 6) {
      c.fillStyle = colors[Math.floor(i / 6) % colors.length];
      const seg = Math.min(6, h - i);
      c.fillRect(x + 1, y + i, 1, seg);
      c.fillRect(x + w - 2, y + i, 1, seg);
    }

    const diamondSpacing = 24;
    for (let dx = x + 12; dx < x + w - 12; dx += diamondSpacing) {
      this._drawDiamond(c, dx, y + 1, colors[Math.floor(dx / diamondSpacing) % colors.length]);
      this._drawDiamond(c, dx, y + h - 2, colors[(Math.floor(dx / diamondSpacing) + 1) % colors.length]);
    }

    this.drawSarchiRosette(x + 7, y + 7, 5);
    this.drawSarchiRosette(x + w - 8, y + 7, 5);
    this.drawSarchiRosette(x + 7, y + h - 8, 5);
    this.drawSarchiRosette(x + w - 8, y + h - 8, 5);
  }

  _drawDiamond(c, cx, cy, color) {
    c.fillStyle = color;
    c.fillRect(cx, cy - 1, 1, 1);
    c.fillRect(cx - 1, cy, 3, 1);
    c.fillRect(cx, cy + 1, 1, 1);
  }

  drawSarchiStripe(x, y, w) {
    const c = this.ctx;
    const colors = [CONST.COLORS.RED, CONST.COLORS.ORANGE, CONST.COLORS.YELLOW, CONST.COLORS.GREEN, CONST.COLORS.BLUE];
    const segW = Math.max(1, Math.floor(w / colors.length));
    const h = 5;
    for (let i = 0; i < colors.length; i++) {
      c.fillStyle = colors[i];
      c.fillRect(x + i * segW, y, segW, h);
      c.fillStyle = 'rgba(255,255,255,0.18)';
      c.fillRect(x + i * segW, y, segW, 1);
      c.fillStyle = 'rgba(0,0,0,0.12)';
      c.fillRect(x + i * segW, y + h - 1, segW, 1);
    }
  }

  // ── Arena ──

  drawArena(tick) {
    const c = this.ctx;
    const W = CONST.WIDTH;

    const grad = c.createLinearGradient(0, 0, 0, 100);
    grad.addColorStop(0, '#030310');
    grad.addColorStop(0.3, '#060620');
    grad.addColorStop(0.6, '#0A0A2E');
    grad.addColorStop(0.85, '#111144');
    grad.addColorStop(1, '#181850');
    c.fillStyle = grad;
    c.fillRect(0, 0, W, 100);

    const milkyWayAlpha = 0.02;
    c.fillStyle = `rgba(120,130,180,${milkyWayAlpha})`;
    c.beginPath();
    c.moveTo(0, 30);
    c.quadraticCurveTo(W * 0.3, 10, W * 0.5, 25);
    c.quadraticCurveTo(W * 0.7, 40, W, 20);
    c.lineTo(W, 35);
    c.quadraticCurveTo(W * 0.7, 55, W * 0.5, 40);
    c.quadraticCurveTo(W * 0.3, 25, 0, 45);
    c.fill();

    const starParallax = Math.sin(tick * 0.003) * 2;
    for (const star of this._stars) {
      const twinkle = Math.sin(star.twinkle + tick * 0.05) * 0.4 + 0.6;
      const a = twinkle * star.brightness;
      const sx = Math.floor(star.x + starParallax * 0.3);
      const sy = Math.floor(star.y);
      c.fillStyle = `rgba(255,255,255,${a})`;
      c.fillRect(sx, sy, star.size, star.size);
      if (star.size >= 3) {
        c.fillStyle = `rgba(255,255,220,${a * 0.35})`;
        c.fillRect(sx - 1, sy, star.size + 2, star.size);
        c.fillRect(sx, sy - 1, star.size, star.size + 2);
        c.fillStyle = `rgba(200,220,255,${a * 0.12})`;
        c.fillRect(sx - 2, sy - 1, star.size + 4, star.size + 2);
        c.fillRect(sx - 1, sy - 2, star.size + 2, star.size + 4);
      } else if (star.size === 2) {
        c.fillStyle = `rgba(255,255,240,${a * 0.2})`;
        c.fillRect(sx - 1, sy, star.size + 2, star.size);
        c.fillRect(sx, sy - 1, star.size, star.size + 2);
      }
    }

    this._drawMoon(c, tick);
    this._drawShootingStar(c, tick);

    const cloudParallax = Math.sin(tick * 0.003) * 4;
    for (const cloud of this._clouds) {
      const cx = ((cloud.x + tick * cloud.speed + cloudParallax) % (W + cloud.w)) - cloud.w/2;
      const cFloor = Math.floor(cx);
      c.fillStyle = 'rgba(25,25,70,0.25)';
      c.fillRect(cFloor + 2, cloud.y - 3, cloud.w - 4, 2);
      c.fillStyle = 'rgba(30,30,80,0.38)';
      c.fillRect(cFloor, cloud.y, cloud.w, 3);
      c.fillRect(cFloor + 3, cloud.y - 2, cloud.w - 6, 2);
      c.fillRect(cFloor + 2, cloud.y + 3, cloud.w - 4, 2);
      c.fillStyle = 'rgba(40,40,100,0.15)';
      c.fillRect(cFloor + 4, cloud.y + 5, cloud.w - 8, 1);
    }

    this._drawFireflies(c, tick);
    this._drawStringLights(c, tick);
    this._drawBanners(c, tick);
    this._drawCrowd(c, tick);
    this._drawFence(c, tick);

    const dirtGrad = c.createLinearGradient(0, 140, 0, CONST.HEIGHT);
    dirtGrad.addColorStop(0, '#B89868');
    dirtGrad.addColorStop(0.15, '#B09060');
    dirtGrad.addColorStop(0.4, CONST.COLORS.DIRT);
    dirtGrad.addColorStop(0.8, CONST.COLORS.DIRT_DARK);
    dirtGrad.addColorStop(1, '#6A5035');
    c.fillStyle = dirtGrad;
    c.fillRect(0, 140, W, CONST.HEIGHT - 140);

    c.fillStyle = 'rgba(0,0,0,0.06)';
    const centerGrad = c.createRadialGradient(W/2, 190, 10, W/2, 190, 80);
    centerGrad.addColorStop(0, 'rgba(90,60,30,0.12)');
    centerGrad.addColorStop(1, 'rgba(90,60,30,0)');
    c.fillStyle = centerGrad;
    c.fillRect(0, 142, W, CONST.HEIGHT - 142);

    c.strokeStyle = 'rgba(120,80,50,0.2)';
    c.lineWidth = 1;
    c.beginPath();
    c.ellipse(W/2, 210, 90, 18, 0, 0, Math.PI * 2);
    c.stroke();
    c.strokeStyle = 'rgba(140,100,60,0.12)';
    c.beginPath();
    c.ellipse(W/2, 210, 95, 20, 0, 0, Math.PI * 2);
    c.stroke();

    for (const d of this._dirtDetails) {
      if (d.type === 'speck') {
        c.fillStyle = CONST.COLORS.DIRT_DARK;
        c.fillRect(Math.floor(d.x), Math.floor(d.y), d.size, 1);
      } else if (d.type === 'footprint') {
        c.fillStyle = 'rgba(90,60,30,0.25)';
        c.fillRect(Math.floor(d.x), Math.floor(d.y), 2, 4);
        c.fillRect(Math.floor(d.x) + 3, Math.floor(d.y) + 1, 2, 4);
        c.fillStyle = 'rgba(90,60,30,0.15)';
        c.fillRect(Math.floor(d.x), Math.floor(d.y) + 4, 5, 1);
      } else {
        c.fillStyle = 'rgba(100,70,40,0.3)';
        c.fillRect(Math.floor(d.x), Math.floor(d.y), d.size + 1, d.size);
      }
    }

    this._drawStringLightPools(c, tick);
    this._drawDustMotes(c, tick);

    c.fillStyle = CONST.COLORS.DIRT_DARK;
    c.fillRect(0, 140, W, 1);
    c.fillStyle = '#B09060';
    c.fillRect(0, 141, W, 1);
  }

  _drawMoon(c, tick) {
    const mx = 38, my = 18, mr = 10;
    const pulse = Math.sin(tick * 0.008) * 0.02;

    c.fillStyle = `rgba(180,200,255,${0.02 + pulse})`;
    c.beginPath();
    c.arc(mx, my, mr + 22, 0, Math.PI * 2);
    c.fill();

    c.fillStyle = `rgba(200,220,255,${0.04 + pulse})`;
    c.beginPath();
    c.arc(mx, my, mr + 14, 0, Math.PI * 2);
    c.fill();

    c.fillStyle = 'rgba(255,253,232,0.06)';
    c.beginPath();
    c.arc(mx, my, mr + 9, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = 'rgba(255,253,232,0.14)';
    c.beginPath();
    c.arc(mx, my, mr + 4, 0, Math.PI * 2);
    c.fill();

    c.fillStyle = '#FFFDE8';
    c.beginPath();
    c.arc(mx, my, mr, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#FFFFF4';
    c.beginPath();
    c.arc(mx - 2, my - 2, mr - 3, 0, Math.PI * 2);
    c.fill();

    c.fillStyle = '#DDD8B0';
    c.fillRect(mx - 3, my - 2, 3, 2);
    c.fillRect(mx + 2, my + 3, 2, 2);
    c.fillRect(mx - 1, my + 1, 2, 1);
    c.fillRect(mx + 4, my - 1, 1, 1);

    c.globalAlpha = 0.03 + pulse;
    c.fillStyle = '#C8D8FF';
    const beamW = 35;
    c.beginPath();
    c.moveTo(mx - 2, my + mr);
    c.lineTo(mx - beamW, 95);
    c.lineTo(mx + beamW, 95);
    c.lineTo(mx + 2, my + mr);
    c.fill();
    c.globalAlpha = 1;
  }

  _drawShootingStar(c, tick) {
    this._shootingStarCooldown--;
    if (this._shootingStarCooldown <= 0 && !this._shootingStar) {
      this._shootingStar = {
        x: Math.random() * CONST.WIDTH * 0.6 + CONST.WIDTH * 0.2,
        y: 5 + Math.random() * 20,
        vx: 2.5 + Math.random() * 2,
        vy: 0.8 + Math.random() * 0.6,
        life: 18 + Math.floor(Math.random() * 12),
        maxLife: 30,
        trail: [],
      };
      this._shootingStarCooldown = 300 + Math.floor(Math.random() * 500);
    }
    if (!this._shootingStar) return;
    const s = this._shootingStar;
    s.trail.push({ x: s.x, y: s.y });
    if (s.trail.length > 10) s.trail.shift();
    s.x += s.vx;
    s.y += s.vy;
    s.life--;

    for (let i = 0; i < s.trail.length; i++) {
      const t = s.trail[i];
      const a = (i / s.trail.length) * (s.life / s.maxLife) * 0.6;
      const w = 1 + (i / s.trail.length);
      c.fillStyle = `rgba(255,255,240,${a})`;
      c.fillRect(Math.floor(t.x), Math.floor(t.y), Math.ceil(w), 1);
    }
    const headA = Math.min(1, s.life / s.maxLife);
    c.fillStyle = `rgba(255,255,255,${headA})`;
    c.fillRect(Math.floor(s.x), Math.floor(s.y), 2, 1);
    c.fillStyle = `rgba(255,255,200,${headA * 0.4})`;
    c.fillRect(Math.floor(s.x) - 1, Math.floor(s.y), 4, 1);

    if (s.life <= 0) this._shootingStar = null;
  }

  _drawFireflies(c, tick) {
    for (const f of this._fireflies) {
      f.blinkTimer--;
      if (f.blinkTimer <= 0) {
        f.targetBrightness = f.targetBrightness > 0.1 ? 0 : (0.3 + Math.random() * 0.5);
        f.blinkTimer = 40 + Math.floor(Math.random() * 100);
      }
      f.brightness += (f.targetBrightness - f.brightness) * 0.08;

      f.x += f.vx + Math.sin(tick * 0.01 + f.phase) * 0.06;
      f.y += f.vy + Math.cos(tick * 0.012 + f.phase) * 0.04;
      if (f.x < -5) f.x = CONST.WIDTH + 4;
      if (f.x > CONST.WIDTH + 5) f.x = -4;
      if (f.y < 55) f.vy += 0.01;
      if (f.y > 138) f.vy -= 0.01;
      f.vx += (Math.random() - 0.5) * 0.005;
      f.vy += (Math.random() - 0.5) * 0.005;
      f.vx *= 0.99;
      f.vy *= 0.99;

      if (f.brightness > 0.02) {
        const px = Math.floor(f.x);
        const py = Math.floor(f.y);
        c.fillStyle = `rgba(255,255,200,${f.brightness * 0.15})`;
        c.fillRect(px - 2, py - 2, 5, 5);
        c.fillStyle = f.color;
        c.globalAlpha = f.brightness;
        c.fillRect(px, py, 1, 1);
        c.globalAlpha = 1;
      }
    }
  }

  _drawDustMotes(c, tick) {
    for (const m of this._dustMotes) {
      m.x += m.vx + Math.sin(tick * 0.02 + m.phase) * 0.05;
      m.y += m.vy;
      if (m.y < 142) { m.y = 215; m.x = Math.random() * CONST.WIDTH; }
      if (m.x < -2) m.x = CONST.WIDTH + 1;
      if (m.x > CONST.WIDTH + 2) m.x = -1;
      const a = m.alpha * (0.7 + Math.sin(tick * 0.03 + m.phase) * 0.3);
      c.fillStyle = `rgba(200,180,140,${a})`;
      c.fillRect(Math.floor(m.x), Math.floor(m.y), m.size, m.size);
    }
  }

  _drawStringLightPools(c, tick) {
    const bulbColors = [CONST.COLORS.RED, CONST.COLORS.YELLOW, CONST.COLORS.GREEN, CONST.COLORS.BLUE, CONST.COLORS.ORANGE];
    for (let i = 0; i < 22; i++) {
      const bx = i * 12 + 3;
      const glow = Math.sin(tick * 0.08 + i * 0.7) > 0.2;
      if (!glow) continue;
      const col = bulbColors[i % bulbColors.length];
      const groundY = 148 + Math.sin(i * 1.3) * 4;
      c.fillStyle = Renderer._hexToRgba(col, 0.04);
      c.fillRect(bx - 5, groundY, 12, 8);
      c.fillStyle = Renderer._hexToRgba(col, 0.025);
      c.fillRect(bx - 8, groundY + 2, 18, 6);
    }
  }

  _drawStringLights(c, tick) {
    const bulbColors = [CONST.COLORS.RED, CONST.COLORS.YELLOW, CONST.COLORS.GREEN, CONST.COLORS.BLUE, CONST.COLORS.ORANGE];
    c.strokeStyle = '#333';
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(0, 60);
    for (let x = 0; x <= CONST.WIDTH; x += 4) {
      c.lineTo(x, 58 + Math.sin(x * 0.04) * 4);
    }
    c.stroke();
    for (let i = 0; i < 22; i++) {
      const bx = i * 12 + 3;
      const by = 58 + Math.sin(bx * 0.04) * 4;
      const glow = Math.sin(tick * 0.08 + i * 0.7) > 0.2;
      const col = bulbColors[i % bulbColors.length];
      if (glow) {
        c.fillStyle = Renderer._hexToRgba(col, 0.08);
        c.fillRect(bx - 5, by - 4, 11, 11);
        c.fillStyle = Renderer._hexToRgba(col, 0.18);
        c.fillRect(bx - 3, by - 2, 7, 7);
        c.fillStyle = Renderer._hexToRgba(col, 0.3);
        c.fillRect(bx - 2, by - 1, 5, 5);
      }
      c.fillStyle = glow ? col : CONST.COLORS.DARK_GRAY;
      c.fillRect(bx - 1, by, 3, 3);
      if (glow) {
        c.fillStyle = 'rgba(255,255,255,0.6)';
        c.fillRect(bx, by, 1, 1);
        c.fillStyle = 'rgba(255,255,255,0.25)';
        c.fillRect(bx - 1, by, 1, 1);
      }
    }
  }

  _drawBanners(c, tick) {
    const bannerColors = [CONST.COLORS.RED, CONST.COLORS.BLUE, CONST.COLORS.YELLOW, CONST.COLORS.GREEN, CONST.COLORS.ORANGE, '#FF69B4'];
    for (let i = 0; i < 9; i++) {
      const bx = 6 + i * 28;
      const sway = Math.sin(tick * 0.03 + i * 0.8) * 1.5;
      const by = 64 + sway;
      const bw = 20;
      const bh = 12;
      const col = bannerColors[i % bannerColors.length];
      c.fillStyle = col;
      c.fillRect(bx, by, bw, bh);
      c.fillRect(bx + 2, by + bh, bw - 4, 2);
      c.fillRect(bx + 4, by + bh + 2, bw - 8, 2);
      c.fillRect(bx + 6, by + bh + 4, bw - 12, 1);

      c.fillStyle = 'rgba(255,255,255,0.45)';
      c.fillRect(bx + 3, by + 2, 2, 2);
      c.fillRect(bx + bw - 5, by + 2, 2, 2);
      c.fillStyle = 'rgba(255,255,255,0.3)';
      c.fillRect(bx + Math.floor(bw/2) - 1, by + 4, 2, 3);

      c.fillStyle = 'rgba(255,255,255,0.15)';
      c.fillRect(bx, by, bw, 1);
      c.fillStyle = 'rgba(0,0,0,0.18)';
      c.fillRect(bx, by + bh - 1, bw, 1);

      const fringeCount = Math.floor(bw / 3);
      for (let f = 0; f < fringeCount; f++) {
        const fx = bx + 1 + f * 3;
        const fLen = 2 + Math.floor(Math.sin(tick * 0.04 + f + i * 2) + 1);
        c.fillStyle = col;
        c.fillRect(fx, by + bh + 4, 1, fLen);
      }
    }
  }

  _drawCrowd(c, tick) {
    const exc = this.crowdExcitement || 0;
    const sorted = [...this._crowdSeeds].sort((a, b) => a.y - b.y);
    for (const person of sorted) {
      const speed = 0.06 + exc * 0.08;
      const amp = (person.row === 0 ? 2 : 1.2) + exc * 2.5;
      const bounce = Math.sin(tick * speed + person.phase) * amp;
      const py = person.y + bounce;
      const h = person.height;
      const alpha = person.row === 1 ? 0.65 : 1;
      c.globalAlpha = alpha;

      c.fillStyle = 'rgba(0,0,0,0.12)';
      c.fillRect(person.x - 2, py + h + 1, 5, 2);

      c.fillStyle = person.color;
      c.fillRect(person.x - 3, py, 6, h);
      c.fillStyle = 'rgba(255,255,255,0.08)';
      c.fillRect(person.x - 3, py, 6, 1);
      c.fillStyle = 'rgba(0,0,0,0.18)';
      c.fillRect(person.x - 3, py + h - 1, 6, 1);

      c.fillStyle = person.skin;
      c.fillRect(person.x - 2, py - 4, 4, 5);
      c.fillStyle = 'rgba(255,255,255,0.12)';
      c.fillRect(person.x - 2, py - 4, 4, 1);
      c.fillStyle = 'rgba(0,0,0,0.35)';
      c.fillRect(person.x - 1, py - 2, 1, 1);
      c.fillRect(person.x + 1, py - 2, 1, 1);
      c.fillStyle = person.skin;
      c.fillRect(person.x, py - 1, 1, 1);

      if (person.hat === 'cap') {
        c.fillStyle = person.hatColor;
        c.fillRect(person.x - 3, py - 5, 6, 2);
        c.fillRect(person.x - 4, py - 4, 2, 1);
        c.fillStyle = 'rgba(0,0,0,0.1)';
        c.fillRect(person.x - 3, py - 4, 6, 1);
      } else if (person.hat === 'sombrero') {
        c.fillStyle = person.hatColor;
        c.fillRect(person.x - 4, py - 5, 8, 2);
        c.fillRect(person.x - 2, py - 7, 4, 2);
        c.fillStyle = 'rgba(255,255,255,0.12)';
        c.fillRect(person.x - 4, py - 5, 8, 1);
      }

      if (exc > 0.5 && person.waving) {
        const armWave = Math.sin(tick * 0.18 + person.phase) * 4;
        c.fillStyle = person.skin;
        c.fillRect(person.x + 3, py - 6 + armWave, 2, 2);
        c.fillRect(person.x + 4, py - 7 + armWave, 1, 1);
        c.fillRect(person.x - 4, py - 5 - Math.abs(armWave * 0.5), 2, 2);
      } else if (person.waving) {
        const armY = py - 2 + Math.sin(tick * 0.12 + person.phase) * 3;
        c.fillStyle = person.skin;
        c.fillRect(person.x + 3, armY, 2, 2);
        c.fillRect(person.x + 4, armY - 1, 1, 1);
      }

      if (person.holdingBeer) {
        c.fillStyle = CONST.COLORS.YELLOW;
        c.fillRect(person.x - 4, py + 1, 2, 3);
        c.fillStyle = CONST.COLORS.CREAM;
        c.fillRect(person.x - 4, py, 2, 1);
        if (exc > 0.3) {
          const splash = Math.sin(tick * 0.15 + person.phase);
          if (splash > 0.8) {
            c.fillStyle = 'rgba(255,253,208,0.5)';
            c.fillRect(person.x - 5, py - 1, 1, 1);
            c.fillRect(person.x - 3, py - 1, 1, 1);
          }
        }
      }

      if (!person._hasPhone) person._hasPhone = Math.random() < 0.08;
      if (person._hasPhone && exc > 0.4) {
        const flash = Math.sin(tick * 0.3 + person.phase * 7) > 0.92;
        if (flash) {
          c.fillStyle = 'rgba(255,255,255,0.9)';
          c.fillRect(person.x - 1, py - 6, 2, 2);
          c.fillStyle = 'rgba(255,255,255,0.3)';
          c.fillRect(person.x - 3, py - 8, 6, 6);
        } else {
          c.fillStyle = 'rgba(100,150,255,0.4)';
          c.fillRect(person.x - 1, py - 5, 2, 2);
        }
      }
    }
    c.globalAlpha = 1;
  }

  _drawFence(c, tick) {
    const fenceY = 95;
    const W = CONST.WIDTH;
    c.fillStyle = CONST.COLORS.FENCE_WOOD;
    c.fillRect(0, fenceY, W, 45);

    c.fillStyle = 'rgba(0,0,0,0.05)';
    for (let gy = fenceY + 3; gy < fenceY + 43; gy += 3) {
      c.fillRect(0, gy, W, 1);
    }
    c.fillStyle = 'rgba(255,220,160,0.06)';
    for (let gy = fenceY + 5; gy < fenceY + 43; gy += 5) {
      c.fillRect(0, gy, W, 1);
    }
    c.fillStyle = 'rgba(180,140,90,0.08)';
    for (let gy = fenceY + 7; gy < fenceY + 40; gy += 8) {
      c.fillRect(0, gy, W, 1);
    }

    c.fillStyle = CONST.COLORS.BROWN;
    c.fillRect(0, fenceY, W, 2);
    c.fillRect(0, fenceY + 43, W, 2);
    c.fillStyle = 'rgba(255,220,160,0.22)';
    c.fillRect(0, fenceY + 2, W, 1);
    c.fillStyle = 'rgba(0,0,0,0.1)';
    c.fillRect(0, fenceY + 44, W, 1);

    const panelW = 32;
    const colors = [CONST.COLORS.RED, CONST.COLORS.BLUE, CONST.COLORS.YELLOW, CONST.COLORS.GREEN, CONST.COLORS.ORANGE];
    for (let i = 0; i <= W; i += panelW) {
      c.fillStyle = CONST.COLORS.DARK_BROWN;
      c.fillRect(i, fenceY, 3, 45);
      c.fillStyle = 'rgba(255,220,160,0.18)';
      c.fillRect(i + 1, fenceY, 1, 45);
      c.fillStyle = 'rgba(0,0,0,0.12)';
      c.fillRect(i + 2, fenceY, 1, 45);

      const px = i + 3;
      const pw = Math.min(panelW - 5, W - px);
      if (pw <= 0) continue;
      const ci = Math.floor(i / panelW);

      for (let s = 0; s < 3; s++) {
        c.fillStyle = colors[(ci + s) % colors.length];
        c.fillRect(px, fenceY + 4 + s * 14, pw, 2);
        c.fillStyle = Renderer._hexToRgba(colors[(ci + s + 2) % colors.length], 0.25);
        c.fillRect(px, fenceY + 6 + s * 14, pw, 1);
        c.fillStyle = 'rgba(255,255,255,0.1)';
        c.fillRect(px, fenceY + 4 + s * 14, pw, 1);
      }

      if (ci % 3 === 0) {
        c.fillStyle = 'rgba(0,0,0,0.1)';
        c.fillRect(px + 4, fenceY + 10, 3, 8);
        c.fillRect(px + pw - 8, fenceY + 28, 4, 5);
      }
      if (ci % 2 === 1) {
        c.fillStyle = 'rgba(60,40,20,0.12)';
        c.fillRect(px + 2, fenceY + 16, pw - 4, 1);
      }
      if (ci % 4 === 2 && pw > 8) {
        c.fillStyle = 'rgba(80,50,25,0.15)';
        c.beginPath();
        c.arc(px + pw / 2, fenceY + 30, 2, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = 'rgba(60,35,15,0.1)';
        c.beginPath();
        c.arc(px + pw / 2, fenceY + 30, 3, 0, Math.PI * 2);
        c.fill();
      }

      if (pw > 10) {
        this.drawSarchiRosette(i + panelW / 2, fenceY + 22, 6);
      }

      this._drawTorch(c, i + 1, fenceY - 8, tick + i * 17);

      const flicker = Math.sin((tick + i * 17) * 0.3) * 0.5 + Math.sin((tick + i * 17) * 0.47) * 0.3;
      const torchGlow = 0.04 + flicker * 0.015;
      c.fillStyle = `rgba(255,140,0,${torchGlow})`;
      c.fillRect(i - 4, fenceY, 10, 20);
      c.fillStyle = `rgba(255,180,60,${torchGlow * 0.5})`;
      c.fillRect(i - 8, fenceY, 18, 30);
    }
  }

  _drawTorch(c, x, y, tick) {
    c.fillStyle = CONST.COLORS.DARK_BROWN;
    c.fillRect(x, y + 4, 2, 6);
    const flicker = Math.sin(tick * 0.3) * 0.5 + Math.sin(tick * 0.47) * 0.3;
    const h = 3 + Math.floor(flicker + 1);
    c.fillStyle = '#FF8C00';
    c.fillRect(x - 1, y + 3 - h, 4, h);
    c.fillStyle = '#FFCC00';
    c.fillRect(x, y + 2 - h, 2, Math.max(1, h - 1));
    c.fillStyle = '#FFF8E0';
    c.fillRect(x, y + 1 - h, 1, 1);
    c.fillStyle = `rgba(255,140,0,${0.08 + flicker * 0.03})`;
    c.fillRect(x - 5, y - h - 2, 12, h + 8);
    if (Math.random() < 0.08) {
      this.particles.push({
        x: x + 1, y: y + 1 - h,
        vx: (Math.random() - 0.5) * 0.3, vy: -0.3 - Math.random() * 0.4,
        life: 10 + Math.floor(Math.random() * 10), maxLife: 20,
        color: Math.random() < 0.5 ? '#FF8C00' : '#FFCC00',
        size: 1, shape: 'square', isRosette: false,
      });
    }
  }

  // ── HUD ──

  drawHUD(player, opponent, timer, round, circuit, score) {
    const c = this.ctx;
    const W = CONST.WIDTH;
    const tick = Date.now() * 0.06;

    if (this._prevPlayerHealth > 0 && player.health < this._prevPlayerHealth) {
      this._healthFlashPct = this._prevPlayerHealth / CONST.PLAYER.MAX_HEALTH;
      this._healthFlashTimer = 12;
    }
    if (this._prevOppHealth > 0 && opponent.health < this._prevOppHealth) {
      this._oppHealthFlashPct = this._prevOppHealth / opponent.maxHealth;
      this._oppHealthFlashTimer = 12;
    }
    this._prevPlayerHealth = player.health;
    this._prevOppHealth = opponent.health;

    c.fillStyle = '#000';
    c.fillRect(0, 0, W, 30);
    c.fillStyle = '#181818';
    c.fillRect(0, 30, W, 1);

    c.fillStyle = CONST.COLORS.WHITE;
    this._drawText('JUGADOR', 4, 1, 'left', 0.7);
    const oppName = (opponent.data ? opponent.data.name : 'RIVAL').toUpperCase();
    c.fillStyle = CONST.COLORS.WHITE;
    this._drawText(oppName, W - 4, 1, 'right', 0.7);

    c.fillStyle = '#111';
    c.fillRect(W / 2 - 18, 0, 36, 20);
    c.fillStyle = '#222';
    c.fillRect(W / 2 - 19, 0, 1, 20);
    c.fillRect(W / 2 + 18, 0, 1, 20);
    c.fillRect(W / 2 - 18, 20, 37, 1);
    const timeStr = String(Math.ceil(Math.max(0, timer))).padStart(2, '0');
    c.fillStyle = CONST.COLORS.WHITE;
    this._drawText(timeStr, W / 2, 3, 'center', 2);

    const barW = 72, barH = 5, barY = 10;
    this._drawPOBar(c, 4, barY, barW, barH, player.health / CONST.PLAYER.MAX_HEALTH, '#30D050', this._healthFlashTimer > 0 ? this._healthFlashPct : 0);
    this._drawPOBar(c, W - 4 - barW, barY, barW, barH, opponent.health / opponent.maxHealth, '#E03030', this._oppHealthFlashTimer > 0 ? this._oppHealthFlashPct : 0);
    if (this._healthFlashTimer > 0) this._healthFlashTimer--;
    if (this._oppHealthFlashTimer > 0) this._oppHealthFlashTimer--;

    const maxHearts = 10;
    const filledHearts = Math.ceil((player.stamina / CONST.PLAYER.MAX_STAMINA) * maxHearts);
    for (let i = 0; i < maxHearts; i++) {
      const hx = 4 + i * 6;
      const hy = 19;
      if (i < filledHearts) {
        c.fillStyle = '#FF4080';
        c.fillRect(hx, hy, 2, 1);
        c.fillRect(hx + 3, hy, 2, 1);
        c.fillRect(hx, hy + 1, 5, 1);
        c.fillRect(hx + 1, hy + 2, 3, 1);
        c.fillRect(hx + 2, hy + 3, 1, 1);
      } else {
        c.fillStyle = '#333';
        c.fillRect(hx, hy, 2, 1);
        c.fillRect(hx + 3, hy, 2, 1);
        c.fillRect(hx, hy + 1, 5, 1);
        c.fillRect(hx + 1, hy + 2, 3, 1);
        c.fillRect(hx + 2, hy + 3, 1, 1);
      }
    }

    const maxStars = 5;
    const guaroPct = player.guaro / CONST.PLAYER.MAX_GUARO;
    const filledStars = Math.floor(guaroPct * maxStars);
    for (let i = 0; i < maxStars; i++) {
      const sx = 4 + i * 8;
      const sy = 25;
      const filled = i < filledStars;
      c.fillStyle = filled ? '#FFD700' : '#333';
      c.fillRect(sx + 2, sy, 1, 1);
      c.fillRect(sx, sy + 1, 5, 1);
      c.fillRect(sx + 1, sy + 2, 3, 1);
      c.fillRect(sx, sy + 3, 2, 1);
      c.fillRect(sx + 3, sy + 3, 2, 1);
      if (filled && Math.sin(tick * 0.15 + i) > 0.7) {
        c.fillStyle = 'rgba(255,255,200,0.5)';
        c.fillRect(sx, sy, 5, 4);
      }
    }

    c.fillStyle = '#888';
    this._drawText('R' + round, W / 2, 22, 'center', 0.8);

    if (score !== undefined) {
      c.fillStyle = CONST.COLORS.WHITE;
      this._drawText(String(score), W - 4, 22, 'right', 0.8);
    }

    let flashMsg = null;
    if (player.rampage) flashMsg = CONST.TEXT.DEMASIADO_GUARO;
    else if (player.guaro >= CONST.PLAYER.MAX_GUARO) {
      const srl = CONST.TEXT.SPECIAL_READY_LINES || [CONST.TEXT.SPECIAL_READY];
      flashMsg = srl[Math.floor(tick * 0.01) % srl.length];
    }
    else if (player.health < 25) {
      const hll = CONST.TEXT.HEALTH_LOW_LINES || [CONST.TEXT.HEALTH_LOW];
      flashMsg = hll[Math.floor(tick * 0.008) % hll.length];
    }

    if (flashMsg) {
      if (flashMsg === CONST.TEXT.DEMASIADO_GUARO) {
        const scale = 1.4 + Math.sin(tick * 0.2) * 0.2;
        const fireCols = [CONST.COLORS.GOLD, CONST.COLORS.ORANGE, CONST.COLORS.RED, CONST.COLORS.YELLOW];
        const fc = fireCols[Math.floor(tick * 0.15) % fireCols.length];
        c.fillStyle = fc;
        this._drawText(flashMsg, W / 2, 38, 'center', scale);
      } else if (flashMsg === CONST.TEXT.SPECIAL_READY) {
        c.fillStyle = CONST.COLORS.NEON_CYAN;
        this._drawText(flashMsg, W / 2, 38, 'center', 1.2);
      } else if (flashMsg === CONST.TEXT.HEALTH_LOW) {
        c.fillStyle = CONST.COLORS.RED;
        this._drawText(flashMsg, W / 2, 38, 'center', 1.2 + Math.sin(tick * 0.3) * 0.1);
      }
    }

    if (this.comboCount >= 3 && this.comboTimer > 0) {
      const cs = 1.2 + Math.min(this.comboCount - 3, 5) * 0.15;
      const comboColors = [CONST.COLORS.YELLOW, CONST.COLORS.GOLD, CONST.COLORS.ORANGE, CONST.COLORS.RED];
      const ci = Math.min(this.comboCount - 3, comboColors.length - 1);
      c.fillStyle = comboColors[ci];
      const comboShake = this.comboTimer > 20 ? Math.sin(tick * 0.4) * 2 : 0;
      this._drawText(this.comboCount + ' COMBO!', 4 + comboShake, 50, 'left', cs);
      this.comboTimer--;
    }

    const healthPct = player.health / CONST.PLAYER.MAX_HEALTH;
    if (healthPct < 0.25 && healthPct > 0) {
      const pulse = 0.12 + Math.sin(tick * 0.2) * 0.06;
      const vigGrad = c.createRadialGradient(W / 2, CONST.HEIGHT / 2, W * 0.3, W / 2, CONST.HEIGHT / 2, W * 0.65);
      vigGrad.addColorStop(0, 'rgba(180,0,0,0)');
      vigGrad.addColorStop(1, `rgba(180,0,0,${pulse})`);
      c.fillStyle = vigGrad;
      c.fillRect(0, 0, W, CONST.HEIGHT);
    }
  }

  _drawPOBar(c, x, y, w, h, pct, color, flashPct) {
    pct = Math.max(0, Math.min(1, pct));
    c.fillStyle = '#1A1A1A';
    c.fillRect(x, y, w, h);
    c.fillStyle = '#111';
    c.fillRect(x, y, w, 1);
    c.fillStyle = '#222';
    c.fillRect(x, y + h - 1, w, 1);
    if (flashPct > 0) {
      c.fillStyle = '#FFF';
      c.globalAlpha = 0.5;
      c.fillRect(x + 1, y + 1, Math.floor((w - 2) * flashPct), h - 2);
      c.globalAlpha = 1;
    }
    c.fillStyle = color;
    const barFill = Math.floor((w - 2) * pct);
    c.fillRect(x + 1, y + 1, barFill, h - 2);
    c.fillStyle = 'rgba(255,255,255,0.2)';
    c.fillRect(x + 1, y + 1, barFill, 1);
    c.fillStyle = '#444';
    c.fillRect(x - 1, y, 1, h);
    c.fillRect(x + w, y, 1, h);
  }

  _drawBeerBar(c, x, y, w, h, val, max, color, isLeft, flashPct) {
    c.fillStyle = CONST.COLORS.DARK_BROWN;
    c.fillRect(x - 1, y - 1, w + 2, h + 2);
    c.fillStyle = CONST.COLORS.BROWN;
    c.fillRect(x, y, w, h);

    const handleX = isLeft ? x + w : x - 3;
    c.fillStyle = CONST.COLORS.DARK_BROWN;
    c.fillRect(handleX, y + 2, 3, h - 4);
    c.fillStyle = CONST.COLORS.BROWN;
    c.fillRect(handleX + 1, y + 3, 1, h - 6);

    const pct = Math.max(0, val / max);
    const fillW = Math.floor((w - 4) * pct);

    if (flashPct && flashPct > pct) {
      const flashW = Math.floor((w - 4) * flashPct);
      c.fillStyle = 'rgba(255,255,255,0.7)';
      if (isLeft) {
        c.fillRect(x + 2, y + 2, flashW, h - 4);
      } else {
        c.fillRect(x + w - 2 - flashW, y + 2, flashW, h - 4);
      }
    }

    c.fillStyle = color;
    if (isLeft) {
      c.fillRect(x + 2, y + 2, fillW, h - 4);
    } else {
      c.fillRect(x + w - 2 - fillW, y + 2, fillW, h - 4);
    }

    c.fillStyle = 'rgba(255,255,255,0.3)';
    c.fillRect(x + 2, y + 2, w - 4, 1);
    c.fillStyle = 'rgba(255,255,255,0.12)';
    c.fillRect(x + 2, y + 3, w - 4, 1);

    if (pct > 0.05) {
      const foamX = isLeft ? x + 2 + fillW - 4 : x + w - 2 - fillW;
      const tick = Date.now() * 0.05;
      c.fillStyle = CONST.COLORS.CREAM;
      c.fillRect(foamX, y + 1, 4, 2);
      c.fillRect(foamX + 1, y, 2, 1);
      const bobble1 = Math.sin(tick * 1.2) > 0.5 ? 1 : 0;
      const bobble2 = Math.sin(tick * 0.9 + 1.5) > 0.4 ? 1 : 0;
      c.fillStyle = '#FFF';
      c.fillRect(foamX + bobble1, y + 1, 1, 1);
      c.fillRect(foamX + 3 - bobble2, y + 1, 1, 1);
    }

    c.fillStyle = 'rgba(0,0,0,0.15)';
    c.fillRect(x + 2, y + h - 2, w - 4, 1);
  }

  _drawGuaroMeter(c, player, tick) {
    const gx = 4;
    const gy = 27;
    const gw = 56;
    const gh = 6;
    const guaroPct = player.guaro / CONST.PLAYER.MAX_GUARO;

    c.fillStyle = '#1A1A1A';
    c.fillRect(gx - 1, gy - 1, gw + 2, gh + 2);

    c.fillStyle = '#2A2A2A';
    c.fillRect(gx + Math.floor(gw*0.35), gy - 4, Math.floor(gw*0.3), 3);
    c.fillRect(gx + Math.floor(gw*0.38), gy - 6, Math.floor(gw*0.24), 2);
    c.fillStyle = '#222';
    c.fillRect(gx + Math.floor(gw*0.4), gy - 7, Math.floor(gw*0.2), 1);

    c.fillStyle = CONST.COLORS.DARK_GRAY;
    c.fillRect(gx, gy, gw, gh);

    if (player.rampage) {
      const fireCols = [CONST.COLORS.GOLD, CONST.COLORS.ORANGE, CONST.COLORS.RED, CONST.COLORS.YELLOW];
      c.fillStyle = fireCols[Math.floor(tick * 0.2) % fireCols.length];
      c.fillRect(gx, gy, gw, gh);
    } else {
      c.fillStyle = CONST.COLORS.ORANGE;
      const fw = Math.floor(gw * guaroPct);
      c.fillRect(gx, gy, fw, gh);
      c.fillStyle = 'rgba(255,255,255,0.2)';
      c.fillRect(gx, gy, fw, 1);
    }

    if (player.guaro >= CONST.PLAYER.MAX_GUARO && !player.rampage) {
      const pulse = Math.sin(tick * 0.3) * 0.25 + 0.25;
      c.fillStyle = `rgba(255,165,0,${pulse})`;
      c.fillRect(gx - 2, gy - 2, gw + 4, gh + 4);
      const maxPips = CONST.PLAYER.GUARO_OVERFLOW_HITS;
      const hits = player.guaroOverflowHits;
      for (let i = 0; i < maxPips; i++) {
        const pipX = gx + gw + 3 + i * 5;
        if (i < hits) {
          const shake = Math.sin(tick * 0.4 + i) * 1;
          c.fillStyle = CONST.COLORS.RED;
          c.fillRect(pipX, gy + shake, 3, 3);
        } else {
          c.fillStyle = CONST.COLORS.DARK_GRAY;
          c.fillRect(pipX, gy, 3, 3);
        }
      }
    }

    c.fillStyle = CONST.COLORS.ORANGE;
    this._drawText('G', gx - 1, gy - 2, 'left', 0.6);
  }

  // ── Fight Scene ──

  drawFightScene(player, opponent, tick) {
    const c = this.ctx;

    c.save();
    if (this.screenShakeTimer > 0) {
      this.screenShakeTimer--;
      this.screenShakeX = (Math.random() - 0.5) * this.screenShakeIntensity * 2;
      this.screenShakeY = (Math.random() - 0.5) * this.screenShakeIntensity * 2;
      this.screenShakeIntensity *= 0.9;
      c.translate(this.screenShakeX, this.screenShakeY);
    } else {
      this.screenShakeX = 0;
      this.screenShakeY = 0;
    }

    this.drawArena(tick);

    const oppX = CONST.WIDTH / 2 + opponent.swayOffset;
    const oppY = 100;
    const oppScale = 3;
    const oppData = opponent.data;
    const oppAnim = opponent.getAnimState();

    if (opponent.state === 'tell') {
      const isSig = opponent.currentPattern && opponent.currentPattern.type === 'signature';
      const tellColor = isSig ? (oppData.accentColor || CONST.COLORS.ORANGE) : CONST.COLORS.YELLOW;
      const pulse = Math.sin(tick * 0.4) * 0.15 + 0.15;
      c.globalAlpha = pulse;
      c.fillStyle = tellColor;
      c.fillRect(oppX - 35, oppY - 25, 70, 90);
      c.globalAlpha = 1;

      if (isSig) {
        const lineCount = 6;
        for (let i = 0; i < lineCount; i++) {
          const angle = (i / lineCount) * Math.PI * 2 + tick * 0.15;
          const len = 20 + Math.sin(tick * 0.3 + i) * 8;
          const sx = oppX + Math.cos(angle) * 15;
          const sy = oppY + 30 + Math.sin(angle) * 20;
          const ex = oppX + Math.cos(angle) * (15 + len);
          const ey = oppY + 30 + Math.sin(angle) * (20 + len * 0.6);
          c.globalAlpha = 0.35;
          c.strokeStyle = tellColor;
          c.lineWidth = 1;
          c.beginPath();
          c.moveTo(sx, sy);
          c.lineTo(ex, ey);
          c.stroke();
        }
        c.globalAlpha = 1;
      }

      const exclPulse = Math.sin(tick * 0.5) * 2;
      const exY = oppY - 26 + exclPulse;
      c.fillStyle = isSig ? CONST.COLORS.RED : CONST.COLORS.YELLOW;
      c.fillRect(oppX - 1, exY, 3, 6);
      c.fillRect(oppX - 1, exY + 8, 3, 2);
    }

    c.fillStyle = 'rgba(0,0,0,0.15)';
    c.beginPath();
    c.ellipse(oppX, oppY + 68, 22, 6, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = 'rgba(0,0,0,0.28)';
    c.beginPath();
    c.ellipse(oppX, oppY + 68, 16, 4, 0, 0, Math.PI * 2);
    c.fill();

    if (this.oppHitFlashTimer > 0) {
      const flashT = this.oppHitFlashTimer / 8;
      if (Math.floor(this.oppHitFlashTimer) % 2 === 0) {
        this.sprites.drawOpponent(c, oppData, oppAnim, opponent.animFrame, oppX, oppY, oppScale);
      }
      c.save();
      c.globalAlpha = Math.min(0.9, flashT * 0.8);
      c.globalCompositeOperation = 'lighter';
      this.sprites.drawOpponent(c, oppData, oppAnim, opponent.animFrame, oppX, oppY, oppScale);
      c.globalCompositeOperation = 'source-over';
      c.restore();
      this.oppHitFlashTimer--;
    } else {
      this.sprites.drawOpponent(c, oppData, oppAnim, opponent.animFrame, oppX, oppY, oppScale);
    }

    this._drawImpactStar(c);
    this._drawSweatDrops(c);

    if (opponent.state === 'block') {
      const blockPulse = Math.sin(tick * 0.35) * 0.08 + 0.12;
      c.fillStyle = `rgba(100,180,255,${blockPulse})`;
      c.beginPath();
      c.arc(oppX, oppY + 20, 18, 0, Math.PI * 2);
      c.fill();

      const crossX = oppX;
      const crossY = oppY + 15;
      c.strokeStyle = `rgba(180,220,255,${blockPulse * 2.5})`;
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(crossX - 10, crossY + 8);
      c.lineTo(crossX + 4, crossY - 8);
      c.stroke();
      c.beginPath();
      c.moveTo(crossX + 10, crossY + 8);
      c.lineTo(crossX - 4, crossY - 8);
      c.stroke();

      const sparkA = Math.sin(tick * 0.5) > 0.6 ? 0.5 : 0;
      if (sparkA > 0) {
        c.fillStyle = `rgba(255,255,255,${sparkA})`;
        const sx = crossX + Math.sin(tick * 0.7) * 12;
        const sy = crossY + Math.cos(tick * 0.6) * 8;
        c.fillRect(Math.floor(sx), Math.floor(sy), 1, 1);
        c.fillRect(Math.floor(sx) - 1, Math.floor(sy), 3, 1);
        c.fillRect(Math.floor(sx), Math.floor(sy) - 1, 1, 3);
      }
    }

    if (opponent.signaturePhraseTimer > 0 && opponent.signaturePhrase) {
      this._drawSignaturePhrase(c, opponent.signaturePhrase, oppX, oppY - 10, tick, opponent.signaturePhraseTimer);
    }

    if (opponent.signatureEffect && opponent.signatureEffectTimer > 0) {
      this._drawSignatureEffect(c, opponent.signatureEffect, oppX, oppY + 20, tick, oppScale);
    }

    const pOffset = player.getDrawOffset();
    const playerX = CONST.WIDTH / 2 + pOffset.x + player.swayOffset;
    const playerY = 178 + pOffset.y;

    c.fillStyle = 'rgba(0,0,0,0.12)';
    c.beginPath();
    c.ellipse(playerX, 202, 18, 5, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = 'rgba(0,0,0,0.22)';
    c.beginPath();
    c.ellipse(playerX, 202, 12, 3, 0, 0, Math.PI * 2);
    c.fill();

    if (player.rampage) {
      const auraAlpha = 0.15 + Math.sin(tick * 0.2) * 0.08;
      const auraCols = ['#FFD700', '#FF8C00', '#FF4500'];
      c.fillStyle = auraCols[Math.floor(tick * 0.15) % auraCols.length];
      c.globalAlpha = auraAlpha;
      c.beginPath();
      c.ellipse(playerX, playerY + 6, 20, 28, 0, 0, Math.PI * 2);
      c.fill();
      c.globalAlpha = 1;
    }

    if (this.hitFlashTimer > 0) {
      this.sprites.drawPlayer(c, player.getAnimState(), player.animFrame, playerX, playerY, 2);
      c.save();
      c.globalAlpha = Math.min(1, this.hitFlashTimer / 2);
      c.globalCompositeOperation = 'lighter';
      this.sprites.drawPlayer(c, player.getAnimState(), player.animFrame, playerX, playerY, 2);
      c.globalCompositeOperation = 'source-over';
      c.restore();
      this.hitFlashTimer--;
    } else {
      this.sprites.drawPlayer(c, player.getAnimState(), player.animFrame, playerX, playerY, 2);
    }

    this._drawSpeedLines(c, player, opponent, tick);
    this._updateParticles(c);
    this._updateDamageNumbers(c);

    if (player.rampage) {
      this._drawRampageEffects(c, player, tick);
    }

    if (player.guaro >= CONST.PLAYER.MAX_GUARO && !player.rampage && player.guaroOverflowHits >= CONST.PLAYER.GUARO_OVERFLOW_HITS - 2) {
      this._drawGuaroOverflowBuildup(c, player, tick);
    }

    c.restore();

    if (this.flashAlpha > 0) {
      c.fillStyle = this.flashColor;
      c.globalAlpha = this.flashAlpha;
      c.fillRect(0, 0, CONST.WIDTH, CONST.HEIGHT);
      c.globalAlpha = 1;
      this.flashAlpha -= 0.06;
      if (this.flashAlpha < 0) this.flashAlpha = 0;
    }

  }

  // ── Speed Lines ──

  _drawSpeedLines(c, player, opponent, tick) {
    const isPunching = player.state === 'punch_left' || player.state === 'punch_right' || player.state === 'special';
    const oppAttacking = opponent.state === 'attack' || opponent.state === 'signature';

    if (isPunching) {
      const cx = CONST.WIDTH / 2;
      const cy = 110;
      const lineCount = player.state === 'special' ? 16 : 8;
      for (let i = 0; i < lineCount; i++) {
        const angle = (i / lineCount) * Math.PI * 2 + tick * 0.5;
        const innerR = 25 + Math.sin(tick * 0.8 + i) * 5;
        const outerR = 60 + Math.sin(tick * 0.6 + i * 2) * 15;
        const sx = cx + Math.cos(angle) * innerR;
        const sy = cy + Math.sin(angle) * innerR * 0.5;
        const ex = cx + Math.cos(angle) * outerR;
        const ey = cy + Math.sin(angle) * outerR * 0.5;
        const alpha = player.state === 'special' ? 0.2 : 0.1;
        c.strokeStyle = `rgba(255,255,255,${alpha})`;
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(sx, sy);
        c.lineTo(ex, ey);
        c.stroke();
      }
    }

    if (oppAttacking) {
      const cx = CONST.WIDTH / 2;
      const cy = 90;
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + tick * 0.4;
        const innerR = 15;
        const outerR = 40 + Math.sin(tick * 0.5 + i * 1.5) * 10;
        const sx = cx + Math.cos(angle) * innerR;
        const sy = cy + Math.sin(angle) * innerR * 0.5;
        const ex = cx + Math.cos(angle) * outerR;
        const ey = cy + Math.sin(angle) * outerR * 0.5;
        c.strokeStyle = 'rgba(255,200,200,0.08)';
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(sx, sy);
        c.lineTo(ex, ey);
        c.stroke();
      }
    }
  }

  triggerImpactFrame(frames) {
    this._impactFrame = frames || 4;
  }

  drawGuaroSplashOverlay(tick) {
    this._drawGuaroSplash(this.ctx, tick);
  }

  triggerGuaroSplash() {
    this._guaroSplash = this._guaroSplashMax;
    this.addConfetti(CONST.WIDTH / 2, CONST.HEIGHT / 2, 35);
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const speed = 1.5 + Math.random() * 2;
      const cols = [CONST.COLORS.GOLD, CONST.COLORS.ORANGE, CONST.COLORS.YELLOW, CONST.COLORS.RED, CONST.COLORS.NEON_GREEN, CONST.COLORS.NEON_PINK];
      this.particles.push({
        x: CONST.WIDTH / 2, y: CONST.HEIGHT / 2 - 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 40 + Math.floor(Math.random() * 30),
        maxLife: 70,
        color: cols[Math.floor(Math.random() * cols.length)],
        size: 2,
        shape: 'star',
        isRosette: Math.random() < 0.15,
        bounce: true,
      });
    }
  }

  _drawGuaroSplash(c, tick) {
    if (this._guaroSplash <= 0) return;
    const t = this._guaroSplash;
    const max = this._guaroSplashMax;
    const elapsed = max - t;
    const W = CONST.WIDTH;
    const H = CONST.HEIGHT;

    const delay = 8;
    if (elapsed < delay) { this._guaroSplash--; return; }
    const effectElapsed = elapsed - delay;
    const effectMax = max - delay;
    const progress = effectElapsed / effectMax;

    const fadeIn = Math.min(1, effectElapsed / 6);
    const fadeOut = t < 15 ? t / 15 : 1;
    const alpha = fadeIn * fadeOut;
    if (alpha < 0.01) { this._guaroSplash--; return; }

    c.save();

    const overlayA = alpha * 0.15;
    const overlayCols = ['rgba(255,165,0,', 'rgba(255,215,0,', 'rgba(255,69,0,', 'rgba(255,255,0,'];
    c.fillStyle = overlayCols[Math.floor(tick * 0.2) % 4] + overlayA + ')';
    c.fillRect(0, 0, W, H);

    const rayCount = 16;
    const cx = W / 2;
    const cy = H / 2 - 10;
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2 + tick * 0.04;
      const len = 100 + Math.sin(tick * 0.15 + i) * 30;
      c.globalAlpha = alpha * 0.12;
      c.strokeStyle = i % 2 === 0 ? CONST.COLORS.GOLD : CONST.COLORS.ORANGE;
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(cx, cy);
      c.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len * 0.6);
      c.stroke();
    }
    c.globalAlpha = 1;

    if (progress < 0.5) {
      const ringProg = progress / 0.5;
      const ringR = ringProg * 80;
      const ringA = alpha * 0.3 * (1 - ringProg);
      c.strokeStyle = `rgba(255,215,0,${ringA})`;
      c.lineWidth = 3;
      c.beginPath();
      c.arc(cx, cy, ringR, 0, Math.PI * 2);
      c.stroke();
      c.strokeStyle = `rgba(255,165,0,${ringA * 0.6})`;
      c.lineWidth = 2;
      c.beginPath();
      c.arc(cx, cy, ringR * 0.7, 0, Math.PI * 2);
      c.stroke();
    }

    const textY = cy;
    const bounce = Math.sin(tick * 0.25) * 3 * alpha;
    const shake = effectElapsed < 10 ? (Math.random() - 0.5) * 6 : 0;
    const popScale = Math.min(1, effectElapsed / 5);
    const baseScale = 3 * popScale;
    const scale = baseScale + Math.sin(tick * 0.3) * 0.15;

    c.globalAlpha = alpha * 0.5;
    c.fillStyle = CONST.COLORS.BLACK;
    c.fillRect(0, textY - 6 + bounce, W, 28);
    c.globalAlpha = 1;

    const partyCols = [
      CONST.COLORS.GOLD, CONST.COLORS.ORANGE, CONST.COLORS.RED,
      CONST.COLORS.YELLOW, CONST.COLORS.NEON_GREEN, CONST.COLORS.NEON_PINK,
    ];

    const text = CONST.TEXT.DEMASIADO_GUARO;
    const charSpacing = scale > 0.1 ? 14 * (scale / 3) : 0;
    const totalW = text.length * charSpacing;
    const startX = cx - totalW / 2;

    c.globalAlpha = alpha;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === ' ') continue;
      const charBounce = Math.sin(tick * 0.3 + i * 0.5) * 3 * alpha;
      const charX = startX + i * charSpacing + charSpacing / 2 + shake;
      const charY = textY + bounce + charBounce;
      const col = partyCols[(i + Math.floor(tick * 0.15)) % partyCols.length];

      c.fillStyle = CONST.COLORS.BLACK;
      this._drawText(ch, charX + 2, charY + 2, 'center', scale);
      c.fillStyle = col;
      this._drawText(ch, charX, charY, 'center', scale);
    }

    const sparkleCount = 8;
    for (let i = 0; i < sparkleCount; i++) {
      const sx = cx + Math.sin(tick * 0.4 + i * 1.1) * (W * 0.4);
      const sy = textY + Math.cos(tick * 0.35 + i * 1.5) * 18;
      const sa = Math.sin(tick * 0.6 + i * 2) * 0.5 + 0.5;
      if (sa > 0.2) {
        c.globalAlpha = sa * alpha;
        c.fillStyle = '#FFF';
        c.fillRect(Math.floor(sx), Math.floor(sy), 1, 1);
        c.fillRect(Math.floor(sx) - 1, Math.floor(sy), 3, 1);
        c.fillRect(Math.floor(sx), Math.floor(sy) - 1, 1, 3);
      }
    }

    c.globalAlpha = 1;
    c.restore();
    this._guaroSplash--;
  }

  // ── Rampage Effects ──

  _drawRampageEffects(c, player, tick) {
    c.fillStyle = `rgba(255,215,0,${0.06 + Math.sin(tick * 0.1) * 0.04})`;
    c.fillRect(0, 0, CONST.WIDTH, CONST.HEIGHT);

    const borderW = 3;
    const fireCols = [CONST.COLORS.GOLD, CONST.COLORS.ORANGE, CONST.COLORS.RED, CONST.COLORS.YELLOW];
    for (let i = 0; i < borderW; i++) {
      c.fillStyle = fireCols[(Math.floor(tick * 0.3) + i) % fireCols.length];
      c.fillRect(0, i, CONST.WIDTH, 1);
      c.fillRect(0, CONST.HEIGHT - 1 - i, CONST.WIDTH, 1);
      c.fillRect(i, 0, 1, CONST.HEIGHT);
      c.fillRect(CONST.WIDTH - 1 - i, 0, 1, CONST.HEIGHT);
    }

    if (tick % 6 === 0) {
      this.particles.push({
        x: Math.random() * CONST.WIDTH,
        y: -2,
        vx: (Math.random() - 0.5) * 0.5,
        vy: 0.5 + Math.random() * 0.8,
        life: 80,
        maxLife: 80,
        color: fireCols[Math.floor(Math.random() * fireCols.length)],
        size: 2,
        isRosette: true,
      });
    }

    if (Math.sin(tick * 0.15) > 0.5) {
      const scale = 1.5 + Math.sin(tick * 0.25) * 0.2;
      c.save();
      c.fillStyle = CONST.COLORS.RED;
      this._drawText(CONST.TEXT.DEMASIADO_GUARO, CONST.WIDTH / 2, 44, 'center', scale);
      c.restore();
    }

    const line = CONST.TEXT.RAMPAGE_LINES[Math.floor(tick * 0.02) % CONST.TEXT.RAMPAGE_LINES.length];
    c.fillStyle = CONST.COLORS.GOLD;
    this._drawText(line, CONST.WIDTH / 2, CONST.HEIGHT - 22, 'center', 1);

    const pct = player.rampageTimer / CONST.PLAYER.RAMPAGE_DURATION;
    c.fillStyle = CONST.COLORS.DARK_GRAY;
    c.fillRect(CONST.WIDTH / 2 - 30, CONST.HEIGHT - 8, 60, 3);
    c.fillStyle = pct > 0.3 ? CONST.COLORS.GOLD : CONST.COLORS.RED;
    c.fillRect(CONST.WIDTH / 2 - 30, CONST.HEIGHT - 8, Math.floor(60 * pct), 3);
  }

  // ── Guaro Overflow Buildup ──

  _drawGuaroOverflowBuildup(c, player, tick) {
    const pulse = Math.sin(tick * 0.15) * 0.04 + 0.06;
    c.fillStyle = `rgba(204,85,0,${pulse})`;
    c.fillRect(0, 0, CONST.WIDTH, CONST.HEIGHT);

    const shake = Math.sin(tick * 0.4) * 2;
    c.fillStyle = CONST.COLORS.ORANGE;
    this._drawText('GUARO...', CONST.WIDTH / 2 + shake, 52, 'center', 1.3);
  }

  // ── Signature Effects ──

  _drawSignaturePhrase(c, phrase, x, y, tick, timer) {
    const progress = Math.min(1, (50 - timer) / 10);
    if (progress <= 0) return;

    c.save();
    const popScale = progress < 0.3 ? progress / 0.3 : 1;
    const bounce = Math.sin(tick * 0.25) * 1;

    const fontSize = 10;
    const lineHeight = fontSize + 2;
    c.font = 'bold ' + fontSize + 'px monospace';

    const maxBubbleW = CONST.WIDTH - 20;
    const padX = 8;
    const padY = 6;

    const words = phrase.split(' ');
    const lines = [];
    let currentLine = words[0] || '';
    for (let i = 1; i < words.length; i++) {
      const test = currentLine + ' ' + words[i];
      if (c.measureText(test).width > maxBubbleW - padX * 2) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = test;
      }
    }
    lines.push(currentLine);

    let maxLineW = 0;
    for (const line of lines) {
      maxLineW = Math.max(maxLineW, c.measureText(line).width);
    }

    const bw = maxLineW + padX * 2;
    const bh = lines.length * lineHeight + padY * 2;
    const bx = Math.max(4, Math.min(CONST.WIDTH - bw - 4, x - bw / 2));
    const by = Math.max(4, y + bounce - bh - 6);
    const tailX = Math.max(bx + 6, Math.min(bx + bw - 6, x));

    c.globalAlpha = Math.min(1, progress * 2) * popScale;

    c.fillStyle = CONST.COLORS.BLACK;
    c.fillRect(bx - 2, by - 2, bw + 4, bh + 4);
    c.fillRect(tailX - 4, by + bh - 1, 9, 8);

    c.fillStyle = '#FFFFF0';
    c.fillRect(bx, by, bw, bh);
    c.fillRect(tailX - 3, by + bh, 7, 6);

    const borderColor = CONST.COLORS.RED;
    c.fillStyle = borderColor;
    c.fillRect(bx, by, bw, 2);
    c.fillRect(bx, by + bh - 2, bw, 2);
    c.fillRect(bx, by, 2, bh);
    c.fillRect(bx + bw - 2, by, 2, bh);

    c.textAlign = 'center';
    c.textBaseline = 'top';
    const textCenterX = bx + bw / 2;
    for (let i = 0; i < lines.length; i++) {
      const ly = by + padY + i * lineHeight;
      c.fillStyle = CONST.COLORS.BLACK;
      c.fillText(lines[i], textCenterX + 1, ly + 1);
      c.fillStyle = '#AA0000';
      c.fillText(lines[i], textCenterX, ly);
    }

    c.globalAlpha = 1;
    c.restore();
  }

  _drawSignatureEffect(c, effectName, cx, cy, tick, ps) {
    switch (effectName) {
      case 'mic_trail': {
        for (let i = 0; i < 8; i++) {
          const angle = tick * 0.2 + i * (Math.PI / 4);
          const r = 15 + Math.sin(tick * 0.1 + i) * 5;
          const sx = cx + Math.cos(angle) * r;
          const sy = cy + Math.sin(angle) * r * 0.5;
          c.fillStyle = i % 2 === 0 ? CONST.COLORS.GOLD : CONST.COLORS.YELLOW;
          c.fillRect(sx - 1, sy - 1, 2, 2);
        }
        break;
      }
      case 'flash': {
        const alpha = Math.max(0, 0.6 - (tick % 20) * 0.03);
        const grad = c.createRadialGradient(cx, cy, 0, cx, cy, CONST.WIDTH * 0.7);
        grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
        grad.addColorStop(1, `rgba(255,255,255,${alpha * 0.1})`);
        c.fillStyle = grad;
        c.fillRect(0, 0, CONST.WIDTH, CONST.HEIGHT);
        break;
      }
      case 'nail_slash': {
        c.fillStyle = CONST.COLORS.RED;
        for (let i = 0; i < 4; i++) {
          const sx = cx - 12 + i * 8;
          for (let j = 0; j < 6; j++) {
            c.fillRect(sx + j, cy - 10 + j * 4 + i * 2, 2, 3);
          }
        }
        break;
      }
      case 'dust_cloud': {
        for (let i = 0; i < 14; i++) {
          const angle = (i / 14) * Math.PI * 2 + tick * 0.05;
          const r = 10 + tick % 30;
          const dx = cx + Math.cos(angle) * r;
          const dy = cy + Math.sin(angle) * r * 0.4;
          c.fillStyle = i % 2 === 0 ? CONST.COLORS.BROWN : CONST.COLORS.LIGHT_BROWN;
          c.globalAlpha = 0.6;
          c.fillRect(dx - 2, dy - 2, 4, 3);
        }
        for (let i = 0; i < 4; i++) {
          const colX = cx - 15 + i * 10;
          const colH = 8 + Math.sin(tick * 0.2 + i * 1.2) * 4;
          c.globalAlpha = 0.3;
          c.fillStyle = CONST.COLORS.DIRT;
          c.fillRect(colX, cy - colH, 3, colH);
        }
        c.globalAlpha = 0.2;
        c.fillStyle = CONST.COLORS.DIRT_DARK;
        c.fillRect(cx - 18, cy + 2, 36, 1);
        c.fillRect(cx - 12, cy + 3, 24, 1);
        c.globalAlpha = 1;
        break;
      }
      case 'money_rain': {
        for (let i = 0; i < 12; i++) {
          const mx = cx - 30 + ((i * 17 + tick * 2) % 60);
          const my = cy - 20 + ((i * 11 + tick * 3) % 50);
          const tumble = Math.cos(tick * 0.2 + i) * 0.4;
          c.save();
          c.translate(mx + 1.5, my + 2.5);
          c.rotate(tumble);
          c.fillStyle = CONST.COLORS.GOLD;
          c.fillRect(-1.5, -2.5, 3, 5);
          c.fillStyle = CONST.COLORS.DARK_BROWN;
          c.fillRect(-0.5, -1.5, 1, 3);
          if ((tick + i * 7) % 12 < 3) {
            c.fillStyle = CONST.COLORS.WHITE;
            c.fillRect(-1, -2, 1, 1);
          }
          c.restore();
        }
        break;
      }
      case 'club_spin': {
        for (let i = 0; i < 3; i++) {
          const clubColors = [CONST.COLORS.RED, CONST.COLORS.BLUE, CONST.COLORS.GREEN];
          for (let t = 3; t >= 0; t--) {
            const trailAngle = tick * 0.3 + i * (Math.PI * 2 / 3) - t * 0.12;
            const r = 20;
            const sx = cx + Math.cos(trailAngle) * r;
            const sy = cy + Math.sin(trailAngle) * r * 0.5;
            c.globalAlpha = t === 0 ? 1 : 0.15 * (3 - t);
            c.fillStyle = clubColors[i];
            c.fillRect(sx - 2, sy - 4, 4, 8);
            if (t === 0) {
              c.fillStyle = CONST.COLORS.YELLOW;
              c.fillRect(sx - 1, sy - 5, 2, 2);
            }
          }
        }
        c.globalAlpha = 1;
        break;
      }
      case 'lasso_loop': {
        const r = 16 + Math.sin(tick * 0.15) * 4;
        c.strokeStyle = CONST.COLORS.LIGHT_BROWN;
        c.lineWidth = 1;
        c.beginPath();
        c.arc(cx, cy - 10, r, 0, Math.PI * 2);
        c.stroke();
        c.strokeStyle = CONST.COLORS.BROWN;
        c.beginPath();
        c.arc(cx, cy - 10, r - 1, 0, Math.PI * 2);
        c.stroke();
        break;
      }
      case 'shockwave': {
        const rings = 4;
        for (let i = 0; i < rings; i++) {
          const r = ((tick * 2 + i * 10) % 45);
          const alpha = Math.max(0, 1 - r / 45);
          c.fillStyle = `rgba(200,220,255,${alpha * 0.12})`;
          c.beginPath();
          c.arc(cx, cy, r, 0, Math.PI * 2);
          c.fill();
          c.strokeStyle = `rgba(255,255,255,${alpha})`;
          c.lineWidth = 1;
          c.beginPath();
          c.arc(cx, cy, r, 0, Math.PI * 2);
          c.stroke();
        }
        c.fillStyle = `rgba(0,0,0,${0.08 + Math.sin(tick * 0.15) * 0.04})`;
        c.fillRect(0, 0, 10, CONST.HEIGHT);
        c.fillRect(CONST.WIDTH - 10, 0, 10, CONST.HEIGHT);
        break;
      }
      case 'chain_whip': {
        for (let i = 0; i < 8; i++) {
          const lx = cx - 20 + i * 5 + Math.sin(tick * 0.2 + i) * 3;
          const ly = cy - 5 + Math.cos(tick * 0.3 + i * 0.5) * 4;
          c.fillStyle = CONST.COLORS.SILVER;
          c.fillRect(lx, ly, 3, 3);
          c.fillStyle = CONST.COLORS.GRAY;
          c.fillRect(lx + 1, ly + 1, 1, 1);
        }
        break;
      }
      case 'war_paint_glow': {
        for (let i = 0; i < 10; i++) {
          const angle = (i / 10) * Math.PI * 2 + tick * 0.08;
          const r = 12 + Math.sin(tick * 0.1 + i * 0.5) * 8;
          const px = cx + Math.cos(angle) * r;
          const py = cy + Math.sin(angle) * r * 0.6;
          c.fillStyle = i % 2 === 0 ? CONST.COLORS.RED : CONST.COLORS.GOLD;
          c.fillRect(px - 1, py - 1, 3, 3);
        }
        break;
      }
      case 'horn_gore': {
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2;
          const r = 8 + (tick % 10);
          const sx = cx + Math.cos(angle) * r;
          const sy = cy + Math.sin(angle) * r;
          c.fillStyle = CONST.COLORS.YELLOW;
          c.fillRect(sx - 1, sy, 3, 1);
          c.fillRect(sx, sy - 1, 1, 3);
        }
        break;
      }
      case 'phone_throw': {
        const t = (tick % 30) / 30;
        const px = cx + t * 60 - 30;
        const py = cy - 10 - Math.sin(t * Math.PI) * 20;
        c.fillStyle = CONST.COLORS.DARK_GRAY;
        c.fillRect(px - 2, py - 3, 4, 7);
        c.fillStyle = CONST.COLORS.LIGHT_BLUE;
        c.fillRect(px - 1, py - 2, 2, 4);
        break;
      }
    }
  }

  // ── Effects ──

  triggerScreenShake(intensity, duration) {
    this.screenShakeIntensity = intensity || 4;
    this.screenShakeTimer = duration || 12;
  }

  triggerFlash(color) {
    this.flashAlpha = 0.8;
    this.flashColor = color || CONST.COLORS.WHITE;
  }

  triggerImpactStar(x, y, size, duration) {
    this._impactStar = {
      x, y,
      size: size || 18,
      timer: duration || 10,
      maxTimer: duration || 10,
    };
  }

  triggerSweatDrops(x, y, count) {
    const n = count || 4;
    for (let i = 0; i < n; i++) {
      const angle = -Math.PI * 0.3 + Math.random() * Math.PI * 0.6 - Math.PI / 2;
      this._sweatDrops.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * (2 + Math.random() * 3),
        vy: Math.sin(angle) * (2 + Math.random() * 2) - 1,
        life: 14 + Math.floor(Math.random() * 10),
      });
    }
  }

  _drawImpactStar(c) {
    const s = this._impactStar;
    if (!s || s.timer <= 0) { this._impactStar = null; return; }
    const t = s.timer / s.maxTimer;
    const grow = t > 0.6 ? (1 - t) / 0.4 : 1;
    const fade = t < 0.3 ? t / 0.3 : 1;
    const size = s.size * grow * (1 + (1 - t) * 0.3);
    const alpha = fade;
    c.save();
    c.translate(Math.floor(s.x), Math.floor(s.y));

    c.fillStyle = `rgba(255,255,255,${alpha * 0.5})`;
    c.beginPath();
    c.arc(0, 0, size * 0.8, 0, Math.PI * 2);
    c.fill();

    const spikes = 5;
    c.fillStyle = `rgba(255,255,200,${alpha})`;
    c.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 === 0 ? size : size * 0.35;
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      if (i === 0) c.moveTo(px, py);
      else c.lineTo(px, py);
    }
    c.closePath();
    c.fill();

    c.fillStyle = `rgba(255,255,255,${alpha})`;
    c.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 === 0 ? size * 0.55 : size * 0.2;
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      if (i === 0) c.moveTo(px, py);
      else c.lineTo(px, py);
    }
    c.closePath();
    c.fill();

    c.fillStyle = `rgba(255,255,255,${alpha * 0.8})`;
    c.fillRect(-size * 0.6, -1, size * 1.2, 2);
    c.fillRect(-1, -size * 0.6, 2, size * 1.2);

    c.restore();
    s.timer--;
  }

  _drawSweatDrops(c) {
    for (let i = this._sweatDrops.length - 1; i >= 0; i--) {
      const d = this._sweatDrops[i];
      d.x += d.vx;
      d.y += d.vy;
      d.vy += 0.15;
      d.life--;
      if (d.life <= 0) { this._sweatDrops.splice(i, 1); continue; }
      const alpha = Math.min(1, d.life / 6);
      c.fillStyle = `rgba(180,220,255,${alpha})`;
      c.fillRect(Math.floor(d.x), Math.floor(d.y), 2, 3);
      c.fillStyle = `rgba(255,255,255,${alpha * 0.6})`;
      c.fillRect(Math.floor(d.x), Math.floor(d.y), 1, 1);
    }
  }

  addHitParticles(x, y, count) {
    const colors = [CONST.COLORS.WHITE, CONST.COLORS.YELLOW, CONST.COLORS.GOLD];
    const n = count || 8;
    for (let i = 0; i < n; i++) {
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 3.5,
        vy: -Math.random() * 3 - 0.5,
        life: 18 + Math.floor(Math.random() * 14),
        maxLife: 32,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 1 + Math.floor(Math.random() * 2),
        shape: Math.random() < 0.4 ? 'star' : 'square',
        isRosette: false,
        bounce: true,
      });
    }
    const sparkCount = Math.max(4, Math.floor(n * 0.6));
    for (let i = 0; i < sparkCount; i++) {
      const angle = (Math.random()) * Math.PI * 2;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * (3 + Math.random() * 3),
        vy: Math.sin(angle) * (3 + Math.random() * 3),
        life: 4 + Math.floor(Math.random() * 4),
        maxLife: 8,
        color: CONST.COLORS.WHITE,
        size: 1,
        shape: 'spark',
        angle: angle,
        isRosette: false,
      });
    }
    for (let i = 0; i < 3; i++) {
      const angle = -Math.PI/2 + (Math.random() - 0.5) * 1.2;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * (3 + Math.random() * 2),
        vy: Math.sin(angle) * (3 + Math.random() * 2),
        life: 6 + Math.floor(Math.random() * 5),
        maxLife: 11,
        color: CONST.COLORS.WHITE,
        size: 1,
        shape: 'line',
        angle: angle,
        isRosette: false,
      });
    }
  }

  addBlockParticles(x, y) {
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 2.5,
        vy: -Math.random() * 2 - 0.3,
        life: 12 + Math.floor(Math.random() * 8),
        maxLife: 20,
        color: i % 2 === 0 ? CONST.COLORS.LIGHT_BLUE : CONST.COLORS.SILVER,
        size: 1,
        shape: 'star',
        isRosette: false,
        bounce: true,
      });
    }
  }

  addKOBurst(x, y) {
    const colors = [CONST.COLORS.GOLD, CONST.COLORS.RED, CONST.COLORS.YELLOW, CONST.COLORS.WHITE, CONST.COLORS.ORANGE];
    for (let i = 0; i < 25; i++) {
      const angle = (i / 25) * Math.PI * 2;
      const speed = 1.5 + Math.random() * 2.5;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 30 + Math.floor(Math.random() * 20),
        maxLife: 50,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2,
        shape: 'star',
        isRosette: false,
        bounce: true,
      });
    }
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.5;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * 4,
        vy: Math.sin(angle) * 4,
        life: 8,
        maxLife: 8,
        color: CONST.COLORS.WHITE,
        size: 1,
        shape: 'spark',
        angle: angle,
        isRosette: false,
      });
    }
  }

  addConfetti(x, y, count) {
    const colors = [CONST.COLORS.RED, CONST.COLORS.YELLOW, CONST.COLORS.GREEN, CONST.COLORS.BLUE, CONST.COLORS.ORANGE, CONST.COLORS.NEON_PINK, CONST.COLORS.GOLD];
    const n = count || 25;
    for (let i = 0; i < n; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 80,
        y: y - Math.random() * 20,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 2 + 0.5,
        gravity: 0.04,
        life: 60 + Math.floor(Math.random() * 40),
        maxLife: 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2,
        shape: 'confetti',
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.15,
        isRosette: false,
        bounce: true,
      });
    }
  }

  addDodgeDust(x, y, direction) {
    const dir = direction === 'left' ? 1 : -1;
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: x + dir * 4, y: y + 6,
        vx: dir * (0.5 + Math.random() * 1.5),
        vy: -Math.random() * 0.8,
        gravity: 0.02,
        life: 10 + Math.floor(Math.random() * 8),
        maxLife: 18,
        color: i % 2 === 0 ? CONST.COLORS.DIRT : CONST.COLORS.LIGHT_BROWN,
        size: 1 + Math.floor(Math.random() * 2),
        shape: 'square',
        isRosette: false,
      });
    }
  }

  addDustParticles(x, y) {
    for (let i = 0; i < 10; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 30, y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -Math.random() * 1.2 - 0.2,
        life: 25 + Math.floor(Math.random() * 18),
        maxLife: 43,
        color: i % 3 === 0 ? CONST.COLORS.DIRT_DARK : i % 3 === 1 ? CONST.COLORS.DIRT : CONST.COLORS.LIGHT_BROWN,
        size: 1 + Math.floor(Math.random() * 3),
        shape: 'square',
        isRosette: false,
        bounce: true,
      });
    }
  }

  addDamageNumber(x, y, amount, color) {
    this.damageNumbers.push({
      x, y, text: String(amount),
      color: color || CONST.COLORS.WHITE,
      life: 30, maxLife: 30,
      scale: amount >= 15 ? 1.6 : 1.2,
    });
  }

  setDodgeGhost(x, y, anim, frame) {
    this._dodgeGhost = { x, y, anim, frame, life: 8, maxLife: 8 };
  }

  _updateParticles(c) {
    if (this._dodgeGhost && this._dodgeGhost.life > 0) {
      const g = this._dodgeGhost;
      c.globalAlpha = (g.life / g.maxLife) * 0.35;
      this.sprites.drawPlayer(c, g.anim, g.frame, g.x, g.y, 2);
      c.globalAlpha = 1;
      g.life--;
    }

    const groundY = 210;
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity !== undefined ? p.gravity : 0.06;
      if (p.spin) p.angle = (p.angle || 0) + p.spin;
      p.life--;

      if (p.bounce && p.y >= groundY && p.vy > 0) {
        p.y = groundY;
        p.vy *= -0.45;
        p.vx *= 0.7;
        if (Math.abs(p.vy) < 0.2) p.vy = 0;
      }

      const alpha = Math.max(0, p.life / p.maxLife);
      c.globalAlpha = alpha;

      if (p.isRosette) {
        this.drawSarchiRosette(Math.floor(p.x), Math.floor(p.y), p.size);
      } else if (p.shape === 'confetti') {
        c.save();
        c.translate(Math.floor(p.x), Math.floor(p.y));
        c.rotate(p.angle || 0);
        c.fillStyle = p.color;
        c.fillRect(-2, -1, 4, 2);
        c.restore();
      } else if (p.shape === 'spark') {
        c.fillStyle = p.color;
        const len = 2 + p.size;
        const dx = Math.cos(p.angle || 0);
        const dy = Math.sin(p.angle || 0);
        for (let j = 0; j < len; j++) {
          c.fillRect(Math.floor(p.x + dx * j), Math.floor(p.y + dy * j), 1, 1);
        }
      } else if (p.shape === 'star') {
        const px = Math.floor(p.x);
        const py = Math.floor(p.y);
        const s = p.size;
        c.fillStyle = p.color;
        c.fillRect(px, py, s, s);
        c.fillRect(px - s, py, s, s);
        c.fillRect(px + s, py, s, s);
        c.fillRect(px, py - s, s, s);
        c.fillRect(px, py + s, s, s);
      } else if (p.shape === 'line') {
        c.fillStyle = p.color;
        const len = 3 + p.size;
        const dx = Math.cos(p.angle || 0);
        const dy = Math.sin(p.angle || 0);
        for (let j = 0; j < len; j++) {
          c.fillRect(Math.floor(p.x + dx * j), Math.floor(p.y + dy * j), 1, 1);
        }
      } else {
        c.fillStyle = p.color;
        c.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      }

      if (p.life <= 0) this.particles.splice(i, 1);
    }
    c.globalAlpha = 1;
  }

  _updateDamageNumbers(c) {
    for (let i = this.damageNumbers.length - 1; i >= 0; i--) {
      const d = this.damageNumbers[i];
      d.y -= 0.8;
      d.life--;
      const a = Math.max(0, d.life / d.maxLife);
      c.globalAlpha = a;
      const scale = d.scale || 1.2;
      c.fillStyle = CONST.COLORS.BLACK;
      this._drawText(d.text, d.x + 1, Math.floor(d.y) + 1, 'center', scale);
      c.fillStyle = d.color;
      this._drawText(d.text, d.x, Math.floor(d.y), 'center', scale);
      if (d.life <= 0) this.damageNumbers.splice(i, 1);
    }
    c.globalAlpha = 1;
  }

  // ── Transitions ──

  startIrisWipe(cx, cy, duration, onComplete) {
    this.irisWipe = {
      cx: cx || CONST.WIDTH / 2, cy: cy || CONST.HEIGHT / 2,
      timer: 0, duration: duration || 30,
      closing: true, onComplete: onComplete || null,
    };
  }

  updateIrisWipe() {
    if (!this.irisWipe) return false;
    const w = this.irisWipe;
    w.timer++;
    const c = this.ctx;
    const maxR = Math.sqrt(CONST.WIDTH * CONST.WIDTH + CONST.HEIGHT * CONST.HEIGHT) / 2;
    let t = w.timer / w.duration;
    if (t > 1) t = 1;
    const r = w.closing ? maxR * (1 - t) : maxR * t;

    c.save();
    c.fillStyle = CONST.COLORS.BLACK;
    c.beginPath();
    c.rect(0, 0, CONST.WIDTH, CONST.HEIGHT);
    c.arc(w.cx, w.cy, Math.max(0, r), 0, Math.PI * 2, true);
    c.fill();
    c.restore();

    if (w.timer >= w.duration) {
      if (w.closing) {
        if (w.onComplete) w.onComplete();
        w.closing = false;
        w.timer = 0;
      } else {
        this.irisWipe = null;
      }
      return true;
    }
    return true;
  }

  triggerHitStop(frames) {
    this.hitStop = frames || 3;
  }

  isHitStopped() {
    if (this.hitStop > 0) { this.hitStop--; return true; }
    return false;
  }

  // ── Fireworks ──

  drawFireworks(tick) {
    const c = this.ctx;
    const fwCount = 7;
    const colors = [CONST.COLORS.RED, CONST.COLORS.YELLOW, CONST.COLORS.GREEN, CONST.COLORS.BLUE, CONST.COLORS.ORANGE, CONST.COLORS.NEON_PINK, CONST.COLORS.NEON_CYAN, CONST.COLORS.GOLD];

    for (let f = 0; f < fwCount; f++) {
      const phase = f * 47 + 13;
      const cycle = ((tick + phase) % 80);
      if (cycle > 55) continue;

      const fcx = 20 + (f * 41) % (CONST.WIDTH - 40);
      const fcy = 15 + (f * 29) % 45;
      const spread = cycle * 1.3;
      const alpha = Math.max(0, 1 - cycle / 55);
      const sparkCount = 20;

      if (cycle < 8) {
        c.fillStyle = `rgba(255,255,200,${alpha * 0.15})`;
        c.beginPath();
        c.arc(fcx, fcy, spread + 4, 0, Math.PI * 2);
        c.fill();
      }

      for (let i = 0; i < sparkCount; i++) {
        const angle = (i / sparkCount) * Math.PI * 2;
        const sx = fcx + Math.cos(angle) * spread;
        const sy = fcy + Math.sin(angle) * spread + (cycle * cycle * 0.008);
        c.globalAlpha = alpha;
        c.fillStyle = colors[(f + i + Math.floor(tick * 0.05)) % colors.length];
        c.fillRect(Math.floor(sx), Math.floor(sy), 3, 3);
        if (spread > 6) {
          c.globalAlpha = alpha * 0.4;
          const sx2 = fcx + Math.cos(angle) * spread * 0.6;
          const sy2 = fcy + Math.sin(angle) * spread * 0.6 + (cycle * cycle * 0.005);
          c.fillRect(Math.floor(sx2), Math.floor(sy2), 2, 2);
        }
        if (spread > 15 && i % 3 === 0) {
          c.globalAlpha = alpha * 0.25;
          const sx3 = fcx + Math.cos(angle) * spread * 0.35;
          const sy3 = fcy + Math.sin(angle) * spread * 0.35 + (cycle * cycle * 0.003);
          c.fillRect(Math.floor(sx3), Math.floor(sy3), 1, 1);
        }
      }
    }
    c.globalAlpha = 1;
  }

  // ── Text ──

  _drawText(text, x, y, align, scale) {
    const c = this.ctx;
    scale = scale || 1;
    const fontSize = Math.max(4, Math.floor(8 * scale));
    c.font = 'bold ' + fontSize + 'px monospace';

    if (align === 'center') c.textAlign = 'center';
    else if (align === 'right') c.textAlign = 'right';
    else c.textAlign = 'left';

    c.textBaseline = 'top';

    const prevFill = c.fillStyle;
    c.fillStyle = CONST.COLORS.BLACK;
    c.fillText(text, x + 1, y + 1);
    c.fillStyle = prevFill;
    c.fillText(text, x, y);
  }

  drawTextBox(text, x, y, w, h) {
    const c = this.ctx;
    c.fillStyle = CONST.COLORS.BLACK;
    c.globalAlpha = 0.85;
    c.fillRect(x, y, w, h);
    c.globalAlpha = 1;
    this.drawSarchiBorder(x, y, w, h);
    const lines = text.split('\n');
    const lineH = 10;
    const startY = y + (h - lines.length * lineH) / 2;
    c.fillStyle = CONST.COLORS.WHITE;
    for (let i = 0; i < lines.length; i++) {
      this._drawText(lines[i], x + w / 2, startY + i * lineH, 'center', 1);
    }
  }

  drawCenteredText(text, y, color, scale) {
    const c = this.ctx;
    c.fillStyle = color || CONST.COLORS.WHITE;
    this._drawText(text, CONST.WIDTH / 2, y, 'center', scale || 1);
  }

  // ── Teja (animated coin) ──

  drawTeja(x, y, size, rotation) {
    const c = this.ctx;
    const s = size || 12;
    const scaleX = Math.cos(rotation || 0);
    const absScaleX = Math.abs(scaleX);
    const w = Math.max(2, Math.floor(s * absScaleX));

    c.fillStyle = CONST.COLORS.GOLD;
    c.fillRect(x - Math.floor(w / 2), y - Math.floor(s / 2), w, s);

    c.fillStyle = CONST.COLORS.YELLOW;
    c.fillRect(x - Math.floor(w / 2), y - Math.floor(s / 2), w, 2);
    c.fillStyle = '#B8860B';
    c.fillRect(x - Math.floor(w / 2), y + Math.floor(s / 2) - 2, w, 2);

    if (w > 5) {
      c.fillStyle = CONST.COLORS.DARK_BROWN;
      this._drawText('100', x, y - 3, 'center', 0.7);
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, CONST.WIDTH, CONST.HEIGHT);
  }
}
