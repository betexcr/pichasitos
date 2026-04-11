@echo off
REM Copy or merge COMMANDLINE_ARGS into external/stable-diffusion-webui/webui-user.bat
REM This example launches from the submodule with API enabled for tools/sd_export.py
cd /d "%~dp0stable-diffusion-webui"
set COMMANDLINE_ARGS=--api --no-half
call webui.bat
