#!/usr/bin/env python3
"""
Automatic1111 txt2img export for PICHASITOS assets.

Punch-Out-target pipeline: western-cartoon checkpoint + optional LoRA, with short costume-first
prompts for the fighter roster. Run: ``python tools/sd_export.py --all-fighters``

Requires Web UI with --api. On NansException, restart UI or use --no-half.
"""
from __future__ import annotations

import argparse
import base64
import json
import random
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib import error, request

A1111_BREAK = "BREAK"

SOLO_ONE_PERSON = (
    "(((single full-body character))), exactly one character only, exactly one human only, one person total, "
    "solo fighter, isolated subject, zero extra people, zero side characters, zero background people, "
    "no crowd, no audience, no duplicate faces, no duplicate bodies, whole body visible head to toe, "
    "both feet visible, centered in frame"
)

SOLO_ONE_PORTRAIT_PERSON = (
    "(((single character portrait))), exactly one character only, exactly one human only, one person total, "
    "solo portrait, isolated subject, zero extra people, zero side characters, zero background people, "
    "close-up head and upper torso only, centered portrait framing"
)

HUMAN_OPPONENT_POSE = (
    "ready-to-fight idle opponent stance, knees bent, one foot forward, shoulders angled, torso twisted slightly "
    "toward camera, clenched bare fists raised near chest, street-fight guard, tense arcade opponent energy, "
    "not relaxed, not casual posing"
)

PUNCHOUT_STYLE_SUFFIX = (
    "Super Punch-Out inspired promotional character concept art, 1990s SNES arcade illustration, western cartoon "
    "caricature, hand-painted cel finish, clean ink outlines, smooth cel shading, bold highlights on skin and cloth, "
    "exaggerated expressive face, thick brows, strong jaw, oversized forearms and hands, readable silhouette, "
    "non-anime face design, full body head to toe, simple warm off-white seamless backdrop, empty background, "
    "no scenery, no stage, no poster layout"
)

PORTRAIT_STYLE_SUFFIX = (
    "1980s western cartoon arcade game art, SNES Punch-Out inspired proportions, same character design language as the "
    "approved full-body enemy art, bold black outlines, flat cel colors, square jaw, thick brows, chunky readable forms, "
    "expressive face, non-anime face design, close head-and-upper-torso crop of the same fighter, facing camera or slight "
    "three-quarter, plain solid single-color background, clean empty backdrop, no graphic backdrop, no poster composition"
)

SOLO_ONE_BEAST = (
    "(((single full-body animal))), exactly one bull only, solo animal, isolated subject, "
    "zero humans, zero matadors, zero herd, zero extra animals, whole body visible, full silhouette visible, "
    "all four hooves visible, tail visible, horns fully visible, centered in frame, camera pulled back, extra margin around animal"
)

SOLO_ONE_PORTRAIT_BEAST = (
    "(((single animal portrait))), exactly one bull only, solo animal portrait, isolated subject, "
    "zero humans, zero matadors, zero herd, zero extra animals, close-up head and chest portrait only, "
    "horns fully visible, centered portrait framing"
)

BULL_OPPONENT_POSE = (
    "boss enemy idle stance, all four hooves planted, head lowered, horns forward, ready to charge, "
    "tense arcade boss posture, not grazing, not resting, broadside three-quarter view so the entire body reads clearly"
)

PORTRAIT_EXPRESSION = (
    "intense arcade rival portrait expression, eyes locked on camera, confrontational face, portrait-ready tension, "
    "same facial structure and line language as the approved enemy sprite"
)

SOLO_PROMPT_LEAD = (
    "single character concept art, arcade opponent design sheet, one fighter only, solo subject, centered, isolated, "
    "not a group shot, not a duo, not a trio, simple blank backdrop only, no backdrop graphics, "
    "not fashion illustration, not poster art"
)

BUST_PROMPT_LEAD = (
    "single character portrait concept art, arcade versus portrait, same fighter design as the approved full-body enemy art, "
    "one fighter only, solo subject, centered, isolated, tight head-and-torso framing, not a group shot, not a duo, "
    "simple blank backdrop only, no backdrop graphics, not fashion illustration, not poster art"
)

BULL_PUNCHOUT_STYLE_SUFFIX = (
    "Super Punch-Out inspired boss concept art, 1990s SNES arcade illustration, western cartoon caricature, "
    "hand-painted cel finish, clean ink outlines, smooth cel shading, bold highlights, exaggerated readable silhouette, "
    "full body four hooves visible, full horns visible, full tail visible, subject fits completely inside frame with padding, "
    "simple warm off-white seamless backdrop, empty background, no scenery"
)

PORTRAIT_BULL_STYLE_SUFFIX = (
    "1980s western cartoon arcade game art, SNES Punch-Out inspired boss design, same design language as the approved "
    "full-body enemy art, bold black outlines, flat cel colors, exaggerated readable silhouette, bull head and chest "
    "portrait, horns fully visible, centered framing, plain solid single-color background, clean empty backdrop, "
    "no graphic backdrop, no poster composition"
)

