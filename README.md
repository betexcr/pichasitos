# Pichasitos

A Punch-Out inspired fighting game with an integrated **Stable Diffusion** asset pipeline for generating all fighter sprites, portraits, and UI art.

---

## Fighter Roster (15 total)

| # | Slug | Notes |
|---|------|-------|
| 0 | `player` | The protagonist |
| 1 | `don_carlos` | Multi-frame animations (`_f2`, `_f3`) for idle, hurt, punches, sig |
| 2 | `gringo` | |
| 3 | `clarisa` | |
| 4 | `panzaeperra` | |
| 5 | `michiquito` | |
| 6 | `hitmena` | |
| 7 | `karen` | |
| 8 | `carretastar` | |
| 9 | `persefone` | |
| 10 | `don_alvaro` | |
| 11 | `anai` | |
| 12 | `skin` | |
| 13 | `el_indio` | |
| 14 | `bull` | Custom pose names — see "Bull Pose Mapping" below |

All fighter definitions (prompts, costumes, stereotypes, pose descriptions) live in `tools/fighters_sd.json`.

### Standard Pose Set (10 per fighter)

`idle`, `punch_left`, `punch_right`, `hurt`, `ko`, `block`, `windup`, `sig_attack`, `taunt`, `victory`

### Bull Pose Mapping

Bull's files use unique names. The game maps them via `BULL_POSE_ALIASES` in `js/asset-loader.js` and `viewer.html`:

| Standard pose | Bull file name |
|---------------|---------------|
| `punch_left` | `horn_left` |
| `punch_right` | `horn_right` |
| `windup` | `charge` |
| `block` | `stomp` |
| `sig_attack` | `sig_charge` |

### Asset Resolutions

| Category | Size |
|----------|------|
| Fighter poses | 512 × 896 |
| Portraits | 512 × 512 |
| UI icons | 256 × 256 |
| Backgrounds | 1024 × 1024+ |

---

## Public Downloads (models and LoRAs)

These files are too large for Git. Download them after cloning.

### Base Checkpoint — Western Animation Diffusion (SD 1.5)

**Required.** This is the main western-cartoon base for `tools/sd_export.py` and LoRA training. Use **CLIP skip 2**.

