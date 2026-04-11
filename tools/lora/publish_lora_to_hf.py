#!/usr/bin/env python3
"""
Publish project LoRA files to Hugging Face Hub (recommended public host for SD/LoRA).

Requires:
  pip install huggingface_hub
  HF_TOKEN or HUGGINGFACE_HUB_TOKEN (write token from https://huggingface.co/settings/tokens )

Usage (from repo root):
  python tools/lora/publish_lora_to_hf.py

Optional env:
  PICHASITOS_HF_REPO   default: inferred from git remote (github.com/USER/...) or betexcr/pichasitos-punchout-lora
"""

from __future__ import annotations

import os
import re
import subprocess
import sys
from pathlib import Path


def repo_root() -> Path:
    return Path(__file__).resolve().parents[2]


def default_hf_repo() -> str:
    env = os.environ.get("PICHASITOS_HF_REPO", "").strip()
    if env:
        return env
    try:
        out = subprocess.run(
            ["git", "config", "--get", "remote.origin.url"],
            cwd=repo_root(),
            capture_output=True,
            text=True,
            check=True,
        ).stdout.strip()
    except (subprocess.CalledProcessError, FileNotFoundError):
        return "betexcr/pichasitos-punchout-lora"
    m = re.search(r"github\.com[:/]([^/]+)/", out)
    if m:
        return f"{m.group(1)}/pichasitos-punchout-lora"
    return "betexcr/pichasitos-punchout-lora"


def main() -> int:
    token = os.environ.get("HF_TOKEN") or os.environ.get("HUGGINGFACE_HUB_TOKEN")
    if not token:
        print(
            "ERROR: Set HF_TOKEN or HUGGINGFACE_HUB_TOKEN (Hugging Face write token).\n"
            "Create one at https://huggingface.co/settings/tokens",
            file=sys.stderr,
        )
        return 1

    try:
        from huggingface_hub import HfApi
    except ImportError:
        print("ERROR: pip install huggingface_hub", file=sys.stderr)
        return 1

    root = repo_root()
    out_dir = root / "tools" / "lora" / "output"
    files = [
        ("punchout_style.safetensors", "Main Punch-Out style LoRA from this repo."),
        ("punchout_style_clean.safetensors", "Alternate naming variant from training runs."),
    ]

    repo_id = default_hf_repo()
    api = HfApi(token=token)

    api.create_repo(repo_id, repo_type="model", exist_ok=True, private=False)

    card_path = Path(__file__).with_name("hf_model_card.md")
    if card_path.is_file():
        api.upload_file(
            path_or_fileobj=str(card_path),
            path_in_repo="README.md",
            repo_id=repo_id,
            repo_type="model",
            commit_message="Update model card",
        )

    for name, desc in files:
        path = out_dir / name
        if not path.is_file():
            print(f"SKIP (missing): {path}", file=sys.stderr)
            continue
        print(f"Uploading {name} ({desc})...")
        api.upload_file(
            path_or_fileobj=str(path),
            path_in_repo=name,
            repo_id=repo_id,
            repo_type="model",
            commit_message=f"Add {name}",
        )

    print(f"Done. Model page: https://huggingface.co/{repo_id}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
