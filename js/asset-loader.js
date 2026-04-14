class AssetLoader {
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

  static BACKGROUNDS = [
    'arena_pueblo', 'arena_feria', 'arena_redondel', 'arena_muerte',
    'title_bg', 'map_bg',
  ];

  constructor() {
    this._enemies = {};
    this._portraits = {};
    this._poses = {};
    this._backgrounds = {};
    this._loaded = false;
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
      img.src = src + '?t=1775968431';
    });
  }

  preload() {
    if (this._loadPromise) return this._loadPromise;

    const tasks = [];
    const slugs = Object.values(AssetLoader.SLUGS);

    for (const slug of slugs) {
      tasks.push(
        this._loadImage(`assets/enemies/enemy_${slug}_idle_v1.png`)
          .then(img => { if (img) this._enemies[slug] = img; })
      );
      tasks.push(
        this._loadImage(`assets/portraits/portrait_${slug}_angry_v1.png`)
          .then(img => { if (img) this._portraits[slug] = img; })
      );
      for (const pose of AssetLoader.POSES) {
        const filePose = (slug === 'bull' && AssetLoader.BULL_POSE_ALIASES[pose]) || pose;
        tasks.push(
          this._loadImage(`assets/poses/${slug}/enemy_${slug}_${filePose}_v1.png`)
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
            this._loadImage(`assets/poses/${slug}/enemy_${slug}_${filePose}_v1_f${f}.png`)
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
    }

    for (const bgName of AssetLoader.BACKGROUNDS) {
      tasks.push(
        this._loadImage(`assets/ui_bg/${bgName}.png`)
          .then(img => { if (img) this._backgrounds[bgName] = img; })
      );
    }

    this._loadPromise = Promise.all(tasks).then(() => {
      this._loaded = true;
    });
    return this._loadPromise;
  }

  get loaded() { return this._loaded; }

  getEnemyImage(nameOrSlug) {
    const slug = AssetLoader.SLUGS[nameOrSlug] || nameOrSlug;
    return this._enemies[slug] || null;
  }

  getPortraitImage(nameOrSlug) {
    const slug = AssetLoader.SLUGS[nameOrSlug] || nameOrSlug;
    return this._portraits[slug] || null;
  }

  getBackground(name) {
    return this._backgrounds[name] || null;
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
