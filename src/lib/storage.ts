import { UserProgress, UserSettings, WrongAnswer, Certificate } from '@/types'

const STORAGE_KEYS = {
  PROGRESS: 'ojt.progress.v1',
  SETTINGS: 'ojt.settings.v1',
  WRONG_ANSWERS: 'ojt.wrongAnswers.v1',
  CERTIFICATES: 'ojt.certificates.v1',
} as const

export class StorageManager {
  private static instance: StorageManager
  private storage: Storage

  constructor() {
    this.storage = typeof window !== 'undefined' ? localStorage : null as any
  }

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager()
    }
    return StorageManager.instance
  }

  // Progress 관련
  getProgress(): UserProgress | null {
    try {
      const data = this.storage?.getItem(STORAGE_KEYS.PROGRESS)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Failed to get progress:', error)
      return null
    }
  }

  saveProgress(progress: UserProgress): void {
    try {
      this.storage?.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress))
    } catch (error) {
      console.error('Failed to save progress:', error)
    }
  }

  updateChapterProgress(chapterId: string, progress: number, completed: boolean = false): void {
    const currentProgress = this.getProgress()
    if (!currentProgress) return

    if (!currentProgress.chapters[chapterId]) {
      currentProgress.chapters[chapterId] = {
        completed: false,
        progress: 0,
        lastAccessed: new Date().toISOString(),
        sectionsCompleted: [],
        miniExercisesCompleted: []
      }
    }

    currentProgress.chapters[chapterId].progress = progress
    currentProgress.chapters[chapterId].completed = completed
    currentProgress.chapters[chapterId].lastAccessed = new Date().toISOString()

    this.saveProgress(currentProgress)
  }

  // Settings 관련
  getSettings(): UserSettings {
    try {
      const data = this.storage?.getItem(STORAGE_KEYS.SETTINGS)
      return data ? JSON.parse(data) : {
        darkMode: false,
        notifications: true,
        autoSave: true
      }
    } catch (error) {
      console.error('Failed to get settings:', error)
      return {
        darkMode: false,
        notifications: true,
        autoSave: true
      }
    }
  }

  saveSettings(settings: UserSettings): void {
    try {
      this.storage?.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  // Wrong Answers 관련
  getWrongAnswers(): WrongAnswer[] {
    try {
      const data = this.storage?.getItem(STORAGE_KEYS.WRONG_ANSWERS)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Failed to get wrong answers:', error)
      return []
    }
  }

  addWrongAnswer(wrongAnswer: WrongAnswer): void {
    try {
      const currentAnswers = this.getWrongAnswers()
      currentAnswers.push(wrongAnswer)
      this.storage?.setItem(STORAGE_KEYS.WRONG_ANSWERS, JSON.stringify(currentAnswers))
    } catch (error) {
      console.error('Failed to add wrong answer:', error)
    }
  }

  clearWrongAnswers(): void {
    try {
      this.storage?.removeItem(STORAGE_KEYS.WRONG_ANSWERS)
    } catch (error) {
      console.error('Failed to clear wrong answers:', error)
    }
  }

  // Certificates 관련
  getCertificates(): Certificate[] {
    try {
      const data = this.storage?.getItem(STORAGE_KEYS.CERTIFICATES)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Failed to get certificates:', error)
      return []
    }
  }

  addCertificate(certificate: Certificate): void {
    try {
      const currentCertificates = this.getCertificates()
      currentCertificates.push(certificate)
      this.storage?.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(currentCertificates))
    } catch (error) {
      console.error('Failed to add certificate:', error)
    }
  }

  // 전체 초기화
  resetAll(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        this.storage?.removeItem(key)
      })
    } catch (error) {
      console.error('Failed to reset all data:', error)
    }
  }
}

export const storageManager = StorageManager.getInstance()
