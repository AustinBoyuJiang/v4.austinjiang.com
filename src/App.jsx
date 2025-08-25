import { useState, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import './App.css'
import BlogSection from './components/BlogSection'
import BlogPost from './components/BlogPost'
import ProjectsSection from './components/ProjectsSection'
import PublicationsSection from './components/PublicationsSection'
import AnimeSection from './components/AnimeSection'
import ContactSection from './components/ContactSection'
import { useData } from './hooks/useData'
import { applyTheme, getSortedSections, getCurrentTheme } from './utils/theme'

function App() {

  const [currentPage, setCurrentPage] = useState('home')
  const [selectedBlogPost, setSelectedBlogPost] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isHintFadingOut, setIsHintFadingOut] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [sidebarWidth, setSidebarWidth] = useState(580)
  const [isResizing, setIsResizing] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024)
  const { profile, projects, publications, blog, anime, settings, loading, error } = useData()

  // Apply theme when settings are loaded
  useEffect(() => {
    const currentTheme = getCurrentTheme(settings)
    if (currentTheme?.colors) {
      applyTheme(currentTheme.colors)
      
      // Add theme class to body for theme-specific CSS
      document.body.className = document.body.className.replace(/theme-\w+/g, '')
      if (settings?.theme?.current) {
        document.body.classList.add(`theme-${settings.theme.current}`)
      }
    }
  }, [settings])

  // Set initial active section to the first enabled section
  useEffect(() => {
    if (settings?.sections) {
      const firstSection = getSortedSections(settings.sections)[0]
      if (firstSection && !activeSection) {
        setActiveSection(firstSection.id)
      }
    }
  }, [settings, activeSection])

  // Handle URL routing for blog posts
  useEffect(() => {
    const path = window.location.pathname
    if (path.startsWith('/blog/') && blog && blog.length > 0) {
      const postId = path.replace('/blog/', '')
      const post = blog.find(p => p.id === postId)
      if (post && (post.type === 'markdown' || !post.type)) {
        // 只有markdown类型的文章才进行内部路由
        navigateToBlogPost(post)
      } else if (post && post.type === 'external') {
        // 外部链接重定向到外部URL
        window.location.href = post.externalUrl
      } else {
        // 如果找不到对应的blog post，重定向到首页
        console.warn(`Blog post with id "${postId}" not found`)
        navigateToHome(true)
      }
    }
  }, [blog])

  // Initial load animation - show full screen profile until clicked (desktop only)
  const handleInitialClick = () => {
    if (!isMobile) {
      setIsHintFadingOut(true)
      setTimeout(() => {
        setIsInitialLoad(false)
        setIsHintFadingOut(false)
      }, 300)
    }
  }

  // 移除手机版滑动消失功能

  // Disable initial load on mobile
  // 手机版保持提示显示，桌面版可以点击关闭
  useEffect(() => {
    // 不自动关闭，让手机版也显示提示
  }, [])

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (currentPage !== 'home' || !settings?.sections) return

      const enabledSections = getSortedSections(settings.sections).map(s => s.id)
      const scrollPosition = window.scrollY + 200 // Adjust offset for better detection

      // Find the section that's currently in view
      let currentSection = enabledSections[0] // Default to first section
      
      // If we're at the very top of the page, always show first section
      if (window.scrollY < 100) {
        currentSection = enabledSections[0]
      } else {
        for (let i = 0; i < enabledSections.length; i++) {
          const element = document.getElementById(enabledSections[i])
          if (element) {
            const elementTop = element.offsetTop
            const elementBottom = elementTop + element.offsetHeight
            
            // Check if section is in viewport
            if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
              currentSection = enabledSections[i]
              break
            }
            // If we're past this section but before the next one
            else if (scrollPosition >= elementTop) {
              currentSection = enabledSections[i]
            }
          }
        }
      }

      setActiveSection(currentSection)
    }

    // Add a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      window.addEventListener('scroll', handleScroll)
      handleScroll() // Check initial position
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [currentPage, settings])

  // Track screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle sidebar resizing
  useEffect(() => {
    let animationFrame = null
    
    const handleMouseMove = (e) => {
      if (!isResizing || isSidebarCollapsed || isMobile) return
      
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
      
      animationFrame = requestAnimationFrame(() => {
        const newWidth = Math.max(300, Math.min(800, e.clientX))
        setSidebarWidth(newWidth)
      })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    if (isResizing && !isSidebarCollapsed && !isMobile) {
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isResizing, isSidebarCollapsed, isMobile])

  const handleResizeStart = (e) => {
    if (isSidebarCollapsed) return // Don't allow resizing when collapsed
    e.preventDefault()
    setIsResizing(true)
  }



  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = async () => {
      const path = window.location.pathname
      if (path === '/') {
        navigateToHome(false)
      } else if (path.startsWith('/blog/') && blog && blog.length > 0) {
        const postId = path.replace('/blog/', '')
        const post = blog.find(p => p.id === postId)
        if (post) {
          setSelectedBlogPost(post)
          setCurrentPage('blog-post')
        } else {
          // 如果找不到对应的blog post，重定向到首页
          console.warn(`Blog post with id "${postId}" not found`)
          navigateToHome(true)
        }
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [blog])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.menu-container')) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMenuOpen])

  const getSocialIcon = (name) => {
    switch (name.toLowerCase()) {
      case 'github':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        )
      case 'linkedin':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        )
      case 'devpost':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.002 1.61L0 12.004L6.002 22.39h11.996L24 12.004L17.998 1.61H6.002zm1.593 4.084h3.947c3.605 0 6.276 1.695 6.276 6.31 0 4.436-3.21 6.302-6.456 6.302H7.595V5.694zm2.517 2.449v7.714h1.241c2.646 0 3.862-1.55 3.862-3.861.009-2.569-1.096-3.853-3.767-3.853H10.112z" />
          </svg>
        )
      case 'cv':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        )
      case 'twitter':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        )
      case 'instagram':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        )
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
          </svg>
        )
    }
  }



  const scrollToSection = (sectionId) => {
    if (currentPage !== 'home') {
      setCurrentPage('home')
      setSelectedBlogPost(null)
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const navigateToBlogPost = (post) => {
    // 只有markdown类型的文章才进行内部路由
    if (post.type === 'markdown' || !post.type) { // 兼容旧格式
      setSelectedBlogPost(post)
      setCurrentPage('blog-post')
      window.history.pushState(null, '', `/blog/${post.id}`)
      window.scrollTo(0, 0)
    }
    // 外部链接在BlogSection组件中直接处理
  }

  const navigateToHome = (pushState = true) => {
    setCurrentPage('home')
    setSelectedBlogPost(null)
    if (pushState) {
      window.history.pushState(null, '', '/')
    }
    window.scrollTo(0, 0)
  }

  // Update document title based on current page
  useEffect(() => {
    if (currentPage === 'blog-post' && selectedBlogPost) {
      document.title = `${selectedBlogPost.title} | Austin Jiang`
    } else {
      document.title = 'Austin Jiang'
    }
  }, [currentPage, selectedBlogPost])

  // Render section component based on settings
  const renderSection = (section) => {
    const commonProps = { key: section.id }
    
    switch (section.component) {
      case 'ProjectsSection':
        return <ProjectsSection {...commonProps} projects={projects || []} isSidebarCollapsed={isSidebarCollapsed} />
      case 'PublicationsSection':
        return <PublicationsSection {...commonProps} publications={publications || []} />
      case 'AnimeSection':
        return <AnimeSection {...commonProps} anime={anime || []} isSidebarCollapsed={isSidebarCollapsed} />
      case 'BlogSection':
        return <BlogSection {...commonProps} blogPosts={blog || []} onPostClick={navigateToBlogPost} />
      case 'ContactSection':
        return <ContactSection {...commonProps} email={profile?.personal?.email} />
      default:
        return null
    }
  }

  // Render blog post page
  if (currentPage === 'blog-post' && selectedBlogPost) {
    return (
      <>
        <BlogPost post={selectedBlogPost} onBack={navigateToHome} />
        <Analytics />
      </>
    )
  }

  return (
    <>


      <div className={`layout ${isInitialLoad ? 'initial-load' : ''}`}>
        {/* Left Sidebar */}
        <aside 
          className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${isInitialLoad ? 'fullscreen' : ''} ${isResizing ? 'resizing' : ''}`}
          onClick={isInitialLoad && !isMobile ? handleInitialClick : undefined}

          style={
            isInitialLoad && !isMobile
              ? { cursor: 'pointer' } 
              : !isSidebarCollapsed && !isMobile
                ? { width: `${sidebarWidth}px` }
                : {}
          }
        >
          {/* Sidebar Toggle Button */}
          {!isInitialLoad && (
            <button
              className="sidebar-toggle"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d={isSidebarCollapsed ?
                  "M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" :
                  "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
                } />
              </svg>
            </button>
          )}

          <div className="sidebar-content">
            {/* Profile Section */}
            <div id="home" className="profile-section">
              {loading ? (
                <div className="loading">Loading...</div>
              ) : profile?.personal ? (
                <>
                  <div className="avatar">
                    {profile.personal.avatar.image ? (
                      <img src={profile.personal.avatar.image} alt={profile.personal.name} />
                    ) : (
                      profile.personal.avatar.initials
                    )}
                  </div>
                  <h1 className="name">{profile.personal.name}</h1>
                  <p className="title">{profile.personal.title}</p>
                  <p className="description">{profile.personal.description}</p>
                  <div className="social-links">
                    {profile.personal.socialLinks?.map(link => (
                      <a
                        key={link.name}
                        href={link.url}
                        className="social-link"
                        target={link.name.toLowerCase() === 'cv' ? '_self' : '_blank'}
                        rel={link.name.toLowerCase() === 'cv' ? undefined : 'noopener noreferrer'}
                        download={link.name.toLowerCase() === 'cv' ? 'Austin_Jiang_CV.pdf' : undefined}
                      >
                        <span className="social-icon">{getSocialIcon(link.name)}</span>
                        {link.name}
                      </a>
                    )) || []}
                  </div>
                  
                  {/* Profile interaction hints - show during initial load and fade out */}
                  {(isInitialLoad || isHintFadingOut) && (
                    <>
                      <div className={`profile-hint-desktop ${isHintFadingOut ? 'fade-out' : ''}`}>
                        <span className="hint-text">Click</span>
                        <div className="hint-line"></div>
                      </div>
                      <div className={`profile-hint-mobile ${isHintFadingOut ? 'fade-out' : ''}`}>
                        <div className="hint-line"></div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="error">Failed to load profile data</div>
              )}
            </div>
          </div>
          
          {/* Resize handle - only show when not collapsed and on desktop */}
          {!isInitialLoad && !isSidebarCollapsed && !isMobile && (
            <div 
              className="resize-handle"
              onMouseDown={handleResizeStart}
            />
          )}
        </aside>

        {/* Right Main Content */}
        <main 
          className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''} ${isInitialLoad ? 'hidden' : ''} ${isResizing ? 'resizing' : ''}`}
          style={
            !isInitialLoad && !isSidebarCollapsed && !isMobile
              ? { marginLeft: `${sidebarWidth}px` }
              : {}
          }
        >
          {/* Table of Contents Navigation */}
          <div className="toc-container">
            <nav className="toc-nav">
              {getSortedSections(settings?.sections).map(section => (
                <div key={section.id} className={`toc-item ${activeSection === section.id ? 'active' : ''}`} data-section={section.id} onClick={() => scrollToSection(section.id)}>
                  <div className="toc-dot"></div>
                  <span className="toc-label">{section.name}</span>
                </div>
              ))}
            </nav>
          </div>

          <div className="content-container">
            {/* Dynamic Sections based on settings */}
            {getSortedSections(settings?.sections).map(section => renderSection(section))}
          </div>
        </main>
      </div>
      <Analytics />
    </>
  )
}

export default App
