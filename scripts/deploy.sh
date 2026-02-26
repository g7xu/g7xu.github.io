#!/bin/bash
set -e

echo "Starting website deployment process..."
echo ""

# Step 1: Clean previous build
echo "Cleaning previous build..."
npm run clean 2>/dev/null || true

# Step 2: Production build
echo "Building for production..."
npm run build

if [ $? -eq 0 ]; then
    echo "Build successful!"
    echo ""
    echo "Build statistics:"
    echo "   - Pages built: $(find dist -name "*.html" | wc -l)"
    echo "   - CSS files: $(find dist -name "*.css" | wc -l)"
    echo "   - JS files: $(find dist -name "*.js" | wc -l)"
    echo "   - Images: $(find dist -name "*.jpg" -o -name "*.png" | wc -l)"
    echo ""
    echo "Site is ready! Output in ./dist"
    echo ""
    echo "Next steps:"
    echo "   1. Preview locally: npm run preview"
    echo "   2. Commit and push to master to trigger GitHub Actions deploy"
    echo ""
    echo "Your site will be available at: https://g7xu.github.io"
else
    echo "Build failed! Please check the error messages above."
    exit 1
fi
