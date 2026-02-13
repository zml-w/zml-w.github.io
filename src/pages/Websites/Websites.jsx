import { useState } from 'react'
import { ExternalLink, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Code2, MessageSquare, Database, Users, Mail, Image, Palette, Brain, Search, GraduationCap, Gamepad2, Github, Wrench } from 'lucide-react'
import './Websites.css'

// 分类图标映射
const categoryIcons = {
  '开发工具': Code2,
  'AI 聊天': MessageSquare,
  'AI 模型': Database,
  '搜索引擎': Search,
  '学术资源': GraduationCap,
  '社交 / 媒体': Users,
  '邮箱': Mail,
  '图片素材': Image,
  '免费素材': Palette,
  '其它工具': Wrench,
  '游戏攻略': Gamepad2,
  '闭源AI网站': Brain,
}

// 分类主题色映射
const categoryColors = {
  '开发工具': { primary: '#43e97b', secondary: '#38f9d7' },
  'AI 聊天': { primary: '#667eea', secondary: '#764ba2' },
  'AI 模型': { primary: '#fa709a', secondary: '#fee140' },
  '搜索引擎': { primary: '#ff9a9e', secondary: '#fecfef' },
  '学术资源': { primary: '#a8edea', secondary: '#fed6e3' },
  '社交 / 媒体': { primary: '#f093fb', secondary: '#f5576c' },
  '邮箱': { primary: '#4facfe', secondary: '#00f2fe' },
  '图片素材': { primary: '#fa709a', secondary: '#fee140' },
  '免费素材': { primary: '#43e97b', secondary: '#38f9d7' },
  '其它工具': { primary: '#a8edea', secondary: '#fed6e3' },
  '游戏攻略': { primary: '#f6d365', secondary: '#fda085' },
  '闭源AI网站': { primary: '#667eea', secondary: '#764ba2' },
}

// 图标加载失败时显示的默认图标
const DefaultIcon = () => (
  <span style={{ fontSize: '24px' }}>🤗</span>
)

