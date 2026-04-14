#!/usr/bin/env python3
"""
Remove backgrounds from PICHASITOS pose PNGs using rembg.

Usage:
    pip install rembg[gpu]   # or rembg[cpu]
    python tools/remove_bg.py --all
    python tools/remove_bg.py --dir assets/enemies/don_carlos
    python tools/remove_bg.py --file assets/enemies/enemy_don_carlos_idle_v1.png
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path


def repo_root() -> Path:
    return Path(__file__).resolve().parents[1]


def remove_bg_single(input_path: Path, output_path: Path | None = None) -> bool:
    try:
        from rembg import remove
    except ImportError:
        print("ERROR: rembg not installed. Run: pip install rembg[cpu]", file=sys.stderr)
        return False

    if output_path is None:
        output_path = input_path

    img_bytes = input_path.read_bytes()
    result = remove(img_bytes)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_bytes(result)
    print(f"  bg removed: {output_path}")
    return True


def process_directory(dir_path: Path, dry_run: bool = False) -> int:
    pngs = sorted(dir_path.rglob("*.png"))
    pngs = [p for p in pngs if not p.name.endswith(".metadata.json")]
    if not pngs:
        print(f"No PNGs found in {dir_path}")
        return 0

    count = 0
    for png in pngs:
        if dry_run:
            print(f"  would process: {png}")
            count += 1
            continue
        if remove_bg_single(png):
            count += 1
    return count


def main() -> int:
    root = repo_root()
    p = argparse.ArgumentParser(description="Remove backgrounds from PICHASITOS pose PNGs")
    p.add_argument("--file", type=Path, help="Single PNG file to process")
    p.add_argument("--dir", type=Path, help="Directory of PNGs to process recursively")
    p.add_argument(
        "--all",
        action="store_true",
        help="Process all pose subdirectories under assets/enemies/<slug>/",
    )
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args()

    if args.file:
        fpath = args.file if args.file.is_absolute() else root / args.file
        if not fpath.is_file():
            print(f"ERROR: file not found: {fpath}", file=sys.stderr)
            return 1
        if args.dry_run:
            print(f"would process: {fpath}")
            return 0
        return 0 if remove_bg_single(fpath) else 1

    if args.dir:
        dpath = args.dir if args.dir.is_absolute() else root / args.dir
        if not dpath.is_dir():
            print(f"ERROR: directory not found: {dpath}", file=sys.stderr)
            return 1
        count = process_directory(dpath, dry_run=args.dry_run)
        print(f"Processed {count} files in {dpath}")
        return 0

    if args.all:
        poses_dir = root / "assets" / "poses"
        total = 0
        for slug_dir in sorted(poses_dir.iterdir()):
            if slug_dir.is_dir():
                print(f"Processing {slug_dir.name}/...")
                total += process_directory(slug_dir, dry_run=args.dry_run)
        print(f"Total: {total} files processed")
        return 0

    p.error("provide --file, --dir, or --all")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
