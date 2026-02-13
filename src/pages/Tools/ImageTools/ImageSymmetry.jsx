import { useState, useRef, useCallback } from 'react'
import { Upload, Download, Copy, Check, MoveHorizontal, MoveVertical, RotateCcw } from 'lucide-react'

function ImageSymmetry() {
  const [originalImage, setOriginalImage] = useState(null)
  const [processedImage, setProcessedImage] = useState(null)
  const [symmetryType, setSymmetryType] = useState('horizontal') // horizontal 或 vertical
  const [position, setPosition] = useState(50) // 对称位置，默认50%
  const [isDragOver, setIsDragOver] = useState(false)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        setOriginalImage(img)
        processImage(img, symmetryType, position)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }, [symmetryType, position])

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

  const processImage = useCallback((img, type, pos) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    
    // 设置画布尺寸与原图相同
    canvas.width = img.width
    canvas.height = img.height

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (type === 'horizontal') {
      // 左右对称
      const splitX = Math.floor(img.width * (pos / 100))
      
      // 镜像模式：左半边镜像到右半边
      ctx.drawImage(img, 0, 0, splitX, img.height, 0, 0, splitX, img.height)
      ctx.save()
      ctx.translate(splitX * 2, 0)
      ctx.scale(-1, 1)
      ctx.drawImage(img, 0, 0, splitX, img.height, 0, 0, splitX, img.height)
      ctx.restore()
      // 如果分割点不在中间，填充剩余部分
      if (splitX < img.width / 2) {
        ctx.drawImage(img, splitX * 2, 0, img.width - splitX * 2, img.height, splitX * 2, 0, img.width - splitX * 2, img.height)
      }
    } else {
      // 上下对称
      const splitY = Math.floor(img.height * (pos / 100))
      
      // 镜像模式：上半边镜像到下半边
      ctx.drawImage(img, 0, 0, img.width, splitY, 0, 0, img.width, splitY)
      ctx.save()
      ctx.translate(0, splitY * 2)
      ctx.scale(1, -1)
      ctx.drawImage(img, 0, 0, img.width, splitY, 0, 0, img.width, splitY)
      ctx.restore()
      // 如果分割点不在中间，填充剩余部分
      if (splitY < img.height / 2) {
        ctx.drawImage(img, 0, splitY * 2, img.width, img.height - splitY * 2, 0, splitY * 2, img.width, img.height - splitY * 2)
      }
    }

    // 获取处理后的图片
    const dataUrl = canvas.toDataURL('image/png')
    setProcessedImage(dataUrl)
  }, [])

  const handleSymmetryTypeChange = (type) => {
    setSymmetryType(type)
    if (originalImage) {
      processImage(originalImage, type, position)
    }
  }

  const handlePositionChange = (e) => {
    const newPos = parseInt(e.target.value, 10)
    setPosition(newPos)
    if (originalImage) {
      processImage(originalImage, symmetryType, newPos)
    }
  }

  const resetTransform = () => {
    setSymmetryType('horizontal')
    setPosition(50)
    if (originalImage) {
      processImage(originalImage, 'horizontal', 50)
    }
  }

  const downloadImage = () => {
    if (!processedImage) return
    const link = document.createElement('a')
    link.download = `symmetry-${Date.now()}.png`
    link.href = processedImage
    link.click()
  }

  const copyImage = async () => {
    if (!processedImage) return
    try {
      const response = await fetch(processedImage)
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
      <h2 className="tool-title">图像对称</h2>

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
              <div className="symmetry-controls">
                <div className="control-group">
                  <label className="control-label">对称方向</label>
                  <div className="symmetry-buttons">
                    <button
                      className={`btn btn-secondary ${symmetryType === 'horizontal' ? 'active' : ''}`}
                      onClick={() => handleSymmetryTypeChange('horizontal')}
                      title="左右对称"
                    >
                      <MoveHorizontal size={18} />
                      <span>左右对称</span>
                    </button>
                    <button
                      className={`btn btn-secondary ${symmetryType === 'vertical' ? 'active' : ''}`}
                      onClick={() => handleSymmetryTypeChange('vertical')}
                      title="上下对称"
                    >
                      <MoveVertical size={18} />
                      <span>上下对称</span>
                    </button>
                  </div>
                </div>

                <div className="control-group">
                  <label className="control-label">
                    对称位置 <span className="range-value">{position}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={position}
                    onChange={handlePositionChange}
                    className="range-slider"
                  />
                  <div className="range-labels">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <div className="tool-actions">
                <button className="btn btn-secondary" onClick={resetTransform}>
                  <RotateCcw size={16} />
                  <span>重置</span>
                </button>
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
          {processedImage ? (
            <img
              src={processedImage}
              alt="处理预览"
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

export default ImageSymmetry
