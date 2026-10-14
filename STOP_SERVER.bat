@echo off
echo ========================================
echo   Stopping IT Management Server
echo ========================================
echo.
echo Finding and stopping Node.js processes...
echo.

REM Kill all node processes running on port 3000
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do (
    echo Stopping process on port 3000 (PID: %%a)
    taskkill /F /PID %%a
)

echo.
echo ✅ Server stopped successfully!
echo.
pause
