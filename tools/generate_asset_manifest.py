#!/usr/bin/env python3
"""
Scan assets/ and write assets/asset-manifest.json with exact paths (latest version per key).

Run after adding or replacing sprites:
    python tools/generate_asset_manifest.py
"""
from __future__ import annotations

import json
import re
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

PROJ_ROOT = Path(__file__).resolve().parent.parent
ASSETS_DIR = PROJ_ROOT / "assets"
OUT_PATH = ASSETS_DIR / "asset-manifest.json"

# Maps file pose names on disk -> game pose keys (bull only).
BULL_FILE_TO_POSE = {
    "horn_left": "punch_left",
    "horn_right": "punch_right",
    "charge": "windup",
    "stomp": "block",
    "sig_charge": "sig_attack",
}

RE_ENEMY_IDLE = re.compile(r"^enemy_(?P<slug>[a-z0-9_]+)_idle_v(?P<ver>\d+)\.png$")
RE_PORTRAIT = re.compile(r"^portrait_(?P<slug>[a-z0-9_]+)_(?P<variant>\w+)_v(?P<ver>\d+)\.png$")
RE_POSE_SUFFIX = re.compile(r"^(?P<file_pose>.+)_v(?P<ver>\d+)(?:_f(?P<frame>\d+))?\.png$")
RE_UI_BG = re.compile(r"^(?P<name>[a-z0-9_]+)\.(jpg|png)$")
RE_MONSTER = re.compile(r"^(?P<name>monster_[a-z0-9_]+)\.png$")


def rel_posix(path: Path) -> str:
    return path.relative_to(PROJ_ROOT).as_posix()


def ver_num(ver: str) -> int:
    return int(ver)


def pick_higher_version(current: str | None, candidate: str) -> str:
    if current is None:
        return candidate
    return candidate if ver_num(candidate) > ver_num(current) else current


def game_pose(slug: str, file_pose: str) -> str:
    if slug == "bull":
        return BULL_FILE_TO_POSE.get(file_pose, file_pose)
    return file_pose


def scan() -> dict:
    fighters: dict = defaultdict(lambda: {
        "idle": None,
        "idleVersion": None,
        "portraits": {},
        "portraitVersions": {},
        "poses": defaultdict(dict),  # pose -> frame_index -> (ver, path)
    })
    backgrounds: dict[str, tuple[int, str]] = {}
    monsters: dict[str, str] = {}

    enemies_dir = ASSETS_DIR / "enemies"
    if enemies_dir.is_dir():
        for path in enemies_dir.glob("*.png"):
            m = RE_ENEMY_IDLE.match(path.name)
            if not m:
                continue
            slug = m.group("slug")
            ver = m.group("ver")
            entry = fighters[slug]
            if entry["idleVersion"] is None or ver_num(ver) > ver_num(entry["idleVersion"]):
                entry["idle"] = rel_posix(path)
                entry["idleVersion"] = ver

    portraits_dir = ASSETS_DIR / "portraits"
    if portraits_dir.is_dir():
        for path in portraits_dir.glob("*.png"):
            m = RE_PORTRAIT.match(path.name)
            if not m:
                continue
            slug = m.group("slug")
            variant = m.group("variant")
            ver = m.group("ver")
            entry = fighters[slug]
            cur_ver = entry["portraitVersions"].get(variant)
            if cur_ver is None or ver_num(ver) > ver_num(cur_ver):
                entry["portraits"][variant] = rel_posix(path)
                entry["portraitVersions"][variant] = ver

    poses_dir = ASSETS_DIR / "poses"
    if poses_dir.is_dir():
        for slug_dir in poses_dir.iterdir():
            if not slug_dir.is_dir():
                continue
            slug = slug_dir.name
            prefix = f"enemy_{slug}_"
            for path in slug_dir.glob("*.png"):
                name = path.name
                if not name.startswith(prefix):
                    continue
                m = RE_POSE_SUFFIX.match(name[len(prefix):])
                if not m:
                    continue
                file_pose = m.group("file_pose")
                pose = game_pose(slug, file_pose)
                ver = m.group("ver")
                frame = int(m.group("frame") or "1")
                frame_idx = frame - 1
                entry = fighters[slug]
                frames = entry["poses"][pose]
                existing = frames.get(frame_idx)
                if existing is None or ver_num(ver) > ver_num(existing[0]):
                    frames[frame_idx] = (ver, rel_posix(path))

    ui_bg_dir = ASSETS_DIR / "ui_bg"
    if ui_bg_dir.is_dir():
        for path in ui_bg_dir.iterdir():
            if not path.is_file():
                continue
            m = RE_UI_BG.match(path.name)
            if not m:
                continue
            name = m.group("name")
            # Prefer jpg for arenas when both exist
            ext_rank = 1 if path.suffix.lower() == ".jpg" else 0
            cur = backgrounds.get(name)
            if cur is None or ext_rank > cur[0]:
                backgrounds[name] = (ext_rank, rel_posix(path))

    monsters_dir = ASSETS_DIR / "monsters"
    if monsters_dir.is_dir():
        for path in monsters_dir.glob("*.png"):
            m = RE_MONSTER.match(path.name)
            if not m:
                continue
            monsters[m.group("name")] = rel_posix(path)

    fighters_out: dict = {}
    for slug in sorted(fighters.keys()):
        raw = fighters[slug]
        out: dict = {}
        if raw["idle"]:
            out["idle"] = raw["idle"]
        if raw["portraits"]:
            out["portraits"] = dict(sorted(raw["portraits"].items()))
        poses_out: dict = {}
        for pose in sorted(raw["poses"].keys()):
            frames = raw["poses"][pose]
            ordered = [frames[i][1] for i in sorted(frames.keys())]
            if ordered:
                poses_out[pose] = ordered
        if poses_out:
            out["poses"] = poses_out
        if out:
            fighters_out[slug] = out

    backgrounds_out = {k: v[1] for k, v in sorted(backgrounds.items())}

    return {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "fighters": fighters_out,
        "backgrounds": backgrounds_out,
        "monsters": dict(sorted(monsters.items())),
    }


def main() -> None:
    manifest = scan()
    OUT_PATH.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    fighter_count = len(manifest["fighters"])
    pose_count = sum(len(f.get("poses", {})) for f in manifest["fighters"].values())
    print(f"Wrote {OUT_PATH.relative_to(PROJ_ROOT)}")
    print(f"  fighters: {fighter_count}, pose groups: {pose_count}")
    print(f"  backgrounds: {len(manifest['backgrounds'])}, monsters: {len(manifest['monsters'])}")


if __name__ == "__main__":
    main()
