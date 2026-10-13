@echo off
title SSJU Connect - Campus Social Portal
cd /d "%~dp0"
echo ========================================================
echo        Starting SSJU Connect Portal
echo   Soban Singh Jeena University Campus Social & PYQ Hub
echo ========================================================
echo.

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    python server.py
    pause
    goto end
)

where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    node server.js
    pause
    goto end
)

echo Opening directly in default browser...
start index.html

:end