const websiteCategories = [
  {
    name: '开发工具',
    items: [
      {
        name: 'GitHub',
        icon: 'https://github.com/favicon.ico',
        description: '全球最大的代码托管平台',
        url: 'https://github.com',
      },
      {
        name: 'npm',
        icon: 'https://static-production.npmjs.com/7a7ffabbd910fc60161bc04f2cee4160.png',
        description: 'Node.js包管理器，最大的JavaScript软件仓库',
        url: 'https://www.npmjs.com/',
      },
      {
        name: 'Python文档',
        icon: 'https://www.python.org/favicon.ico',
        description: 'Python官方文档',
        url: 'https://docs.python.org/3/',
      },
      {
        name: '菜鸟教程',
        icon: 'https://www.runoob.com/favicon.ico',
        description: '编程技术学习网站',
        url: 'https://www.runoob.com/',
      },
    ],
  },
  {
    name: 'AI 聊天',
    items: [
      {
        name: 'Gemini',
        icon: 'https://www.gstatic.com/aistudio/ai_studio_favicon_2_32x32.png',
        description: 'Gemini 智能助手，并且还有Nano Banana和Veo可以使用',
        url: 'https://aistudio.google.com',
      },
      {
        name: 'Claude',
        icon: 'https://claude.ai/favicon.ico',
        description: 'Anthropic AI 助手，代码能力强',
        url: 'https://claude.ai',
      },
      {
        name: 'ChatGPT',
        icon: 'https://chatgpt.com/favicon.ico',
        description: 'OpenAI 智能助手',
        url: 'https://chatgpt.com',
      },
      {
        name: 'Grok',
        icon: 'https://grok.com/images/apple-touch-icon.png',
        description: 'xAI 智能助手，可以涩涩',
        url: 'https://grok.com',
      },
      {
        name: 'DeepSeek',
        icon: 'https://deepseek.com/favicon.ico',
        description: '深度求索 AI 助手，性价比超高',
        url: 'https://deepseek.com',
      },
      {
        name: '豆包',
        icon: 'https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/doubao/chat/favicon.png',
        description: '字节跳动 AI 助手',
        url: 'https://www.doubao.com',
      },
    ],
  },
  {
    name: 'AI 模型',
    items: [
      {
        name: 'Hugging Face',
        icon: 'https://huggingface.co/favicon.ico',
        description: 'AI 模型和数据集平台',
        url: 'https://huggingface.co',
      },
      {
        name: 'Civitai',
        icon: 'https://civitai.com/favicon.ico',
        description: 'AI 艺术模型分享社区',
        url: 'https://civitai.com',
      },
      {
        name: 'Civitai Archive',
        icon: 'https://civitaiarchive.com/favicon.ico',
        description: 'Civitai 模型备份站',
        url: 'https://civitaiarchive.com',
      },
      {
        name: '魔搭社区',
        icon: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://modelscope.cn&size=64',
        description: '阿里 AI 模型社区',
        url: 'https://www.modelscope.cn',
      },
      {
        name: 'Tensor',
        icon: 'https://tensor.art/favicon.ico',
        description: '免费在线AI图像生成和模型托管平台',
        url: 'https://tensor.art/',
      },
    ],
  },
  {
    name: '社交 / 媒体',
    items: [
      {
        name: 'X (Twitter)',
        icon: 'https://x.com/favicon.ico',
        description: '社交媒体平台',
        url: 'https://x.com',
      },
      {
        name: 'Reddit',
        icon: 'https://www.reddit.com/favicon.ico',
        description: '国外论坛社区',
        url: 'https://www.reddit.com',
      },
      {
        name: 'Discord',
        icon: 'https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/6266bc493fb42d4e27bb8393_847541504914fd33810e70a0ea73177e.ico',
        description: '语音聊天和社区平台',
        url: 'https://discord.com',
      },
      {
        name: 'YouTube',
        icon: 'https://www.youtube.com/favicon.ico',
        description: '视频分享平台',
        url: 'https://youtube.com',
      },
      {
        name: 'Bilibili',
        icon: 'https://www.bilibili.com/favicon.ico',
        description: '哔哩哔哩弹幕视频网',
        url: 'https://bilibili.com',
      },
    ],
  },
  {
    name: '其它工具',
    items: [
      {
        name: 'Uiverse',
        icon: 'https://uiverse.io/favicon.ico',
        description: 'MIT开源免费前端UI样式',
        url: 'https://uiverse.io/elements',
        githubUrl: 'https://github.com/uiverse-io/galaxy',
      },
    ],
  },
  {
    name: '邮箱',
    items: [
      {
        name: 'Gmail',
        icon: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
        description: '谷歌邮箱',
        url: 'https://mail.google.com',
      },
      {
        name: 'Outlook',
        icon: 'https://outlook.live.com/favicon.ico',
        description: '微软邮箱',
        url: 'https://outlook.live.com',
      },
      {
        name: 'QQ邮箱',
        icon: 'https://mail.qq.com/favicon.ico',
        description: '腾讯邮箱',
        url: 'https://mail.qq.com',
      },
      {
        name: 'TempMail',
        icon: 'https://temp-mail.org/favicon.ico',
        description: '临时邮箱',
        url: 'https://temp-mail.org',
      },
      {
        name: '10分钟邮箱',
        icon: 'https://10minutemail.com/favicon.ico',
        description: '十分钟临时邮箱',
        url: 'https://10minutemail.com',
      },
    ],
  },
  {
    name: '搜索引擎',
    items: [
      {
        name: 'Google',
        icon: 'https://www.google.com/favicon.ico',
        description: '全球最大的搜索引擎',
        url: 'https://www.google.com',
      },
      {
        name: '百度',
        icon: 'https://www.baidu.com/favicon.ico',
        description: '中文搜索引擎',
        url: 'https://www.baidu.com',
      },
      {
        name: 'Bing',
        icon: 'https://www.bing.com/favicon.ico',
        description: '微软搜索引擎',
        url: 'https://www.bing.com',
      },
    ],
  },
  {
    name: '学术资源',
    items: [
      {
        name: '中国大学MOOC',
        icon: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.icourse163.org/&size=64',
        description: '优质在线课程学习平台',
        url: 'https://www.icourse163.org/',
      },
      {
        name: 'arXiv',
        icon: 'https://arxiv.org/static/browse/0.3.4/images/icons/favicon-32x32.png',
        description: '学术论文预印本平台',
        url: 'https://arxiv.org/',
      },
      {
        name: '中国知网',
        icon: 'https://www.cnki.net/favicon.ico',
        description: '中文学术文献数据库',
        url: 'https://www.cnki.net/',
      },
    ],
  },
  {
    name: '图片素材',
    items: [
      {
        name: 'Safebooru',
        icon: 'https://safebooru.org/favicon.ico',
        description: '安全向动漫图片搜索引擎',
        url: 'https://safebooru.org/',
      },
      {
        name: 'Safebooru (Danbooru)',
        icon: 'https://safebooru.donmai.us/favicon.ico',
        description: 'Danbooru安全版',
        url: 'https://safebooru.donmai.us/',
      },
      {
        name: 'Pixiv',
        icon: 'https://www.pixiv.net/favicon.ico',
        description: '日本插画分享社区',
        url: 'https://www.pixiv.net',
      },
    ],
  },
  {
    name: '免费素材',
    items: [
      {
        name: '模之屋',
        icon: 'https://www.aplaybox.com/favicon.ico',
        description: '3D 模型分享社区',
        url: 'https://www.aplaybox.com',
      },
      {
        name: '爱给网',
        icon: 'https://www.aigei.com/favicon.ico',
        description: '免费素材下载站',
        url: 'https://www.aigei.com',
      },
    ],
  },

  {
    name: '游戏攻略',
    items: [
      {
        name: 'Nexus Mods',
        icon: 'https://www.nexusmods.com/favicon.ico',
        description: '游戏Mod下载平台',
        url: 'https://www.nexusmods.com/',
      },
      {
        name: 'Chunk Base',
        icon: 'https://www.chunkbase.com/favicon.ico',
        description: 'Minecraft工具和资源网站',
        url: 'https://www.chunkbase.com/',
      },
    ],
  },

  {
    name: '闭源AI网站',
    items: [
      {
        name: '图像',
        subItems: [
          {
            name: 'NovelAI',
            icon: 'https://novelai.net/icons/novelai-round.png',
            description: '二次元动漫风格AI绘画，擅长生成高质量插画',
            url: 'https://novelai.net',
          },
          {
            name: 'MidJourney',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADpUlEQVRYhe2WDUyUdRzHP4fHUXfcAcEhnS68LjKcLdcbRC+SK9udUmsWwjId1RyryC2tIS8OIyWzTGMmWBkzmZY4sCR7oaSR4ViuF14ixANGEXB3tHvuBO+4g/Y8bfayO+9s3GiN3/bf83//f/Z7+e6Rjbk9k0yjhU3n4zMAMwBBATid56YX4LEnnqKwuJShYUtIAGSBdOBEYxOtre38MvAri264nuysh6YUIKAH0hffwVlzD9vKNhMZqSK/oASr1caq1WvZ/+5BvF5vaAFkMhnJyfPp/OkMGcuNPJ7zKCUvlLGp6Hlq646xMjuHwcGh0AGIds+SdBobm6R+UpKBgvwN7CqvoOKN1wgPD2fds/l0dXWHDsBg0NPT23dhrNMlsGF9Hi+/soudO8qIiY5m9563/hVEUABiGMT2V9PPS2SZ6T4++PA4y0xLSU25mfLdexkYGJx6AH+25O67pOpYuHABzadaKNy4nq0vvXpJiRk0wOSk72pdl5dLReU+sjJX0PDFl2StXME7VdVTC+B0OlGpVD7XYmKi0emuJDbuClpaTnN7Wgrd3WZGRn4LCiCgEInW8Hkjbrcbk3Gpz3VRF/ZU7uMagx69PhGtNo7a2mNSogayoDzwWcMJ0hffyfj4OJ2dXXx18hRfN7dwpvusNBcXF4vdbsdovJfjHzdguFqPxWrl3OhowLvlgTb80NpOX1+/JD7yWXJJB7TaWCYmJujo6KSqpxqX201//8/YrCN4PB7yN5ZgNvdSX/8JmQ8/eNH7LxoCMfHW5OSSkWHkgQwTCoXC777vvm9lXuJVREQosNsFqTpE8KgojZQnN9246NIAHA4n5p5eBEFAEJzYBQGH4JC+guDA6/EyyR9HZcikvqgVSuXlaNRqNFEaXOddHK6pY0tpMampt/gE8BuCb05/y6H3j3D/chMajZq5c3VEaTRSX2xyuf/oieGpOXKUtrYODla/TXy81u/eWUXFm0p8ekBwUHe0XkouUenE2KvVkew/cIjDNbW4XC7mX5sk7a3/6FP2vlkl5Yvo/tfLK6VKEO9oOtnMnDk6aezLfIagdMt2LotQ8ExeLmNj5ynbtkPSgaGhYVY9ksltqbdyoPo96UHR7QuSr2PN6mza2n+koHAzaWkpDA9bKCp4DqVSyYtbt5OQEM/TT64NDkCs+X8mnMPhkCDCwv6s3NHRMSkBVSrlhTmPx4vNZmP27Pi/nbdYrD69EJQQhdL++3/FMwD/e4DfAf5WhGt8Cd3XAAAAAElFTkSuQmCC',
            description: '艺术风格AI绘画，生成精美写实和概念艺术作品',
            url: 'https://www.midjourney.com',
          },
          {
            name: 'Mixboard',
            icon: 'https://www.gstatic.com/canvas/mixboard_favicon_32x32.png',
            description: '谷歌的无限画布',
            url: 'https://mixboard.google.com/',
          },
        ],
      },
      {
        name: '视频',
        subItems: [
          {
            name: '海螺AI',
            icon: 'https://hailuoai.com/favicon.ico',
            description: 'MiniMax旗下AI视频生成平台',
            url: 'https://hailuoai.com/',
          },
          {
            name: '即梦',
            icon: 'data:image/png;base64,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',
            description: '字节跳动旗下AI视频生成工具',
            url: 'https://jimeng.jianying.com/ai-tool/home',
          },
          {
            name: '可灵',
            icon: 'https://app.klingai.com/favicon.ico',
            description: '快手旗下AI视频生成平台',
            url: 'https://app.klingai.com/cn/',
          },
          {
            name: 'Sora',
            icon: 'https://openai.com/favicon.ico',
            description: 'OpenAI旗下AI视频生成模型',
            url: 'https://openai.com/sora',
          },
        ],
      },
      {
        name: '音乐',
        subItems: [
          {
            name: 'Suno',
            icon: 'https://suno.com/favicon.ico',
            description: 'AI音乐生成平台，输入提示词即可创作歌曲',
            url: 'https://suno.com/',
          },
        ],
      },
      {
        name: '3D',
        subItems: [
          {
            name: '腾讯混元3D',
            icon: 'https://cdn-3d-prod.hunyuan.tencent.com/public/static/favicon/apple-touch-icon.png',
            description: '腾讯旗下AI 3D模型生成平台',
            url: 'https://3d.hunyuan.tencent.com/',
          },
          {
            name: 'Tripo3D',
            icon: 'https://www.tripo3d.ai/favicon.ico',
            description: 'AI 3D模型生成工具，支持图片转3D',
            url: 'https://www.tripo3d.ai/',
          },
        ],
      },
    ],
  },
]

