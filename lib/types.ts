export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1'

export type QuestionType = 'kanji-to-hiragana' | 'hiragana-to-kanji' | 'katakana-to-chinese'

export interface Question {
  id: string
  level: JLPTLevel
  type: QuestionType
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

export interface QuizAnswer {
  questionId: string
  selectedAnswer: number
  isCorrect: boolean
  timeSpent: number // 秒
}

export interface QuizState {
  currentQuestionIndex: number
  questions: Question[]
  answers: QuizAnswer[]
  currentLevel: JLPTLevel
  skipCount: number
  startTime: number
}

export interface ReportData {
  reportId: string
  overallLevel: JLPTLevel
  levelScores: Record<JLPTLevel, number> // 0-100
  answers: QuizAnswer[]
  questions: Question[]
  strongPoints: string[]
  weakPoints: string[]
  recommendations: string[]
  createdAt: string
}
