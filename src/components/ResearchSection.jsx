import { useEffect, useRef, useState } from 'react'
import './ResearchSection.css'

const STATUS_LABELS = {
  preprint: 'Preprint',
  'under-review': 'Under review',
  accepted: 'Accepted',
  'technical-report': 'Technical report',
}

const LINK_ORDER = ['paper', 'report', 'arxiv', 'code', 'leaderboard']
const LINK_LABELS = {
  paper: 'Paper',
  report: 'Tech report',
  arxiv: 'arXiv',
  code: 'Code',
  leaderboard: 'Leaderboard',
}

const VISIBLE_COUNT = 3

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Inline markup for short copy: **bold** and [label](url).
const renderInline = (text) =>
  text.split(/(\*\*.+?\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const bold = part.match(/^\*\*(.+)\*\*$/)
    if (bold) return <strong key={i}>{bold[1]}</strong>
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) {
      const external = /^https?:/.test(link[2])
      return (
        <a key={i} href={link[2]} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {link[1]}
        </a>
      )
    }
    return part
  })

// Muted looping preview: plays only while on screen, poster-only for reduced motion.
const EntryMedia = ({ entry, href }) => {
  const { media = {}, title } = entry
  const videoRef = useRef(null)
  const [reduceMotion] = useState(prefersReducedMotion)
  const showVideo = Boolean(media.video) && !reduceMotion

  useEffect(() => {
    const video = videoRef.current
    if (!video || !showVideo || !('IntersectionObserver' in window)) return

    let primed = false
    const observer = new IntersectionObserver(
      ([observed]) => {
        if (observed.isIntersecting) {
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

  if (!href) return <div className="pub-media">{content}</div>

  return (
    <a className="pub-media" href={href} target="_blank" rel="noopener noreferrer" aria-label={`${title} — project page`}>
      {content}
      <span className="pub-media-chip" aria-hidden="true">
        Project page
        <span className="pub-media-chip-arrow">↗</span>
      </span>
    </a>
  )
}

const EntryTitle = ({ entry, href }) => {
  const { title, shortName } = entry
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

const Meta = ({ entry }) => {
  const { venue, year, status, highlight } = entry
  // With a venue: "BEHAVIOR Challenge 2026 · 1st place". Without one: "Preprint · 2026".
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

const EntryLinks = ({ entry }) => {
  const { links = {}, bibtex } = entry
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
            Project page
          </a>
        )}
        {LINK_ORDER.filter(type => links[type]).map(type => (
          <a key={type} className="pub-link" href={links[type]} target="_blank" rel="noopener noreferrer">
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
            {copied ? 'Copied' : 'BibTeX'}
          </button>
        )}
      </div>
      {showBibtex && bibtex && <pre className="pub-bibtex">{bibtex}</pre>}
    </>
  )
}

const ResearchEntry = ({ entry, selfName }) => {
  const href = entry.links?.project
  const hasMedia = Boolean(entry.media?.poster || entry.media?.video)
  return (
    <article className={`pub-entry ${hasMedia ? '' : 'pub-entry--text'}`}>
      {hasMedia && <EntryMedia entry={entry} href={href} />}
      <div className="pub-body">
        <Meta entry={entry} />
        <EntryTitle entry={entry} href={href} />
        <Authors authors={entry.authors} selfName={selfName} />
        {entry.tldr && <p className="pub-tldr">{renderInline(entry.tldr)}</p>}
        <EntryLinks entry={entry} />
      </div>
    </article>
  )
}

const ResearchSection = ({ research, selfName }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const statement = research?.statement || []
  const entries = research?.publications || []
  if (statement.length === 0 && entries.length === 0) return null

  const hasMoreItems = entries.length > VISIBLE_COUNT
  const displayed = isExpanded ? entries : entries.slice(0, VISIBLE_COUNT)
  // Expand or collapse; after collapsing, bring the section heading back into view
  const toggle = () => {
    const collapsing = isExpanded
    setIsExpanded(!isExpanded)
    if (!collapsing) return
    requestAnimationFrame(() => {
      const section = document.getElementById('research')
      if (section && section.getBoundingClientRect().top < 0) {
        const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        section.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
      }
    })
  }

  return (
    <section id="research" className="section">
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
          aria-label={hasMoreItems ? `Research section - ${isExpanded ? 'Click to show less' : 'Click to show more'}` : undefined}
        >
          Research
          {hasMoreItems && <div className={`expand-triangle ${isExpanded ? 'expanded' : ''}`}></div>}
        </h2>
      </div>

      <div className="research-content">
        {statement.length > 0 && (
          <div className="research-statement">
            {statement.map((paragraph, i) => (
              <p key={i}>{renderInline(paragraph)}</p>
            ))}
          </div>
        )}

        {displayed.length > 0 && (
          <div className="pub-list">
            {displayed.map(entry => (
              <ResearchEntry key={entry.id} entry={entry} selfName={selfName} />
            ))}
          </div>
        )}

        {hasMoreItems && (
          <div className="view-more-container">
            <button onClick={toggle} className="view-more-button" aria-expanded={isExpanded}>
              {isExpanded ? 'View Less' : 'View More'}
            </button>
          </div>
        )}

      </div>
    </section>
  )
}

export default ResearchSection
