#!/usr/bin/env python3
"""
Regenerate mismatched portraits using img2img with diffusers.
Uses the enemy idle sprite as a reference to generate a matching portrait.
"""
from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

import torch
from diffusers import StableDiffusionImg2ImgPipeline
from PIL import Image

PROJ_ROOT = Path(__file__).resolve().parent.parent
ENEMIES_DIR = PROJ_ROOT / "assets" / "enemies"
PORTRAITS_DIR = PROJ_ROOT / "assets" / "portraits"
CHECKPOINT = PROJ_ROOT / "external" / "stable-diffusion-webui" / "models" / "Stable-diffusion" / "westernAnimation_v1.safetensors"

PORTRAIT_STYLE_SUFFIX = (
    "1980s western cartoon arcade game art, SNES Punch-Out inspired proportions, "
    "same character design language as the approved full-body enemy art, "
    "bold black outlines, flat cel colors, square jaw, thick brows, chunky readable forms, "
    "expressive face, non-anime face design, close head-and-upper-torso crop of the same fighter, "
    "facing camera or slight three-quarter, plain solid single-color background, "
    "clean empty backdrop, no graphic backdrop, no poster composition"
)

NEGATIVE_PROMPT = (
    "photorealistic, photo, realistic skin, 3d render, watermark, text, logo, blurry, "
    "bad anatomy, extra limbs, multiple people, multiple characters, extra character, "
    "crowd, audience, duplicate, boxing gloves, boxing ring, mouthguard, cropped, "
    "anime, manga, chibi, kawaii, moe, anime eyes, anime face, anime hair"
)

PORTRAITS_TO_FIX = {
    "bull": {
        "enemy_file": "enemy_bull_idle_v1.png",
        "portrait_file": "portrait_bull_angry_v1.png",
        "prompt": (
            "(close-up head and chest portrait of a single malacrianza bull, "
            "black head and neck, dark chest, white gray speckled torso, "
            "long upward-curving horns with dark tips, huge hanging dewlap, "
            "aggressive menacing expression, eyes locked on camera:1.25), "
            '"EL TORO" boss bull portrait, arcade versus screen portrait, '
            "BREAK, " + PORTRAIT_STYLE_SUFFIX
        ),
    },
    "persefone": {
        "enemy_file": "enemy_persefone_idle_v1.png",
        "portrait_file": "portrait_persefone_angry_v1.png",
        "prompt": (
            "(close-up head and upper torso portrait, "
            "pink space buns hairstyle, black mesh crop top, "
            "glowstick bracelets, baby pacifier on silver chain necklace, "
            "wild rave smile, wide eyes, chaotic club-kid confidence:1.25), "
            '"PERSEFONE" enemy portrait, rave tica cosmic PLUR club kid, '
            "intense arcade rival portrait expression, eyes locked on camera, "
            "BREAK, " + PORTRAIT_STYLE_SUFFIX
        ),
    },
    "don_carlos": {
        "enemy_file": "enemy_don_carlos_idle_v1.png",
        "portrait_file": "portrait_don_carlos_angry_v1.png",
        "prompt": (
            "(close-up head and upper torso portrait, "
            "balding head, black mustache, sweaty white shirt open over huge belly, "
            "thick gold rope chain, chrome microphone on cord, "
            "sleazy karaoke-star smirk, belly-forward bravado:1.25), "
            '"DON CARLOS" enemy portrait, fat karaoke rey tio showman, '
            "intense arcade rival portrait expression, eyes locked on camera, "
            "BREAK, " + PORTRAIT_STYLE_SUFFIX
        ),
    },
    "anai": {
        "enemy_file": "enemy_anai_idle_v1.png",
        "portrait_file": "portrait_anai_angry_v1.png",
        "prompt": (
            "(close-up head and upper torso portrait, "
            "slim Black man, knit tam hat with red gold green stripes, "
            "loose forest-green shirt, woven bead bracelet, "
            "calm smile, rooted island confidence:1.25), "
            '"ANAI" enemy portrait, Caribbean Limon rasta roots calm island fighter, '
            "intense arcade rival portrait expression, eyes locked on camera, "
            "BREAK, " + PORTRAIT_STYLE_SUFFIX
        ),
    },
}


def load_pipeline():
    print(f"Loading checkpoint from {CHECKPOINT}...")
    pipe = StableDiffusionImg2ImgPipeline.from_single_file(
        str(CHECKPOINT),
        torch_dtype=torch.float32,
        use_safetensors=True,
    )
    pipe = pipe.to("mps")
    pipe.safety_checker = None
    pipe.requires_safety_checker = False
    print("Pipeline loaded on MPS.")
    return pipe


def generate_portrait(pipe, slug: str, cfg: dict, num_images: int = 4):
    enemy_path = ENEMIES_DIR / cfg["enemy_file"]
    if not enemy_path.exists():
        print(f"  ERROR: enemy image not found: {enemy_path}")
        return

    ref_image = Image.open(enemy_path).convert("RGB")
    ref_image = ref_image.resize((512, 512), Image.LANCZOS)

    out_dir = PORTRAITS_DIR
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"  Generating {num_images} variations for {slug}...")
    for i in range(num_images):
        seed = torch.randint(0, 2**32, (1,)).item()
        generator = torch.Generator("mps").manual_seed(seed)

        result = pipe(
            prompt=cfg["prompt"],
            negative_prompt=NEGATIVE_PROMPT,
            image=ref_image,
            strength=0.65,
            guidance_scale=7.0,
            num_inference_steps=30,
            generator=generator,
        )

        img = result.images[0]
        variant_name = f"portrait_{slug}_angry_v1_var{i}.png"
        img_path = out_dir / variant_name
        img.save(img_path)

        meta = {
            "project": "pichasitos",
            "prompt": cfg["prompt"],
            "negative_prompt": NEGATIVE_PROMPT,
            "seed": seed,
            "parent_seed": None,
            "prompt_version": "v4.3",
            "style": "pichasitos_western_cartoon",
            "asset_type": "portrait",
            "steps": 30,
            "cfg_scale": 7.0,
            "sampler": "PNDMScheduler",
            "width": 512,
            "height": 512,
            "model": "westernAnimation_v1",
            "strength": 0.65,
            "reference_image": cfg["enemy_file"],
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "validated": False,
        }
        meta_path = out_dir / f"{variant_name}.metadata.json"
        meta_path.write_text(json.dumps(meta, indent=2))
        print(f"    Saved: {variant_name} (seed={seed})")


def main():
    slugs = sys.argv[1:] if len(sys.argv) > 1 else list(PORTRAITS_TO_FIX.keys())

    for s in slugs:
        if s not in PORTRAITS_TO_FIX:
            print(f"Unknown slug: {s}, skipping")
            continue

    pipe = load_pipeline()

    for slug in slugs:
        if slug not in PORTRAITS_TO_FIX:
            continue
        cfg = PORTRAITS_TO_FIX[slug]
        print(f"\n=== Regenerating portrait: {slug} ===")
        generate_portrait(pipe, slug, cfg, num_images=4)

    print("\nDone! Review the *_var*.png variants and pick the best one.")
    print("Then rename it to replace the original portrait file.")


if __name__ == "__main__":
    main()
