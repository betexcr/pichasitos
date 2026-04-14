# PICHASITOS — How Don Carlos & Player Assets Were Created

## Overview

Every sprite, portrait, and pose image in PICHASITOS is generated with **Stable Diffusion 1.5** using the `diffusers` Python library running locally on Apple Silicon (MPS). There is no manual pixel art — the entire visual pipeline is scripted and reproducible from metadata.

---

## Two-Layer Style Lock

The PICHASITOS look comes from two layers working together:

1. **Checkpoint**: `westernAnimation_v1.safetensors` — a Western cartoon / comic-book base model that naturally produces bold outlines, flat cel colors, and chunky proportions. This carries ~80% of the visual style.
2. **Prompt suffix** (appended to every generation):
   ```
   1980s western cartoon arcade game art, SNES Punch-Out inspired proportions,
   bold black outlines, flat cel colors, exaggerated readable silhouette,
   non-anime face design, full body head to toe, plain solid background
   ```

No anime-biased checkpoints are used. The negative prompt explicitly blocks anime/manga/chibi aesthetics, photorealism, and common SD artifacts.

---

## Character Definition (fighters_sd.json)

Each fighter is defined in `tools/fighters_sd.json` with fields that control what SD generates:

### Don Carlos

| Field | Value |
|-------|-------|
| `must_wear` | `balding head, black mustache, sweaty white short-sleeve dress shirt open over huge belly, black slacks, brown dress shoes, thick gold rope chain, chrome microphone hanging from neck on a cord` |
| `stereotype` | `fat karaoke rey tio showman barrio` |
| `visual_anchor` | `open white shirt over huge belly, black mustache, gold chain, chrome microphone cord, karaoke showman` |
| `extra_negative` | `woman, wife, duet partner, backup singer, companion, mariachi, second singer, second person, side person` |

### Player

| Field | Value |
|-------|-------|
| `must_wear` | `short black hair, green tank top with gold-yellow side stripes, dark blue jeans, brown work boots, green cloth hand wraps, no gloves` |
| `stereotype` | `working-class tico festival everyman hero` |
| `visual_anchor` | `green tank top, yellow side stripes, dark blue jeans, brown work boots, confident grin` |

Each fighter also has 10 `poses`, each with a `pose_id` and a `pose_desc` — a short natural-language description of the body position (e.g., "swinging left fist in wide haymaker, belly momentum carrying the punch").

---

## Asset Types and How They Were Generated

### 1. Enemy Idle Sprites (`assets/enemies/`)

The original idle sprites were generated first using `tools/sd_export.py` via **txt2img** (text-to-image). These are the canonical reference images — every other asset for that fighter derives from them.

- Resolution: 512×512
- Sampler: DPM++ SDE Karras
- Steps: 30
- CFG scale: 8
- Backgrounds removed with `rembg`

### 2. Portraits (`assets/portraits/`)

Portraits were generated using **img2img** (image-to-image) with the enemy idle sprite as the reference image. The script `tools/regenerate_portraits.py` handles this.

**How it works:**
- The enemy idle PNG is loaded as the input image
- A portrait-specific prompt is built: close-up head and upper torso, intense arcade rival expression, eyes locked on camera
- `strength=0.65` — enough to reframe the composition to a close-up while keeping the character's colors, costume, and facial features recognizable
- `guidance_scale=7.0`

Don Carlos portrait prompt (actual):
```
(close-up head and upper torso portrait, balding head, black mustache,
sweaty white shirt open over huge belly, thick gold rope chain, chrome
microphone on cord, sleazy karaoke-star smirk, belly-forward bravado:1.25),
"DON CARLOS" enemy portrait, fat karaoke rey tio showman,
intense arcade rival portrait expression, eyes locked on camera,
BREAK, [style suffix]
```

### 3. Pose Variants (`assets/poses/<slug>/`)

All 10 poses per fighter were generated using **img2img** with the script `tools/generate_poses.py`.

**How it works:**
- The enemy idle sprite is the input image for every pose
- The prompt structure follows a specific template:

