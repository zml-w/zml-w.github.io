import { useState, useEffect, useCallback, useRef } from 'react'
import './SnakeGame.css'

const BOARD_SIZE = 20
const INITIAL_SPEED = 150

function SnakeGame() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }])
  const [food, setFood] = useState({ x: 15, y: 15 })
  const [direction, setDirection] = useState({ x: 0, y: 0 })
  const [nextDirection, setNextDirection] = useState({ x: 0, y: 0 })
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(() => {
    return parseInt(localStorage.getItem('snake-best-score') || '0')
  })
  const [isPaused, setIsPaused] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const gameLoopRef = useRef(null)
  const speedRef = useRef(INITIAL_SPEED)

  const generateFood = useCallback((currentSnake) => {
    let newFood
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE)
      }
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [])

  const resetGame = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }]
    setSnake(initialSnake)
    setFood(generateFood(initialSnake))
    setDirection({ x: 0, y: 0 })
    setNextDirection({ x: 0, y: 0 })
    setGameOver(false)
    setScore(0)
    setIsPaused(false)
    setIsPlaying(false)
    speedRef.current = INITIAL_SPEED
  }, [generateFood])

  const startGame = useCallback(() => {
    if (!isPlaying && !gameOver) {
      setIsPlaying(true)
      setDirection({ x: 1, y: 0 })
      setNextDirection({ x: 1, y: 0 })
    }
  }, [isPlaying, gameOver])

  const togglePause = useCallback(() => {
    if (isPlaying && !gameOver) {
      setIsPaused(prev => !prev)
    }
  }, [isPlaying, gameOver])

  useEffect(() => {
    if (!isPlaying || isPaused || gameOver) return

    const gameLoop = () => {
      setDirection(nextDirection)

      setSnake(currentSnake => {
        const newSnake = [...currentSnake]
        const head = { ...newSnake[0] }
        head.x += nextDirection.x
        head.y += nextDirection.y

        // 检查撞墙
        if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
          setGameOver(true)
          return currentSnake
        }

        // 检查撞到自己
        if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true)
          return currentSnake
        }

        newSnake.unshift(head)

        // 检查是否吃到食物
        if (head.x === food.x && head.y === food.y) {
          setScore(prev => {
            const newScore = prev + 10
            if (newScore > bestScore) {
              setBestScore(newScore)
              localStorage.setItem('snake-best-score', newScore.toString())
            }
            return newScore
          })
          setFood(generateFood(newSnake))
          // 加速
          speedRef.current = Math.max(50, INITIAL_SPEED - Math.floor(newSnake.length / 5) * 10)
        } else {
          newSnake.pop()
        }

        return newSnake
      })
    }

    gameLoopRef.current = setInterval(gameLoop, speedRef.current)

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [isPlaying, isPaused, gameOver, nextDirection, food, generateFood, bestScore])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          if (direction.y === 0) {
            setNextDirection({ x: 0, y: -1 })
            if (!isPlaying) startGame()
          }
          break
        case 'ArrowDown':
          e.preventDefault()
          if (direction.y === 0) {
            setNextDirection({ x: 0, y: 1 })
            if (!isPlaying) startGame()
          }
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (direction.x === 0) {
            setNextDirection({ x: -1, y: 0 })
            if (!isPlaying) startGame()
          }
          break
        case 'ArrowRight':
          e.preventDefault()
          if (direction.x === 0) {
            setNextDirection({ x: 1, y: 0 })
            if (!isPlaying) startGame()
          }
          break
        case ' ':
          e.preventDefault()
          togglePause()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [direction, gameOver, isPlaying, startGame, togglePause])

  const renderBoard = () => {
    const board = []
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        let cellClass = 'snake-cell'
        const isSnake = snake.some(segment => segment.x === x && segment.y === y)
        const isFood = food.x === x && food.y === y
        const isHead = snake[0]?.x === x && snake[0]?.y === y

        if (isHead) {
          cellClass += ' snake-head'
        } else if (isSnake) {
          cellClass += ' snake-body'
        } else if (isFood) {
          cellClass += ' snake-food'
        }

        board.push(
          <div
            key={`${x}-${y}`}
            className={cellClass}
          />
        )
      }
    }
    return board
  }

  return (
    <div className="snake-game">
      <div className="snake-game-header">
        <div className="snake-game-scores">
          <div className="score-box">
            <span className="score-label">得分</span>
            <span className="score-value">{score}</span>
          </div>
          <div className="score-box">
            <span className="score-label">最高分</span>
            <span className="score-value">{bestScore}</span>
          </div>
        </div>
        <div className="snake-game-controls">
          {isPlaying && !gameOver && (
            <button className="btn" onClick={togglePause}>
              {isPaused ? '继续' : '暂停'}
            </button>
          )}
          <button className="btn btn-primary" onClick={resetGame}>
            新游戏
          </button>
        </div>
      </div>

      <div className="snake-board-container">
        <div
          className="snake-board"
          style={{
            gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`
          }}
        >
          {renderBoard()}
        </div>

        {!isPlaying && !gameOver && (
          <div className="snake-overlay">
            <div className="snake-message">
              <h2>贪吃蛇</h2>
              <p>按方向键开始游戏</p>
              <button className="btn btn-primary" onClick={startGame}>
                开始游戏
              </button>
            </div>
          </div>
        )}

        {isPaused && (
          <div className="snake-overlay">
            <div className="snake-message">
              <h2>已暂停</h2>
              <p>按空格键或点击继续按钮恢复</p>
              <button className="btn btn-primary" onClick={togglePause}>
                继续游戏
              </button>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="snake-overlay">
            <div className="snake-message">
              <h2>游戏结束！</h2>
              <p>最终得分: {score}</p>
              <button className="btn btn-primary" onClick={resetGame}>
                再玩一次
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="snake-instructions">
        <p>使用方向键 <strong>↑ ↓ ← →</strong> 控制蛇的移动</p>
        <p>按 <strong>空格键</strong> 暂停/继续游戏</p>
        <p>吃到食物得分，撞墙或撞到自己游戏结束！</p>
      </div>
    </div>
  )
}

export default SnakeGame
