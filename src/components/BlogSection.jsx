import { useState } from 'react'
import './BlogSection.css'

const BlogSection = ({ blogPosts, onPostClick }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!blogPosts || blogPosts.length === 0) {
    return (
      <section id="blog" className="section">
        <h2 className="section-title">Blog</h2>
        <div className="loading">Loading blog posts...</div>
      </section>
    )
  }

  // Group posts by year
  const postsByYear = blogPosts.reduce((acc, post) => {
    const year = post.date.split('-')[0]
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(post)
    return acc
  }, {})

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-')
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${day} ${monthNames[parseInt(month) - 1]}`
  }

  // Get all posts in chronological order for limiting
  const allPostsChronological = blogPosts.sort((a, b) => b.date.localeCompare(a.date))
  const displayedPosts = isExpanded ? allPostsChronological : allPostsChronological.slice(0, 3)
  const hasMoreItems = blogPosts.length > 3
  
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
    <section id="blog" className="section">
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
          aria-label={hasMoreItems ? `Blog section - ${isExpanded ? 'Click to show less' : 'Click to show more'}` : 'Blog section'}
        >
          Blog
          {hasMoreItems && (
            <div className={`expand-triangle ${isExpanded ? 'expanded' : ''}`}></div>
          )}
        </h2>
      </div>
      <div className="blog-timeline">
        {displayedSortedYears.map(year => (
          <div key={year} className="blog-year">
            <h3 className="blog-year-title">{year}</h3>
            <div className="blog-posts">
              {displayedPostsByYear[year]
                .sort((a, b) => b.date.localeCompare(a.date))
                .map(post => (
                  <article 
                    key={post.id} 
                    className={`blog-post-item ${post.type === 'external' ? 'external-link' : ''}`}
                    onClick={() => {
                      if (post.type === 'external' && post.externalUrl) {
                        window.open(post.externalUrl, '_blank', 'noopener,noreferrer')
                      } else if (onPostClick) {
                        onPostClick(post)
                      }
                    }}
                  >
                    <div className="blog-post-date">
                      {formatDate(post.date)}
                    </div>
                    <h4 className="blog-post-title">{post.title}</h4>
                    <p className="blog-post-excerpt">{post.excerpt}</p>
                    {post.coverImage && (
                      <div className="blog-post-cover">
                        <img 
                          src={post.coverImage} 
                          alt={`Cover for ${post.title}`}
                          className="blog-cover-image"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="blog-post-tags">
                      {post.author && (
                        <span className="blog-section-author">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                          {post.author}
                        </span>
                      )}
                      {post.tags.map(tag => (
                        <span key={tag} className="blog-tag">{tag}</span>
                      ))}
                    </div>
                  </article>
                ))}
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
            View More Posts
          </button>
        </div>
      )}
    </section>
  )
}

export default BlogSection