import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home/Home'
import Software from './pages/Software/Software'
import Websites from './pages/Websites/Websites'
import Tools from './pages/Tools/Tools'
import Games from './pages/Games/Games'
import About from './pages/About/About'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/software" element={<Software />} />
        <Route path="/websites" element={<Websites />} />
        <Route path="/tools/*" element={<Tools />} />
        <Route path="/games/*" element={<Games />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Layout>
  )
}

export default App
