// Theme utility functions
export const applyTheme = (colors) => {
  if (!colors) return

  const root = document.documentElement
  
  // Apply CSS custom properties
  // Legacy variables for backward compatibility
  root.style.setProperty('--primary-blue', colors.primary)
  root.style.setProperty('--accent-blue', colors.accent)
  
  // New theme variables
  root.style.setProperty('--primary-color', colors.primary)
  root.style.setProperty('--accent-color', colors.accent)
  root.style.setProperty('--background-color', colors.background)
  root.style.setProperty('--surface-color', colors.surface)
  root.style.setProperty('--text-primary', colors.text.primary)
  root.style.setProperty('--text-secondary', colors.text.secondary)
  root.style.setProperty('--text-muted', colors.text.muted)
  root.style.setProperty('--border-color', colors.border)
  
  // Calculate derived colors
  const primaryColor = colors.primary
  const shadowOpacity = colors.background === '#ffffff' ? '0.1' : '0.3'
  const accentBgOpacity = colors.background === '#ffffff' ? '0.05' : '0.05'
  
  // Extract RGB values from hex color for rgba
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }
  
  const primaryRgb = hexToRgb(primaryColor)
  if (primaryRgb) {
    root.style.setProperty('--shadow-color', `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${shadowOpacity})`)
    root.style.setProperty('--accent-bg-color', `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${accentBgOpacity})`)
  } else {
    // Fallback for non-hex colors
    root.style.setProperty('--shadow-color', `rgba(0, 0, 0, ${shadowOpacity})`)
    root.style.setProperty('--accent-bg-color', `rgba(135, 206, 235, ${accentBgOpacity})`)
  }
}

export const getCurrentTheme = (settings) => {
  if (!settings?.theme?.themes || !settings?.theme?.current) return null
  
  const currentThemeKey = settings.theme.current
  return settings.theme.themes[currentThemeKey] || null
}

export const getAvailableThemes = (settings) => {
  if (!settings?.theme?.themes) return []
  
  return Object.entries(settings.theme.themes).map(([key, theme]) => ({
    key,
    name: theme.name,
    colors: theme.colors
  }))
}

export const getSortedSections = (sections) => {
  if (!sections) return []
  
  return sections
    .filter(section => section.enabled)
    .sort((a, b) => a.order - b.order)
}

export const getSectionComponent = (sectionId) => {
  const componentMap = {
    'projects': 'ProjectsSection',
    'publications': 'PublicationsSection',
    'anime': 'AnimeSection',
    'blog': 'BlogSection',
    'contact': 'ContactSection'
  }
  
  return componentMap[sectionId] || null
}