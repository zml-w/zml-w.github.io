import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  Home, 
  Download, 
  Globe, 
  Wrench, 
  Gamepad,
  Info,
  Menu,
  X
} from 'lucide-react'
import './Layout.css'

const navItems = [
  { path: '/', icon: Home, label: '主页' },
  { path: '/software', icon: Download, label: '软件导航' },
  { path: '/websites', icon: Globe, label: '网址收藏' },
  { path: '/tools', icon: Wrench, label: '在线工具' },
  { path: '/games', icon: Gamepad, label: '网页游戏' },
  { path: '/about', icon: Info, label: '关于' },
]

function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const location = useLocation()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  return (
    <div className="layout">
      {/* 顶部导航栏 */}
      <header className="top-header">
        <div className="header-left">
          <h1 className="logo">在梦里w</h1>
        </div>
        
        {/* 桌面端导航 */}
        {!isMobile && (
          <nav className="top-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `top-nav-link ${isActive ? 'active' : ''}`
                }
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        )}

        {/* 移动端菜单按钮 */}
        {isMobile && (
          <button 
            className="menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </header>

      {/* 移动端下拉菜单 */}
      {isMobile && isMobileMenuOpen && (
        <div className="mobile-dropdown">
          <nav className="mobile-dropdown-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `mobile-dropdown-link ${isActive ? 'active' : ''}`
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      {/* 主内容区 */}
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export default Layout
