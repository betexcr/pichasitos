# Sprite assets (SNES-style layout)

This folder mirrors how classic 16-bit games often organized **character folders** plus a separate **motion** definition—in this project the “tiles” are **ASCII grids** and colors live in `palette.json`, not PNG sprite sheets.

## Source of truth

Runtime code still loads everything from **`js/sprites.js`**. After you edit that file, refresh the exports:

```bash
node sprite-assets/tools/export-sprites.mjs
```

## Layout

| Path | Contents |
|------|-----------|
| **`characters/<slug>/`** | One folder per fighter (`player`, `bull`, `don_carlos`, …). |
| **`characters/<slug>/head.txt`** | Head pixel grid (one row per line; each char = palette key). |
| **`characters/<slug>/torso.txt`** | Torso (opponents + player). |
| **`characters/<slug>/body.txt`** | Body only for **`bull`**. |
| **`characters/<slug>/fist.txt`** | Glove / fist mini-sprite. |
| **`characters/<slug>/palette.json`** | Map from character → hex color. |
| **`characters/<slug>/meta.json`** | Which parts exist for that character. |
| **`animations/action-frames.json`** | **Action “animations”**: list of frames with offsets (see below). |
| **`index.json`** | Manifest: all character slugs + animation names. |

`.` in a grid = empty pixel.

## How “animations” work here (vs full SNES ROM art)

In many SNES fighters you get **dedicated bitmaps per frame**. In *this* engine, almost all actions reuse the **same** head/torso/fist art: `SpriteSystem.ANIM` moves pieces by **integer pixel offsets** (and fist “extension”) each frame. So:

- **`animations/action-frames.json`** = the timeline for each action (`idle`, `punch_left`, `sig_combo`, …).
- Each entry in an action lists **`headOffset`**, **`torsoOffset`**, arm offsets, and fist extension—matching `drawPlayer` / `drawOpponent` in `js/sprites.js`.

Special cases coded in JS (not expressed as extra files here):

- **Player** arms are drawn procedurally (`_drawTaperedArm`), not from `.txt` grids.
- **hurt** / **ko** swap the head grid via `_makeHurtHead`.
- **Bull** uses angry palette tweaks for some states.

## Preview (see colors)

`fetch()` needs **http** (not `file://`).

**Option A — server already on the project root** (e.g. `python3 -m http.server 8080` from the repo root, same as the main game):

Open **http://localhost:8080/sprite-assets/preview.html** (use whatever port your server uses).

**Option B — dedicated preview server** (only serves this folder):

```bash
cd sprite-assets && python3 -m http.server 8765
```

Then open **http://localhost:8765/preview.html**

If a URL fails, check the terminal where Python is running: the **port** and **current directory** must match the path (root → `/sprite-assets/preview.html`; inside `sprite-assets` → `/preview.html`).
