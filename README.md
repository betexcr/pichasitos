# Pichasitos

Game project with an integrated **Stable Diffusion** asset pipeline (fighters, portraits, metadata) under `assets/` and `tools/`.

## Public downloads (models and LoRAs)

These files are too large for normal Git hosting or are generated artifacts. Use the links below after you clone the repo.

### Base checkpoint (SD 1.5) — Western Animation Diffusion

Use this as the main western-cartoon base for `tools/sd_export.py` and LoRA training. **CLIP skip 2** is recommended for this family.

| Source | Link |
|--------|------|
| Hugging Face (direct file, ~4.2 GB) | [westernAnimation_v1.safetensors](https://huggingface.co/sam749/Western-Animation-Diffusion-v1/resolve/main/westernAnimation_v1.safetensors) |
| Hugging Face (model card) | [sam749/Western-Animation-Diffusion-v1](https://huggingface.co/sam749/Western-Animation-Diffusion-v1) |
| Civitai (browser download, ~2 GB variant) | [Western Animation Diffusion v1](https://civitai.com/models/86546) |

Install path for this repo:

`external/stable-diffusion-webui/models/Stable-diffusion/westernAnimation_v1.safetensors`

### Project LoRAs (Punch-Out style lock, hosted mirror)

Mirrors of outputs from `tools/lora/output/` (same project; third-party file host for convenience).

| File | Description | Download |
|------|-------------|----------|
| `punchout_style.safetensors` | Main trained LoRA from this repo | [files.catbox.moe mirror](https://files.catbox.moe/dvvtpy.safetensors) |
| `punchout_style_clean.safetensors` | Alternate / clean naming variant from training runs | [files.catbox.moe mirror](https://files.catbox.moe/7da7bl.safetensors) |

Install path:

`external/stable-diffusion-webui/models/Lora/`

Prompt usage (after the LoRA is installed):

```text
<lora:punchout_style:0.75>
```

> **Note:** Public mirrors can change or disappear. If a link fails, regenerate with `tools/lora/train_lora.ps1` or copy from a teammate who has `tools/lora/output/`.

## Quick start (SD stack)

```powershell
git clone --recurse-submodules https://github.com/betexcr/pichasitos.git
cd pichasitos
```

Then follow **`external/README.md`** (submodules, WebUI `--api`, checkpoint path, LoRA install) and **`tools/lora/README.md`** for training.

## License

Add your game license here. Third-party models (checkpoint, WebUI, sd-scripts) follow their respective licenses.
