/**
 * Markmap 思维导图组件
 * 基于 markmap.js.org 的开源项目
 * 
 * Copyright (c) 2020 Gerald (markmap 原作者)
 * Licensed under MIT License
 * 
 * 本项目使用 markmap-lib 和 markmap-view 包
 * 源码地址: https://github.com/markmap/markmap
 */

import { useState, useRef, useEffect } from 'react'
import { Transformer } from 'markmap-lib'
import { Markmap } from 'markmap-view'
import * as htmlToImage from 'html-to-image'
import '../Tools.css'

// 默认 Markdown 内容 - 简单结构
const defaultMarkdown = `# 一级标题

## 二级标题

## 二级标题`

// 示例 Markdown 内容 - 完整功能展示
const exampleMarkdown = `---
title: markmap
markmap:
  colorFreezeLevel: 2
---

## Links

- [Website](https://markmap.js.org/)
- [GitHub](https://github.com/gera2ld/markmap)

## Related Projects

- [coc-markmap](https://github.com/gera2ld/coc-markmap) for Neovim
- [markmap-vscode](https://marketplace.visualstudio.com/items?itemName=gera2ld.markmap-vscode) for VSCode
- [eaf-markmap](https://github.com/emacs-eaf/eaf-markmap) for Emacs

## Features

Note that if blocks and lists appear at the same level, the lists will be ignored.

### Lists

- **strong** ~~del~~ *italic* ==highlight==
- \`inline code\`
- [x] checkbox
- Katex: $x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}$ <!-- markmap: fold -->
  - [More Katex Examples](https://markmap.js.org/docs/katex)
- Now we can wrap very very very very long text with the \`maxWidth\` option
- Ordered list
  1. item 1
  2. item 2

### Blocks

\`\`\`js
console.log('hello, JavaScript')
\`\`\`

| Products | Price |
|-|-|
| Apple | 4 |
| Banana | 2 |

![](https://markmap.js.org/favicon.png)
`

