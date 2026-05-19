@echo off
REM MidContext Hackathon Setup - Windows Batch File
REM Simply double-click this file to set up and run

setlocal enabledelayedexpansion

echo.
echo ================================
echo MidContext Hackathon Setup
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo Found Node.js %NODE_VERSION%
echo.

REM Navigate to script directory
cd /d "%~dp0"

REM Install dependencies
echo Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo ================================
echo Setup Complete!
echo ================================
echo.
echo Starting MidContext server...
echo.
echo Server will be available at: http://localhost:3000
echo.
echo Testing with 2 browsers:
echo 1. Open http://localhost:3000 in Browser 1
echo 2. Open http://localhost:3000 in Browser 2
echo 3. Browser 1: Select 'IT Support' ^> Enter Name ^> Click 'Start Session'
echo 4. Browser 2: Select 'End User' ^> Enter Name ^> Click 'Start Session'
echo.
echo They should connect automatically!
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the dev server
npm run dev

pause
