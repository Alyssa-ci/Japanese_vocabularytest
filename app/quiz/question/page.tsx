'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Question, QuizAnswer, JLPTLevel } from '@/lib/types'
import { getRandomQuestion, getNextQuestionLevel } from '@/lib/quiz-data'

const MAX_SKIPS = 2
const MIN_QUESTIONS = 15
const MAX_QUESTIONS = 25

export default function QuizQuestion() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([])
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(1)
  const [currentLevel, setCurrentLevel] = useState<JLPTLevel>('N5')
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(new Set())
  const [skipCount, setSkipCount] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [recentAnswers, setRecentAnswers] = useState<{ isCorrect: boolean; level: JLPTLevel }[]>([])

  // 从localStorage读取设置
  useEffect(() => {
    const settings = localStorage.getItem('quizSettings')
    if (settings) {
      const parsed = JSON.parse(settings)
      setShowExplanation(parsed.showExplanation || false)
      setSoundEnabled(parsed.soundEnabled || false)
    }
  }, [])

  // 打乱选项顺序的函数
  const shuffleOptions = (question: Question) => {
    // 创建选项的副本
    const options = [...question.options]
    // 创建索引数组
    const indices = options.map((_, index) => index)
    
    //  Fisher-Yates 洗牌算法
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[indices[i], indices[j]] = [indices[j], indices[i]]
    }
    
    // 根据打乱的索引创建新的选项数组
    const shuffled = indices.map(index => options[index])
    // 找到正确答案在打乱后的位置
    const correctIndex = indices.indexOf(question.correctAnswer)
    
    return { shuffled, correctIndex }
  }

  // 初始化：清空之前的答题记录并加载第一题
  useEffect(() => {
    // 开始新的测评时，清空之前的数据
    localStorage.removeItem('quizAnswers')
    localStorage.removeItem('quizQuestions')
    setAnswers([])
    setQuestions([])
    setUsedQuestionIds(new Set())
    const question = getRandomQuestion('N5', new Set())
    if (question) {
      const { shuffled, correctIndex } = shuffleOptions(question)
      setCurrentQuestion(question)
      setShuffledOptions(shuffled)
      setCorrectAnswerIndex(correctIndex)
      setUsedQuestionIds(new Set([question.id]))
      setQuestionStartTime(Date.now())
    }
  }, [])

  const loadQuestion = useCallback((level: JLPTLevel) => {
    // 使用函数式更新确保获取最新的 usedQuestionIds
    setUsedQuestionIds(prevUsedIds => {
      const question = getRandomQuestion(level, prevUsedIds)
      if (question) {
        const { shuffled, correctIndex } = shuffleOptions(question)
        setCurrentQuestion(question)
        setShuffledOptions(shuffled)
        setCorrectAnswerIndex(correctIndex)
        setSelectedAnswer(null)
        setIsSubmitted(false)
        setQuestionStartTime(Date.now())
        // 返回更新后的集合
        return new Set([...prevUsedIds, question.id])
      } else {
        // 如果当前级别没有可用题目，尝试其他级别
        const levelOrder: JLPTLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1']
        const currentIndex = levelOrder.indexOf(level)
        
        // 尝试相邻级别
        for (let i = 1; i < levelOrder.length; i++) {
          // 先尝试更高级别
          if (currentIndex + i < levelOrder.length) {
            const nextLevel = levelOrder[currentIndex + i]
            const nextQuestion = getRandomQuestion(nextLevel, prevUsedIds)
            if (nextQuestion) {
              const { shuffled, correctIndex } = shuffleOptions(nextQuestion)
              setCurrentQuestion(nextQuestion)
              setShuffledOptions(shuffled)
              setCorrectAnswerIndex(correctIndex)
              setCurrentLevel(nextLevel)
              setSelectedAnswer(null)
              setIsSubmitted(false)
              setQuestionStartTime(Date.now())
              return new Set([...prevUsedIds, nextQuestion.id])
            }
          }
          // 再尝试更低级别
          if (currentIndex - i >= 0) {
            const prevLevel = levelOrder[currentIndex - i]
            const prevQuestion = getRandomQuestion(prevLevel, prevUsedIds)
            if (prevQuestion) {
              const { shuffled, correctIndex } = shuffleOptions(prevQuestion)
              setCurrentQuestion(prevQuestion)
              setShuffledOptions(shuffled)
              setCorrectAnswerIndex(correctIndex)
              setCurrentLevel(prevLevel)
              setSelectedAnswer(null)
              setIsSubmitted(false)
              setQuestionStartTime(Date.now())
              return new Set([...prevUsedIds, prevQuestion.id])
            }
          }
        }
        
        // 如果所有级别都没有可用题目，结束测评
        router.push('/quiz/processing')
        return prevUsedIds
      }
    })
  }, [router, shuffleOptions])

  const handleAnswerSelect = (index: number) => {
    if (!isSubmitted) {
      setSelectedAnswer(index)
    }
  }

  const handleSubmit = () => {
    if (selectedAnswer === null || !currentQuestion) return

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000)
    const isCorrect = selectedAnswer === correctAnswerIndex

    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      timeSpent,
    }

    const newAnswers = [...answers, answer]
    const newQuestions = [...questions, currentQuestion]
    
    setAnswers(newAnswers)
    setQuestions(newQuestions)
    setIsSubmitted(true)

    // 播放音效反馈
    if (soundEnabled) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      if (isCorrect) {
        // 正确答案音效：上升音调
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime) // A4
        oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.3) // A5
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
      } else {
        // 错误答案音效：下降音调
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime) // A5
        oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.3) // A4
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
      }
    }

    // 更新最近答案记录（用于自适应算法）
    const newRecentAnswers = [...recentAnswers, { isCorrect, level: currentQuestion.level }]
    if (newRecentAnswers.length > 5) {
      newRecentAnswers.shift()
    }
    setRecentAnswers(newRecentAnswers)

    // 保存到localStorage
    localStorage.setItem('quizAnswers', JSON.stringify(newAnswers))
    localStorage.setItem('quizQuestions', JSON.stringify(newQuestions))
    localStorage.setItem('quizQuestionIndex', String(questionIndex))

    // 如果开启了显示解析，等待用户查看
    if (showExplanation) {
      // 3秒后自动进入下一题
      setTimeout(() => {
        goToNextQuestion(isCorrect)
      }, 3000)
    } else {
      // 1秒后自动进入下一题
      setTimeout(() => {
        goToNextQuestion(isCorrect)
      }, 1000)
    }
  }

  const goToNextQuestion = (wasCorrect: boolean) => {
    // 判断是否应该结束测评
    if (questionIndex >= MIN_QUESTIONS) {
      // 如果已经达到最少题目数，检查是否可以结束
      if (questionIndex >= MAX_QUESTIONS || shouldEndQuiz(wasCorrect, questionIndex)) {
        router.push('/quiz/processing')
        return
      }
    }

    // 使用自适应算法决定下一题的难度
    const nextLevel = getNextQuestionLevel(currentLevel, recentAnswers)
    setCurrentLevel(nextLevel)
    setQuestionIndex(prev => prev + 1)
    loadQuestion(nextLevel)
  }

  const shouldEndQuiz = (wasCorrect: boolean, currentIndex: number): boolean => {
    // 如果连续3题在同一级别且正确率稳定，可以结束
    if (recentAnswers.length >= 3) {
      const sameLevelAnswers = recentAnswers.filter(a => a.level === currentLevel)
      if (sameLevelAnswers.length >= 3) {
        const correctRate = sameLevelAnswers.filter(a => a.isCorrect).length / sameLevelAnswers.length
        // 如果正确率在40%-80%之间，说明已经找到合适水平
        return correctRate >= 0.4 && correctRate <= 0.8
      }
    }
    return false
  }

  const handleSkip = () => {
    if (skipCount >= MAX_SKIPS || !currentQuestion) return

    setSkipCount(prev => prev + 1)
    setQuestionIndex(prev => prev + 1)
    // 跳过时也要记录题目ID，避免重复
    if (currentQuestion) {
      setUsedQuestionIds(prev => new Set([...prev, currentQuestion.id]))
    }
    loadQuestion(currentLevel)
  }

  // 测试函数：验证正确答案位置的随机化
  const testAnswerShuffling = useCallback(() => {
    // 测试100次打乱，统计每个位置出现的次数
    const positionCounts = [0, 0, 0, 0]
    const testQuestion: Question = {
      id: 'test-question',
      level: 'N5',
      type: 'kanji-to-hiragana',
      question: '测试',
      options: ['选项1', '选项2', '选项3', '选项4'],
      correctAnswer: 0,
      explanation: '测试题目'
    }

    for (let i = 0; i < 100; i++) {
      const { correctIndex } = shuffleOptions(testQuestion)
      positionCounts[correctIndex]++
    }

    console.log('正确答案位置分布:', positionCounts)
    console.log('随机性测试完成：每个位置的出现次数应该大致相等')
  }, [])

  // 初始化时运行测试
  useEffect(() => {
    // 仅在开发环境运行测试
    if (process.env.NODE_ENV === 'development') {
      testAnswerShuffling()
    }
  }, [testAnswerShuffling])

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">加载题目中...</div>
      </div>
    )
  }

  const progress = Math.min((questionIndex / MAX_QUESTIONS) * 100, 100)
  const remainingSkips = MAX_SKIPS - skipCount

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* 顶部进度条 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>当前级别：{currentLevel}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          <p className="text-xs text-gray-500 text-center">
            预计还有 {Math.max(1, MAX_QUESTIONS - questionIndex)} 题
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 题目展示区 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-lg shadow-lg p-8 mb-8"
          >
            <div className="text-center mb-6">
              <div className="flex justify-center space-x-4 text-sm text-gray-600 mb-4">
                <span>🎯 题目类型：{
                  currentQuestion.type === 'kanji-to-hiragana' ? '看汉字选假名' :
                  currentQuestion.type === 'hiragana-to-kanji' ? '看假名选汉字' : '日译中'
                }</span>
                <span>📊 当前级别：{currentQuestion.level}</span>
              </div>
            </div>

            <div className="mb-8">
              <div className="text-3xl font-bold text-center mb-6 p-6 bg-blue-50 rounded-lg">
                {currentQuestion.question.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>

              <p className="text-center text-gray-600 mb-6">
                {currentQuestion.type === 'kanji-to-hiragana' 
                  ? '请选择对应的平假名：'
                  : currentQuestion.type === 'hiragana-to-kanji'
                  ? '请选择对应的汉字：'
                  : '请选择对应的中文意思：'}
              </p>

              <div className="space-y-4">
                {shuffledOptions.map((option, index) => {
                  let buttonClass = "w-full p-4 text-left border-2 rounded-lg transition-all "
                  
                  if (isSubmitted) {
                    if (index === correctAnswerIndex) {
                      buttonClass += "bg-green-100 border-green-500 text-green-800"
                    } else if (index === selectedAnswer && index !== correctAnswerIndex) {
                      buttonClass += "bg-red-100 border-red-500 text-red-800"
                    } else {
                      buttonClass += "bg-gray-50 border-gray-300"
                    }
                  } else {
                    if (selectedAnswer === index) {
                      buttonClass += "bg-blue-100 border-blue-500 text-blue-800"
                    } else {
                      buttonClass += "bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={isSubmitted}
                      className={buttonClass}
                    >
                      <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 解析显示 */}
            {isSubmitted && showExplanation && currentQuestion.explanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4"
              >
                <p className="font-bold text-blue-800 mb-2">💡 解析：</p>
                <p className="text-blue-700">{currentQuestion.explanation}</p>
              </motion.div>
            )}

            {/* 操作按钮区 */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleSkip}
                disabled={skipCount >= MAX_SKIPS || isSubmitted}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                跳过此题 {remainingSkips > 0 && `(${remainingSkips}次机会)`}
              </button>
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null || isSubmitted}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitted ? (showExplanation ? '查看解析中...' : '已提交') : '提交答案'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 底部信息 */}
        <div className="text-center text-sm text-gray-500">
          <p>不确定？相信第一直觉</p>
        </div>
      </main>
    </div>
  )
}
