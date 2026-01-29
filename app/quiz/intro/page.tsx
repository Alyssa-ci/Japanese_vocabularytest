'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function QuizIntro() {
  const router = useRouter()
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [studyDuration, setStudyDuration] = useState('')
  const [jlptLevel, setJlptLevel] = useState('')

  const handleStart = () => {
    // 保存用户设置到localStorage
    const settings = {
      soundEnabled,
      showExplanation,
      studyDuration,
      jlptLevel,
    }
    localStorage.setItem('quizSettings', JSON.stringify(settings))
    
    // 跳转到答题页面
    router.push('/quiz/question')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* 进度指示器 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">准备测评</span>
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 测评说明卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-8"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <span className="mr-2">📝</span>
            测评说明
          </h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <span className="font-bold text-blue-600 mr-2">1.</span>
              <div className="text-gray-700">
                <p className="font-semibold mb-2">题型：三种选择题</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>看汉字选择假名（如：影響 → えいきょう）</li>
                  <li>看假名选择汉字（如：あかり → 明かり）</li>
                  <li>日译中（如：カラオケボックス → 卡拉OK包厢）</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start">
              <span className="font-bold text-blue-600 mr-2">2.</span>
              <p className="text-gray-700">逻辑：题目难度会根据你的回答动态调整</p>
            </div>
            <div className="flex items-start">
              <span className="font-bold text-blue-600 mr-2">3.</span>
              <p className="text-gray-700">时间：无时间限制，请仔细思考</p>
            </div>
            <div className="flex items-start">
              <span className="font-bold text-blue-600 mr-2">4.</span>
              <p className="text-gray-700">数量：15-25题（根据你的水平而定）</p>
            </div>
            <div className="flex items-start">
              <span className="font-bold text-blue-600 mr-2">5.</span>
              <p className="text-gray-700">规则：所有题目不重复，每道题只会出现一次</p>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex items-start">
              <span className="text-yellow-600 mr-2">⚠️</span>
              <div>
                <p className="font-bold text-yellow-800 mb-2">注意事项</p>
                <ul className="list-disc list-inside text-yellow-700 space-y-1">
                  <li>请一次性完成，中途退出进度将丢失</li>
                  <li>请选择最确定的答案，不要猜测</li>
                  <li>每道题有4个选项，只有1个正确答案</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 可选设置 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-8"
        >
          <h3 className="text-2xl font-bold mb-6">可选设置</h3>
          
          <div className="space-y-4 mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <span className="ml-3 text-gray-700">开启音效反馈（正确/错误提示音）</span>
            </label>
            
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showExplanation}
                onChange={(e) => setShowExplanation(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <span className="ml-3 text-gray-700">显示答题解析（每答完一题立即显示）</span>
            </label>
          </div>
        </motion.div>

        {/* 用户信息收集 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-8"
        >
          <h3 className="text-2xl font-bold mb-4">
            为了更好地分析你的水平，请告诉我们：
          </h3>
          
          <div className="space-y-6">
            <div>
              <p className="font-medium text-gray-700 mb-3">1. 你学习日语多久了？</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {['不到3个月', '3-6个月', '6-12个月', '1-2年', '2年以上'].map((option) => (
                  <label key={option} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="studyDuration"
                      value={option}
                      checked={studyDuration === option}
                      onChange={(e) => setStudyDuration(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <p className="font-medium text-gray-700 mb-3">2. 你参加过JLPT考试吗？</p>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {['从未参加', 'N5', 'N4', 'N3', 'N2', 'N1'].map((option) => (
                  <label key={option} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="jlptLevel"
                      value={option}
                      checked={jlptLevel === option}
                      onChange={(e) => setJlptLevel(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 行动按钮 */}
        <div className="flex justify-center space-x-4">
          <Link href="/">
            <button className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg">
              返回首页
            </button>
          </Link>
          <button
            onClick={handleStart}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg"
          >
            开始答题
          </button>
        </div>
      </main>
    </div>
  )
}
