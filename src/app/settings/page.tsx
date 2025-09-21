'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { 
  Settings, 
  Moon, 
  Sun, 
  Bell, 
  Save, 
  Trash2, 
  AlertTriangle,
  User,
  Shield,
  Download
} from 'lucide-react'
import { storageManager } from '@/lib/storage'
import { useTheme } from '@/components/theme-provider'
import { UserSettings, UserProgress } from '@/types'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState<UserSettings>({
    darkMode: false,
    notifications: true,
    autoSave: true
  })
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [showResetModal, setShowResetModal] = useState(false)

  useEffect(() => {
    const userSettings = storageManager.getSettings()
    const userProgress = storageManager.getProgress()
    
    setSettings(userSettings)
    setProgress(userProgress)
  }, [])

  const updateSetting = (key: keyof UserSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    storageManager.saveSettings(newSettings)
    
    // 테마 설정은 별도 처리
    if (key === 'darkMode') {
      setTheme(value ? 'dark' : 'light')
    }
  }

  const resetAllData = () => {
    storageManager.resetAll()
    setProgress(null)
    setShowResetModal(false)
    
    // 페이지 새로고침
    window.location.reload()
  }

  const exportData = () => {
    if (!progress) return
    
    const dataToExport = {
      progress,
      settings,
      timestamp: new Date().toISOString()
    }
    
    const dataStr = JSON.stringify(dataToExport, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `ojt-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (data.progress) {
          storageManager.saveProgress(data.progress)
        }
        if (data.settings) {
          storageManager.saveSettings(data.settings)
        }
        alert('데이터가 성공적으로 복원되었습니다.')
        window.location.reload()
      } catch (error) {
        alert('파일 형식이 올바르지 않습니다.')
      }
    }
    reader.readAsText(file)
  }

  const getProgressStats = () => {
    if (!progress) return { totalChapters: 0, completedChapters: 0, totalQuizScores: 0, averageScore: 0 }
    
    const totalChapters = Object.keys(progress.chapters).length
    const completedChapters = Object.values(progress.chapters).filter(ch => ch.completed).length
    const totalQuizScores = Object.keys(progress.quizScores).length
    const averageScore = totalQuizScores > 0 
      ? Math.round(Object.values(progress.quizScores).reduce((sum, score) => 
          sum + (score.score / score.maxScore * 100), 0) / totalQuizScores)
      : 0
    
    return { totalChapters, completedChapters, totalQuizScores, averageScore }
  }

  const stats = getProgressStats()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            설정
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            앱 설정과 데이터를 관리하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Appearance Settings */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                외관 설정
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {theme === 'dark' ? (
                      <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        다크 모드
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        어두운 테마로 전환
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.darkMode}
                      onChange={(e) => updateSetting('darkMode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                알림 설정
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        알림 허용
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        학습 관련 알림 수신
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications}
                      onChange={(e) => updateSetting('notifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Save className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        자동 저장
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        학습 진행도 자동 저장
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoSave}
                      onChange={(e) => updateSetting('autoSave', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                데이터 관리
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      데이터 내보내기
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      학습 진행도와 설정을 백업 파일로 저장
                    </p>
                  </div>
                  <Button
                    onClick={exportData}
                    disabled={!progress}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>내보내기</span>
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      데이터 가져오기
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      백업 파일에서 데이터 복원
                    </p>
                  </div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".json"
                      onChange={importData}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      className="flex items-center space-x-2"
                      asChild
                    >
                      <div>
                        <Download className="h-4 w-4" />
                        <span>가져오기</span>
                      </div>
                    </Button>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      모든 데이터 초기화
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      진행도, 점수, 설정을 모두 삭제
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowResetModal(true)}
                    variant="outline"
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>초기화</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                학습 현황
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">완료된 챕터</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {stats.completedChapters}/{stats.totalChapters}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${stats.totalChapters > 0 ? (stats.completedChapters / stats.totalChapters) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">완료된 퀴즈</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {stats.totalQuizScores}
                    </span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">평균 점수</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {stats.averageScore}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reset Modal */}
        {showResetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  데이터 초기화 확인
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                모든 학습 진행도, 퀴즈 점수, 설정이 삭제됩니다. 
                이 작업은 되돌릴 수 없습니다. 정말로 계속하시겠습니까?
              </p>
              
              <div className="flex space-x-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowResetModal(false)}
                >
                  취소
                </Button>
                <Button
                  onClick={resetAllData}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  초기화
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
