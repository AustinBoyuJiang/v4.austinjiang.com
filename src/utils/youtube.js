export const getYouTubeVideoId = (value) => {
  if (!value) return null

  try {
    const url = new URL(value)
    if (!['https:', 'http:'].includes(url.protocol)) return null

    const hostname = url.hostname.replace(/^www\./, '')
    let videoId

    if (hostname === 'youtu.be') {
      videoId = url.pathname.split('/')[1]
    } else if (['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'].includes(hostname)) {
      videoId = url.pathname === '/watch'
        ? url.searchParams.get('v')
        : url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1]
    }

    return /^[a-zA-Z0-9_-]{11}$/.test(videoId || '') ? videoId : null
  } catch {
    return null
  }
}
