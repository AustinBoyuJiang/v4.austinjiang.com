import { useEffect, useRef, useState } from 'react'
import './PublicationsSection.css'

const STATUS_LABELS = {
  preprint: 'Preprint',
  'under-review': 'Under review',
  accepted: 'Accepted',
}

const LINK_ORDER = ['paper', 'arxiv', 'code']
const LINK_LABELS = { paper: 'Paper', arxiv: 'arXiv', code: 'Code' }

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Renders **bold** spans inside short copy such as the TL;DR.
const renderEmphasis = (text) =>
  text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part))

const LinkIcon = ({ type }) => {
  switch (type) {
    case 'project':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      )
    case 'paper':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5M9 13h6M9 17h4" />
        </svg>
      )
    case 'arxiv':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 4l14 16M19 4L5 20" />
        </svg>
      )
    case 'code':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      )
    case 'bibtex':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V6a2 2 0 0 1 2-2h9" />
        </svg>
      )
    case 'check':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      )
    default:
      return null
  }
}

// Muted looping preview: plays only while on screen, poster-only for reduced motion.
const PublicationMedia = ({ publication, href, compact = false }) => {
  const { media = {}, title } = publication
  const videoRef = useRef(null)
  const [reduceMotion] = useState(prefersReducedMotion)
  const showVideo = Boolean(media.video) && !reduceMotion && !compact

  useEffect(() => {
    const video = videoRef.current
    if (!video || !showVideo || !('IntersectionObserver' in window)) return

    let primed = false
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Start from the poster frame so playback picks up without a visible jump.
          if (!primed && media.startAt) video.currentTime = media.startAt
          primed = true
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.35 }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [showVideo, media.startAt])

  if (!media.poster && !media.video) return null

  const content = showVideo ? (
    <video
      ref={videoRef}
      src={media.video}
      poster={media.poster}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
    />
  ) : (
    <img src={media.poster} alt="" loading="lazy" decoding="async" />
  )

  const className = `pub-media ${compact ? 'pub-media--compact' : ''}`

  if (!href) return <div className={className}>{content}</div>

  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${title} — project page`}
    >
      {content}
      {!compact && (
        <span className="pub-media-chip" aria-hidden="true">
          Project page
          <span className="pub-media-chip-arrow">↗</span>
        </span>
      )}
    </a>
  )
}

const PublicationTitle = ({ publication, href }) => {
  const { title, shortName } = publication
  const hasPrefix = shortName && title.startsWith(shortName)
  const inner = hasPrefix ? (
    <>
      <span className="pub-title-short">{shortName}</span>
      {title.slice(shortName.length)}
    </>
  ) : (
    title
  )

  return (
    <h3 className="pub-title">
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {inner}
        </a>
      ) : (
        inner
      )}
    </h3>
  )
}

const Authors = ({ authors = [], selfName }) => (
  <p className="pub-authors">
    {authors.map((author, i) => (
      <span key={author}>
        <span className={author === selfName ? 'pub-author-self' : undefined}>{author}</span>
        {i < authors.length - 1 && ', '}
      </span>
    ))}
  </p>
)

const Meta = ({ publication }) => {
  const { venue, year, status, highlight } = publication
  // With a venue: "CVPR 2026 · Oral". Without one: "Preprint · 2026".
  const items = (venue ? [venue, highlight] : [STATUS_LABELS[status], year]).filter(Boolean)

  return (
    <div className="pub-meta">
      {items.map((item, i) => (
        <span key={item} className={i === 0 ? 'pub-meta-primary' : undefined}>
          {item}
        </span>
      ))}
    </div>
  )
}

const PublicationLinks = ({ publication }) => {
  const { links = {}, bibtex } = publication
  const [copied, setCopied] = useState(false)
  const [showBibtex, setShowBibtex] = useState(false)

  const copyBibtex = async () => {
    try {
      await navigator.clipboard.writeText(bibtex)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setShowBibtex(open => !open)
    }
  }

  return (
    <>
      <div className="pub-links">
        {links.project && (
          <a className="pub-link pub-link--primary" href={links.project} target="_blank" rel="noopener noreferrer">
            <LinkIcon type="project" />
            Project page
          </a>
        )}
        {LINK_ORDER.filter(type => links[type]).map(type => (
          <a key={type} className="pub-link" href={links[type]} target="_blank" rel="noopener noreferrer">
            <LinkIcon type={type} />
            {LINK_LABELS[type]}
          </a>
        ))}
        {bibtex && (
          <button
            type="button"
            className={`pub-link ${copied ? 'is-copied' : ''}`}
            onClick={copyBibtex}
            aria-label={copied ? 'BibTeX copied' : 'Copy BibTeX'}
          >
            <LinkIcon type={copied ? 'check' : 'bibtex'} />
            {copied ? 'Copied' : 'BibTeX'}
          </button>
        )}
      </div>
      {showBibtex && bibtex && <pre className="pub-bibtex">{bibtex}</pre>}
    </>
  )
}

const FeaturedPublication = ({ publication, selfName }) => {
  const href = publication.links?.project
  return (
    <article className="pub-featured">
      <PublicationMedia publication={publication} href={href} />
      <div className="pub-body">
        <Meta publication={publication} />
        <PublicationTitle publication={publication} href={href} />
        <Authors authors={publication.authors} selfName={selfName} />
        {publication.affiliations && <p className="pub-affiliations">{publication.affiliations}</p>}
        {publication.tldr && <p className="pub-tldr">{renderEmphasis(publication.tldr)}</p>}
        <PublicationLinks publication={publication} />
      </div>
    </article>
  )
}

const CompactPublication = ({ publication, selfName }) => {
  const href = publication.links?.project || publication.links?.paper || publication.links?.arxiv
  const hasMedia = Boolean(publication.media?.poster)
  return (
    <article className={`pub-compact ${hasMedia ? '' : 'pub-compact--no-media'}`}>
      {hasMedia && <PublicationMedia publication={publication} href={href} compact />}
      <div className="pub-body">
        <Meta publication={publication} />
        <PublicationTitle publication={publication} href={href} />
        <Authors authors={publication.authors} selfName={selfName} />
        <PublicationLinks publication={publication} />
      </div>
    </article>
  )
}

const VISIBLE_COUNT = 4

const PublicationsSection = ({ publications, selfName }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!publications || publications.length === 0) return null

  const hasMoreItems = publications.length > VISIBLE_COUNT
  const displayed = isExpanded ? publications : publications.slice(0, VISIBLE_COUNT)
  const [featured, ...rest] = displayed
  const toggle = () => setIsExpanded(expanded => !expanded)

  return (
    <section id="publications" className="section">
      <div className="section-header">
        <h2
          className={`section-title ${hasMoreItems ? 'clickable' : ''}`}
          onClick={hasMoreItems ? toggle : undefined}
          role={hasMoreItems ? 'button' : undefined}
          tabIndex={hasMoreItems ? 0 : undefined}
          onKeyDown={hasMoreItems ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              toggle()
            }
          } : undefined}
          aria-label={hasMoreItems ? `Publications section - ${isExpanded ? 'Click to show less' : 'Click to show more'}` : undefined}
        >
          Publications
          {hasMoreItems && <div className={`expand-triangle ${isExpanded ? 'expanded' : ''}`}></div>}
        </h2>
      </div>

      <div className="publications-list">
        <FeaturedPublication publication={featured} selfName={selfName} />
        {rest.length > 0 && (
          <div className="pub-compact-list">
            {rest.map(publication => (
              <CompactPublication key={publication.id} publication={publication} selfName={selfName} />
            ))}
          </div>
        )}
      </div>

      {!isExpanded && hasMoreItems && (
        <div className="view-more-container">
          <button onClick={() => setIsExpanded(true)} className="view-more-button">
            View More
          </button>
        </div>
      )}
    </section>
  )
}

export default PublicationsSection