function Websites() {
  // 跟踪每个图标加载状态
  const [failedIcons, setFailedIcons] = useState(new Set())
  const [collapsedCategories, setCollapsedCategories] = useState(new Set(['闭源AI网站']))
  // GitHub跳转开关状态
  const [gotoGithub, setGotoGithub] = useState(false)
  // 侧边栏收起状态
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)

  const handleIconError = (iconUrl) => {
    setFailedIcons(prev => new Set(prev).add(iconUrl))
  }

  // 获取网站链接
  const getWebsiteUrl = (site) => {
    if (gotoGithub && site.githubUrl) {
      return site.githubUrl
    }
    return site.url
  }

  const toggleCategory = (categoryName) => {
    setCollapsedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName)
      } else {
        newSet.add(categoryName)
      }
      return newSet
    })
  }

  return (
    <div className="websites-page">
      <div className="websites-header">
        <div className="websites-title-section">
          <h1 className="page-title">网址收藏</h1>
          <p className="page-description">收藏的常用网站快捷入口<br />如果是开源项目，可通过切换跳转按钮跳转至GitHub仓库页面。</p>
        </div>

        <div className="websites-header-actions">
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

      <div className="websites-content">
        <div className={`websites-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-header">
            <h3 className="sidebar-title">分类导航</h3>
          </div>
          <nav className="sidebar-nav">
            {websiteCategories.map((category) => {
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

        <div className="websites-main">
          {websiteCategories.map((category) => {
            const isCollapsed = collapsedCategories.has(category.name);
            const hasSubItems = category.name === '闭源AI网站';
            const CategoryIcon = categoryIcons[category.name];
            const colors = categoryColors[category.name];
            
            if (hasSubItems) {
              // 闭源AI网站使用折叠样式
              return (
                <div
                  key={category.name}
                  id={`category-${category.name}`}
                  className="category-section"
                  style={{
                    '--category-primary': colors.primary,
                    '--category-secondary': colors.secondary,
                  }}
                >
                  <button
                    className="changelog-toggle"
                    onClick={() => toggleCategory(category.name)}
                  >
                    <h2 className="category-title">
                      {CategoryIcon && <CategoryIcon size={20} className="category-icon" />}
                      {category.name}
                    </h2>
                    {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                  </button>
                  
                  {!isCollapsed && (
                    <>
                      {category.items.map((site) => (
                        <div key={site.name} className="subcategory-section">
                          <h3 className="subcategory-title">{site.name}</h3>
                          <div className="websites-grid-container">
                            <div className="websites-grid">
                              {site.subItems ? (
                                // 有子分类的情况
                                site.subItems.map((subSite) => (
                                  <a
                                    key={subSite.name}
                                    href={getWebsiteUrl(subSite)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`website-card ${subSite.githubUrl ? 'has-github' : ''}`}
                                    title={gotoGithub && subSite.githubUrl ? '将跳转到GitHub仓库' : ''}
                                  >
                                    <div className="website-icon">
                                      {failedIcons.has(subSite.icon) ? (
                                        <DefaultIcon />
                                      ) : (
                                        <img
                                          src={subSite.icon}
                                          alt={subSite.name}
                                          onError={() => handleIconError(subSite.icon)}
                                        />
                                      )}
                                    </div>
                                    <div className="website-info">
                                      <h3 className="website-name">
                                        {subSite.name}
                                        {gotoGithub && subSite.githubUrl && (
                                          <Github size={14} className="github-indicator" />
                                        )}
                                        <ExternalLink size={14} className="link-icon" />
                                      </h3>
                                      <p className="website-description">{subSite.description}</p>
                                    </div>
                                  </a>
                                ))
                              ) : (
                                // 普通网站
                                <a
                                  key={site.name}
                                  href={getWebsiteUrl(site)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`website-card ${site.githubUrl ? 'has-github' : ''}`}
                                  title={gotoGithub && site.githubUrl ? '将跳转到GitHub仓库' : ''}
                                >
                                  <div className="website-icon">
                                    {failedIcons.has(site.icon) ? (
                                      <DefaultIcon />
                                    ) : (
                                      <img
                                        src={site.icon}
                                        alt={site.name}
                                        onError={() => handleIconError(site.icon)}
                                      />
                                    )}
                                  </div>
                                  <div className="website-info">
                                    <h3 className="website-name">
                                      {site.name}
                                      {gotoGithub && site.githubUrl && (
                                        <Github size={14} className="github-indicator" />
                                      )}
                                      <ExternalLink size={14} className="link-icon" />
                                    </h3>
                                    <p className="website-description">{site.description}</p>
                                  </div>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              );
            } else {
              // 其他分类保持原样
              return (
                <div
                  key={category.name}
                  id={`category-${category.name}`}
                  className="category-section"
                  style={{
                    '--category-primary': colors.primary,
                    '--category-secondary': colors.secondary,
                  }}
                >
                  <h2 className="category-title">
                    {CategoryIcon && <CategoryIcon size={20} className="category-icon" />}
                    {category.name}
                  </h2>
                  <div className="websites-grid-container">
                    <div className="websites-grid">
                      {category.items.map((site) => (
                        <a
                          key={site.name}
                          href={getWebsiteUrl(site)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`website-card ${site.githubUrl ? 'has-github' : ''}`}
                          title={gotoGithub && site.githubUrl ? '将跳转到GitHub仓库' : ''}
                        >
                          <div className="website-icon">
                            {failedIcons.has(site.icon) ? (
                              <DefaultIcon />
                            ) : (
                              <img
                                src={site.icon}
                                alt={site.name}
                                onError={() => handleIconError(site.icon)}
                              />
                            )}
                          </div>
                          <div className="website-info">
                            <h3 className="website-name">
                              {site.name}
                              {gotoGithub && site.githubUrl && (
                                <Github size={14} className="github-indicator" />
                              )}
                              <ExternalLink size={14} className="link-icon" />
                            </h3>
                            <p className="website-description">{site.description}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  )
}

export default Websites
