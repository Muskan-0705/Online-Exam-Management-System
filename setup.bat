@echo off
REM Online Examination Management System - Setup Script for Windows

echo 🚀 Starting Online Examination Management System Setup...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    exit /b 1
)

echo ✅ Node.js version: 
node --version
echo.

echo 📦 Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ❌ Backend installation failed
    exit /b 1
)

echo.
echo 📦 Installing frontend dependencies...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo ❌ Frontend installation failed
    exit /b 1
)

cd ..

echo.
echo ✅ Installation complete!
echo.
echo 📝 Next Steps:
echo 1. Ensure MongoDB is running on your system
echo 2. Update .env files in backend and frontend directories
echo 3. Run: npm run setup-db
echo.
echo 🎯 To start the development servers:
echo    Terminal 1: cd backend ^&^& npm start
echo    Terminal 2: cd frontend ^&^& npm run dev
echo.
echo 🌐 Access the application at http://localhost:5173
pause
