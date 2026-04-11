#!/usr/bin/env python3
from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

SRC_DIR = Path(__file__).resolve().parent / "dataset" / "10_punchout_style"
OUT_DIR = Path(__file__).resolve().parent / "dataset" / "20_punchout_single"
CAPTION = (
    "punchout_style, single fighter, solo character, 1980s western cartoon arcade game art, "
    "bold black outlines, flat cel colors, exaggerated boxing character"
)

MIN_WIDTH = 42
MIN_HEIGHT = 58
MIN_AREA = 3000
MAX_AREA_RATIO = 0.22
PADDING = 6
DILATE_RADIUS = 0


def is_foreground(px: tuple[int, int, int, int]) -> bool:
    r, g, b, a = px
    if a <= 8:
        return False
    if r < 12 and g < 12 and b < 12:
        return False
    return True


def dilate(mask: list[list[bool]], radius: int) -> list[list[bool]]:
    h = len(mask)
    w = len(mask[0]) if h else 0
    out = [[False] * w for _ in range(h)]
    offsets: list[tuple[int, int]] = []
    for dy in range(-radius, radius + 1):
        for dx in range(-radius, radius + 1):
            if dx * dx + dy * dy <= radius * radius:
                offsets.append((dx, dy))
    for y in range(h):
        row = mask[y]
        for x in range(w):
            if not row[x]:
                continue
            for dx, dy in offsets:
                nx = x + dx
                ny = y + dy
                if 0 <= nx < w and 0 <= ny < h:
                    out[ny][nx] = True
    return out


def connected_components(mask: list[list[bool]]) -> list[tuple[int, int, int, int]]:
    h = len(mask)
    w = len(mask[0]) if h else 0
    seen = [[False] * w for _ in range(h)]
    boxes: list[tuple[int, int, int, int]] = []
    for y in range(h):
        for x in range(w):
            if not mask[y][x] or seen[y][x]:
                continue
            q = deque([(x, y)])
            seen[y][x] = True
            min_x = max_x = x
            min_y = max_y = y
            while q:
                cx, cy = q.popleft()
                if cx < min_x:
                    min_x = cx
                if cx > max_x:
                    max_x = cx
                if cy < min_y:
                    min_y = cy
                if cy > max_y:
                    max_y = cy
                for nx, ny in (
                    (cx - 1, cy),
                    (cx + 1, cy),
                    (cx, cy - 1),
                    (cx, cy + 1),
                    (cx - 1, cy - 1),
                    (cx + 1, cy - 1),
                    (cx - 1, cy + 1),
                    (cx + 1, cy + 1),
                ):
                    if 0 <= nx < w and 0 <= ny < h and mask[ny][nx] and not seen[ny][nx]:
                        seen[ny][nx] = True
                        q.append((nx, ny))
            boxes.append((min_x, min_y, max_x + 1, max_y + 1))
    return boxes


def foreground_ratio(img: Image.Image, box: tuple[int, int, int, int]) -> float:
    x0, y0, x1, y1 = box
    px = img.load()
    hits = 0
    total = max((x1 - x0) * (y1 - y0), 1)
    for y in range(y0, y1):
        for x in range(x0, x1):
            if is_foreground(px[x, y]):
                hits += 1
    return hits / total


def good_box(box: tuple[int, int, int, int], image_area: int, img: Image.Image) -> bool:
    x0, y0, x1, y1 = box
    width = x1 - x0
    height = y1 - y0
    area = width * height
    if width < MIN_WIDTH or height < MIN_HEIGHT:
        return False
    if area < MIN_AREA:
        return False
    if area > image_area * MAX_AREA_RATIO:
        return False
    aspect = width / max(height, 1)
    if aspect < 0.22 or aspect > 1.45:
        return False
    fill = foreground_ratio(img, box)
    if fill > 0.72:
        return False
    return True


def pad_box(box: tuple[int, int, int, int], width: int, height: int) -> tuple[int, int, int, int]:
    x0, y0, x1, y1 = box
    return (
        max(0, x0 - PADDING),
        max(0, y0 - PADDING),
        min(width, x1 + PADDING),
        min(height, y1 + PADDING),
    )


def box_area(box: tuple[int, int, int, int]) -> int:
    x0, y0, x1, y1 = box
    return max(0, x1 - x0) * max(0, y1 - y0)


def refine_crop_box(img: Image.Image, crop_box: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
    cropped = img.crop(crop_box)
    w, h = cropped.size
    px = cropped.load()
    mask = [[is_foreground(px[x, y]) for x in range(w)] for y in range(h)]
    boxes = [b for b in connected_components(mask) if box_area(b) >= 400]
    if not boxes:
        return crop_box

    main = max(boxes, key=box_area)
    main_area = box_area(main)
    mx0, my0, mx1, my1 = main
    margin = 4
    keep = [main]
    for box in boxes:
        if box == main:
            continue
        if box_area(box) < main_area * 0.12:
            continue
        x0, y0, x1, y1 = box
        if x1 < mx0 - margin or x0 > mx1 + margin or y1 < my0 - margin or y0 > my1 + margin:
            continue
        keep.append(box)

    min_x = min(b[0] for b in keep)
    min_y = min(b[1] for b in keep)
    max_x = max(b[2] for b in keep)
    max_y = max(b[3] for b in keep)
    gx0, gy0, _, _ = crop_box
    refined = (gx0 + min_x, gy0 + min_y, gx0 + max_x, gy0 + max_y)
    return pad_box(refined, img.size[0], img.size[1])


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for old in OUT_DIR.glob("*"):
        if old.is_file():
            old.unlink()

    saved = 0
    for sheet in sorted(SRC_DIR.glob("*.png")):
        img = Image.open(sheet).convert("RGBA")
        w, h = img.size
        px = img.load()
        base_mask = [[is_foreground(px[x, y]) for x in range(w)] for y in range(h)]
        merged_mask = dilate(base_mask, DILATE_RADIUS)
        boxes = connected_components(merged_mask)
        image_area = w * h

        local_index = 1
        for box in boxes:
            if not good_box(box, image_area, img):
                continue
            crop_box = pad_box(box, w, h)
            crop_box = refine_crop_box(img, crop_box)
            crop = img.crop(crop_box)
            stem = f"{sheet.stem}_{local_index:02d}"
            crop.save(OUT_DIR / f"{stem}.png")
            (OUT_DIR / f"{stem}.txt").write_text(CAPTION + "\n", encoding="utf-8")
            local_index += 1
            saved += 1

    print(f"saved {saved} crops to {OUT_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
