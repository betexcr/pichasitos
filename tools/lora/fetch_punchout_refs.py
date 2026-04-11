#!/usr/bin/env python3
from __future__ import annotations

import re
import urllib.request
from pathlib import Path

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) PunchoutDatasetBot/1.0"
OUT_DIR = Path(__file__).resolve().parent / "dataset" / "10_punchout_style"

GALLERY_URLS = [
    "https://www.spriters-resource.com/nes/punchout/",
    "https://www.spriters-resource.com/snes/spunchout/",
]

CAPTION = (
    "punchout_style, 1980s western cartoon arcade game art, bold black outlines, "
    "flat cel colors, punch-out sprite sheet"
)


def fetch_text(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8", errors="ignore")


def fetch_bytes(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read()


def unique_in_order(items: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for item in items:
        if item not in seen:
            seen.add(item)
            out.append(item)
    return out


def gallery_to_detail_links(html: str) -> list[str]:
    links = re.findall(r'href="(/(?:nes/punchout|snes/spunchout)/asset/\d+/)"', html)
    return unique_in_order([f"https://www.spriters-resource.com{link}" for link in links])


def detail_to_image_url(html: str) -> str | None:
    m = re.search(r'href="(/media/assets/[^"]+)"', html)
    if m:
        return f"https://www.spriters-resource.com{m.group(1)}"
    return None


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    detail_links: list[str] = []
    for gallery_url in GALLERY_URLS:
        try:
            html = fetch_text(gallery_url)
        except Exception as e:
            print(f"gallery_error {gallery_url} {e}")
            continue
        detail_links.extend(gallery_to_detail_links(html))

    detail_links = unique_in_order(detail_links)
    if not detail_links:
        print("no_detail_links_found")
        return 1

    saved = 0
    for idx, detail_url in enumerate(detail_links[:40], start=1):
        try:
            html = fetch_text(detail_url)
            image_url = detail_to_image_url(html)
            if not image_url:
                print(f"no_image_url {detail_url}")
                continue
            raw = fetch_bytes(image_url)
        except Exception as e:
            print(f"detail_error {detail_url} {e}")
            continue

        ext = ".jpg"
        lower = image_url.lower()
        if ".png" in lower:
            ext = ".png"
        elif ".webp" in lower:
            ext = ".webp"

        stem = f"{idx:04d}"
        (OUT_DIR / f"{stem}{ext}").write_bytes(raw)
        (OUT_DIR / f"{stem}.txt").write_text(CAPTION + "\n", encoding="utf-8")
        print(f"saved {stem}{ext}")
        saved += 1

    print(f"downloaded {saved}")
    return 0 if saved else 1


if __name__ == "__main__":
    raise SystemExit(main())
