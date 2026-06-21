import katex from 'katex'

export const parseMarkdown = (markdown, markdownFile) => {
  const markdownDir = markdownFile.substring(0, markdownFile.lastIndexOf('/'))

  let html = markdown
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`$]+)`/g, '<code>$1</code>')
    .replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
      try {
        return katex.renderToString(formula.trim(), {
          displayMode: true,
          throwOnError: false
        })
      } catch (error) {
        console.error('KaTeX render error:', error)
        return `<div class="math-error">Math render error: ${formula}</div>`
      }
    })
    .replace(/\$([^$\n]+)\$/g, (match, formula) => {
      try {
        return katex.renderToString(formula.trim(), {
          displayMode: false,
          throwOnError: false
        })
      } catch (error) {
        console.error('KaTeX render error:', error)
        return `<span class="math-error">Math render error: ${formula}</span>`
      }
    })
    .replace(/<img\s+([^>]*?)src=["']([^"']+)["']([^>]*?)>/g, (match, beforeSrc, src, afterSrc) => {
      if (src.startsWith('./')) {
        src = `${markdownDir}/${src.substring(2)}`
      } else if (!src.startsWith('/') && !src.startsWith('http')) {
        src = `${markdownDir}/${src}`
      }

      const allAttrs = beforeSrc + afterSrc
      const altMatch = allAttrs.match(/alt=["']([^"']*)["']/)
      const widthMatch = allAttrs.match(/width=["']?([^"'\s>]+)["']?/)
      const styleMatch = allAttrs.match(/style=["']([^"']*)["']/)
      const alt = altMatch ? altMatch[1] : ''
      let style = 'max-width: 100%; height: auto; border-radius: 8px; margin: 1.5rem auto; display: block;'

      if (widthMatch) {
        style = `max-width: min(${widthMatch[1]}px, 100%); height: auto; border-radius: 8px; margin: 1.5rem auto; display: block;`
      }

      if (styleMatch) {
        style = `${style} ${styleMatch[1]}`
      }

      return `<img src="${src}" alt="${alt}" style="${style}" />`
    })
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
      if (src.startsWith('./')) {
        src = `${markdownDir}/${src.substring(2)}`
      } else if (!src.startsWith('/') && !src.startsWith('http')) {
        src = `${markdownDir}/${src}`
      }

      return `<img src="${src}" alt="${alt}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 1.5rem auto; display: block;" />`
    })
    .replace(/^---$/gm, '<hr />')
    .replace(/:::masonry\s*([\s\S]*?)\s*:::/g, (match, configStr) => {
      try {
        const config = JSON.parse(configStr.trim())

        if (config.items) {
          config.items = config.items.map(item => {
            if (item.img && item.img.startsWith('./')) {
              item.img = `${markdownDir}/${item.img.substring(2)}`
            } else if (item.img && !item.img.startsWith('/') && !item.img.startsWith('http')) {
              item.img = `${markdownDir}/${item.img}`
            }
            return item
          })
        }

        const componentId = `masonry-${Math.random().toString(36).substring(2, 11)}`
        return `<div id="${componentId}" class="masonry-component" data-config='${JSON.stringify(config)}'></div>`
      } catch (error) {
        console.error('Masonry config parse error:', error)
        return `<div class="error">Invalid Masonry configuration: ${error.message}</div>`
      }
    })
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: var(--primary-color); text-decoration: none;">$1</a>')
    .replace(/^> (.*$)/gm, '<blockquote style="border-left: 4px solid var(--primary-color); padding-left: 1.5rem; margin: 1.5rem 0; font-style: italic; color: var(--text-primary); background-color: var(--accent-bg-color); padding: 1rem 1.5rem; border-radius: 0 8px 8px 0;">$1</blockquote>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li class="ordered">$1</li>')

  html = html.replace(/(<li(?! class="ordered")>.*?<\/li>\s*)+/gs, match => `<ul>${match}</ul>`)
  html = html.replace(/(<li class="ordered">.*?<\/li>\s*)+/gs, match => {
    const cleanMatch = match.replace(/ class="ordered"/g, '')
    return `<ol>${cleanMatch}</ol>`
  })

  return html
    .split(/\n\s*\n/)
    .map(paragraph => {
      paragraph = paragraph.trim()
      if (!paragraph) return ''

      if (paragraph.match(/^<(h[1-6]|ul|ol|blockquote|pre|hr|img|div)/)) {
        return paragraph
      }

      paragraph = paragraph
        .replace(/ {2}\n/g, '<br>')
        .replace(/\n/g, ' ')

      return `<p>${paragraph}</p>`
    })
    .filter(Boolean)
    .join('\n\n')
}
