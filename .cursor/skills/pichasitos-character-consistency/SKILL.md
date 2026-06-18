---
name: pichasitos-character-consistency
description: Keeps PICHASITOS fighter sprite, portrait, and pose generations consistent. Use when generating, regenerating, editing, validating, or writing prompts for PICHASITOS characters, enemies, poses, portraits, sprites, Stable Diffusion assets, or GenerateImage assets.
---

# PICHASITOS Character Consistency

## Required Workflow

Before generating or editing character assets:

1. Read `AGENTS.md` for the canonical character forms.
2. Use existing approved character art as references whenever possible.
3. Keep pose sprites full body, head to toe, centered on a 512x512 transparent canvas.
4. Match the approved source sprite scale by measurement, not by eye. Humanoid enemy idle sprites must have an alpha bounding box height of 278px inside the 512x512 canvas, centered/aligned at roughly `y=117..395`. Normalize the PNG canvas itself; do not rely on preview CSS or browser scaling.
5. Preserve the character's canonical skin tone, outfit, props, and silhouette across every pose.
6. Lock skin color across animation frames. Use the latest approved idle sprite and portrait as the skin-tone reference, then compare transitions in the animation preview. A character's face, arms, legs, and belly must not shift from pale to dark, red to green, or warm to cool between frames.
7. Only the player wears canonical handwear. Generate no gloves or boxing gloves on enemies; use bare hands, nails, props, or character-specific objects instead.
8. Remove accidental props, background objects, extra people, text, logos, and cropped limbs.
9. Save metadata next to every generated PNG.
10. Keep the game and preview loading the latest numbered sprite and portrait versions automatically.

When regenerating a humanoid enemy, verify both paths if they exist:

```text
assets/poses/<slug>/enemy_<slug>_idle_vN.png
assets/enemies/enemy_<slug>_idle_vN.png
```

Both must use the same normalized idle image dimensions so the animation preview and in-game renderer show the same height.

## Sprite Style

Use this style language for pose sprites:

```text
hand-painted arcade game sprite, rough textured brush strokes, slightly grainy flat colors, imperfect hand-drawn outlines, 1990s SNES game cartridge art quality, bold black outlines, non-anime face design, full body head to toe, centered silhouette
```

Avoid:

```text
clean vector art, smooth digital illustration, photorealism, anime, manga, chibi, gloves, boxing gloves, cropped body, missing feet, text, logo, watermark, extra people, background props
```

## Critical Character Locks

`skin` is a bald, warm peach-skinned, tattooed bouncer with huge ear gauges, a black ribbed tank top, black cargo pants, black combat boots, a silver wallet chain, and bare naked tattooed fists. Never give Skin gloves, wrapped fists, gray skin, weapons, ice props, doorway props, or cropped legs.

`player` is shown from behind in gameplay pose sprites. He wears a green tank top with gold-yellow side stripes, dark blue jeans, brown work boots, and green cloth hand wraps. He does not wear boxing gloves.

`bull` is not humanoid. It is a Costa Rican Malacrianza-style bull with black head and neck, dark chest, white-gray speckled body, black lower legs, smooth zebu shoulder hump, large dewlap, long upward-curving horns, tail, and four bovine legs.

## Pose Semantics

Standard enemy pose names:

```text
idle, punch_left, punch_right, hurt, ko, block, windup, sig_attack, taunt, victory
```

Use these meanings consistently:

- `idle`: ready stance, full body visible, balanced weight.
- `block`: arms raised defensively in front of face/chest.
- `windup`: one arm pulled back preparing a heavy attack.
- `sig_attack`: the named special attack, full body visible, dynamic but readable.
- `hurt`: recoils from a hit coming from below; enemy head snaps upward or back.
- `ko`: falling, collapsed, or visibly defeated.

Enemies face the player from the Punch-Out perspective: they look slightly downward at a shorter opponent, and punches angle forward with a slight downward aim.

## Version Loading

Pose, enemy-idle, and portrait loaders must prefer the highest available numbered asset version. Do not hard-code a current version like `v3` as the permanent latest.

Use descending version fallback for sprites:

```text
v20, v19, ..., v2, v1
```

When adding a future sprite or portrait set such as `v4`, name the PNG and metadata files with that version suffix. The game and preview should find it without changing per-character code.
