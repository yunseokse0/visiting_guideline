export interface Chapter {
  id: string
  slug: string
  title: string
  description: string
  estimatedTime: number // 분 단위
  isRequired: boolean
  order: number
  learningObjectives: string[]
  prerequisites: string[]
  sections: ChapterSection[]
  miniExercises: MiniExercise[]
  quizQuestions: QuizQuestion[]
}

export interface ChapterSection {
  id: string
  title: string
  content: string
  type: 'text' | 'checklist' | 'procedure' | 'tip'
  items?: string[]
  procedures?: ProcedureStep[]
}

export interface ProcedureStep {
  id: string
  title: string
  description: string
  isCompleted: boolean
  order: number
}

export interface MiniExercise {
  id: string
  title: string
  type: 'drag-drop' | 'sort' | 'checkbox' | 'multiple-choice' | 'matching'
  question: string
  options: string[]
  correctAnswers: (string | number)[]
  explanation: string
}

export interface QuizQuestion {
  id: string
  question: string
  type: 'multiple-choice' | 'true-false' | 'sort' | 'matching'
  options: string[]
  correctAnswer: string | number | (string | number)[]
  explanation: string
  sources: string[]
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface UserProgress {
  userId: string
  chapters: {
    [chapterId: string]: {
      completed: boolean
      progress: number // 0-100
      lastAccessed: string
      sectionsCompleted: string[]
      miniExercisesCompleted: string[]
    }
  }
  quizScores: {
    [chapterId: string]: {
      score: number
      maxScore: number
      completedAt: string
      wrongAnswers: string[]
    }
  }
  wrongAnswers: WrongAnswer[]
  settings: UserSettings
}

export interface WrongAnswer {
  id: string
  chapterId: string
  questionId: string
  userAnswer: string | number
  correctAnswer: string | number
  question: string
  explanation: string
  sources: string[]
  timestamp: string
}

export interface UserSettings {
  darkMode: boolean
  notifications: boolean
  autoSave: boolean
}

export interface Certificate {
  id: string
  userId: string
  issuedAt: string
  chapterCompletion: number
  averageScore: number
  certificateNumber: string
}

export interface LibraryDocument {
  id: string
  title: string
  description: string
  type: 'form' | 'guide' | 'template'
  downloadUrl?: string
  content?: string
  tags: string[]
}

export interface DashboardStats {
  totalChapters: number
  completedChapters: number
  averageScore: number
  totalStudyTime: number
  recentActivity: Activity[]
  recommendedChapters: string[]
  pendingQuizzes: string[]
}

export interface Activity {
  id: string
  type: 'chapter_completed' | 'quiz_taken' | 'exercise_completed'
  chapterId: string
  timestamp: string
  details: string
}

// 수가 시뮬레이션 관련 타입
export interface ServiceItem {
  id: string
  name: string
  unit: string
  price: number
  category: 'visit' | 'daycare' | 'shortstay' | 'special' | 'equipment'
  description: string
}

export interface UserBurdenType {
  id: string
  name: string
  rate: number
  description: string
}

export interface SimulationResult {
  serviceId: string
  serviceName: string
  quantity: number
  unitPrice: number
  totalCost: number
  burdenRate: number
  userBurden: number
  insuranceCoverage: number
  baseCost?: number
  additionalCost?: number
  isOverLimit?: boolean
  dayMultiplier?: number
  grade?: string
}

export interface SimulationInput {
  serviceId: string
  quantity: number
  burdenTypeId: string
  dayOfWeek?: 'weekday' | 'weekend' | 'holiday' | 'weekend-holiday' | 'extended-weekend'
  grade?: 'grade1' | 'grade2' | 'grade3' | 'grade4' | 'grade5'
}

// 장기요양 등급별 정보
export interface LongTermCareGrade {
  id: string
  name: string
  description: string
  burdenRate: number
}

// 요일별 요금 정보
export interface DayOfWeekPricing {
  dayType: 'weekday' | 'weekend' | 'holiday' | 'weekend-holiday' | 'extended-weekend'
  name: string
  multiplier: number
  description: string
}
