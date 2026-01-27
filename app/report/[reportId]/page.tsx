'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ReportData, JLPTLevel, Question } from '@/lib/types'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

export default function ReportPage() {
  const params = useParams()
  const router = useRouter()
  const reportId = params.reportId as string
  const [report, setReport] = useState<ReportData | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    analysis: false,
    wrongAnswers: false,
  })
  const [showWrongAnswers, setShowWrongAnswers] = useState(false)

  useEffect(() => {
    // 从localStorage加载报告
    const reportData = localStorage.getItem(`report_${reportId}`)
    if (reportData) {
      setReport(JSON.parse(reportData))
    } else {
      // 如果没有找到报告，尝试生成一个示例报告
      const answers = JSON.parse(localStorage.getItem('quizAnswers') || '[]')
      const questions = JSON.parse(localStorage.getItem('quizQuestions') || '[]')
      
      if (answers.length > 0) {
        // 动态导入报告生成器
        import('@/lib/report-generator').then(({ generateReport }) => {
          const newReport = generateReport(answers, questions)
          localStorage.setItem(`report_${reportId}`, JSON.stringify(newReport))
          setReport(newReport)
        })
      } else {
        // 使用默认示例报告
        setReport(getDefaultReport())
      }
    }
  }, [reportId])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">加载报告中...</div>
      </div>
    )
  }

  // 准备雷达图数据
  const radarData = [
    { level: 'N5', score: report.levelScores.N5 },
    { level: 'N4', score: report.levelScores.N4 },
    { level: 'N3', score: report.levelScores.N3 },
    { level: 'N2', score: report.levelScores.N2 },
    { level: 'N1', score: report.levelScores.N1 },
  ]

  const levelDescriptions: Record<JLPTLevel, string> = {
    N5: '您已掌握基础日语词汇，可以开始学习更高级内容',
    N4: '您已掌握初级日语词汇，正在向中级迈进',
    N3: '您已掌握核心N3词汇，正在向N2迈进',
    N2: '您已掌握中级日语词汇，可以挑战高级内容',
    N1: '您已掌握高级日语词汇，词汇量非常丰富',
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 报告头部 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            おめでとう！测评完成！
          </h1>
          <p className="text-gray-600 mb-4">
            测评时间：{new Date(report.createdAt).toLocaleString('zh-CN')}
          </p>
          <div className="flex justify-center space-x-4">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              分享报告
            </button>
            <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
              下载PDF
            </button>
          </div>
        </motion.div>

        {/* 核心结果展示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center"
        >
          <div className="text-6xl font-bold text-blue-600 mb-4">
            {report.overallLevel}
          </div>
          <p className="text-2xl font-semibold text-gray-800 mb-2">
            您的综合词汇等级是：{report.overallLevel}
          </p>
          <p className="text-gray-600">
            {levelDescriptions[report.overallLevel]}
          </p>
        </motion.div>

        {/* 分维度雷达图 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">各级别掌握度</h2>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="level" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="掌握度"
                dataKey="score"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-5 gap-4 mt-6">
            {Object.entries(report.levelScores).map(([level, score]) => (
              <div key={level} className="text-center">
                <div className={`text-lg font-bold ${
                  score >= 80 ? 'text-green-600' :
                  score >= 50 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {level}: {score}%
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 详细分析部分 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-8"
        >
          <button
            onClick={() => toggleSection('analysis')}
            className="w-full text-left flex justify-between items-center mb-4"
          >
            <h2 className="text-2xl font-bold">详细分析</h2>
            <span className="text-2xl">{expandedSections.analysis ? '−' : '+'}</span>
          </button>

          {expandedSections.analysis && (
            <div className="space-y-6">
              {/* 强弱项分析 */}
              <div>
                <h3 className="text-xl font-bold text-green-600 mb-3">💪 您的强项：</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {report.strongPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-red-600 mb-3">📉 需要提升：</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {report.weakPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </motion.div>

        {/* 个性化学习建议 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">🗺️ 接下来30天学习建议</h2>
          
          <div className="space-y-4">
            {report.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start">
                <span className="text-blue-600 mr-3">•</span>
                <p className="text-gray-700">{rec}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold text-blue-800 mb-2">🎯 推荐资源：</h3>
            <ul className="space-y-2 text-blue-700">
              <li>• 教材：《完全掌握N3词汇》</li>
              <li>• APP：Moji辞书、烧饼日语</li>
              <li>• 网站：NHK WEB EASY、青空文库</li>
              <li>• 练习册：《日本語総まとめ》系列</li>
            </ul>
          </div>
        </motion.div>

        {/* 下一步行动按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-2 gap-4 mb-8"
        >
          <button
            onClick={() => router.push('/quiz/intro')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            重新测评（3天后可用）
          </button>
          <button
            onClick={() => setShowWrongAnswers(!showWrongAnswers)}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
          >
            {showWrongAnswers ? '隐藏详细错题集' : '查看详细错题集'}
          </button>
        </motion.div>

        {/* 错题集展示 */}
        {showWrongAnswers && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold mb-6">📝 详细错题集</h2>
            {report.answers.filter(a => !a.isCorrect).length === 0 ? (
              <p className="text-gray-600 text-center py-8">恭喜！您没有答错的题目！🎉</p>
            ) : (
              <div className="space-y-6">
                {report.answers
                  .map((answer, index) => {
                    const question = report.questions[index]
                    if (!question || answer.isCorrect) return null
                    return { answer, question, index: index + 1 }
                  })
                  .filter(item => item !== null)
                  .map((item, idx) => {
                    if (!item) return null
                    const { answer, question, index } = item
                    const typeNames = {
                      'kanji-to-hiragana': '看汉字选平假名',
                      'hiragana-to-kanji': '看假名选汉字',
                      'katakana-to-chinese': '片假名译中文',
                    }
                    return (
                      <div key={idx} className="border-l-4 border-red-500 pl-4 py-4 bg-red-50 rounded">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-bold text-red-600">第{index}题</span>
                            <span className="ml-2 text-sm text-gray-600">
                              ({typeNames[question.type]}) - {question.level}
                            </span>
                          </div>
                        </div>
                        <div className="mb-3">
                          <p className="font-semibold text-lg mb-2">题目：{question.question}</p>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <span className="text-red-600 font-bold mr-2">❌ 您的答案：</span>
                              <span className="bg-red-100 px-3 py-1 rounded">
                                {question.options[answer.selectedAnswer]}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-green-600 font-bold mr-2">✅ 正确答案：</span>
                              <span className="bg-green-100 px-3 py-1 rounded">
                                {question.options[question.correctAnswer]}
                              </span>
                            </div>
                          </div>
                        </div>
                        {question.explanation && (
                          <div className="mt-3 p-3 bg-blue-50 rounded">
                            <p className="text-sm text-blue-800">
                              <span className="font-bold">💡 解析：</span> {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>
            )}
          </motion.div>
        )}

        {/* 社交分享组件 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg shadow-lg p-8 text-center"
        >
          <h3 className="text-xl font-bold mb-4">分享我的日语水平</h3>
          <p className="text-gray-600 mb-4">
            我刚测了我的日语词汇力，达到了{report.overallLevel}水平！你也来试试吧～
          </p>
          <div className="flex justify-center space-x-4">
            <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              微信
            </button>
            <button className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              微博
            </button>
            <button className="px-6 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500">
              Twitter
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

function getDefaultReport(): ReportData {
  return {
    reportId: 'default',
    overallLevel: 'N3',
    levelScores: {
      N5: 100,
      N4: 85,
      N3: 72,
      N2: 35,
      N1: 10,
    },
    answers: [],
    questions: [],
    strongPoints: ['基础名词（N5-N4）：正确率92%', '形容动词：正确率85%'],
    weakPoints: ['复合动词（N3）：正确率40%', '近义词辨析（N2）：正确率25%'],
    recommendations: [
      '第1-2周：巩固N3核心词汇，每日目标：30个单词',
      '推荐资源：《完全掌握N3词汇》',
      '学习方法：造句练习 + Anki记忆卡',
    ],
    createdAt: new Date().toISOString(),
  }
}
