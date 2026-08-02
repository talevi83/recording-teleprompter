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

:: Run the python server
python serve-https.py

pause
