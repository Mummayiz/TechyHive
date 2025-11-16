@echo off
echo ========================================
echo Starting TechyHive Servers
echo ========================================
echo.

REM Kill any existing processes on these ports
echo Cleaning up existing processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul

echo.
echo Starting Backend Server on port 8000...
start "TechyHive Backend" /D "C:\Users\Lenovo\Desktop\TechyHive\backend" C:\Users\Lenovo\Desktop\TechyHive\.venv\Scripts\python.exe -B -m uvicorn server:app --host 127.0.0.1 --port 8000 --reload

timeout /t 3 /nobreak >nul

echo Starting Frontend Server on port 3000...
start "TechyHive Frontend" /D "C:\Users\Lenovo\Desktop\TechyHive\frontend" cmd /k "npm start"

echo.
echo ========================================
echo Servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to stop all servers...
pause >nul

echo.
echo Stopping servers...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul
echo Done!
