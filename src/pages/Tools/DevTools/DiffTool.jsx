import { useState, useEffect, useRef } from 'react'
import { Upload } from 'lucide-react'
import '../Tools.css'

function DiffTool() {
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [diffResult, setDiffResult] = useState([])
  const [diffStats, setDiffStats] = useState({ added: 0, removed: 0, unchanged: 0 })
  const [dragOver1, setDragOver1] = useState(false)
  const [dragOver2, setDragOver2] = useState(false)
  const fileInputRef1 = useRef(null)
  const fileInputRef2 = useRef(null)

  // 简单的 diff 算法
  const computeDiff = (oldText, newText) => {
    const oldLines = oldText.split('\n')
    const newLines = newText.split('\n')
    const result = []
    let added = 0, removed = 0, unchanged = 0

    // 使用简单的 LCS (最长公共子序列) 算法
    const lcs = findLCS(oldLines, newLines)
    
    let i = 0, j = 0, k = 0
    
    while (i < oldLines.length || j < newLines.length) {
      if (k < lcs.length && oldLines[i] === lcs[k] && newLines[j] === lcs[k]) {
        // 相同行
        result.push({ type: 'same', line: oldLines[i], oldNum: i + 1, newNum: j + 1 })
        i++
        j++
        k++
        unchanged++
      } else if (j < newLines.length && (k >= lcs.length || newLines[j] !== lcs[k])) {
        // 新增行
        result.push({ type: 'add', line: newLines[j], oldNum: null, newNum: j + 1 })
        j++
        added++
      } else if (i < oldLines.length && (k >= lcs.length || oldLines[i] !== lcs[k])) {
        // 删除行
        result.push({ type: 'remove', line: oldLines[i], oldNum: i + 1, newNum: null })
        i++
        removed++
      }
    }

    setDiffResult(result)
    setDiffStats({ added, removed, unchanged })
  }

  // 查找最长公共子序列
  const findLCS = (arr1, arr2) => {
    const m = arr1.length
    const n = arr2.length
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (arr1[i - 1] === arr2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
        }
      }
    }

    // 回溯找出 LCS
    const lcs = []
    let i = m, j = n
    while (i > 0 && j > 0) {
      if (arr1[i - 1] === arr2[j - 1]) {
        lcs.unshift(arr1[i - 1])
        i--
        j--
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--
      } else {
        j--
      }
    }

    return lcs
  }

  useEffect(() => {
    computeDiff(text1, text2)
  }, [text1, text2])

  const clearAll = () => {
    setText1('')
    setText2('')
  }

  // 读取文件内容
  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = (e) => reject(e)
      reader.readAsText(file)
    })
  }

  // 处理文件选择
  const handleFileSelect = async (file, setText) => {
    if (!file) return
    try {
      const content = await readFile(file)
      setText(content)
    } catch (err) {
      alert('读取文件失败')
    }
  }

  // 拖拽处理
  const handleDragOver = (e, setDragOver) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e, setDragOver) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e, setText, setDragOver) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file, setText)
    }
  }

  const loadExample = () => {
    setText1(`function hello() {
  console.log("Hello World");
  return true;
}`)
    setText2(`function hello() {
  console.log("Hello Universe");
  console.log("New line added");
  return false;
}`)
  }

  return (
    <div className="tool-panel">
      <h2 className="tool-title">📊 代码对比</h2>
      <p className="tool-desc">对比两段文本的差异，高亮显示增删改</p>

      <div className="tool-workspace diff-workspace">
        <div className="diff-inputs">
          <div className="diff-input-group">
            <label>
              原文本
              <button
                onClick={() => fileInputRef1.current?.click()}
                className="file-upload-btn"
                title="选择文件"
              >
                <Upload size={14} />
              </button>
            </label>
            <input
              ref={fileInputRef1}
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => handleFileSelect(e.target.files[0], setText1)}
            />
            <div
              className={`diff-drop-zone ${dragOver1 ? 'drag-over' : ''}`}
              onDragOver={(e) => handleDragOver(e, setDragOver1)}
              onDragLeave={(e) => handleDragLeave(e, setDragOver1)}
              onDrop={(e) => handleDrop(e, setText1, setDragOver1)}
            >
              <textarea
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                className="diff-textarea"
                placeholder="输入第一段文本，或拖拽文件到此处..."
              />
              {dragOver1 && <div className="drop-overlay">释放文件以导入</div>}
            </div>
          </div>
          <div className="diff-input-group">
            <label>
              对比文本
              <button
                onClick={() => fileInputRef2.current?.click()}
                className="file-upload-btn"
                title="选择文件"
              >
                <Upload size={14} />
              </button>
            </label>
            <input
              ref={fileInputRef2}
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => handleFileSelect(e.target.files[0], setText2)}
            />
            <div
              className={`diff-drop-zone ${dragOver2 ? 'drag-over' : ''}`}
              onDragOver={(e) => handleDragOver(e, setDragOver2)}
              onDragLeave={(e) => handleDragLeave(e, setDragOver2)}
              onDrop={(e) => handleDrop(e, setText2, setDragOver2)}
            >
              <textarea
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                className="diff-textarea"
                placeholder="输入第二段文本，或拖拽文件到此处..."
              />
              {dragOver2 && <div className="drop-overlay">释放文件以导入</div>}
            </div>
          </div>
        </div>

        <div className="diff-actions">
          <button onClick={loadExample} className="tool-btn secondary">
            加载示例
          </button>
          <button onClick={clearAll} className="tool-btn secondary">
            清空
          </button>
        </div>

        <div className="diff-result">
          <div className="diff-stats">
            <span className="stat added">+ {diffStats.added} 新增</span>
            <span className="stat removed">- {diffStats.removed} 删除</span>
            <span className="stat unchanged">= {diffStats.unchanged} 未变</span>
          </div>
          
          <div className="diff-content">
            {diffResult.length > 0 ? (
              diffResult.map((item, index) => (
                <div key={index} className={`diff-line ${item.type}`}>
                  <span className="line-num old">{item.oldNum || ''}</span>
                  <span className="line-num new">{item.newNum || ''}</span>
                  <span className="line-marker">
                    {item.type === 'add' ? '+' : item.type === 'remove' ? '-' : ' '}
                  </span>
                  <span className="line-content">{item.line}</span>
                </div>
              ))
            ) : (
              <div className="diff-empty">输入文本后自动对比</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiffTool
