# Personal Website Configuration Guide

## Overview
This personal website features a dynamic theming system and configurable layout. You can easily customize the appearance, layout, and functionality by modifying the `public/data/settings.json` file.

## Recent Updates & Fixes

### Fixed Issues
1. **Navigation Bar Initial Tracking**: Fixed navigation bar not correctly tracking the first section on initial page load
2. **Theme Color Consistency**: Fixed all hardcoded colors across all sections to properly respond to theme changes
3. **Blog Post Theme Support**: Fixed blog post pages not applying theme colors correctly
4. **Added Monochrome Theme**: New black and white theme with pure black shooting stars

### Enhanced Features
- **Dynamic Theme System**: All colors now use CSS variables for seamless theme switching
- **Improved Navigation**: Better scroll-based section detection with proper initial state
- **Theme-Specific Animations**: Special black shooting star effects for monochrome theme
- **Comprehensive Color Support**: All components now properly inherit theme colors

## Configuration File Structure

### Theme System
```json
{
  "theme": {
    "current": "dark",           // Currently active theme
    "themes": {
      "dark": {
        "name": "Dark Theme",    // Display name
        "colors": {
          "primary": "#87ceeb",      // Primary color (links, buttons)
          "accent": "#5fb3d4",       // Accent color (hover effects)
          "background": "#1a1a1a",   // Background color
          "surface": "#2a2a2a",      // Card/surface color
          "text": {
            "primary": "#ffffff",    // Primary text color
            "secondary": "#cccccc",  // Secondary text color
            "muted": "#999999"       // Muted text color
          },
          "border": "#404040"        // Border color
        }
      }
    }
  }
}
```

### Available Built-in Themes
- **`dark`** - Dark theme (default) - Deep background with sky blue accents
- **`light`** - Light theme - Clean white background with blue accents  
- **`monochrome`** - Monochrome theme - Pure black and white with black shooting stars
- **`ocean`** - Ocean theme - Deep blue color scheme
- **`sunset`** - Sunset theme - Warm orange/red color scheme

### Section Configuration
```json
{
  "sections": [
    {
      "id": "projects",           // Unique identifier
      "name": "Projects",         // Display name
      "enabled": true,            // Whether to show this section
      "order": 1,                 // Display order (lower numbers first)
      "component": "ProjectsSection"  // Component name
    }
  ]
}
```

### Available Components
- **`ProjectsSection`** - Project showcase with cards and links
- **`PublicationsSection`** - Academic publications and articles
- **`AnimeSection`** - Anime collection with polaroid-style cards
- **`BlogSection`** - Blog posts in timeline format
- **`ContactSection`** - Contact information and links

### Layout Settings
```json
{
  "layout": {
    "sidebar": {
      "defaultWidth": 580,    // Default sidebar width
      "minWidth": 300,        // Minimum width
      "maxWidth": 800,        // Maximum width
      "collapsedWidth": 50    // Width when collapsed
    },
    "animations": {
      "enabled": true,              // Enable animations
      "shootingStars": true,        // Show shooting star animation
      "initialLoadAnimation": true  // Show initial load animation
    }
  }
}
```

## Usage Examples

### 1. Switch to Light Theme
```json
{
  "theme": {
    "current": "light"
  }
}
```

### 2. Try the New Monochrome Theme
```json
{
  "theme": {
    "current": "monochrome"
  }
}
```

### 3. Create Custom Theme
```json
{
  "theme": {
    "current": "custom",
    "themes": {
      "custom": {
        "name": "My Custom Theme",
        "colors": {
          "primary": "#ff6b6b",
          "accent": "#ee5a52",
          "background": "#0f0f0f",
          "surface": "#1f1f1f",
          "text": {
            "primary": "#ffffff",
            "secondary": "#cccccc",
            "muted": "#888888"
          },
          "border": "#333333"
        }
      }
    }
  }
}
```

### 4. Reorder Page Sections
```json
{
  "sections": [
    {
      "id": "blog",
      "name": "Blog", 
      "enabled": true,
      "order": 1,
      "component": "BlogSection"
    },
    {
      "id": "projects",
      "name": "Projects",
      "enabled": true, 
      "order": 2,
      "component": "ProjectsSection"
    }
  ]
}
```

### 5. Hide a Section
```json
{
  "sections": [
    {
      "id": "anime",
      "name": "Anime",
      "enabled": false,  // Set to false to hide
      "order": 3,
      "component": "AnimeSection"
    }
  ]
}
```

### 6. Disable Animations
```json
{
  "layout": {
    "animations": {
      "enabled": false,
      "shootingStars": false,
      "initialLoadAnimation": false
    }
  }
}
```

## Technical Implementation

### Theme System Features
- **CSS Variables**: All colors use CSS custom properties for instant theme switching
- **Automatic Color Derivation**: Shadow and accent background colors are automatically calculated
- **Theme-Specific Styles**: Special CSS rules for specific themes (e.g., black shooting stars for monochrome)
- **Backward Compatibility**: Legacy CSS variable names are maintained

### Navigation System
- **Smart Section Tracking**: Automatically highlights the current section based on scroll position
- **Initial State Fix**: Properly shows the first section as active on page load
- **Smooth Scrolling**: Click navigation items to smoothly scroll to sections

### Responsive Design
- **Mobile Optimized**: All sections adapt to mobile screens
- **Sidebar Collapse**: Sidebar can be collapsed on desktop for more content space
- **Flexible Layout**: Content areas expand when sidebar is collapsed

## Important Notes

1. **JSON Format**: Ensure the file is valid JSON format with proper commas and quotes
2. **Color Format**: Use hexadecimal color values (e.g., `#87ceeb`)
3. **Order Numbers**: Use sequential numbers (1, 2, 3...) for section ordering
4. **Component Names**: Use only predefined component names
5. **Refresh Required**: Refresh the page after making changes to see effects
6. **Theme Consistency**: All components now properly inherit theme colors including blog posts

## Example Configuration
Check `public/data/settings.example.json` for an alternative configuration example.

## Troubleshooting

### Colors Not Updating
- Ensure you're using valid hex color codes
- Refresh the page after making changes
- Check that the JSON syntax is correct

### Navigation Issues  
- Verify section IDs match the component requirements
- Ensure at least one section is enabled
- Check that order numbers are unique

### Animation Problems
- Try disabling animations if performance is poor
- Ensure your browser supports CSS animations
- Check if reduced motion is enabled in system preferences