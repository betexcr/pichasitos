# External Stable Diffusion stack (vendored)

This folder holds **git submodules** used by the PICHASITOS asset pipeline:

- `stable-diffusion-webui` — AUTOMATIC1111 WebUI (`--api` for `tools/sd_export.py`)
- `sd-scripts` — Kohya-style LoRA training (`tools/lora/train_lora.ps1`)

## First-time clone

From the repo root:

```powershell
git submodule update --init --recursive
```

Shallow clones are configured in `.gitmodules` where supported; if your Git is older, run a normal submodule init.

## Checkpoints and LoRAs (not in git)

Download or copy model files locally (they are large and license-specific):

- **Base checkpoint** (example used in this project): `westernAnimation_v1.safetensors`  
  Place at:  
  `external/stable-diffusion-webui/models/Stable-diffusion/westernAnimation_v1.safetensors`

- **Trained LoRA** output from training:  
  `tools/lora/output/punchout_style.safetensors`  
  Copy to:  
  `external/stable-diffusion-webui/models/Lora/punchout_style.safetensors`

## WebUI for API generation

From `external/stable-diffusion-webui`:

```powershell
.\webui-user.bat
```

Use a `webui-user.bat` (or launch args) that includes `--api` so `http://127.0.0.1:7860` matches `tools/sd_export.py`.

## Trainer install

After submodules exist:

```powershell
powershell -ExecutionPolicy Bypass -File tools/lora/install_sd_scripts.ps1
powershell -ExecutionPolicy Bypass -File tools/lora/train_lora.ps1
```

Virtual environments live **inside** each submodule working tree (`external/sd-scripts/venv/`, etc.) and are ignored by upstream `.gitignore` files.
