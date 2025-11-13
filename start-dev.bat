@echo off
REM Development startup script for OTT Platform (Windows)
REM This script starts MongoDB and the Next.js development server

echo 🚀 Starting OTT Platform Development Environment...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker first.
    exit /b 1
)

REM Start MongoDB
echo 📦 Starting MongoDB...
docker-compose up -d mongodb

REM Wait for MongoDB to be ready
echo ⏳ Waiting for MongoDB to be ready...
timeout /t 5 /nobreak >nul

REM Check if MongoDB is running
docker-compose ps | findstr "Up" >nul
if %errorlevel% equ 0 (
    echo ✅ MongoDB is running successfully
) else (
    echo ❌ Failed to start MongoDB. Check docker-compose logs for details.
    exit /b 1
)

REM Start the Next.js development server
echo 🔧 Starting Next.js development server...
echo 📱 The application will be available at http://localhost:3000
echo 🔗 MongoDB is running on localhost:27017
echo.
echo 🛑 To stop the development environment:
echo    - Press Ctrl+C to stop the Next.js server
echo    - Run 'docker-compose down' to stop MongoDB
echo.

REM Start the development server
npm run dev