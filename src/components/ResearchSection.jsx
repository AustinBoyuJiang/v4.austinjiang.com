import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
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

// The list shows about two entries at a time and scrolls inside itself after
// that, with a short peek of the next entry so it reads as scrollable.
const WINDOW_ENTRIES = 2
const PEEK_PX = 36
// Pixels per line for wheels that report in lines (Firefox with some mice)
const LINE_PX = 32
// A flick carried on into the page keeps this share of its speed each millisecond,
// as on iOS, and stops below FLING_MIN_SPEED (px per ms).
const FLING_FRICTION = 0.998
const FLING_MIN_SPEED = 0.02

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

// What actually scrolls the page: the window on wide screens, but <body> in the
// narrow layout, where html and body are pinned to the viewport height.
const pageScroller = (el) => {
  for (let node = el.parentElement; node && node !== document.documentElement; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node)
    if (/auto|scroll|overlay/.test(overflowY) && node.scrollHeight > node.clientHeight + 1) return node
  }
  return document.scrollingElement || document.documentElement
}

// Keep a flick going on the page, slowing it the way a native one does. Any new
// touch or wheel stops it, as does the returned function.
const flingPage = (scroller, velocity) => {
  let frame = 0
  let last = performance.now()
  let pos = scroller.scrollTop
  const stop = () => {
    cancelAnimationFrame(frame)
    window.removeEventListener('touchstart', stop)
    window.removeEventListener('wheel', stop)
  }
  const step = (now) => {
    // A frame's timestamp can be a touch older than performance.now() above
    const dt = Math.max(0, Math.min(now - last, 32))
    last = now
    velocity *= FLING_FRICTION ** dt
    pos += velocity * dt
    scroller.scrollTop = pos
    // Done once it has all but stopped, or the page can't go any further
    if (Math.abs(velocity) < FLING_MIN_SPEED || Math.abs(scroller.scrollTop - pos) > 1) return stop()
    frame = requestAnimationFrame(step)
  }
  window.addEventListener('touchstart', stop, { passive: true })
  window.addEventListener('wheel', stop, { passive: true })
  frame = requestAnimationFrame(step)
  return stop
}

const useScrollWindow = (count) => {
  const listRef = useRef(null)
  const [scrollable, setScrollable] = useState(false)
  const [edges, setEdges] = useState({ atStart: true, atEnd: false })

  const updateEdges = useCallback(() => {
    const list = listRef.current
    if (!list) return
    const atStart = list.scrollTop <= 1
    const atEnd = list.scrollTop + list.clientHeight >= list.scrollHeight - 1
    setEdges(prev => (prev.atStart === atStart && prev.atEnd === atEnd ? prev : { atStart, atEnd }))
  }, [])

  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return

    const measure = () => {
      const entries = list.children
      if (entries.length <= WINDOW_ENTRIES) {
        list.style.removeProperty('--pub-window')
        setScrollable(false)
        return
      }
      // Up to the top of the next entry's content, plus a short peek of it
      const next = entries[WINDOW_ENTRIES]
      const padTop = parseFloat(getComputedStyle(next).paddingTop) || 0
      list.style.setProperty('--pub-window', `${Math.round(next.offsetTop + padTop + PEEK_PX)}px`)
      setScrollable(true)
      updateEdges()
    }

    measure()
    if (!('ResizeObserver' in window)) return
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    Array.from(list.children).forEach(child => observer.observe(child))
    return () => observer.disconnect()
  }, [count, updateEdges])

  useScrollHandoff(listRef, scrollable)

  return { listRef, scrollable, edges, updateEdges }
}

