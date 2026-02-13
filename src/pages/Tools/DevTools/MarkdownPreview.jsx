import { useState } from 'react'
import '../Tools.css'

function MarkdownPreview() {
  const [markdown, setMarkdown] = useState(`# 开始创作吧`)

  // 改进的 Markdown 解析器
  const parseMarkdown = (text) => {
    // 先处理块级数学公式（多行）
    text = text.replace(/\$\$\n?([\s\S]*?)\n?\$\$/g, '<div class="math-block">$1</div>')

    // 将文本按行分割
    const lines = text.split('\n')
    const result = []
    let i = 0

    while (i < lines.length) {
      const line = lines[i]

      // 跳过已处理的数学公式行
      if (line.includes('<div class="math-block">') || line.includes('</div>')) {
        if (line.includes('<div class="math-block">')) {
          result.push(line)
        }
        i++
        continue
      }

      // 代码块
      if (line.startsWith('```')) {
        const lang = line.slice(3).trim()
        i++
        const codeLines = []
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i])
          i++
        }
        const code = escapeHtml(codeLines.join('\n'))
        result.push(`<pre><code${lang ? ` class="language-${lang}"` : ''}>${code}</code></pre>`)
        i++
        continue
      }

      // 引用块
      if (line.startsWith('>')) {
        const quoteLines = []
        while (i < lines.length && lines[i].startsWith('>')) {
          quoteLines.push(lines[i].slice(1).trim())
          i++
        }
        const content = parseInline(quoteLines.join('\n'))
        result.push(`<blockquote>${content}</blockquote>`)
        continue
      }

      // 表格
      if (line.includes('|') && i + 1 < lines.length && lines[i + 1].includes('|') && lines[i + 1].includes('-')) {
        const tableResult = parseTable(lines, i)
        result.push(tableResult.html)
        i = tableResult.nextIndex
        continue
      }

      // 任务列表（必须在无序列表之前检测）
      if (line.match(/^\s*-\s*\[[xX ]\]\s/)) {
        const listResult = parseTaskList(lines, i)
        result.push(listResult.html)
        i = listResult.nextIndex
        continue
      }

      // 无序列表
      if (line.match(/^\s*[-*+]\s/)) {
        const listResult = parseList(lines, i, 'ul')
        result.push(listResult.html)
        i = listResult.nextIndex
        continue
      }

      // 有序列表
      if (line.match(/^\s*\d+\.\s/)) {
        const listResult = parseList(lines, i, 'ol')
        result.push(listResult.html)
        i = listResult.nextIndex
        continue
      }

      // 标题
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/)
      if (headerMatch) {
        const level = headerMatch[1].length
        const content = parseInline(headerMatch[2])
        result.push(`<h${level}>${content}</h${level}>`)
        i++
        continue
      }

      // 分隔线
      if (line.match(/^(-{3,}|\*{3,}|_{3,})$/)) {
        result.push('<hr>')
        i++
        continue
      }

      // 空行
      if (line.trim() === '') {
        i++
        continue
      }

      // 普通段落
      const content = parseInline(line)
      result.push(`<p>${content}</p>`)
      i++
    }

    return result.join('\n')
  }

  // 解析行内元素
  const parseInline = (text) => {
    let html = escapeHtml(text)

    // 数学公式（行内）- 块级公式已经在 parseMarkdown 中处理
    html = html.replace(/\$([^$]+)\$/g, '<span class="math-inline">$1</span>')

    // 代码
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

    // 粗体和斜体（先处理三者的组合）
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>')
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>')
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
    html = html.replace(/_(.+?)_/g, '<em>$1</em>')

    // 删除线
    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>')

    // 高亮
    html = html.replace(/==(.+?)==/g, '<mark>$1</mark>')

    // 图片（先处理图片再处理链接，避免冲突）
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')

    // 链接
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

    return html
  }

  // 解析表格
  const parseTable = (lines, startIndex) => {
    const headerLine = lines[startIndex]
    const separatorLine = lines[startIndex + 1]
    
    const headers = headerLine.split('|').map(h => h.trim()).filter(h => h)
    
    let i = startIndex + 2
    const rows = []
    while (i < lines.length && lines[i].includes('|')) {
      const cells = lines[i].split('|').map(c => c.trim()).filter(c => c)
      rows.push(cells)
      i++
    }

    let html = '<table><thead><tr>'
    headers.forEach(h => {
      html += `<th>${parseInline(h)}</th>`
    })
    html += '</tr></thead><tbody>'
    
    rows.forEach(row => {
      html += '<tr>'
      row.forEach(cell => {
        html += `<td>${parseInline(cell)}</td>`
      })
      html += '</tr>'
    })
    html += '</tbody></table>'

    return { html, nextIndex: i }
  }

  // 解析列表
  const parseList = (lines, startIndex, type) => {
    const items = []
    let i = startIndex
    const baseIndent = lines[startIndex].match(/^(\s*)/)[1].length

    while (i < lines.length) {
      const line = lines[i]
      const match = line.match(/^(\s*)(?:[-*+]|\d+\.)\s+(.+)$/)
      
      if (!match) break
      
      const indent = match[1].length
      if (indent < baseIndent) break

      let content = match[2]
      i++

      // 收集多行内容（缩进的行，但不是列表项）
      while (i < lines.length) {
        const nextLine = lines[i]
        if (nextLine.trim() === '') {
          i++
          continue
        }
        const nextIndent = nextLine.match(/^(\s*)/)[1].length
        // 如果是列表项（无序或有序），停止收集内容
        if (nextLine.match(/^\s*(?:[-*+]|\d+\.)\s/)) {
          break
        }
        if (nextIndent > indent) {
          content += '\n' + nextLine.trim()
          i++
        } else {
          break
        }
      }

      // 检查是否有嵌套列表
      let nestedHtml = ''
      while (i < lines.length) {
        const nextLine = lines[i]
        const nestedMatch = nextLine.match(/^(\s*)(?:[-*+]|\d+\.)\s/)
        if (nestedMatch && nestedMatch[1].length > indent) {
          const nestedType = nextLine.match(/^\s*\d+\./) ? 'ol' : 'ul'
          const nestedResult = parseList(lines, i, nestedType)
          nestedHtml += nestedResult.html
          i = nestedResult.nextIndex
        } else {
          break
        }
      }

      const parsedContent = parseInline(content)
      items.push(`<li>${parsedContent}${nestedHtml}</li>`)
    }

    return { html: `<${type}>${items.join('')}</${type}>`, nextIndex: i }
  }

  // 解析任务列表
  const parseTaskList = (lines, startIndex) => {
    const items = []
    let i = startIndex
    const baseIndent = lines[startIndex].match(/^(\s*)/)[1].length

    while (i < lines.length) {
      const line = lines[i]
      const match = line.match(/^(\s*)-\s*\[([xX ])\]\s*(.+)$/)
      
      if (!match) break
      
      const indent = match[1].length
      if (indent < baseIndent) break

      const isChecked = match[2].toLowerCase() === 'x'
      let content = match[3]
      i++

      // 收集多行内容
      while (i < lines.length) {
        const nextLine = lines[i]
        if (nextLine.trim() === '') {
          i++
          continue
        }
        const nextIndent = nextLine.match(/^(\s*)/)[1].length
        if (nextIndent > indent) {
          content += '\n' + nextLine.trim()
          i++
        } else {
          break
        }
      }

      const checkbox = isChecked ? '☑' : '☐'
      const className = isChecked ? 'task-checked' : 'task-unchecked'
      items.push(`<li class="${className}">${checkbox} ${parseInline(content)}</li>`)
    }

    return { html: `<ul class="task-list">${items.join('')}</ul>`, nextIndex: i }
  }

  // HTML 转义
  const escapeHtml = (text) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }

  const clearAll = () => setMarkdown('')

  const loadExample = () => {
    setMarkdown(`# 欢迎使用 Markdown 预览

## 这是一个示例文档

### 文本样式

**粗体文本** 和 *斜体文本*

~~删除线~~ 和 ==高亮文本==

### 列表

无序列表：
- 项目 1
- 项目 2
  - 子项目 2.1
  - 子项目 2.2
- 项目 3

有序列表：
1. 第一步
2. 第二步
3. 第三步

### 链接和图片

[访问 GitHub](https://github.com)

![GitHub](https://github.com/fluidicon.png)

### 代码

行内代码：\`console.log('Hello')\`

代码块：
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

greet('World');
\`\`\`

### 表格

| 姓名 | 年龄 | 城市 |
|------|------|------|
| 张三 | 25 | 北京 |
| 李四 | 30 | 上海 |
| 王五 | 28 | 广州 |

### 引用

> 这是一段引用文本。
> 可以有多行。

### 分隔线

---

### 任务列表

- [x] 已完成任务
- [ ] 未完成任务
- [x] 另一个已完成任务

### 数学公式

行内公式：$E = mc^2$

块级公式：
$$
\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n
$$
`)
  }

  return (
    <div className="tool-panel">
      <h2 className="tool-title">📝 Markdown 预览</h2>
      <p className="tool-desc">实时预览 Markdown 渲染效果，支持常用语法</p>

      <div className="tool-workspace markdown-workspace">
        <div className="markdown-toolbar">
          <button onClick={loadExample} className="tool-btn secondary small">
            加载示例
          </button>
          <button onClick={clearAll} className="tool-btn secondary small">
            清空
          </button>
        </div>

        <div className="markdown-editor">
          <div className="markdown-input-section">
            <label>Markdown 源码</label>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="在此输入 Markdown..."
              className="markdown-textarea"
            />
          </div>

          <div className="markdown-preview-section">
            <label>预览效果</label>
            <div 
              className="markdown-preview-content"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarkdownPreview
