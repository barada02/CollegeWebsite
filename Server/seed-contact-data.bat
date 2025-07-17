@echo off
echo ========================================
echo     Contact Data Seeding Script
echo ========================================
echo.
echo This script will insert 25+ contact records with Indian names
echo into your MongoDB database for testing the filter options.
echo.
echo Make sure your MongoDB server is running before proceeding.
echo.
pause

cd /d "%~dp0"
echo Running the seeding script...
echo.

node scripts/seedContactData.js

echo.
echo ========================================
echo           Script Complete!
echo ========================================
echo.
pause
