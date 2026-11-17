import { useState } from 'react'
import './PostsSection.css'

const PostsSection = ({ posts, onPostClick }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Expand or collapse; after collapsing, bring the section heading back into view
  const toggleExpanded = () => {
    const collapsing = isExpanded
    setIsExpanded(!isExpanded)
    if (!collapsing) return
    requestAnimationFrame(() => {
      const section = document.getElementById('posts')
      if (section && section.getBoundingClientRect().top < 0) {
        const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        section.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
      }
    })
  }

  if (!posts || posts.length === 0) {
    return (
      <section id="posts" className="section">
        <h2 className="section-title">Writing</h2>
        <div className="loading">Loading writing...</div>
      </section>
    )
  }

  // Group posts by year
  const _postsByYear = posts.reduce((acc, post) => {
    const year = post.date.split('-')[0]
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(post)
    return acc
  }, {})

  const formatDate = (dateString) => {
    const [, month, day] = dateString.split('-')
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${parseInt(day, 10)} ${monthNames[parseInt(month, 10) - 1]}`
  }

  // Get all posts in chronological order for limiting
  const allPostsChronological = posts.sort((a, b) => b.date.localeCompare(a.date))
  const displayedPosts = isExpanded ? allPostsChronological : allPostsChronological.slice(0, 3)
  const hasMoreItems = posts.length > 3
  
  // Group displayed posts by year
  const displayedPostsByYear = displayedPosts.reduce((acc, post) => {
    const year = post.date.split('-')[0]
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(post)
    return acc
  }, {})

  const displayedSortedYears = Object.keys(displayedPostsByYear).sort((a, b) => b - a)

  return (
    <section id="posts" className="section">
      <div className="section-header">
        <h2 
          className={`section-title ${hasMoreItems ? 'clickable' : ''}`}
          onClick={hasMoreItems ? toggleExpanded : undefined}
          role={hasMoreItems ? "button" : undefined}
          tabIndex={hasMoreItems ? 0 : undefined}
          onKeyDown={hasMoreItems ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              toggleExpanded()
            }
          } : undefined}
          aria-label={hasMoreItems ? `Writing section - ${isExpanded ? 'Click to show less' : 'Click to show more'}` : 'Writing section'}
        >
          Writing
          {hasMoreItems && (
            <div className={`expand-triangle ${isExpanded ? 'expanded' : ''}`}></div>
          )}
        </h2>
      </div>
      <div className="posts-timeline">
        {displayedSortedYears.map(year => (
          <div key={year} className="posts-year">
            <h3 className="posts-year-title">{year}</h3>
            <div className="posts-posts">
              {displayedPostsByYear[year]
                .sort((a, b) => b.date.localeCompare(a.date))
                .map(post => (
                  <article
                    key={post.id || post.externalUrl || post.title}
                    className={`posts-post-item ${post.type === 'external' ? 'external-link' : ''} ${post.coverImage ? 'has-cover' : ''}`}
                    onClick={() => {
                      if (post.type === 'external' && post.externalUrl) {
                        window.open(post.externalUrl, '_blank', 'noopener,noreferrer')
                      } else if (onPostClick) {
                        onPostClick(post)
                      }
                    }}
                  >
                    <time className="posts-post-date" dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                    <div className="posts-post-body">
                      <h4 className="posts-post-title">
                        {post.title}
                        {post.type === 'external' && (
                          <>
                            {'\u00a0'}
                            <span className="posts-external" aria-hidden="true">↗</span>
                          </>
                        )}
                      </h4>
                      <p className="posts-post-excerpt">{post.excerpt}</p>
                    </div>
                    {post.coverImage && (
                      <div className="posts-post-cover">
                        <img
                          src={post.coverImage}
                          alt={`Cover for ${post.title}`}
                          className="posts-cover-image"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="posts-post-tags">
                      {post.author && (
                        <span className="posts-section-author">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                          {post.author}
                        </span>
                      )}
                      {post.tags.map(tag => (
                        <span key={tag} className="posts-tag">{tag}</span>
                      ))}
                    </div>
                  </article>
                ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* View More / View Less toggle */}
      {hasMoreItems && (
        <div className="view-more-container">
          <button
            onClick={toggleExpanded}
            className="view-more-button"
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'View Less' : 'View More'}
            <svg className="view-more-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M3 4.75l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </section>
  )
}

export default PostsSection
