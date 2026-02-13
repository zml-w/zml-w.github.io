import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Download, Globe, Wrench, Gamepad } from 'lucide-react'
import './Home.css'

// 天气画布组件
function WeatherCanvas({ mode, isPlaying }) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const meteorsRef = useRef([])
  const animationRef = useRef(null)
  const isPlayingRef = useRef(isPlaying)

  // 同步 isPlaying 到 ref，避免动画循环依赖变化
  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  // 初始化粒子和模式变化
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let width = window.innerWidth
    let height = window.innerHeight

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    resize()
    window.addEventListener('resize', resize)

    // 初始化粒子
    let count = 100
    if (mode === 'rain') count = 160
    if (mode === 'star') count = 80
    particlesRef.current = []
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: mode === 'snow' ? Math.random() * 3 + 1 : (mode === 'star' ? Math.random() * 5 + 3 : 0),
        v: mode === 'rain' ? Math.random() * 8 + 6 : (mode === 'star' ? Math.random() * 0.3 + 0.1 : Math.random() * 2 + 1),
        angle: mode === 'star' ? Math.random() * Math.PI * 2 : 0,
        speed: mode === 'star' ? Math.random() * 0.3 + 0.1 : 0,
      })
    }

    // 初始化流星
    meteorsRef.current = []

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = 'rgba(255,255,255,0.85)'
      ctx.strokeStyle = 'rgba(255,255,255,0.6)'

      // 播放音乐时减慢粒子速度
      const speedFactor = isPlayingRef.current ? 0.3 : 1

      // 随机生成流星（仅在星星模式下）
      if (mode === 'star' && Math.random() < 0.005) {
        meteorsRef.current.push({
          x: Math.random() * width * 0.5,
          y: Math.random() * height * 0.3,
          length: Math.random() * 80 + 50,
          speed: Math.random() * 8 + 10,
          angle: Math.PI / 4,
        })
      }

      particlesRef.current.forEach((p) => {
        if (mode === 'rain') {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x, p.y + 12)
          ctx.stroke()
        } else if (mode === 'star') {
          // 绘制星星形状
          const time = Date.now() * 0.001
          const opacity = 0.5 + 0.5 * Math.sin(time + p.angle * 10)
          ctx.fillStyle = `rgba(255,255,255,${opacity})`
          ctx.beginPath()
          for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5
            const radius = p.r
            const x = p.x + Math.cos(angle) * radius
            const y = p.y + Math.sin(angle) * radius
            if (i === 0) {
              ctx.moveTo(x, y)
            } else {
              ctx.lineTo(x, y)
            }
            // 绘制内顶点
            const innerRadius = radius * 0.5
            const innerAngle = (i * Math.PI * 2) / 5 + Math.PI / 5
            const innerX = p.x + Math.cos(innerAngle) * innerRadius
            const innerY = p.y + Math.sin(innerAngle) * innerRadius
            ctx.lineTo(innerX, innerY)
          }
          ctx.closePath()
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fill()
        }

        if (mode === 'star') {
          // 星星缓慢移动
          p.x += Math.cos(p.angle) * p.speed * speedFactor
          p.y += Math.sin(p.angle) * p.speed * speedFactor
          // 边界处理
          if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
            p.x = Math.random() * width
            p.y = Math.random() * height
            p.angle = Math.random() * Math.PI * 2
          }
        } else {
          // 雪和雨的移动
          p.y += p.v * speedFactor
          if (p.y > height) {
            p.y = -10
            p.x = Math.random() * width
          }
        }
      })

      // 绘制和更新流星
      meteorsRef.current = meteorsRef.current.filter((meteor) => {
        const tailX = meteor.x - Math.cos(meteor.angle) * meteor.length
        const tailY = meteor.y - Math.sin(meteor.angle) * meteor.length

        // 绘制流星
        const gradient = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY)
        gradient.addColorStop(0, 'rgba(255,255,255,0.9)')
        gradient.addColorStop(1, 'rgba(255,255,255,0)')

        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(meteor.x, meteor.y)
        ctx.lineTo(tailX, tailY)
        ctx.stroke()

        // 更新流星位置
        meteor.x += Math.cos(meteor.angle) * meteor.speed * speedFactor
        meteor.y += Math.sin(meteor.angle) * meteor.speed * speedFactor

        // 移除超出屏幕的流星
        return meteor.x < width + 100 && meteor.y < height + 100
      })

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mode]) // 只在 mode 变化时重新初始化

  return <canvas ref={canvasRef} className="weather-canvas" />
}

// 音乐播放器组件
function MusicPlayer({ onStateChange }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  const toggleMusic = () => {
    if (!audioRef.current) return

    const newState = !isPlaying
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch((e) => console.log('需用户交互'))
    }
    setIsPlaying(newState)
    onStateChange?.(newState)
  }

  return (
    <div className="music-player">
      <div
        className={`record-container ${isPlaying ? 'playing' : ''}`}
        onClick={toggleMusic}
      >
        <div className="record">
          <img src="/music/icon.png" className="record-cover" alt="cover" />
        </div>
      </div>
      <audio ref={audioRef} loop>
        <source src="/music/bgm.mp3" type="audio/mpeg" />
      </audio>
    </div>
  )
}

