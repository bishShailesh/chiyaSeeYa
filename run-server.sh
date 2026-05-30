#!/bin/bash

# Script to rebuild and run the static file server
# For the chiya-see-ya project

PORT=${1:-8000}
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "========================================="
echo "  Chiya See Ya - Server Script"
echo "========================================="
echo ""

# Kill any existing process on the port
echo "Checking for existing processes on port $PORT..."
PID=$(lsof -ti:$PORT 2>/dev/null)
if [ ! -z "$PID" ]; then
    echo "Found existing process (PID: $PID). Killing..."
    kill -9 $PID 2>/dev/null
    sleep 1
    echo "Process killed."
else
    echo "No existing process found on port $PORT."
fi

echo ""
echo "Starting HTTP server..."
echo "Serving files from: $PROJECT_DIR"
echo "Server URL: http://localhost:$PORT"
echo ""
echo "Press Ctrl+C to stop the server."
echo "========================================="
echo ""

# Change to project directory and start server
cd "$PROJECT_DIR"

# Try Python 3 first, then Python 2, then Node.js
if command -v python3 &> /dev/null; then
    echo "Using Python 3 HTTP server..."
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    echo "Using Python HTTP server..."
    python -m SimpleHTTPServer $PORT
elif command -v npx &> /dev/null; then
    echo "Using Node.js HTTP server..."
    npx serve -l $PORT .
else
    echo "ERROR: No suitable server tool found."
    echo "Please install Python 3 or Node.js."
    exit 1
fi