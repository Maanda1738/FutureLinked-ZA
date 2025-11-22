#!/bin/bash
set -e

echo "Installing backend dependencies..."
cd backend
npm install
cd ..

echo "Building frontend..."
cd frontend
npm run build
