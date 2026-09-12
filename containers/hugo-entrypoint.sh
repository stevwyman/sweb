#!/bin/sh
set -eu

cd /src
export PATH="/opt/dart-sass:/src/node_modules/.bin:${PATH}"

echo "Fetching Docsy theme and JS/CSS dependencies..."
hugo mod get github.com/google/docsy/theme@v0.17.0
hugo mod tidy
hugo mod npm pack
npm install

mkdir -p /out
echo "Building Hugo site into /out..."
hugo --destination /out --baseURL "${HUGO_BASEURL:-http://localhost:3000/}"

# Hugo rewrites assets/jsconfig.json on each build. On a polled bind mount that
# triggers an endless rebuild loop, so freeze the file after the first write.
if [ -f /src/assets/jsconfig.json ]; then
  chmod a-w /src/assets/jsconfig.json || true
fi

echo "Watching Hugo site and writing static files to /out..."
exec hugo --watch --poll 1s --destination /out --baseURL "${HUGO_BASEURL:-http://localhost:3000/}"
