import { useState, useRef, useEffect } from 'react'
import { Upload, Download, Minus, Plus, Copy, Check } from 'lucide-react'

function ImageWatermark() {
  const [image, setImage] = useState(null)
  const [watermarkText, setWatermarkText] = useState('')
  const [fontSize, setFontSize] = useState(24)
  const [textColor, setTextColor] = useState('#ffffff')
  const [opacity, setOpacity] = useState(0.5)
  const [rotation, setRotation] = useState(-30)
  const [spacing, setSpacing] = useState(100)
  const [randomColor, setRandomColor] = useState(false)
  const [preview, setPreview] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)

  // 生成随机颜色
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

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

  const generatePreview = () => {
    const canvas = canvasRef.current
    const img = image
    const text = watermarkText
    if (!canvas || !img) return

    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')

    ctx.drawImage(img, 0, 0)

    if (text) {
      ctx.save()
      ctx.font = `bold ${fontSize}px Arial, sans-serif`
      ctx.globalAlpha = opacity

      const textWidth = ctx.measureText(text).width
      const diagonal = Math.sqrt(img.width ** 2 + img.height ** 2)
      const repeats = Math.ceil(diagonal / (textWidth + spacing)) + 2

      ctx.translate(img.width / 2, img.height / 2)
      ctx.rotate((rotation * Math.PI) / 180)

      for (let i = -repeats; i < repeats; i++) {
        for (let j = -repeats; j < repeats; j++) {
          const x = i * (textWidth + spacing)
          const y = j * (fontSize + spacing)

          // 如果开启随机颜色，每个位置使用不同颜色
          if (randomColor) {
            // 为每个字符生成随机颜色
            for (let k = 0; k < text.length; k++) {
              ctx.fillStyle = getRandomColor()
              const charWidth = ctx.measureText(text[k]).width
              const prevWidth = k > 0 ? ctx.measureText(text.substring(0, k)).width : 0
              ctx.fillText(text[k], x + prevWidth, y)
            }
          } else {
            ctx.fillStyle = textColor
            ctx.fillText(text, x, y)
          }
        }
      }

      ctx.restore()
    }

    setPreview(canvas.toDataURL('image/png'))
  }

  // 当任何参数变化时更新预览
  useEffect(() => {
    if (image) {
      generatePreview()
    }
  }, [image, watermarkText, fontSize, textColor, opacity, rotation, spacing, randomColor])

  const downloadImage = () => {
    if (!preview) return
    const link = document.createElement('a')
    link.download = `watermarked-${Date.now()}.png`
    link.href = preview
    link.click()
  }

  const copyImage = async () => {
    if (!preview) return
    try {
      const response = await fetch(preview)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      alert('复制失败，请使用下载功能')
    }
  }

  return (
    <div className="tool-panel">
      <h2 className="tool-title">图像加水印</h2>

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
              <div className="watermark-controls" style={{ marginTop: 16 }}>
                <div className="control-group">
                  <label className="control-label">水印文字</label>
                  <input
                    type="text"
                    className="tool-input"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="输入水印文字"
                  />
                </div>

                <div className="control-group">
                  <label className="control-label">字体大小: {fontSize}px</label>
                  <div className="control-inputs">
                    <button
                      className="btn-icon"
                      onClick={() => setFontSize(Math.max(10, fontSize - 5))}
                      disabled={fontSize <= 10}
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="range"
                      className="tool-slider"
                      min="10"
                      max="80"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                    />
                    <button
                      className="btn-icon"
                      onClick={() => setFontSize(Math.min(80, fontSize + 5))}
                      disabled={fontSize >= 80}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
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
                        disabled={randomColor}
                      />
                      <span className="color-value" style={{ opacity: randomColor ? 0.5 : 1 }}>
                        {randomColor ? '随机' : textColor}
                      </span>
                    </div>
                  </div>
                  <div className="control-group">
                    <label className="control-label">随机颜色</label>
                    <div className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        className="tool-checkbox"
                        checked={randomColor}
                        onChange={(e) => setRandomColor(e.target.checked)}
                      />
                      <span className="checkbox-label">每个字符随机颜色</span>
                    </div>
                  </div>
                </div>

                <div className="control-group">
                  <label className="control-label">透明度: {Math.round(opacity * 100)}%</label>
                  <div className="control-inputs">
                    <button
                      className="btn-icon"
                      onClick={() => setOpacity(Math.max(0.1, opacity - 0.1))}
                      disabled={opacity <= 0.1}
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="range"
                      className="tool-slider"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={opacity}
                      onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    />
                    <button
                      className="btn-icon"
                      onClick={() => setOpacity(Math.min(1, opacity + 0.1))}
                      disabled={opacity >= 1}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="control-group">
                  <label className="control-label">旋转角度: {rotation}°</label>
                  <div className="control-inputs">
                    <button
                      className="btn-icon"
                      onClick={() => setRotation(Math.max(-90, rotation - 15))}
                      disabled={rotation <= -90}
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="range"
                      className="tool-slider"
                      min="-90"
                      max="90"
                      value={rotation}
                      onChange={(e) => setRotation(parseInt(e.target.value))}
                    />
                    <button
                      className="btn-icon"
                      onClick={() => setRotation(Math.min(90, rotation + 15))}
                      disabled={rotation >= 90}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="control-group">
                  <label className="control-label">间距: {spacing}px</label>
                  <div className="control-inputs">
                    <button
                      className="btn-icon"
                      onClick={() => setSpacing(Math.max(50, spacing - 25))}
                      disabled={spacing <= 50}
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="range"
                      className="tool-slider"
                      min="50"
                      max="300"
                      value={spacing}
                      onChange={(e) => setSpacing(parseInt(e.target.value))}
                    />
                    <button
                      className="btn-icon"
                      onClick={() => setSpacing(Math.min(300, spacing + 25))}
                      disabled={spacing >= 300}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="tool-actions" style={{ marginTop: 20 }}>
                <button className="btn btn-secondary" onClick={copyImage}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? '已复制' : '复制图像'}</span>
                </button>
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

export default ImageWatermark
