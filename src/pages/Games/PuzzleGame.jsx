import { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, Eye, EyeOff, RefreshCw, Grid3X3 } from 'lucide-react'
import './PuzzleGame.css'

const GRID_SIZES = [3, 4, 5, 6]

function PuzzleGame() {
  const [image, setImage] = useState(null)
  const [gridSize, setGridSize] = useState(3)
  const [tiles, setTiles] = useState([])
  const [originalTiles, setOriginalTiles] = useState([])
  const [isComplete, setIsComplete] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [draggedTile, setDraggedTile] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [moveCount, setMoveCount] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const fileInputRef = useRef(null)
  const timerRef = useRef(null)

  // 计时器
  useEffect(() => {
    if (startTime && !isComplete) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [startTime, isComplete])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          setImage(event.target.result)
          initializePuzzle(event.target.result, gridSize)
        }
        img.src = event.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  const initializePuzzle = (imgSrc, size) => {
    const img = new Image()
    img.onload = () => {
      const totalTiles = size * size
      const newTiles = []
      const origTiles = []

      // 创建画布来处理图片
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      // 设置画布大小为图片原始尺寸
      canvas.width = img.width
      canvas.height = img.height

      // 绘制原图
      ctx.drawImage(img, 0, 0)

      // 计算每个图块的尺寸
      const tileWidth = img.width / size
      const tileHeight = img.height / size

      // 创建图块
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          const tileCanvas = document.createElement('canvas')
          const tileCtx = tileCanvas.getContext('2d')
          tileCanvas.width = tileWidth
          tileCanvas.height = tileHeight

          // 从原图裁剪对应区域
          tileCtx.drawImage(
            canvas,
            col * tileWidth, row * tileHeight, tileWidth, tileHeight,
            0, 0, tileWidth, tileHeight
          )

          const tileData = tileCanvas.toDataURL()
          const correctIndex = row * size + col

          origTiles.push({
            id: correctIndex,
            data: tileData,
            correctIndex: correctIndex
          })

          newTiles.push({
            id: correctIndex,
            data: tileData,
            correctIndex: correctIndex
          })
        }
      }

      // 打乱图块（确保不是已完成的顺序）
      let shuffled
      do {
        shuffled = [...newTiles].sort(() => Math.random() - 0.5)
      } while (isSolved(shuffled))

      setOriginalTiles(origTiles)
      setTiles(shuffled)
      setIsComplete(false)
      setMoveCount(0)
      setStartTime(Date.now())
      setElapsedTime(0)
    }
    img.src = imgSrc
  }

  const isSolved = (tileArray) => {
    return tileArray.every((tile, index) => tile.correctIndex === index)
  }

  const checkComplete = (tileArray) => {
    const complete = isSolved(tileArray)
    setIsComplete(complete)
  }

  const handleDragStart = (e, index) => {
    setDraggedTile(index)
    e.dataTransfer.effectAllowed = 'move'
    // 设置拖拽时的透明图像
    const img = new Image()
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    e.dataTransfer.setDragImage(img, 0, 0)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (draggedTile !== null && draggedTile !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    if (draggedTile === null || draggedTile === dropIndex) {
      setDraggedTile(null)
      setDragOverIndex(null)
      return
    }

    const newTiles = [...tiles]
    const temp = newTiles[draggedTile]
    newTiles[draggedTile] = newTiles[dropIndex]
    newTiles[dropIndex] = temp

    setTiles(newTiles)
    setMoveCount(prev => prev + 1)
    setDraggedTile(null)
    setDragOverIndex(null)
    checkComplete(newTiles)
  }

  const handleDragEnd = () => {
    setDraggedTile(null)
    setDragOverIndex(null)
  }

  // 触摸支持
  const touchStartPos = useRef(null)
  const touchCurrentIndex = useRef(null)

  const handleTouchStart = (e, index) => {
    const touch = e.touches[0]
    touchStartPos.current = { x: touch.clientX, y: touch.clientY }
    touchCurrentIndex.current = index
    setDraggedTile(index)
  }

  const handleTouchMove = (e) => {
    e.preventDefault()
    const touch = e.touches[0]
    const element = document.elementFromPoint(touch.clientX, touch.clientY)
    if (element) {
      const tileElement = element.closest('.puzzle-tile')
      if (tileElement) {
        const index = parseInt(tileElement.dataset.index)
        if (index !== touchCurrentIndex.current) {
          setDragOverIndex(index)
        }
      }
    }
  }

  const handleTouchEnd = (e) => {
    if (draggedTile !== null && dragOverIndex !== null && draggedTile !== dragOverIndex) {
      const newTiles = [...tiles]
      const temp = newTiles[draggedTile]
      newTiles[draggedTile] = newTiles[dragOverIndex]
      newTiles[dragOverIndex] = temp

      setTiles(newTiles)
      setMoveCount(prev => prev + 1)
      checkComplete(newTiles)
    }
    touchStartPos.current = null
    touchCurrentIndex.current = null
    setDraggedTile(null)
    setDragOverIndex(null)
  }

  const resetPuzzle = () => {
    if (image) {
      initializePuzzle(image, gridSize)
    }
  }

  const changeGridSize = (newSize) => {
    setGridSize(newSize)
    if (image) {
      initializePuzzle(image, newSize)
    }
  }

  return (
    <div className="puzzle-game">
      <div className="puzzle-header">
        <div className="puzzle-stats">
          <div className="stat-box">
            <span className="stat-label">步数</span>
            <span className="stat-value">{moveCount}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">时间</span>
            <span className="stat-value">{formatTime(elapsedTime)}</span>
          </div>
        </div>

        <div className="puzzle-controls">
          <div className="grid-size-selector">
            <Grid3X3 size={16} />
            {GRID_SIZES.map(size => (
              <button
                key={size}
                className={`size-btn ${gridSize === size ? 'active' : ''}`}
                onClick={() => changeGridSize(size)}
              >
                {size}×{size}
              </button>
            ))}
          </div>

          <button
            className="btn"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            {showPreview ? '隐藏预览' : '显示预览'}
          </button>

          {image && (
            <button className="btn" onClick={resetPuzzle}>
              <RefreshCw size={16} />
              重置
            </button>
          )}

          <button
            className="btn btn-primary"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={16} />
            上传图片
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {isComplete && (
        <div className="puzzle-complete-banner">
          🎉 恭喜你！拼图完成！
        </div>
      )}

      <div className="puzzle-content">
        <div className="puzzle-board-container">
          {!image ? (
            <div className="puzzle-upload-area" onClick={() => fileInputRef.current?.click()}>
              <Upload size={48} />
              <p>点击上传图片开始拼图</p>
              <span>支持 JPG、PNG、GIF 格式</span>
            </div>
          ) : (
            <div
              className="puzzle-board"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize}, 1fr)`
              }}
            >
              {tiles.map((tile, index) => (
                <div
                  key={tile.id}
                  className={`puzzle-tile ${
                    draggedTile === index ? 'dragging' : ''
                  } ${dragOverIndex === index ? 'drag-over' : ''}`}
                  data-index={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  onTouchStart={(e) => handleTouchStart(e, index)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <img
                    src={tile.data}
                    alt={`图块 ${index + 1}`}
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {showPreview && image && (
          <div className="puzzle-preview">
            <div className="preview-title">原图预览</div>
            <img src={image} alt="原图" />
          </div>
        )}
      </div>


    </div>
  )
}

export default PuzzleGame
