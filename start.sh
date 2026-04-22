#!/bin/bash

set -e

echo "Pulling latest changes from git..."
git pull

echo "Building and starting Docker containers..."
docker compose up -d --build

echo "Done! App is running in Docker (accessible on port 3000)."
