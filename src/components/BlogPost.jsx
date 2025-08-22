import { useEffect, useState } from 'react'
import './BlogPost.css'
import { useData } from '../hooks/useData'
import { applyTheme, getCurrentTheme } from '../utils/theme'

const BlogPost = ({ post, onBack }) => {
    const { settings } = useData()
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(true)

    // Apply theme when settings are loaded
    useEffect(() => {
        const currentTheme = getCurrentTheme(settings)
        if (currentTheme?.colors) {
            applyTheme(currentTheme.colors)
            
            // Add theme class to body for theme-specific CSS
            document.body.className = document.body.className.replace(/theme-\w+/g, '')
            if (settings?.theme?.current) {
                document.body.classList.add(`theme-${settings.theme.current}`)
            }
        }
    }, [settings])

    useEffect(() => {
        const loadContent = async () => {
            try {
                const response = await fetch(post.markdownFile)
                const markdownContent = await response.text()
                setContent(parseMarkdown(markdownContent))
                setLoading(false)
            } catch (error) {
                console.error('Failed to load blog post:', error)
                setLoading(false)
            }
        }

        if (post) {
            loadContent()
        }
    }, [post])

    const parseMarkdown = (markdown) => {
        // 获取markdown文件的目录路径
        const markdownDir = post.markdownFile.substring(0, post.markdownFile.lastIndexOf('/'))

        let html = markdown
            // 首先处理代码块，避免其内容被其他规则影响
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            // 处理行内代码
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // 处理图片 ![alt](src) - 修复相对路径
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
                // 如果是相对路径（以 ./ 开头），则相对于markdown文件目录
                if (src.startsWith('./')) {
                    src = markdownDir + '/' + src.substring(2)
                }
                // 如果是相对路径（不以 / 或 http 开头），则相对于markdown文件目录
                else if (!src.startsWith('/') && !src.startsWith('http')) {
                    src = markdownDir + '/' + src
                }
                return `<img src="${src}" alt="${alt}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 1.5rem 0; box-shadow: 0 4px 16px var(--shadow-color);" />`
            })
            // 处理横线 ---
            .replace(/^---$/gm, '<hr style="border: none; height: 2px; background: linear-gradient(90deg, transparent 0%, var(--primary-color) 50%, transparent 100%); margin: 2rem 0; opacity: 0.6;" />')
            // 处理标题
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            // 处理粗体和斜体
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // 处理链接 [text](url)
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: var(--primary-color); text-decoration: none;">$1</a>')
            // 处理引用 > text
            .replace(/^> (.*$)/gm, '<blockquote style="border-left: 4px solid var(--primary-color); padding-left: 1.5rem; margin: 1.5rem 0; font-style: italic; color: var(--text-primary); background-color: var(--accent-bg-color); padding: 1rem 1.5rem; border-radius: 0 8px 8px 0;">$1</blockquote>')
            // 处理无序列表
            .replace(/^- (.*$)/gm, '<li>$1</li>')
            // 处理有序列表
            .replace(/^\d+\. (.*$)/gm, '<li class="ordered">$1</li>')

        // 将连续的li包装在ul或ol中
        html = html.replace(/(<li(?! class="ordered")>.*?<\/li>\s*)+/gs, (match) => `<ul>${match}</ul>`)
        html = html.replace(/(<li class="ordered">.*?<\/li>\s*)+/gs, (match) => {
            const cleanMatch = match.replace(/ class="ordered"/g, '')
            return `<ol>${cleanMatch}</ol>`
        })

        // 处理段落
        html = html
            .split('\n\n')
            .map(paragraph => {
                paragraph = paragraph.trim()
                if (!paragraph) return ''

                // 如果已经是HTML标签，不要包装
                if (paragraph.match(/^<(h[1-6]|ul|ol|blockquote|pre|hr|img)/)) {
                    return paragraph
                }

                // 包装成段落
                return `<p>${paragraph}</p>`
            })
            .join('\n')

        return html
    }

    if (loading) {
        return (
            <div className="blog-post-page">
                <div className="container">
                    <div className="loading">Loading blog post...</div>
                </div>
            </div>
        )
    }

    return (
        <>
            {/* Back to Home Button */}
            <div className="back-button-container">
                <button onClick={onBack} className="back-to-home-button">
                    ← Back to Home
                </button>
            </div>

            <div className="blog-post-page">
                <div className="container">
                    <article className="blog-post-full">
                        <header className="blog-post-header">
                            <h1 className="blog-post-full-title">{post.title}</h1>
                            {post.subtitle && (
                                <h2 className="blog-post-subtitle">{post.subtitle}</h2>
                            )}
                            <div className="blog-post-meta">
                                <div className="blog-post-meta-row">
                                    {post.author && (
                                        <span className="blog-post-author">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                            </svg>
                                            {post.author}
                                        </span>
                                    )}
                                    <span className="blog-post-date">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                                        </svg>
                                        {new Date(post.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                    {post.readTime && (
                                        <span className="blog-post-read-time">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
                                            </svg>
                                            {post.readTime}
                                        </span>
                                    )}
                                    <div className="blog-post-tags">
                                        {post.tags.map(tag => (
                                            <span key={tag} className="blog-tag">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </header>
                        <div
                            className="blog-post-content"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </article>
                </div>
            </div>
        </>
    )
}

export default BlogPost