STYLE_SUFFIX = PUNCHOUT_STYLE_SUFFIX
BULL_STYLE_SUFFIX = BULL_PUNCHOUT_STYLE_SUFFIX
PORTRAIT_STYLE = PORTRAIT_STYLE_SUFFIX
PORTRAIT_BULL_STYLE = PORTRAIT_BULL_STYLE_SUFFIX

ANCHOR_WEIGHT = 1.25
ANCHOR_MAX_SEGMENTS = 5
ANCHOR_SEGMENT_MAX_LEN = 52

DEFAULT_NEG = (
    "photorealistic, photo, realistic skin, 3d render, "
    "watermark, text, logo, blurry, bad anatomy, extra limbs, "
    "multiple people, multiple characters, extra character, second person, third person, duo, trio, group shot, team, "
    "crowd, audience, background person, sidekick, lineup, character sheet, sprite sheet, collage, contact sheet, "
    "duplicate, duplicate face, duplicate body, clone, twins, triplets, mirrored duplicate, "
    "abstract backdrop shape, abstract background blob, spotlight shape, paint splash background, halo backdrop, "
    "pedestal, platform, podium, rock, boulder, floor blob, ground shadow blob, giant shadow oval, "
    "background text, giant letters, typography, poster, poster design, graphic design, infographic, "
    "logo mark, emblem, badge, symbol, icon, sign, sunburst, rays, radial burst, target shape, background pattern, "
    "giant circle, giant ring, giant shape behind character, "
    "boxing gloves, boxing ring, ring ropes, stage, theater stage, archway, spotlight background, mouthguard, "
    "cropped, missing feet, bust only, "
    "fashion illustration, fashion sketch, runway pose, glamour pose, catalog pose, selfie pose, model pose, "
    "arms crossed, hands on hips, peace sign, thumbs up, casual standing pose, relaxed stance, "
    "holding microphone, singing into microphone, holding smartphone, taking selfie, holding map, holding beer bottle, "
    "anime, manga, chibi, kawaii, moe, anime eyes, anime face, anime hair, cel anime, shoujo, bishounen"
)

DEFAULT_FIGHTERS_JSON = Path(__file__).resolve().parent / "fighters_sd.json"
FIGHTER_FILENAME_TEMPLATE = "enemy_{slug}_idle_v1.png"
PORTRAIT_FILENAME_TEMPLATE = "portrait_{slug}_angry_v1.png"
POSE_FILENAME_TEMPLATE = "enemy_{slug}_{pose_id}_v1.png"
DEFAULT_WIDTH = 512
DEFAULT_HEIGHT = 896
DEFAULT_PORTRAIT_WIDTH = 512
DEFAULT_PORTRAIT_HEIGHT = 512
DEFAULT_STEPS = 30
DEFAULT_CFG = 6.5
DEFAULT_SAMPLER = "DPM++ SDE Karras"
DEFAULT_CHECKPOINT = ""
DEFAULT_CLIP_SKIP = 1
DEFAULT_LORA = ""
DEFAULT_STYLE = "pichasitos_western_cartoon"


def repo_root() -> Path:
    return Path(__file__).resolve().parents[1]


def resolve_seed(cli_seed: int | None) -> int:
    if cli_seed is not None:
        return cli_seed
    return random.randint(0, 2**31 - 1)


def _parse_info_dict(response_body: dict) -> dict:
    info = response_body.get("info")
    if info is None:
        return {}
    if isinstance(info, dict):
        return info
    if isinstance(info, str):
        try:
            parsed = json.loads(info)
            return parsed if isinstance(parsed, dict) else {}
        except json.JSONDecodeError:
            return {}
    return {}


def infer_asset_type(path: Path) -> str:
    parts = [p.lower() for p in path.parts]
    if "enemies" in parts:
        return "enemy"
    if "portraits" in parts:
        return "portrait"
    if "ui_bg" in parts:
        return "ui_bg"
    if "map_nodes" in parts:
        return "map_node"
    return "unknown"


def build_metadata(
    response_body: dict,
    *,
    prompt: str,
    negative_prompt: str,
    seed_sent: int,
    steps: int,
    cfg_scale: float,
    width: int,
    height: int,
    sampler_label: str,
    parent_seed: int | None = None,
    prompt_version: str = "v1.0",
    style: str = DEFAULT_STYLE,
    asset_type: str = "unknown",
) -> dict:
    info_dict = _parse_info_dict(response_body)

    def pick(key: str, fallback):
        v = info_dict.get(key)
        if v is None or v == "":
            return fallback
        return v

    seed_val = pick("seed", seed_sent)

    return {
        "project": "pichasitos",
        "prompt": pick("prompt", prompt),
        "negative_prompt": pick("negative_prompt", negative_prompt),
        "seed": seed_val,
        "parent_seed": parent_seed,
        "prompt_version": prompt_version,
        "style": style,
        "asset_type": asset_type,
        "steps": int(pick("steps", steps)),
        "cfg_scale": float(pick("cfg_scale", cfg_scale)),
        "sampler": sampler_label,
        "width": pick("width", width),
        "height": pick("height", height),
        "model": pick("sd_model_name", "unknown"),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "validated": False,
    }


def metadata_path_for_png(out_path: Path) -> Path:
    return out_path.with_suffix(".metadata.json")


def save_image_and_metadata(out_path: Path, png_bytes: bytes, metadata: dict) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_bytes(png_bytes)
    meta_path = metadata_path_for_png(out_path)
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
        f.write("\n")
    print(f"Saved:\n- image: {out_path}\n- metadata: {meta_path}\n- seed: {metadata.get('seed')}")


def split_sampler_arg(s: str) -> tuple[str, str | None]:
    """Map UI label 'DPM++ 2M Karras' to API sampler_name + scheduler."""
    s = s.strip()
    if s.endswith(" Karras") and "DPM++" in s:
        return s[: -len(" Karras")].strip(), "Karras"
    if s == "DPM++ 2M Karras":
        return "DPM++ 2M", "Karras"
    return s, None


def build_txt2img_payload(
    *,
    prompt: str,
    negative_prompt: str,
    steps: int,
    cfg_scale: float,
    width: int,
    height: int,
    sampler_name: str,
    scheduler: str | None,
    seed: int,
    checkpoint: str | None = None,
    clip_skip: int | None = None,
) -> dict:
    payload: dict = {
        "prompt": prompt,
        "negative_prompt": negative_prompt,
        "steps": steps,
        "cfg_scale": cfg_scale,
        "width": width,
        "height": height,
        "sampler_name": sampler_name,
        "seed": seed,
        "batch_size": 1,
        "n_iter": 1,
    }
    if scheduler:
        payload["scheduler"] = scheduler

    override_settings: dict[str, object] = {}
    if checkpoint:
        override_settings["sd_model_checkpoint"] = checkpoint
    if clip_skip is not None:
        override_settings["CLIP_stop_at_last_layers"] = clip_skip
    if override_settings:
        payload["override_settings"] = override_settings
        payload["override_settings_restore_afterwards"] = True

    return payload


def build_img2img_payload(
    *,
    prompt: str,
    negative_prompt: str,
    steps: int,
    cfg_scale: float,
    width: int,
    height: int,
    sampler_name: str,
    scheduler: str | None,
    seed: int,
    init_image_bytes: bytes,
    denoising_strength: float,
    checkpoint: str | None = None,
    clip_skip: int | None = None,
) -> dict:
    payload = build_txt2img_payload(
        prompt=prompt,
        negative_prompt=negative_prompt,
        steps=steps,
        cfg_scale=cfg_scale,
        width=width,
        height=height,
        sampler_name=sampler_name,
        scheduler=scheduler,
        seed=seed,
        checkpoint=checkpoint,
        clip_skip=clip_skip,
    )
    payload["init_images"] = [base64.b64encode(init_image_bytes).decode("utf-8")]
    payload["denoising_strength"] = denoising_strength
    payload["resize_mode"] = 0
    return payload


def post_txt2img(base_url: str, payload: dict, timeout: int = 1200) -> tuple[bytes, dict]:
    url = base_url.rstrip("/") + "/sdapi/v1/txt2img"
    data = json.dumps(payload).encode("utf-8")
    req = request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with request.urlopen(req, timeout=timeout) as resp:
            body = json.loads(resp.read().decode("utf-8"))
    except error.HTTPError as e:
        err = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"txt2img HTTP {e.code}: {err[:2000]}") from e
    except error.URLError as e:
        raise RuntimeError(f"Cannot reach SD API: {e}") from e
    images = body.get("images") or []
    if not images:
        raise RuntimeError("No images in response: " + json.dumps(body)[:400])
    return base64.b64decode(images[0]), body


def post_img2img(base_url: str, payload: dict, timeout: int = 1200) -> tuple[bytes, dict]:
    url = base_url.rstrip("/") + "/sdapi/v1/img2img"
    data = json.dumps(payload).encode("utf-8")
    req = request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with request.urlopen(req, timeout=timeout) as resp:
            body = json.loads(resp.read().decode("utf-8"))
    except error.HTTPError as e:
        err = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"img2img HTTP {e.code}: {err[:2000]}") from e
    except error.URLError as e:
        raise RuntimeError(f"Cannot reach SD API: {e}") from e
    images = body.get("images") or []
    if not images:
        raise RuntimeError("No images in response: " + json.dumps(body)[:400])
    return base64.b64decode(images[0]), body


