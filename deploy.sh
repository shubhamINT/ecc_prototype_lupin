#!/bin/bash

set -e
echo "🚀 Starting deployment..."

echo "Pulling latest changes from git..."
git pull origin master

echo "Building and starting Docker containers..."
docker compose up -d --build

echo "🧹 Cleaning up..."
docker system prune -a -f

echo "✅ Deployment successful!"
