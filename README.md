# Personal Portfolio Website

A modern, responsive personal portfolio website built with React and Vite.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dynamic Content**: All content is loaded from JSON configuration files
- **Modern UI**: Clean, professional design with smooth animations
- **Blog Support**: Built-in blog system with external link support
- **Project Showcase**: Display your projects with images, descriptions, and links
- **Image Gallery**: Customizable polaroid-style image gallery
- **Contact Integration**: Easy contact form and social media links
- **Theme Support**: Multiple built-in themes with customization options
- **Performance Optimized**: Fast loading with modern build tools

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd personal-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Configuration

### Profile Configuration

Edit `public/data/profile.json` to customize your personal information:

```json
{
  "personal": {
    "name": "Your Name",
    "title": "Your Title",
    "description": "Your description here",
    "email": "your.email@example.com",
    "avatar": {
      "initials": "YN",
      "image": "/images/avatar.jpg"
    },
    "socialLinks": [
      {
        "name": "GitHub",
        "url": "https://github.com/yourusername"
      },
      {
        "name": "LinkedIn",
        "url": "https://linkedin.com/in/yourusername"
      },
      {
        "name": "CV",
        "url": "/files/your_cv.pdf"
      }
    ]
  }
}
```

### Settings Configuration

Edit `public/data/settings.json` to customize themes, sections, and layout:

```json
{
  "theme": {
    "current": "dark",
    "themes": {
      "dark": {
        "name": "Dark Theme",
        "colors": {
          "primary": "#87ceeb",
          "accent": "#5fb3d4",
          "background": "#1a1a1a",
          "surface": "#2a2a2a",
          "text": {
            "primary": "#ffffff",
            "secondary": "#cccccc",
            "muted": "#999999"
          },
          "border": "#404040"
        }
      }
    }
  },
  "sections": [
    {
      "id": "blog",
      "name": "Blog",
      "enabled": true,
      "order": 1,
      "component": "BlogSection"
    }
  ],
  "layout": {
    "sidebar": {
      "defaultWidth": 580,
      "minWidth": 300,
      "maxWidth": 800,
      "collapsedWidth": 50
    },
    "animations": {
      "enabled": true,
      "shootingStars": true,
      "initialLoadAnimation": true
    }
  }
}
```

### Blog Configuration

Edit `public/data/blog.json` to add your blog posts:

```json
[
  {
    "title": "Blog Post Title",
    "date": "2024-01-15",
    "excerpt": "Brief description of the blog post content",
    "tags": ["tag1", "tag2", "tag3"],
    "type": "external",
    "externalUrl": "https://example.com/blog-post",
    "coverImage": "/images/blog/cover.png"
  }
]
```

**Blog Post Fields:**
- `title`: Post title
- `date`: Publication date (YYYY-MM-DD format)
- `excerpt`: Brief description
- `tags`: Array of tags
- `type`: Currently supports "external"
- `externalUrl`: URL to external blog post
- `coverImage`: Optional cover image path

### Projects Configuration

Edit `public/data/projects.json` to showcase your projects:

```json
[
  {
    "title": "Project Name",
    "description": "Project description explaining what it does and technologies used",
    "image": "/images/projects/project.png",
    "tags": ["React", "Node.js", "MongoDB"],
    "links": {
      "github": "https://github.com/username/project",
      "live": "https://project.example.com",
      "devpost": "https://devpost.com/software/project"
    }
  },
  {
    "title": "Video Project",
    "description": "Project with YouTube video instead of image",
    "youtube": "https://youtube.com/watch?v=VIDEO_ID",
    "tags": ["Unity", "C#", "Game Development"],
    "links": {
      "github": "https://github.com/username/game",
      "youtube": "https://youtube.com/watch?v=VIDEO_ID"
    }
  }
]
```

**Project Fields:**
- `title`: Project name
- `description`: Project description
- `image`: Project screenshot/image path
- `youtube`: YouTube video URL (alternative to image)
- `tags`: Array of technology/category tags
- `links`: Object with various link types

**Supported Link Types:**
- `github`: GitHub repository
- `live`: Live demo/website
- `devpost`: Devpost submission
- `youtube`: YouTube video

### Image Gallery Configuration

