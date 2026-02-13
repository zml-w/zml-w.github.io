import { useState, useRef } from 'react'
import { Upload, Download, FileArchive, Minus, Plus } from 'lucide-react'
import JSZip from 'jszip'

function ImageGrid() {
  const [image, setImage] = useState(null)
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const [previews, setPreviews] = useState([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isZipping, setIsZipping] = useState(false)
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
        generatePreviews(img, rows, cols)
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

  const generatePreviews = (img, r, c) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const pieceWidth = img.width / c
    const pieceHeight = img.height / r
    const newPreviews = []

    for (let i = 0; i < r; i++) {
      for (let j = 0; j < c; j++) {
        canvas.width = pieceWidth
        canvas.height = pieceHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(
          img,
          j * pieceWidth,
          i * pieceHeight,
          pieceWidth,
          pieceHeight,
          0,
          0,
          pieceWidth,
          pieceHeight
        )
        newPreviews.push({
          src: canvas.toDataURL('image/png'),
          name: `grid_${i}_${j}.png`,
        })
      }
    }
    setPreviews(newPreviews)
  }

  const handleRowsChange = (value) => {
    const newRows = Math.max(1, Math.min(10, value))
    setRows(newRows)
    if (image) {
      generatePreviews(image, newRows, cols)
    }
  }

  const handleColsChange = (value) => {
    const newCols = Math.max(1, Math.min(10, value))
    setCols(newCols)
    if (image) {
      generatePreviews(image, rows, newCols)
    }
  }

  // 将 base64 转换为 Blob
  const base64ToBlob = (base64) => {
    const parts = base64.split(';base64,')
    const contentType = parts[0].split(':')[1]
    const raw = window.atob(parts[1])
    const rawLength = raw.length
    const uInt8Array = new Uint8Array(rawLength)
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i)
    }
    return new Blob([uInt8Array], { type: contentType })
  }

  // 下载压缩包
  const downloadZip = async () => {
    if (previews.length === 0) return

    setIsZipping(true)
    try {
      const zip = new JSZip()
      const folder = zip.folder('grid_images')

      previews.forEach((preview) => {
        const blob = base64ToBlob(preview.src)
        folder.file(preview.name, blob)
      })

      const content = await zip.generateAsync({ type: 'blob' })
      const link = document.createElement('a')
      link.download = `grid_${rows}x${cols}.zip`
      link.href = URL.createObjectURL(content)
      link.click()
      URL.revokeObjectURL(link.href)
    } catch (error) {
      console.error('压缩失败:', error)
      alert('压缩失败，请重试')
    } finally {
      setIsZipping(false)
    }
  }

  return (
    <div className="tool-panel">
      <h2 className="tool-title">图像网格切分</h2>

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
              <div className="grid-controls" style={{ marginTop: 20 }}>
                <div className="control-group">
                  <label className="control-label">行数: {rows}</label>
                  <div className="control-inputs">
                    <button
                      className="btn-icon"
                      onClick={() => handleRowsChange(rows - 1)}
                      disabled={rows <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="range"
                      className="tool-slider"
                      min="1"
                      max="10"
                      value={rows}
                      onChange={(e) => handleRowsChange(parseInt(e.target.value))}
                    />
                    <button
                      className="btn-icon"
                      onClick={() => handleRowsChange(rows + 1)}
                      disabled={rows >= 10}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="control-group">
                  <label className="control-label">列数: {cols}</label>
                  <div className="control-inputs">
                    <button
                      className="btn-icon"
                      onClick={() => handleColsChange(cols - 1)}
                      disabled={cols <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="range"
                      className="tool-slider"
                      min="1"
                      max="10"
                      value={cols}
                      onChange={(e) => handleColsChange(parseInt(e.target.value))}
                    />
                    <button
                      className="btn-icon"
                      onClick={() => handleColsChange(cols + 1)}
                      disabled={cols >= 10}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="tool-actions" style={{ marginTop: 24 }}>
                <button
                  className="btn btn-primary"
                  onClick={downloadZip}
                  disabled={isZipping}
                >
                  {isZipping ? (
                    <>
                      <span className="loading-spinner" />
                      <span>打包中...</span>
                    </>
                  ) : (
                    <>
                      <FileArchive size={16} />
                      <span>下载压缩包</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* 右侧预览区 */}
        <div className="tool-preview">
          {image ? (
            <div
              className="preview-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gap: 8,
              }}
            >
              {previews.map((preview, index) => (
                <img
                  key={index}
                  src={preview.src}
                  alt={`切分 ${index + 1}`}
                  style={{
                    width: '100%',
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    const link = document.createElement('a')
                    link.download = preview.name
                    link.href = preview.src
                    link.click()
                  }}
                  title="点击下载单张"
                />
              ))}
            </div>
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

export default ImageGrid
