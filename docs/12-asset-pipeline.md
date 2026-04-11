# Asset Pipeline Rules

This document defines the **official asset creation doctrine** for the project.

All generated assets must follow these rules to ensure:

* consistency
* reproducibility
* scalability

This is not optional. This is the system.

---

# 1. Core Principles

* Assets are **generated, not improvised**
* Every asset must be:

  * reproducible
  * traceable
  * consistent with global style
* Stable Diffusion is a **tool**, not a source of randomness

---

# 2. Asset Structure

All assets must be stored under:

```
assets/
├── portraits/
├── enemies/
├── ui_bg/
├── map_nodes/
```

Rules:

* Format: `.png`
* Use power-of-two dimensions when possible
* Transparent background when applicable

---

# 3. Naming Convention

Format:

```
<category>_<type>_<descriptor>_<variant>
```

Examples:

```
enemy_skeleton_warrior_idle_v1.png
ui_icon_sword_basic_v2.png
bg_hub_forest_dark_v1.png
```

Rules:

* lowercase only
* no spaces
* use `_` as separator
* increment version (`v1`, `v2`, etc.) on meaningful changes

---

# 4. Metadata Requirement (MANDATORY)

Every asset must have a matching metadata file:

```
<filename>.metadata.json
```

Example:

```
enemy_skeleton_warrior_idle_v1.png
enemy_skeleton_warrior_idle_v1.metadata.json
```

Minimum metadata structure:

```json
{
  "project": "pichasitos",
  "prompt": "...",
  "negative_prompt": "...",
  "seed": 123456,
  "parent_seed": null,
  "prompt_version": "v1.0",
  "style": "darkest_tico",
  "asset_type": "enemy",
  "steps": 25,
  "cfg_scale": 6,
  "sampler": "DPM++ 2M Karras",
  "width": 512,
  "height": 512,
  "model": "SDXL",
  "timestamp": "ISO8601",
  "validated": false
}
```

For PICHASITOS SNES exports, set `"style": "pichasitos_western_cartoon"` (see `.cursor/rules/stable-diffusion-assets.mdc`).

Rules:

* metadata must ALWAYS exist
* seed must ALWAYS be stored
* missing metadata = invalid asset

---

# 5. Prompt Doctrine

## Global Style (MANDATORY)

Append to all prompts:

```
dark fantasy, darkest dungeon style, hand-painted texture, high contrast, muted palette, not photorealistic, fog, costa rican cloud forest horror, game asset
```

### PICHASITOS (SNES / Punch-Out track)

For **PICHASITOS** raster assets (fighters, portraits, UI), use the locked style in
`.cursor/rules/stable-diffusion-assets.mdc` instead of the darkest-tico line above.

The current workflow is **checkpoint-first**:

1. **Checkpoint**: a western-cartoon / comic checkpoint, not an anime checkpoint
2. **LoRA**: optional later, after you actually train a real Punch-Out style LoRA

This keeps prompts short and character-focused while the checkpoint carries the visual language.

#### Global PICHASITOS style suffix

`tools/sd_export.py` appends this automatically:

```text
1980s western cartoon arcade game art, SNES Punch-Out inspired proportions, bold black outlines, flat cel colors, square jaw, thick brows, big hands, chunky limbs, expressive face, non-anime face design, full body head to toe, facing camera or slight three-quarter, plain flat background, centered silhouette
```

**Default generator settings**

* Sampler: `DPM++ SDE Karras`
* Steps: `30`
* CFG: `6.5`
* Clip skip: `1`
* Fighters: `512x512`
* Style metadata: `pichasitos_western_cartoon`

#### Fighter roster (`tools/sd_export.py --all-fighters`)

The export script now:

* Can switch checkpoint per request via A1111 `override_settings`
* Leaves LoRA optional by default; use it only after training a real one
* Puts a **weighted anchor** first from `must_wear` or optional `visual_anchor` in `tools/fighters_sd.json`
* Inserts an Automatic1111 **`BREAK`** between the character block and the short style suffix
* Uses anime-negative tokens to push the model away from anime faces and hair
* Records metadata with `prompt_version`, checkpoint-selected `model`, and style `pichasitos_western_cartoon`

Training material for the Punch-Out LoRA lives in:

* `tools/lora/README.md`
* `tools/lora/training_config.toml`

Recommended checkpoint families:

* `Western Animation Diffusion`
* `Conv SD1.5`

Avoid anime-biased checkpoints such as `ToonYou` when the goal is Western caricature.

---

## Negative Prompt Baseline

```
photorealistic, 3d render, glossy, watermark, text, logo, lowres, blurry, distorted anatomy, extra limbs
```

For PICHASITOS SNES exports, prefer the negative baseline in `stable-diffusion-assets.mdc` (also the default in `tools/sd_export.py`).

---

# 6. Prompt Versioning

* Every asset must include:

  ```
  "prompt_version": "vX.X"
  ```

Rules:

* Increment version when:

  * style changes
  * composition changes
* Do NOT silently change prompts

---

# 7. Seed Evolution

## Rule

* Every refinement must reuse a previous seed

## Process

1. Generate batch
2. Select best output
3. Reuse its seed
4. Adjust ONE variable at a time

## Metadata

```
"parent_seed": <previous_seed>
```

---

# 8. Batch Generation Rule

* Always generate **4–8 variations** initially
* Never refine from a single output
* Use batch selection → THEN refinement

---

# 9. Style Lock

* Primary style: `darkest_tico`
* For PICHASITOS assets, use `pichasitos_punchout`

Rules:

* All assets must follow this style
* Overrides require justification:

```json
{
  "style_override": true,
  "reason": "..."
}
```

---

# 10. Resolution Rules

Standard sizes:

* Sprites: `256x256` or `512x512`
* UI icons: `256x256`
* Backgrounds: `1024x1024+`

Rules:

* Do NOT mix resolutions within same asset type

---

# 11. Validation Checklist

Every asset must pass:

* No watermark
* No text artifacts
* No distorted anatomy
* Clear silhouette
* Subject centered
* Readable at target resolution

If failed:

* regenerate OR discard

---

# 12. Asset Lifecycle

States:

```
draft → candidate → approved → deprecated
```

Rules:

* Only **approved** assets:

  * used in game
  * referenced in scenes

* Deprecated assets:

  * must not be used
  * kept only for reference

---

# 13. Generation Workflow

## Standard Flow

1. Generate batch (4–8)
2. Select best candidate
3. Refine using seed
4. Validate
5. Approve
6. Store with metadata

---

# 14. Anti-Patterns (FORBIDDEN)

* Generating assets without metadata
* Mixing art styles randomly
* Using first output as final
* Saving outside `/assets/`
* Losing seed information
* Using photorealistic outputs

---

# 15. Future Extensions

Planned upgrades:

* ControlNet for pose control
* Sprite sheet generation
* Asset registry system

---

# Final Doctrine

This pipeline exists to eliminate:

* randomness
* inconsistency
* lost work

Every asset must be:

* reproducible
* controlled
* intentional

This is not image generation.

This is **asset manufacturing**.
