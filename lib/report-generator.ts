import { QuizAnswer, Question, ReportData, JLPTLevel } from './types'

export function generateReport(answers: QuizAnswer[], questions: Question[]): ReportData {
  // 按级别分组统计
  const levelStats: Record<JLPTLevel, { correct: number; total: number }> = {
    N5: { correct: 0, total: 0 },
    N4: { correct: 0, total: 0 },
    N3: { correct: 0, total: 0 },
    N2: { correct: 0, total: 0 },
    N1: { correct: 0, total: 0 },
  }

  // 统计各级别正确率
  answers.forEach((answer, index) => {
    const question = questions[index]
    if (question) {
      const level = question.level
      levelStats[level].total++
      if (answer.isCorrect) {
        levelStats[level].correct++
      }
    }
  })

  // 计算各级别得分（0-100）
  const levelScores: Record<JLPTLevel, number> = {
    N5: levelStats.N5.total > 0 ? Math.round((levelStats.N5.correct / levelStats.N5.total) * 100) : 0,
    N4: levelStats.N4.total > 0 ? Math.round((levelStats.N4.correct / levelStats.N4.total) * 100) : 0,
    N3: levelStats.N3.total > 0 ? Math.round((levelStats.N3.correct / levelStats.N3.total) * 100) : 0,
    N2: levelStats.N2.total > 0 ? Math.round((levelStats.N2.correct / levelStats.N2.total) * 100) : 0,
    N1: levelStats.N1.total > 0 ? Math.round((levelStats.N1.correct / levelStats.N1.total) * 100) : 0,
  }

  // 确定综合等级
  const overallLevel = determineOverallLevel(levelScores)

  // 分析强弱项
  const strongPoints: string[] = []
  const weakPoints: string[] = []

  Object.entries(levelScores).forEach(([level, score]) => {
    if (score >= 80) {
      strongPoints.push(`${level}级别词汇掌握良好（${score}%）`)
    } else if (score < 50) {
      weakPoints.push(`${level}级别词汇需要加强（${score}%）`)
    }
  })

  // 生成学习建议
  const recommendations = generateRecommendations(overallLevel, levelScores, weakPoints)

  return {
    reportId: `report_${Date.now()}`,
    overallLevel,
    levelScores,
    answers,
    questions,
    strongPoints,
    weakPoints,
    recommendations,
    createdAt: new Date().toISOString(),
  }
}

function determineOverallLevel(levelScores: Record<JLPTLevel, number>): JLPTLevel {
  // 找到最高达到80%的级别
  const levels: JLPTLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1']
  
  for (let i = levels.length - 1; i >= 0; i--) {
    const level = levels[i]
    if (levelScores[level] >= 80) {
      return level
    }
  }

  // 如果都没有达到80%，找到最高分的级别
  let maxScore = 0
  let maxLevel: JLPTLevel = 'N5'
  
  Object.entries(levelScores).forEach(([level, score]) => {
    if (score > maxScore) {
      maxScore = score
      maxLevel = level as JLPTLevel
    }
  })

  return maxLevel
}

function generateRecommendations(
  overallLevel: JLPTLevel,
  levelScores: Record<JLPTLevel, number>,
  weakPoints: string[]
): string[] {
  const recommendations: string[] = []

  // 根据综合等级给出建议
  if (overallLevel === 'N5' || overallLevel === 'N4') {
    recommendations.push('第1-2周：巩固N5-N4核心词汇，每日目标：30个单词')
    recommendations.push('推荐资源：《完全掌握N4词汇》')
    recommendations.push('学习方法：造句练习 + Anki记忆卡')
  } else if (overallLevel === 'N3') {
    recommendations.push('第1-2周：巩固N3核心词汇，每日目标：30个单词')
    recommendations.push('推荐资源：《完全掌握N3词汇》')
    recommendations.push('第3-4周：接触N2基础词汇，每日目标：20个单词')
    recommendations.push('推荐资源：《日本語総まとめ N2 語彙》')
    recommendations.push('学习方法：阅读NHK简易新闻，标记生词')
  } else if (overallLevel === 'N2' || overallLevel === 'N1') {
    recommendations.push('第1-2周：巩固N2核心词汇，每日目标：25个单词')
    recommendations.push('推荐资源：《日本語総まとめ N2 語彙》')
    recommendations.push('第3-4周：提升N1高级词汇，每日目标：20个单词')
    recommendations.push('推荐资源：《日本語総まとめ N1 語彙》')
    recommendations.push('学习方法：阅读原版小说和新闻，建立词汇本')
  }

  // 针对弱项给出建议
  if (weakPoints.some(w => w.includes('复合动词'))) {
    recommendations.push('复合动词专项练习：使用「动词て形+补助动词」列表造句')
  }
  if (weakPoints.some(w => w.includes('近义词'))) {
    recommendations.push('近义词辨析练习：《日本語類義表現使い分け辞典》每日5组')
  }

  return recommendations
}
