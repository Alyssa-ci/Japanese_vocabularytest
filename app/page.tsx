'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  const levels = ['N5', 'N4', 'N3', 'N2', 'N1']

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">日本語語彙力診断</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600">首页</Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600">关于测评</Link>
              <Link href="/resources" className="text-gray-700 hover:text-blue-600">学习资源</Link>
              <Link href="/login" className="text-gray-700 hover:text-blue-600">登录/注册</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 主视觉区 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-4"
          >
            你的日语词汇力，是N几？
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 mb-8"
          >
            15分钟科学测评，精准定位你的日语词汇水平
          </motion.p>

          {/* 动态展示：N5 → N1 的动画进度条 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center items-center space-x-2 mb-12"
          >
            {levels.map((level, index) => (
              <motion.div
                key={level}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg mb-2">
                  {level}
                </div>
                {index < levels.length - 1 && (
                  <div className="w-8 h-1 bg-blue-300"></div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 测评介绍卡片 */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-lg shadow-lg p-6 text-center"
          >
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">科学测评</h3>
            <p className="text-gray-600">基于JLPT标准，采用自适应算法</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-white rounded-lg shadow-lg p-6 text-center"
          >
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">快速高效</h3>
            <p className="text-gray-600">只需15分钟，获取详细报告</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white rounded-lg shadow-lg p-6 text-center"
          >
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">个性建议</h3>
            <p className="text-gray-600">针对薄弱项推荐学习资源</p>
          </motion.div>
        </div>

        {/* 开始测评按钮区 */}
        <div className="text-center mb-12">
          <Link href="/quiz/intro">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-lg text-xl shadow-lg"
            >
              开始测评
            </motion.button>
          </Link>
          <p className="text-gray-500 mt-4">约15分钟 • 15-25题 • 免费</p>
        </div>

        {/* 样本报告预览 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-12"
        >
          <h3 className="text-2xl font-bold mb-4 text-center">测评后您将获得这样详细的报告</h3>
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <div className="text-6xl font-bold text-blue-600 mb-2">N3</div>
            <p className="text-gray-600 mb-4">您的综合词汇等级</p>
            <div className="flex justify-center space-x-4 text-sm">
              <div className="bg-green-100 px-4 py-2 rounded">N5: 100%</div>
              <div className="bg-green-100 px-4 py-2 rounded">N4: 85%</div>
              <div className="bg-yellow-100 px-4 py-2 rounded">N3: 72%</div>
              <div className="bg-orange-100 px-4 py-2 rounded">N2: 35%</div>
              <div className="bg-red-100 px-4 py-2 rounded">N1: 10%</div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-2">© 2024 日本語語彙力診断. All rights reserved.</p>
          <p className="text-gray-400 text-sm">
            联系邮箱: contact@vocab-assessment.com | 
            <Link href="/privacy" className="hover:text-white underline ml-2">隐私政策</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
