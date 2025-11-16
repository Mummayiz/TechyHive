@echo off
echo Cleaning Python cache...
cd /d C:\Users\Lenovo\Desktop\TechyHive\backend
if exist __pycache__ rmdir /s /q __pycache__
del /f /q *.pyc 2>nul

echo Starting backend server...
C:\Users\Lenovo\Desktop\TechyHive\.venv\Scripts\python.exe -m uvicorn server:app --reload --host 127.0.0.1 --port 8000
