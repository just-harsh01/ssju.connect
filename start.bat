@echo off
title SSJU Connect - Campus Social & PYQ Vault
cd /d "%~dp0"
echo ========================================================
echo        Starting SSJU Connect Full-Stack Portal
echo   Soban Singh Jeena University Campus Social & PYQ Hub
echo ========================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    node server.js
    pause
    goto end
)

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    python server.py
    pause
    goto end
)

echo Node.js is required. Install it from https://nodejs.org/ and run start.bat again.
pause

:end
