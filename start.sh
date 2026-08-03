#!/bin/bash
echo "========================================="
echo "      Starting Teleprompter Server..."
echo "========================================="
echo ""
echo "Please leave this window open while using the Teleprompter."
echo "Opening browser..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "Error: Python is not installed or not in your PATH!"
    echo "Please install Python 3 from the official website."
    echo "Opening download page..."
    if which xdg-open > /dev/null; then
        xdg-open https://www.python.org/downloads/
    elif which open > /dev/null; then
        open https://www.python.org/downloads/
    fi
    exit 1
fi

# Try to open the browser based on OS
if which xdg-open > /dev/null
then
  xdg-open https://localhost:8090
elif which open > /dev/null
then
  open https://localhost:8090
fi

# Run the python server
python3 serve-https.py || python serve-https.py
