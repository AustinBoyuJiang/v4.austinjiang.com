import { useState, useEffect, useRef } from 'react'
import './AnimeSection.css'

const AnimeSection = ({ anime, isSidebarCollapsed }) => {
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 })
  const [canvasScale, setCanvasScale] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imageLoaded, setImageLoaded] = useState({})
  const [isInitialized, setIsInitialized] = useState(false)
  const canvasRef = useRef(null)



  if (!anime || !anime.items || anime.items.length === 0) {
    return (
      <section id="anime" className="section">
        <h2 className="section-title">Image Gallery</h2>
        <div className="loading">Loading anime...</div>
      </section>
    )
  }

  // Get config and items from new JSON structure
  const config = anime.config || {}
  const canvasConfig = config.canvas || { width: 2000, height: 1500 }
  const titleConfig = config.title || {
    text: "My Favourite Animes",
    x: 1000,
    y: 80,
    fontSize: 2.5,
    rotation: -1,
    color: "#2C3E50"
  }
  const displayedAnime = anime.items

  // Handle image loading to get natural dimensions
  const handleImageLoad = (id, naturalWidth, naturalHeight) => {
    setImageLoaded(prev => ({
      ...prev,
      [id]: { width: naturalWidth, height: naturalHeight }
    }))
  }

  // Canvas dragging functionality
  const handleMouseDown = (e) => {
    // 只有点击画布背景时才开始拖动
    if (e.target === e.currentTarget) {
      e.preventDefault()
      setIsDragging(true)
      setDragStart({
        x: e.clientX - canvasPosition.x,
        y: e.clientY - canvasPosition.y
      })
    }
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return

    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y

    setCanvasPosition({
      x: newX,
      y: newY
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Add global mouse events for dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (!isDragging) return

      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y

      setCanvasPosition({
        x: newX,
        y: newY
      })
    }

    const handleGlobalMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove)
        document.removeEventListener('mouseup', handleGlobalMouseUp)
      }
    }
  }, [isDragging, dragStart.x, dragStart.y])

  // Use positions directly from anime.json
  const getCardPosition = (animeItem) => {
    return {
      x: animeItem.x || 0,
      y: animeItem.y || 0,
      width: animeItem.width || 250,
      height: animeItem.height || 350,
      rotation: animeItem.rotation || 0
    }
  }

  // Handle wheel zoom with mouse-centered scaling
  const handleWheel = (e) => {
    e.preventDefault()

    const viewport = canvasRef.current
    if (!viewport) return

    const rect = viewport.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // 降低缩放敏感度
    const delta = e.deltaY > 0 ? -0.05 : 0.05
    const newScale = Math.max(0.3, Math.min(3, canvasScale + delta))

    if (newScale !== canvasScale) {
      // 计算鼠标在当前缩放画布上的实际位置
      const canvasMouseX = (mouseX - canvasPosition.x) / canvasScale
      const canvasMouseY = (mouseY - canvasPosition.y) / canvasScale

      // 计算新的画布位置，使缩放以鼠标为中心
      const newX = mouseX - canvasMouseX * newScale
      const newY = mouseY - canvasMouseY * newScale

      setCanvasPosition({ x: newX, y: newY })
      setCanvasScale(newScale)
    }
  }

  // Add wheel event listener
  useEffect(() => {
    const viewport = canvasRef.current
    if (viewport) {
      viewport.addEventListener('wheel', handleWheel, { passive: false })
      return () => {
        viewport.removeEventListener('wheel', handleWheel)
      }
    }
  }, [canvasScale, canvasPosition])

  // 初始化画布居中位置和缩放
  useEffect(() => {
    const initializeCanvas = () => {
      const viewport = canvasRef.current
      if (!viewport || !anime?.config?.canvas) return

      const viewportRect = viewport.getBoundingClientRect()

      // 确保视口有实际尺寸
      if (viewportRect.width === 0 || viewportRect.height === 0) {
        setTimeout(initializeCanvas, 50)
        return
      }

      const canvasWidth = anime.config.canvas.width
      const canvasHeight = anime.config.canvas.height

      // 计算初始缩放：让画布宽度比窗口宽度小一点点（留出40px边距）
      const targetWidth = viewportRect.width - 40
      const targetHeight = viewportRect.height - 40

      const scaleByWidth = targetWidth / canvasWidth
      const scaleByHeight = targetHeight / canvasHeight

      // 选择较小的缩放比例，确保画布完全可见
      const initialScale = Math.min(scaleByWidth, scaleByHeight, 1) // 不超过1倍

      // 计算缩放后的画布尺寸
      const scaledCanvasWidth = canvasWidth * initialScale
      const scaledCanvasHeight = canvasHeight * initialScale

      // 计算画布中心对准视口中心的位置
      const centerX = (viewportRect.width / 2) - (scaledCanvasWidth / 2)
      const centerY = (viewportRect.height / 2) - (scaledCanvasHeight / 2)

      console.log('Canvas initialization:', {
        viewportSize: { width: viewportRect.width, height: viewportRect.height },
        canvasSize: { width: canvasWidth, height: canvasHeight },
        initialScale,
        scaledSize: { width: scaledCanvasWidth, height: scaledCanvasHeight },
        centerPosition: { x: centerX, y: centerY }
      })

      setCanvasScale(initialScale)
      setCanvasPosition({ x: centerX, y: centerY })
      setIsInitialized(true)
    }

    if (!isInitialized && anime?.config?.canvas) {
      // 多次尝试确保DOM完全渲染
      setTimeout(initializeCanvas, 100)
      setTimeout(initializeCanvas, 300)
      setTimeout(initializeCanvas, 500)
    }
  }, [anime, isInitialized])

  // 窗口大小变化时重新居中
  useEffect(() => {
    const handleResize = () => {
      setIsInitialized(false)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])



  return (
    <section id="anime" className="section">
      <div className="section-header">
        <h2 className="section-title">
          Image Gallery
        </h2>
      </div>

      <div className="anime-scrapbook-container">
        {/* 窗口界面 */}
        <div className="window-container">
          {/* macOS窗口标题栏 */}
          <div className="macos-titlebar">
            <div className="macos-traffic-lights">
              <div className="traffic-light close"></div>
              <div className="traffic-light minimize"></div>
              <div className="traffic-light maximize"></div>
            </div>
            <div className="macos-title">Anime Collection</div>
          </div>

          {/* 画布视口 */}
          <div
            className="anime-canvas-viewport"
            ref={canvasRef}
          >
            <div
              className={`anime-canvas ${isDragging ? 'dragging' : ''}`}
              style={{
                transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px) scale(${canvasScale})`,
                cursor: isDragging ? 'grabbing' : 'grab',
                width: canvasConfig.width,
                height: canvasConfig.height
              }}
              onMouseDown={handleMouseDown}
            >
              {/* 手写标题 */}
              <div
                className="handwritten-title"
                style={{
                  left: titleConfig.x,
                  top: titleConfig.y,
                  fontSize: `${titleConfig.fontSize}rem`,
                  transform: `translate(-50%, -50%) rotate(${titleConfig.rotation}deg)`,
                  color: titleConfig.color,
                  whiteSpace: 'nowrap'
                }}
              >
                {titleConfig.text}
              </div>

              {displayedAnime.map((animeItem, index) => {
                const position = getCardPosition(animeItem)

                return (
                  <div
                    key={index}
                    className="anime-card-absolute"
                    style={{
                      left: position.x,
                      top: position.y,
                      width: position.width,
                      height: position.height,
                      transform: `rotate(${position.rotation}deg)`
                    }}
                  >
                    <div className="anime-card-inner">
                      <div className="tape-decoration tape-top-left"></div>
                      <div className="tape-decoration tape-top-right"></div>
                      <div className="tape-decoration tape-bottom-left"></div>
                      <img
                        src={animeItem.image}
                        alt={animeItem.name}
                        className="anime-image"
                        onLoad={(e) => {
                          handleImageLoad(index, e.target.naturalWidth, e.target.naturalHeight)
                        }}
                        onError={(e) => {
                          e.target.src = '/images/placeholder-anime.svg'
                        }}
                      />
                      <div className="anime-hover-overlay">
                        <div className="anime-title-hover">
                          <h3 className="anime-title">{animeItem.name}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AnimeSection