import { useState } from 'react'
import { Github, Gamepad2, Wrench, Code2, Brain, Palette, Globe, Sparkles, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import './Software.css'

// 分类图标映射
const categoryIcons = {
  '社交娱乐': Gamepad2,
  '系统工具': Wrench,
  '开发工具': Code2,
  'AI编程IDE': Sparkles,
  'AI工具': Brain,
  '其它工具': Settings,
  '创作设计': Palette,
  '网络工具': Globe,
}

// 分类主题色映射
const categoryColors = {
  '社交娱乐': { primary: '#f093fb', secondary: '#f5576c' },
  '系统工具': { primary: '#4facfe', secondary: '#00f2fe' },
  '开发工具': { primary: '#43e97b', secondary: '#38f9d7' },
  'AI编程IDE': { primary: '#ff6b6b', secondary: '#feca57' },
  'AI工具': { primary: '#667eea', secondary: '#764ba2' },
  '其它工具': { primary: '#a8edea', secondary: '#fed6e3' },
  '创作设计': { primary: '#fa709a', secondary: '#fee140' },
  '网络工具': { primary: '#30cfd0', secondary: '#330867' },
}

// 图标加载失败时显示的默认图标
const DefaultIcon = () => (
  <span style={{ fontSize: '28px' }}>🤗</span>
)

const softwareCategories = [
  {
    name: '社交娱乐',
    items: [
      {
        name: '微信',
        icon: 'https://res.wx.qq.com/a/wx_fed/assets/res/NTI4MWU5.ico',
        description: '即时通讯与社交平台',
        url: 'https://weixin.qq.com/',
      },
      {
        name: 'QQ',
        icon: 'https://im.qq.com/favicon.ico',
        description: '即时通讯软件',
        url: 'https://im.qq.com/',
      },
      {
        name: 'Discord',
        icon: 'https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/6266bc493fb42d4e27bb8393_847541504914fd33810e70a0ea73177e.ico',
        description: '语音聊天和社区平台',
        url: 'https://discord.com/',
      },
      {
        name: 'Telegram',
        icon: 'https://telegram.org/favicon.ico',
        description: '安全快速的即时通讯软件',
        url: 'https://telegram.org/',
      },
      {
        name: 'Steam',
        icon: 'https://store.steampowered.com/favicon.ico',
        description: '全球最大的游戏数字发行平台',
        url: 'https://store.steampowered.com/',
      },
      {
        name: '酷狗音乐',
        icon: 'https://www.kugou.com/favicon.ico',
        description: '音乐播放与下载平台',
        url: 'https://www.kugou.com/',
      },
    ],
  },
  {
    name: '系统工具',
    items: [
      {
        name: '火绒安全',
        icon: 'https://www.huorong.cn/favicon.ico',
        description: '轻量级电脑安全防护软件',
        url: 'https://www.huorong.cn/',
      },
      {
        name: '图吧工具箱',
        icon: 'https://www.tbtool.cn/favicon.ico',
        description: '集成了各种硬件检测工具的合集',
        url: 'https://www.tbtool.cn/',
      },
      {
        name: 'Geek Uninstaller',
        icon: 'https://geekuninstaller.com/favicon.ico',
        description: '轻量高效的软件卸载工具',
        url: 'https://geekuninstaller.com/',
      },
      {
        name: '7-Zip',
        icon: 'https://www.7-zip.org/favicon.ico',
        description: '开源免费的文件压缩解压工具',
        url: 'https://www.7-zip.org/',
        githubUrl: 'https://github.com/ip7z/7zip',
      },
      {
        name: 'Google Chrome',
        icon: 'https://www.google.com/chrome/static/images/favicons/favicon-32x32.png',
        description: '谷歌出品的快速安全浏览器',
        url: 'https://www.google.com/chrome/',
      },
      {
        name: 'WSL',
        icon: 'https://www.microsoft.com/favicon.ico',
        description: 'Windows Subsystem for Linux，在Windows上运行Linux环境',
        url: 'https://learn.microsoft.com/zh-cn/windows/wsl/',
      },
    ],
  },
  {
    name: '开发工具',
    items: [
      {
        name: 'VS Code',
        icon: 'https://code.visualstudio.com/favicon.ico',
        description: '微软出品的轻量级代码编辑器',
        url: 'https://code.visualstudio.com/',
        githubUrl: 'https://github.com/microsoft/vscode',
      },
      {
        name: 'PyCharm',
        icon: 'https://www.jetbrains.com/favicon.ico',
        description: 'JetBrains出品的Python集成开发环境',
        url: 'https://www.jetbrains.com/pycharm/',
      },
      {
        name: 'Python',
        icon: 'https://www.python.org/favicon.ico',
        description: '流行的编程语言',
        url: 'https://www.python.org/',
        githubUrl: 'https://github.com/python/cpython',
      },
      {
        name: 'Node.js',
        icon: 'https://nodejs.org/favicon.ico',
        description: 'JavaScript 运行时环境',
        url: 'https://nodejs.org/',
        githubUrl: 'https://github.com/nodejs/node',
      },
      {
        name: 'Docker',
        icon: 'https://www.docker.com/favicon.ico',
        description: '容器化应用部署平台',
        url: 'https://www.docker.com/',
        githubUrl: 'https://github.com/docker',
      },
      {
        name: 'Git',
        icon: 'https://git-scm.com/favicon.ico',
        description: '分布式版本控制系统',
        url: 'https://git-scm.com/',
        githubUrl: 'https://github.com/git/git',
      },
      {
        name: 'FFmpeg',
        icon: 'https://ffmpeg.org/favicon.ico',
        description: '开源音视频处理工具',
        url: 'https://ffmpeg.org/',
        githubUrl: 'https://github.com/FFmpeg/FFmpeg',
      },
    ],
  },
  {
    name: 'AI编程IDE',
    items: [
      {
        name: 'Cursor',
        icon: 'https://www.cursor.com/favicon.ico',
        description: '最强的AI编程IDE',
        url: 'https://www.cursor.com/',
      },
      {
        name: 'Codex',
        icon: 'https://images.ctfassets.net/kftzwdyauwt9/YgXvGzKvVcDvpJGOFyroe/777616dd860276400c9c955688dce373/codex-app.png.png',
        description: 'OpenAI代码生成模型',
        url: 'https://openai.com/codex',
      },
      {
        name: 'Antigravity',
        icon: 'https://antigravity.google/assets/image/antigravity-logo.png',
        description: 'Google推出的AI编程IDE',
        url: 'https://antigravity.google/',
      },
      {
        name: 'GitHub Copilot',
        icon: 'https://github.com/favicon.ico',
        description: 'GitHub AI编程助手',
        url: 'https://github.com/copilot',
      },
      {
        name: 'Trae',
        icon: 'https://lf16-web-neutral.traecdn.ai/obj/trae-ai-static/trae_website/favicon.png',
        description: '字节跳动推出的免费AI编程IDE',
        url: 'https://www.trae.ai/',
      },
      {
        name: 'Qoder',
        icon: 'https://img.alicdn.com/imgextra/i4/O1CN01OQC0dn1xLcdAaRALo_!!6000000006427-2-tps-180-180.png',
        description: 'AI辅助编程工具',
        url: 'https://qoder.ai/',
      },
    ],
  },
  {
    name: 'AI工具',
    items: [
      {
        name: 'Ollama',
        icon: 'https://ollama.com/public/ollama.png',
        description: '本地运行大语言模型的工具',
        url: 'https://ollama.com/',
        githubUrl: 'https://github.com/ollama/ollama',
      },
      {
        name: 'Cherry Studio',
        icon: 'https://www.cherry-ai.com/assets/logo-Bz2G6ABc.png',
        description: '支持多模型服务的AI聊天客户端',
        url: 'https://cherry-ai.com/',
        githubUrl: 'https://github.com/CherryHQ/cherry-studio',
      },
      {
        name: 'ComfyUI',
        icon: 'https://framerusercontent.com/images/VYwSRlkOR01d0rBJ6hcCnzXNBc.png',
        description: '基于节点的Stable Diffusion图形界面',
        url: 'https://www.comfy.org/',
        githubUrl: 'https://github.com/comfyanonymous/ComfyUI',
      },
      {
        name: 'n8n',
        icon: 'https://n8n.io/favicon.ico',
        description: '开源的工作流自动化工具',
        url: 'https://n8n.io/',
        githubUrl: 'https://github.com/n8n-io/n8n',
      },
      {
        name: 'LM Studio',
        icon: 'https://lmstudio.ai/favicon.ico',
        description: '本地运行大语言模型的桌面应用',
        url: 'https://lmstudio.ai/',
      },
      {
        name: 'SillyTavern',
        icon: 'https://sillytavern.app/favicon.ico',
        description: 'AI角色扮演和聊天前端工具（酒馆）',
        url: 'https://sillytavern.app/',
        githubUrl: 'https://github.com/SillyTavern/SillyTavern',
      },
    ],
  },
  {
    name: '其它工具',
    items: [
      {
        name: 'Slidev',
        icon: 'https://sli.dev/favicon.png',
        description: '基于Markdown的演示幻灯片',
        url: 'https://sli.dev/',
        githubUrl: 'https://github.com/slidevjs/slidev',
      },
      {
        name: 'Markmap',
        icon: 'https://markmap.js.org/favicon.png',
        description: '将Markdown转换为思维导图的工具',
        url: 'https://markmap.js.org/',
        githubUrl: 'https://github.com/markmap/markmap',
      },
      {
        name: 'Remotion',
        icon: 'https://avatars.githubusercontent.com/u/85344006?s=48&v=4',
        description: '使用React创建视频的工具',
        url: 'https://www.remotion.dev/',
        githubUrl: 'https://github.com/remotion-dev/remotion',
      },
    ],
  },
  {
    name: '创作设计',
    items: [
      {
        name: 'Blender',
        icon: 'https://www.blender.org/wp-content/themes/bthree/assets/icons/favicon.svg',
        description: '开源免费的三维建模软件',
        url: 'https://www.blender.org/',
        githubUrl: 'https://github.com/blender/blender',
      },
      {
        name: 'Godot',
        icon: 'https://godotengine.org/favicon.ico',
        description: '开源免费的游戏引擎',
        url: 'https://godotengine.org/',
        githubUrl: 'https://github.com/godotengine/godot',
      },
    ],
  },
  {
    name: '网络工具',
    items: [
      {
        name: 'Clash Verge',
        icon: 'https://www.clashverge.dev/assets/logo.png',
        description: '基于Clash的代理工具客户端',
        url: 'https://www.clashverge.dev/',
        githubUrl: 'https://github.com/clash-verge-rev/clash-verge-rev',
      },
    ],
  },
]

function Software() {
  // 跟踪每个图标加载状态
  const [failedIcons, setFailedIcons] = useState(new Set())
  // GitHub跳转开关状态
  const [gotoGithub, setGotoGithub] = useState(false)
  // 侧边栏收起状态
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)

  const handleIconError = (iconUrl) => {
    setFailedIcons(prev => new Set(prev).add(iconUrl))
  }

  // 获取软件链接
  const getSoftwareUrl = (software) => {
    if (gotoGithub && software.githubUrl) {
      return software.githubUrl
    }
    return software.url
  }

  return (
    <div className="software-page">
      <div className="software-header">
        <div className="software-title-section">
          <h1 className="page-title">软件导航</h1>
          <p className="page-description">
            收集了一些常用的软件官方下载链接，点击即可跳转到官网下载。<br />
            如果是开源软件，可通过切换跳转按钮跳转至GitHub仓库页面。
          </p>
        </div>

        <div className="software-header-actions">
          <div className="github-toggle">
            <label className="toggle-label">
              <Github size={18} />
              <span>跳转GitHub</span>
              <div className={`toggle-switch ${gotoGithub ? 'active' : ''}`}>
                <div className="toggle-thumb"></div>
              </div>
              <input
                type="checkbox"
                checked={gotoGithub}
                onChange={(e) => setGotoGithub(e.target.checked)}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <button
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? '展开导航' : '收起导航'}
          >
            {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>

      <div className="software-content">
        <div className={`software-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-header">
            <h3 className="sidebar-title">分类导航</h3>
          </div>
          <nav className="sidebar-nav">
            {softwareCategories.map((category) => {
              const CategoryIcon = categoryIcons[category.name];
              const colors = categoryColors[category.name];
              return (
                <a
                  key={category.name}
                  href={`#category-${category.name}`}
                  className="sidebar-link"
                  style={{
                    '--category-primary': colors.primary,
                    '--category-secondary': colors.secondary,
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(`category-${category.name}`);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                >
                  {CategoryIcon && <CategoryIcon size={16} className="sidebar-icon" />}
                  <span className="sidebar-link-text">{category.name}</span>
                </a>
              );
            })}
          </nav>
        </div>

        <div className="software-main">
          {softwareCategories.map((category) => {
            const CategoryIcon = categoryIcons[category.name]
            const colors = categoryColors[category.name]
            return (
              <div
                key={category.name}
                id={`category-${category.name}`}
                className="software-category"
                style={{
                  '--category-primary': colors.primary,
                  '--category-secondary': colors.secondary,
                }}
              >
                <h2 className="category-title">
                  {CategoryIcon && <CategoryIcon size={22} className="category-icon" />}
                  {category.name}
                </h2>
                <div className="software-list-container">
                  <div className="software-list">
                    {category.items.map((software) => (
                      <a
                        key={software.name}
                        href={getSoftwareUrl(software)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`software-item ${software.githubUrl ? 'has-github' : ''}`}
                        title={gotoGithub && software.githubUrl ? '将跳转到GitHub仓库' : ''}
                      >
                        <div className="software-icon">
                          {failedIcons.has(software.icon) ? (
                            <DefaultIcon />
                          ) : (
                            <img
                              src={software.icon}
                              alt={software.name}
                              onError={() => handleIconError(software.icon)}
                            />
                          )}
                        </div>
                        <div className="software-info">
                          <h3 className="software-name">
                            {software.name}
                            {gotoGithub && software.githubUrl && (
                              <Github size={14} className="github-indicator" />
                            )}
                          </h3>
                          <p className="software-description">{software.description}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Software
