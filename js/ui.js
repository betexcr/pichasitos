class UIManager {
  constructor(renderer) {
    this.r = renderer;
  }

  drawTitleScreen(stateTick, tick) {
    const ctx = this.r.ctx;
    const W = this.r.W;
    const H = this.r.H;

    ctx.fillStyle = CONST.COLORS.NIGHT_SKY;
    ctx.fillRect(0, 0, W, H);

    const titleBg = this.r.assets ? this.r.assets.getBackground('title_bg') : null;
    if (titleBg) {
      ctx.globalAlpha = 0.4;
      ctx.drawImage(titleBg, 0, 0, titleBg.width, titleBg.height, 0, 0, W, H);
      ctx.globalAlpha = 1;
    }

    this.r.drawFireworks(tick);
    this.r.drawSarchiBorder();

    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.translate(W / 2, 80);
    const rosetteRot = tick * 0.005;
    for (let i = 0; i < 12; i++) {
      const angle = rosetteRot + (i / 12) * Math.PI * 2;
      const rx = Math.cos(angle) * 55;
      const ry = Math.sin(angle) * 55;
      this.r.drawSarchiRosette(rx, ry, 10);
    }
    ctx.restore();

    this.r.drawSarchiRosette(W / 2 - 70, 20, 16);
    this.r.drawSarchiRosette(W / 2 + 70, 20, 16);

    const introAlpha = Math.min(1, stateTick / 20);
    ctx.save();
    ctx.globalAlpha = introAlpha;

    const titlePulse = 1 + Math.sin(tick * 0.06) * 0.05;
    ctx.save();
    ctx.globalAlpha = introAlpha * (0.1 + Math.sin(tick * 0.06) * 0.06);
    ctx.fillStyle = CONST.COLORS.GOLD;
    this.r._drawText(CONST.TEXT.TITLE, W / 2, 48, 'center', 4.2 * titlePulse + 0.4);
    ctx.restore();

    ctx.globalAlpha = introAlpha;
    ctx.fillStyle = CONST.COLORS.GOLD;
    this.r._drawText(CONST.TEXT.TITLE, W / 2, 50, 'center', 4.2 * titlePulse);

    ctx.fillStyle = CONST.COLORS.WHITE;
    this.r._drawText(CONST.TEXT.SUBTITLE, W / 2, 90, 'center', 1.5);

    this.r.drawSarchiStripe(30, 108, W - 60);

    if (stateTick > 30 && Math.floor(tick / 18) % 2 === 0) {
      ctx.fillStyle = CONST.COLORS.NEON_GREEN;
      this.r._drawText('PRESS START', W / 2, 135, 'center', 2.0);
    }

    ctx.fillStyle = CONST.COLORS.YELLOW;
    this.r._drawText('EL JUEGO DE LOS PICHAZOS', W / 2, 165, 'center', 1.0);

    const tejaRot = tick * 0.08;
    this.r.drawTeja(W / 2 - 30, 190, 12, tejaRot);
    this.r.drawTeja(W / 2 + 30, 190, 12, -tejaRot);

    ctx.restore();
  }

  drawWorldMap(currentIndex, circuit, stateTick, tick) {
    const ctx = this.r.ctx;
    const W = this.r.W;
    const H = this.r.H;

    ctx.fillStyle = CONST.COLORS.NIGHT_SKY;
    ctx.fillRect(0, 0, W, H);

    const mapBg = this.r.assets ? this.r.assets.getBackground('map_bg') : null;
    if (mapBg) {
      ctx.globalAlpha = 0.5;
      ctx.drawImage(mapBg, 0, 0, mapBg.width, mapBg.height, 0, 0, W, H);
      ctx.globalAlpha = 1;
    }

    const circuitInfo = CONST.CIRCUITS[circuit];
    ctx.fillStyle = CONST.COLORS.GOLD;
    this.r._drawText(circuitInfo ? circuitInfo.name : 'MAPA', W / 2, 8, 'center', 1.4);

    const nodes = CONST.MAP_NODES;
    const areaLabels = ['PUEBLO', 'FERIA', 'REDONDEL', 'CEMENTERIO'];
    const areaStrokes = [
      'rgba(120,220,120,0.6)',
      'rgba(255,214,140,0.65)',
      'rgba(255,170,120,0.65)',
      'rgba(255,140,165,0.65)',
    ];
    const areaDarkOverlays = [
      'rgba(10,30,10,0.5)',
      'rgba(20,10,30,0.5)',
      'rgba(5,5,15,0.5)',
      'rgba(30,5,5,0.5)',
    ];

    const numCircuits = CONST.CIRCUITS.length;
    const mapTop = 22;
    const mapBottom = H - 14;
    const boxGap = 3;
    const boxH = Math.floor((mapBottom - mapTop - boxGap * (numCircuits - 1)) / numCircuits);
    const boxLeft = 6;
    const boxW = W - 12;
    const radius = 6;

    for (let c = 0; c < numCircuits; c++) {
      const drawIdx = numCircuits - 1 - c;
      const top = mapTop + drawIdx * (boxH + boxGap);
      const left = boxLeft;
      const width = boxW;
      const height = boxH;
      const isCurrentCircuit = c === circuit;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(left + radius, top);
      ctx.lineTo(left + width - radius, top);
      ctx.quadraticCurveTo(left + width, top, left + width, top + radius);
      ctx.lineTo(left + width, top + height - radius);
      ctx.quadraticCurveTo(left + width, top + height, left + width - radius, top + height);
      ctx.lineTo(left + radius, top + height);
      ctx.quadraticCurveTo(left, top + height, left, top + height - radius);
      ctx.lineTo(left, top + radius);
      ctx.quadraticCurveTo(left, top, left + radius, top);
      ctx.closePath();
      ctx.clip();

      const bgKey = CONST.CIRCUIT_BACKGROUNDS[c];
      const bgImg = bgKey && this.r.assets ? this.r.assets.getBackground(bgKey) : null;
      if (bgImg) {
        const aspect = bgImg.width / bgImg.height;
        const drawW = width;
        const drawH = drawW / aspect;
        ctx.drawImage(bgImg, 0, 0, bgImg.width, bgImg.height, left, top + height - drawH, drawW, drawH);
      }
      ctx.fillStyle = areaDarkOverlays[c] || 'rgba(0,0,0,0.5)';
      ctx.fillRect(left, top, width, height);

      ctx.restore();

      ctx.save();
      ctx.strokeStyle = isCurrentCircuit ? CONST.COLORS.GOLD : (areaStrokes[c] || '#888');
      ctx.lineWidth = isCurrentCircuit ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(left + radius, top);
      ctx.lineTo(left + width - radius, top);
      ctx.quadraticCurveTo(left + width, top, left + width, top + radius);
      ctx.lineTo(left + width, top + height - radius);
      ctx.quadraticCurveTo(left + width, top + height, left + width - radius, top + height);
      ctx.lineTo(left + radius, top + height);
      ctx.quadraticCurveTo(left, top + height, left, top + height - radius);
      ctx.lineTo(left, top + radius);
      ctx.quadraticCurveTo(left, top, left + radius, top);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = isCurrentCircuit ? CONST.COLORS.GOLD : CONST.COLORS.WHITE;
      this.r._drawText(areaLabels[c] || 'AREA', left + 6, top + 3, 'left', 0.7);

      const iconX = left + width - 13;
      const iconY = top + 10;
      this._drawWorldAreaIcon(ctx, c, iconX, iconY, isCurrentCircuit, tick);
    }

    for (let i = 0; i < nodes.length - 1; i++) {
      if (nodes[i].circuit === nodes[i + 1].circuit) {
        const a = nodes[i];
        const b = nodes[i + 1];
        const beaten = i < currentIndex;
        ctx.strokeStyle = beaten ? CONST.COLORS.GOLD : 'rgba(255,255,255,0.15)';
        ctx.lineWidth = beaten ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const isCurrent = i === currentIndex;
      const isBeaten = i < currentIndex;
      const isLocked = node.circuit > circuit;

      const r = isCurrent ? 10 : 8;

      if (isLocked) {
        ctx.fillStyle = 'rgba(40,40,60,0.8)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = CONST.COLORS.GRAY;
        this.r._drawText('?', node.x, node.y - 3, 'center', 1.0);
        continue;
      }

      if (isCurrent) {
        const pulse = 0.6 + Math.sin(tick * 0.1) * 0.4;
        ctx.save();
        ctx.globalAlpha = pulse * 0.3;
        ctx.fillStyle = CONST.COLORS.GOLD;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      const portrait = (i < OPPONENT_DATA.length)
        ? (this.r.assets ? this.r.assets.getPortraitImage(OPPONENT_DATA[i].name, 'intro') : null)
        : (i === OPPONENT_DATA.length ? (this.r.assets ? this.r.assets.getPortraitImage('EL TORO', 'intro') : null) : null);

      if (portrait) {
        const charName = (i < OPPONENT_DATA.length) ? OPPONENT_DATA[i].name : (i === OPPONENT_DATA.length ? 'EL TORO' : null);
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.clip();
        this._drawPortraitCropped(ctx, portrait, node.x - r, node.y - r, r * 2, r * 2, charName);
        ctx.restore();
      } else {
        const circColors = [CONST.COLORS.GREEN, CONST.COLORS.YELLOW, CONST.COLORS.ORANGE, CONST.COLORS.RED];
        ctx.fillStyle = circColors[node.circuit] || CONST.COLORS.WHITE;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = isCurrent ? CONST.COLORS.GOLD : (isBeaten ? CONST.COLORS.GREEN : CONST.COLORS.WHITE);
      ctx.lineWidth = isCurrent ? 2 : 1;
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.stroke();

      if (isBeaten) {
        ctx.fillStyle = CONST.COLORS.NEON_GREEN;
        this.r._drawText('V', node.x, node.y - 3, 'center', 0.7);
      }

      if (isCurrent) {
        const oppName = i < OPPONENT_DATA.length ? OPPONENT_DATA[i].name :
                       (i === OPPONENT_DATA.length ? 'EL TORO' : '???');
        ctx.fillStyle = CONST.COLORS.WHITE;
        this.r._drawText(oppName, node.x, node.y + r + 6, 'center', 0.7);
      }
    }

    if (stateTick > 15 && Math.floor(tick / 20) % 2 === 0) {
      ctx.fillStyle = CONST.COLORS.NEON_GREEN;
      this.r._drawText('PRESS START', W / 2, H - 16, 'center', 1.2);
    }
  }

  _drawWorldAreaIcon(ctx, areaIndex, x, y, isActive, tick) {
    ctx.save();
    if (!isActive) ctx.globalAlpha = 0.88;
    else ctx.globalAlpha = 0.96 + Math.sin(tick * 0.08) * 0.04;

    switch (areaIndex) {
      case 0:
        this._drawTownIcon(ctx, x, y);
        break;
      case 1:
        this._drawFairIcon(ctx, x, y, tick);
        break;
      case 2:
        this._drawBullringIcon(ctx, x, y);
        break;
      case 3:
        this._drawCemeteryIcon(ctx, x, y);
        break;
    }
    ctx.restore();
  }

  _drawTownIcon(ctx, x, y) {
    ctx.fillStyle = '#8B5A2B';
    ctx.fillRect(x - 5, y + 2, 10, 6);
    ctx.fillStyle = '#D9E6F2';
    ctx.fillRect(x - 2, y + 4, 2, 2);
    ctx.fillRect(x + 1, y + 4, 2, 2);
    ctx.fillStyle = '#C41E3A';
    ctx.fillRect(x - 6, y - 1, 12, 1);
    ctx.fillRect(x - 4, y - 2, 8, 1);
    ctx.fillRect(x - 2, y - 3, 4, 1);
  }

  _drawFairIcon(ctx, x, y, tick) {
    ctx.strokeStyle = '#FFE27A';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y + 1, 5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#FFC44A';
    ctx.beginPath();
    ctx.moveTo(x, y - 4);
    ctx.lineTo(x, y + 6);
    ctx.moveTo(x - 5, y + 1);
    ctx.lineTo(x + 5, y + 1);
    ctx.moveTo(x - 4, y - 2);
    ctx.lineTo(x + 4, y + 4);
    ctx.moveTo(x + 4, y - 2);
    ctx.lineTo(x - 4, y + 4);
    ctx.stroke();

    ctx.fillStyle = '#EAA221';
    ctx.fillRect(x - 1, y + 7, 2, 2);
    if (Math.sin(tick * 0.2) > 0.2) {
      ctx.fillStyle = '#FFF4B0';
      ctx.fillRect(x - 1, y - 4, 1, 1);
      ctx.fillRect(x + 3, y + 1, 1, 1);
    }
  }

  _drawBullringIcon(ctx, x, y) {
    ctx.strokeStyle = '#D68A4B';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y + 3, 5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#F0D7BC';
    ctx.fillRect(x - 2, y + 1, 4, 4);
    ctx.fillStyle = '#8B5A2B';
    ctx.fillRect(x - 4, y - 1, 3, 1);
    ctx.fillRect(x + 1, y - 1, 3, 1);
    ctx.fillRect(x - 1, y + 3, 2, 1);
  }

  _drawCemeteryIcon(ctx, x, y) {
    ctx.fillStyle = '#BFC4D5';
    ctx.fillRect(x - 1, y - 2, 2, 7);
    ctx.fillRect(x - 3, y, 6, 2);
    ctx.fillStyle = '#A2A7B8';
    ctx.fillRect(x - 4, y + 5, 8, 2);
    ctx.fillStyle = '#8CD38A';
    ctx.fillRect(x - 5, y + 7, 10, 1);
  }

  drawAttractMode(tick, credits, highScores, onlineData) {
    const ctx = this.r.ctx;
    const W = this.r.W;
    const H = this.r.H;
    const hasOnline = onlineData && onlineData.enabled;
    const screenCount = hasOnline ? 5 : 4;
    const screen = Math.floor(tick / 300) % screenCount;

    ctx.fillStyle = CONST.COLORS.NIGHT_SKY;
    ctx.fillRect(0, 0, W, H);
    this.r.drawSarchiBorder();

    if (screen === 0) {
      this._drawTitleScreen(ctx, W, H, tick, onlineData);
    } else if (screen === 1) {
      this._drawHowToPlayScreen(ctx, W, H, tick);
    } else if (screen === 2) {
      this._drawEnemiesScreen(ctx, W, H, tick);
    } else if (screen === 3) {
      this._drawHighScoreScreen(ctx, W, H, tick, highScores, hasOnline);
    } else {
      this._drawOnlinePlayersScreen(ctx, W, H, tick, onlineData);
    }

    this._drawCredits(ctx, W, H, credits);
  }

  _drawTitleScreen(ctx, W, H, tick, onlineData) {
    const titleBg = this.r.assets ? this.r.assets.getBackground('title_bg') : null;
    if (titleBg) {
      ctx.globalAlpha = 0.35;
      ctx.drawImage(titleBg, 0, 0, titleBg.width, titleBg.height, 0, 0, W, H);
      ctx.globalAlpha = 1;
    }
    this.r.drawFireworks(tick);

    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.translate(W / 2, 80);
    const rosetteRot = tick * 0.005;
    for (let i = 0; i < 8; i++) {
      const angle = rosetteRot + (i / 8) * Math.PI * 2;
      const rx = Math.cos(angle) * 50;
      const ry = Math.sin(angle) * 50;
      this.r.drawSarchiRosette(rx, ry, 8);
    }
    ctx.restore();

    this.r.drawSarchiRosette(W / 2 - 60, 18, 14);
    this.r.drawSarchiRosette(W / 2 + 60, 18, 14);

    const titlePulse = 1 + Math.sin(tick * 0.06) * 0.04;
    const titleGlow = 0.08 + Math.sin(tick * 0.06) * 0.05;
    ctx.save();
    ctx.globalAlpha = titleGlow;
    ctx.fillStyle = CONST.COLORS.GOLD;
    this.r._drawText(CONST.TEXT.TITLE, W / 2, 30, 'center', 3.5 * titlePulse + 0.3);
    ctx.restore();

    ctx.fillStyle = CONST.COLORS.GOLD;
    this.r._drawText(CONST.TEXT.TITLE, W / 2, 32, 'center', 3.5 * titlePulse);

    ctx.fillStyle = CONST.COLORS.WHITE;
    this.r._drawText(CONST.TEXT.SUBTITLE, W / 2, 68, 'center', 1.3);

    if (Math.floor(tick / 20) % 2 === 0) {
      ctx.fillStyle = CONST.COLORS.NEON_GREEN;
      this.r._drawText(CONST.TEXT.ECHE_TEJA, W / 2, 100, 'center', 1.8);
    }

    ctx.fillStyle = CONST.COLORS.YELLOW;
    this.r._drawText('EL JUEGO DE LOS PICHAZOS', W / 2, 130, 'center', 1.2);

    const tejaRot = tick * 0.08;
    this.r.drawTeja(W / 2, 158, 16, tejaRot);

    if (onlineData && onlineData.enabled && onlineData.count > 0) {
      const dotPulse = 0.7 + Math.sin(tick * 0.1) * 0.3;
      ctx.save();
      ctx.globalAlpha = dotPulse;
      ctx.fillStyle = CONST.COLORS.NEON_GREEN;
      ctx.beginPath();
      ctx.arc(W - 58, 180, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = CONST.COLORS.NEON_GREEN;
      this.r._drawText(onlineData.count + ' EN LINEA', W - 50, 178, 'left', 0.7);
    }

    this.r.drawSarchiRosette(30, H - 26, 10);
    this.r.drawSarchiRosette(W - 30, H - 26, 10);
  }

  _drawHighScoreScreen(ctx, W, H, tick, highScores, isGlobal) {
    var title = isGlobal ? 'RANKING GLOBAL' : 'MEJORES PICHASEADORES';
    ctx.fillStyle = CONST.COLORS.GOLD;
    this.r._drawText(title, W / 2, 18, 'center', 1.8);
    this.r.drawSarchiStripe(0, 38, W);

    if (!highScores || highScores.length === 0) {
      ctx.fillStyle = CONST.COLORS.GRAY;
      this.r._drawText('SIN REGISTROS', W / 2, H / 2, 'center', 1.2);
    } else {
      const frame = Math.floor(tick / 15) % 2;
      const max = Math.min(highScores.length, 8);
      for (let i = 0; i < max; i++) {
        const entry = highScores[i];
        const y = 52 + i * 18;
        const rank = String(i + 1) + '.';
        const name = (entry.name || '???').padEnd(3, ' ');
        const pts = String(entry.score || 0);
        const color = i === 0 ? CONST.COLORS.GOLD : i < 3 ? CONST.COLORS.YELLOW : CONST.COLORS.WHITE;
        ctx.fillStyle = color;
        this.r._drawText(rank, 16, y, 'left', 1);
        this.r._drawText(name, 34, y, 'left', 1);
        if (entry.lastDefeated) {
          var oppData = this._findOpponentData(entry.lastDefeated);
          if (oppData) {
            var pImg = this.r.assets && this.r.assets.getPortraitImage(oppData.name, 'intro');
            if (pImg) {
              var pS = 14;
              ctx.save();
              ctx.beginPath();
              this._roundedRect(ctx, 72 - pS / 2, y + 6 - pS / 2, pS, pS, 2);
              ctx.clip();
              this._drawPortraitCropped(ctx, pImg, 72 - pS / 2, y + 6 - pS / 2, pS, pS, oppData.name);
              ctx.restore();
            } else {
              this.r.sprites.drawOpponentHead(ctx, oppData, frame, 72, y + 6, 0.8);
            }
          }
        }
        ctx.fillStyle = color;
        this.r._drawText(pts, W - 16, y, 'right', 1);
      }
    }

    this.r.drawSarchiRosette(W / 2, H - 22, 10);
  }

  _drawOnlinePlayersScreen(ctx, W, H, tick, onlineData) {
    ctx.fillStyle = CONST.COLORS.NEON_GREEN;
    this.r._drawText('EN LINEA AHORA', W / 2, 18, 'center', 1.8);

    var dotPulse = 0.6 + Math.sin(tick * 0.12) * 0.4;
    ctx.save();
    ctx.globalAlpha = dotPulse;
    ctx.fillStyle = CONST.COLORS.NEON_GREEN;
    ctx.beginPath();
    ctx.arc(W / 2 + 78, 18, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    this.r.drawSarchiStripe(0, 34, W);

    ctx.fillStyle = CONST.COLORS.WHITE;
    this.r._drawText(onlineData.count + ' PICHASEADOR' + (onlineData.count !== 1 ? 'ES' : ''), W / 2, 46, 'center', 1);

    var players = onlineData.players || [];
    if (players.length === 0) {
      ctx.fillStyle = CONST.COLORS.GRAY;
      this.r._drawText('NADIE POR AQUI...', W / 2, H / 2, 'center', 1.2);
    } else {
      var max = Math.min(players.length, 8);
      for (var i = 0; i < max; i++) {
        var p = players[i];
        var y = 64 + i * 17;
        var stateLabel = (OnlineScoreboard.STATE_LABELS && OnlineScoreboard.STATE_LABELS[p.state]) || 'EN LINEA';

        var stateColor;
        if (p.state === 'fight') stateColor = CONST.COLORS.RED;
        else if (p.state === 'victory') stateColor = CONST.COLORS.GOLD;
        else if (p.state === 'attract') stateColor = CONST.COLORS.GRAY;
        else stateColor = CONST.COLORS.YELLOW;

        ctx.fillStyle = CONST.COLORS.NEON_GREEN;
        ctx.beginPath();
        ctx.arc(18, y + 3, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = CONST.COLORS.WHITE;
        this.r._drawText(p.name || '???', 28, y, 'left', 1);

        if (p.score > 0) {
          ctx.fillStyle = CONST.COLORS.GOLD;
          this.r._drawText(String(p.score), W / 2 + 10, y, 'left', 0.8);
        }

        ctx.fillStyle = stateColor;
        this.r._drawText(stateLabel, W - 16, y, 'right', 0.8);
      }

      if (players.length > 8) {
        ctx.fillStyle = CONST.COLORS.GRAY;
        this.r._drawText('+ ' + (players.length - 8) + ' MAS...', W / 2, 64 + 8 * 17, 'center', 0.8);
      }
    }

    this.r.drawSarchiRosette(30, H - 22, 8);
    this.r.drawSarchiRosette(W - 30, H - 22, 8);
  }

  _drawEnemiesScreen(ctx, W, H, tick) {
    ctx.fillStyle = CONST.COLORS.GOLD;
    this.r._drawText('PICHASEADORES', W / 2, 14, 'center', 1.8);
    this.r.drawSarchiStripe(0, 32, W);

    const allEnemies = [];
    for (let c = 0; c < CONST.CIRCUITS.length; c++) {
      const circuit = CONST.CIRCUITS[c];
      for (let j = 0; j < circuit.opponents.length; j++) {
        const opp = OPPONENT_DATA[circuit.opponents[j]];
        if (opp) allEnemies.push({ data: opp, circuitColor: circuit.color });
      }
    }
    allEnemies.push({ data: TORO_DATA, circuitColor: CONST.COLORS.RED });

    const totalEnemies = allEnemies.length;
    const pageSize = 5;
    const totalPages = Math.ceil(totalEnemies / pageSize);
    const screenDuration = 300;
    const pageDuration = Math.floor(screenDuration / totalPages);
    const page = Math.floor((tick % screenDuration) / pageDuration) % totalPages;
    const startIdx = page * pageSize;
    const endIdx = Math.min(startIdx + pageSize, totalEnemies);

    const rowH = 28;
    const startY = 42;

    for (let i = startIdx; i < endIdx; i++) {
      const entry = allEnemies[i];
      const row = i - startIdx;
      const y = startY + row * rowH;
      const frame = Math.floor(tick / 12) % 2;

      const thumbImg = this.r.assets && this.r.assets.getPortraitImage(entry.data.name, 'intro');
      if (thumbImg) {
        const thumbS = 22;
        this._drawPortraitCropped(ctx, thumbImg, 24 - thumbS / 2, y + 10 - thumbS / 2, thumbS, thumbS, entry.data.name);
      } else {
        this.r.sprites.drawOpponentHead(ctx, entry.data, frame, 24, y + 10, 1.3);
      }

      ctx.fillStyle = entry.circuitColor;
      this.r._drawText(entry.data.name, 48, y, 'left', 1.1);

      ctx.fillStyle = CONST.COLORS.GRAY;
      this.r._drawText(entry.data.title, 48, y + 13, 'left', 0.7);

      const barW = 50;
      const barX = W - barW - 14;
      const barY = y + 2;
      ctx.fillStyle = CONST.COLORS.DARK_GRAY;
      ctx.fillRect(barX, barY, barW, 5);
      const hpFrac = entry.data.health / 180;
      ctx.fillStyle = hpFrac > 0.6 ? CONST.COLORS.RED : CONST.COLORS.ORANGE;
      ctx.fillRect(barX, barY, barW * hpFrac, 5);

      ctx.fillStyle = CONST.COLORS.DARK_GRAY;
      ctx.fillRect(barX, barY + 8, barW, 5);
      const spdFrac = Math.min(1, entry.data.speed);
      ctx.fillStyle = CONST.COLORS.LIGHT_BLUE;
      ctx.fillRect(barX, barY + 8, barW * spdFrac, 5);
    }

    const labelX = W - 64 - 14;
    ctx.fillStyle = CONST.COLORS.GRAY;
    this.r._drawText('VIT', labelX - 4, startY + (endIdx - startIdx - 1) * rowH + 22, 'left', 0.6);
    ctx.fillStyle = CONST.COLORS.GRAY;
    this.r._drawText('VEL', labelX + 20, startY + (endIdx - startIdx - 1) * rowH + 22, 'left', 0.6);

    if (totalPages > 1) {
      const dotY = H - 28;
      for (let p = 0; p < totalPages; p++) {
        ctx.fillStyle = p === page ? CONST.COLORS.GOLD : CONST.COLORS.DARK_GRAY;
        ctx.beginPath();
        ctx.arc(W / 2 + (p - (totalPages - 1) / 2) * 10, dotY, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    this.r.drawSarchiRosette(30, H - 22, 8);
    this.r.drawSarchiRosette(W - 30, H - 22, 8);
  }

  _drawHowToPlayScreen(ctx, W, H, tick) {
    const isTouch = document.body.classList.contains('touch-device');

    ctx.fillStyle = CONST.COLORS.GOLD;
    this.r._drawText('COMO JUGAR', W / 2, 14, 'center', 2);
    this.r.drawSarchiStripe(0, 32, W);

    const leftCol = 14;
    const rightCol = W / 2 + 6;

    ctx.fillStyle = CONST.COLORS.NEON_GREEN;
    this.r._drawText('MOVIMIENTO', leftCol, 42, 'left', 1);

    if (isTouch) {
      const moveTouch = [
        ['D-PAD', 'MOVERSE'],
        ['ARRIBA', 'BLOQUEAR'],
        ['ABAJO', 'AGACHARSE'],
        ['ARRIBAx2', 'ESQUIVAR'],
      ];
      for (let i = 0; i < moveTouch.length; i++) {
        const y = 56 + i * 13;
        ctx.fillStyle = CONST.COLORS.YELLOW;
        this.r._drawText(moveTouch[i][0], leftCol, y, 'left', 0.8);
        ctx.fillStyle = CONST.COLORS.WHITE;
        this.r._drawText(moveTouch[i][1], leftCol + 52, y, 'left', 0.8);
      }
    } else {
      const moveKeys = [
        ['IZQ/DER', 'MOVERSE'],
        ['ARRIBA', 'BLOQUEAR'],
        ['ABAJO', 'AGACHARSE'],
        ['ARRIBAx2', 'ESQUIVAR'],
      ];
      for (let i = 0; i < moveKeys.length; i++) {
        const y = 56 + i * 13;
        ctx.fillStyle = CONST.COLORS.YELLOW;
        this.r._drawText(moveKeys[i][0], leftCol, y, 'left', 0.8);
        ctx.fillStyle = CONST.COLORS.WHITE;
        this.r._drawText(moveKeys[i][1], leftCol + 52, y, 'left', 0.8);
      }
    }

    ctx.fillStyle = CONST.COLORS.NEON_GREEN;
    this.r._drawText('COMBATE', rightCol, 42, 'left', 1);

    if (isTouch) {
      const fightTouch = [
        ['BOTON A', 'PICHA IZQ'],
        ['BOTON S', 'PICHA DER'],
        ['BOTON D', 'EL ZARPE'],
      ];
      for (let i = 0; i < fightTouch.length; i++) {
        const y = 56 + i * 13;
        ctx.fillStyle = CONST.COLORS.YELLOW;
        this.r._drawText(fightTouch[i][0], rightCol, y, 'left', 0.8);
        ctx.fillStyle = CONST.COLORS.WHITE;
        this.r._drawText(fightTouch[i][1], rightCol + 48, y, 'left', 0.8);
      }
    } else {
      const fightKeys = [
        ['TECLA A', 'PICHA IZQ'],
        ['TECLA S', 'PICHA DER'],
        ['TECLA D', 'EL ZARPE'],
      ];
      for (let i = 0; i < fightKeys.length; i++) {
        const y = 56 + i * 13;
        ctx.fillStyle = CONST.COLORS.YELLOW;
        this.r._drawText(fightKeys[i][0], rightCol, y, 'left', 0.8);
        ctx.fillStyle = CONST.COLORS.WHITE;
        this.r._drawText(fightKeys[i][1], rightCol + 48, y, 'left', 0.8);
      }
    }

    this.r.drawSarchiStripe(0, 110, W);

    if (isTouch) {
      ctx.fillStyle = CONST.COLORS.NEON_GREEN;
      this.r._drawText('BOTONES', W / 2, 120, 'center', 1);

      ctx.fillStyle = CONST.COLORS.YELLOW;
      this.r._drawText('TEJA', leftCol + 20, 136, 'left', 0.8);
      ctx.fillStyle = CONST.COLORS.WHITE;
      this.r._drawText('METER MONEDA', leftCol + 20 + 42, 136, 'left', 0.8);

      ctx.fillStyle = CONST.COLORS.YELLOW;
      this.r._drawText('START', leftCol + 20, 149, 'left', 0.8);
      ctx.fillStyle = CONST.COLORS.WHITE;
      this.r._drawText('INICIAR JUEGO', leftCol + 20 + 42, 149, 'left', 0.8);
    } else {
      ctx.fillStyle = CONST.COLORS.NEON_GREEN;
      this.r._drawText('SISTEMA', W / 2, 120, 'center', 1);

      ctx.fillStyle = CONST.COLORS.YELLOW;
      this.r._drawText('ENTER', leftCol + 20, 136, 'left', 0.8);
      ctx.fillStyle = CONST.COLORS.WHITE;
      this.r._drawText('ECHAR TEJA', leftCol + 20 + 52, 136, 'left', 0.8);

      ctx.fillStyle = CONST.COLORS.YELLOW;
      this.r._drawText('ESPACIO', leftCol + 20, 149, 'left', 0.8);
      ctx.fillStyle = CONST.COLORS.WHITE;
      this.r._drawText('START', leftCol + 20 + 52, 149, 'left', 0.8);
    }

    this.r.drawSarchiStripe(0, 164, W);

    const tips = [
      'BLOQUEE PARA REDUCIR DANO',
      'ESQUIVE: DOBLE ARRIBA RAPIDO',
      'LLENE EL GUARO PARA EL ZARPE',
      'ALTERNE PICHAZOS PARA COMBO',
      'EL ZARPE SOLO CUANDO ESTA LLENO',
      'CUIDADO CON EL GUARO DE MAS!',
    ];
    const tipIndex = Math.floor(tick / 100) % tips.length;
    const tipPhase = tick % 100;
    const tipAlpha = tipPhase < 80 ? 1 : 1 - (tipPhase - 80) / 20;
    ctx.globalAlpha = tipAlpha;
    ctx.fillStyle = CONST.COLORS.CREAM;
    this.r._drawText(tips[tipIndex], W / 2, 178, 'center', 0.8);
    ctx.globalAlpha = 1;

    this.r.drawSarchiRosette(30, H - 28, 8);
    this.r.drawSarchiRosette(W - 30, H - 28, 8);
  }

  _findOpponentData(name) {
    if (!name) return null;
    if (typeof TORO_DATA !== 'undefined' && TORO_DATA.name === name) return TORO_DATA;
    for (var i = 0; i < OPPONENT_DATA.length; i++) {
      if (OPPONENT_DATA[i].name === name) return OPPONENT_DATA[i];
    }
    return null;
  }

  _drawCredits(ctx, W, H, credits) {
    const label = credits > 0
      ? CONST.TEXT.TEJAS + ': ' + credits
      : CONST.TEXT.ECHE_TEJA;
    ctx.fillStyle = CONST.COLORS.WHITE;
    this.r._drawText(label, W / 2, H - 14, 'center', 1.2);
  }

  drawIntro(stateTick) {
    const ctx = this.r.ctx;
    const W = this.r.W;
    const H = this.r.H;

    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, W, H);
    this.r.drawSarchiBorder();

    const lines = CONST.TEXT.INTRO_LINES;
    const lineH = 16;
    const totalTextH = lines.length * lineH;
    const startY = Math.floor((H - totalTextH - 20) / 2);
    const visibleCount = Math.min(lines.length, Math.floor(stateTick / 20));

    for (let i = 0; i < visibleCount; i++) {
      const line = lines[i];
      if (!line) continue;
      const alpha = Math.min(1, (stateTick - i * 20) / 15);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = CONST.COLORS.WHITE;
      this.r._drawText(line, W / 2, startY + i * lineH, 'center', 1.3);
    }
    ctx.globalAlpha = 1;

    if (stateTick > lines.length * 20 + 20) {
      if (Math.floor(stateTick / 15) % 2 === 0) {
        ctx.fillStyle = CONST.COLORS.NEON_GREEN;
        this.r._drawText(CONST.TEXT.START, W / 2, H - 14, 'center', 1);
      }
    }
  }

  drawCircuitIntro(circuitIndex, stateTick) {
    const ctx = this.r.ctx;
    const W = this.r.W;
    const H = this.r.H;
    const circuit = CONST.CIRCUITS[circuitIndex];
    if (!circuit) return;

    ctx.fillStyle = CONST.COLORS.BLACK;
    ctx.fillRect(0, 0, W, H);
    this.r.drawSarchiBorder();

    ctx.fillStyle = CONST.COLORS.WHITE;
    this.r._drawText('CIRCUITO', W / 2, 16, 'center', 1.2);

    const nameAlpha = Math.min(1, stateTick / 30);
    ctx.globalAlpha = nameAlpha;
    ctx.fillStyle = circuit.color;
    this.r._drawText(circuit.name, W / 2, 34, 'center', 1.8);
    ctx.globalAlpha = 1;

    this.r.drawSarchiStripe(20, 56, W - 40);

    const oppIndices = circuit.opponents;
    const rowH = Math.min(38, Math.floor((H - 90) / oppIndices.length));
    for (let i = 0; i < oppIndices.length; i++) {
      const opp = OPPONENT_DATA[oppIndices[i]];
      if (!opp) continue;
      const showAt = 40 + i * 18;
      if (stateTick < showAt) continue;
      const a = Math.min(1, (stateTick - showAt) / 10);
      ctx.globalAlpha = a;
      const y = 66 + i * rowH;
      const portraitImg = this.r.assets && this.r.assets.getPortraitImage(opp.name, 'intro');
      if (portraitImg) {
        const pS = 28;
        ctx.save();
        ctx.beginPath();
        this._roundedRect(ctx, 36 - pS / 2, y + 10 - pS / 2, pS, pS, 4);
        ctx.clip();
        this._drawPortraitCropped(ctx, portraitImg, 36 - pS / 2, y + 10 - pS / 2, pS, pS, opp.name);
        ctx.restore();
      } else {
        this.r.sprites.drawOpponentHead(ctx, opp, Math.floor(stateTick / 10) % 2, 36, y + 10, 1.2);
      }
      ctx.fillStyle = CONST.COLORS.WHITE;
      this.r._drawText(opp.name, 68, y, 'left', 1.2);
      ctx.fillStyle = CONST.COLORS.GRAY;
      this.r._drawText(opp.title, 68, y + 14, 'left', 0.8);
    }
    ctx.globalAlpha = 1;

    this.r.drawSarchiRosette(30, H - 18, 8);
    this.r.drawSarchiRosette(W - 30, H - 18, 8);
  }

  drawOpponentIntro(oppData, stateTick) {
    const ctx = this.r.ctx;
    const W = this.r.W;
    const H = this.r.H;

    ctx.fillStyle = CONST.COLORS.NIGHT_SKY;
    ctx.fillRect(0, 0, W, H);
    this.r.drawSarchiBorder();

    const portraitImg = this.r.assets && this.r.assets.getPortraitImage(oppData.name, 'intro');
    const spriteAlpha = Math.min(1, stateTick / 15);

    if (portraitImg) {
      const pW = 108;
      const pH = 108;
      const px = 10;
      const py = 14;

      ctx.globalAlpha = spriteAlpha;
      ctx.save();
      ctx.beginPath();
      this._roundedRect(ctx, px, py, pW, pH, 6);
      ctx.clip();

      const bgGrad = ctx.createLinearGradient(px, py, px, py + pH);
      const portraitBgColors = {
        'DON CARLOS': '#3a1a0a', 'GRINGO': '#1a2a3a', 'CLARISA': '#3a1a2a',
        'PANZAEPERRA': '#2a2a0a', 'MICHIQUITO': '#3a1a2a', 'HITMENA': '#1a1a3a',
        'KAREN': '#2a0a2a', 'CARRETASTAR': '#2a1a0a', 'PERSEFONE': '#1a0a2a',
        'DON ALVARO': '#1a2a1a', 'ANAI': '#2a1a2a', 'SKIN': '#1a1a1a',
        'EL INDIO': '#2a1a0a',
      };
      const pc = portraitBgColors[oppData.name] || '#2a1a3a';
      bgGrad.addColorStop(0, pc);
      bgGrad.addColorStop(1, '#0a0a18');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(px, py, pW, pH);

      const spotGrad = ctx.createRadialGradient(px + pW / 2, py + pH * 0.4, 0, px + pW / 2, py + pH * 0.4, pW * 0.6);
      spotGrad.addColorStop(0, 'rgba(255,255,255,0.12)');
      spotGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = spotGrad;
      ctx.fillRect(px, py, pW, pH);

      this._drawPortraitCropped(ctx, portraitImg, px, py, pW, pH, oppData.name);
      ctx.restore();

      ctx.globalAlpha = spriteAlpha;
      ctx.strokeStyle = 'rgba(255,215,0,0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      this._roundedRect(ctx, px, py, pW, pH, 6);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255,215,0,0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      this._roundedRect(ctx, px - 2, py - 2, pW + 4, pH + 4, 8);
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else {
      const spriteX = 54;
      const spriteY = 68;
      ctx.globalAlpha = spriteAlpha;
      const frame = Math.floor(stateTick / 12) % 2;
      this.r.sprites.drawOpponentHead(ctx, oppData, frame, spriteX, spriteY, 3.5);
      ctx.globalAlpha = 1;
    }

    const textX = W / 2 + 42;
    const nameAlpha = Math.min(1, stateTick / 20);
    ctx.globalAlpha = nameAlpha;
    ctx.fillStyle = CONST.COLORS.WHITE;
    this.r._drawText(oppData.name, textX, 16, 'center', 2);
    ctx.globalAlpha = 1;

    if (stateTick > 15) {
      ctx.fillStyle = CONST.COLORS.YELLOW;
      this.r._drawText(oppData.title, textX, 38, 'center', 1);
    }

    if (stateTick > 60) {
      this._drawStatBar(ctx, 'VIT', oppData.health / 180, W / 2 + 14, 58, W / 2 - 32, CONST.COLORS.GREEN, stateTick - 60);
      this._drawStatBar(ctx, 'VEL', oppData.speed, W / 2 + 14, 78, W / 2 - 32, CONST.COLORS.LIGHT_BLUE, stateTick - 70);
    }

    let quoteText = oppData.quote;
    if (oppData.quotes && oppData.quotes.length > 0) {
      if (this._lastQuoteChar !== oppData.name) {
        this._lastQuoteChar = oppData.name;
        this._quoteIdx = Math.floor(Math.random() * oppData.quotes.length);
      }
      quoteText = oppData.quotes[this._quoteIdx];
    }
    if (stateTick > 30 && quoteText) {
      const quoteLines = quoteText.split('\n');
      const totalChars = quoteLines.join('').length;
      const charsVisible = Math.min(totalChars, Math.floor((stateTick - 30) / 1.5));
      let charCount = 0;
      ctx.fillStyle = CONST.COLORS.CREAM;
      for (let i = 0; i < quoteLines.length; i++) {
        const line = quoteLines[i];
        const lineStart = charCount;
        const lineEnd = charCount + line.length;
        if (charsVisible <= lineStart) break;
        const visible = Math.min(line.length, charsVisible - lineStart);
        const text = line.substring(0, visible);
        this.r._drawText(text, W / 2, 134 + i * 14, 'center', 1);
        charCount = lineEnd;
      }
    }

    this.r.drawSarchiStripe(20, H - 20, W - 40);
  }

  static PORTRAIT_CROPS = {
    'DON CARLOS':   { top: 0.20, bottom: 0.0, left: 0.0, right: 0.0, alignX: 0.5, alignY: 1.0, fit: 'contain' },
    'GRINGO':       { top: 0.14, bottom: 0.42, left: 0.18, right: 0.18, fit: 'cover' },
    'CLARISA':      { top: 0.14, bottom: 0.44, left: 0.22, right: 0.22, fit: 'cover' },
    'PANZAEPERRA':  { top: 0.14, bottom: 0.42, left: 0.18, right: 0.18, fit: 'cover' },
    'MICHIQUITO':   { top: 0.14, bottom: 0.44, left: 0.22, right: 0.22, fit: 'cover' },
    'HITMENA':      { top: 0.12, bottom: 0.44, left: 0.18, right: 0.18, fit: 'cover' },
    'EL INDIO':     { top: 0.12, bottom: 0.42, left: 0.18, right: 0.18, fit: 'cover' },
    'DON ALVARO':   { top: 0.12, bottom: 0.44, left: 0.20, right: 0.20, fit: 'cover' },
    'ANAI':         { top: 0.12, bottom: 0.44, left: 0.20, right: 0.20, fit: 'cover' },
    'PERSEFONE':    { top: 0.14, bottom: 0.44, left: 0.22, right: 0.22, fit: 'cover' },
    'SKIN':         { top: 0.14, bottom: 0.42, left: 0.18, right: 0.18, fit: 'cover' },
    'KAREN':        { top: 0.14, bottom: 0.42, left: 0.18, right: 0.18, fit: 'cover' },
    'CARRETASTAR':  { top: 0.12, bottom: 0.42, left: 0.18, right: 0.18, fit: 'cover' },
    'EL TORO':      { top: 0.14, bottom: 0.40, left: 0.14, right: 0.14, fit: 'cover' },
    'PLAYER':       { top: 0.14, bottom: 0.44, left: 0.22, right: 0.22, fit: 'cover' },
  };

  _drawPortraitCropped(ctx, img, dx, dy, dw, dh, charName) {
    const crop = (charName && UIManager.PORTRAIT_CROPS[charName]) || { top: 0.05, bottom: 0.30, left: 0.05, right: 0.05 };
    const sx = img.naturalWidth * crop.left;
    const sy = img.naturalHeight * crop.top;
    const sw = img.naturalWidth * (1 - crop.left - crop.right);
    const sh = img.naturalHeight * (1 - crop.top - crop.bottom);
    const srcAspect = sw / sh;
    const dstAspect = dw / dh;
    const alignX = (typeof crop.alignX === 'number') ? Math.max(0, Math.min(1, crop.alignX)) : 0.5;
    const alignY = (typeof crop.alignY === 'number') ? Math.max(0, Math.min(1, crop.alignY)) : 0.5;
    const fit = crop.fit === 'cover' ? 'cover' : 'contain';

    if (fit === 'cover') {
      let coverSX = sx;
      let coverSY = sy;
      let coverSW = sw;
      let coverSH = sh;
      if (srcAspect > dstAspect) {
        coverSW = sh * dstAspect;
        coverSX = sx + (sw - coverSW) * alignX;
      } else if (srcAspect < dstAspect) {
        coverSH = sw / dstAspect;
        coverSY = sy + (sh - coverSH) * alignY;
      }
      ctx.drawImage(img, coverSX, coverSY, coverSW, coverSH, dx, dy, dw, dh);
      return;
    }

    let drawW = dw;
    let drawH = dh;
    let drawX = dx;
    let drawY = dy;
    if (srcAspect > dstAspect) {
      drawH = dw / srcAspect;
      drawY = dy + (dh - drawH) * alignY;
    } else {
      drawW = dh * srcAspect;
      drawX = dx + (dw - drawW) * alignX;
    }

    ctx.drawImage(img, sx, sy, sw, sh, drawX, drawY, drawW, drawH);
  }

  _roundedRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  _drawStatBar(ctx, label, fraction, x, y, w, color, animTick) {
    const fill = Math.min(1, animTick / 30) * Math.min(1, fraction);
    ctx.fillStyle = CONST.COLORS.WHITE;
    this.r._drawText(label, x, y, 'left', 1);
    ctx.fillStyle = CONST.COLORS.DARK_GRAY;
    ctx.fillRect(x + 36, y + 1, w - 36, 8);
    ctx.fillStyle = color;
    ctx.fillRect(x + 36, y + 1, (w - 36) * fill, 8);
  }

  drawBullIntro(stateTick) {
    const ctx = this.r.ctx;
    const W = this.r.W;
    const H = this.r.H;

    const shakeX = stateTick > 20 ? (Math.random() - 0.5) * 4 : 0;
    const shakeY = stateTick > 20 ? (Math.random() - 0.5) * 4 : 0;
    ctx.save();
    ctx.translate(shakeX, shakeY);

    ctx.fillStyle = CONST.COLORS.BLACK;
    ctx.fillRect(0, 0, W, H);

    if (Math.floor(stateTick / 8) % 2 === 0 && stateTick > 10) {
      ctx.fillStyle = 'rgba(196, 30, 58, 0.15)';
      ctx.fillRect(0, 0, W, H);
    }

    if (stateTick > 15) {
      const bullAlpha = Math.min(1, (stateTick - 15) / 25);
      const spotGrad = ctx.createRadialGradient(W/2, 65, 0, W/2, 65, 60);
      spotGrad.addColorStop(0, `rgba(196,30,58,${bullAlpha * 0.2})`);
      spotGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = spotGrad;
      ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = bullAlpha;
      const frame = Math.floor(stateTick / 8) % 2;
      this.r.sprites.drawOpponentHead(ctx, TORO_DATA, frame, W / 2, 55, 3.5);
      ctx.globalAlpha = 1;
    }

    if (stateTick > 10) {
      ctx.fillStyle = CONST.COLORS.RED;
      this.r._drawText('EL TORO', W / 2, 110, 'center', 3);
    }
    if (stateTick > 30) {
      ctx.fillStyle = CONST.COLORS.DARK_RED;
      this.r._drawText('MALACRIANZA', W / 2, 138, 'center', 1.8);
    }

    if (Math.floor(stateTick / 6) % 2 === 0 && stateTick > 50) {
      ctx.fillStyle = CONST.COLORS.YELLOW;
      this.r._drawText('!! PELIGRO !!', W / 2, 162, 'center', 1.5);
    }

    if (stateTick > 40) {
      const barsAlpha = Math.min(1, (stateTick - 40) / 20);
      ctx.globalAlpha = barsAlpha;
      this._drawStatBar(ctx, 'VIT', 1.0, 24, 186, W - 48, CONST.COLORS.RED, stateTick - 40);
      this._drawStatBar(ctx, 'VEL', TORO_DATA.speed, 24, 202, W - 48, CONST.COLORS.ORANGE, stateTick - 50);
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }

  drawRoundEnd(winner, stateTick, koLine) {
    const ctx = this.r.ctx;
    const W = this.r.W;
    const H = this.r.H;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, W, H);

    if (winner === 'player') {
      ctx.fillStyle = CONST.COLORS.GOLD;
      this.r._drawText('GANASTE LA RONDA!', W / 2, H / 2 - 20, 'center', 1.8);
    } else {
      ctx.fillStyle = CONST.COLORS.RED;
      this.r._drawText('PERDISTE LA RONDA', W / 2, H / 2 - 20, 'center', 1.8);
    }

    if (koLine && stateTick > 20) {
      const alpha = Math.min(1, (stateTick - 20) / 15);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = CONST.COLORS.YELLOW;
      this.r._drawText(koLine, W / 2, H / 2 + 14, 'center', 1.3);
      ctx.globalAlpha = 1;
    }
  }

  drawFightWin(oppName, stateTick, score, winLine, koLine, defeatQuote) {
    const ctx = this.r.ctx;
    const W = this.r.W;
    const H = this.r.H;

    ctx.fillStyle = CONST.COLORS.NIGHT_SKY;
    ctx.fillRect(0, 0, W, H);
    this.r.drawFireworks(stateTick);
    this.r.drawSarchiBorder();

    if (stateTick % 6 === 0) {
      this.r.addConfetti(W / 2, 10, 3);
    }

    const winGlow = 0.07 + Math.sin(stateTick * 0.08) * 0.04;
    ctx.save();
    ctx.globalAlpha = winGlow;
    ctx.fillStyle = CONST.COLORS.GOLD;
    this.r._drawText(CONST.TEXT.TUANIS, W / 2, 20, 'center', 3.8);
    ctx.restore();
    ctx.fillStyle = CONST.COLORS.GOLD;
    this.r._drawText(CONST.TEXT.TUANIS, W / 2, 22, 'center', 3.5);

    if (stateTick > 15) {
      ctx.fillStyle = CONST.COLORS.YELLOW;
      this.r._drawText(oppName + ' TENDIDO!', W / 2, 60, 'center', 1.3);
    }

    if (stateTick > 30 && winLine) {
      ctx.fillStyle = CONST.COLORS.WHITE;
      this.r._drawText(winLine, W / 2, 82, 'center', 1.1);
    }

    if (stateTick > 50 && koLine) {
      ctx.fillStyle = CONST.COLORS.NEON_GREEN;
      this.r._drawText(koLine, W / 2, 100, 'center', 1);
    }

    if (stateTick > 70 && defeatQuote) {
      const alpha = Math.min(1, (stateTick - 70) / 20);
      ctx.globalAlpha = alpha;

      const defeatedPortrait = this.r.assets && this.r.assets.getPortraitImage(oppName, 'angry');
      if (defeatedPortrait) {
        const pSize = 32;
        ctx.globalAlpha = alpha;
        this._drawPortraitCropped(ctx, defeatedPortrait, W / 2 - pSize / 2, 108, pSize, pSize, oppName);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = CONST.COLORS.CREAM || '#F5DEB3';
        this.r._drawText('"' + defeatQuote + '"', W / 2, 146, 'center', 0.9);
      } else {
        ctx.fillStyle = CONST.COLORS.CREAM || '#F5DEB3';
        this.r._drawText('"' + defeatQuote + '"', W / 2, 122, 'center', 0.9);
      }
      ctx.globalAlpha = 1;
    }

    if (score !== undefined) {
      ctx.fillStyle = CONST.COLORS.GOLD;
      const scoreY = this.r.assets && this.r.assets.getPortraitImage(oppName, 'angry') ? 164 : 146;
      this.r._drawText('PUNTOS: ' + score, W / 2, scoreY, 'center', 1.4);
    }

    this.r._updateParticles(ctx);

    const victoryImg = this.r.assets && this.r.assets.getPoseImage('PLAYER', 'victory');
    if (victoryImg && stateTick > 10) {
      const vAlpha = Math.min(1, (stateTick - 10) / 20);
      const bounce = Math.sin(stateTick * 0.08) * 3;
      ctx.globalAlpha = vAlpha;
      const vh = 70;
      const va = victoryImg.naturalWidth / victoryImg.naturalHeight;
      const vw = vh * va;
      ctx.drawImage(victoryImg, W / 2 - vw / 2, H - vh - 8 + bounce, vw, vh);
      ctx.globalAlpha = 1;
    }

    this.r.drawSarchiRosette(W / 2, H - 28, 12);
  }

  drawContinueScreen(timeLeft, credits, tick, score) {
    const ctx = this.r.ctx;
    const W = this.r.W;
    const H = this.r.H;

    ctx.fillStyle = CONST.COLORS.BLACK;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = CONST.COLORS.GOLD;
    this.r._drawText('PUNTOS: ' + (score || 0), W / 2, 10, 'center', 1.2);

    const numColor = timeLeft <= 3
      ? (Math.floor(tick / 8) % 2 === 0 ? CONST.COLORS.RED : CONST.COLORS.DARK_RED)
      : CONST.COLORS.WHITE;
    ctx.fillStyle = numColor;
    this.r._drawText(String(Math.ceil(timeLeft)), W / 2, H / 2 - 30, 'center', 6);

    ctx.fillStyle = CONST.COLORS.WHITE;
    this.r._drawText('ECHE LA TEJA PARA', W / 2, H / 2 + 20, 'center', 1.2);
    this.r._drawText('SEGUIR PICHASEANDOSE', W / 2, H / 2 + 36, 'center', 1.2);

    const tejaRot = tick * 0.1;
    this.r.drawTeja(W / 2, H / 2 + 62, 16, tejaRot);

    ctx.fillStyle = CONST.COLORS.YELLOW;
    this.r._drawText(CONST.TEXT.TEJAS + ': ' + credits, W / 2, H - 16, 'center', 1.2);
  }

  drawGameOver(stateTick, score) {
    const ctx = this.r.ctx;
    const W = this.r.W;
    const H = this.r.H;

    const fade = Math.min(1, stateTick / 60);
    ctx.fillStyle = CONST.COLORS.BLACK;
    ctx.fillRect(0, 0, W, H);

    ctx.globalAlpha = fade;
    this.r.drawSarchiBorder();
    ctx.fillStyle = CONST.COLORS.RED;
    this.r._drawText(CONST.TEXT.GAME_OVER, W / 2, H / 2 - 24, 'center', 2.2);

    if (score !== undefined) {
      ctx.fillStyle = CONST.COLORS.GOLD;
      this.r._drawText('PUNTOS FINALES: ' + score, W / 2, H / 2 + 6, 'center', 1.3);
    }

    if (stateTick > 40) {
      const subAlpha = Math.min(1, (stateTick - 40) / 30);
      ctx.globalAlpha = subAlpha;
      const lines = CONST.TEXT.GAME_OVER_LINES || CONST.TEXT.LOSE_LINES;
      const loseLine = lines[Math.floor(stateTick / 90) % lines.length];
      ctx.fillStyle = CONST.COLORS.GRAY;
      this.r._drawText(loseLine, W / 2, H / 2 + 30, 'center', 1);
    }
    ctx.globalAlpha = 1;

    this.r.drawSarchiRosette(W / 2, H - 24, 10);
  }

  drawVictory(stateTick, score) {
    const ctx = this.r.ctx;
    const W = this.r.W;
    const H = this.r.H;

    ctx.fillStyle = CONST.COLORS.NIGHT_SKY;
    ctx.fillRect(0, 0, W, H);
    this.r.drawFireworks(stateTick);
    this.r.drawFireworks(stateTick + 45);
    this.r.drawSarchiBorder();

    if (stateTick % 4 === 0) {
      this.r.addConfetti(W / 2, -5, 2);
    }

    const bounce = Math.sin(stateTick * 0.1) * 4;
    const victGlow = 0.08 + Math.sin(stateTick * 0.08) * 0.05;
    ctx.save();
    ctx.globalAlpha = victGlow;
    ctx.fillStyle = CONST.COLORS.GOLD;
    this.r._drawText(CONST.TEXT.VICTORY, W / 2, 12 + bounce, 'center', 2.8);
    ctx.restore();
    ctx.fillStyle = CONST.COLORS.GOLD;
    this.r._drawText(CONST.TEXT.VICTORY, W / 2, 14 + bounce, 'center', 2.5);

    if (score !== undefined) {
      ctx.fillStyle = CONST.COLORS.YELLOW;
      this.r._drawText('PUNTOS: ' + score, W / 2, 40, 'center', 1.3);
    }

    if (stateTick > 30) {
      const victLine = CONST.TEXT.VICTORY_LINES[Math.floor(stateTick / 100) % CONST.TEXT.VICTORY_LINES.length];
      ctx.fillStyle = CONST.COLORS.WHITE;
      this.r._drawText(victLine, W / 2, 58, 'center', 1);
    }

    if (stateTick > 60) {
      const vLines = CONST.TEXT.VICTORY_LINES;
      const allItems = [];
      allItems.push({ text: '-- DERROTADOS --', color: CONST.COLORS.GRAY, scale: 0.9 });
      allItems.push({ text: '', color: null, scale: 0 });
      for (let i = 0; i < OPPONENT_DATA.length; i++) {
        allItems.push({ text: OPPONENT_DATA[i].name, color: CONST.COLORS.YELLOW, scale: 1.1 });
      }
      allItems.push({ text: TORO_DATA.name, color: CONST.COLORS.RED, scale: 1.3 });
      allItems.push({ text: '', color: null, scale: 0 });
      allItems.push({ text: '-- PURA VIDA --', color: CONST.COLORS.GRAY, scale: 0.9 });
      allItems.push({ text: '', color: null, scale: 0 });
      for (let i = 0; i < vLines.length; i++) {
        allItems.push({ text: vLines[i], color: CONST.COLORS.NEON_GREEN, scale: 1 });
      }
      allItems.push({ text: '', color: null, scale: 0 });
      allItems.push({ text: 'PICHASITOS', color: CONST.COLORS.GOLD, scale: 1.5 });
      allItems.push({ text: 'FIESTAS DE SANTA CRUZ', color: CONST.COLORS.WHITE, scale: 1 });
      allItems.push({ text: '', color: null, scale: 0 });
      allItems.push({ text: 'ECHE LA TEJA', color: CONST.COLORS.YELLOW, scale: 1 });
      allItems.push({ text: 'PARA JUGAR DE NUEVO', color: CONST.COLORS.YELLOW, scale: 1 });

      const totalH = allItems.length * 18;
      const scrollSpeed = 0.35;
      const scrollY = 80 - ((stateTick - 60) * scrollSpeed) % (totalH + 80);

      ctx.save();
      ctx.beginPath();
      ctx.rect(6, 66, W - 12, H - 86);
      ctx.clip();
      for (let i = 0; i < allItems.length; i++) {
        const item = allItems[i];
        const y = scrollY + i * 18;
        if (y < 58 || y > H - 14 || !item.text) continue;
        ctx.fillStyle = item.color;
        this.r._drawText(item.text, W / 2, y, 'center', item.scale);
      }
      ctx.restore();
    }

    this.r._updateParticles(ctx);

    this.r.drawSarchiRosette(30, H - 16, 8);
    this.r.drawSarchiRosette(W - 30, H - 16, 8);
  }

  drawNameEntry(nameEntry, score, stateTick, tick) {
    const ctx = this.r.ctx;
    const W = this.r.W;
    const H = this.r.H;
    const ne = nameEntry;

    ctx.fillStyle = CONST.COLORS.BLACK;
    ctx.fillRect(0, 0, W, H);
    this.r.drawSarchiBorder();

    ctx.fillStyle = CONST.COLORS.GOLD;
    this.r._drawText('MEJORES PICHASEADORES', W / 2, 14, 'center', 1.8);

    this.r.drawSarchiStripe(20, 34, W - 40);

    ctx.fillStyle = CONST.COLORS.YELLOW;
    this.r._drawText('PUNTOS: ' + (score || 0), W / 2, 44, 'center', 1.5);

    ctx.fillStyle = CONST.COLORS.WHITE;
    this.r._drawText('DIGITE SU NOMBRE', W / 2, 72, 'center', 1.2);

    const charW = 24;
    const totalW = charW * 3;
    const startX = W / 2 - totalW / 2;

    for (let i = 0; i < 3; i++) {
      const cx = startX + i * charW + charW / 2;
      const isActive = !ne.done && i === ne.pos;

      if (isActive) {
        ctx.fillStyle = CONST.COLORS.NEON_GREEN;
        ctx.fillRect(cx - 8, 88, 16, 28);

        ctx.fillStyle = CONST.COLORS.WHITE;
        const arrowBounce = Math.sin(tick * 0.15) * 2;
        this.r._drawText('^', cx, 82 + arrowBounce, 'center', 1);
        this.r._drawText('v', cx, 118 - arrowBounce, 'center', 1);
      }

      ctx.fillStyle = isActive ? CONST.COLORS.BLACK : (ne.done ? CONST.COLORS.GOLD : CONST.COLORS.WHITE);
      this.r._drawText(ne.chars[i], cx, 94, 'center', 2.5);
    }

    if (!ne.done) {
      if (Math.floor(tick / 20) % 2 === 0) {
        ctx.fillStyle = CONST.COLORS.NEON_GREEN;
        this.r._drawText('PICHAZO PARA CONFIRMAR', W / 2, 140, 'center', 1);
      }
      ctx.fillStyle = CONST.COLORS.GRAY;
      this.r._drawText('ARRIBA/ABAJO: LETRA', W / 2, 160, 'center', 0.8);
      this.r._drawText('PICHAZO IZQ/DER: SIGUIENTE', W / 2, 174, 'center', 0.8);
    } else {
      const bounce = Math.sin(tick * 0.12) * 3;
      ctx.fillStyle = CONST.COLORS.GOLD;
      this.r._drawText('PURA VIDA ' + ne.chars.join('') + '!', W / 2, 140 + bounce, 'center', 1.5);
    }

    this.r.drawSarchiRosette(30, H - 16, 8);
    this.r.drawSarchiRosette(W - 30, H - 16, 8);
  }

  drawOperatorScreen(stats) {
    const ctx = this.r.ctx;
    const W = this.r.W;
    const H = this.r.H;

    ctx.fillStyle = CONST.COLORS.BLACK;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = CONST.COLORS.WHITE;
    this.r._drawText('OPERADOR', W / 2, 14, 'center', 1.8);

    const rows = [
      ['GANANCIAS', stats.totalEarnings + ' CRC'],
      ['PARTIDAS', String(stats.gamesPlayed)],
      ['TEJAS', String(stats.credits)],
    ];
    for (let i = 0; i < rows.length; i++) {
      const y = 42 + i * 20;
      ctx.fillStyle = CONST.COLORS.GRAY;
      this.r._drawText(rows[i][0], 16, y, 'left', 1);
      ctx.fillStyle = CONST.COLORS.WHITE;
      this.r._drawText(rows[i][1], W - 16, y, 'right', 1);
    }

    ctx.fillStyle = CONST.COLORS.GRAY;
    ctx.fillRect(16, 100, W - 32, 1);

    ctx.fillStyle = CONST.COLORS.WHITE;
    this.r._drawText('MEJORES PICHASEADORES', 16, 110, 'left', 1.2);
    const hs = stats.highScores || [];
    for (let i = 0; i < Math.min(hs.length, 6); i++) {
      const entry = hs[i];
      const y = 128 + i * 14;
      const rank = String(i + 1) + '.';
      const name = entry.name || '???';
      const pts = String(entry.score || 0);
      ctx.fillStyle = i === 0 ? CONST.COLORS.GOLD : CONST.COLORS.WHITE;
      this.r._drawText(rank + ' ' + name, 16, y, 'left', 1);
      this.r._drawText(pts, W - 16, y, 'right', 1);
    }
  }
}
