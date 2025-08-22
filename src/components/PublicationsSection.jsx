import { useState } from 'react'
import './PublicationsSection.css'

const PublicationsSection = ({ publications }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!publications || publications.length === 0) {
    return (
      <section id="publications" className="section">
        <h2 className="section-title">Publications</h2>
        <div className="loading">Loading publications...</div>
      </section>
    )
  }

  const displayedPublications = isExpanded ? publications : publications.slice(0, 3)
  const hasMoreItems = publications.length > 3

  return (
    <section id="publications" className="section">
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
          aria-label={hasMoreItems ? `Publications section - ${isExpanded ? 'Click to show less' : 'Click to show more'}` : 'Publications section'}
        >
          Publications
          {hasMoreItems && (
            <div className={`expand-triangle ${isExpanded ? 'expanded' : ''}`}></div>
          )}
        </h2>
      </div>
      <div className="publications-list">
        {displayedPublications.map(publication => (
          <div key={publication.id} className="publication-item">
            <h3 className="publication-title">{publication.title}</h3>
            <p className="publication-details">{publication.details}</p>
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
            View More Publications
          </button>
        </div>
      )}
    </section>
  )
}

export default PublicationsSection