function MarkmapViewer() {
  const [markdown, setMarkdown] = useState(defaultMarkdown)
  const svgRef = useRef(null)
  const previewRef = useRef(null)
  const markmapRef = useRef(null)
  const transformerRef = useRef(null)

  // 初始化 Transformer
  useEffect(() => {
    if (!transformerRef.current) {
      transformerRef.current = new Transformer()
    }
  }, [])

  // 加载 Katex CSS
  useEffect(() => {
    // 添加 Katex CSS
    const katexLink = document.createElement('link')
    katexLink.rel = 'stylesheet'
    katexLink.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css'
    document.head.appendChild(katexLink)

    return () => {
      document.head.removeChild(katexLink)
    }
  }, [])

  // 渲染思维导图
  useEffect(() => {
    if (!svgRef.current || !transformerRef.current) return

    // 创建或更新 markmap 实例
    if (!markmapRef.current) {
      markmapRef.current = Markmap.create(svgRef.current)
    }

    // 转换 markdown 为思维导图数据
    const { root } = transformerRef.current.transform(markdown)
    
    // 设置数据并渲染
    markmapRef.current.setData(root)
    
    // 延迟执行 fit，确保内容完全渲染
    setTimeout(() => {
      if (markmapRef.current) {
        markmapRef.current.fit()
      }
    }, 200)
  }, [markdown])

  // 下载 SVG
  const downloadSvg = () => {
    if (!svgRef.current) return
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = 'markmap.svg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // 下载 HTML
  const downloadHtml = () => {
    if (!svgRef.current || !transformerRef.current) return

    const { root } = transformerRef.current.transform(markdown)
    
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Markmap</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html { font-family: ui-sans-serif, system-ui, sans-serif; }
body { width: 100vw; height: 100vh; overflow: hidden; }
#mindmap { display: block; width: 100%; height: 100%; }
</style>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
</head>
<body>
<svg id="mindmap"></svg>
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script src="https://cdn.jsdelivr.net/npm/markmap-view"></script>
<script>
const { Markmap } = markmap;
const svg = document.getElementById('mindmap');
const mm = Markmap.create(svg);
mm.setData(${JSON.stringify(root)});
mm.fit();
</script>
</body>
</html>`

    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = 'markmap.html'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // 下载图像（PNG）- 使用 html-to-image
  const downloadImage = async () => {
    if (!previewRef.current || !markmapRef.current) return

    // 先适应屏幕
    markmapRef.current.fit()

    // 等待渲染完成
    await new Promise(resolve => setTimeout(resolve, 500))

    try {
      const dataUrl = await htmlToImage.toPng(previewRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        skipFonts: true,
        cacheBust: true
      })

      // 下载 PNG
      const link = document.createElement('a')
      link.download = 'markmap.png'
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('下载图像失败:', err)
      alert('下载图像失败')
    }
  }

  // 复制图像到剪贴板 - 使用 html-to-image
  const copyImage = async () => {
    if (!previewRef.current || !markmapRef.current) return

    // 先适应屏幕
    markmapRef.current.fit()

    // 等待渲染完成
    await new Promise(resolve => setTimeout(resolve, 500))

    try {
      const blob = await htmlToImage.toBlob(previewRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        skipFonts: true,
        cacheBust: true
      })

      // 复制到剪贴板
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      alert('图像已复制到剪贴板')
    } catch (err) {
      console.error('复制失败:', err)
      alert('复制失败，请使用下载功能')
    }
  }

  // 适应屏幕
  const fitView = () => {
    if (markmapRef.current) {
      markmapRef.current.fit()
    }
  }

  // 加载示例
  const loadExample = () => {
    setMarkdown(exampleMarkdown)
  }

  return (
    <div className="tool-panel">
      <h2 className="tool-title">Markdown 思维导图</h2>
      <p className="tool-desc">
        基于 <a href="https://markmap.js.org/" target="_blank" rel="noopener noreferrer">markmap</a> 开源项目，
        将 Markdown 文本转换为交互式思维导图。
        <br />
        <small style={{ color: 'rgba(255, 255, 255, 0.4)' }}>MIT License | Copyright (c) 2020 Gerald</small>
      </p>

      <div className="markmap-container" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* 左侧：编辑器 */}
        <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="tool-btn secondary" onClick={fitView}>
              适应屏幕
            </button>
            <button className="tool-btn secondary" onClick={loadExample}>
              加载示例
            </button>
            <button className="tool-btn secondary" onClick={downloadSvg}>
              下载 SVG
            </button>
            <button className="tool-btn secondary" onClick={downloadHtml}>
              下载 HTML
            </button>
            <button className="tool-btn secondary" onClick={downloadImage}>
              下载图像
            </button>
            <button className="tool-btn primary" onClick={copyImage}>
              复制图像
            </button>
          </div>
          
          <textarea
            className="tool-input"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="输入 Markdown 文本..."
            style={{
              flex: 1,
              minHeight: '400px',
              fontFamily: 'monospace',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>

        {/* 右侧：思维导图 */}
        <div 
          ref={previewRef}
          className="markmap-viewer"
          style={{ 
            flex: '1', 
            minWidth: '300px', 
            minHeight: '400px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            overflow: 'hidden',
            background: '#fff'
          }}
        >
          <svg 
            ref={svgRef} 
            style={{ 
              width: '100%', 
              height: '100%',
              minHeight: '400px',
              display: 'block'
            }}
          />
        </div>
      </div>

      <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#fff' }}>使用说明</h3>
        <ul style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', lineHeight: '1.8', paddingLeft: '20px' }}>
          <li>在左侧文本框中输入 Markdown 格式的文本</li>
          <li>标题（#）将作为思维导图的节点</li>
          <li>支持多级标题和列表嵌套</li>
          <li>点击节点可以展开/折叠子节点</li>
          <li>支持拖拽和缩放查看</li>
          <li>可下载 SVG、HTML、PNG 图像</li>
          <li>可复制图像到剪贴板</li>
        </ul>
      </div>
    </div>
  )
}

export default MarkmapViewer