Edit `public/data/anime.json` to customize the polaroid-style image gallery:

```json
{
  "config": {
    "canvas": {
      "width": 1100,
      "height": 850
    },
    "title": {
      "text": "My Gallery Title",
      "x": 565,
      "y": 400,
      "fontSize": 3.2,
      "rotation": -2.5,
      "color": "#8B4513"
    }
  },
  "items": [
    {
      "name": "ITEM NAME",
      "image": "/images/gallery/1.jpg",
      "width": 210,
      "height": 315,
      "x": 60,
      "y": 60,
      "rotation": -2
    }
  ]
}
```

**Gallery Configuration:**
- `config.canvas`: Canvas dimensions
- `config.title`: Title text, position, and styling
- `items`: Array of gallery items with position and rotation

## Available Themes

### Built-in Themes
- **`dark`** - Dark theme with sky blue accents (default)
- **`light`** - Clean light theme with blue accents
- **`ocean`** - Deep blue ocean theme
- **`monochrome`** - Pure black and white theme

### Creating Custom Themes

Add your custom theme to the `themes` object in `settings.json`:

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

## Section Management

### Available Components
- **`BlogSection`** - Blog posts in timeline format
- **`ProjectsSection`** - Project showcase with cards and links
- **`PublicationsSection`** - Academic publications (can be enabled/disabled)
- **`ContactSection`** - Contact information and links
- **`AnimeSection`** - Polaroid-style image gallery

### Reordering Sections

Change the `order` property in `settings.json`:

```json
{
  "sections": [
    {
      "id": "projects",
      "name": "Projects",
      "enabled": true,
      "order": 1,
      "component": "ProjectsSection"
    },
    {
      "id": "blog",
      "name": "Blog", 
      "enabled": true,
      "order": 2,
      "component": "BlogSection"
    }
  ]
}
```

### Hiding Sections

Set `enabled` to `false`:

```json
{
  "id": "anime",
  "name": "Image Gallery",
  "enabled": false,
  "order": 5,
  "component": "AnimeSection"
}
```

## File Structure

```
public/
├── data/
│   ├── settings.json          # Main site configuration
│   ├── profile.json          # Personal information
│   ├── blog.json             # Blog posts data
│   ├── projects.json         # Projects data
│   └── anime.json            # Image gallery data
├── images/
│   ├── pfp.jpg               # Profile avatar
│   ├── blog/                 # Blog post cover images
│   ├── projects/             # Project screenshots
│   └── anime/                # Gallery images
└── files/                    # CV and other files

src/
├── components/               # React components
├── hooks/                    # Custom React hooks
└── App.jsx                   # Main application component
```

## Adding Content

### Adding a Blog Post

1. Add an entry to `public/data/blog.json`
2. Optionally add a cover image to `public/images/blog/`

### Adding a Project

1. Add project data to `public/data/projects.json`
2. Add project image to `public/images/projects/`
3. For video projects, use the `youtube` field instead of `image`

### Adding Gallery Images

1. Add image data to `public/data/anime.json`
2. Add images to `public/images/anime/`
3. Adjust position, size, and rotation as needed

## Layout Customization

### Sidebar Settings

```json
{
  "layout": {
    "sidebar": {
      "defaultWidth": 580,    // Default sidebar width
      "minWidth": 300,        // Minimum width when resizing
      "maxWidth": 800,        // Maximum width when resizing
      "collapsedWidth": 50    // Width when collapsed
    }
  }
}
```

### Animation Settings

```json
{
  "layout": {
    "animations": {
      "enabled": true,              // Enable/disable all animations
      "shootingStars": true,        // Show shooting star background
      "initialLoadAnimation": true  // Show initial load animation
    }
  }
}
```

## Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

### Deploy to GitHub Pages

1. Install the GitHub Pages deployment package:
```bash
npm install --save-dev gh-pages
```

2. Add deployment scripts to your `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Deploy:
```bash
npm run deploy
```

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to Netlify
3. Or connect your GitHub repository for automatic deployments

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy

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

### Gallery Layout Issues
- Adjust x, y coordinates to position items
- Use rotation values between -10 and 10 degrees for best results
- Ensure image paths are correct

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.