| Source | Link |
|--------|------|
| Hugging Face (direct, ~4.2 GB) | [westernAnimation_v1.safetensors](https://huggingface.co/sam749/Western-Animation-Diffusion-v1/resolve/main/westernAnimation_v1.safetensors) |
| Hugging Face (model card) | [sam749/Western-Animation-Diffusion-v1](https://huggingface.co/sam749/Western-Animation-Diffusion-v1) |
| CivitAI (browser, ~2 GB variant) | [Western Animation Diffusion v1](https://civitai.com/models/86546) |

Install path:

```
external/stable-diffusion-webui/models/Stable-diffusion/westernAnimation_v1.safetensors
```

**All existing poses in `assets/poses/` were generated with this checkpoint.** Without it, vanilla SD 1.5 produces photorealistic output that the LoRA alone cannot fix. The pipeline requires two style layers:

1. **Checkpoint** (`westernAnimation_v1`) — carries the global cartoon style
2. **LoRA** (`punchout_style`) — locks Punch-Out specifics on top

### Project LoRA — Punch-Out Style

| Resource | Link |
|----------|------|
| **Hugging Face repo** | [betexcr/pichasitos-punchout-lora](https://huggingface.co/betexcr/pichasitos-punchout-lora) |

The trained LoRA also lives in `tools/lora/output/punchout_style.safetensors` in-repo. Copy to:

```
external/stable-diffusion-webui/models/Lora/punchout_style.safetensors
```

Prompt trigger: `<lora:punchout_style:0.75>`

If the HF repo is still empty, publish with:

```bash
pip install huggingface_hub
HF_TOKEN="hf_..." python tools/lora/publish_lora_to_hf.py
```

#### Legacy mirrors (may expire)

| File | Download |
|------|----------|
| `punchout_style.safetensors` | [catbox.moe](https://files.catbox.moe/dvvtpy.safetensors) |
| `punchout_style_clean.safetensors` | [catbox.moe](https://files.catbox.moe/7da7bl.safetensors) |

---

## Quick Start

### 1. Clone

```bash
git clone --recurse-submodules https://github.com/betexcr/pichasitos.git
cd pichasitos
```

### 2. Download Models

Place both files as described in "Public Downloads" above.

### 3. Start A1111 WebUI

The upstream Stability-AI repo was removed from GitHub. A1111 needs environment variable overrides to use a community mirror, plus a bytecode workaround for Python 3.9:

```bash
PYTHONDONTWRITEBYTECODE=1 \
STABLE_DIFFUSION_REPO="https://github.com/joypaul162/Stability-AI-stablediffusion.git" \
STABLE_DIFFUSION_COMMIT_HASH="f16630a927e00098b524d687640719e4eb469b76" \
bash external/stable-diffusion-webui/webui.sh --api --listen
```

The API will be at `http://127.0.0.1:7860/`.

#### A1111 Known Issues (must fix on fresh installs)

| Problem | Fix |
|---------|-----|
| `Stability-AI/stablediffusion.git` repo removed | Set `STABLE_DIFFUSION_REPO` and `STABLE_DIFFUSION_COMMIT_HASH` env vars (see command above) |
| `SyntaxError` in `aenum/_py2.py` during bytecode compilation | Set `PYTHONDONTWRITEBYTECODE=1` |
| `ModuleNotFoundError: No module named 'pkg_resources'` | Run `pip install "setuptools<70"` inside the A1111 venv |
| `wheel` missing | Run `pip install wheel` inside the A1111 venv |

### 4. Generate Assets

```bash
# All fighters, all poses
python3 tools/sd_export.py --poses --lora "punchout_style:0.75"

# Specific fighters and poses
python3 tools/sd_export.py --poses \
  --slugs karen,el_indio \
  --pose-ids punch_left,punch_right \
  --lora "punchout_style:0.75"

# Override checkpoint explicitly
python3 tools/sd_export.py --poses \
  --slugs michiquito \
  --pose-ids punch_right \
  --lora "punchout_style:0.75" \
  --checkpoint "westernAnimation_v1.safetensors"
```

Output goes to `assets/poses/<slug>/enemy_<slug>_<pose>_v1.png` with matching `.metadata.json`.

### 5. LoRA Training

See `tools/lora/README.md` for the full training guide. Quick summary:

```bash
# Install trainer venv
powershell -ExecutionPolicy Bypass -File tools/lora/install_sd_scripts.ps1

# Smoke test
powershell -ExecutionPolicy Bypass -File tools/lora/train_lora.ps1 -SmokeTest

# Full train
powershell -ExecutionPolicy Bypass -File tools/lora/train_lora.ps1
```

---

## Project Structure

```
assets/
  poses/<slug>/          Fighter pose sprites (512×896 PNG + metadata)
  enemies/               Legacy idle sprites (being replaced by poses/)
  portraits/             Face closeups (512×512)
  ui_bg/                 UI backgrounds
  map_nodes/             World map icons

tools/
  sd_export.py           Main generation script (calls A1111 API)
  fighters_sd.json       Fighter roster with prompts and pose descriptions
  lora/                  LoRA training data, configs, and output

js/
  asset-loader.js        Runtime sprite loading (includes BULL_POSE_ALIASES)
  sprites.js             Canvas rendering (shadow outlines, padding)
  opponents.js           Fighter game logic and stats

external/
  stable-diffusion-webui/  A1111 submodule
  sd-scripts/              Kohya LoRA trainer submodule
```

---

## Pending Work

- All 8 punch poses have been regenerated with `westernAnimation_v1` + `punchout_style` LoRA. Visual quality check recommended for: `panzaeperra` punch_left (stance looks more like a lean than a punch).
- Prompt hygiene: all "over opponent below" phrases were removed from `fighters_sd.json` to prevent SD from generating duplicate characters.

---

## License

Add your game license here. Third-party models (checkpoint, WebUI, sd-scripts) follow their respective licenses.
