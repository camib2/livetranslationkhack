@echo off
REM MidContext - Real-Time Multilingual Support Chat
REM Complete Setup Script

echo.
echo ==================================
echo MidContext Setup and Launch
echo ==================================
echo.

REM Check Node.js
echo Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js not found. Please install from https://nodejs.org/
    exit /b 1
)
echo Node.js found

REM Check npm
echo Checking npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo npm not found
    exit /b 1
)
echo npm found

REM Navigate to project
echo.
echo Setting up project...
cd /d "%~dp0"

REM Install dependencies
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo npm install failed
    exit /b 1
)
echo Dependencies installed

REM Build TypeScript
echo.
echo Building TypeScript...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed
    exit /b 1
)
echo Build complete

REM Check .env
if not exist ".env" (
    echo Creating .env file...
    (
        echo PORT=3000
        echo HOST=0.0.0.0
        echo LOG_LEVEL=info
        echo.
        echo # Speechmatics Configuration
        echo SPEECHMATICS_API_KEY=RqaSOPvfLqsFLE39P395PU9xOJPEZNDf
        echo SPEECHMATICS_BATCH_URL=https://asr.api.speechmatics.com/v2
        echo SPEECHMATICS_RT_URL=wss://rt.speechmatics.com/v2
        echo SPEECHMATICS_TTS_URL=https://tts.api.speechmatics.com/v2
    ) > .env
    echo .env created
)

echo.
echo ==================================
echo Setup Complete!
echo ==================================
echo.
echo Starting MidContext...
echo Server: http://localhost:3000
echo.
echo Press Ctrl+C to stop
echo.

REM Open browser
start http://localhost:3000

REM Start dev server
call npm run dev
