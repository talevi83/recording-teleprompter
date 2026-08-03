@echo off
title Teleprompter Server
echo =========================================
echo       Starting Teleprompter Server...
echo =========================================
echo.
echo Please leave this window open while using the Teleprompter.
echo Opening browser...
echo.

:: Start the browser and open the URL
start https://localhost:8090

:: Check if Python is installed
python --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Python is not installed or not in your PATH!
    echo Please install Python 3 from the official website.
    echo Opening download page...
    start https://www.python.org/downloads/
    pause
    exit /b
)

:: Run the python server
python serve-https.py

pause
