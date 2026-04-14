#!/usr/bin/env python3
"""
Regenerate player poses using img2img from idle reference.
Ultra-short prompts focused on single character with clear pose.
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
POSES_DIR = PROJ_ROOT / "assets" / "poses" / "player"
CHECKPOINT = (
    PROJ_ROOT / "external" / "stable-diffusion-webui"
    / "models" / "Stable-diffusion" / "westernAnimation_v1.safetensors"
)

NEG = (
    "multiple people, two people, crowd, duo, pair, opponent, "
    "photorealistic, photo, 3d, watermark, text, blurry, "
    "extra limbs, anime, manga, face visible, front view"
)

PLAYER_POSES = {
    "idle": {
        "prompt": (
            "solo muscular man from behind, green tank top, blue jeans, brown boots, "
            "fighting stance, fists up near chin, wide legs, "
            "bold outlines, flat colors, game sprite, white background"
        ),
        "strength": 0.55,
    },
    "punch_left": {
        "prompt": (
            "solo muscular man from behind throwing left punch, green tank top, blue jeans, "
            "left arm fully extended forward, right arm back at chin, torso twisted right, "
            "bold outlines, flat colors, game sprite, white background"
        ),
        "strength": 0.72,
    },
    "punch_right": {
        "prompt": (
            "solo muscular man from behind throwing right punch, green tank top, blue jeans, "
            "right arm fully extended forward, left arm back at chin, torso twisted left, "
            "bold outlines, flat colors, game sprite, white background"
        ),
        "strength": 0.72,
    },
    "hurt": {
        "prompt": (
            "solo muscular man from behind recoiling in pain, green tank top, blue jeans, "
            "leaning backward, head tilted, arms dropping, stumbling, "
            "bold outlines, flat colors, game sprite, white background"
        ),
        "strength": 0.70,
    },
    "block": {
        "prompt": (
            "solo muscular man from behind in classic boxer high guard, green tank top, blue jeans, "
            "both forearms tight in front of face, elbows tucked, chin down, bracing frontal punch, "
            "bold outlines, flat colors, game sprite, white background"
        ),
        "strength": 0.68,
    },
    "dodge_left": {
        "prompt": (
            "solo muscular man from behind doing a left slip dodge, green tank top, blue jeans, "
            "head and torso shifted left, shoulder rolled, guard still up, quick evasive motion, "
            "bold outlines, flat colors, game sprite, white background"
        ),
        "strength": 0.74,
    },
    "dodge_back": {
        "prompt": (
            "solo muscular man from behind doing a pullback dodge, green tank top, blue jeans, "
            "upper body leaning backward, weight on back leg, both fists near face, avoiding frontal punch, "
            "bold outlines, flat colors, game sprite, white background"
        ),
        "strength": 0.74,
    },
    "dodge_right": {
        "prompt": (
            "solo muscular man from behind doing a right slip dodge, green tank top, blue jeans, "
            "head and torso shifted right, shoulder rolled, guard still up, quick evasive motion, "
            "bold outlines, flat colors, game sprite, white background"
        ),
        "strength": 0.74,
    },
    "ko": {
        "prompt": (
            "solo muscular man from behind falling down knocked out, green tank top, blue jeans, "
            "collapsing forward, knees buckling, arms limp, defeated, "
            "bold outlines, flat colors, game sprite, white background"
        ),
        "strength": 0.75,
    },
    "windup": {
        "prompt": (
            "solo muscular man from behind winding up punch, green tank top, blue jeans, "
            "right fist pulled far back behind ear, left arm forward, body coiled, "
            "bold outlines, flat colors, game sprite, white background"
        ),
        "strength": 0.72,
    },
    "taunt": {
        "prompt": (
            "solo muscular man from behind taunting, green tank top, blue jeans, "
            "one hand beckoning come here, other hand on hip, cocky lean, "
            "bold outlines, flat colors, game sprite, white background"
        ),
        "strength": 0.72,
    },
    "sig_attack": {
        "prompt": (
            "solo muscular man from behind doing overhead slam, green tank top, blue jeans, "
            "both fists raised high above head, jumping in air, feet off ground, "
            "bold outlines, flat colors, game sprite, white background"
        ),
        "strength": 0.78,
    },
    "victory": {
        "prompt": (
            "solo muscular man from behind celebrating victory, green tank top, blue jeans, "
            "both arms raised up in triumph, fists pumped high, standing tall proud, "
            "bold outlines, flat colors, game sprite, white background"
        ),
        "strength": 0.68,
    },
}

VARIANTS = 4


def load_pipeline():
    print(f"Loading checkpoint: {CHECKPOINT.name}...")
    pipe = StableDiffusionImg2ImgPipeline.from_single_file(
        str(CHECKPOINT), torch_dtype=torch.float32, use_safetensors=True,
    )
    pipe = pipe.to("mps")
    pipe.safety_checker = None
    pipe.requires_safety_checker = False
    print("Pipeline ready.")
    return pipe


def remove_background(img_path: Path):
    try:
        from rembg import remove
        result = remove(img_path.read_bytes())
        img_path.write_bytes(result)
        print(f"    bg removed")
    except ImportError:
        print("    WARNING: rembg not installed")


def main():
    POSES_DIR.mkdir(parents=True, exist_ok=True)

    ref_path = ENEMIES_DIR / "enemy_player_idle_v1.png"
    ref_image = Image.open(ref_path).convert("RGB").resize((512, 512), Image.LANCZOS)

    only = {a for a in sys.argv[1:] if not a.startswith("--")}
    force = "--force" in sys.argv
    poses = {k: v for k, v in PLAYER_POSES.items() if not only or k in only}
    print(f"Poses to generate: {list(poses.keys())}")

    pipe = load_pipeline()

    for pi, (pose_id, pdef) in enumerate(poses.items(), 1):
        prompt = pdef["prompt"]
        strength = pdef["strength"]
        print(f"\n[{pi}/{len(poses)}] {pose_id} (str={strength})")

        best_img = None
        best_seed = None

        for v in range(VARIANTS):
            seed = torch.randint(0, 2**32, (1,)).item()
            gen = torch.Generator("mps").manual_seed(seed)

            img = pipe(
                prompt=prompt, negative_prompt=NEG, image=ref_image,
                strength=strength, guidance_scale=8.5,
                num_inference_steps=30, generator=gen,
            ).images[0]

            var_path = POSES_DIR / f"enemy_player_{pose_id}_var{v}.png"
            img.save(var_path)
            print(f"  var{v}: seed={seed}")

            if best_img is None:
                best_img = img
                best_seed = seed

        out = POSES_DIR / f"enemy_player_{pose_id}_v1.png"
        best_img.save(out)
        remove_background(out)

        meta = {
            "project": "pichasitos", "prompt": prompt,
            "negative_prompt": NEG, "seed": best_seed,
            "prompt_version": "v5.2", "style": "pichasitos_western_cartoon",
            "asset_type": "pose", "pose_id": pose_id,
            "fighter_slug": "player", "steps": 30,
            "cfg_scale": 8.5, "strength": strength,
            "model": "westernAnimation_v1",
            "reference_image": "enemy_player_idle_v1.png",
            "variants_generated": VARIANTS,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "validated": False,
        }
        (POSES_DIR / f"enemy_player_{pose_id}_v1.png.metadata.json").write_text(
            json.dumps(meta, indent=2)
        )
        print(f"  SAVED: {out.name}")

    print("\nDone. Review var files, pick best, copy to _v1.png if needed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
