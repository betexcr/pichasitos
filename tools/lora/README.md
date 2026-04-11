# Punch-Out LoRA Training

**Hosted checkpoints and LoRA mirrors:** see the repo root [README.md](../../README.md#public-downloads-models-and-loras).

This folder contains the starter material for training a small LoRA that pushes
PICHASITOS renders closer to the SNES Punch-Out look.

## Goal

Use a western-cartoon checkpoint as the base model, then add a light LoRA that teaches:

* bold black outlines
* flat cel colors
* exaggerated Punch-Out proportions
* classic SNES boxing-game presentation

The final inference stack should be:

1. Checkpoint: a western-cartoon / comic SD1.5 checkpoint
2. LoRA: `punchout_style.safetensors`

And the prompt trigger, once the LoRA is actually trained, should be:

```text
<lora:punchout_style:0.75>
```

To disable the LoRA during testing, use:

```powershell
python tools/sd_export.py --all-fighters --no-lora
```

## Folder layout

Recommended local training layout:

```text
tools/lora/
  README.md
  training_config.toml
  dataset/
    10_punchout_style/
      0001.png
      0001.txt
      0002.png
      0002.txt
  output/
  logs/
```

The `10_punchout_style` folder name is a common Kohya repeat-count pattern:

* `10` = repeats
* `punchout_style` = concept name / trigger grouping

## Dataset collection

Collect **20-40** good Punch-Out references.

Good sources:

* emulator screenshots
* manually captured frames from gameplay videos
* character select portraits
* between-round portraits
* idle / standing frames
* full-body opponent views

Avoid:

* watermarked images
* fan art in unrelated styles
* blurry video frames
* mixed franchises
* heavily compressed screenshots
* duplicates of nearly identical frames

Prioritize:

* strong silhouettes
* clear outlines
* readable poses
* clean backgrounds
* distinct character scale exaggeration

## Captions

Each image should have a matching `.txt` caption.

Keep captions simple and consistent. Start every caption with the same trigger:

```text
punchout_style, SNES fighting game character, bold outlines, exaggerated cartoon proportions
```

Then add only the essentials visible in the frame:

* closeup portrait / full body / side view
* angry face / grin / arms raised
* boxing ring or plain background if visible

Example caption:

```text
punchout_style, SNES fighting game character, bold outlines, exaggerated cartoon proportions, full body opponent, facing camera, angry grin
```

Do not over-caption every tiny detail. The LoRA is learning style, not one exact character.

## Recommended training settings

Base model:

* a non-anime western-cartoon checkpoint
* recommended families: `Western Animation Diffusion`, `Conv SD1.5`
* avoid anime checkpoints such as `ToonYou`

Core settings:

* resolution: `512,512`
* network dim: `16`
* network alpha: `16`
* unet learning rate: `1e-4`
* text encoder learning rate: `5e-5`
* clip skip: `2`
* mixed precision: `fp16`
* gradient checkpointing: `true`
* batch size: `1`
* max train steps: about `1000`

These values are already reflected in `training_config.toml`.

## Training setup (integrated in this repo)

Training uses **`external/sd-scripts`** (git submodule). WebUI for inference is **`external/stable-diffusion-webui`**.

1. Initialize submodules from the repo root:

```powershell
git submodule update --init --recursive
```

2. Put your base checkpoint at:

```text
external/stable-diffusion-webui/models/Stable-diffusion/westernAnimation_v1.safetensors
```

3. Install the trainer venv:

```powershell
powershell -ExecutionPolicy Bypass -File tools/lora/install_sd_scripts.ps1
```

4. Smoke test:

```powershell
powershell -ExecutionPolicy Bypass -File tools/lora/train_lora.ps1 -SmokeTest
```

5. Full train:

```powershell
powershell -ExecutionPolicy Bypass -File tools/lora/train_lora.ps1
```

6. Copy the trained `.safetensors` from `tools/lora/output/` to:

```text
external/stable-diffusion-webui/models/Lora/
```

See `external/README.md` for the full layout.

### Python 3.13 note

On this machine, `sd-scripts`' pinned `safetensors==0.4.5` does not install cleanly on Windows with Python 3.13 because it falls back to a Rust build. The install script works around this by installing a wheel-backed `safetensors` first, then the remaining trainer dependencies.

## Training with Kohya SS

If you prefer the Kohya GUI:

1. Install `kohya_ss`.
2. Put your western-cartoon checkpoint in your Stable Diffusion model folder.
3. Put your dataset under `tools/lora/dataset/10_punchout_style/`.
4. Load `training_config.toml` as your starting preset.
5. Train and save the LoRA as `punchout_style.safetensors`.
6. Copy the LoRA to `external/stable-diffusion-webui/models/Lora/`.

## Testing in A1111

Use prompt fragments like:

```text
<lora:punchout_style:0.75>, 1980s western cartoon arcade game art, SNES Punch-Out inspired proportions, bold black outlines, flat cel colors
```

## PowerShell note

On this machine the shell is PowerShell. Prefer:

```powershell
python tools/sd_export.py --all-fighters --no-lora
```

instead of trying to pass an empty string to `--lora`.

If the LoRA is too weak:

* increase weight from `0.75` to `0.85`

If it overfits:

* lower weight to `0.6`
* reduce training steps
* reduce repeats

## Expected result

After training, `tools/sd_export.py` should be able to keep prompts short and let
the model stack handle the visual style, while the JSON roster keeps control of:

* stereotype
* costume
* props
* pose
