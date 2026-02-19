import { useState, useEffect, useMemo } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import './About.css'

// 随机图片组件
function RandomImage() {
  const images = useMemo(() => [
    '/image/雾雨魔理沙.png',
    '/image/博丽灵梦.png'
  ], [])

  const [randomImage, setRandomImage] = useState('')

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * images.length)
    setRandomImage(images[randomIndex])
  }, [images])

  if (!randomImage) return null

  return (
    <div className="random-image-container">
      <img src={randomImage} alt="随机图片" className="random-image" />
    </div>
  )
}

function About() {
  const [planExpanded, setPlanExpanded] = useState(false)
  const [changelogExpanded, setChangelogExpanded] = useState(false)
  const [expandedItems, setExpandedItems] = useState({ 0: true }) // 默认展开第一条

  return (
    <>
      <RandomImage />
      <div className="about-page">
        <h1 className="page-title">关于</h1>

        <div className="about-layout">
          <div className="about-content">
        <section className="about-section">
          <h2>项目介绍</h2>
          <p>
            这是一个基于 React 开发的纯前端个人主页项目，部署在 GitHub Pages 上。<br />
            包含了软件导航、网址收藏、在线工具、网页游戏等功能……或许未来还会添加些其他的。
          </p>
        </section>

        <section className="about-section">
          <h2>网站技术栈</h2>
          <div className="tech-stack">
            <div className="tech-item">
              <span className="tech-name">HTML5</span>
              <span className="tech-desc">页面结构</span>
            </div>
            <div className="tech-item">
              <span className="tech-name">CSS3</span>
              <span className="tech-desc">样式设计</span>
            </div>
            <div className="tech-item">
              <span className="tech-name">JavaScript</span>
              <span className="tech-desc">交互逻辑</span>
            </div>
            <div className="tech-item">
              <span className="tech-name">React 18</span>
              <span className="tech-desc">前端框架</span>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>功能模块</h2>
          <ul className="feature-list">
            <li>
              <strong>主页</strong> - 个人介绍，包含粒子背景动画、天气切换、音乐播放器
            </li>
            <li>
              <strong>软件导航</strong> - 常用软件的官方下载链接
            </li>
            <li>
              <strong>网址收藏</strong> - 常用网站的快捷入口
            </li>
            <li>
              <strong>在线工具</strong> - 图像工具、视频工具、开发工具、其它工具
            </li>
            <li>
              <strong>网页游戏</strong> - 简单的网页游戏
            </li>

          </ul>
        </section>

        <section className="about-section plan-section">
          <button
            className="plan-toggle"
            onClick={() => setPlanExpanded(!planExpanded)}
          >
            <h2>未来计划</h2>
            {planExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {planExpanded && (
            <ul className="plan-list">
              <li className="plan-item">
                <div className="plan-header">
                  <strong>桌面宠物</strong>
                  <span className="plan-status pending">待开发</span>
                </div>
                <div className="plan-desc">可以跟着音乐跳舞，可以接入LLM模型进行智能交互</div>
                <div className="plan-date">创建日期：2026-02-09</div>
              </li>
              <li className="plan-item">
                <div className="plan-header">
                  <strong>鼠标指针皮肤</strong>
                  <span className="plan-status pending">待开发</span>
                </div>
                <div className="plan-desc">添加专属的个性化鼠标指针皮肤</div>
                <div className="plan-date">创建日期：2026-02-09</div>
              </li>
              <li className="plan-item">
                <div className="plan-header">
                  <strong>定时爬虫</strong>
                  <span className="plan-status pending">待开发</span>
                </div>
                <div className="plan-desc">定时爬取新闻或其他数据信息</div>
                <div className="plan-date">创建日期：2026-02-09</div>
              </li>
              <li className="plan-item">
                <div className="plan-header">
                  <strong>FC游戏</strong>
                  <span className="plan-status pending">待开发</span>
                </div>
                <div className="plan-desc">在线游玩各种FC小游戏，如超级玛丽、热血格斗、忍者神龟等</div>
                <div className="plan-date">创建日期：2026-02-15</div>
              </li>
            </ul>
          )}
        </section>

        <section className="about-section changelog-section">
          {(() => {
            // 更新日志数据
            const changelogData = [
              {
                date: '2026-02-19',
                version: '添加农历日历和节日显示',
                items: [
                  '首页日期时间组件添加农历显示（干支年、生肖、农历月日）',
                  '集成 lunar-javascript 库，支持准确的农历转换',
                  '自动显示公历节日（如国庆节、元旦等）',
                  '自动显示农历节日（如春节、中秋节等）',
                  '自动显示二十四节气（如雨水、立春等）',
                  '节日标签采用透明玻璃样式设计',
                ],
              },
              {
                date: '2026-02-15',
                version: '移动端适配优化',
                items: [
                  '全站移动端响应式适配，支持手机、平板访问',
                  '优化首页布局：日期时间、头像、导航按钮自适应',
                  '优化工具页面：导航栏、工作区、各工具组件移动端显示',
                  '优化游戏页面：导航栏、游戏区域自适应',
                  '优化关于页面：技术栈、更新日志移动端显示',
                  '修复贪吃蛇游戏面板尺寸适配',
                  '优化导航栏高度和图标尺寸',
                  '修复亲戚换算工具中的重复key警告',
                ],
              },
              {
                date: '2026-02-13',
                version: '上传GitHub',
                items: [
                  '上传GitHub',
                ],
              },
              {
                date: '2026-02-11',
                version: '美化页面并更添加分类导航',
                items: [
                  '为网站收藏和软件导航添加了分类导航，可以通过导航快速访问不同的分类',
                  '添加了更多的软件和网址分类',
                  '优化了导航的CSS样式',
                ],
              },
              {
                date: '2026-02-10',
                version: '美化UI和优化功能',
                items: [
                  '删除GIF分解工具',
                  '清理无用的CSS样式',
                  '添加了更多的软件和网址，并将Danbooru改为了Safebooru的安全版',
                  '优化了软件导航和网址收藏的的CSS样式',
                  '使用多个文件夹分开管理工具分类',
                ],
              },
              {
                date: '2026-02-09',
                version: '进一步完善项目',
                items: [
                  '暂时删除爬虫和API工具',
                  '新增图像旋转工具和图像对称工具',
                  '添加了更多的软件和网站',
                  '添加了新天气"星空"',
                  '添加了当前时间和倒数日',
                  '添加了网页游戏模块，现有贪吃蛇和拼图两种游戏',
                  '添加了未来计划并优化了项目日志',
                  '关于页面添加了博丽灵梦和雾雨魔理沙陪伴',
                ],
              },
              {
                date: '2026-02-08',
                version: '项目初始化',
                items: [
                  '完成项目基础架构搭建',
                  '实现主页粒子动画效果',
                  '添加天气切换功能（雪、雨）',
                  '集成音乐播放器',
                  '完成软件导航页面',
                  '完成常用网址页面',
                  '添加多个在线工具：Base64转换、网格切分、图像加字、加水印、图片压缩、BMI计算、亲戚换算、抽奖、单位换算、日期计算、代码对比、MD预览、思维导图、提取首尾帧、GIF分解',
                  '添加爬虫和API工具',
                  '添加关于页面',
                ],
              },
            ]

            return (
              <>
                <button
                  className="changelog-toggle"
                  onClick={() => setChangelogExpanded(!changelogExpanded)}
                >
                  <h2>更新日志</h2>
                  {changelogExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {/* 默认显示最新一条 */}
                {!changelogExpanded && (
                  <div className="changelog-preview">
                    <div className="changelog-preview-item">
                      <span className="changelog-date">{changelogData[0].date}</span>
                      <span className="changelog-version">{changelogData[0].version}</span>
                    </div>
                  </div>
                )}

                {changelogExpanded && (
                  <ul className="changelog-list">
                    {changelogData.map((log, index) => (
                      <li key={index} className="changelog-item">
                        <button
                          className="changelog-header"
                          onClick={() => setExpandedItems(prev => ({ ...prev, [index]: !prev[index] }))}
                        >
                          <div className="changelog-title">
                            <span className="changelog-date">{log.date}</span>
                            <span className="changelog-version">{log.version}</span>
                          </div>
                          {expandedItems[index] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        {expandedItems[index] && (
                          <div className="changelog-content">
                            <ul>
                              {log.items.map((item, itemIndex) => (
                                <li key={itemIndex}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )
          })()}
        </section>

        <section className="about-section">
          <h2>联系方式</h2>
          <div className="contact-links">
            <a
              href="https://github.com/zml-w"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              <img
                src="https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white"
                alt="GitHub"
              />
            </a>
            <a
              href="https://space.bilibili.com/691121489"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              <img
                src="https://img.shields.io/badge/BiliBili-00A1D6?style=flat&logo=bilibili&logoColor=white"
                alt="Bilibili"
              />
            </a>
          </div>
        </section>
          </div>
        </div>
      </div>
    </>
  )
}

export default About
