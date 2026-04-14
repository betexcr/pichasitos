#!/usr/bin/env python3
"""Regenerate all fighter poses using ControlNet OpenPose conditioning."""
from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

import torch
from diffusers import (
    ControlNetModel,
    StableDiffusionControlNetPipeline,
    UniPCMultistepScheduler,
)
from PIL import Image

PROJ_ROOT = Path(__file__).resolve().parent.parent
CHECKPOINT = (
    PROJ_ROOT / "external" / "stable-diffusion-webui"
    / "models" / "Stable-diffusion" / "westernAnimation_v1.safetensors"
)
FIGHTERS_JSON = PROJ_ROOT / "tools" / "fighters_sd.json"
SKELETON_DIR = PROJ_ROOT / "tools" / "pose_skeletons"
POSES_DIR = PROJ_ROOT / "assets" / "poses"

STYLE_SUFFIX = (
    "1980s western cartoon arcade game art, SNES Punch-Out proportions, "
    "bold black outlines, flat cel colors, full body head to toe, "
    "plain flat background, centered"
)

NEG = (
    "photorealistic, photo, 3d render, watermark, text, logo, blurry, "
    "bad anatomy, extra limbs, multiple people, crowd, duplicate, "
    "boxing gloves, boxing ring, mouthguard, cropped, missing feet, "
    "anime, manga, chibi"
)


def build_pipeline():
    print("Loading ControlNet model (OpenPose)...")
    controlnet = ControlNetModel.from_pretrained(
        "lllyasviel/sd-controlnet-openpose",
        torch_dtype=torch.float32,
    )

    print(f"Loading checkpoint: {CHECKPOINT.name}...")
    pipe = StableDiffusionControlNetPipeline.from_single_file(
        str(CHECKPOINT),
        controlnet=controlnet,
        torch_dtype=torch.float32,
        use_safetensors=True,
    )
    pipe.scheduler = UniPCMultistepScheduler.from_config(pipe.scheduler.config)
    pipe = pipe.to("mps")
    pipe.safety_checker = None
    pipe.requires_safety_checker = False
    print("Pipeline ready.")
    return pipe


def generate_pose(pipe, fighter, pose, skeleton_img, out_path, meta_path):
    prompt_parts = []
    if fighter.get("must_wear"):
        prompt_parts.append(f"({fighter['must_wear']}:1.2)")
    prompt_parts.append(f"\"{fighter['name_tag']}\" character")
    if fighter.get("stereotype"):
        prompt_parts.append(fighter["stereotype"])
    prompt_parts.append(pose.get("pose_desc", "standing"))
    prompt_parts.append("BREAK")
    prompt_parts.append(STYLE_SUFFIX)
    prompt = ", ".join(prompt_parts)

    extra_neg = fighter.get("extra_negative", "")
    negative = f"{NEG}, {extra_neg}" if extra_neg else NEG

    # Truncate prompt to stay within CLIP limits (aim for ~70 tokens)
    words = prompt.split()
    if len(words) > 65:
        prompt = " ".join(words[:65])

    seed = torch.randint(0, 2**32, (1,)).item()
    gen = torch.Generator("mps").manual_seed(seed)

    result = pipe(
        prompt=prompt,
        negative_prompt=negative,
        image=skeleton_img,
        width=512,
        height=512,
        guidance_scale=7.5,
        controlnet_conditioning_scale=1.0,
        num_inference_steps=30,
        generator=gen,
    )
    img = result.images[0]
    img.save(out_path)

    meta = {
        "project": "pichasitos",
        "prompt": prompt,
        "negative_prompt": negative,
        "seed": seed,
        "asset_type": "pose_controlnet",
        "fighter": fighter["slug"],
        "pose": pose["pose_id"],
        "steps": 30,
        "cfg_scale": 7.5,
        "controlnet_scale": 1.0,
        "width": 512,
        "height": 512,
        "model": "westernAnimation_v1",
        "controlnet_model": "sd-controlnet-openpose",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    meta_path.write_text(json.dumps(meta, indent=2))


def main():
    fighters = json.loads(FIGHTERS_JSON.read_text())

    only_fighter = None
    only_pose = None
    for arg in sys.argv[1:]:
        if arg.startswith("--fighter="):
            only_fighter = arg.split("=", 1)[1]
        elif arg.startswith("--pose="):
            only_pose = arg.split("=", 1)[1]

    pipe = build_pipeline()

    total = 0
    skipped = 0
    for fighter in fighters:
        slug = fighter["slug"]
        if only_fighter and slug != only_fighter:
            continue

        is_player = slug == "player"
        skeleton_base = SKELETON_DIR / "back" if is_player else SKELETON_DIR

        poses = fighter.get("poses", [])
        out_dir = POSES_DIR / slug
        out_dir.mkdir(parents=True, exist_ok=True)

        for pose in poses:
            pid = pose["pose_id"]
            if only_pose and pid != only_pose:
                continue

            skeleton_file = skeleton_base / f"{pid}.png"
            if not skeleton_file.exists():
                mapped = {
                    "horn_left": "punch_left",
                    "horn_right": "punch_right",
                    "charge": "windup",
                    "stomp": "block",
                    "sig_charge": "sig_attack",
                }.get(pid, "idle")
                skeleton_file = skeleton_base / f"{mapped}.png"
            if not skeleton_file.exists():
                print(f"  SKIP {slug}/{pid}: no skeleton")
                skipped += 1
                continue

            out_path = out_dir / f"enemy_{slug}_{pid}_v1.png"
            meta_path = out_dir / f"enemy_{slug}_{pid}_v1.metadata.json"

            total += 1
            print(f"\n[{total}] {slug}/{pid}...")

            skeleton_img = Image.open(skeleton_file).convert("RGB")
            generate_pose(pipe, fighter, pose, skeleton_img, out_path, meta_path)
            print(f"  SAVED: {out_path.name}")

    print(f"\nDone! Generated {total} poses, skipped {skipped}")


if __name__ == "__main__":
    main()
