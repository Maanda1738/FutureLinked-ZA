@echo off
REM FutureLinked ZA Development Setup Script for Windows

echo 🚀 Setting up FutureLinked ZA development environment...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo ✅ Node.js detected

REM Install root dependencies
echo 📦 Installing root dependencies...
npm install

REM Setup backend
echo 🔧 Setting up backend...
cd backend
npm install

REM Copy environment file
if not exist .env (
    copy .env.example .env
    echo 📝 Created backend\.env file. Please edit with your API keys if needed.
)

cd ..

REM Setup frontend
echo 🎨 Setting up frontend...
cd frontend
npm install

REM Create frontend env file
if not exist .env.local (
    echo NEXT_PUBLIC_API_URL=http://localhost:3001> .env.local
    echo NEXT_PUBLIC_GOOGLE_ADSENSE_ID=>> .env.local
    echo 📝 Created frontend\.env.local file.
)

cd ..

echo.
echo 🎉 Setup complete!
echo.
echo To start the development servers:
echo   npm run dev
echo.
echo Or start them separately:
echo   Backend:  cd backend ^&^& npm run dev
echo   Frontend: cd frontend ^&^& npm run dev
echo.
echo The application will be available at:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:3001
echo.
echo 💡 Tip: The app works with demo data even without API keys!
echo.