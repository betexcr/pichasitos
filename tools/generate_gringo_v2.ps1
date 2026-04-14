param(
  [string]$BaseUrl = "http://127.0.0.1:7860",
  [string]$Checkpoint = "",
  [int]$Steps = 30,
  [double]$CfgScale = 6.5,
  [int]$Width = 512,
  [int]$Height = 512,
  [string]$Sampler = "DPM++ SDE Karras",
  [int]$ClipSkip = 1,
  [string]$PromptVersion = "v4.2",
  [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$enemyOut = Join-Path $root "assets/enemies"
$posesOut = Join-Path $root "assets/poses/gringo"

$slug = "gringo"
$nameTag = "GRINGO"
$style = "pichasitos_western_cartoon"

$soloOne = "(((single full-body character))), exactly one character only, exactly one human only, one person total, solo fighter, isolated subject, zero extra people, zero side characters, zero background people, no crowd, no audience, no duplicate faces, no duplicate bodies, whole body visible head to toe, both feet visible, centered in frame"
$lead = "single character concept art, arcade opponent design sheet, one fighter only, solo subject, centered, isolated, not a group shot, not a duo, not a trio, simple blank backdrop only, no backdrop graphics, not fashion illustration, not poster art"
$anchor = "(visible messy blond hair under backwards red cap, coral orange t-shirt, khaki cargo shorts, fanny pack, sunburned tourist:1.25)"
$core = '"GRINGO" enemy. lost sunburned estadounidense tourist. Costume and worn accessories: clearly visible messy blond hair and blond sideburns, bright red backwards baseball cap, coral-orange t-shirt, khaki cargo shorts, white crew socks, brown hiking shoes, nylon fanny pack on waist, folded paper map sticking out cargo pocket, pink sunburn on arms and face, no brown hair, no black hair. Expression and attitude: confused angry tourist glare, stubborn macho frustration'
$idlePose = "ready-to-fight idle opponent stance, knees bent, one foot forward, shoulders angled, torso twisted slightly toward camera, clenched bare fists raised near chest, street-fight guard, tense arcade opponent energy, not relaxed, not casual posing"
$styleSuffix = "Super Punch-Out inspired promotional character concept art, 1990s SNES arcade illustration, western cartoon caricature, hand-painted cel finish, clean ink outlines, smooth cel shading, bold highlights on skin and cloth, exaggerated expressive face, thick brows, strong jaw, oversized forearms and hands, readable silhouette, non-anime face design, full body head to toe, simple warm off-white seamless backdrop, empty background, no scenery, no stage, no poster layout"
$negative = "photorealistic, photo, realistic skin, 3d render, watermark, text, logo, blurry, bad anatomy, extra limbs, multiple people, multiple characters, extra character, second person, third person, duo, trio, group shot, team, crowd, audience, background person, sidekick, lineup, character sheet, sprite sheet, collage, contact sheet, duplicate, duplicate face, duplicate body, clone, twins, triplets, mirrored duplicate, abstract backdrop shape, abstract background blob, spotlight shape, paint splash background, halo backdrop, pedestal, platform, podium, rock, boulder, floor blob, ground shadow blob, giant shadow oval, background text, giant letters, typography, poster, poster design, graphic design, infographic, logo mark, emblem, badge, symbol, icon, sign, sunburst, rays, radial burst, target shape, background pattern, giant circle, giant ring, giant shape behind character, boxing gloves, boxing ring, ring ropes, stage, theater stage, archway, spotlight background, mouthguard, cropped, missing feet, bust only, fashion illustration, fashion sketch, runway pose, glamour pose, catalog pose, selfie pose, model pose, arms crossed, hands on hips, peace sign, thumbs up, casual standing pose, relaxed stance, holding microphone, singing into microphone, holding smartphone, taking selfie, holding map, holding beer bottle, anime, manga, chibi, kawaii, moe, anime eyes, anime face, anime hair, cel anime, shoujo, bishounen, brown hair, black hair, dark hair, brunette hair, beard"

$poses = [ordered]@{
  idle        = "confused fighting stance, fists up awkwardly, sunburned face scowling"
  punch_left  = "punching downward with LEFT arm only, left fist extended forward and down, right arm pulled back behind body, clumsy swing, fanny pack bouncing, leaning forward aggressively"
  punch_right = "wild right haymaker, cap nearly falling off, desperate swing"
  hurt        = "stumbling sideways, cap flying off, grabbing sunburned face in pain"
  block       = "cowering behind raised arms, fearful grimace, tourist panic"
  ko          = "sprawled face-down, cap on ground, fanny pack spilled open, unconscious"
  windup      = "pulling fist back clumsily, squinting one eye, trying to aim"
  taunt       = "holding up phone to take selfie, oblivious smug grin"
  sig_attack  = "swinging fanny pack overhead like a flail, wild desperate attack"
  victory     = "taking victory selfie with phone, thumbs up, sunburned grin"
}

function New-Metadata {
  param(
    [string]$Prompt,
    [string]$NegativePrompt,
    [int]$Seed,
    [string]$AssetType,
    [string]$ModelName,
    [string]$PoseId = "",
    [string]$PoseDesc = ""
  )

  $meta = [ordered]@{
    project         = "pichasitos"
    prompt          = $Prompt
    negative_prompt = $NegativePrompt
    seed            = $Seed
    parent_seed     = $null
    prompt_version  = $PromptVersion
    style           = $style
    asset_type      = $AssetType
    steps           = $Steps
    cfg_scale       = $CfgScale
    sampler         = $Sampler
    width           = $Width
    height          = $Height
    model           = $ModelName
    timestamp       = [DateTimeOffset]::UtcNow.ToString("o")
    validated       = $false
  }

  if ($PoseId) {
    $meta.pose_id = $PoseId
    $meta.pose_desc = $PoseDesc
  }
  return $meta
}

function Invoke-Txt2Img {
  param(
    [string]$Prompt,
    [int]$Seed
  )

  $payload = [ordered]@{
    prompt          = $Prompt
    negative_prompt = $negative
    steps           = $Steps
    cfg_scale       = $CfgScale
    width           = $Width
    height          = $Height
    sampler_name    = $Sampler
    seed            = $Seed
    batch_size      = 1
    n_iter          = 1
    override_settings = @{
      CLIP_stop_at_last_layers = $ClipSkip
    }
    override_settings_restore_afterwards = $true
  }

  if ($Checkpoint) {
    $payload.override_settings.sd_model_checkpoint = $Checkpoint
  }

  return Invoke-RestMethod -Uri "$($BaseUrl.TrimEnd('/'))/sdapi/v1/txt2img" -Method Post -ContentType "application/json" -Body ($payload | ConvertTo-Json -Depth 8)
}

function Save-PngAndMetadata {
  param(
    [string]$OutPath,
    [byte[]]$PngBytes,
    [hashtable]$Metadata
  )

  $outDir = Split-Path -Parent $OutPath
  if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir | Out-Null
  }

  [System.IO.File]::WriteAllBytes($OutPath, $PngBytes)
  $metaPath = [System.IO.Path]::ChangeExtension($OutPath, ".metadata.json")
  ($Metadata | ConvertTo-Json -Depth 8) | Out-File -FilePath $metaPath -Encoding utf8
}

function New-Seed {
  return Get-Random -Minimum 1 -Maximum 2147483646
}

if (-not $DryRun) {
  try {
    Invoke-RestMethod -Uri "$($BaseUrl.TrimEnd('/'))/sdapi/v1/options" -Method Get | Out-Null
  } catch {
    throw "Cannot reach SD API at $BaseUrl. Start AUTOMATIC1111 with --api and retry."
  }
}

# Enemy idle v2
$enemyPrompt = "$soloOne, $lead, $anchor, $core, $idlePose, BREAK, $styleSuffix"
$enemyPath = Join-Path $enemyOut "enemy_${slug}_idle_v2.png"
$enemySeed = New-Seed

if ($DryRun) {
  Write-Output "DRY-RUN enemy -> $enemyPath"
  Write-Output $enemyPrompt
} else {
  $resp = Invoke-Txt2Img -Prompt $enemyPrompt -Seed $enemySeed
  if (-not $resp.images -or $resp.images.Count -eq 0) {
    throw "No image generated for enemy idle."
  }
  $png = [Convert]::FromBase64String($resp.images[0])
  $modelName = if ($resp.info) {
    try { (ConvertFrom-Json $resp.info).sd_model_name } catch { "unknown" }
  } else { "unknown" }
  if (-not $modelName) { $modelName = "unknown" }
  $meta = New-Metadata -Prompt $enemyPrompt -NegativePrompt $negative -Seed $enemySeed -AssetType "enemy" -ModelName $modelName
  Save-PngAndMetadata -OutPath $enemyPath -PngBytes $png -Metadata $meta
  Write-Output "Saved $enemyPath"
}

# Pose batch v2
foreach ($entry in $poses.GetEnumerator()) {
  $poseId = $entry.Key
  $poseDesc = $entry.Value
  $prompt = "$soloOne, $lead, $anchor, $core, pose and action: $poseDesc, BREAK, $styleSuffix"
  $outPath = Join-Path $posesOut "enemy_${slug}_${poseId}_v2.png"
  $seed = New-Seed

  if ($DryRun) {
    Write-Output "DRY-RUN pose -> $outPath"
    Write-Output $prompt
    continue
  }

  $resp = Invoke-Txt2Img -Prompt $prompt -Seed $seed
  if (-not $resp.images -or $resp.images.Count -eq 0) {
    throw "No image generated for pose '$poseId'."
  }

  $png = [Convert]::FromBase64String($resp.images[0])
  $modelName = if ($resp.info) {
    try { (ConvertFrom-Json $resp.info).sd_model_name } catch { "unknown" }
  } else { "unknown" }
  if (-not $modelName) { $modelName = "unknown" }
  $meta = New-Metadata -Prompt $prompt -NegativePrompt $negative -Seed $seed -AssetType "enemy_pose" -ModelName $modelName -PoseId $poseId -PoseDesc $poseDesc
  Save-PngAndMetadata -OutPath $outPath -PngBytes $png -Metadata $meta
  Write-Output "Saved $outPath"
}

Write-Output "Gringo v2 batch complete."
