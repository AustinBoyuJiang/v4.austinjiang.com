# Personal Portfolio Website

A modern, interactive portfolio website built with React and Vite. Features resizable sidebar, full-screen introduction, and responsive design.

## Key Features

- **Full-Screen Introduction**: Desktop users see full-screen profile on first visit
- **Resizable Sidebar**: Drag to customize width (300px-800px range)
- **Dot Navigation**: Right-side navigation with smooth scrolling
- **Responsive Design**: Adapts seamlessly from desktop to mobile
- **Data-Driven**: All content managed through JSON files
- **Blog System**: Timeline-style blog with markdown support
- **CV Download**: One-click PDF download functionality

## Quick Start

```bash
git clone https://github.com/yourusername/personal-portfolio
cd personal-portfolio
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Project Structure

```
src/
├── components/          # React components
├── hooks/              # Custom hooks
├── App.jsx            # Main application
└── App.css            # Styles

public/
├── data/              # JSON configuration files
├── files/             # Downloadable files (CV)
├── images/            # Project assets
└── blog/              # Markdown blog posts
```

## Configuration

### Personal Information
Edit `public/data/profile.json` with your details, social links, and CV file path.

### Projects
Add projects to `public/data/projects.json` with title, description, image, and links.

### Publications
Update `public/data/publications.json` with your academic publications.

### Blog Posts
Configure `public/data/blog.json` and add markdown files to `public/blog/`.

### CV Download
Replace `public/files/Austin_Jiang_CV.pdf` with your CV file.

## Features

### Interactive Sidebar
- Drag right edge to resize (300px-800px)
- Toggle button to collapse to 50px
- Responsive design adapts to screen size

### Navigation
- Right-side dot navigation with smooth scrolling
- Active section highlighting
- Hover labels for section names

### Content Display
- Adaptive project count (4 desktop, 3 mobile)
- Expandable sections
- Dynamic grid layouts

### Responsive Design
- Breakpoints: 1024px and 768px
- Automatic layout switching
- Touch-optimized mobile interface

## Technology Stack

- React 18 with hooks
- Vite build tool
- CSS3 with flexbox and grid
- JavaScript ES6+
- Vercel Analytics for website analytics

## Color System

```css
:root {
  --primary-blue: #87ceeb;    /* Sky Blue - Primary accent */
  --accent-blue: #5fb3d4;     /* Darker blue - Secondary accent */
  --bg-primary: #1a1a1a;      /* Dark background */
  --bg-secondary: #2a2a2a;    /* Card backgrounds */
  --text-primary: #ffffff;    /* Primary text */
  --text-secondary: #cccccc;  /* Secondary text */
  --border-color: #404040;    /* Subtle borders */
}
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

```bash
# Build for production
npm run build

# Preview build
npm run preview

# Deploy to Vercel
npm install -g vercel
vercel --prod
```

### Vercel Analytics
This project includes Vercel Analytics for tracking website performance and visitor insights. Analytics are automatically enabled when deployed to Vercel. No additional configuration is required.

## Development

### Adding Sections
1. Create component in `src/components/`
2. Add data to appropriate JSON file
3. Import in `App.jsx`
4. Add to navigation system

### Common Issues
- Ensure images are in `public/images/`
- Verify markdown files exist in `public/blog/`
- Check JSON file paths are correct
- Clear browser cache after CSS changes

## License

MIT License

## Contact

- Email: a68jiang@uwaterloo.ca
- GitHub: [Issues](https://github.com/yourusername/personal-portfolio/issues)