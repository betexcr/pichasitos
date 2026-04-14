#!/usr/bin/env python3
"""Resize circuit arena backgrounds for in-game display and save as JPEG.

Logical playfield width is CONST.WIDTH (256); RENDER_SCALE is 3, so 768px source
width is sufficient. Run after replacing arena PNGs in assets/ui_bg/.
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image

PROJ_ROOT = Path(__file__).resolve().parent.parent
UI_BG = PROJ_ROOT / "assets" / "ui_bg"
ARENAS = ("arena_pueblo", "arena_feria", "arena_redondel", "arena_muerte")
MAX_W = 768
JPEG_Q = 85


def main() -> None:
    for name in ARENAS:
        png = UI_BG / f"{name}.png"
        jpg = UI_BG / f"{name}.jpg"
        if not png.is_file():
            print(f"skip (no PNG): {png.name}")
            continue
        im = Image.open(png).convert("RGB")
        w, h = im.size
        if w > MAX_W:
            nh = max(1, int(round(h * MAX_W / w)))
            im = im.resize((MAX_W, nh), Image.Resampling.LANCZOS)
        im.save(jpg, format="JPEG", quality=JPEG_Q, optimize=True, subsampling=2)
        print(f"wrote {jpg.name} ({jpg.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
