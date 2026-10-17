import { useEffect, useRef, useState } from 'react'
import { getYouTubeVideoId } from '../utils/youtube'

const ProjectMedia = ({ project, isPlaying, onPlay, onStop }) => {
  const videoId = getYouTubeVideoId(project.youtube)
  const previewRef = useRef(null)
  const playerRef = useRef(null)
  const [failedSources, setFailedSources] = useState([])
  const videoThumbnail = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null
  const imageSource = [project.image, videoThumbnail].find(source => source && !failedSources.includes(source))

  useEffect(() => {
    if (isPlaying) playerRef.current?.focus({ preventScroll: true })
  }, [isPlaying])

  const stopVideo = () => {
    onStop()
    requestAnimationFrame(() => previewRef.current?.focus({ preventScroll: true }))
  }

  if (videoId && isPlaying) {
    return (
      <div className="project-video-playing">
        <div className="project-image">
          <iframe
            ref={playerRef}
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`}
            title={`${project.title} — video demo`}
            allow="autoplay; encrypted-media; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <div className="project-video-toolbar">
          <a href={project.youtube} target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a>
          <button
            type="button"
            className="project-video-close"
            onClick={stopVideo}
            aria-label={`Close ${project.title} video`}
          >
            Close video
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m6 6 12 12M6 18 18 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  const cover = imageSource ? (
    <img
      src={imageSource}
      alt={videoId ? '' : project.title}
      loading="lazy"
      decoding="async"
      width="800"
      height="450"
      onError={() => setFailedSources(sources => [...sources, imageSource])}
    />
  ) : (
    <span className="project-image-fallback" aria-hidden="true">{project.title}</span>
  )

  if (!videoId) {
    return <div className="project-image">{cover}</div>
  }

  return (
    <button
      type="button"
      ref={previewRef}
      className="project-image project-video-preview"
      onClick={onPlay}
      aria-label={`Play ${project.title} video demo`}
    >
      {cover}
      <span className="project-video-scrim" aria-hidden="true" />
      <span className="project-video-caption" aria-hidden="true">
        <span className="project-video-play">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5.5v13l10-6.5L8 5.5Z" />
          </svg>
        </span>
        <span>Watch demo</span>
      </span>
    </button>
  )
}

export default ProjectMedia
