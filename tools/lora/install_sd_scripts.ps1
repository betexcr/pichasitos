param(
    [string]$SdScriptsRoot = ""
)

$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
if ([string]::IsNullOrWhiteSpace($SdScriptsRoot)) {
    $SdScriptsRoot = Join-Path $RepoRoot "external\sd-scripts"
}

$venvPath = Join-Path $SdScriptsRoot "venv"
$pythonExe = Join-Path $venvPath "Scripts\python.exe"
$pipExe = Join-Path $venvPath "Scripts\pip.exe"

if (-not (Test-Path $SdScriptsRoot)) {
    throw "sd-scripts not found at '$SdScriptsRoot'. Run: git submodule update --init external/sd-scripts"
}

if (-not (Test-Path $pythonExe)) {
    python -m venv $venvPath
}

Push-Location $SdScriptsRoot
try {
    & $pythonExe -m pip install --upgrade pip

    # Match typical WebUI stack: CUDA 12.8 wheels with Python 3.13.
    & $pipExe install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu128

    # safetensors 0.4.5 does not provide a usable wheel for Python 3.13 on Windows here.
    & $pipExe install safetensors

    & $pipExe install `
        accelerate==1.6.0 `
        transformers==4.54.1 `
        diffusers[torch]==0.32.1 `
        ftfy==6.3.1 `
        opencv-python==4.10.0.84 `
        einops==0.7.0 `
        bitsandbytes `
        lion-pytorch==0.2.3 `
        schedulefree==1.4 `
        pytorch-optimizer==3.10.0 `
        prodigy-plus-schedule-free==1.9.2 `
        prodigyopt==1.1.2 `
        tensorboard `
        toml==0.10.2 `
        voluptuous==0.15.2 `
        huggingface-hub==0.34.3 `
        imagesize==1.4.1 `
        numpy `
        rich==14.1.0 `
        sentencepiece==0.2.1 `
        -e .

    & $pythonExe -c "from accelerate.commands.config.default import write_basic_config; write_basic_config(mixed_precision='fp16')"
}
finally {
    Pop-Location
}
