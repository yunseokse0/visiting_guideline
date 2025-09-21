'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { ProgressRing } from '@/components/progress-ring'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  AlertCircle, 
  PlayCircle,
  TrendingUp,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { storageManager } from '@/lib/storage'
import { formatTime, calculateProgress } from '@/lib/utils'
import { Chapter, DashboardStats, UserProgress } from '@/types'
import { chaptersData } from '@/data/seed'

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)

  useEffect(() => {
    const userProgress = storageManager.getProgress()
    const chapters = chaptersData

    if (userProgress) {
      setProgress(userProgress)
      
      // 통계 계산
      const completedChapters = Object.values(userProgress.chapters).filter(ch => ch.completed).length
      const totalStudyTime = Object.values(userProgress.chapters).reduce((total, ch) => {
        // 간단한 추정: 완료된 챕터당 평균 학습시간
        return total + (ch.completed ? 30 : 0) // 30분 추정
      }, 0)

      const quizScores = Object.values(userProgress.quizScores)
      const averageScore = quizScores.length > 0 
        ? Math.round(quizScores.reduce((sum, score) => sum + (score.score / score.maxScore * 100), 0) / quizScores.length)
        : 0

      const recentActivity = Object.entries(userProgress.chapters)
        .filter(([_, ch]) => ch.lastAccessed)
        .sort(([_, a], [__, b]) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())
        .slice(0, 5)
        .map(([chapterId, ch]) => ({
          id: `activity-${chapterId}`,
          type: ch.completed ? 'chapter_completed' as const : 'exercise_completed' as const,
          chapterId,
          timestamp: ch.lastAccessed,
          details: ch.completed ? '챕터 완료' : '학습 시작'
        }))

      const recommendedChapters = chapters
        .filter(ch => !userProgress.chapters[ch.id]?.completed)
        .sort((a, b) => a.order - b.order)
        .slice(0, 3)
        .map(ch => ch.id)

      const pendingQuizzes = chapters
        .filter(ch => userProgress.chapters[ch.id]?.completed && !userProgress.quizScores[ch.id])
        .map(ch => ch.id)

      setStats({
        totalChapters: chapters.length,
        completedChapters,
        averageScore,
        totalStudyTime,
        recentActivity,
        recommendedChapters,
        pendingQuizzes
      })
    } else {
      // 초기 통계
      setStats({
        totalChapters: chapters.length,
        completedChapters: 0,
        averageScore: 0,
        totalStudyTime: 0,
        recentActivity: [],
        recommendedChapters: chapters.slice(0, 3).map(ch => ch.id),
        pendingQuizzes: []
      })
    }
  }, [])

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  const overallProgress = calculateProgress(stats.completedChapters, stats.totalChapters)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            안녕하세요! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            장기요양 방문요양 실무 교육에 오신 것을 환영합니다.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Overall Progress */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">전체 진행률</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.completedChapters}/{stats.totalChapters}
                </p>
              </div>
              <ProgressRing progress={overallProgress} size={60} strokeWidth={6} />
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          {/* Average Score */}
          <div className="card p-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-500 mb-4" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">평균 점수</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.averageScore}%
                </p>
              </div>
            </div>
          </div>

          {/* Study Time */}
          <div className="card p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-500 mb-4" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 학습시간</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatTime(stats.totalStudyTime)}
                </p>
              </div>
            </div>
          </div>

          {/* Pending Quizzes */}
          <div className="card p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-orange-500 mb-4" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">미응시 퀴즈</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.pendingQuizzes.length}개
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Recommendation */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary-600" />
              오늘의 추천 학습
            </h2>
            <div className="space-y-3">
              {stats.recommendedChapters.map((chapterId) => {
                const chapter = chaptersData.find(ch => ch.id === chapterId)
                if (!chapter) return null
                
                return (
                  <Link
                    key={chapterId}
                    href={`/chapter/${chapter.slug}`}
                    className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {chapter.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          예상 소요시간: {formatTime(chapter.estimatedTime)}
                        </p>
                      </div>
                      <PlayCircle className="h-5 w-5 text-primary-600" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary-600" />
              최근 학습 활동
            </h2>
            <div className="space-y-3">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity) => {
                  const chapter = chaptersData.find(ch => ch.id === activity.chapterId)
                  return (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      {activity.type === 'chapter_completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <PlayCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {chapter?.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(activity.timestamp).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  아직 학습 기록이 없습니다.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            빠른 시작
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/chapters">
              <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <BookOpen className="h-6 w-6" />
                <span>챕터 목록</span>
                <span className="text-xs text-gray-500">{stats.completedChapters}/{stats.totalChapters} 완료</span>
              </Button>
            </Link>
            
            {stats.pendingQuizzes.length > 0 ? (
              <Link href={`/quiz/${chaptersData.find(ch => stats.pendingQuizzes.includes(ch.id))?.slug}`}>
                <Button variant="secondary" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <AlertCircle className="h-6 w-6" />
                  <span>퀴즈 응시</span>
                  <span className="text-xs text-gray-500">{stats.pendingQuizzes.length}개 대기</span>
                </Button>
              </Link>
            ) : (
              <Link href="/chapters">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <PlayCircle className="h-6 w-6" />
                  <span>학습 계속</span>
                  <span className="text-xs text-gray-500">다음 챕터</span>
                </Button>
              </Link>
            )}
            
            <Link href="/library">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <BookOpen className="h-6 w-6" />
                <span>자료실</span>
                <span className="text-xs text-gray-500">가이드 & 양식</span>
              </Button>
            </Link>
            
            <Link href="/cert">
              <Button 
                variant={stats.completedChapters >= stats.totalChapters * 0.8 && stats.averageScore >= 80 ? "secondary" : "outline"}
                className="w-full h-20 flex flex-col items-center justify-center space-y-2"
              >
                <Trophy className="h-6 w-6" />
                <span>수료증</span>
                <span className="text-xs text-gray-500">
                  {stats.completedChapters >= stats.totalChapters * 0.8 && stats.averageScore >= 80 ? '발급 가능' : '조건 미충족'}
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
