# Personal Website

A Jekyll-based personal website built with the Minimal Mistakes theme, featuring data-driven content management and modern styling.

**Live Site:** [g7xu.github.io](https://g7xu.github.io)

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
bundle install

# Start local server with live reload
bundle exec jekyll serve --incremental --livereload

# Visit http://localhost:4000
```

### Production Build
```bash
# Build for production
JEKYLL_ENV=production bundle exec jekyll build
```

## 📁 Project Structure

```
├── _data/                    # Data files for dynamic content
│   ├── navigation.yml       # Site navigation structure
│   └── projects.yml         # Projects and research data
├── _pages/                  # Main site pages
│   ├── index.md            # Homepage
│   ├── Project&Research.md # Projects and research showcase
│   ├── learning-wiki.md    # Educational resources
│   └── Beyond-Tech/        # Personal content
├── _sass/                   # Custom stylesheets
│   └── custom.scss         # Main custom styles
├── assets/                  # Static assets
│   ├── images/             # Site images
│   └── files/              # PDFs and documents
└── _posts/                  # Blog posts
```

## 🎨 Data-Driven Content Management

### Adding/Editing Projects
Projects are managed through `_data/projects.yml` for easy maintenance:

```yaml
featured_projects:
  - title: "Project Name"
    description: "Project description"
    image: "/assets/images/project-image.png"
    url: "https://project-url.com"
    tags: ["Data Science", "Visualization"]
    featured: true
    external: true
```

### Benefits
- **Easy Maintenance**: Add/remove projects by editing YAML files
- **Consistent Formatting**: All projects follow the same structure
- **Separation of Concerns**: Data separated from presentation
- **Scalable**: Easy to add new content types

### Content Types
- **Featured Projects**: Main portfolio projects
- **Research Projects**: Academic and research work
- **Learning Resources**: Educational content and courses

## 🛠️ Customization

### Styling
- **Custom SCSS**: Located in `_sass/custom.scss`
- **Color Variables**: Centralized color scheme
- **Responsive Design**: Mobile-first approach
- **Hover Effects**: Smooth animations and transitions

### Layouts
- **Single Page Layout**: Used for most content pages
- **Full Width Layout**: For project showcases
- **Custom Grids**: CSS Grid for project displays

## 📚 Resources

### Theme Documentation
- [Minimal Mistakes Theme](https://mmistakes.github.io/minimal-mistakes/)
- [Jekyll Documentation](https://jekyllrb.com/docs/)

### Development Resources
- **Navigation**: `_data/navigation.yml`
- **Styling**: `_sass/custom.scss`
- **Content**: `_data/projects.yml`
- **Pages**: `_pages/` directory

### Key Features
- **Live Reload**: Automatic browser refresh during development
- **Incremental Builds**: Faster build times
- **Data-Driven Content**: Easy content management
- **Responsive Design**: Works on all devices
- **SEO Optimized**: Meta tags and structured data

## 🔧 Configuration

### Main Settings (`_config.yml`)
- Site title, description, and author information
- Theme configuration and plugins
- Navigation and layout defaults
- SEO and analytics settings

### Dependencies (`Gemfile`)
- Jekyll and GitHub Pages gems
- Theme and plugin dependencies
- Development tools

## 📝 Content Guidelines

### Adding New Projects
1. Edit `_data/projects.yml`
2. Add project information in YAML format
3. Include image in `assets/images/`
4. Test locally with `bundle exec jekyll serve`

### Blog Posts
1. Create new file in `_posts/`
2. Use YAML front matter for metadata
3. Write content in Markdown
4. Include tags and categories

### Styling Changes
1. Edit `_sass/custom.scss`
2. Use SCSS variables for consistency
3. Test on different screen sizes
4. Ensure accessibility standards

## 🚀 Deployment

### GitHub Pages
- Automatic deployment from `main` branch
- Custom domain support
- SSL certificate included

### Local Testing
```bash
# Test production build
JEKYLL_ENV=production bundle exec jekyll build

# Check built files
ls -la _site/
```

## 📞 Support

For questions or issues:
- Check the [Jekyll documentation](https://jekyllrb.com/docs/)
- Review [Minimal Mistakes theme docs](https://mmistakes.github.io/minimal-mistakes/docs/)
- Open an issue on GitHub

---

*Built with ❤️ using Jekyll and Minimal Mistakes theme*