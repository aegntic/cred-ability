#!/bin/bash

# Build and deploy the improved CRED-ABILITY website
set -e

echo "Building the improved CRED-ABILITY website..."

# Backup current files
echo "Backing up current index.html, vite.config.ts, and tailwind.config.js..."
mv index.html index.html.bak
mv vite.config.ts vite.config.ts.bak
mv tailwind.config.js tailwind.config.js.bak

# Move improved files into place
echo "Moving improved files into place..."
cp improved-index.html index.html
cp improved-vite.config.ts vite.config.ts
cp improved-tailwind.config.js tailwind.config.js

# Update the main entry point temporarily for the build
echo "Updating main entry point for the build..."
sed -i "s/import App from '..\/App'/import App from '..\/improved-app'/" src/main.tsx
sed -i "s/import '..\/index.css'/import '..\/improved-index.css'/" src/main.tsx

# Install any needed dependencies
echo "Installing dependencies..."
npm install

# Build the website
echo "Building the website..."
npm run build

# Restore the original files
echo "Restoring original files..."
mv index.html.bak index.html
mv vite.config.ts.bak vite.config.ts
mv tailwind.config.js.bak tailwind.config.js

# Reset the main entry point changes
echo "Resetting the main entry point changes..."
sed -i "s/import App from '..\/improved-app'/import App from '..\/App'/" src/main.tsx
sed -i "s/import '..\/improved-index.css'/import '..\/index.css'/" src/main.tsx

# Deploy the website
echo "Deploying the website..."
npm run deploy

echo "The improved CRED-ABILITY website has been built and deployed successfully!"
echo "Visit your GitHub pages URL to see the deployed site."