'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { ProgressRing } from '@/components/progress-ring'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Circle,
  Award,
  PlayCircle
} from 'lucide-react'
import { storageManager } from '@/lib/storage'
import { formatTime, calculateProgress } from '@/lib/utils'
import { Chapter, UserProgress } from '@/types'
import { getChaptersByOrder } from '@/data/seed'

// 챕터별 교육 목적 간략 표시
const getChapterPurposeBrief = (chapterId: string): string => {
  const purposes: Record<string, string> = {
    'ch0': '장기요양제도 이해 및 요양보호사 역할 인식',
    'ch1': '이지케어 시스템 활용과 효율적인 기록 관리',
    'ch2': '개인위생 관리 방법 체계적 학습',
    'ch3': '식사 지원과 영양 관리 전문성 향상',
    'ch4': '안전한 이동 및 보행 지원 기술 습득',
    'ch5': '가사지원 서비스 범위와 방법 이해',
    'ch6': '사회활동 지원을 통한 삶의 질 향상',
    'ch7': '기본 의료지원과 응급상황 대응 능력',
    'ch8': '안전관리와 응급상황 대처 전문성',
    'ch9': '의사소통과 상담 기술 향상',
    'ch10': '기록 및 보고서 작성 전문성',
    'ch11': '품질관리와 평가 기준 숙지',
    'ch12': '법적 책임과 윤리적 가치 이해',
    'ch13': '팀워크와 협력의 중요성 인식',
    'ch14': '지속적 교육과 자기계발 계획',
    'ch15': '복지용구와 보조기구 사용법',
    'ch16': '전화상담 전문적 대응 방법'
  }
  return purposes[chapterId] || '해당 챕터의 교육 목적을 학습합니다.'
}

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [progress, setProgress] = useState<UserProgress | null>(null)

  useEffect(() => {
    const chaptersData = getChaptersByOrder()
    const userProgress = storageManager.getProgress()
    
    setChapters(chaptersData)
    setProgress(userProgress)
  }, [])

  const getChapterProgress = (chapterId: string) => {
    if (!progress) return 0
    return progress.chapters[chapterId]?.progress || 0
  }

  const isChapterCompleted = (chapterId: string) => {
    if (!progress) return false
    return progress.chapters[chapterId]?.completed || false
  }

  const hasQuizCompleted = (chapterId: string) => {
    if (!progress) return false
    return !!progress.quizScores[chapterId]
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            학습 챕터
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            장기요양 방문요양 실무에 필요한 모든 지식을 체계적으로 학습하세요.
          </p>
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter) => {
            const chapterProgress = getChapterProgress(chapter.id)
            const isCompleted = isChapterCompleted(chapter.id)
            const quizCompleted = hasQuizCompleted(chapter.id)

            return (
              <div key={chapter.id} className="card p-6 hover:shadow-lg transition-shadow duration-200">
                {/* Chapter Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded">
                        CH{chapter.order}
                      </span>
                      {chapter.isRequired && (
                        <span className="text-xs font-medium text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                          필수
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {chapter.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {chapter.description}
                    </p>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      학습 진행률
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {chapterProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${chapterProgress}%` }}
                    />
                  </div>
                </div>

                {/* Chapter Info */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(chapter.estimatedTime)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isCompleted && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>완료</span>
                      </div>
                    )}
                    {quizCompleted && (
                      <div className="flex items-center space-x-1 text-blue-600">
                        <Award className="h-4 w-4" />
                        <span>퀴즈</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Education Purpose */}
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">교육 목적</h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                    {getChapterPurposeBrief(chapter.id)}
                  </p>
                </div>

                {/* Learning Objectives Preview */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    학습 목표
                  </h4>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    {chapter.learningObjectives.slice(0, 2).map((objective, index) => (
                      <li key={index} className="flex items-start space-x-1">
                        <Circle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{objective}</span>
                      </li>
                    ))}
                    {chapter.learningObjectives.length > 2 && (
                      <li className="text-xs text-primary-600">
                        +{chapter.learningObjectives.length - 2}개 더
                      </li>
                    )}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Link href={`/chapter/${chapter.slug}`} className="flex-1">
                    <Button className="w-full" size="sm">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      {isCompleted ? '복습하기' : '학습하기'}
                    </Button>
                  </Link>
                  
                  {isCompleted && (
                    <Link href={`/quiz/${chapter.slug}`}>
                      <Button 
                        variant={quizCompleted ? "secondary" : "outline"} 
                        size="sm"
                        className="px-3"
                        title={quizCompleted ? '퀴즈 완료됨' : '퀴즈 응시'}
                      >
                        {quizCompleted ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <BookOpen className="h-4 w-4" />
                        )}
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Progress Indicator */}
                {chapterProgress > 0 && (
                  <div className="mt-3 text-center">
                    <div className="flex items-center justify-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                      <span>진행률</span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1 max-w-16">
                        <div 
                          className="bg-primary-600 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${chapterProgress}%` }}
                        />
                      </div>
                      <span>{chapterProgress}%</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Completion Stats */}
        {progress && (
          <div className="mt-12 card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              학습 현황
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {Object.values(progress.chapters).filter(ch => ch.completed).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  완료된 챕터
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {Object.keys(progress.quizScores).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  완료된 퀴즈
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {Math.round(
                    Object.values(progress.quizScores).reduce((sum, score) => 
                      sum + (score.score / score.maxScore * 100), 0
                    ) / Math.max(Object.keys(progress.quizScores).length, 1)
                  )}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  평균 점수
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
