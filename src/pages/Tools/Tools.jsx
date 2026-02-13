import { Routes, Route, NavLink } from 'react-router-dom'
import {
  Image,
  Grid3x3,
  Text,
  Droplets,
  Minimize2,
  RotateCw,
  ImagePlus,
  FlipHorizontal,
  Film,
  GitCompare,
  FileText,
  Brain,
  Calculator,
  Users,
  Gift,
  Ruler,
  Calendar,
  RefreshCw,
} from 'lucide-react'
import ImageToBase64 from './ImageTools/ImageToBase64'
import ImageGrid from './ImageTools/ImageGrid'
import ImageAddText from './ImageTools/ImageAddText'
import ImageWatermark from './ImageTools/ImageWatermark'
import ImageCompress from './ImageTools/ImageCompress'
import ImageSymmetry from './ImageTools/ImageSymmetry'
import ImageRotate from './ImageTools/ImageRotate'
import VideoFrames from './VideoTools/VideoFrames'
import DiffTool from './DevTools/DiffTool'
import MarkdownPreview from './DevTools/MarkdownPreview'
import MarkmapViewer from './DevTools/MarkmapViewer'
import BIMCalculator from './OtherTools/BIMCalculator'
import RelativeCalculator from './OtherTools/RelativeCalculator'
import Lottery from './OtherTools/Lottery'
import UnitConverter from './OtherTools/UnitConverter'
import DateCalculator from './OtherTools/DateCalculator'
import './Tools.css'

const toolCategories = [
  {
    name: '图像工具',
    items: [
      {
        path: '',
        icon: Image,
        label: '转Base64',
        component: ImageToBase64,
      },
      {
        path: 'grid',
        icon: Grid3x3,
        label: '网格切分',
        component: ImageGrid,
      },
      {
        path: 'addtext',
        icon: Text,
        label: '图片加字',
        component: ImageAddText,
      },
      {
        path: 'watermark',
        icon: Droplets,
        label: '加水印',
        component: ImageWatermark,
      },
      {
        path: 'compress',
        icon: Minimize2,
        label: '图片压缩',
        component: ImageCompress,
      },
      {
        path: 'symmetry',
        icon: FlipHorizontal,
        label: '图像对称',
        component: ImageSymmetry,
      },
      {
        path: 'rotate',
        icon: RefreshCw,
        label: '图像旋转',
        component: ImageRotate,
      },
    ],
  },
  {
    name: '视频工具',
    items: [
      {
        path: 'video-frames',
        icon: Film,
        label: '提取首尾帧',
        component: VideoFrames,
      },
    ],
  },
  {
    name: '开发工具',
    items: [
      {
        path: 'diff',
        icon: GitCompare,
        label: '代码对比',
        component: DiffTool,
      },
      {
        path: 'markdown',
        icon: FileText,
        label: 'MD预览',
        component: MarkdownPreview,
      },
      {
        path: 'markmap',
        icon: Brain,
        label: '思维导图',
        component: MarkmapViewer,
      },
    ],
  },
  {
    name: '其它工具',
    items: [
      {
        path: 'bmi',
        icon: Calculator,
        label: 'BMI计算',
        component: BIMCalculator,
      },
      {
        path: 'relative',
        icon: Users,
        label: '亲戚换算',
        component: RelativeCalculator,
      },
      {
        path: 'lottery',
        icon: Gift,
        label: '抽奖',
        component: Lottery,
      },
      {
        path: 'converter',
        icon: Ruler,
        label: '单位换算',
        component: UnitConverter,
      },
      {
        path: 'date',
        icon: Calendar,
        label: '日期计算',
        component: DateCalculator,
      },
    ],
  },
]

// 扁平化所有工具用于路由
const allTools = toolCategories.flatMap(cat => cat.items)

function Tools() {
  return (
    <div className="tools-page">
      <h1 className="page-title">在线工具</h1>
      <p className="page-description">纯前端实现的实用工具集合</p>

      <div className="tools-container">
        <nav className="tools-nav">
          {toolCategories.map((category) => (
            <div key={category.name} className="tool-category-nav">
              <div className="tool-category-title">{category.name}</div>
              <div className="tool-category-items">
                {category.items.map((tool) => (
                  <NavLink
                    key={tool.path}
                    to={tool.path}
                    end={tool.path === ''}
                    className={({ isActive }) =>
                      `tool-nav-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <tool.icon size={18} />
                    <span>{tool.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="tool-content">
          <Routes>
            <Route path="/" element={<ImageToBase64 />} />
            <Route path="grid" element={<ImageGrid />} />
            <Route path="addtext" element={<ImageAddText />} />
            <Route path="watermark" element={<ImageWatermark />} />
            <Route path="compress" element={<ImageCompress />} />
            <Route path="symmetry" element={<ImageSymmetry />} />
            <Route path="rotate" element={<ImageRotate />} />
            <Route path="video-frames" element={<VideoFrames />} />
            <Route path="diff" element={<DiffTool />} />
            <Route path="markdown" element={<MarkdownPreview />} />
            <Route path="markmap" element={<MarkmapViewer />} />
            <Route path="bmi" element={<BIMCalculator />} />
            <Route path="relative" element={<RelativeCalculator />} />
            <Route path="lottery" element={<Lottery />} />
            <Route path="converter" element={<UnitConverter />} />
            <Route path="date" element={<DateCalculator />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default Tools
