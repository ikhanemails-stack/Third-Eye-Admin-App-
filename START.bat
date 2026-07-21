@echo off
title Third Eye Computer Solutions - Admin Panel
color 0B
cls
echo ========================================================
echo   THIRD EYE COMPUTER SOLUTIONS
echo   Admin Panel - Starting...
echo ========================================================
echo.

cd /d "%~dp0"

where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js is NOT installed.
    echo  1. Go to https://nodejs.org
    echo  2. Download LTS version
    echo  3. Install and restart computer
    echo  4. Run START.bat again
    pause
    exit /b 1
)
echo [OK] Node.js found.
echo.

if not exist "node_modules\express" (
    echo Installing packages - please wait...
    call npm install
    if %errorlevel% neq 0 (
        color 0C
        echo [ERROR] Could not install packages.
        pause
        exit /b 1
    )
    echo [OK] Packages installed.
    echo.
) else (
    echo [OK] Packages already installed.
    echo.
)

if not exist "data" mkdir data

start "" /b cmd /c "timeout /t 3 >nul && start http://localhost:5190"

echo ========================================================
echo   Admin Panel is RUNNING
echo.
echo   Open Chrome and go to:
echo   http://localhost:5190
echo.
echo   Login: admin / admin123
echo.
echo   IMPORTANT: Do NOT close this window!
echo ========================================================
echo.

node server\index.js

echo.
color 0C
echo ========================================================
echo  The server stopped. See the error above.
echo ========================================================
pause