// Browsers lock a scroll gesture to the scroller it started in, so once the list hits
// its top or bottom the rest of a wheel, trackpad or finger gesture went nowhere until
// the hand stopped. Pass whatever the list can't use on to the page instead.
const useScrollHandoff = (listRef, enabled) => {
  useEffect(() => {
    const list = listRef.current
    if (!list || !enabled) return

    // Whether the list can't move any further in the direction of a signed delta
    const atEdge = (delta) =>
      delta > 0 ? list.scrollTop >= list.scrollHeight - list.clientHeight - 1 : list.scrollTop <= 1

    let stopFling = null
    const fling = (velocity) => {
      stopFling?.()
      stopFling = Math.abs(velocity) >= FLING_MIN_SPEED ? flingPage(pageScroller(list), velocity) : null
    }

    // Touch only where CSS keeps the browser from passing a swipe to the page by
    // itself (overscroll-behavior: none on touch screens), so the page never moves
    // twice. Elsewhere the browser's own behaviour is left alone.
    let touch = null
    // The list still gliding after a flick, watched in case it runs out of room
    let coast = null

    const onTouchStart = (event) => {
      coast = null
      const point = event.touches[0]
      touch =
        event.touches.length === 1 && getComputedStyle(list).overscrollBehaviorY === 'none'
          ? {
              x0: point.clientX, y0: point.clientY, y: point.clientY, t: event.timeStamp,
              axis: null, velocity: 0, finger: 0, listStart: list.scrollTop, paged: 0,
            }
          : null
    }

    const onTouchMove = (event) => {
      if (!touch || event.touches.length !== 1) return
      const { clientX, clientY } = event.touches[0]
      if (!touch.axis) {
        const dx = Math.abs(clientX - touch.x0)
        const dy = Math.abs(clientY - touch.y0)
        if (dx + dy < 6) return
        touch.axis = dx > dy ? 'x' : 'y'
      }
      if (touch.axis !== 'y') return

      // Finger up scrolls content down: positive, like a wheel's deltaY
      const delta = touch.y - clientY
      const dt = event.timeStamp - touch.t
      touch.y = clientY
      touch.t = event.timeStamp
      touch.finger += delta
      if (dt > 0) touch.velocity = 0.8 * (delta / dt) + 0.2 * touch.velocity

      // The browser scrolls the list on its own thread, so this can run before or
      // after it has. Settle up only at the list's edge, and settle the running
      // total: whatever the finger moved that neither the list nor the page took.
      if (!delta || !atEdge(delta)) return
      const owed = touch.finger - (list.scrollTop - touch.listStart) - touch.paged
      if (owed * delta <= 0) return
      pageScroller(list).scrollTop += owed
      touch.paged += owed
    }

    const onTouchEnd = (event) => {
      if (!touch || event.touches.length) return
      // A finger that rested before lifting isn't a flick
      const velocity = event.timeStamp - touch.t > 100 ? 0 : touch.velocity
      touch = null
      if (!velocity) return
      if (atEdge(velocity)) fling(velocity)
      else coast = { top: list.scrollTop, t: performance.now(), velocity }
    }

    const onTouchCancel = () => {
      touch = null
    }

    // A flick inside the list that glides into its edge carries on into the page
    const onScroll = () => {
      if (!coast || touch) return
      const now = performance.now()
      const dt = now - coast.t
      if (dt > 200) {
        coast = null // the glide ended short of the edge
        return
      }
      if (atEdge(coast.velocity)) {
        fling(coast.velocity)
        coast = null
        return
      }
      if (dt > 0) coast.velocity = 0.7 * ((list.scrollTop - coast.top) / dt) + 0.3 * coast.velocity
      coast.top = list.scrollTop
      coast.t = now
    }

    const onWheel = (event) => {
      coast = null
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
      const unit = event.deltaMode === 1 ? LINE_PX : event.deltaMode === 2 ? list.clientHeight : 1
      const delta = event.deltaY * unit
      // How far the list itself can still move this way (signed, like delta)
      const room = delta > 0 ? list.scrollHeight - list.clientHeight - list.scrollTop : -list.scrollTop
      const leftover = delta > 0 ? Math.max(0, delta - room) : Math.min(0, delta - room)
      if (Math.abs(leftover) < 1) return

      // Move both scrollers ourselves when the browser lets us, so the page never
      // gets the leftover twice. Later events in a gesture can't be cancelled; the
      // browser then scrolls only the list, and the page still gets the rest here.
      if (event.cancelable) {
        event.preventDefault()
        list.scrollTop += room
      }
      pageScroller(list).scrollTop += leftover
    }

    const listeners = [
      ['wheel', onWheel, { passive: false }],
      ['touchstart', onTouchStart, { passive: true }],
      ['touchmove', onTouchMove, { passive: true }],
      ['touchend', onTouchEnd, { passive: true }],
      ['touchcancel', onTouchCancel, { passive: true }],
      ['scroll', onScroll, { passive: true }],
    ]
    listeners.forEach(([type, handler, options]) => list.addEventListener(type, handler, options))
    return () => {
      listeners.forEach(([type, handler]) => list.removeEventListener(type, handler))
      stopFling?.()
    }
  }, [listRef, enabled])
}

const ResearchSection = ({ research, selfName }) => {
  const statement = research?.statement || []
  const entries = research?.publications || []
  const { listRef, scrollable, edges, updateEdges } = useScrollWindow(entries.length)
  if (statement.length === 0 && entries.length === 0) return null

  return (
    <section id="research" className="section">
      <div className="section-header">
        <h2 className="section-title">Research</h2>
      </div>

      <div className="research-content">
        {statement.length > 0 && (
          <div className="research-statement">
            {statement.map((paragraph, i) => (
              <p key={i}>{renderInline(paragraph)}</p>
            ))}
          </div>
        )}

        {entries.length > 0 && (
          <div
            ref={listRef}
            className={[
              'pub-list',
              scrollable && 'is-scrollable',
              scrollable && !edges.atStart && 'is-scrolled',
              scrollable && edges.atEnd && 'is-at-end',
            ].filter(Boolean).join(' ')}
            onScroll={scrollable ? updateEdges : undefined}
            {...(scrollable ? { tabIndex: 0, role: 'region', 'aria-label': 'Research projects' } : {})}
          >
            {entries.map(entry => (
              <ResearchEntry key={entry.id} entry={entry} selfName={selfName} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ResearchSection
