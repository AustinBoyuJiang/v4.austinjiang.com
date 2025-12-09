import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './Masonry.css';

const useMedia = (queries, values, defaultValue) => {
  const get = () => values[queries.findIndex(q => matchMedia(q).matches)] ?? defaultValue;
  const [value, setValue] = useState(get);
  
  useEffect(() => {
    const handler = () => setValue(get);
    queries.forEach(q => matchMedia(q).addEventListener('change', handler));
    return () => queries.forEach(q => matchMedia(q).removeEventListener('change', handler));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries]);
  
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
      return;
    }
    
    preloadImages(items.map(i => i.img)).then(dimensions => {
      const dimensionsMap = {};
      dimensions.forEach(dim => {
        dimensionsMap[dim.src] = { width: dim.width, height: dim.height };
      });
      setImageDimensions(dimensionsMap);
      setImagesReady(true);
    }).catch(error => {
      console.error('Error preloading images:', error);
      setImagesReady(true); // 即使出错也要设置为ready
    });
  }, [items]);
  
  const grid = useMemo(() => {
    if (!width) return { items: [], height: 0 };
    
    const colHeights = new Array(columns).fill(0);
    const columnWidth = width / columns;
    
    const gridItems = items.map(child => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = columnWidth * col;
      
      let height;
      if (isMobile && imageDimensions[child.img]) {
        // 手机端使用原始宽高比
        const imgDim = imageDimensions[child.img];
        const aspectRatio = imgDim.height / imgDim.width;
        height = columnWidth * aspectRatio;
      } else {
        // 桌面端使用配置的高度
        height = child.height / 2;
      }
      
      const y = colHeights[col];
      colHeights[col] += height;
      
      return { ...child, x, y, w: columnWidth, h: height };
    });
    
    const maxHeight = Math.max(...colHeights);
    
    return { items: gridItems, height: maxHeight };
  }, [columns, items, width, isMobile, imageDimensions]);
  
  const hasMounted = useRef(false);
  const prevColumns = useRef(columns);
  
  useLayoutEffect(() => {
    if (!imagesReady || !width) return;
    
    // 检测是否是列数变化（布局变化）
    const isLayoutChange = prevColumns.current !== columns;
    prevColumns.current = columns;
    
    grid.items.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;
      const element = document.querySelector(selector);
      
      if (!element) return;
      
      const animationProps = {
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h,
        opacity: 1
      };
      
      if (!hasMounted.current || isLayoutChange) {
        // 首次加载或布局变化时的动画
        const initialPos = !hasMounted.current ? getInitialPosition(item, index) : { x: item.x, y: item.y };
        const initialState = {
          opacity: !hasMounted.current ? 0 : 1,
          x: initialPos.x,
          y: initialPos.y,
          width: item.w,
          height: item.h,
          ...(blurToFocus && !hasMounted.current && { filter: 'blur(10px)' })
        };
        
        // 先设置初始状态
        gsap.set(selector, initialState);
        
        // 然后动画到目标状态
        gsap.to(selector, {
          ...animationProps,
          ...(blurToFocus && !hasMounted.current && { filter: 'blur(0px)' }),
          duration: isLayoutChange ? 0.4 : 0.8,
          ease: isLayoutChange ? 'power2.out' : 'power3.out',
          delay: isLayoutChange ? index * 0.02 : index * stagger
        });
      } else {
        // 正常的位置更新动画
        gsap.to(selector, {
          ...animationProps,
          duration: duration,
          ease: ease,
          overwrite: 'auto'
        });
      }
    });
    
    hasMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease, columns, width]);
  
  const handleMouseEnter = (e, item) => {
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
  
  // 确保在图片未准备好时也显示占位符
  const displayItems = imagesReady ? grid.items : (items || []).map((item, index) => ({
    ...item,
    x: 0,
    y: index * 200,
    w: width || 300,
    h: 200
  }));

  if (!items || items.length === 0) {
    return <div ref={containerRef} className="masonry-list" style={{ height: '0px' }}></div>;
  }

  return (
    <div ref={containerRef} className="masonry-list" style={{ height: grid.height + 'px' }}>
      {displayItems.map(item => {
        return (
          <div
            key={item.id}
            data-key={item.id}
            className={`masonry-item-wrapper ${item.url ? 'clickable' : ''}`}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: item.w || 300,
              height: item.h || 200,
              opacity: imagesReady ? undefined : 0.3
            }}
            onClick={item.url ? () => window.open(item.url, '_blank', 'noopener') : undefined}
            onMouseEnter={e => handleMouseEnter(e, item)}
            onMouseLeave={e => handleMouseLeave(e, item)}
          >
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
          </div>
        );
      })}
    </div>
  );
};

export default Masonry;