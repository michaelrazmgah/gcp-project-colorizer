#!/bin/bash
# Package extension for Chrome Web Store submission

echo "Packaging GCP Project Colorizer extension..."

# Remove old zip if exists
rm -f gcp-project-colorizer.zip

# Create zip with only necessary files
zip -r gcp-project-colorizer.zip \
  manifest.json \
  popup.html \
  popup.js \
  content.js \
  icon16.png \
  icon48.png \
  icon128.png

echo "✅ Created: gcp-project-colorizer.zip"
echo "📦 Ready for Chrome Web Store upload!"
