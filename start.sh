#!/bin/bash

set -e

echo "Pulling latest changes from git..."
git pull origin master

echo "Building and starting Docker containers..."
docker compose up -d --build

echo "Done! App is running in Docker."