```
(<must_wear>, <pose_desc>:1.25),
"<NAME_TAG>" enemy, <visual_anchor>, <pose_desc>,
BREAK, <style_suffix>
```

- Attention weighting `(:1.25)` is applied to the costume and pose description so those tokens dominate over the style suffix
- `BREAK` separates character-specific tokens from the global style block
- **Idle pose** uses `strength=0.55` (stay close to the reference)
- **Action poses** use `strength=0.70` (allow more deviation for dynamic posing)
- `guidance_scale=7.5`, `steps=30`

Don Carlos punch_left prompt (actual):
```
(balding head, black mustache, sweaty white short-sleeve dress shirt open
over huge belly, black slacks, brown dress shoes, thick gold rope chain,
chrome microphone hanging from neck on a cord, swinging left fist in wide
haymaker, belly momentum carrying the punch:1.25),
"DON CARLOS" enemy, open white shirt over huge belly, black mustache,
gold chain, chrome microphone cord, karaoke showman,
swinging left fist in wide haymaker, belly momentum carrying the punch,
BREAK, 1980s western cartoon arcade game art, SNES Punch-Out inspired
proportions, bold black outlines, flat cel colors, exaggerated readable
silhouette, non-anime face design, full body head to toe, plain solid background
```

### Player Special Case

The Player character is seen **from behind** in gameplay (Punch-Out perspective). This required special handling:
- The idle sprite still faces forward (for the character select / attract screen)
- Action poses (punch_left, punch_right) needed to show a back view
- After initial generations produced front-facing or unnatural results, the best back-view variants (`_f2` files) from multi-frame generation were selected as the canonical `_v1` poses

---

## Negative Prompt

Applied to every generation:
```
photorealistic, photo, realistic skin, 3d render, watermark, text, logo,
blurry, bad anatomy, extra limbs, multiple people, duplicate, boxing gloves,
boxing ring, mouthguard, cropped, missing feet, bust only, anime, manga,
chibi, kawaii, anime eyes, anime face, anime hair
```

Per-fighter extras are appended (e.g., Don Carlos adds "woman, wife, duet partner..." to prevent SD from generating a second person in the karaoke scene).

---

## Technical Pipeline

```
westernAnimation_v1.safetensors (checkpoint)
         │
         ▼
   diffusers library (Python)
   StableDiffusionImg2ImgPipeline
         │
         ├── Input: enemy idle sprite (512×512 PNG)
         ├── Prompt: costume + pose + BREAK + style
         ├── Negative: anti-realism + anti-anime + per-fighter
         ├── strength: 0.55 (idle) / 0.70 (action)
         ├── guidance_scale: 7.5
         ├── steps: 30
         ├── sampler: PNDMScheduler
         └── device: MPS (Apple Silicon)
         │
         ▼
   512×512 PNG output
         │
         ▼
   rembg (background removal)
         │
         ▼
   assets/poses/<slug>/ + .metadata.json
```

---

## Metadata

Every generated asset has a companion `.metadata.json` recording:
- Full prompt and negative prompt
- Seed (for exact reproduction)
- Model name, steps, CFG, strength, sampler
- Timestamp, fighter slug, pose ID

This means any asset can be regenerated identically by re-running the pipeline with the same seed and parameters.

---

## Key Design Decisions

1. **img2img from the idle sprite** — Using the idle as a reference for all poses keeps the character's color palette, proportions, and costume consistent across poses. Pure txt2img would produce different-looking characters each time.

2. **Strength tuning** — 0.55 for idle (minimal change from reference), 0.70 for action (enough freedom to change body position while keeping identity).

3. **CLIP token budget** — SD 1.5 truncates prompts at 77 tokens. The costume/pose tokens are placed first with attention weighting, and the style suffix is kept short so it doesn't push important tokens past the limit.

4. **Per-fighter negative prompts** — Characters like Don Carlos (a karaoke singer) tend to generate with a duet partner or audience. The `extra_negative` field blocks these per-character failure modes.

5. **Western cartoon checkpoint** — Using `westernAnimation_v1` instead of an anime checkpoint means the bold-outline, flat-color, exaggerated-proportion style comes naturally from the model weights rather than being forced through prompt engineering.
