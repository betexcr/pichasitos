param(
    [string]$SdScriptsRoot = "",
    [string]$Checkpoint = "",
    [string]$DatasetConfig = "",
    [string]$OutputDir = "",
    [string]$LoggingDir = "",
    [string]$OutputName = "punchout_style",
    [int]$MaxTrainSteps = 1000,
    [int]$SaveEveryNEpochs = 1,
    [int]$NetworkDim = 16,
    [int]$NetworkAlpha = 16,
    [string]$OptimizerType = "AdamW",
    [string]$MixedPrecision = "no",
    [double]$LearningRate = 0.00005,
    [double]$UnetLearningRate = 0.00005,
    [double]$TextEncoderLearningRate = 0.00001,
    [switch]$SmokeTest
)

$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
if ([string]::IsNullOrWhiteSpace($SdScriptsRoot)) {
    $SdScriptsRoot = Join-Path $RepoRoot "external\sd-scripts"
}
if ([string]::IsNullOrWhiteSpace($Checkpoint)) {
    $Checkpoint = Join-Path $RepoRoot "external\stable-diffusion-webui\models\Stable-diffusion\westernAnimation_v1.safetensors"
}
if ([string]::IsNullOrWhiteSpace($DatasetConfig)) {
    $DatasetConfig = Join-Path $PSScriptRoot "sd_scripts_dataset.toml"
}
if ([string]::IsNullOrWhiteSpace($OutputDir)) {
    $OutputDir = Join-Path $RepoRoot "tools\lora\output"
}
if ([string]::IsNullOrWhiteSpace($LoggingDir)) {
    $LoggingDir = Join-Path $RepoRoot "tools\lora\logs"
}

$env:PYTHONUTF8 = "1"
$env:PYTHONIOENCODING = "utf-8"
[Console]::InputEncoding = [System.Text.UTF8Encoding]::new()
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()

$pythonExe = Join-Path $SdScriptsRoot "venv\Scripts\python.exe"
$trainScript = Join-Path $SdScriptsRoot "train_network.py"
$accelerateConfig = Join-Path $env:USERPROFILE ".cache\huggingface\accelerate\default_config.yaml"

if (-not (Test-Path $pythonExe)) {
    throw "Trainer venv not found. Run tools/lora/install_sd_scripts.ps1 first (uses external/sd-scripts)."
}

if (-not (Test-Path $trainScript)) {
    throw "train_network.py not found under '$SdScriptsRoot'. Run git submodule update --init external/sd-scripts"
}

if (-not (Test-Path $Checkpoint)) {
    throw "Checkpoint not found: '$Checkpoint'. Place westernAnimation_v1.safetensors under external/stable-diffusion-webui/models/Stable-diffusion/ (see external/README.md)."
}

if (-not (Test-Path $DatasetConfig)) {
    throw "Dataset config not found: '$DatasetConfig'."
}

$datasetContent = Get-Content -LiteralPath $DatasetConfig -Raw -Encoding UTF8
if ($datasetContent -match "__REPO_ROOT__") {
    $expandedPath = Join-Path $env:TEMP "pichasitos_sd_dataset_expanded_$PID.toml"
    $rootForward = $RepoRoot.Replace("\", "/")
    $expanded = $datasetContent -replace "__REPO_ROOT__", $rootForward
    [System.IO.File]::WriteAllText($expandedPath, $expanded, [System.Text.UTF8Encoding]::new($false))
    $DatasetConfig = $expandedPath
}

if (-not (Test-Path $accelerateConfig)) {
    & $pythonExe -c "from accelerate.commands.config.default import write_basic_config; write_basic_config(mixed_precision='fp16')"
}

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
New-Item -ItemType Directory -Force -Path $LoggingDir | Out-Null

if ($SmokeTest) {
    $MaxTrainSteps = 1
    $OutputName = "${OutputName}_smoke_test"
}

$launchArgs = @(
    "-m", "accelerate.commands.launch",
    "--num_cpu_threads_per_process", "1",
    $trainScript,
    "--pretrained_model_name_or_path=$Checkpoint",
    "--dataset_config=$DatasetConfig",
    "--output_dir=$OutputDir",
    "--output_name=$OutputName",
    "--logging_dir=$LoggingDir",
    "--save_model_as=safetensors",
    "--save_precision=fp16",
    "--network_module=networks.lora",
    "--network_dim=$NetworkDim",
    "--network_alpha=$NetworkAlpha",
    "--learning_rate=$LearningRate",
    "--unet_lr=$UnetLearningRate",
    "--text_encoder_lr=$TextEncoderLearningRate",
    "--optimizer_type=$OptimizerType",
    "--lr_scheduler=cosine",
    "--lr_warmup_steps=100",
    "--max_train_steps=$MaxTrainSteps",
    "--save_every_n_epochs=$SaveEveryNEpochs",
    "--train_batch_size=1",
    "--mixed_precision=$MixedPrecision",
    "--gradient_checkpointing",
    "--cache_latents",
    "--max_data_loader_n_workers=0",
    "--clip_skip=2",
    "--max_grad_norm=1.0",
    "--no_half_vae",
    "--sdpa",
    "--seed=42"
)

Push-Location $SdScriptsRoot
try {
    & $pythonExe @launchArgs
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
}
finally {
    Pop-Location
}
