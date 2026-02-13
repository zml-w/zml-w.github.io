import { useState, useRef, useCallback } from 'react'
import { Upload, Download, Copy, Check, RotateCw, RotateCcw, FlipHorizontal, FlipVertical, Undo2 } from 'lucide-react'

function ImageRotate() {
  const [originalImage, setOriginalImage] = useState(null)
  const [processedImage, setProcessedImage] = useState(null)
  const [rotation, setRotation] = useState(0) // 当前旋转角度
  const [flipH, setFlipH] = useState(false) // 水平翻转
  const [flipV, setFlipV] = useState(false) // 垂直翻转
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
        processImage(img, 0, false, false)
        setRotation(0)
        setFlipH(false)
        setFlipV(false)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }, [])

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

  const processImage = useCallback((img, rot, fh, fv) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    
    // 计算旋转后的画布尺寸
    const rad = (rot * Math.PI) / 180
    const sin = Math.abs(Math.sin(rad))
    const cos = Math.abs(Math.cos(rad))
    
    // 根据旋转角度设置画布尺寸
    if (rot === 90 || rot === 270) {
      canvas.width = img.height
      canvas.height = img.width
    } else {
      canvas.width = img.width
      canvas.height = img.height
    }

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 保存上下文
    ctx.save()

    // 移动到画布中心
    ctx.translate(canvas.width / 2, canvas.height / 2)

    // 应用旋转
    if (rot !== 0) {
      ctx.rotate(rad)
    }

    // 应用翻转
    ctx.scale(fh ? -1 : 1, fv ? -1 : 1)

    // 绘制图片（居中）
    ctx.drawImage(img, -img.width / 2, -img.height / 2)

    // 恢复上下文
    ctx.restore()

    // 获取处理后的图片
    const dataUrl = canvas.toDataURL('image/png')
    setProcessedImage(dataUrl)
  }, [])

  const rotate90Clockwise = () => {
    if (!originalImage) return
    const newRotation = (rotation + 90) % 360
    setRotation(newRotation)
    processImage(originalImage, newRotation, flipH, flipV)
  }

  const rotate90CounterClockwise = () => {
    if (!originalImage) return
    const newRotation = (rotation - 90 + 360) % 360
    setRotation(newRotation)
    processImage(originalImage, newRotation, flipH, flipV)
  }

  const rotate180 = () => {
    if (!originalImage) return
    const newRotation = (rotation + 180) % 360
    setRotation(newRotation)
    processImage(originalImage, newRotation, flipH, flipV)
  }

  const toggleFlipHorizontal = () => {
    if (!originalImage) return
    const newFlipH = !flipH
    setFlipH(newFlipH)
    processImage(originalImage, rotation, newFlipH, flipV)
  }

  const toggleFlipVertical = () => {
    if (!originalImage) return
    const newFlipV = !flipV
    setFlipV(newFlipV)
    processImage(originalImage, rotation, flipH, newFlipV)
  }

  const resetTransform = () => {
    if (!originalImage) return
    setRotation(0)
    setFlipH(false)
    setFlipV(false)
    processImage(originalImage, 0, false, false)
  }

  const downloadImage = () => {
    if (!processedImage) return
    const link = document.createElement('a')
    link.download = `rotated-${Date.now()}.png`
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
      <h2 className="tool-title">图像旋转</h2>


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
              <div className="rotate-controls">
                <div className="control-group">
                  <label className="control-label">旋转</label>
                  <div className="rotate-buttons">
                    <button
                      className="btn btn-secondary"
                      onClick={rotate90CounterClockwise}
                      title="向左旋转90°"
                    >
                      <RotateCcw size={18} />
                      <span>左转90°</span>
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={rotate90Clockwise}
                      title="向右旋转90°"
                    >
                      <RotateCw size={18} />
                      <span>右转90°</span>
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={rotate180}
                      title="旋转180°"
                    >
                      <RotateCw size={18} style={{ transform: 'rotate(45deg)' }} />
                      <span>旋转180°</span>
                    </button>
                  </div>
                </div>

                <div className="control-group">
                  <label className="control-label">镜像</label>
                  <div className="flip-buttons">
                    <button
                      className={`btn btn-secondary ${flipH ? 'active' : ''}`}
                      onClick={toggleFlipHorizontal}
                      title="水平镜像"
                    >
                      <FlipHorizontal size={18} />
                      <span>水平镜像</span>
                    </button>
                    <button
                      className={`btn btn-secondary ${flipV ? 'active' : ''}`}
                      onClick={toggleFlipVertical}
                      title="垂直镜像"
                    >
                      <FlipVertical size={18} />
                      <span>垂直镜像</span>
                    </button>
                  </div>
                </div>

              </div>

              <div className="action-buttons rotate-action-buttons">
                <button
                  className="btn btn-primary"
                  onClick={downloadImage}
                  disabled={!processedImage}
                >
                  <Download size={16} />
                  <span>下载图片</span>
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={copyImage}
                  disabled={!processedImage}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? '已复制' : '复制到剪贴板'}</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* 右侧预览区 */}
        <div className="tool-preview">
          {originalImage ? (
            <div className="preview-container single-preview">
              <div className="preview-box">
                <div className="preview-image-wrapper">
                  {processedImage && (
                    <img
                      src={processedImage}
                      alt="预览"
                      className="preview-image"
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="preview-placeholder">
              <div className="placeholder-content">
                <div className="placeholder-icon">🖼️</div>
                <p>上传图片后预览</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 隐藏的canvas用于处理图片 */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}

export default ImageRotate
