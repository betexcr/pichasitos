#!/usr/bin/env python3
"""Generate UI background assets for PICHASITOS using diffusers txt2img."""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

import torch
from diffusers import StableDiffusionPipeline
from PIL import Image

PROJ_ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = PROJ_ROOT / "assets" / "ui_bg"
CHECKPOINT = (
    PROJ_ROOT / "external" / "stable-diffusion-webui"
    / "models" / "Stable-diffusion" / "westernAnimation_v1.safetensors"
)

NEG = (
    "photorealistic, photo, 3d render, watermark, text, logo, blurry, "
    "people, characters, fighters, faces, anime, manga"
)

BACKGROUNDS = [
    {
        "name": "arena_pueblo",
        "prompt": (
            "Costa Rican pueblo night fiesta arena, string lights, "
            "wooden fence, dirt ring, small crowd silhouettes, "
            "tropical trees, starry sky, warm golden light, "
            "western cartoon style, bold outlines, flat colors, "
            "wide landscape, game background, no characters"
        ),
    },
    {
        "name": "arena_feria",
        "prompt": (
            "carnival fairground night arena, ferris wheel in background, "
            "colorful circus tents, dusty boxing ring, neon lights, "
            "cotton candy stands, festive banners, starry sky, "
            "western cartoon style, bold outlines, flat colors, "
            "wide landscape, game background, no characters"
        ),
    },
    {
        "name": "arena_redondel",
        "prompt": (
            "traditional Costa Rican redondel bull ring at night, "
            "wooden circular barriers, burning torches, dirt floor, "
            "rustic wooden stands, dramatic lighting, full moon, "
            "western cartoon style, bold outlines, flat colors, "
            "wide landscape, game background, no characters"
        ),
    },
    {
        "name": "arena_muerte",
        "prompt": (
            "dark volcanic arena at night, red glowing sky, "
            "lava cracks in ground, ominous fog, skull decorations, "
            "burning embers floating, final boss atmosphere, "
            "western cartoon style, bold outlines, flat colors, "
            "wide landscape, game background, no characters"
        ),
    },
    {
        "name": "title_bg",
        "prompt": (
            "Costa Rican fiesta night sky, colorful fireworks, "
            "silhouetted crowd celebrating, string lights, "
            "tropical palm trees, festive atmosphere, starry sky, "
            "western cartoon style, bold outlines, flat colors, "
            "wide landscape, game background, no characters"
        ),
    },
    {
        "name": "map_bg",
        "prompt": (
            "stylized treasure map of Costa Rica, parchment texture, "
            "illustrated mountains volcanoes rivers, compass rose, "
            "tropical vegetation borders, vintage map style, "
            "cartoon illustrated, bold outlines, warm sepia tones, "
            "top-down view, game map, no characters"
        ),
    },
]


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    print(f"Loading checkpoint: {CHECKPOINT.name}...")
    pipe = StableDiffusionPipeline.from_single_file(
        str(CHECKPOINT), torch_dtype=torch.float32, use_safetensors=True,
    )
    pipe = pipe.to("mps")
    pipe.safety_checker = None
    pipe.requires_safety_checker = False
    print("Pipeline ready.")

    for i, bg in enumerate(BACKGROUNDS, 1):
        name = bg["name"]
        out_path = OUT_DIR / f"{name}.png"
        if out_path.exists():
            print(f"[{i}/{len(BACKGROUNDS)}] {name} EXISTS, skipping")
            continue

        print(f"\n[{i}/{len(BACKGROUNDS)}] Generating {name}...")
        seed = torch.randint(0, 2**32, (1,)).item()
        gen = torch.Generator("mps").manual_seed(seed)

        result = pipe(
            prompt=bg["prompt"],
            negative_prompt=NEG,
            width=512,
            height=512,
            guidance_scale=8.0,
            num_inference_steps=30,
            generator=gen,
        )
        img = result.images[0]
        img.save(out_path)

        meta = {
            "project": "pichasitos",
            "prompt": bg["prompt"],
            "negative_prompt": NEG,
            "seed": seed,
            "asset_type": "ui_background",
            "name": name,
            "steps": 30,
            "cfg_scale": 8.0,
            "width": 512,
            "height": 512,
            "model": "westernAnimation_v1",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        (OUT_DIR / f"{name}.metadata.json").write_text(json.dumps(meta, indent=2))
        print(f"  SAVED: {out_path.name} (seed={seed})")

    print("\nAll backgrounds generated!")


if __name__ == "__main__":
    main()
