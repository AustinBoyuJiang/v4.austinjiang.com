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
    const year = new Date(post.date).getFullYear()
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(post)
    return acc
  }, {})

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = date.toLocaleDateString('en-US', { month: 'short' })
    return `${day} ${month}`
  }

  // Get all posts in chronological order for limiting
  const allPostsChronological = blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date))
  const displayedPosts = isExpanded ? allPostsChronological : allPostsChronological.slice(0, 3)
  const hasMoreItems = blogPosts.length > 3
  
  // Group displayed posts by year
  const displayedPostsByYear = displayedPosts.reduce((acc, post) => {
    const year = new Date(post.date).getFullYear()
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
                .sort((a, b) => new Date(b.date) - new Date(a.date))
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
                    <div className="blog-post-tags">
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