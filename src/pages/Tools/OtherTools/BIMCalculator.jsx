import { useState } from 'react'
import '../Tools.css'

function BIMCalculator() {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [result, setResult] = useState(null)

  const calculateBMI = () => {
    const h = parseFloat(height) / 100 // 转换为米
    const w = parseFloat(weight)
    
    if (h > 0 && w > 0) {
      const bmi = w / (h * h)
      let status = ''
      let color = ''
      
      if (bmi < 18.5) {
        status = '偏瘦'
        color = '#60a5fa'
      } else if (bmi < 24) {
        status = '正常'
        color = '#4ade80'
      } else if (bmi < 28) {
        status = '偏胖'
        color = '#fbbf24'
      } else {
        status = '肥胖'
        color = '#f87171'
      }
      
      setResult({ bmi: bmi.toFixed(1), status, color })
    }
  }

  return (
    <div className="tool-panel">
      <h2 className="tool-title">BMI 计算器</h2>
      <p className="tool-desc">计算身体质量指数，评估健康状况</p>

      <div className="tool-workspace">
        <div className="tool-params">
          <div className="param-group">
            <label>身高 (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="例如: 175"
              className="param-input"
            />
          </div>

          <div className="param-group">
            <label>体重 (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="例如: 65"
              className="param-input"
            />
          </div>

          <button onClick={calculateBMI} className="tool-btn primary">
            计算 BMI
          </button>
        </div>

        <div className="tool-preview">
          {result ? (
            <div className="bmi-result">
              <div className="bmi-value" style={{ color: result.color }}>
                {result.bmi}
              </div>
              <div className="bmi-status" style={{ color: result.color }}>
                {result.status}
              </div>
              <div className="bmi-reference">
                <p>参考标准：</p>
                <ul>
                  <li style={{ color: '#60a5fa' }}>偏瘦: &lt; 18.5</li>
                  <li style={{ color: '#4ade80' }}>正常: 18.5 - 23.9</li>
                  <li style={{ color: '#fbbf24' }}>偏胖: 24 - 27.9</li>
                  <li style={{ color: '#f87171' }}>肥胖: ≥ 28</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="preview-placeholder">
              输入身高体重后点击计算
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BIMCalculator