def generate_one(
    base_url: str,
    *,
    full_prompt: str,
    negative_prompt: str,
    steps: int,
    cfg_scale: float,
    width: int,
    height: int,
    sampler_label: str,
    seed: int,
    checkpoint: str | None = None,
    clip_skip: int | None = None,
    init_image_path: Path | None = None,
    denoising_strength: float | None = None,
) -> tuple[bytes, dict]:
    sampler_name, scheduler = split_sampler_arg(sampler_label)
    if init_image_path is None:
        payload = build_txt2img_payload(
            prompt=full_prompt,
            negative_prompt=negative_prompt,
            steps=steps,
            cfg_scale=cfg_scale,
            width=width,
            height=height,
            sampler_name=sampler_name,
            scheduler=scheduler,
            seed=seed,
            checkpoint=checkpoint,
            clip_skip=clip_skip,
        )
        submit = post_txt2img
    else:
        if denoising_strength is None:
            raise ValueError("denoising_strength is required when init_image_path is provided")
        payload = build_img2img_payload(
            prompt=full_prompt,
            negative_prompt=negative_prompt,
            steps=steps,
            cfg_scale=cfg_scale,
            width=width,
            height=height,
            sampler_name=sampler_name,
            scheduler=scheduler,
            seed=seed,
            init_image_bytes=init_image_path.read_bytes(),
            denoising_strength=denoising_strength,
            checkpoint=checkpoint,
            clip_skip=clip_skip,
        )
        submit = post_img2img
    try:
        return submit(base_url, payload)
    except RuntimeError as e:
        err = str(e).lower()
        if ("nan" in err or "nans" in err) and sampler_name != "Euler a":
            payload["sampler_name"] = "Euler a"
            payload.pop("scheduler", None)
            return submit(base_url, payload)
        raise


def load_fighters_json(path: Path) -> list[dict]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise ValueError("fighters JSON must be a list")
    return data


def normalize_slug(value: str) -> str:
    return str(value).strip().lower().replace(" ", "_")


def _trim_anchor_segment(s: str, max_len: int) -> str:
    s = s.strip()
    if len(s) <= max_len:
        return s
    cut = s[:max_len].rsplit(" ", 1)[0]
    return cut if cut else s[:max_len]


def visual_anchor_from_fighter(fighter: dict) -> str:
    """Short weighted lead from visual_anchor or first comma phrases of must_wear."""
    raw = (fighter.get("visual_anchor") or "").strip()
    if raw:
        inner = raw.strip()
        if inner.startswith("(") and inner.endswith(")"):
            inner = inner[1:-1].strip()
        return f"({inner}:{ANCHOR_WEIGHT})"
    mw = fighter.get("must_wear") or fighter.get("subject") or ""
    parts = [p.strip() for p in str(mw).split(",") if p.strip()]
    parts = [_trim_anchor_segment(p, ANCHOR_SEGMENT_MAX_LEN) for p in parts[:ANCHOR_MAX_SEGMENTS]]
    if not parts:
        return ""
    return f"({', '.join(parts)}:{ANCHOR_WEIGHT})"


def fighter_core_from_entry(fighter: dict) -> str:
    if fighter.get("style_variant") == "bull":
        tag = fighter.get("name_tag", "EL TORO")
        st = fighter.get("stereotype", "fiesta bull boss")
        mw = fighter.get("must_wear", "brown bull cream horns nose ring")
        ps = fighter.get("pose", "charge stance")
        return f'"{tag}" boss. {st}. Signature look: {mw}. Attitude: {ps}'
    if fighter.get("stereotype") and fighter.get("must_wear") and fighter.get("pose"):
        tag = fighter.get("name_tag", fighter.get("slug", "enemy").replace("_", " ").upper())
        return (
            f'"{tag}" enemy. {fighter["stereotype"]}. '
            f'Costume and worn accessories: {fighter["must_wear"]}. '
            f'Expression and attitude: {fighter["pose"]}'
        )
    if fighter.get("subject"):
        return str(fighter["subject"])
    name = fighter.get("name", "unknown")
    tag = fighter.get("tag", "")
    return f"{name}, full body facing camera, {tag}".strip(", ")


def style_suffix_for_fighter(fighter: dict) -> str:
    if fighter.get("style_variant") == "bull":
        return BULL_STYLE_SUFFIX
    return STYLE_SUFFIX


def portrait_style_suffix_for_fighter(fighter: dict) -> str:
    if fighter.get("style_variant") == "bull":
        return PORTRAIT_BULL_STYLE
    return PORTRAIT_STYLE


def resolve_lora_tag(lora_arg: str, lora_weight: float | None) -> str:
    raw = (lora_arg or "").strip()
    if not raw:
        return ""

    name = raw
    weight_from_arg: float | None = None
    if ":" in raw:
        maybe_name, maybe_weight = raw.rsplit(":", 1)
        try:
            weight_from_arg = float(maybe_weight)
            name = maybe_name.strip()
        except ValueError:
            name = raw

    if not name:
        return ""

    weight = lora_weight if lora_weight is not None else weight_from_arg
    if weight is None:
        weight = 0.75
    return f"<lora:{name}:{weight:g}>"


def build_fighter_full_prompt(
    fighter: dict,
    *,
    use_break: bool = True,
    lora_tag: str = "",
) -> str:
    solo_lead = SOLO_ONE_BEAST if fighter.get("style_variant") == "bull" else SOLO_ONE_PERSON
    combat_pose = BULL_OPPONENT_POSE if fighter.get("style_variant") == "bull" else HUMAN_OPPONENT_POSE
    anchor = visual_anchor_from_fighter(fighter)
    core = fighter_core_from_entry(fighter)
    style = style_suffix_for_fighter(fighter)
    lead_parts = [part for part in (lora_tag, solo_lead, SOLO_PROMPT_LEAD, anchor, core, combat_pose) if part]
    lead = ", ".join(lead_parts)
    if use_break:
        return f"{lead}, {A1111_BREAK}, {style}"
    return f"{lead}, {style}"


