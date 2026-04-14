#!/usr/bin/env python3
"""
Generate all fighter pose variants using diffusers img2img pipeline.
Uses the enemy idle sprite as reference for each fighter, generates
each pose variant defined in fighters_sd.json.
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
POSES_DIR = PROJ_ROOT / "assets" / "poses"
FIGHTERS_JSON = PROJ_ROOT / "tools" / "fighters_sd.json"
CHECKPOINT = (
    PROJ_ROOT / "external" / "stable-diffusion-webui"
    / "models" / "Stable-diffusion" / "westernAnimation_v1.safetensors"
)

STYLE_SUFFIX = (
    "1980s western cartoon arcade game art, SNES Punch-Out inspired proportions, "
    "bold black outlines, flat cel colors, exaggerated readable silhouette, "
    "non-anime face design, full body head to toe, plain solid background"
)

NEGATIVE_PROMPT = (
    "photorealistic, photo, realistic skin, 3d render, watermark, text, logo, blurry, "
    "bad anatomy, extra limbs, multiple people, duplicate, boxing gloves, boxing ring, "
    "mouthguard, cropped, missing feet, bust only, anime, manga, chibi, kawaii, "
    "anime eyes, anime face, anime hair"
)


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
    print("Pipeline ready on MPS.")
    return pipe


def generate_poses_for_fighter(pipe, fighter: dict, force: bool = False):
    slug = fighter["slug"]
    enemy_path = ENEMIES_DIR / f"enemy_{slug}_idle_v1.png"

    if not enemy_path.exists():
        print(f"  SKIP: no enemy reference at {enemy_path}")
        return

    fighter_dir = POSES_DIR / slug
    fighter_dir.mkdir(parents=True, exist_ok=True)

    ref_image = Image.open(enemy_path).convert("RGB")
    ref_image = ref_image.resize((512, 512), Image.LANCZOS)

    name_tag = fighter.get("name_tag", slug.upper())
    must_wear = fighter.get("must_wear", "")
    visual_anchor = fighter.get("visual_anchor", "")
    extra_neg = fighter.get("extra_negative", "")
    neg = NEGATIVE_PROMPT + (f", {extra_neg}" if extra_neg else "")

    poses = fighter.get("poses", [])
    if not poses:
        print(f"  SKIP: no poses defined for {slug}")
        return

    for pose_obj in poses:
        pose_id = pose_obj["pose_id"]
        pose_desc = pose_obj["pose_desc"]

        out_name = f"enemy_{slug}_{pose_id}_v1.png"
        out_path = fighter_dir / out_name

        if out_path.exists() and not force:
            print(f"  EXISTS: {out_name}, skipping")
            continue

        prompt = (
            f"({must_wear}, {pose_desc}:1.25), "
            f'"{name_tag}" enemy, {visual_anchor}, {pose_desc}, '
            f"BREAK, {STYLE_SUFFIX}"
        )

        strength = 0.55 if pose_id == "idle" else 0.70
        seed = torch.randint(0, 2**32, (1,)).item()
        generator = torch.Generator("mps").manual_seed(seed)

        result = pipe(
            prompt=prompt,
            negative_prompt=neg,
            image=ref_image,
            strength=strength,
            guidance_scale=7.5,
            num_inference_steps=30,
            generator=generator,
        )

        img = result.images[0]
        img.save(out_path)

        meta = {
            "project": "pichasitos",
            "prompt": prompt,
            "negative_prompt": neg,
            "seed": seed,
            "parent_seed": None,
            "prompt_version": "v4.3",
            "style": "pichasitos_western_cartoon",
            "asset_type": "pose",
            "pose_id": pose_id,
            "fighter_slug": slug,
            "steps": 30,
            "cfg_scale": 7.5,
            "strength": strength,
            "sampler": "PNDMScheduler",
            "width": 512,
            "height": 512,
            "model": "westernAnimation_v1",
            "reference_image": f"enemy_{slug}_idle_v1.png",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "validated": False,
        }
        meta_path = fighter_dir / f"{out_name}.metadata.json"
        meta_path.write_text(json.dumps(meta, indent=2))
        print(f"  DONE: {out_name} (seed={seed})")


def main():
    with open(FIGHTERS_JSON) as f:
        fighters = json.load(f)

    slugs_filter = set(sys.argv[1:]) if len(sys.argv) > 1 else None

    if slugs_filter:
        fighters = [f for f in fighters if f["slug"] in slugs_filter]
        print(f"Filtering to: {[f['slug'] for f in fighters]}")

    force = "--force" in sys.argv

    pipe = load_pipeline()

    total_poses = sum(len(f.get("poses", [])) for f in fighters)
    print(f"\nGenerating {total_poses} pose images for {len(fighters)} fighters...")

    for i, fighter in enumerate(fighters, 1):
        slug = fighter["slug"]
        n_poses = len(fighter.get("poses", []))
        print(f"\n[{i}/{len(fighters)}] === {slug} ({n_poses} poses) ===")
        generate_poses_for_fighter(pipe, fighter, force=force)

    print("\nAll pose generation complete!")


if __name__ == "__main__":
    main()
