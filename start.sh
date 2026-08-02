#!/bin/bash
echo "========================================="
echo "      Starting Teleprompter Server..."
echo "========================================="
echo ""
echo "Please leave this window open while using the Teleprompter."
echo "Opening browser..."
echo ""

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
