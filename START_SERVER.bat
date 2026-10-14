@echo off
echo ========================================
echo   IT Management Dashboard Server
echo ========================================
echo.

REM Check if port 3000 is in use
netstat -ano | findstr :3000 | findstr LISTENING >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 3000 is already in use!
    echo.
    echo Options:
    echo 1. Stop the existing server and start fresh
    echo 2. Use a different port (server will try 3001)
    echo.
    choice /C 12 /M "Choose option"
    
    if errorlevel 2 (
        echo Starting on next available port...
        goto install
    )
    if errorlevel 1 (
        echo Stopping existing server...
        for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do (
            taskkill /F /PID %%a >nul 2>&1
        )
        timeout /t 2 /nobreak >nul
        echo ✅ Server stopped
        echo.
    )
)

:install
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ❌ Failed to install dependencies!
    echo Make sure Node.js is installed.
    pause
    exit /b 1
)

echo.
echo Starting server...
echo.
call npm start

pause
