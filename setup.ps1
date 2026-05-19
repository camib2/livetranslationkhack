# MidContext Hackathon Setup Script
# This script downloads and sets up MidContext on a fresh machine

$ErrorActionPreference = "Stop"

Write-Host "================================" -ForegroundColor Cyan
Write-Host "MidContext Hackathon Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Get the directory where the script is running
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectDir = $scriptDir

Write-Host ""
Write-Host "Project directory: $projectDir" -ForegroundColor Cyan
Write-Host ""

# Check if project already exists
if (Test-Path "$projectDir\package.json") {
    Write-Host "Project already exists. Updating dependencies..." -ForegroundColor Yellow
    cd $projectDir
} else {
    Write-Host "Cloning MidContext repository..." -ForegroundColor Yellow
    # If we need to clone, this would be done first
    cd $projectDir
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ npm install failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Dependencies installed" -ForegroundColor Green

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting MidContext server..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Server will be available at: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Testing with 2 browsers:" -ForegroundColor Yellow
Write-Host "1. Open http://localhost:3000 in Browser 1" -ForegroundColor White
Write-Host "2. Open http://localhost:3000 in Browser 2" -ForegroundColor White
Write-Host "3. Browser 1: Select 'IT Support' → Enter Name → Click 'Start Session'" -ForegroundColor White
Write-Host "4. Browser 2: Select 'End User' → Enter Name → Click 'Start Session'" -ForegroundColor White
Write-Host ""
Write-Host "They should connect automatically!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the dev server
npm run dev
