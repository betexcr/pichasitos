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

### Project LoRAs (Punch-Out style) — Hugging Face Hub (canonical)

**Hugging Face Hub** is the recommended host: stable URLs, version history, and the usual place SD tools expect LoRAs.

| Resource | Link |
|----------|------|
| **Model repo** (download `.safetensors` files here) | [**`betexcr/pichasitos-punchout-lora`**](https://huggingface.co/betexcr/pichasitos-punchout-lora) |

If that page is still empty, publish once from a machine with a Hugging Face **write** token:

```powershell
pip install huggingface_hub
$env:HF_TOKEN = "hf_..."   # https://huggingface.co/settings/tokens
python tools/lora/publish_lora_to_hf.py
```

Override the repo id with `PICHASITOS_HF_REPO=yourname/your-repo` if needed.

Install path after download:

`external/stable-diffusion-webui/models/Lora/`

Prompt usage (after the LoRA is installed):

```text
<lora:punchout_style:0.75>
```

#### Legacy mirror (optional)

Temporary third-party mirrors (may expire):

| File | Download |
|------|----------|
| `punchout_style.safetensors` | [files.catbox.moe](https://files.catbox.moe/dvvtpy.safetensors) |
| `punchout_style_clean.safetensors` | [files.catbox.moe](https://files.catbox.moe/7da7bl.safetensors) |

Prefer the Hugging Face repo once it is populated.

## Quick start (SD stack)

```powershell
git clone --recurse-submodules https://github.com/betexcr/pichasitos.git
cd pichasitos
```

Then follow **`external/README.md`** (submodules, WebUI `--api`, checkpoint path, LoRA install) and **`tools/lora/README.md`** for training.

## License

Add your game license here. Third-party models (checkpoint, WebUI, sd-scripts) follow their respective licenses.
