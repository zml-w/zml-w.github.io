import { useState, useRef, useEffect } from 'react'
import { Upload, Download, Minus, Plus } from 'lucide-react'

function ImageAddText() {
  const [image, setImage] = useState(null)
  const [text, setText] = useState('')
  const [textColor, setTextColor] = useState('#ffffff')
  const [bgColor, setBgColor] = useState('#1a1a2e')
  const [barRatio, setBarRatio] = useState(20)
  const [preview, setPreview] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        setImage(img)
        generatePreview(img, text, textColor, bgColor, barRatio)
      }
      img.src = e.target.result
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

  const generatePreview = (img, txt, color, bg, ratio) => {
    const canvas = canvasRef.current
    if (!canvas || !img) return

    // 计算文字区域高度（相对于图像高度的百分比）
    const barH = Math.round(img.height * (ratio / 100))

    // 画布高度 = 图片高度 + 文字区域高度
    canvas.width = img.width
    canvas.height = img.height + barH
    const ctx = canvas.getContext('2d')

    // 绘制原图
    ctx.drawImage(img, 0, 0)

    // 绘制底部纯色区域
    ctx.fillStyle = bg
    ctx.fillRect(0, img.height, img.width, barH)

    // 绘制文字（居中，自动调整大小填满区域）
    if (txt) {
      ctx.fillStyle = color
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // 计算合适的字体大小
      const padding = barH * 0.2 // 20% 内边距
      const maxWidth = img.width * 0.9 // 90% 可用宽度
      let fontSize = barH - padding * 2

      // 使用标准字体，确保支持英文
      ctx.font = `bold ${fontSize}px Arial, sans-serif`
      const metrics = ctx.measureText(txt)
      if (metrics.width > maxWidth) {
        fontSize = fontSize * (maxWidth / metrics.width)
        ctx.font = `bold ${fontSize}px Arial, sans-serif`
      }

      ctx.fillText(txt, img.width / 2, img.height + barH / 2)
    }

    setPreview(canvas.toDataURL('image/png'))
  }

  // 当任何参数变化时更新预览
  useEffect(() => {
    if (image) {
      generatePreview(image, text, textColor, bgColor, barRatio)
    }
  }, [image, text, textColor, bgColor, barRatio])

  const downloadImage = () => {
    if (!preview) return
    const link = document.createElement('a')
    link.download = `image-with-text-${Date.now()}.png`
    link.href = preview
    link.click()
  }

  return (
    <div className="tool-panel">
      <h2 className="tool-title">图像加文字</h2>

      <div className="tool-layout">
        {/* 左侧参数区 */}
        <div className="tool-params">
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

          {image && (
            <>
              <div className="text-controls" style={{ marginTop: 16 }}>
                <div className="control-group">
                  <label className="control-label">文字内容</label>
                  <input
                    type="text"
                    className="tool-input"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="输入要添加的文字"
                  />
                </div>

                <div className="control-row">
                  <div className="control-group">
                    <label className="control-label">文字颜色</label>
                    <div className="color-picker-wrapper">
                      <input
                        type="color"
                        className="color-picker"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                      />
                      <span className="color-value">{textColor}</span>
                    </div>
                  </div>
                  <div className="control-group">
                    <label className="control-label">背景颜色</label>
                    <div className="color-picker-wrapper">
                      <input
                        type="color"
                        className="color-picker"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                      />
                      <span className="color-value">{bgColor}</span>
                    </div>
                  </div>
                </div>

                <div className="control-group">
                  <label className="control-label">区域占比: {barRatio}%</label>
                  <div className="control-inputs">
                    <button
                      className="btn-icon"
                      onClick={() => setBarRatio(Math.max(5, barRatio - 5))}
                      disabled={barRatio <= 5}
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="range"
                      className="tool-slider"
                      min="5"
                      max="50"
                      value={barRatio}
                      onChange={(e) => setBarRatio(parseInt(e.target.value))}
                    />
                    <button
                      className="btn-icon"
                      onClick={() => setBarRatio(Math.min(50, barRatio + 5))}
                      disabled={barRatio >= 50}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="tool-actions" style={{ marginTop: 20 }}>
                <button className="btn btn-primary" onClick={downloadImage}>
                  <Download size={16} />
                  <span>下载图片</span>
                </button>
              </div>
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
            />
          ) : (
            <div className="preview-placeholder">
              <p>上传图片后预览</p>
            </div>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}

export default ImageAddText
