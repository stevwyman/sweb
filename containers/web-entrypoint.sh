#!/bin/sh
set -eu

cd /app

echo "Installing Auth.js / Next.js dependencies..."
npm install

echo "Waiting for Hugo to publish static files..."
i=0
while [ ! -f /static-site/index.html ]; do
  i=$((i + 1))
  if [ "$i" -gt 120 ]; then
    echo "Timed out waiting for Hugo output in /static-site"
    exit 1
  fi
  sleep 2
done

echo "Starting Auth.js gate on port 3000..."
exec npm run dev -- --hostname 0.0.0.0 --port 3000
