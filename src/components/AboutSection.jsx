import { useEffect, useState } from 'react'
import 'katex/dist/katex.min.css'
import './PostPage.css'
import './AboutSection.css'
import { parseMarkdown } from '../utils/markdown'

const MARKDOWN_FILE = '/posts/about/about.md'

const AboutSection = () => {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    const loadContent = async () => {
      try {
        const response = await fetch(MARKDOWN_FILE, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Unable to load ${MARKDOWN_FILE}`)
        }

        const markdown = await response.text()
        setContent(parseMarkdown(markdown, MARKDOWN_FILE))
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          console.error('Failed to load About Markdown:', loadError)
          setError(loadError.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadContent()
    return () => controller.abort()
  }, [])

  return (
    <section id="about" className="section about-section">
      {loading && <div className="loading">Loading About content...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && (
        <div
          className="posts-post-content about-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </section>
  )
}

export default AboutSection
