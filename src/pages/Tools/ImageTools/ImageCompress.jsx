import { useState, useRef } from 'react'
import { Upload, Download, Minus, Plus, Copy, Check } from 'lucide-react'

function ImageCompress() {
  const [originalImage, setOriginalImage] = useState(null)
  const [compressedImage, setCompressedImage] = useState(null)
  const [quality, setQuality] = useState(0.8)
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }

    setOriginalSize(file.size)
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        setOriginalImage(img)
        compressImage(img, quality)
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

  const compressImage = (img, q) => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)

    const compressedDataUrl = canvas.toDataURL('image/jpeg', q)
    setCompressedImage(compressedDataUrl)

    // 计算压缩后大小
    const base64Length = compressedDataUrl.split(',')[1].length
    const sizeInBytes = (base64Length * 3) / 4
    setCompressedSize(sizeInBytes)
  }

  const handleQualityChange = (value) => {
    const newQuality = value / 100
    setQuality(newQuality)
    if (originalImage) {
      compressImage(originalImage, newQuality)
    }
  }

  const downloadImage = () => {
    if (!compressedImage) return
    const link = document.createElement('a')
    link.download = `compressed-${Date.now()}.jpg`
    link.href = compressedImage
    link.click()
  }

  const copyImage = async () => {
    if (!compressedImage) return
    try {
      // 检查浏览器是否支持 ClipboardItem
      if (!navigator.clipboard || !window.ClipboardItem) {
        throw new Error('浏览器不支持复制图像功能')
      }

      const response = await fetch(compressedImage)
      const blob = await response.blob()

      // 确保 blob type 有效
      const item = new ClipboardItem({
        'image/png': blob.type === 'image/png' ? blob : new Blob([blob], { type: 'image/png' })
      })

      await navigator.clipboard.write([item])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
      alert('复制失败: ' + (err.message || '请使用下载功能'))
    }
  }

  const compressionRatio = originalSize > 0 ? ((1 - compressedSize / originalSize) * 100).toFixed(1) : 0

  return (
    <div className="tool-panel">
      <h2 className="tool-title">图像压缩</h2>

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

          {originalImage && (
            <>
              <div className="compress-controls" style={{ marginTop: 16 }}>
                <div className="control-group">
                  <label className="control-label">压缩质量: {Math.round(quality * 100)}%</label>
                  <div className="control-inputs">
                    <button
                      className="btn-icon"
                      onClick={() => handleQualityChange(Math.round(quality * 100) - 5)}
                      disabled={quality <= 0.1}
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="range"
                      className="tool-slider"
                      min="10"
                      max="100"
                      value={quality * 100}
                      onChange={(e) => handleQualityChange(parseInt(e.target.value))}
                    />
                    <button
                      className="btn-icon"
                      onClick={() => handleQualityChange(Math.round(quality * 100) + 5)}
                      disabled={quality >= 1}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="size-info" style={{ marginTop: 16 }}>
                  <div className="size-row">
                    <span className="size-label">原图大小:</span>
                    <span className="size-value">{formatFileSize(originalSize)}</span>
                  </div>
                  <div className="size-row">
                    <span className="size-label">压缩后:</span>
                    <span className="size-value">
                      {formatFileSize(compressedSize)}
                      <span style={{ color: '#4ade80', marginLeft: 8 }}>
                        (-{compressionRatio}%)
                      </span>
                    </span>
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
                  <span>下载压缩后的图片</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* 右侧预览区 */}
        <div className="tool-preview">
          {compressedImage ? (
            <img
              src={compressedImage}
              alt="压缩预览"
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

export default ImageCompress
