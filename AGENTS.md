# PICHASITOS Agent Guide

This file is the canonical character guide for agents working on PICHASITOS assets. Follow it when generating, regenerating, editing, validating, or prompting character sprites and portraits.

## Asset Rules

- Use approved existing assets as visual references for every regeneration.
- Pose sprites are 512x512 PNG files with transparent background, full body visible, centered, and similar character scale to existing pose sprites.
- Humanoid enemies must share the same source sprite scale: standing idle bodies use an alpha bounding box height of 278px inside the 512x512 PNG canvas, aligned around `y=117..395`. Measure the transparent PNG, normalize the file itself, and do not rely on preview CSS/browser scaling. Keep `assets/poses/<slug>/enemy_<slug>_idle_vN.png` and `assets/enemies/enemy_<slug>_idle_vN.png` in sync when both exist.
- Portraits are 200x200 PNG files unless a task explicitly says otherwise.
- Preserve each character's skin tone, outfit, props, silhouette, and personality across all poses.
- Character skin tone must stay consistent across all frames and portraits. Use the latest approved idle sprite and portrait as references, then check animation transitions for visible skin-color jumps. Face, arms, legs, belly, and hands should not shift from pale to dark, red to green, or warm to cool between frames.
- Do not add accidental props, background objects, text, logos, watermarks, extra people, cropped limbs, or missing feet.
- Only the player wears canonical handwear. Enemies must never wear gloves or boxing gloves; use bare hands, props, nails, or character-specific weapons/objects instead.
- Enemies face the player from a Punch-Out perspective: chin slightly down, eyes looking at a shorter opponent, punches aimed forward and slightly downward.
- Save reproducible metadata next to generated PNG files.

## Global Sprite Style

Use a rough arcade sprite look:

```text
hand-painted arcade game sprite, rough textured brush strokes, slightly grainy flat colors, imperfect hand-drawn outlines, 1990s SNES game cartridge art quality, bold black outlines, chunky readable forms, non-anime face design
```

Avoid:

```text
photorealistic, smooth vector art, clean glossy digital illustration, anime, manga, chibi, text, logo, watermark, cropped body, missing feet, extra people
```

## Canonical Character Forms

`player`: young working-class Tico man, short black hair, green tank top with gold-yellow side stripes, dark blue jeans, brown work boots, green cloth hand wraps/gloves as the only fighter handwear in the roster. Gameplay pose sprites show him from behind, facing the enemy.

`don_carlos`: fat balding middle-aged karaoke showman, black mustache, sweaty white short-sleeve dress shirt open over huge belly, black slacks, brown dress shoes, thick gold rope chain, chrome microphone.

`gringo`: sunburnt American tourist, short blond hair, backward red baseball cap, red Hawaiian or tomato-red t-shirt, khaki cargo shorts, brown hiking sandals, fanny pack, confused and scared attitude.

`clarisa`: young spoiled fresa woman, long straight black hair, hot pink top, white pants, red high heels, hoop earrings, phone in hand.

`panzaeperra`: thin dark-skinned street kid, black cap, gray tank top, dark pants, dark shoes, gold tooth, scrappy dangerous street fighter.

`michiquito`: young rich kid, neat dark brown side-parted hair gelled flat, hot pink polo shirt, cream pants, tan leather shoes, oversized flashy gold wristwatch, smug spoiled expression.

`hitmena`: woman with dark blonde or gold dreadlocks, nose ring, purple top, olive green pants, barefoot, juggling clubs, feminist malabarista energy.

`karen`: stocky middle-aged white woman, short side-swept blonde bob haircut with darker roots, navy-purple puff-sleeve blouse like a TV interview outfit, blue jeans, black shoes, aggressive frustrated mom, entitled, demanding, speak-to-the-manager-complaint energy.

`carretastar`: muscular sabanero cowboy, brown hair, cowboy hat with red band, brown leather shirt, olive green pants, brown boots with spurs, lasso, strong mustache.

`persefone`: young rave woman, hot pink hair in space buns, black top, short black biker shorts, pink shoes, glowsticks, pacifier necklace, EDM style.

`don_alvaro`: fat metalhead, long black hair, full beard, all-black outfit, black shirt, black pants, black shoes, patches on clothes, chains.

`anai`: thin dark-skinned Rastafarian man, dreadlocks under rasta tam or beanie, dark green shirt, olive green pants, barefoot, Caribbean Limon style.

`skin`: bald warm peach-skinned muscular bouncer, long stern face, heavy brow, huge flesh-tunnel ear gauges, black ribbed tank top, black cargo pants, black combat boots, silver wallet chain, tattooed forearms and knuckles, bare naked fists. Never give Skin gloves, wrapped fists, gray skin, weapons, ice props, doorway props, or cropped legs.

`el_indio`: muscular Indigenous Central American warrior, dark skin, black hair in Indigenous style, ochre and green face paint, jade jewelry, feathers, shirtless or bare-chested, brown or dark green wrapped pants, barefoot or sandals.

`bull`: not a human. Costa Rican Malacrianza-style bull with black head and neck, dark chest, white-gray speckled body, black lower legs, smooth zebu shoulder hump, large hanging dewlap, long upward-curving horns, tail, and four bovine legs. Never make it a minotaur, humanoid, rider, horse, or solid-color bull.

## Pose Forms

- `idle`: balanced ready stance, full body visible.
- `punch_left`: left fist or attack limb forward.
- `punch_right`: right fist or attack limb forward.
- `hurt`: recoiling from a hit from below; head snaps upward or back.
- `ko`: falling, collapsed, or defeated.
- `block`: arms raised in front of face and chest, defensive guard.
- `windup`: arm or body pulled back to prepare a big attack.
- `sig_attack`: character-specific special attack, full body visible, dynamic but readable.
- `taunt`: mocking gesture that preserves the canonical character form.
- `victory`: winning pose that preserves the canonical character form.

For `bull`, use the file-name aliases already documented in the project: `horn_left`, `horn_right`, `charge`, `stomp`, and `sig_charge`.
