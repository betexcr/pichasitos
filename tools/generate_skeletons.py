#!/usr/bin/env python3
"""Generate OpenPose-style skeleton reference images for ControlNet conditioning."""
from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw

OUT_DIR = Path(__file__).resolve().parent / "pose_skeletons"
BACK_DIR = OUT_DIR / "back"
SIZE = 512
BG = (0, 0, 0)
JOINT_COLOR = (255, 255, 255)
BONE_COLOR = (255, 255, 255)
JOINT_R = 6
BONE_W = 4

# Joint keypoint layout for a front-facing character (OpenPose COCO 18-keypoint order):
#  0=nose, 1=neck, 2=r_shoulder, 3=r_elbow, 4=r_wrist,
#  5=l_shoulder, 6=l_elbow, 7=l_wrist, 8=r_hip, 9=r_knee,
# 10=r_ankle, 11=l_hip, 12=l_knee, 13=l_ankle

BONES = [
    (0, 1),
    (1, 2), (2, 3), (3, 4),    # right arm
    (1, 5), (5, 6), (6, 7),    # left arm
    (1, 8), (8, 9), (9, 10),   # right leg
    (1, 11), (11, 12), (12, 13),  # left leg
]

cx, cy = SIZE // 2, SIZE // 2

# Pose keypoints (x, y) for each standard pose — front-facing
FRONT_POSES = {
    "idle": {
        0: (cx, cy - 130),
        1: (cx, cy - 100),
        2: (cx - 40, cy - 95),
        3: (cx - 50, cy - 55),
        4: (cx - 40, cy - 20),
        5: (cx + 40, cy - 95),
        6: (cx + 50, cy - 55),
        7: (cx + 40, cy - 20),
        8: (cx - 25, cy + 10),
        9: (cx - 25, cy + 65),
        10: (cx - 25, cy + 120),
        11: (cx + 25, cy + 10),
        12: (cx + 25, cy + 65),
        13: (cx + 25, cy + 120),
    },
    "punch_left": {
        0: (cx + 5, cy - 130),
        1: (cx + 5, cy - 100),
        2: (cx - 35, cy - 95),
        3: (cx - 55, cy - 65),
        4: (cx - 60, cy - 30),
        5: (cx + 45, cy - 95),
        6: (cx + 80, cy - 90),
        7: (cx + 120, cy - 85),     # left fist extended forward
        8: (cx - 20, cy + 10),
        9: (cx - 25, cy + 65),
        10: (cx - 25, cy + 120),
        11: (cx + 30, cy + 10),
        12: (cx + 25, cy + 65),
        13: (cx + 25, cy + 120),
    },
    "punch_right": {
        0: (cx - 5, cy - 130),
        1: (cx - 5, cy - 100),
        2: (cx - 45, cy - 95),
        3: (cx - 80, cy - 90),
        4: (cx - 120, cy - 85),     # right fist extended forward
        5: (cx + 35, cy - 95),
        6: (cx + 55, cy - 65),
        7: (cx + 60, cy - 30),
        8: (cx - 30, cy + 10),
        9: (cx - 25, cy + 65),
        10: (cx - 25, cy + 120),
        11: (cx + 20, cy + 10),
        12: (cx + 25, cy + 65),
        13: (cx + 25, cy + 120),
    },
    "hurt": {
        0: (cx + 15, cy - 120),     # head tilted back
        1: (cx + 10, cy - 95),
        2: (cx - 30, cy - 85),
        3: (cx - 55, cy - 55),
        4: (cx - 45, cy - 25),
        5: (cx + 50, cy - 85),
        6: (cx + 65, cy - 55),
        7: (cx + 55, cy - 25),
        8: (cx - 20, cy + 10),
        9: (cx - 30, cy + 60),
        10: (cx - 35, cy + 115),
        11: (cx + 25, cy + 10),
        12: (cx + 15, cy + 60),
        13: (cx + 10, cy + 115),
    },
    "block": {
        0: (cx, cy - 128),
        1: (cx, cy - 100),
        2: (cx - 35, cy - 95),
        3: (cx - 25, cy - 65),
        4: (cx - 15, cy - 110),     # arms up guarding face
        5: (cx + 35, cy - 95),
        6: (cx + 25, cy - 65),
        7: (cx + 15, cy - 110),
        8: (cx - 25, cy + 10),
        9: (cx - 25, cy + 65),
        10: (cx - 25, cy + 120),
        11: (cx + 25, cy + 10),
        12: (cx + 25, cy + 65),
        13: (cx + 25, cy + 120),
    },
    "ko": {
        0: (cx + 30, cy + 80),      # fallen on ground
        1: (cx + 10, cy + 50),
        2: (cx - 20, cy + 45),
        3: (cx - 50, cy + 60),
        4: (cx - 70, cy + 80),
        5: (cx + 40, cy + 45),
        6: (cx + 60, cy + 60),
        7: (cx + 80, cy + 80),
        8: (cx - 10, cy + 90),
        9: (cx - 40, cy + 110),
        10: (cx - 60, cy + 120),
        11: (cx + 30, cy + 90),
        12: (cx + 60, cy + 110),
        13: (cx + 80, cy + 120),
    },
    "windup": {
        0: (cx - 10, cy - 130),
        1: (cx - 5, cy - 100),
        2: (cx - 45, cy - 95),
        3: (cx - 70, cy - 70),
        4: (cx - 80, cy - 40),      # right arm pulled back
        5: (cx + 40, cy - 95),
        6: (cx + 50, cy - 60),
        7: (cx + 40, cy - 25),
        8: (cx - 20, cy + 10),
        9: (cx - 20, cy + 65),
        10: (cx - 20, cy + 120),
        11: (cx + 25, cy + 10),
        12: (cx + 30, cy + 65),
        13: (cx + 30, cy + 120),
    },
    "taunt": {
        0: (cx, cy - 135),
        1: (cx, cy - 105),
        2: (cx - 50, cy - 100),
        3: (cx - 70, cy - 70),
        4: (cx - 60, cy - 40),      # arms spread wide
        5: (cx + 50, cy - 100),
        6: (cx + 70, cy - 70),
        7: (cx + 60, cy - 40),
        8: (cx - 25, cy + 10),
        9: (cx - 25, cy + 65),
        10: (cx - 25, cy + 120),
        11: (cx + 25, cy + 10),
        12: (cx + 25, cy + 65),
        13: (cx + 25, cy + 120),
    },
    "sig_attack": {
        0: (cx + 10, cy - 130),
        1: (cx + 5, cy - 100),
        2: (cx - 40, cy - 90),
        3: (cx - 65, cy - 55),
        4: (cx - 80, cy - 25),      # both arms forward in powerful strike
        5: (cx + 50, cy - 90),
        6: (cx + 85, cy - 65),
        7: (cx + 110, cy - 40),
        8: (cx - 15, cy + 15),
        9: (cx - 25, cy + 65),
        10: (cx - 25, cy + 115),
        11: (cx + 35, cy + 15),
        12: (cx + 30, cy + 60),
        13: (cx + 25, cy + 110),
    },
    "victory": {
        0: (cx, cy - 135),
        1: (cx, cy - 105),
        2: (cx - 45, cy - 100),
        3: (cx - 60, cy - 130),
        4: (cx - 55, cy - 155),     # arms raised in triumph
        5: (cx + 45, cy - 100),
        6: (cx + 60, cy - 130),
        7: (cx + 55, cy - 155),
        8: (cx - 25, cy + 10),
        9: (cx - 25, cy + 65),
        10: (cx - 25, cy + 120),
        11: (cx + 25, cy + 10),
        12: (cx + 25, cy + 65),
        13: (cx + 25, cy + 120),
    },
}

