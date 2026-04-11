---
license: other
tags:
  - stable-diffusion
  - lora
  - stable-diffusion-lora
  - punch-out
  - western-cartoon
  - game-assets
base_model: sam749/Western-Animation-Diffusion-v1
---

# Pichasitos — Punch-Out style LoRA

Style-lock LoRA trained for the **Pichasitos** project: western cartoon / SNES Punch-Out–inspired outlines and proportions.

## Files

- **`punchout_style.safetensors`** — primary export from project training.
- **`punchout_style_clean.safetensors`** — alternate checkpoint from the same pipeline.

## Usage (AUTOMATIC1111 / API)

1. Place the `.safetensors` file in `models/Lora/`.
2. Use a western-cartoon SD 1.5 base (e.g. [Western Animation Diffusion](https://huggingface.co/sam749/Western-Animation-Diffusion-v1)).
3. Prompt fragment (adjust weight 0.6–0.85):

```text
<lora:punchout_style:0.75>
```

CLIP skip **2** is typical for this base family.

## Source

Generated with `tools/lora/train_lora.ps1` in [github.com/betexcr/pichasitos](https://github.com/betexcr/pichasitos). Dataset: Punch-Out SNES–style references under `tools/lora/dataset/`.

## License

Use and redistribution are subject to your game/project license and to the license of the base checkpoint you pair this LoRA with.
