import { useState, useRef } from 'react'
import { Upload, Download, Image as ImageIcon } from 'lucide-react'
import '../Tools.css'

function VideoFrames() {
  const [videoFile, setVideoFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [duration, setDuration] = useState(0)
  const [firstFrame, setFirstFrame] = useState('')
  const [lastFrame, setLastFrame] = useState('')
  const [extracting, setExtracting] = useState(false)
  
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)

  // 处理文件选择
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file)
      const url = URL.createObjectURL(file)
      setVideoUrl(url)
      setFirstFrame('')
      setLastFrame('')
    }
  }

  // 视频加载完成
  const handleVideoLoaded = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
      extractFrames()
    }
  }

  // 提取首尾帧
  const extractFrames = async () => {
    if (!videoRef.current || !canvasRef.current) return

    setExtracting(true)
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // 设置画布尺寸
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // 提取首帧 (0.1秒处，避免黑屏)
    video.currentTime = 0.1
    await new Promise(resolve => {
      video.onseeked = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        setFirstFrame(canvas.toDataURL('image/jpeg', 0.9))
        resolve()
      }
    })

    // 提取尾帧 (最后一秒)
    const endTime = Math.max(0, video.duration - 1)
    video.currentTime = endTime
    await new Promise(resolve => {
      video.onseeked = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        setLastFrame(canvas.toDataURL('image/jpeg', 0.9))
        resolve()
      }
    })

    setExtracting(false)
  }

  // 下载图片
  const downloadImage = (dataUrl, filename) => {
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // 下载所有
  const downloadAll = () => {
    if (firstFrame) {
      downloadImage(firstFrame, 'first-frame.jpg')
    }
    if (lastFrame) {
      setTimeout(() => {
        downloadImage(lastFrame, 'last-frame.jpg')
      }, 500)
    }
  }

  return (
    <div className="tool-panel">
      <h2 className="tool-title">提取视频首尾帧</h2>
      <p className="tool-desc">自动提取视频的第一帧和最后一帧作为封面图片</p>

      <div className="tool-workspace">
        {/* 文件上传 */}
        <div 
          className="upload-area"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <Upload size={48} />
          <p>点击或拖拽上传视频</p>
          <small>支持 MP4, WebM, MOV 等格式</small>
        </div>

        {videoUrl && (
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              onLoadedMetadata={handleVideoLoaded}
              style={{ display: 'none' }}
            />

            {extracting ? (
              <div className="extracting-status">
                <div className="loading-spinner" />
                <p>正在提取帧...</p>
              </div>
            ) : (
              <div className="frames-result">
                <div className="frames-grid">
                  {/* 首帧 */}
                  {firstFrame && (
                    <div className="frame-item">
                      <h4><ImageIcon size={16} /> 首帧</h4>
                      <div className="frame-image">
                        <img src={firstFrame} alt="首帧" />
                      </div>
                      <button 
                        className="tool-btn secondary"
                        onClick={() => downloadImage(firstFrame, 'first-frame.jpg')}
                      >
                        <Download size={14} /> 下载
                      </button>
                    </div>
                  )}

                  {/* 尾帧 */}
                  {lastFrame && (
                    <div className="frame-item">
                      <h4><ImageIcon size={16} /> 尾帧</h4>
                      <div className="frame-image">
                        <img src={lastFrame} alt="尾帧" />
                      </div>
                      <button 
                        className="tool-btn secondary"
                        onClick={() => downloadImage(lastFrame, 'last-frame.jpg')}
                      >
                        <Download size={14} /> 下载
                      </button>
                    </div>
                  )}
                </div>

                {firstFrame && lastFrame && (
                  <button className="tool-btn primary" onClick={downloadAll}>
                    <Download size={16} /> 下载全部
                  </button>
                )}

                <div className="video-info">
                  <p>视频时长: {duration.toFixed(2)} 秒</p>
                  <p>分辨率: {videoRef.current?.videoWidth} x {videoRef.current?.videoHeight}</p>
                </div>
              </div>
            )}
          </>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  )
}

export default VideoFrames
