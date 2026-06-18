class AssetLoader {
  static ASSET_VERSION = typeof PICHASITOS_CACHE_VERSION !== 'undefined'
    ? PICHASITOS_CACHE_VERSION
    : '20260618_bull_player_red_gloves_v3';
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
    'EL TORO MALACRIANZA': 'bull',
    'PLAYER':       'player',
  };

  /** Fight order (matches OPPONENT_DATA + bull finale). */
  static FIGHT_SLUGS = [
    'don_carlos', 'gringo', 'clarisa', 'panzaeperra', 'michiquito', 'hitmena',
    'karen', 'carretastar', 'persefone', 'don_alvaro', 'anai', 'skin', 'el_indio', 'bull',
  ];

  static FIGHT_CIRCUIT_BY_INDEX = [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3];

  static CIRCUIT_ARENAS = ['arena_pueblo', 'arena_feria', 'arena_redondel', 'arena_muerte'];

  static BULL_POSE_ALIASES = {
    'punch_left':  'horn_left',
    'punch_right': 'horn_right',
    'windup':      'charge',
    'block':       'stomp',
    'sig_attack':  'sig_charge',
  };

  static UI_MAP_TITLE_BACKGROUNDS = ['title_bg', 'map_bg'];

  static FALLBACK_VERSIONS = ['v3', 'v1'];

  static INITIAL_FIGHTER_SLUG = 'don_carlos';

  static MANIFEST_PATH = 'assets/asset-manifest.json';

  constructor() {
    this._enemies = {};
    this._portraits = {};
    this._poses = {};
    this._backgrounds = {};
    this._monsters = {};
    this._manifest = null;
    this._fighterBundles = new Set();
    this._fighterPromises = new Map();
    this._priorityReady = false;
    this._loadPromise = null;
    this._monstersLoaded = false;
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

  async _loadManifest() {
    if (this._manifest) return this._manifest;
    const url = `${AssetLoader.MANIFEST_PATH}?v=${AssetLoader.ASSET_VERSION}`;
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this._manifest = await res.json();
      return this._manifest;
    } catch (e) {
      console.warn(
        'AssetLoader: asset-manifest.json missing or unreadable. Run: python tools/generate_asset_manifest.py',
        e
      );
      this._manifest = { fighters: {}, backgrounds: {}, monsters: {} };
      return this._manifest;
    }
  }

  _fighterEntry(slug) {
    return (this._manifest && this._manifest.fighters && this._manifest.fighters[slug]) || null;
  }

  _manifestPath(path) {
    if (!path) return null;
    return this._loadImage(path);
  }

  async _loadFallbackAtStem(pathStem) {
    for (const version of AssetLoader.FALLBACK_VERSIONS) {
      const img = await this._loadImage(`${pathStem}_${version}.png`);
      if (img) return img;
    }
    return null;
  }

  _loadEnemyIdle(slug) {
    const entry = this._fighterEntry(slug);
    if (entry && entry.idle) {
      return this._manifestPath(entry.idle).then(img => {
        if (img) this._enemies[slug] = img;
      });
    }
    const stem = `assets/enemies/enemy_${slug}_idle`;
    return this._loadFallbackAtStem(stem).then(img => {
      if (img) this._enemies[slug] = img;
    });
  }

  _loadPortrait(slug, variant) {
    const entry = this._fighterEntry(slug);
    const path = entry && entry.portraits && entry.portraits[variant];
    const load = path
      ? this._manifestPath(path)
      : this._loadFallbackAtStem(`assets/portraits/portrait_${slug}_${variant}`);
    return load.then(img => {
      if (!this._portraits[slug]) this._portraits[slug] = {};
      if (img) this._portraits[slug][variant] = img;
    });
  }

  _loadAllIntroPortraits() {
    const slugs = Object.values(AssetLoader.SLUGS);
    return Promise.all(slugs.map(slug => this._loadPortrait(slug, 'intro')));
  }

  async _loadAllPosesForSlug(slug) {
    const entry = this._fighterEntry(slug);
    if (entry && entry.poses) {
      const tasks = [];
      for (const [pose, paths] of Object.entries(entry.poses)) {
        if (!Array.isArray(paths) || paths.length === 0) continue;
        for (let i = 0; i < paths.length; i++) {
          const path = paths[i];
          tasks.push(
            this._manifestPath(path).then(img => {
              if (img) {
                if (!this._poses[slug]) this._poses[slug] = {};
                if (!this._poses[slug][pose]) this._poses[slug][pose] = [];
                this._poses[slug][pose][i] = img;
              }
            })
          );
        }
      }
      await Promise.all(tasks);
      return;
    }

    for (const pose of ['idle', 'punch_left', 'punch_right', 'hurt', 'block', 'ko', 'windup', 'taunt', 'sig_attack', 'victory']) {
      const filePose = (slug === 'bull' && AssetLoader.BULL_POSE_ALIASES[pose]) || pose;
      const stem = `assets/poses/${slug}/enemy_${slug}_${filePose}`;
      const img = await this._loadFallbackAtStem(stem);
      if (img) {
        if (!this._poses[slug]) this._poses[slug] = {};
        if (!this._poses[slug][pose]) this._poses[slug][pose] = [];
        this._poses[slug][pose][0] = img;
      }
    }
  }

  _loadCircuitBackground(circuitIndex) {
    const bgName = AssetLoader.CIRCUIT_ARENAS[circuitIndex];
    if (!bgName || this._backgrounds[bgName]) return Promise.resolve();
    const path = this._manifest && this._manifest.backgrounds && this._manifest.backgrounds[bgName];
    if (path) {
      return this._manifestPath(path).then(img => {
        if (img) this._backgrounds[bgName] = img;
      });
    }
    return this._loadImage(`assets/ui_bg/${bgName}.jpg`).then(img => {
      if (img) this._backgrounds[bgName] = img;
    });
  }

  _loadBackgroundByName(bgName) {
    if (!bgName || this._backgrounds[bgName]) return Promise.resolve();
    const path = this._manifest && this._manifest.backgrounds && this._manifest.backgrounds[bgName];
    if (path) {
      return this._manifestPath(path).then(img => {
        if (img) this._backgrounds[bgName] = img;
      });
    }
    return Promise.all([
      this._loadImage(`assets/ui_bg/${bgName}.png`),
      this._loadImage(`assets/ui_bg/${bgName}.jpg`),
    ]).then(([png, jpg]) => {
      const img = png || jpg;
      if (img) this._backgrounds[bgName] = img;
    });
  }

  _loadMonsters() {
    if (this._monstersLoaded) return Promise.resolve();
    this._monstersLoaded = true;
    const manifestMonsters = (this._manifest && this._manifest.monsters) || {};
    const names = Object.keys(manifestMonsters).length > 0
      ? Object.keys(manifestMonsters)
      : [
        'monster_cadejos', 'monster_segua', 'monster_llorona',
        'monster_carreta', 'monster_padre',
        'monster_tulevieja', 'monster_mico_malo', 'monster_bruja_zarate',
      ];
    return Promise.all(
      names.map(mName => {
        const path = manifestMonsters[mName] || `assets/monsters/${mName}.png`;
        return this._manifestPath(path).then(img => {
          if (img) this._monsters[mName] = img;
        });
      })
    );
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

  /**
   * Full combat bundle for one fighter: idle, poses, angry portrait.
   * Intro portraits are loaded separately at boot for the world map.
   */
  preloadFighterBundle(nameOrSlug) {
    const slug = this._slugFor(nameOrSlug);
    if (this._fighterBundles.has(slug)) return Promise.resolve();
    if (this._fighterPromises.has(slug)) return this._fighterPromises.get(slug);

    const promise = (async () => {
      await Promise.all([
        this._loadEnemyIdle(slug),
        this._loadAllPosesForSlug(slug),
        this._loadPortrait(slug, 'angry'),
      ]);
      this._fighterBundles.add(slug);
      this._finalizePortraitFallbacks();
    })();

    this._fighterPromises.set(slug, promise);
    return promise;
  }

  /**
   * When fight N starts, preload fight N+1 (and its arena / monsters if needed).
   */
  preloadAheadOfFight(fightIndex) {
    const nextIdx = fightIndex + 1;
    if (nextIdx >= AssetLoader.FIGHT_SLUGS.length) return Promise.resolve();

    const slug = AssetLoader.FIGHT_SLUGS[nextIdx];
    const tasks = [this.preloadFighterBundle(slug)];

    const circuit = AssetLoader.FIGHT_CIRCUIT_BY_INDEX[nextIdx];
    if (circuit !== undefined) {
      tasks.push(this._loadCircuitBackground(circuit));
      if (circuit === 3) tasks.push(this._loadMonsters());
    }

    return Promise.all(tasks);
  }

  preload() {
    if (this._loadPromise) return this._loadPromise;

    this._loadPromise = (async () => {
      try {
        await this._loadManifest();
        await Promise.all([
          this.preloadFighterBundle('player'),
          this.preloadFighterBundle(AssetLoader.INITIAL_FIGHTER_SLUG),
          this._loadAllIntroPortraits(),
          this._loadCircuitBackground(0),
          ...AssetLoader.UI_MAP_TITLE_BACKGROUNDS.map(bgName => this._loadBackgroundByName(bgName)),
        ]);
        this._finalizePortraitFallbacks();
        this._priorityReady = true;
      } catch (e) {
        console.error('AssetLoader.preload failed:', e);
        this._finalizePortraitFallbacks();
        this._priorityReady = true;
      }
    })();

    return this._loadPromise;
  }

  /** Dev / preview: load every fighter and arena. */
  preloadAll() {
    return this.preload().then(async () => {
      const slugs = AssetLoader.FIGHT_SLUGS.filter(s => s !== AssetLoader.INITIAL_FIGHTER_SLUG);
      await Promise.all(slugs.map(slug => this.preloadFighterBundle(slug)));
      await Promise.all([1, 2, 3].map(i => this._loadCircuitBackground(i)));
      await this._loadMonsters();
    });
  }

  get loaded() { return this._priorityReady; }

  get priorityReady() { return this._priorityReady; }

  isFighterBundleReady(nameOrSlug) {
    const slug = this._slugFor(nameOrSlug);
    if (slug === 'player') {
      return !!this.getPoseImage('PLAYER', 'idle', 0);
    }
    return this._fighterBundles.has(slug) || this.hasPoses(slug);
  }

  areFightAssetsReady(circuitIndex, opponentName) {
    if (!this._priorityReady) return false;
    const bgKey = AssetLoader.CIRCUIT_ARENAS[circuitIndex];
    if (!bgKey || !this.getBackground(bgKey)) return false;
    if (!this.isFighterBundleReady('PLAYER')) return false;
    return this.isFighterBundleReady(opponentName);
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
