'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { 
  Trophy, 
  Download, 
  CheckCircle, 
  XCircle,
  Award,
  Calendar,
  User,
  BookOpen
} from 'lucide-react'
import { storageManager } from '@/lib/storage'
import { formatDate, generateCertificateNumber } from '@/lib/utils'
import { UserProgress, Certificate } from '@/types'
import { getRequiredChapters } from '@/data/seed'

export default function CertificatePage() {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [canGenerate, setCanGenerate] = useState(false)
  const [completionStats, setCompletionStats] = useState({
    requiredChaptersCompleted: 0,
    totalRequiredChapters: 0,
    averageScore: 0
  })

  useEffect(() => {
    const userProgress = storageManager.getProgress()
    const existingCertificates = storageManager.getCertificates()
    const requiredChapters = getRequiredChapters()
    
    setProgress(userProgress)
    setCertificates(existingCertificates)

    if (userProgress) {
      // 필수 챕터 완료 현황 확인
      const requiredChaptersCompleted = requiredChapters.filter(ch => 
        userProgress.chapters[ch.id]?.completed
      ).length

      // 평균 점수 계산
      const quizScores = Object.values(userProgress.quizScores)
      const averageScore = quizScores.length > 0 
        ? Math.round(quizScores.reduce((sum, score) => sum + (score.score / score.maxScore * 100), 0) / quizScores.length)
        : 0

      setCompletionStats({
        requiredChaptersCompleted,
        totalRequiredChapters: requiredChapters.length,
        averageScore
      })

      // 수료증 발급 조건 확인 (필수 챕터 80% 이상, 평균 80점 이상)
      const requiredCompletionRate = (requiredChaptersCompleted / requiredChapters.length) * 100
      setCanGenerate(requiredCompletionRate >= 80 && averageScore >= 80)
    }
  }, [])

  const generateCertificate = async () => {
    if (!progress || !canGenerate) return

    setIsGenerating(true)

    try {
      // 수료증 생성
      const certificate: Certificate = {
        id: `cert-${Date.now()}`,
        userId: 'user-1', // 실제로는 사용자 ID 사용
        issuedAt: new Date().toISOString(),
        chapterCompletion: completionStats.requiredChaptersCompleted,
        averageScore: completionStats.averageScore,
        certificateNumber: generateCertificateNumber()
      }

      // localStorage에 저장
      storageManager.addCertificate(certificate)
      setCertificates([...certificates, certificate])

      // PDF 생성 (실제 구현에서는 html2canvas + jsPDF 사용)
      await generatePDF(certificate)

    } catch (error) {
      console.error('수료증 생성 중 오류:', error)
      alert('수료증 생성 중 오류가 발생했습니다.')
    } finally {
      setIsGenerating(false)
    }
  }

  const generatePDF = async (certificate: Certificate) => {
    // 실제 구현에서는 html2canvas와 jsPDF를 사용하여 PDF 생성
    // 여기서는 시뮬레이션
    return new Promise((resolve) => {
      setTimeout(() => {
        alert(`수료증이 생성되었습니다!\n수료증 번호: ${certificate.certificateNumber}`)
        resolve(true)
      }, 2000)
    })
  }

  const downloadCertificate = (certificate: Certificate) => {
    // 실제 다운로드 로직 구현
    alert(`수료증 다운로드: ${certificate.certificateNumber}`)
  }

  const completionRate = completionStats.totalRequiredChapters > 0 
    ? Math.round((completionStats.requiredChaptersCompleted / completionStats.totalRequiredChapters) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            수료증
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            학습 완료 후 수료증을 발급받으세요.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {completionStats.requiredChaptersCompleted}/{completionStats.totalRequiredChapters}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              필수 챕터 완료
            </div>
          </div>

          <div className="card p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
              <Trophy className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {completionStats.averageScore}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              평균 점수
            </div>
          </div>

          <div className="card p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {completionRate}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              완료율
            </div>
          </div>
        </div>

        {/* Certificate Requirements */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            수료증 발급 조건
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {completionRate >= 80 ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="text-gray-700 dark:text-gray-300">
                필수 챕터 80% 이상 완료 ({completionRate}%)
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              {completionStats.averageScore >= 80 ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="text-gray-700 dark:text-gray-300">
                평균 점수 80점 이상 ({completionStats.averageScore}%)
              </span>
            </div>
          </div>

          {!canGenerate && (
            <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <p className="text-orange-800 dark:text-orange-200">
                수료증 발급을 위해서는 위 조건들을 모두 만족해야 합니다.
                더 많은 챕터를 완료하고 퀴즈에서 높은 점수를 받아보세요!
              </p>
            </div>
          )}
        </div>

        {/* Generate Certificate */}
        {canGenerate && (
          <div className="card p-6 mb-8 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                축하합니다! 🎉
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                수료증 발급 조건을 모두 만족했습니다. 수료증을 발급받으세요.
              </p>
              
              <Button
                onClick={generateCertificate}
                disabled={isGenerating}
                className="flex items-center space-x-2 mx-auto"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>생성 중...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>수료증 발급</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Existing Certificates */}
        {certificates.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              발급된 수료증
            </h2>
            
            <div className="space-y-4">
              {certificates.map((cert) => (
                <div key={cert.id} className="card p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-primary-600" />
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          장기요양 방문요양 OJT 수료증
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(cert.issuedAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{cert.certificateNumber}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => downloadCertificate(cert)}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>다운로드</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Progress Details */}
        {progress && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              학습 상세 현황
            </h2>
            
            <div className="card p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                    챕터 완료 현황
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(progress.chapters).map(([chapterId, chapterProgress]) => (
                      <div key={chapterId} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          챕터 {chapterId}
                        </span>
                        <div className="flex items-center space-x-2">
                          {chapterProgress.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {chapterProgress.progress}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                    퀴즈 점수 현황
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(progress.quizScores).map(([chapterId, score]) => (
                      <div key={chapterId} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          챕터 {chapterId} 퀴즈
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {Math.round((score.score / score.maxScore) * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
