'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { generateReport } from '@/lib/report-generator'

const analysisSteps = [
  '答题记录已保存',
  '各级别正确率计算中...',
  '自适应算法分析中...',
  '生成个性化建议...',
  '准备学习资源推荐...',
]

const waitingMessages = [
  '您的词汇量正在与JLPT标准对比中...',
  '正在分析您的强弱项分布...',
  '个性化学习路线规划中...',
]

export default function Processing() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [currentMessage, setCurrentMessage] = useState(0)
  const [reportId, setReportId] = useState<string | null>(null)

  useEffect(() => {
    // 模拟分析过程
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < analysisSteps.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, 800)

    // 轮播等待消息
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % waitingMessages.length)
    }, 2000)

    // 生成报告
    const generateReportAsync = async () => {
      try {
        const answers = JSON.parse(localStorage.getItem('quizAnswers') || '[]')
        const questions = JSON.parse(localStorage.getItem('quizQuestions') || '[]')
        
        const report = generateReport(answers, questions)
        const reportId = report.reportId
        
        // 保存报告
        localStorage.setItem(`report_${reportId}`, JSON.stringify(report))
        setReportId(reportId)

        // 等待所有步骤完成
        setTimeout(() => {
          router.push(`/report/${reportId}`)
        }, 4000)
      } catch (error) {
        console.error('生成报告失败:', error)
        // 即使失败也跳转，使用默认报告
        setTimeout(() => {
          router.push('/report/default')
        }, 4000)
      }
    }

    // 延迟开始生成报告，让用户看到分析过程
    setTimeout(generateReportAsync, 2000)

    return () => {
      clearInterval(stepInterval)
      clearInterval(messageInterval)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* 加载动画 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex justify-center space-x-2 mb-8">
            {['日', '本', '語', '語', '彙', '力', '診', '断'].map((char, index) => (
              <motion.span
                key={index}
                className="text-4xl font-bold text-blue-600"
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.1,
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 mb-8"
        >
          正在分析您的答题数据...
        </motion.h2>

        {/* 分析项目展示 */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="space-y-4 text-left">
            {analysisSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: index <= currentStep ? 1 : 0.3,
                  x: 0,
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center"
              >
                {index < currentStep ? (
                  <span className="text-green-500 text-xl mr-3">✓</span>
                ) : index === currentStep ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="text-blue-500 text-xl mr-3"
                  >
                    ⟳
                  </motion.span>
                ) : (
                  <span className="text-gray-300 text-xl mr-3">○</span>
                )}
                <span className={index <= currentStep ? 'text-gray-800' : 'text-gray-400'}>
                  {step}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 趣味等待文案 */}
        <motion.div
          key={currentMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-lg text-gray-600 italic"
        >
          "{waitingMessages[currentMessage]}"
        </motion.div>
      </div>
    </div>
  )
}
