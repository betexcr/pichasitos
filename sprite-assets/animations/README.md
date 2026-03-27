# Action frames (`action-frames.json`)

Exported from `SpriteSystem.ANIM` in `js/sprites.js`.

Each **action** (e.g. `punch_left`, `idle`, `ko`) is an array of **frames**. One frame is:

| Field | Meaning |
|--------|--------|
| `headOffset` | Added to head position (pixels, before scale). |
| `torsoOffset` | Added to torso/body anchor. |
| `leftArmOffset` | Left arm base offset from torso. |
| `rightArmOffset` | Right arm base offset. |
| `leftFistExtension` | Extra left-fist reach / pullback (see renderer). |
| `rightFistExtension` | Extra right-fist reach / pullback. |

Coordinates are in **engine pixel space**; the canvas scales them by the character’s `pixel size` at draw time.

To see every action name, use `../index.json` → `animationNames`.
