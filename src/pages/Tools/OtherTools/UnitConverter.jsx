import { useState, useEffect } from 'react'
import '../Tools.css'

function UnitConverter() {
  const [category, setCategory] = useState('length')
  const [inputValue, setInputValue] = useState('1')
  const [fromUnit, setFromUnit] = useState('m')
  const [toUnit, setToUnit] = useState('cm')
  const [result, setResult] = useState('')

  const categories = {
    length: {
      name: '长度',
      icon: '📏',
      units: {
        m: { name: '米', factor: 1 },
        km: { name: '千米', factor: 1000 },
        cm: { name: '厘米', factor: 0.01 },
        mm: { name: '毫米', factor: 0.001 },
        um: { name: '微米', factor: 1e-6 },
        nm: { name: '纳米', factor: 1e-9 },
        in: { name: '英寸', factor: 0.0254 },
        ft: { name: '英尺', factor: 0.3048 },
        yd: { name: '码', factor: 0.9144 },
        mi: { name: '英里', factor: 1609.344 },
        nmi: { name: '海里', factor: 1852 },
        li: { name: '里', factor: 500 },
        zhang: { name: '丈', factor: 3.333333 },
        chi: { name: '尺', factor: 0.333333 },
        cun: { name: '寸', factor: 0.033333 },
      }
    },
    weight: {
      name: '重量',
      icon: '⚖️',
      units: {
        kg: { name: '千克', factor: 1 },
        g: { name: '克', factor: 0.001 },
        mg: { name: '毫克', factor: 1e-6 },
        t: { name: '吨', factor: 1000 },
        lb: { name: '磅', factor: 0.453592 },
        oz: { name: '盎司', factor: 0.0283495 },
        jin: { name: '斤', factor: 0.5 },
        liang: { name: '两', factor: 0.05 },
        dan: { name: '担', factor: 50 },
      }
    },
    energy: {
      name: '能量',
      icon: '⚡',
      units: {
        j: { name: '焦耳', factor: 1 },
        kj: { name: '千焦', factor: 1000 },
        cal: { name: '卡路里', factor: 4.184 },
        kcal: { name: '千卡', factor: 4184 },
        wh: { name: '瓦时', factor: 3600 },
        kwh: { name: '千瓦时', factor: 3600000 },
        ev: { name: '电子伏特', factor: 1.602176634e-19 },
        btu: { name: '英热单位', factor: 1055.05585 },
      }
    },
    area: {
      name: '面积',
      icon: '📐',
      units: {
        m2: { name: '平方米', factor: 1 },
        km2: { name: '平方千米', factor: 1e6 },
        cm2: { name: '平方厘米', factor: 1e-4 },
        ha: { name: '公顷', factor: 10000 },
        mu: { name: '亩', factor: 666.666667 },
        acre: { name: '英亩', factor: 4046.856422 },
        ft2: { name: '平方英尺', factor: 0.092903 },
      }
    },
    volume: {
      name: '体积',
      icon: '🧪',
      units: {
        m3: { name: '立方米', factor: 1 },
        l: { name: '升', factor: 0.001 },
        ml: { name: '毫升', factor: 1e-6 },
        cm3: { name: '立方厘米', factor: 1e-6 },
        gal: { name: '加仑(美)', factor: 0.00378541 },
        qt: { name: '夸脱', factor: 0.000946353 },
        pt: { name: '品脱', factor: 0.000473176 },
        cup: { name: '杯', factor: 0.000236588 },
        floz: { name: '液盎司', factor: 2.95735e-5 },
      }
    },
    temperature: {
      name: '温度',
      icon: '🌡️',
      units: {
        c: { name: '摄氏度' },
        f: { name: '华氏度' },
        k: { name: '开尔文' },
      }
    },
    speed: {
      name: '速度',
      icon: '💨',
      units: {
        ms: { name: '米/秒', factor: 1 },
        kmh: { name: '千米/时', factor: 0.277778 },
        mph: { name: '英里/时', factor: 0.44704 },
        kn: { name: '节', factor: 0.514444 },
        mach: { name: '马赫', factor: 340.3 },
      }
    },
    pressure: {
      name: '压力',
      icon: '💨',
      units: {
        pa: { name: '帕斯卡', factor: 1 },
        kpa: { name: '千帕', factor: 1000 },
        mpa: { name: '兆帕', factor: 1e6 },
        bar: { name: '巴', factor: 100000 },
        atm: { name: '标准大气压', factor: 101325 },
        mmhg: { name: '毫米汞柱', factor: 133.322 },
        psi: { name: '磅力/平方英寸', factor: 6894.76 },
      }
    },
    data: {
      name: '数据存储',
      icon: '💾',
      units: {
        b: { name: '字节', factor: 1 },
        kb: { name: 'KB', factor: 1024 },
        mb: { name: 'MB', factor: 1048576 },
        gb: { name: 'GB', factor: 1073741824 },
        tb: { name: 'TB', factor: 1099511627776 },
        pb: { name: 'PB', factor: 1.1259e15 },
      }
    },
  }

  const convertTemperature = (value, from, to) => {
    let celsius
    // 先转为摄氏度
    switch (from) {
      case 'c': celsius = value; break
      case 'f': celsius = (value - 32) * 5 / 9; break
      case 'k': celsius = value - 273.15; break
      default: celsius = value
    }
    // 再转为目标单位
    switch (to) {
      case 'c': return celsius
      case 'f': return celsius * 9 / 5 + 32
      case 'k': return celsius + 273.15
      default: return celsius
    }
  }

  const convert = (cat = categories[category], from = fromUnit, to = toUnit) => {
    const value = parseFloat(inputValue)
    if (isNaN(value)) {
      setResult('')
      return
    }

    // 确保单位存在于当前类别中
    if (!cat.units[from] || !cat.units[to]) {
      return
    }
    
    if (category === 'temperature') {
      const converted = convertTemperature(value, from, to)
      setResult(formatNumber(converted))
    } else {
      const fromFactor = cat.units[from].factor
      const toFactor = cat.units[to].factor
      const converted = value * fromFactor / toFactor
      setResult(formatNumber(converted))
    }
  }

  const formatNumber = (num) => {
    if (Math.abs(num) < 0.000001 || Math.abs(num) > 1e9) {
      return num.toExponential(6)
    }
    return parseFloat(num.toFixed(8)).toString()
  }

  const swapUnits = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
  }

  // 当类别改变时，重置单位并触发转换
  useEffect(() => {
    const cat = categories[category]
    const unitKeys = Object.keys(cat.units)
    const newFromUnit = unitKeys[0]
    const newToUnit = unitKeys[1] || unitKeys[0]
    setFromUnit(newFromUnit)
    setToUnit(newToUnit)
    // 类别改变时，使用新的单位立即执行转换
    const value = parseFloat(inputValue)
    if (!isNaN(value)) {
      if (category === 'temperature') {
        const converted = convertTemperature(value, newFromUnit, newToUnit)
        setResult(formatNumber(converted))
      } else {
        const fromFactor = cat.units[newFromUnit].factor
        const toFactor = cat.units[newToUnit].factor
        const converted = value * fromFactor / toFactor
        setResult(formatNumber(converted))
      }
    }
  }, [category])

  // 当输入值或单位改变时转换
  useEffect(() => {
    convert()
  }, [inputValue, fromUnit, toUnit])

  return (
    <div className="tool-panel">
      <h2 className="tool-title">📐 单位换算</h2>
      <p className="tool-desc">支持长度、重量、能量、面积、体积、温度、速度、压力、数据存储等多种单位换算</p>

      <div className="tool-workspace">
        <div className="tool-params">
          <div className="param-group">
            <label>换算类别</label>
            <div className="category-buttons">
              {Object.entries(categories).map(([key, cat]) => (
                <button
                  key={key}
                  className={`category-btn ${category === key ? 'active' : ''}`}
                  onClick={() => setCategory(key)}
                >
                  <span className="category-icon">{cat.icon}</span>
                  <span className="category-name">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="param-group">
            <label>输入数值</label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="converter-input"
              placeholder="输入数值"
            />
          </div>

          <div className="converter-row">
            <div className="converter-unit-group">
              <label>从</label>
              <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="converter-select">
                {Object.entries(categories[category].units).map(([key, unit]) => (
                  <option key={key} value={key}>{unit.name}</option>
                ))}
              </select>
            </div>

            <button className="swap-btn" onClick={swapUnits} title="交换单位">
              ⇄
            </button>

            <div className="converter-unit-group">
              <label>到</label>
              <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="converter-select">
                {Object.entries(categories[category].units).map(([key, unit]) => (
                  <option key={key} value={key}>{unit.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="tool-preview">
          <div className="converter-result">
            <div className="result-label">换算结果</div>
            <div className="result-value-large">
              {result && categories[category].units[toUnit] ? (
                <>
                  <span className="result-number">{result}</span>
                  <span className="result-unit">{categories[category].units[toUnit].name}</span>
                </>
              ) : (
                <span className="result-placeholder">-</span>
              )}
            </div>
            <div className="result-formula">
              {inputValue} {categories[category].units[fromUnit]?.name || ''} = {result || '-'} {categories[category].units[toUnit]?.name || ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UnitConverter
