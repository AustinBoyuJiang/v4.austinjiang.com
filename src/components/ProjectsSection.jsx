import { useState, useEffect } from 'react'

const ProjectsSection = ({ projects, isSidebarCollapsed }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  // Listen for window resize events with debouncing
  useEffect(() => {
    let timeoutId = null
    
    const handleResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      
      timeoutId = setTimeout(() => {
        const newIsMobile = window.innerWidth <= 768
        setIsMobile(newIsMobile)
        
        // Reset expanded state when switching between mobile and desktop
        if (newIsMobile !== isMobile) {
          setIsExpanded(false)
        }
      }, 150) // 150ms debounce
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isMobile])

  if (!projects || projects.length === 0) {
    return (
      <section id="projects" className="section">
        <h2 className="section-title">Projects</h2>
        <div className="loading">Loading projects...</div>
      </section>
    )
  }

  // Adjust number of projects based on screen size and sidebar state
  const getProjectsToShow = () => {
    if (isExpanded) return projects
    
    if (isMobile) {
      return projects.slice(0, 3) // Always show 3 on mobile
    } else {
      // Desktop: When sidebar is collapsed, show 3 projects; when expanded, show 4
      const itemsToShow = isSidebarCollapsed ? 3 : 4
      return projects.slice(0, itemsToShow)
    }
  }

  const displayedProjects = getProjectsToShow()
  
  // Check if there are more items to show
  const getMaxItems = () => {
    if (isMobile) return 3
    return isSidebarCollapsed ? 3 : 4
  }
  
  const hasMoreItems = projects.length > getMaxItems()

  const getLinkIcon = (type) => {
    switch (type) {
      case 'github':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        )
      case 'live':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        )
      case 'devpost':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.002 1.61L0 12.004L6.002 22.39h11.996L24 12.004L17.998 1.61H6.002zm1.593 4.084h3.947c3.605 0 6.276 1.695 6.276 6.31 0 4.436-3.21 6.302-6.456 6.302H7.595V5.694zm2.517 2.449v7.714h1.241c2.646 0 3.862-1.55 3.862-3.861.009-2.569-1.096-3.853-3.767-3.853H10.112z"/>
          </svg>
        )
      default:
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
          </svg>
        )
    }
  }

  const getLinkText = (type) => {
    switch (type) {
      case 'github':
        return 'GitHub'
      case 'live':
        return 'Live Demo'
      case 'devpost':
        return 'Devpost'
      default:
        return 'Link'
    }
  }

  return (
    <section id="projects" className="section">
      <div className="section-header">
        <h2 
          className={`section-title ${hasMoreItems ? 'clickable' : ''}`}
          onClick={hasMoreItems ? () => setIsExpanded(!isExpanded) : undefined}
          role={hasMoreItems ? "button" : undefined}
          tabIndex={hasMoreItems ? 0 : undefined}
          onKeyDown={hasMoreItems ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setIsExpanded(!isExpanded)
            }
          } : undefined}
          aria-label={hasMoreItems ? `Projects section - ${isExpanded ? 'Click to show less' : 'Click to show more'}` : 'Projects section'}
        >
          Projects
          {hasMoreItems && (
            <div className={`expand-triangle ${isExpanded ? 'expanded' : ''}`}></div>
          )}
        </h2>
      </div>
      <div className="projects-grid">
        {displayedProjects.map(project => (
          <div key={project.id} className="project-card">
            <div className="project-image">
              <img src={project.image} alt={project.title} />
            </div>
            <div className="project-content">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <div className="project-links">
                {Object.entries(project.links).map(([type, url]) => {
                  if (!url) return null
                  return (
                    <a
                      key={type}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                      title={getLinkText(type)}
                    >
                      {getLinkIcon(type)}
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* View More Button */}
      {!isExpanded && hasMoreItems && (
        <div className="view-more-container">
          <button 
            onClick={() => setIsExpanded(true)}
            className="view-more-button"
          >
            View More Projects
          </button>
        </div>
      )}
    </section>
  )
}

export default ProjectsSection