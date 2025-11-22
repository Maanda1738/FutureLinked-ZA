#!/bin/bash
set -e

echo "Installing backend dependencies..."
cd backend
npm install
cd ..

echo "Copying functions to root netlify-functions directory..."
mkdir -p netlify-functions
cp -r backend/netlify/functions/* netlify-functions/
cp backend/package.json netlify-functions/
cp backend/package-lock.json netlify-functions/

echo "Copying backend routes and services for functions..."
cp -r backend/routes netlify-functions/
cp -r backend/services netlify-functions/

echo "Installing frontend dependencies..."
cd frontend
npm install

echo "Building frontend..."
npm run build
