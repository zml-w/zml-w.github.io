import { useState, useEffect } from 'react'
import '../Tools.css'

function RelativeCalculator() {
  const [relationChain, setRelationChain] = useState([])
  const [result, setResult] = useState('')

  const relationLabels = {
    'father': '父亲',
    'mother': '母亲',
    'brother': '哥哥/弟弟',
    'sister': '姐姐/妹妹',
    'son': '儿子',
    'daughter': '女儿',
    'husband': '丈夫',
    'wife': '妻子',
  }

  // 简化关系链 - 处理循环关系
  const simplifyChain = (chain) => {
    const simplified = [...chain]
    let changed = true
    
    while (changed && simplified.length > 0) {
      changed = false
      
      // 检查最后两个关系是否可以抵消
      const len = simplified.length
      if (len >= 2) {
        const last = simplified[len - 1]
        const secondLast = simplified[len - 2]
        
        // 互为逆关系则抵消
        const inversePairs = [
          ['father', 'son'],
          ['mother', 'son'],
          ['father', 'daughter'],
          ['mother', 'daughter'],
          ['husband', 'wife'],
          ['brother', 'brother'],
          ['sister', 'sister'],
        ]
        
        for (const [a, b] of inversePairs) {
          if ((secondLast === a && last === b) || (secondLast === b && last === a)) {
            simplified.pop()
            simplified.pop()
            changed = true
            break
          }
        }
      }
    }
    
    return simplified
  }

  // 亲戚关系映射表
  const relationMap = {
    // 基础关系
    'father': '父亲',
    'mother': '母亲',
    'brother': '哥哥/弟弟',
    'sister': '姐姐/妹妹',
    'son': '儿子',
    'daughter': '女儿',
    'husband': '丈夫',
    'wife': '妻子',
    
    // 祖辈
    'father father': '爷爷',
    'father mother': '奶奶',
    'mother father': '外公',
    'mother mother': '外婆',
    'father father father': '太爷爷',
    'father father mother': '太奶奶',
    'father mother father': '太外公',
    'father mother mother': '太外婆',
    'mother father father': '太爷爷',
    'mother father mother': '太奶奶',
    'mother mother father': '太外公',
    'mother mother mother': '太外婆',
    
    // 兄弟姐妹及配偶
    'brother wife': '嫂子/弟媳',
    'sister husband': '姐夫/妹夫',
    
    // 父辈
    'father brother': '伯父/叔叔',
    'father sister': '姑姑',
    'mother brother': '舅舅',
    'mother sister': '姨妈',
    'father brother wife': '伯母/婶婶',
    'father sister husband': '姑父',
    'mother brother wife': '舅妈',
    'mother sister husband': '姨父',
    
    // 祖辈的兄弟姐妹
    'father father brother': '伯祖父/叔祖父',
    'father father sister': '姑奶奶',
    'father mother brother': '舅爷爷',
    'father mother sister': '姨奶奶',
    'mother father brother': '伯外公/叔外公',
    'mother father sister': '姑外婆',
    'mother mother brother': '舅外公',
    'mother mother sister': '姨外婆',
    
    // 子女及配偶
    'son wife': '儿媳',
    'daughter husband': '女婿',
    
    // 孙辈
    'son son': '孙子',
    'son daughter': '孙女',
    'daughter son': '外孙',
    'daughter daughter': '外孙女',
    
    // 兄弟姐妹的子女
    'brother son': '侄子',
    'brother daughter': '侄女',
    'sister son': '外甥',
    'sister daughter': '外甥女',
    
    // 兄弟姐妹的孙辈
    'brother son son': '侄孙',
    'brother son daughter': '侄孙女',
    'sister son son': '外甥孙',
    'sister son daughter': '外甥孙女',
    
    // 堂表亲
    'father brother son': '堂哥/堂弟',
    'father brother daughter': '堂姐/堂妹',
    'father sister son': '表哥/表弟',
    'father sister daughter': '表姐/表妹',
    'mother brother son': '表哥/表弟',
    'mother brother daughter': '表姐/表妹',
    'mother sister son': '表哥/表弟',
    'mother sister daughter': '表姐/表妹',
    
    // 循环关系 - 回到自己
    'husband wife': '自己',
    'wife husband': '自己',
    'father son': '自己/哥哥/弟弟',
    'mother son': '自己/哥哥/弟弟',
    'father daughter': '自己/姐姐/妹妹',
    'mother daughter': '自己/姐姐/妹妹',
    'son father': '自己/丈夫',
    'daughter father': '自己/丈夫',
    'son mother': '自己/妻子',
    'daughter mother': '自己/妻子',
    
    // 配偶的父母
    'wife father': '岳父',
    'wife mother': '岳母',
    'husband father': '公公',
    'husband mother': '婆婆',
    
    // 配偶的祖辈
    'wife father father': '太岳父',
    'wife father mother': '太岳母',
    'wife mother father': '太岳父',
    'wife mother mother': '太岳母',
    'husband father father': '太公公',
    'husband father mother': '太婆婆',
    'husband mother father': '太公公',
    'husband mother mother': '太婆婆',
    
    // 配偶的兄弟姐妹
    'wife brother': '大舅子/小舅子',
    'wife sister': '大姨子/小姨子',
    'husband brother': '大伯子/小叔子',
    'husband sister': '大姑子/小姑子',
    
    // 配偶兄弟姐妹的子女
    'wife brother son': '外甥',
    'wife brother daughter': '外甥女',
    'wife sister son': '外甥',
    'wife sister daughter': '外甥女',
    'husband brother son': '侄子',
    'husband brother daughter': '侄女',
    'husband sister son': '外甥',
    'husband sister daughter': '外甥女',
  }

  // 计算关系链
  const calculateRelation = () => {
    if (relationChain.length === 0) {
      setResult('')
      return
    }

    // 先简化关系链（处理循环关系）
    const simplifiedChain = simplifyChain(relationChain)
    
    // 如果简化为空，就是自己
    if (simplifiedChain.length === 0) {
      setResult('自己')
      return
    }

    const chainKey = simplifiedChain.join(' ')
    
    // 直接查找完整匹配
    if (relationMap[chainKey]) {
      setResult(relationMap[chainKey])
      return
    }

    // 尝试简化计算（取最后几个关系）
    for (let i = Math.max(0, simplifiedChain.length - 4); i < simplifiedChain.length; i++) {
      const subChain = simplifiedChain.slice(i).join(' ')
      if (relationMap[subChain]) {
        setResult(relationMap[subChain])
        return
      }
    }

    // 如果没找到，尝试逐层计算
    let current = simplifiedChain[0]
    let result = relationMap[current]
    
    if (!result) {
      setResult('关系太远啦')
      return
    }

    for (let i = 1; i < simplifiedChain.length; i++) {
      const newKey = current + ' ' + simplifiedChain[i]
      if (relationMap[newKey]) {
        current = newKey
        result = relationMap[newKey]
      } else {
        setResult('关系太远啦')
        return
      }
    }

    setResult(result)
  }

  // 实时计算关系
  useEffect(() => {
    calculateRelation()
  }, [relationChain])

  const addRelation = (rel) => {
    setRelationChain(prev => [...prev, rel])
  }

  const clearRelation = () => {
    setRelationChain([])
  }

  const removeLastRelation = () => {
    setRelationChain(prev => prev.slice(0, -1))
  }

  return (
    <div className="tool-panel">
      <h2 className="tool-title">亲戚关系换算</h2>
      <p className="tool-desc">计算复杂的亲戚称呼关系</p>

      <div className="tool-workspace">
        <div className="tool-params">
          <div className="param-group">
            <label>关系链</label>
            <div className="relation-display">
              {relationChain.length > 0 
                ? relationChain.map(r => relationLabels[r]).join('的')
                : '点击按钮添加关系'
              }
            </div>
            <div className="relation-buttons">
              <button onClick={() => addRelation('father')} className="relation-btn">父亲</button>
              <button onClick={() => addRelation('mother')} className="relation-btn">母亲</button>
              <button onClick={() => addRelation('brother')} className="relation-btn">哥哥/弟弟</button>
              <button onClick={() => addRelation('sister')} className="relation-btn">姐姐/妹妹</button>
              <button onClick={() => addRelation('son')} className="relation-btn">儿子</button>
              <button onClick={() => addRelation('daughter')} className="relation-btn">女儿</button>
              <button onClick={() => addRelation('husband')} className="relation-btn">丈夫</button>
              <button onClick={() => addRelation('wife')} className="relation-btn">妻子</button>
            </div>
          </div>

          <div className="param-actions">
            <button onClick={removeLastRelation} className="tool-btn secondary" disabled={relationChain.length === 0}>
              撤销
            </button>
            <button onClick={clearRelation} className="tool-btn secondary">
              清空
            </button>
          </div>
        </div>

        <div className="tool-preview">
          {result ? (
            <div className="relation-result">
              <div className="result-value">{result}</div>
            </div>
          ) : (
            <div className="preview-placeholder">
              选择关系后自动计算
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RelativeCalculator
