# Website Testing Checklist

## 🚀 Pre-Deployment Testing Guide

### **1. Basic Functionality**
- [ ] **Homepage loads correctly** - `http://localhost:4000/`
- [ ] **Navigation works** - All menu items link to correct pages
- [ ] **All pages accessible** - No 404 errors
- [ ] **Images display properly** - All project images and bio photo
- [ ] **Links work correctly** - External links open in new tabs

### **2. Interactive Features**
- [ ] **News toggle works** - Click "Recent News 📢" to show/hide
- [ ] **Project hover effects** - Cards lift up smoothly on hover
- [ ] **Smooth scrolling** - Anchor links scroll smoothly
- [ ] **Loading animations** - Project cards fade in when scrolling
- [ ] **JavaScript console** - No errors in browser console (F12)

### **3. Responsive Design**
- [ ] **Mobile view** - Test on mobile device or browser dev tools
- [ ] **Tablet view** - Test medium screen sizes
- [ ] **Desktop view** - Test large screen sizes
- [ ] **Navigation responsive** - Menu works on all screen sizes
- [ ] **Text readable** - Font sizes appropriate for all devices

### **4. Content Verification**
- [ ] **Project data** - All projects display from `_data/projects.yml`
- [ ] **Research section** - Research projects show correctly
- [ ] **Learning Wiki** - Course content accessible
- [ ] **Beyond Tech** - Personal content sections work
- [ ] **About section** - Bio and information accurate

### **5. Performance Testing**
- [ ] **Page load speed** - Pages load quickly
- [ ] **Image optimization** - Images load without delay
- [ ] **CSS compression** - Styles load efficiently
- [ ] **JavaScript loading** - No blocking scripts
- [ ] **Resource preloading** - Critical resources load first

### **6. SEO & Meta Tags**
- [ ] **Page titles** - Each page has unique, descriptive title
- [ ] **Meta descriptions** - Pages have proper descriptions
- [ ] **Open Graph tags** - Social media sharing works
- [ ] **Structured data** - JSON-LD schema present in page source
- [ ] **Canonical URLs** - No duplicate content issues

### **7. Browser Compatibility**
- [ ] **Chrome** - Test in Chrome browser
- [ ] **Safari** - Test in Safari browser
- [ ] **Firefox** - Test in Firefox browser
- [ ] **Edge** - Test in Edge browser (if available)
- [ ] **Mobile browsers** - Test on mobile Safari/Chrome

### **8. File Structure**
- [ ] **All files present** - No missing assets
- [ ] **Correct paths** - All links point to existing files
- [ ] **Data files** - `_data/projects.yml` contains all projects
- [ ] **Include files** - All includes load properly
- [ ] **Configuration** - `_config.yml` has all necessary settings

## 🐛 Common Issues & Solutions

### **JavaScript Not Working**
- Check browser console for errors
- Verify `_includes/scripts.html` is included
- Ensure `assets/js/custom.js` exists and is built

### **Styles Not Loading**
- Check `_sass/custom.scss` for syntax errors
- Verify SASS compilation is working
- Clear browser cache (Cmd+Shift+R)

### **Images Not Displaying**
- Check file paths in `_data/projects.yml`
- Verify images exist in `assets/images/`
- Check for typos in image filenames

### **Build Errors**
- Run `bundle exec jekyll clean`
- Check `_config.yml` for syntax errors
- Verify all required gems are installed

## ✅ Ready for Deployment Checklist

- [ ] All tests pass
- [ ] No console errors
- [ ] All links work
- [ ] Images display correctly
- [ ] Responsive design works
- [ ] Performance is acceptable
- [ ] SEO meta tags present
- [ ] Content is up-to-date

## 🚀 Deployment Commands

```bash
# Final production build
JEKYLL_ENV=production bundle exec jekyll build

# Check built files
ls -la _site/

# Commit changes
git add .
git commit -m "Final website optimization and testing"

# Push to GitHub
git push origin main
```

## 📞 Support

If you encounter issues:
1. Check this testing checklist
2. Review browser console for errors
3. Verify file paths and configurations
4. Test on different browsers/devices
5. Check Jekyll build output for errors
