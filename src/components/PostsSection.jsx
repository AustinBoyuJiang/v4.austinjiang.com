import { useState } from 'react'
import './PostsSection.css'

const PostsSection = ({ posts, onPostClick }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!posts || posts.length === 0) {
    return (
      <section id="posts" className="section">
        <h2 className="section-title">Posts</h2>
        <div className="loading">Loading posts...</div>
      </section>
    )
  }

  // Group posts by year
  const postsByYear = posts.reduce((acc, post) => {
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
          onClick={hasMoreItems ? () => setIsExpanded(!isExpanded) : undefined}
          role={hasMoreItems ? "button" : undefined}
          tabIndex={hasMoreItems ? 0 : undefined}
          onKeyDown={hasMoreItems ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setIsExpanded(!isExpanded)
            }
          } : undefined}
          aria-label={hasMoreItems ? `Posts section - ${isExpanded ? 'Click to show less' : 'Click to show more'}` : 'Posts section'}
        >
          Posts
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
                    key={post.id} 
                    className={`posts-post-item ${post.type === 'external' ? 'external-link' : ''}`}
                    onClick={() => {
                      if (post.type === 'external' && post.externalUrl) {
                        window.open(post.externalUrl, '_blank', 'noopener,noreferrer')
                      } else if (onPostClick) {
                        onPostClick(post)
                      }
                    }}
                  >
                    <div className="posts-post-date">
                      {formatDate(post.date)}
                    </div>
                    <h4 className="posts-post-title">{post.title}</h4>
                    <p className="posts-post-excerpt">{post.excerpt}</p>
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
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
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
      
      {/* View More Button */}
      {!isExpanded && hasMoreItems && (
        <div className="view-more-container">
          <button 
            onClick={() => setIsExpanded(true)}
            className="view-more-button"
          >
            View More
          </button>
        </div>
      )}
    </section>
  )
}

export default PostsSection
