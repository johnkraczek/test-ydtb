#!/usr/bin/env bash
# Enhanced stop script with multiple port support
echo "Stopping development servers..."

# Kill processes on common ports
for port in 3000 3001 5173 5328; do
  if lsof -ti:$port > /dev/null 2>&1; then
    echo "Stopping process on port $port"
    lsof -ti:$port | xargs kill -9 2>/dev/null || true
  fi
done

echo "All development servers stopped"