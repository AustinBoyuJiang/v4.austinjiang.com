import { useEffect, useState, memo } from 'react'
import { createRoot } from 'react-dom/client'
import './PostPage.css'
import { useData } from '../hooks/useData'
import { applyTheme, getCurrentTheme } from '../utils/theme'
import 'katex/dist/katex.min.css'
import Masonry from './Masonry'
import PixelBlast from './PixelBlast'
import { parseMarkdown } from '../utils/markdown'

// 独立的返回按钮组件，避免影响主内容重新渲染
const BackButton = memo(({ onBack }) => {
    const [isButtonVisible, setIsButtonVisible] = useState(true)

    useEffect(() => {
        let lastScrollY = window.scrollY


        const handleScroll = () => {
            const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
            
            if (currentScrollY <= 50) {
                setIsButtonVisible(true)
            } else if (currentScrollY < lastScrollY) {
                setIsButtonVisible(true)
            } else if (currentScrollY > lastScrollY) {
                setIsButtonVisible(false)
            }
            
            lastScrollY = currentScrollY
        }

        // 移动端触摸滚动处理
        let touchStartY = 0
        const handleTouchStart = (e) => {
            touchStartY = e.touches[0].clientY
        }

        const handleTouchMove = (e) => {
            const touchY = e.touches[0].clientY
            const touchDiff = touchStartY - touchY
            
            if (Math.abs(touchDiff) > 10) { // 最小滑动距离
                if (touchDiff > 0) {
                    // 向上滑动（页面向下滚动）- 隐藏按钮
                    setIsButtonVisible(false)
                } else {
                    // 向下滑动（页面向上滚动）- 显示按钮
                    setIsButtonVisible(true)
                }
                touchStartY = touchY
            }
        }

        // 监听所有可能的滚动事件
        window.addEventListener('scroll', handleScroll, { passive: true })
        document.addEventListener('scroll', handleScroll, { passive: true })
        document.body.addEventListener('scroll', handleScroll, { passive: true })
        
        // 移动端触摸事件
        document.addEventListener('touchstart', handleTouchStart, { passive: true })
        document.addEventListener('touchmove', handleTouchMove, { passive: true })
        
        return () => {
            window.removeEventListener('scroll', handleScroll)
            document.removeEventListener('scroll', handleScroll)
            document.body.removeEventListener('scroll', handleScroll)
            document.removeEventListener('touchstart', handleTouchStart)
            document.removeEventListener('touchmove', handleTouchMove)
        }
    }, [])

    return (
        <div className={`back-button-container ${isButtonVisible ? 'visible' : 'hidden'}`}>
            <button 
                onClick={onBack} 
                className="back-to-home-button"
            >
                <span className="button-icon">←</span>
                Back to Home
            </button>
        </div>
    )
})

const PostPage = ({ post, onBack }) => {
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
                setContent(parseMarkdown(markdownContent, post.markdownFile))
                setLoading(false)
            } catch (error) {
                console.error('Failed to load post:', error)
                setLoading(false)
            }
        }

        if (post) {
            loadContent()
        }
    }, [post])

    // 渲染Masonry组件
    useEffect(() => {
        if (!content) return

        let roots = []

        const timeoutId = setTimeout(() => {
            const masonryElements = document.querySelectorAll('.masonry-component')

            masonryElements.forEach((element) => {
                try {
                    const config = JSON.parse(element.dataset.config)
                    const root = createRoot(element)
                    roots.push(root)
                    
                    root.render(
                        <Masonry
                            items={config.items || []}
                            ease={config.ease || 'power3.out'}
                            duration={config.duration || 0.6}
                            stagger={config.stagger || 0.05}
                            animateFrom={config.animateFrom || 'bottom'}
                            scaleOnHover={config.scaleOnHover !== false}
                            hoverScale={config.hoverScale || 0.95}
                            blurToFocus={config.blurToFocus !== false}
                            colorShiftOnHover={config.colorShiftOnHover || false}
                            columns={config.columns}
                        />
                    )
                } catch (error) {
                    console.error('Failed to render Masonry component:', error)
                }
            })
        }, 100)

        return () => {
            clearTimeout(timeoutId)
            roots.forEach(root => {
                try {
                    root.unmount()
                } catch (error) {
                    console.error('Failed to unmount Masonry component:', error)
                }
            })
        }
    }, [content])

    if (loading) {
        return (
            <div className="posts-post-page">
                <div className="container">
                    <div className="loading">Loading post...</div>
                </div>
            </div>
        )
    }

    return (
        <>


            {/* Back to Home Button */}
            <BackButton onBack={onBack} />

            <div className="posts-post-page">
                <div className="container">
                    <article className="posts-post-full">
                        <header className="posts-post-header">
                            {/* PixelBlast Background for Header */}
                            <div className="posts-header-background">
                                <PixelBlast
                                    variant="circle"
                                    pixelSize={6}
                                    color="#87ceeb"
                                    patternScale={3}
                                    patternDensity={1.2}
                                    pixelSizeJitter={0.5}
                                    enableRipples={true}
                                    rippleSpeed={0.4}
                                    rippleThickness={0.12}
                                    rippleIntensityScale={1.5}
                                    liquid={false}
                                    liquidStrength={0.12}
                                    liquidRadius={1.2}
                                    liquidWobbleSpeed={5}
                                    speed={0.6}
                                    edgeFade={0.25}
                                    transparent={true}
                                    className="posts-pixel-blast"
                                />
                            </div>
                            <h1 className="posts-post-full-title">{post.title}</h1>
                            {post.subtitle && (
                                <h2 className="posts-post-subtitle">{post.subtitle}</h2>
                            )}
                            <div className="posts-post-meta">
                                <div className="posts-post-meta-row">
                                    {post.author && (
                                        <span className="posts-post-author">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                            </svg>
                                            {post.author}
                                        </span>
                                    )}
                                    <span className="posts-post-date">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                                        </svg>
                                        {(() => {
                                            const [year, month, day] = post.date.split('-')
                                            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                                            return `${monthNames[parseInt(month) - 1]} ${parseInt(day)}, ${year}`
                                        })()}
                                    </span>
                                    {post.readTime && (
                                        <span className="posts-post-read-time">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
                                            </svg>
                                            {post.readTime}
                                        </span>
                                    )}
                                    <div className="posts-post-tags">
                                        {post.tags.map(tag => (
                                            <span key={tag} className="posts-tag">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </header>
                        <div
                            className="posts-post-content"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </article>
                </div>
            </div>
        </>
    )
}

export default PostPage
