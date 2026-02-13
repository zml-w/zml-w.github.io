import { useState } from 'react'
import '../Tools.css'

function DateCalculator() {
  const [mode, setMode] = useState('diff')
  const [date1, setDate1] = useState(new Date().toISOString().split('T')[0])
  const [date2, setDate2] = useState(new Date().toISOString().split('T')[0])
  const [baseDate, setBaseDate] = useState(new Date().toISOString().split('T')[0])
  const [days, setDays] = useState(7)
  const [result, setResult] = useState('')

  const calculateDiff = () => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    const diffTime = Math.abs(d2 - d1)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    const years = Math.floor(diffDays / 365)
    const months = Math.floor((diffDays % 365) / 30)
    const days = diffDays % 30
    
    let resultText = `相差 ${diffDays} 天`
    if (years > 0 || months > 0) {
      resultText += `\n约 ${years} 年 ${months} 个月 ${days} 天`
    }
    
    // 计算工作日
    let workDays = 0
    const start = new Date(Math.min(d1, d2))
    const end = new Date(Math.max(d1, d2))
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const day = d.getDay()
      if (day !== 0 && day !== 6) workDays++
    }
    resultText += `\n工作日: ${workDays} 天`
    
    setResult(resultText)
  }

  const calculateAdd = () => {
    const base = new Date(baseDate)
    const result = new Date(base)
    result.setDate(base.getDate() + parseInt(days))
    
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const weekday = weekdays[result.getDay()]
    
    setResult(`${result.toLocaleDateString('zh-CN')} ${weekday}`)
  }

  const calculateSubtract = () => {
    const base = new Date(baseDate)
    const result = new Date(base)
    result.setDate(base.getDate() - parseInt(days))
    
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const weekday = weekdays[result.getDay()]
    
    setResult(`${result.toLocaleDateString('zh-CN')} ${weekday}`)
  }

  const calculate = () => {
    if (mode === 'diff') {
      calculateDiff()
    } else if (mode === 'add') {
      calculateAdd()
    } else {
      calculateSubtract()
    }
  }

  const setToday = (setter) => {
    setter(new Date().toISOString().split('T')[0])
  }

  const quickDays = [7, 30, 90, 180, 365]

  return (
    <div className="tool-panel">
      <h2 className="tool-title">📅 日期计算</h2>
      <p className="tool-desc">计算日期差值、推算未来或过去日期</p>

      <div className="tool-workspace">
        <div className="tool-params">
          <div className="param-group">
            <label>计算模式</label>
            <div className="mode-buttons">
              <button 
                className={`mode-btn ${mode === 'diff' ? 'active' : ''}`}
                onClick={() => setMode('diff')}
              >
                日期差值
              </button>
              <button 
                className={`mode-btn ${mode === 'add' ? 'active' : ''}`}
                onClick={() => setMode('add')}
              >
                往后推算
              </button>
              <button 
                className={`mode-btn ${mode === 'sub' ? 'active' : ''}`}
                onClick={() => setMode('sub')}
              >
                往前推算
              </button>
            </div>
          </div>

          {mode === 'diff' ? (
            <>
              <div className="param-group">
                <label>开始日期</label>
                <div className="date-input-group">
                  <input 
                    type="date" 
                    value={date1} 
                    onChange={(e) => setDate1(e.target.value)}
                    className="date-input"
                  />
                  <button className="today-btn" onClick={() => setToday(setDate1)}>今天</button>
                </div>
              </div>
              <div className="param-group">
                <label>结束日期</label>
                <div className="date-input-group">
                  <input 
                    type="date" 
                    value={date2} 
                    onChange={(e) => setDate2(e.target.value)}
                    className="date-input"
                  />
                  <button className="today-btn" onClick={() => setToday(setDate2)}>今天</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="param-group">
                <label>基准日期</label>
                <div className="date-input-group">
                  <input 
                    type="date" 
                    value={baseDate} 
                    onChange={(e) => setBaseDate(e.target.value)}
                    className="date-input"
                  />
                  <button className="today-btn" onClick={() => setToday(setBaseDate)}>今天</button>
                </div>
              </div>
              <div className="param-group">
                <label>天数</label>
                <div className="days-input-group">
                  <input 
                    type="number" 
                    value={days} 
                    onChange={(e) => setDays(parseInt(e.target.value) || 0)}
                    className="days-input"
                  />
                  <span className="days-label">天</span>
                </div>
                <div className="quick-days">
                  {quickDays.map(d => (
                    <button 
                      key={d} 
                      className="quick-day-btn"
                      onClick={() => setDays(d)}
                    >
                      {d === 7 ? '一周' : d === 30 ? '一月' : d === 90 ? '一季' : d === 180 ? '半年' : '一年'}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="param-actions">
            <button onClick={calculate} className="tool-btn primary">
              计算
            </button>
          </div>
        </div>

        <div className="tool-preview">
          {result ? (
            <div className="date-result">
              <div className="result-icon">📅</div>
              <div className="result-text">{result.split('\n').map((line, i) => (
                <div key={i} className="result-line">{line}</div>
              ))}</div>
            </div>
          ) : (
            <div className="preview-placeholder">
              设置参数后点击计算
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DateCalculator
