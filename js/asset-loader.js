class AssetLoader {
  static ASSET_VERSION = '20260414_v3_arena_jpg';
  static SLUGS = {
    'DON CARLOS':   'don_carlos',
    'GRINGO':       'gringo',
    'CLARISA':      'clarisa',
    'PANZAEPERRA':  'panzaeperra',
    'MICHIQUITO':   'michiquito',
    'HITMENA':      'hitmena',
    'KAREN':        'karen',
    'CARRETASTAR':  'carretastar',
    'PERSEFONE':    'persefone',
    'DON ALVARO':   'don_alvaro',
    'ANAI':         'anai',
    'SKIN':         'skin',
    'EL INDIO':     'el_indio',
    'EL TORO':      'bull',
    'PLAYER':       'player',
  };

  static POSES = [
    'idle', 'punch_left', 'punch_right', 'hurt', 'block',
    'dodge_left', 'dodge_back', 'dodge_right',
    'ko', 'windup', 'taunt', 'sig_attack', 'victory',
  ];

  static BULL_POSE_ALIASES = {
    'punch_left':  'horn_left',
    'punch_right': 'horn_right',
    'windup':      'charge',
    'block':       'stomp',
    'sig_attack':  'sig_charge',
  };

  static MAX_FRAMES = 3;

  /** Full list (player + priority fighters first, then arenas, title/map, etc.). */
  static BACKGROUNDS = [
    'arena_pueblo', 'arena_feria', 'arena_redondel', 'arena_muerte',
    'title_bg', 'map_bg',
  ];

  static UI_MAP_TITLE_BACKGROUNDS = ['title_bg', 'map_bg'];

  static MONSTERS = [
    'monster_cadejos', 'monster_segua', 'monster_llorona',
    'monster_carreta', 'monster_padre',
    'monster_tulevieja', 'monster_mico_malo', 'monster_bruja_zarate',
  ];

  constructor() {
    this._enemies = {};
    this._portraits = {};
    this._poses = {};
    this._backgrounds = {};
    this._monsters = {};
    this._loaded = false;
    this._priorityReady = false;
    this._loadPromise = null;
  }

  _slugFor(name) {
    return AssetLoader.SLUGS[name] || name.toLowerCase().replace(/\s+/g, '_');
  }

  _loadImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = `${src}?v=${AssetLoader.ASSET_VERSION}`;
    });
  }

  /** First-circuit fighters: load before other opponents so Pueblo / first fight never flashes v1 sprites. */
  static PRIORITY_SLUGS = ['player', 'don_carlos'];

  _loadEnemyIdle(slug) {
    return this._loadImage(`assets/enemies/enemy_${slug}_idle_v2.png`)
      .then(img => img || this._loadImage(`assets/enemies/enemy_${slug}_idle_v1.png`))
      .then(img => { if (img) this._enemies[slug] = img; });
  }

  _loadPortraitsForSlug(slug) {
    return Promise.all([
      this._loadImage(`assets/portraits/portrait_${slug}_angry_v1.png`).then(img => {
        if (!this._portraits[slug]) this._portraits[slug] = {};
        if (img) this._portraits[slug].angry = img;
      }),
      this._loadImage(`assets/portraits/portrait_${slug}_intro_v1.png`).then(img => {
        if (!this._portraits[slug]) this._portraits[slug] = {};
        if (img) this._portraits[slug].intro = img;
      }),
    ]);
  }

  _loadAllPosesForSlug(slug) {
    const tasks = [];
    for (const pose of AssetLoader.POSES) {
      const filePose = (slug === 'bull' && AssetLoader.BULL_POSE_ALIASES[pose]) || pose;
      tasks.push(
        this._loadImage(`assets/poses/${slug}/enemy_${slug}_${filePose}_v2.png`)
          .then(img => img || this._loadImage(`assets/poses/${slug}/enemy_${slug}_${filePose}_v1.png`))
          .then(img => {
            if (img) {
              if (!this._poses[slug]) this._poses[slug] = {};
              if (!this._poses[slug][pose]) this._poses[slug][pose] = [];
              this._poses[slug][pose][0] = img;
            }
          })
      );
      for (let f = 2; f <= AssetLoader.MAX_FRAMES; f++) {
        tasks.push(
          this._loadImage(`assets/poses/${slug}/enemy_${slug}_${filePose}_v2_f${f}.png`)
            .then(img => img || this._loadImage(`assets/poses/${slug}/enemy_${slug}_${filePose}_v1_f${f}.png`))
            .then(img => {
              if (img) {
                if (!this._poses[slug]) this._poses[slug] = {};
                if (!this._poses[slug][pose]) this._poses[slug][pose] = [];
                this._poses[slug][pose][f - 1] = img;
              }
            })
        );
      }
    }
    return tasks;
  }

  _finalizePortraitFallbacks() {
    const slugs = Object.values(AssetLoader.SLUGS);
    for (const slug of slugs) {
      if (!this._portraits[slug]) this._portraits[slug] = {};
      if (!this._portraits[slug].intro) {
        const idlePose = this._poses[slug] && this._poses[slug]['idle'] && this._poses[slug]['idle'][0];
        if (idlePose) this._portraits[slug].intro = idlePose;
      }
    }
  }

  preload() {
    if (this._loadPromise) return this._loadPromise;

    const slugs = Object.values(AssetLoader.SLUGS);
    const priority = AssetLoader.PRIORITY_SLUGS;

    this._loadPromise = (async () => {
      try {
        await Promise.all(
          priority.flatMap(slug => [
            this._loadEnemyIdle(slug),
            ...this._loadAllPosesForSlug(slug),
          ])
        );

        const arenaKeys =
          typeof CONST !== 'undefined' && CONST.CIRCUIT_BACKGROUNDS
            ? CONST.CIRCUIT_BACKGROUNDS
            : ['arena_pueblo', 'arena_feria', 'arena_redondel', 'arena_muerte'];
        await Promise.all(
          arenaKeys.map(bgName =>
            this._loadImage(`assets/ui_bg/${bgName}.jpg`).then(img => {
              if (img) this._backgrounds[bgName] = img;
            })
          )
        );
        await Promise.all(
          AssetLoader.UI_MAP_TITLE_BACKGROUNDS.map(bgName =>
            this._loadImage(`assets/ui_bg/${bgName}.png`).then(img => {
              if (img) this._backgrounds[bgName] = img;
            })
          )
        );

        await Promise.all(slugs.map(s => this._loadPortraitsForSlug(s)));

        this._priorityReady = true;

        const phase4 = [];
        for (const slug of slugs) {
          if (priority.indexOf(slug) >= 0) continue;
          phase4.push(this._loadEnemyIdle(slug));
          phase4.push(...this._loadAllPosesForSlug(slug));
        }
        for (const mName of AssetLoader.MONSTERS) {
          phase4.push(
            this._loadImage(`assets/monsters/${mName}.png`).then(img => {
              if (img) this._monsters[mName] = img;
            })
          );
        }
        await Promise.all(phase4);

        this._finalizePortraitFallbacks();
        this._loaded = true;
      } catch (e) {
        console.error('AssetLoader.preload failed:', e);
        this._finalizePortraitFallbacks();
        this._priorityReady = true;
        this._loaded = true;
      }
    })();

    return this._loadPromise;
  }

  get loaded() { return this._loaded; }

  /** True after player + Don Carlos poses, backgrounds, and all portraits are in memory. */
  get priorityReady() { return this._priorityReady; }

  /**
   * Ready to render a fight: circuit background + player idle + this opponent's idle.
   * While the rest of the roster (phase 4) loads, we wait until this opponent's data exists.
   * After full preload(), allow the fight even if an image failed (avoid soft-lock).
   */
  areFightAssetsReady(circuitIndex, opponentName) {
    if (!this._priorityReady) return false;
    const bgKey = typeof CONST !== 'undefined' && CONST.CIRCUIT_BACKGROUNDS
      ? CONST.CIRCUIT_BACKGROUNDS[circuitIndex]
      : null;
    if (!bgKey || !this.getBackground(bgKey)) return false;
    const pIdle = this.getPoseImage('PLAYER', 'idle', 0);
    const oIdle = this.getPoseImage(opponentName, 'idle', 0);
    if (pIdle && oIdle) return true;
    return !!this._loaded;
  }

  getEnemyImage(nameOrSlug) {
    const slug = AssetLoader.SLUGS[nameOrSlug] || nameOrSlug;
    return this._enemies[slug] || null;
  }

  getPortraitImage(nameOrSlug, variant = 'angry') {
    const slug = AssetLoader.SLUGS[nameOrSlug] || nameOrSlug;
    const entry = this._portraits[slug];
    if (!entry) return null;
    return entry[variant] || entry.angry || entry.intro || null;
  }

  getBackground(name) {
    return this._backgrounds[name] || null;
  }

  getMonster(name) {
    return this._monsters[name] || null;
  }

  getPoseImage(nameOrSlug, pose, frame) {
    const slug = AssetLoader.SLUGS[nameOrSlug] || nameOrSlug;
    const poses = this._poses[slug];
    if (!poses) return null;
    const frames = poses[pose] || poses['idle'];
    if (!frames) return null;
    if (Array.isArray(frames)) {
      const f = (frame || 0) % frames.length;
      return frames[f] || frames[0] || null;
    }
    return frames;
  }

  getPoseFrameCount(nameOrSlug, pose) {
    const slug = AssetLoader.SLUGS[nameOrSlug] || nameOrSlug;
    const poses = this._poses[slug];
    if (!poses) return 1;
    const frames = poses[pose];
    if (!frames) return 1;
    if (Array.isArray(frames)) return frames.filter(Boolean).length || 1;
    return 1;
  }

  hasPoses(nameOrSlug) {
    const slug = AssetLoader.SLUGS[nameOrSlug] || nameOrSlug;
    return !!(this._poses[slug] && Object.keys(this._poses[slug]).length > 0);
  }
}
