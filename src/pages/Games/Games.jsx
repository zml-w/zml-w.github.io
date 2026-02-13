import { Routes, Route, NavLink } from 'react-router-dom'
import { Ghost, Puzzle } from 'lucide-react'
import SnakeGame from './SnakeGame'
import PuzzleGame from './PuzzleGame'
import './Games.css'

const gameCategories = [
  {
    name: '休闲游戏',
    items: [
      {
        path: '',
        icon: Ghost,
        label: '贪吃蛇',
      },
      {
        path: 'puzzle',
        icon: Puzzle,
        label: '拼图游戏',
      },
    ],
  },
]

function Games() {
  return (
    <div className="games-page">
      <h1 className="page-title">网页游戏</h1>
      <p className="page-description">纯前端实现的小游戏</p>

      <div className="games-container">
        <nav className="games-nav">
          {gameCategories.map((category) => (
            <div key={category.name} className="game-category-nav">
              <div className="game-category-title">{category.name}</div>
              <div className="game-category-items">
                {category.items.map((game) => (
                  <NavLink
                    key={game.path}
                    to={game.path}
                    end={game.path === ''}
                    className={({ isActive }) =>
                      `game-nav-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <game.icon size={18} />
                    <span>{game.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="game-content">
          <Routes>
            <Route path="/" element={<SnakeGame />} />
            <Route path="puzzle" element={<PuzzleGame />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default Games