// 头像组件
function Avatar() {
  const [avatarSrc, setAvatarSrc] = useState('')

  useEffect(() => {
    const extensions = ['webp', 'png', 'jpg', 'jpeg']
    const tryLoadAvatar = async () => {
      for (const ext of extensions) {
        try {
          const img = new Image()
          img.src = `/avatar/avatar.${ext}`
          await new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
          })
          setAvatarSrc(img.src)
          break
        } catch {
          continue
        }
      }
    }
    tryLoadAvatar()
  }, [])

  return (
    <div
      className="avatar"
      style={{ backgroundImage: avatarSrc ? `url(${avatarSrc})` : 'none' }}
    />
  )
}

// 日期时间组件
function DateTime() {
  const [dateTime, setDateTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const weekday = weekdays[date.getDay()]
    return `${year}年${month}月${day}日 ${weekday}`
  }

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  return (
    <div className="datetime-display">
      <div className="date">{formatDate(dateTime)}</div>
      <div className="time">{formatTime(dateTime)}</div>
      <div className="timezone">北京时间</div>
      <CountdownDays />
      <CountdownDays2 />
    </div>
  )
}

// 倒数日组件 - 已存在
function CountdownDays() {
  const [days, setDays] = useState(0)

  useEffect(() => {
    const calculateDays = () => {
      const startDate = new Date('2005-01-30')
      const now = new Date()
      const diffTime = now - startDate
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      setDays(diffDays)
    }

    calculateDays()
    // 每天更新一次
    const timer = setInterval(calculateDays, 24 * 60 * 60 * 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="countdown-days">
      <span className="countdown-label">已存在</span>
      <span className="countdown-number">{days}</span>
      <span className="countdown-unit">天</span>
    </div>
  )
}

// 倒数日组件 - 会记得
function CountdownDays2() {
  const [days, setDays] = useState(0)

  useEffect(() => {
    const calculateDays = () => {
      const startDate = new Date('2023-01-30')
      const now = new Date()
      const diffTime = now - startDate
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      setDays(diffDays)
    }

    calculateDays()
    // 每天更新一次
    const timer = setInterval(calculateDays, 24 * 60 * 60 * 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="countdown-days">
      <span className="countdown-label">会记得</span>
      <span className="countdown-number">{days}</span>
      <span className="countdown-unit">天</span>
    </div>
  )
}

// 每日一言组件
function DailyQuote() {
  const quotes = [
    { text: '种一棵树最好的时间是十年前，其次是现在。', author: '丹比萨·莫约' },
    { text: '愿你出走半生，归来仍是少年。', author: '孙光曼' },
    { text: '为你，千千万万遍。', author: '《追风筝的人》' },
  ]

  const [quote, setQuote] = useState(null)

  useEffect(() => {
    // 随机选择一条名言
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setQuote(quotes[randomIndex])
  }, [])

  if (!quote) return null

  return (
    <div className="daily-quote">
      <div className="quote-text">「{quote.text}」</div>
      <div className="quote-author">—— {quote.author}</div>
    </div>
  )
}

// 主页组件
function Home() {
  const [weatherMode, setWeatherMode] = useState('snow')
  const [isPlaying, setIsPlaying] = useState(false)

  const toggleWeather = () => {
    if (weatherMode === 'snow') {
      setWeatherMode('rain')
    } else if (weatherMode === 'rain') {
      setWeatherMode('star')
    } else {
      setWeatherMode('snow')
    }
  }

  const handleMusicStateChange = useCallback((playing) => {
    setIsPlaying(playing)
  }, [])

  return (
    <div className="home">
      <WeatherCanvas mode={weatherMode} isPlaying={isPlaying} />

      {/* 左上角日期时间和每日一言 */}
      <div className="datetime-container">
        <DateTime />
        <DailyQuote />
      </div>

      {/* 顶部控制栏 */}
      <div className="home-top">
        <button className="weather-btn" onClick={toggleWeather}>
          {weatherMode === 'snow' ? '🌨️' : weatherMode === 'rain' ? '🌧️' : '✨'}
        </button>
        <MusicPlayer onStateChange={handleMusicStateChange} />
      </div>

      {/* 中央内容 */}
      <div className="home-center">
        <Avatar />

        <p className="subtitle">
          <strong>
            <em>Living · Sleeping · Dreaming</em>
          </strong>
          <br />
          <sub>活着 · 睡觉 · 在梦里</sub>
        </p>

        <div className="social-links">
          <a
            href="https://github.com/zml-w"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white"
              alt="GitHub"
            />
          </a>
          <a
            href="https://space.bilibili.com/691121489"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://img.shields.io/badge/BiliBili-00A1D6?style=flat&logo=bilibili&logoColor=white"
              alt="Bilibili"
            />
          </a>
        </div>

        {/* 快速导航 */}
        <div className="quick-nav">
          <Link to="/software" className="quick-nav-item">
            <Download size={20} />
            <span>软件导航</span>
          </Link>
          <Link to="/websites" className="quick-nav-item">
            <Globe size={20} />
            <span>网址收藏</span>
          </Link>
          <Link to="/tools" className="quick-nav-item">
            <Wrench size={20} />
            <span>在线工具</span>
          </Link>
          <Link to="/games" className="quick-nav-item">
            <Gamepad size={20} />
            <span>网页游戏</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