def build_portrait_full_prompt(
    fighter: dict,
    *,
    use_break: bool = True,
    lora_tag: str = "",
) -> str:
    solo_lead = SOLO_ONE_PORTRAIT_BEAST if fighter.get("style_variant") == "bull" else SOLO_ONE_PORTRAIT_PERSON
    anchor = visual_anchor_from_fighter(fighter)
    core = fighter_core_from_entry(fighter)
    style = portrait_style_suffix_for_fighter(fighter)
    lead_parts = [part for part in (lora_tag, solo_lead, BUST_PROMPT_LEAD, anchor, core, PORTRAIT_EXPRESSION) if part]
    lead = ", ".join(lead_parts)
    if use_break:
        return f"{lead}, {A1111_BREAK}, {style}"
    return f"{lead}, {style}"


def build_pose_full_prompt(
    fighter: dict,
    pose: dict,
    *,
    use_break: bool = True,
    lora_tag: str = "",
) -> str:
    """Build a prompt for a specific pose variant of a fighter."""
    solo_lead = SOLO_ONE_BEAST if fighter.get("style_variant") == "bull" else SOLO_ONE_PERSON
    anchor = visual_anchor_from_fighter(fighter)
    core = fighter_core_from_entry(fighter)
    pose_desc = pose.get("pose_desc", "idle standing")
    style = style_suffix_for_fighter(fighter)
    pose_section = f"pose and action: {pose_desc}"
    lead_parts = [part for part in (lora_tag, solo_lead, SOLO_PROMPT_LEAD, anchor, core, pose_section) if part]
    lead = ", ".join(lead_parts)
    if use_break:
        return f"{lead}, {A1111_BREAK}, {style}"
    return f"{lead}, {style}"


def negative_prompt_for_fighter(base_negative: str, fighter: dict) -> str:
    extra = str(fighter.get("extra_negative", "") or "").strip()
    if not extra:
        return base_negative
    return f"{base_negative}, {extra}"


