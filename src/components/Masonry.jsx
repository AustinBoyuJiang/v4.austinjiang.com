import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './Masonry.css';

const useMedia = (queries, values, defaultValue) => {
  const get = () => {
    const index = queries.findIndex(q => matchMedia(q).matches);
    return index !== -1 ? values[index] : defaultValue;
  };
  
  const [value, setValue] = useState(get);
  
  useEffect(() => {
    const handler = () => {
      const newValue = get();
      setValue(newValue);
    };
    
    const mediaQueries = queries.map(q => matchMedia(q));
    mediaQueries.forEach(mq => mq.addEventListener('change', handler));
    
    return () => {
      mediaQueries.forEach(mq => mq.removeEventListener('change', handler));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return value;
};

const useMeasure = () => {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useLayoutEffect(() => {
    if (!ref.current) return;
    
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  
  return [ref, size];
};

const preloadImages = async urls => {
  return await Promise.all(urls.map(src =>
    new Promise(resolve => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve({ src, width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => resolve({ src, width: 400, height: 300 }); // 默认尺寸
    })
  ));
};

const Masonry = ({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  columns: customColumns = null
}) => {
  const defaultColumns = useMedia(
    ['(min-width:1500px)', '(min-width:1200px)', '(min-width:769px)'],
    [5, 4, 2],
    1  // 手机端强制使用单列 (768px以下)
  );
  
  // 检测是否为移动设备
  const isMobile = useMedia(['(max-width: 768px)'], [true], false);
  
  // 如果提供了自定义列数配置，使用自定义的，但在移动端强制使用单列
  const columns = isMobile ? 1 : (customColumns ? (
    typeof customColumns === 'number' ? customColumns : useMedia(
      customColumns.breakpoints || ['(min-width:1500px)', '(min-width:1200px)', '(min-width:769px)'],
      customColumns.values || [5, 4, 2],
      customColumns.default || 1
    )
  ) : defaultColumns);
  
  const [containerRef, { width }] = useMeasure();
  const [imagesReady, setImagesReady] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);
  
  const getInitialPosition = item => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x || 0, y: item.y || 0 };
    
    let direction = animateFrom;
    if (animateFrom === 'random') {
      const directions = ['top', 'bottom', 'left', 'right'];
      direction = directions[Math.floor(Math.random() * directions.length)];
    }
    
    switch (direction) {
      case 'top':
        return { x: item.x || 0, y: -200 };
      case 'bottom':
        return { x: item.x || 0, y: window.innerHeight + 200 };
      case 'left':
        return { x: -200, y: item.y || 0 };
      case 'right':
        return { x: window.innerWidth + 200, y: item.y || 0 };
      case 'center':
        return {
          x: containerRect.width / 2 - (item.w || 300) / 2,
          y: containerRect.height / 2 - (item.h || 200) / 2
        };
      default:
        return { x: item.x || 0, y: (item.y || 0) + 100 };
    }
  };
  
  useEffect(() => {
    if (!items || items.length === 0) {
      setImagesReady(true);
      setIsInitialized(true);
      return;
    }
    
    // 添加延迟确保DOM已经渲染
    const timer = setTimeout(() => {
      preloadImages(items.map(i => i.img)).then(dimensions => {
        const dimensionsMap = {};
        dimensions.forEach(dim => {
          dimensionsMap[dim.src] = { width: dim.width, height: dim.height };
        });
        setImageDimensions(dimensionsMap);
        setImagesReady(true);
        setIsInitialized(true);
      }).catch(error => {
        console.error('Error preloading images:', error);
        setImagesReady(true); // 即使出错也要设置为ready
        setIsInitialized(true);
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [items]);
  
  const prevGrid = useRef({ items: [], height: 0 });
  
  const grid = useMemo(() => {
    // 如果width为0或太小，返回上一次的grid，避免消失
    if (!width || width < 100) {
      return prevGrid.current;
    }
    
    const colHeights = new Array(columns).fill(0);
    const columnWidth = width / columns;
    
    const gridItems = items.map(child => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = columnWidth * col;
      
      let height;
      if (isMobile) {
        // 手机端使用1:1正方形，加上很小的间距
        height = columnWidth + 3; // 正方形 + 0.2rem间距
      } else {
        // 桌面端使用配置的高度
        height = child.height / 2;
      }
      
      const y = colHeights[col];
      colHeights[col] += height;
      
      return { ...child, x, y, w: columnWidth, h: height };
    });
    
    const maxHeight = Math.max(...colHeights);
    const newGrid = { items: gridItems, height: maxHeight };
    
    // 保存当前grid作为备份
    prevGrid.current = newGrid;
    
    return newGrid;
  }, [columns, items, width, isMobile, imageDimensions]);
  
  const hasMounted = useRef(false);
  const prevColumns = useRef(columns);
  const prevWidth = useRef(width);
  
  useLayoutEffect(() => {
    if (!width || grid.items.length === 0 || isMobile) return; // 移动端跳过GSAP布局
    
    grid.items.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;
      
      // 直接设置位置，确保元素始终可见
      gsap.set(selector, {
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h,
        opacity: 1,
        visibility: 'visible'
      });
    });
  }, [grid, width, isMobile]);
  
  const handleMouseEnter = (e, item) => {
    // 在移动端禁用hover效果，使其更像普通markdown图片
    if (isMobile) return;
    
    const element = e.currentTarget;
    const selector = `[data-key="${item.id}"]`;
    
    if (scaleOnHover) {
      gsap.to(selector, {
        scale: hoverScale,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    
    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay');
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0.3,
          duration: 0.3
        });
      }
    }
  };
  
  const handleMouseLeave = (e, item) => {
    // 在移动端禁用hover效果，使其更像普通markdown图片
    if (isMobile) return;
    
    const element = e.currentTarget;
    const selector = `[data-key="${item.id}"]`;
    
    if (scaleOnHover) {
      gsap.to(selector, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    
    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay');
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.3
        });
      }
    }
  };
  
  if (!items || items.length === 0) {
    return <div ref={containerRef} className="masonry-list" style={{ height: '0px' }}></div>;
  }

  // 始终显示所有项目，确保布局变化时不会消失
  const displayItems = (grid.items && grid.items.length > 0) ? grid.items : (items || []).map((item, index) => ({
    ...item,
    x: 0,
    y: index * 200,
    w: width || 300,
    h: 200
  }));

  // 确保容器高度稳定，避免布局变化时高度突然变为0
  const containerHeight = Math.max(grid.height || 200, 200);

  return (
    <div ref={containerRef} className="masonry-list" style={isMobile ? {} : { height: containerHeight + 'px', minHeight: '200px' }}>
      {displayItems.map(item => {
        return (
          <div
            key={item.id}
            data-key={item.id}
            className={`masonry-item-wrapper ${item.url ? 'clickable' : ''}`}
            style={isMobile ? {
              // 移动端不需要定位样式，让CSS处理
            } : {
              position: 'absolute',
              left: 0,
              top: 0,
              width: item.w || 300,
              height: item.h || 200,
              opacity: 1,
              visibility: 'visible',
              transform: 'translate3d(0,0,0)' // 启用硬件加速
            }}
            onClick={item.url ? () => window.open(item.url, '_blank', 'noopener') : undefined}
            onMouseEnter={e => handleMouseEnter(e, item)}
            onMouseLeave={e => handleMouseLeave(e, item)}
          >
            {isMobile ? (
              <img 
                src={item.img} 
                alt="" 
                className="masonry-item-img"
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  borderRadius: '10px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              />
            ) : (
              <div className="masonry-item-img" style={{ backgroundImage: `url(${item.img})` }}>
                {colorShiftOnHover && (
                  <div
                    className="color-overlay"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(45deg, rgba(255,0,150,0.5), rgba(0,150,255,0.5))',
                      opacity: 0,
                      pointerEvents: 'none',
                      borderRadius: '8px'
                    }}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Masonry;