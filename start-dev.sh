#!/bin/bash

# Development startup script for OTT Platform
# This script starts MongoDB and the Next.js development server

echo "🚀 Starting OTT Platform Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start MongoDB
echo "📦 Starting MongoDB..."
docker-compose up -d mongodb

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to be ready..."
sleep 5

# Check if MongoDB is running
if docker-compose ps | grep -q "Up"; then
    echo "✅ MongoDB is running successfully"
else
    echo "❌ Failed to start MongoDB. Check docker-compose logs for details."
    exit 1
fi

# Start the Next.js development server
echo "🔧 Starting Next.js development server..."
echo "📱 The application will be available at http://localhost:3000"
echo "🔗 MongoDB is running on localhost:27017"
echo ""
echo "🛑 To stop the development environment:"
echo "   - Press Ctrl+C to stop the Next.js server"
echo "   - Run 'docker-compose down' to stop MongoDB"
echo ""

# Start the development server
npm run dev