def main() -> int:
    root = repo_root()
    p = argparse.ArgumentParser(description="PICHASITOS SD export (A1111 txt2img)")
    p.add_argument("--base-url", default="http://127.0.0.1:7860", help="A1111 base URL (no trailing path)")
    p.add_argument("--prompt", type=str, help="Subject prompt (style suffix appended automatically)")
    p.add_argument("--out", type=Path, help="Output PNG under assets/...")
    p.add_argument(
        "--fighters",
        type=Path,
        nargs="?",
        const=DEFAULT_FIGHTERS_JSON,
        default=None,
        metavar="PATH",
        help=f"Batch from JSON roster (default: {DEFAULT_FIGHTERS_JSON.name})",
    )
    p.add_argument(
        "--all-fighters",
        action="store_true",
        help=f"Same as --fighters with default {DEFAULT_FIGHTERS_JSON.name}",
    )
    p.add_argument(
        "--portraits",
        type=Path,
        nargs="?",
        const=DEFAULT_FIGHTERS_JSON,
        default=None,
        metavar="PATH",
        help=f"Batch portraits from JSON roster (default: {DEFAULT_FIGHTERS_JSON.name})",
    )
    p.add_argument(
        "--all-portraits",
        action="store_true",
        help=f"Same as --portraits with default {DEFAULT_FIGHTERS_JSON.name}",
    )
    p.add_argument(
        "--poses",
        type=Path,
        nargs="?",
        const=DEFAULT_FIGHTERS_JSON,
        default=None,
        metavar="PATH",
        help=f"Batch pose variants from JSON roster (default: {DEFAULT_FIGHTERS_JSON.name})",
    )
    p.add_argument(
        "--all-poses",
        action="store_true",
        help=f"Same as --poses with default {DEFAULT_FIGHTERS_JSON.name}",
    )

    p.add_argument("--negative", type=str, default=DEFAULT_NEG)
    p.add_argument("--steps", type=int, default=DEFAULT_STEPS)
    p.add_argument("--cfg", type=float, default=DEFAULT_CFG, help="Higher = stick closer to prompt (try 7-9)")
    p.add_argument("--width", type=int, default=DEFAULT_WIDTH)
    p.add_argument("--height", type=int, default=DEFAULT_HEIGHT)
    p.add_argument("--sampler", type=str, default=DEFAULT_SAMPLER, help='e.g. "DPM++ SDE Karras" or "Euler a"')
    p.add_argument("--seed", type=int, default=None, help="Fixed seed; omit for random per image")
    p.add_argument(
        "--checkpoint",
        type=str,
        default=DEFAULT_CHECKPOINT,
        help="Checkpoint filename for A1111 override_settings; leave empty to use the model already loaded in the UI",
    )
    p.add_argument("--clip-skip", type=int, default=DEFAULT_CLIP_SKIP, help="CLIP_stop_at_last_layers override")
    p.add_argument("--lora", type=str, default=DEFAULT_LORA, help='Optional LoRA spec, e.g. "punchout_style:0.75"')
    p.add_argument("--lora-weight", type=float, default=None, help="Optional override for LoRA weight")
    p.add_argument("--no-lora", action="store_true", help="Disable LoRA injection entirely")
    p.add_argument(
        "--reference-dir",
        type=Path,
        default=None,
        help="Optional directory of reference PNGs for img2img, matched as <prefix><slug><suffix>",
    )
    p.add_argument("--reference-prefix", type=str, default="enemy_")
    p.add_argument("--reference-suffix", type=str, default="_idle_v1.png")
    p.add_argument(
        "--denoising-strength",
        type=float,
        default=0.38,
        help="img2img denoising strength when using --reference-dir",
    )

    p.add_argument("--parent-seed", type=int, default=None)
    p.add_argument("--prompt-version", type=str, default="v4.2")
    p.add_argument("--asset-type", type=str, default="unknown")
    p.add_argument("--style", type=str, default=DEFAULT_STYLE)
    p.add_argument("--fighter-style", type=str, default="punchout", help=argparse.SUPPRESS)
    p.add_argument(
        "--no-prompt-break",
        action="store_true",
        help="Omit A1111 BREAK between character block and style (use if your Web UI errors on BREAK)",
    )

    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--limit", type=int, default=0, metavar="N", help="Batch: only first N entries")
    p.add_argument(
        "--slugs",
        type=str,
        default="",
        help='Batch: comma-separated fighter slugs to generate, e.g. "gringo,don_carlos"',
    )
    p.add_argument(
        "--pose-ids",
        type=str,
        default="",
        help='Poses: comma-separated pose IDs to generate, e.g. "punch_left,punch_right" (default: all)',
    )

    args = p.parse_args()
    lora_tag = "" if args.no_lora else resolve_lora_tag(args.lora, args.lora_weight)

    fighters_path: Path | None = None
    portraits_path: Path | None = None
    poses_path: Path | None = None
    if args.all_fighters:
        fighters_path = DEFAULT_FIGHTERS_JSON
    elif args.fighters is not None:
        fighters_path = args.fighters
    if args.all_portraits:
        portraits_path = DEFAULT_FIGHTERS_JSON
    elif args.portraits is not None:
        portraits_path = args.portraits
    if args.all_poses:
        poses_path = DEFAULT_FIGHTERS_JSON
    elif args.poses is not None:
        poses_path = args.poses

    if fighters_path is not None:
        json_path = fighters_path if fighters_path.is_absolute() else root / fighters_path
        if not json_path.is_file():
            print(f"ERROR: fighters file not found: {json_path}", file=sys.stderr)
            return 1
        roster = load_fighters_json(json_path)
        if args.slugs.strip():
            wanted = [normalize_slug(part) for part in args.slugs.split(",") if part.strip()]
            wanted_set = set(wanted)
            roster = [fighter for fighter in roster if normalize_slug(fighter.get("slug", "")) in wanted_set]
            found = {normalize_slug(fighter.get("slug", "")) for fighter in roster}
            missing = [slug for slug in wanted if slug not in found]
            if missing:
                print(f"ERROR: unknown fighter slug(s): {', '.join(missing)}", file=sys.stderr)
                return 1
        if args.limit and args.limit > 0:
            roster = roster[: args.limit]
        out_dir = root / "assets" / "enemies"
        use_break = not args.no_prompt_break

        for fighter in roster:
            slug = str(fighter.get("slug", "unknown")).lower().replace(" ", "_")
            full_prompt = build_fighter_full_prompt(
                fighter,
                use_break=use_break,
                lora_tag=lora_tag,
            )
            fighter_negative = negative_prompt_for_fighter(args.negative, fighter)
            out_name = FIGHTER_FILENAME_TEMPLATE.format(slug=slug)
            out_path = out_dir / out_name
            seed_eff = resolve_seed(args.seed)

            if args.dry_run:
                print(f"{slug} -> {out_path}\n  {full_prompt[:240]}...")
                continue

            asset_type = args.asset_type if args.asset_type != "unknown" else "enemy"
            try:
                png_bytes, response_body = generate_one(
                    args.base_url,
                    full_prompt=full_prompt,
                    negative_prompt=fighter_negative,
                    steps=args.steps,
                    cfg_scale=args.cfg,
                    width=args.width,
                    height=args.height,
                    sampler_label=args.sampler,
                    seed=seed_eff,
                    checkpoint=args.checkpoint,
                    clip_skip=args.clip_skip,
                )
            except RuntimeError as e:
                print(f"ERROR [{slug}]: {e}", file=sys.stderr)
                return 1

            metadata = build_metadata(
                response_body,
                prompt=full_prompt,
                negative_prompt=fighter_negative,
                seed_sent=seed_eff,
                steps=args.steps,
                cfg_scale=args.cfg,
                width=args.width,
                height=args.height,
                sampler_label=args.sampler,
                parent_seed=args.parent_seed,
                prompt_version=args.prompt_version,
                style=args.style,
                asset_type=asset_type,
            )
            save_image_and_metadata(out_path, png_bytes, metadata)

        return 0

    if portraits_path is not None:
        json_path = portraits_path if portraits_path.is_absolute() else root / portraits_path
        if not json_path.is_file():
            print(f"ERROR: portraits roster file not found: {json_path}", file=sys.stderr)
            return 1
        reference_dir: Path | None = None
        if args.reference_dir is not None:
            reference_dir = args.reference_dir if args.reference_dir.is_absolute() else root / args.reference_dir
            if not reference_dir.is_dir():
                print(f"ERROR: reference dir not found: {reference_dir}", file=sys.stderr)
                return 1
        roster = load_fighters_json(json_path)
        if args.slugs.strip():
            wanted = [normalize_slug(part) for part in args.slugs.split(",") if part.strip()]
            wanted_set = set(wanted)
            roster = [fighter for fighter in roster if normalize_slug(fighter.get("slug", "")) in wanted_set]
            found = {normalize_slug(fighter.get("slug", "")) for fighter in roster}
            missing = [slug for slug in wanted if slug not in found]
            if missing:
                print(f"ERROR: unknown fighter slug(s): {', '.join(missing)}", file=sys.stderr)
                return 1
        if args.limit and args.limit > 0:
            roster = roster[: args.limit]
        out_dir = root / "assets" / "portraits"
        use_break = not args.no_prompt_break
        width_eff = args.width if args.width != DEFAULT_WIDTH else DEFAULT_PORTRAIT_WIDTH
        height_eff = args.height if args.height != DEFAULT_HEIGHT else DEFAULT_PORTRAIT_HEIGHT

        for fighter in roster:
            slug = str(fighter.get("slug", "unknown")).lower().replace(" ", "_")
            full_prompt = build_portrait_full_prompt(
                fighter,
                use_break=use_break,
                lora_tag=lora_tag,
            )
            fighter_negative = negative_prompt_for_fighter(args.negative, fighter)
            out_name = PORTRAIT_FILENAME_TEMPLATE.format(slug=slug)
            out_path = out_dir / out_name
            seed_eff = resolve_seed(args.seed)
            reference_path: Path | None = None
            if reference_dir is not None:
                reference_name = f"{args.reference_prefix}{slug}{args.reference_suffix}"
                reference_path = reference_dir / reference_name
                if not reference_path.is_file():
                    print(f"ERROR [{slug}]: reference image not found: {reference_path}", file=sys.stderr)
                    return 1

            if args.dry_run:
                ref_info = f"\n  ref: {reference_path}" if reference_path is not None else ""
                print(f"{slug} -> {out_path}{ref_info}\n  {full_prompt[:240]}...")
                continue

            asset_type = args.asset_type if args.asset_type != "unknown" else "portrait"
            try:
                png_bytes, response_body = generate_one(
                    args.base_url,
                    full_prompt=full_prompt,
                    negative_prompt=fighter_negative,
                    steps=args.steps,
                    cfg_scale=args.cfg,
                    width=width_eff,
                    height=height_eff,
                    sampler_label=args.sampler,
                    seed=seed_eff,
                    checkpoint=args.checkpoint,
                    clip_skip=args.clip_skip,
                    init_image_path=reference_path,
                    denoising_strength=args.denoising_strength if reference_path is not None else None,
                )
            except RuntimeError as e:
                print(f"ERROR [{slug}]: {e}", file=sys.stderr)
                return 1

            metadata = build_metadata(
                response_body,
                prompt=full_prompt,
                negative_prompt=fighter_negative,
                seed_sent=seed_eff,
                steps=args.steps,
                cfg_scale=args.cfg,
                width=width_eff,
                height=height_eff,
                sampler_label=args.sampler,
                parent_seed=args.parent_seed,
                prompt_version=args.prompt_version,
                style=args.style,
                asset_type=asset_type,
            )
            if reference_path is not None:
                metadata["generation_mode"] = "img2img_reference_portrait"
                metadata["denoising_strength"] = args.denoising_strength
                metadata["source_reference"] = str(reference_path)
            save_image_and_metadata(out_path, png_bytes, metadata)

        return 0

    if poses_path is not None:
        json_path = poses_path if poses_path.is_absolute() else root / poses_path
        if not json_path.is_file():
            print(f"ERROR: poses roster file not found: {json_path}", file=sys.stderr)
            return 1
        pose_reference_dir: Path | None = None
        if args.reference_dir is not None:
            pose_reference_dir = args.reference_dir if args.reference_dir.is_absolute() else root / args.reference_dir
            if not pose_reference_dir.is_dir():
                print(f"ERROR: reference dir not found: {pose_reference_dir}", file=sys.stderr)
                return 1
        roster = load_fighters_json(json_path)
        if args.slugs.strip():
            wanted = [normalize_slug(part) for part in args.slugs.split(",") if part.strip()]
            wanted_set = set(wanted)
            roster = [fighter for fighter in roster if normalize_slug(fighter.get("slug", "")) in wanted_set]
            found = {normalize_slug(fighter.get("slug", "")) for fighter in roster}
            missing = [slug for slug in wanted if slug not in found]
            if missing:
                print(f"ERROR: unknown fighter slug(s): {', '.join(missing)}", file=sys.stderr)
                return 1
        if args.limit and args.limit > 0:
            roster = roster[: args.limit]
        use_break = not args.no_prompt_break

        wanted_pose_ids: set[str] | None = None
        if args.pose_ids.strip():
            wanted_pose_ids = {pid.strip() for pid in args.pose_ids.split(",") if pid.strip()}

        for fighter in roster:
            slug = str(fighter.get("slug", "unknown")).lower().replace(" ", "_")
            fighter_poses = fighter.get("poses", [])
            if not fighter_poses:
                print(f"SKIP [{slug}]: no poses defined")
                continue
            out_dir = root / "assets" / "poses" / slug
            fighter_negative = negative_prompt_for_fighter(args.negative, fighter)

            ref_path: Path | None = None
            if pose_reference_dir is not None:
                ref_name = f"{args.reference_prefix}{slug}{args.reference_suffix}"
                ref_path = pose_reference_dir / ref_name
                if not ref_path.is_file():
                    print(f"WARN [{slug}]: reference image not found: {ref_path}, falling back to txt2img")
                    ref_path = None

            for pose in fighter_poses:
                if wanted_pose_ids is not None and pose.get("pose_id", "unknown") not in wanted_pose_ids:
                    continue
                pose_id = pose.get("pose_id", "unknown")
                full_prompt = build_pose_full_prompt(
                    fighter,
                    pose,
                    use_break=use_break,
                    lora_tag=lora_tag,
                )
                out_name = POSE_FILENAME_TEMPLATE.format(slug=slug, pose_id=pose_id)
                out_path = out_dir / out_name
                seed_eff = resolve_seed(args.seed)

                if args.dry_run:
                    ref_info = f"\n  ref: {ref_path}" if ref_path is not None else ""
                    print(f"{slug}/{pose_id} -> {out_path}{ref_info}\n  {full_prompt[:240]}...")
                    continue

                try:
                    png_bytes, response_body = generate_one(
                        args.base_url,
                        full_prompt=full_prompt,
                        negative_prompt=fighter_negative,
                        steps=args.steps,
                        cfg_scale=args.cfg,
                        width=args.width,
                        height=args.height,
                        sampler_label=args.sampler,
                        seed=seed_eff,
                        checkpoint=args.checkpoint,
                        clip_skip=args.clip_skip,
                        init_image_path=ref_path,
                        denoising_strength=args.denoising_strength if ref_path is not None else None,
                    )
                except RuntimeError as e:
                    print(f"ERROR [{slug}/{pose_id}]: {e}", file=sys.stderr)
                    return 1

                metadata = build_metadata(
                    response_body,
                    prompt=full_prompt,
                    negative_prompt=fighter_negative,
                    seed_sent=seed_eff,
                    steps=args.steps,
                    cfg_scale=args.cfg,
                    width=args.width,
                    height=args.height,
                    sampler_label=args.sampler,
                    parent_seed=args.parent_seed,
                    prompt_version=args.prompt_version,
                    style=args.style,
                    asset_type="enemy_pose",
                )
                metadata["pose_id"] = pose_id
                metadata["pose_desc"] = pose.get("pose_desc", "")
                if ref_path is not None:
                    metadata["generation_mode"] = "img2img_reference_pose"
                    metadata["denoising_strength"] = args.denoising_strength
                    metadata["source_reference"] = str(ref_path)
                save_image_and_metadata(out_path, png_bytes, metadata)

        return 0

    if not args.prompt or not args.out:
        p.error("provide --prompt and --out, or --fighters / --all-fighters, or --portraits / --all-portraits, or --poses / --all-poses")

    out_path = args.out if args.out.is_absolute() else root / args.out
    prompt_parts = [part for part in (lora_tag, args.prompt) if part]
    full_prompt = f"{', '.join(prompt_parts)}, {STYLE_SUFFIX}"
    seed_eff = resolve_seed(args.seed)

    if args.dry_run:
        print(full_prompt)
        print(f"-> {out_path}")
        return 0

    asset_type = args.asset_type
    if asset_type == "unknown":
        asset_type = infer_asset_type(out_path)

    try:
        png_bytes, response_body = generate_one(
            args.base_url,
            full_prompt=full_prompt,
            negative_prompt=args.negative,
            steps=args.steps,
            cfg_scale=args.cfg,
            width=args.width,
            height=args.height,
            sampler_label=args.sampler,
            seed=seed_eff,
            checkpoint=args.checkpoint,
            clip_skip=args.clip_skip,
        )
    except RuntimeError as e:
        print(e, file=sys.stderr)
        return 1

    metadata = build_metadata(
        response_body,
        prompt=full_prompt,
        negative_prompt=args.negative,
        seed_sent=seed_eff,
        steps=args.steps,
        cfg_scale=args.cfg,
        width=args.width,
        height=args.height,
        sampler_label=args.sampler,
        parent_seed=args.parent_seed,
        prompt_version=args.prompt_version,
        style=args.style,
        asset_type=asset_type,
    )
    save_image_and_metadata(out_path, png_bytes, metadata)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
