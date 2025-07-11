@echo off
echo.
echo ========================================
echo   Academic Data Seeding Script
echo   Excellence University Database
echo ========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Navigate to server directory
cd /d "%~dp0.."
echo Current directory: %cd%
echo.

:: Check if .env file exists
if not exist ".env" (
    echo Warning: .env file not found!
    echo Creating a sample .env file...
    echo.
    (
        echo # Database Configuration
        echo MONGODB_URI=mongodb://localhost:27017/excellenceuniversity
        echo PORT=5000
        echo.
        echo # JWT Configuration
        echo JWT_SECRET=your-super-secret-jwt-key-here
        echo JWT_EXPIRE=7d
        echo.
        echo # Admin Configuration
        echo ADMIN_EMAIL=admin@excellenceuniversity.edu
        echo ADMIN_PASSWORD=admin123
    ) > .env
    echo Sample .env file created. Please update MongoDB URI if needed.
    echo.
)

:: Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

:: Compile TypeScript
echo Compiling TypeScript...
npm run build
if %errorlevel% neq 0 (
    echo Error: TypeScript compilation failed
    pause
    exit /b 1
)

:: Run the seeding script
echo.
echo Starting database seeding...
echo ========================================
node dist/scripts/seedAcademicData.js

:: Check if seeding was successful
if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo ✅ Database seeding completed successfully!
    echo.
    echo You can now:
    echo 1. Start the server with: npm run dev
    echo 2. Test APIs using the documentation
    echo 3. Access the academic data via endpoints
    echo ========================================
) else (
    echo.
    echo ========================================
    echo ❌ Database seeding failed!
    echo Please check the error messages above.
    echo ========================================
)

echo.
pause
