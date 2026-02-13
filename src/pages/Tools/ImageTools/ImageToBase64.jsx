import { useState, useRef } from 'react'
import { Upload, Copy, Check, Image, FileCode } from 'lucide-react'

function ImageToBase64() {
  const [base64, setBase64] = useState('')
  const [preview, setPreview] = useState('')
  const [copied, setCopied] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [mode, setMode] = useState('image') // 'image' 或 'base64'
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  // 图像转 Base64
  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target.result
      setBase64(result)
      setPreview(result)
      setError('')
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    handleFile(file)
  }

  // Base64 转图像
  const handleBase64Input = (value) => {
    setBase64(value)
    setError('')

    if (!value.trim()) {
      setPreview('')
      return
    }

    // 验证 base64 格式
    const base64Pattern = /^data:image\/[a-zA-Z]+;base64,/
    if (!base64Pattern.test(value)) {
      // 尝试添加 data URI 前缀
      const withPrefix = `data:image/png;base64,${value}`
      setPreview(withPrefix)
    } else {
      setPreview(value)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(base64)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadImage = () => {
    if (!preview) return
    const link = document.createElement('a')
    link.download = 'image_from_base64.png'
    link.href = preview
    link.click()
  }

  return (
    <div className="tool-panel">
      <h2 className="tool-title">图像 ⇄ Base64 互转</h2>

      <div className="tool-layout">
        {/* 左侧参数区 */}
        <div className="tool-params">
          {/* 模式切换 */}
          <div className="mode-switch" style={{ marginBottom: 16 }}>
            <button
              className={`mode-btn ${mode === 'image' ? 'active' : ''}`}
              onClick={() => setMode('image')}
            >
              <Image size={16} />
              <span>图像转 Base64</span>
            </button>
            <button
              className={`mode-btn ${mode === 'base64' ? 'active' : ''}`}
              onClick={() => setMode('base64')}
            >
              <FileCode size={16} />
              <span>Base64 转图像</span>
            </button>
          </div>

          {mode === 'image' ? (
            <>
              <div
                className={`upload-area ${isDragOver ? 'dragover' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="upload-icon">📤</div>
                <p className="upload-text">点击或拖拽图片到此处</p>
                <p className="upload-hint">支持 JPG、PNG、GIF、WebP 格式</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  style={{ display: 'none' }}
                />
              </div>

              {base64 && (
                <>
                  <div className="control-group" style={{ marginTop: 20 }}>
                    <label className="control-label">Base64 编码结果</label>
                    <textarea
                      className="tool-input"
                      value={base64}
                      readOnly
                      rows={8}
                    />
                  </div>
                  <div className="tool-actions">
                    <button className="btn btn-primary" onClick={copyToClipboard}>
                      {copied ? (
                        <>
                          <Check size={16} />
                          <span>已复制</span>
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          <span>复制到剪贴板</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="control-group">
                <label className="control-label">输入 Base64 编码</label>
                <textarea
                  className="tool-input"
                  placeholder="粘贴 Base64 编码，支持带 data:image 前缀或不带前缀"
                  value={base64}
                  onChange={(e) => handleBase64Input(e.target.value)}
                  rows={10}
                />
                {error && <p className="error-text">{error}</p>}
              </div>

              {preview && (
                <div className="tool-actions">
                  <button className="btn btn-primary" onClick={downloadImage}>
                    <Download size={16} />
                    <span>下载图像</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* 右侧预览区 */}
        <div className="tool-preview">
          {preview ? (
            <img
              src={preview}
              alt="预览"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                borderRadius: 8,
                objectFit: 'contain',
              }}
              onError={() => setError('无效的 Base64 编码')}
            />
          ) : (
            <div className="preview-placeholder">
              <p>{mode === 'image' ? '上传图片后预览' : '输入 Base64 后预览'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageToBase64
