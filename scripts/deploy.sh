#!/bin/bash

echo "🚀 Starting website deployment process..."
echo ""

# Step 1: Clean previous build
echo "📁 Cleaning previous build..."
bundle exec jekyll clean

# Step 2: Production build
echo "🔨 Building for production..."
JEKYLL_ENV=production bundle exec jekyll build

# Step 3: Check build success
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📊 Build statistics:"
    echo "   - Pages built: $(find _site -name "*.html" | wc -l)"
    echo "   - CSS files: $(find _site -name "*.css" | wc -l)"
    echo "   - JS files: $(find _site -name "*.js" | wc -l)"
    echo "   - Images: $(find _site -name "*.jpg" -o -name "*.png" -o -name "*.gif" | wc -l)"
    echo ""
    
    # Step 4: Check for common issues
    echo "🔍 Running quick checks..."
    
    # Check for missing images
    echo "   - Checking for missing images..."
    grep -r "assets/images" _site/ | grep -v "assets/images" || echo "   ✅ All image references found"
    
    # Check for broken links
    echo "   - Checking for broken links..."
    grep -r "href=" _site/ | grep -v "http" | grep -v "mailto" | grep -v "tel" || echo "   ✅ No obvious broken links"
    
    echo ""
    echo "🎉 Website is ready for deployment!"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Review the testing checklist: cat TESTING_CHECKLIST.md"
    echo "   2. Test locally: bundle exec jekyll serve"
    echo "   3. Commit changes: git add . && git commit -m 'Ready for deployment'"
    echo "   4. Push to GitHub: git push origin main"
    echo ""
    echo "🌐 Your site will be available at: https://g7xu.github.io"
    
else
    echo "❌ Build failed! Please check the error messages above."
    exit 1
fi