# Back-view poses (player character) — mirror some joint positions
BACK_POSES = {}
for pose_name, joints in FRONT_POSES.items():
    back = {}
    for k, (x, y) in joints.items():
        back[k] = (SIZE - x, y)  # horizontal mirror
    BACK_POSES[pose_name] = back


def draw_skeleton(joints: dict, filepath: Path):
    img = Image.new("RGB", (SIZE, SIZE), BG)
    draw = ImageDraw.Draw(img)

    for a, b in BONES:
        if a in joints and b in joints:
            draw.line([joints[a], joints[b]], fill=BONE_COLOR, width=BONE_W)

    for idx, (x, y) in joints.items():
        draw.ellipse(
            [x - JOINT_R, y - JOINT_R, x + JOINT_R, y + JOINT_R],
            fill=JOINT_COLOR,
        )

    img.save(filepath)


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    BACK_DIR.mkdir(parents=True, exist_ok=True)

    for name, joints in FRONT_POSES.items():
        fp = OUT_DIR / f"{name}.png"
        draw_skeleton(joints, fp)
        print(f"Front: {fp.name}")

    for name, joints in BACK_POSES.items():
        fp = BACK_DIR / f"{name}.png"
        draw_skeleton(joints, fp)
        print(f"Back:  {fp.name}")

    print(f"\nGenerated {len(FRONT_POSES)} front + {len(BACK_POSES)} back skeletons")


if __name__ == "__main__":
    main()
