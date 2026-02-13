import { useState, useRef, useEffect } from 'react'
import '../Tools.css'

function Lottery() {
  const [participants, setParticipants] = useState('')
  const [prizes, setPrizes] = useState([{ name: '一等奖', count: 1 }])
  const [winners, setWinners] = useState([])
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentDisplay, setCurrentDisplay] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const spinRef = useRef(null)
  const canvasRef = useRef(null)

  const participantList = participants.split(/[\n,，;；]/).filter(p => p.trim())

  // 计算总奖项数量
  const totalPrizes = prizes.reduce((sum, p) => sum + (parseInt(p.count) || 0), 0)

  // 彩带动画
  useEffect(() => {
    if (!showConfetti || !canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    
    const particles = []
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#00b894']
    
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      })
    }
    
    let animationId
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed
        
        if (p.y > canvas.height) {
          p.y = -20
          p.x = Math.random() * canvas.width
        }
        
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
        ctx.restore()
      })
      
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    
    const timer = setTimeout(() => {
      cancelAnimationFrame(animationId)
      setShowConfetti(false)
    }, 5000)
    
    return () => {
      cancelAnimationFrame(animationId)
      clearTimeout(timer)
    }
  }, [showConfetti])

  const addPrize = () => {
    setPrizes([...prizes, { name: '', count: 1 }])
  }

  const removePrize = (index) => {
    if (prizes.length > 1) {
      setPrizes(prizes.filter((_, i) => i !== index))
    }
  }

  const updatePrize = (index, field, value) => {
    const newPrizes = [...prizes]
    newPrizes[index][field] = value
    setPrizes(newPrizes)
  }

  const startLottery = () => {
    if (participantList.length === 0 || totalPrizes === 0 || isSpinning) return
    
    setIsSpinning(true)
    setWinners([])
    setShowConfetti(false)
    
    let speed = 50
    let duration = 3000
    let elapsed = 0
    
    const spin = () => {
      const randomParticipant = participantList[Math.floor(Math.random() * participantList.length)]
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)]
      setCurrentDisplay(`${randomParticipant} - ${randomPrize.name}`)
      
      elapsed += speed
      
      if (elapsed < duration) {
        // 逐渐减速
        if (elapsed > duration * 0.7) {
          speed += 5
        }
        spinRef.current = setTimeout(spin, speed)
      } else {
        // 抽奖结束
        const finalWinners = []
        const shuffled = [...participantList].sort(() => Math.random() - 0.5)
        let participantIndex = 0
        
        prizes.forEach((prize) => {
          const count = parseInt(prize.count) || 0
          for (let i = 0; i < count; i++) {
            if (participantIndex < shuffled.length) {
              finalWinners.push({
                prize: prize.name,
                winner: shuffled[participantIndex].trim()
              })
              participantIndex++
            }
          }
        })
        
        setWinners(finalWinners)
        setIsSpinning(false)
        setCurrentDisplay('')
        setShowConfetti(true)
      }
    }
    
    spin()
  }

  const clearAll = () => {
    setParticipants('')
    setPrizes([{ name: '', count: 1 }])
    setWinners([])
    setCurrentDisplay('')
    setShowConfetti(false)
    if (spinRef.current) {
      clearTimeout(spinRef.current)
    }
  }

  return (
    <div className="tool-panel lottery-panel">
      <h2 className="tool-title">🎰 幸运抽奖</h2>
      <p className="tool-desc">输入参与者和奖项，随机抽取幸运儿</p>

      <div className="tool-workspace">
        <div className="tool-params">
          <div className="param-group">
            <label>参与人员（每行一个）</label>
            <textarea
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="张三&#10;李四&#10;王五&#10;..."
              className="lottery-textarea"
              disabled={isSpinning}
            />
            <div className="lottery-count">共 {participantList.length} 人</div>
          </div>

          <div className="param-group">
            <label>奖项设置</label>
            <div className="prize-list">
              {prizes.map((prize, index) => (
                <div key={index} className="prize-item">
                  <input
                    type="text"
                    value={prize.name}
                    onChange={(e) => updatePrize(index, 'name', e.target.value)}
                    placeholder="奖项名称"
                    className="prize-name-input"
                    disabled={isSpinning}
                  />
                  <div className="prize-count-wrapper">
                    <span className="prize-count-label">数量</span>
                    <input
                      type="number"
                      min="1"
                      value={prize.count}
                      onChange={(e) => updatePrize(index, 'count', parseInt(e.target.value) || 1)}
                      className="prize-count-input"
                      disabled={isSpinning}
                    />
                  </div>
                  <button 
                    className="prize-remove-btn"
                    onClick={() => removePrize(index)}
                    disabled={isSpinning || prizes.length <= 1}
                    title="删除"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button 
              className="add-prize-btn"
              onClick={addPrize}
              disabled={isSpinning}
            >
              + 添加奖项
            </button>
            <div className="lottery-count">共 {totalPrizes} 个奖项</div>
          </div>

          <div className="param-actions">
            <button 
              onClick={startLottery} 
              className={`tool-btn lottery-start-btn ${isSpinning ? 'spinning' : ''}`}
              disabled={participantList.length === 0 || totalPrizes === 0 || isSpinning}
            >
              {isSpinning ? '抽奖中...' : '开始抽奖'}
            </button>
            <button onClick={clearAll} className="tool-btn secondary" disabled={isSpinning}>
              清空
            </button>
          </div>
        </div>

        <div className="tool-preview lottery-preview">
          {showConfetti && (
            <canvas ref={canvasRef} className="confetti-canvas" />
          )}
          
          {isSpinning ? (
            <div className="lottery-spinning">
              <div className="lottery-wheel">
                <div className="lottery-display">{currentDisplay}</div>
              </div>
              <div className="lottery-sparkles">✨ 🎲 🎊</div>
            </div>
          ) : winners.length > 0 ? (
            <div className="lottery-results">
              <h3 className="lottery-results-title">🎉 中奖名单 🎉</h3>
              <div className="winners-list">
                {winners.map((item, index) => (
                  <div key={index} className="winner-card" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="winner-rank">{index + 1}</div>
                    <div className="winner-info">
                      <div className="winner-name">{item.winner}</div>
                      <div className="winner-prize">{item.prize}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="preview-placeholder lottery-placeholder">
              <div className="lottery-icon">🎰</div>
              <div>输入参与者和奖项后点击开始</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Lottery
