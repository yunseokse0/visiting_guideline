'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  BookOpen,
  AlertCircle,
  Trophy,
  Clock
} from 'lucide-react'
import { storageManager } from '@/lib/storage'
import { shuffleArray, generateCertificateNumber } from '@/lib/utils'
import { Chapter, UserProgress, WrongAnswer, QuizQuestion } from '@/types'
import { getChapterBySlug } from '@/data/seed'

interface QuizState {
  currentQuestion: number
  answers: (string | number | (string | number)[])[]
  showResults: boolean
  score: number
  timeSpent: number
}

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    answers: [],
    showResults: false,
    score: 0,
    timeSpent: 0
  })
  const [startTime, setStartTime] = useState<number>(0)
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false)
  const [currentAnswerCorrect, setCurrentAnswerCorrect] = useState(false)
  const [showNextQuestionButton, setShowNextQuestionButton] = useState(false)

  useEffect(() => {
    if (params.slug) {
      const chapterData = getChapterBySlug(params.slug as string)
      if (chapterData) {
        setChapter(chapterData)
        // 퀴즈 문제 섞기 (최대 10문제)
        const shuffledQuestions = shuffleArray(chapterData.quizQuestions).slice(0, 10)
        setQuizQuestions(shuffledQuestions)
        setStartTime(Date.now())
      }
    }
  }, [params.slug])

  const handleAnswerSelect = (answer: string | number | (string | number)[]) => {
    const newAnswers = [...quizState.answers]
    newAnswers[quizState.currentQuestion] = answer
    setQuizState({ ...quizState, answers: newAnswers })
    
    // 답변 선택 시 피드백 상태 초기화
    setShowAnswerFeedback(false)
    setShowNextQuestionButton(false)
  }

  const handleSubmitAnswer = () => {
    if (!quizState.answers[quizState.currentQuestion]) {
      alert('답변을 선택해주세요.')
      return
    }
    
    try {
      const currentQuestion = quizQuestions[quizState.currentQuestion]
      const userAnswer = quizState.answers[quizState.currentQuestion]
      const isCorrect = checkAnswer(currentQuestion, userAnswer)
      
      setCurrentAnswerCorrect(isCorrect)
      setShowAnswerFeedback(true)
      
      // 2초 후 다음 문제 버튼 표시
      setTimeout(() => {
        setShowNextQuestionButton(true)
      }, 2000)
    } catch (error) {
      console.error('답변 제출 중 오류 발생:', error)
      alert('답변 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  const handleNextQuestion = () => {
    // 피드백 상태 초기화
    setShowAnswerFeedback(false)
    setShowNextQuestionButton(false)
    
    if (quizState.currentQuestion < quizQuestions.length - 1) {
      setQuizState({
        ...quizState,
        currentQuestion: quizState.currentQuestion + 1
      })
    } else {
      // 퀴즈 완료
      handleQuizComplete()
    }
  }

  const handlePreviousQuestion = () => {
    if (quizState.currentQuestion > 0) {
      setQuizState({
        ...quizState,
        currentQuestion: quizState.currentQuestion - 1
      })
    }
  }

  const handleQuizComplete = () => {
    const endTime = Date.now()
    const timeSpent = Math.round((endTime - startTime) / 1000)
    
    let score = 0
    const wrongAnswers: WrongAnswer[] = []

    quizQuestions.forEach((question, index) => {
      const userAnswer = quizState.answers[index]
      const isCorrect = checkAnswer(question, userAnswer)
      
      if (isCorrect) {
        score++
      } else {
        wrongAnswers.push({
          id: `wrong-${question.id}`,
          chapterId: chapter!.id,
          questionId: question.id,
          userAnswer: Array.isArray(userAnswer) ? JSON.stringify(userAnswer) : (userAnswer || ''),
          correctAnswer: Array.isArray(question.correctAnswer) ? JSON.stringify(question.correctAnswer) : question.correctAnswer,
          question: question.question,
          explanation: question.explanation,
          sources: question.sources,
          timestamp: new Date().toISOString()
        })
      }
    })

    // 진행도 업데이트
    const progress = storageManager.getProgress()
    if (progress && chapter) {
      progress.quizScores[chapter.id] = {
        score,
        maxScore: quizQuestions.length,
        completedAt: new Date().toISOString(),
        wrongAnswers: wrongAnswers.map(wa => wa.questionId)
      }

      // 오답 저장
      wrongAnswers.forEach(wrongAnswer => {
        storageManager.addWrongAnswer(wrongAnswer)
      })

      storageManager.saveProgress(progress)
    }

    setQuizState({
      ...quizState,
      showResults: true,
      score,
      timeSpent
    })
  }

  const checkAnswer = (question: QuizQuestion, userAnswer: any): boolean => {
    if (!userAnswer) return false
    
    if (Array.isArray(question.correctAnswer)) {
      if (Array.isArray(userAnswer)) {
        // 둘 다 배열인 경우
        return JSON.stringify([...question.correctAnswer].sort()) === JSON.stringify([...userAnswer].sort())
      } else {
        // correctAnswer는 배열, userAnswer는 단일 값인 경우
        return question.correctAnswer.includes(userAnswer)
      }
    } else {
      // correctAnswer가 단일 값인 경우
      if (Array.isArray(userAnswer)) {
        return userAnswer.includes(question.correctAnswer)
      } else {
        return userAnswer === question.correctAnswer
      }
    }
  }

  if (!chapter || quizQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">퀴즈를 준비하는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = quizQuestions[quizState.currentQuestion]
  const progress = ((quizState.currentQuestion + 1) / quizQuestions.length) * 100

  if (quizState.showResults) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Header */}
          <div className="text-center mb-8">
            <div className="mb-6">
              {quizState.score >= quizQuestions.length * 0.8 ? (
                <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                  <Trophy className="h-10 w-10 text-green-600" />
                </div>
              ) : (
                <div className="mx-auto w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-10 w-10 text-orange-600" />
                </div>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              퀴즈 완료!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              {chapter.title}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {quizState.score}/{quizQuestions.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  정답 개수
                </div>
              </div>
              
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {Math.round((quizState.score / quizQuestions.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  점수
                </div>
              </div>
              
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {Math.floor(quizState.timeSpent / 60)}:{(quizState.timeSpent % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  소요시간
                </div>
              </div>
            </div>
          </div>

          {/* Wrong Answers Review */}
          {quizState.score < quizQuestions.length && (
            <div className="card p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
                오답 복습
              </h2>
              <div className="space-y-6">
                {quizQuestions.map((question, index) => {
                  const userAnswer = quizState.answers[index]
                  const isCorrect = checkAnswer(question, userAnswer)
                  
                  if (isCorrect) return null

                  return (
                    <div key={question.id} className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                      <div className="flex items-start space-x-3 mb-3">
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                            Q{index + 1}. {question.question}
                          </p>
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-medium text-red-600">내 답: </span>
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {Array.isArray(userAnswer) ? userAnswer.join(', ') : userAnswer}
                              </span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-green-600">정답: </span>
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {Array.isArray(question.correctAnswer) ? question.correctAnswer.join(', ') : question.correctAnswer}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          <strong>해설:</strong> {question.explanation}
                        </p>
                        
                        {question.sources.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">참고 자료:</p>
                            <div className="flex flex-wrap gap-2">
                              {question.sources.map((source, idx) => (
                                <span key={idx} className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                  {source}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push(`/chapter/${chapter.slug}`)}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>챕터로 돌아가기</span>
            </Button>
            
            <Button
              onClick={() => router.push('/chapters')}
              className="flex items-center space-x-2"
            >
              <span>다른 챕터 학습하기</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quiz Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>뒤로</span>
            </Button>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>{Math.floor((Date.now() - startTime) / 1000)}초</span>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {chapter.title} 퀴즈
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              문제 {quizState.currentQuestion + 1} / {quizQuestions.length}
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="card p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Q{quizState.currentQuestion + 1}. {currentQuestion.question}
          </h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = currentQuestion.type === 'multiple-choice' 
                ? quizState.answers[quizState.currentQuestion] === option
                : Array.isArray(quizState.answers[quizState.currentQuestion]) 
                  ? (quizState.answers[quizState.currentQuestion] as string[]).includes(option)
                  : false
              
              const isCorrect = showAnswerFeedback && (
                (currentQuestion.type === 'multiple-choice' && option === currentQuestion.correctAnswer) ||
                (currentQuestion.type === 'true-false' && option === currentQuestion.correctAnswer) ||
                (Array.isArray(currentQuestion.correctAnswer) && 
                 (currentQuestion.correctAnswer as string[]).includes(option))
              )
              
              const isWrong = showAnswerFeedback && isSelected && !isCorrect
              
              return (
                <label key={index} className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border transition-colors ${
                  isCorrect 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : isWrong 
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : isSelected
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                } ${showAnswerFeedback ? 'cursor-not-allowed opacity-75' : ''}`}>
                  <input
                    type={currentQuestion.type === 'multiple-choice' ? 'radio' : 'checkbox'}
                    name={`question-${currentQuestion.id}`}
                    value={option}
                    checked={isSelected}
                    disabled={showAnswerFeedback}
                    onChange={(e) => {
                      try {
                        if (currentQuestion.type === 'multiple-choice') {
                          handleAnswerSelect(option)
                        } else {
                          const current = Array.isArray(quizState.answers[quizState.currentQuestion]) 
                            ? quizState.answers[quizState.currentQuestion] as string[]
                            : []
                          if (e.target.checked) {
                            handleAnswerSelect([...current, option])
                          } else {
                            handleAnswerSelect(current.filter(item => item !== option))
                          }
                        }
                      } catch (error) {
                        console.error('답변 선택 중 오류 발생:', error)
                      }
                    }}
                    className="h-4 w-4 text-primary-600"
                  />
                  <span className="text-gray-700 dark:text-gray-300">{option}</span>
                  {isCorrect && <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />}
                  {isWrong && <XCircle className="h-5 w-5 text-red-600 ml-auto" />}
                </label>
              )
            })}
          </div>

          {/* Answer Feedback */}
          {showAnswerFeedback && (
            <div className={`mt-6 p-4 rounded-lg border ${
              currentAnswerCorrect 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                {currentAnswerCorrect ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800 dark:text-green-200">정답입니다! 🎉</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="font-semibold text-red-800 dark:text-red-200">틀렸습니다</span>
                  </>
                )}
              </div>
              
              <p className={`text-sm mb-3 ${currentAnswerCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                <strong>해설:</strong> {currentQuestion.explanation}
              </p>
              
              {!currentAnswerCorrect && (
                <div className="p-2 bg-white dark:bg-gray-800 rounded border">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>정답:</strong> {
                      Array.isArray(currentQuestion.correctAnswer) 
                        ? currentQuestion.correctAnswer.join(', ') 
                        : currentQuestion.correctAnswer
                    }
                  </p>
                </div>
              )}
              
              {currentQuestion.sources.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">참고 자료:</p>
                  <div className="flex flex-wrap gap-2">
                    {currentQuestion.sources.map((source, idx) => (
                      <span key={idx} className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={quizState.currentQuestion === 0 || showAnswerFeedback}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>이전 문제</span>
          </Button>
          
          <div className="flex items-center space-x-3">
            {!showAnswerFeedback ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={!quizState.answers[quizState.currentQuestion]}
                className="flex items-center space-x-2"
              >
                <span>답안 제출</span>
              </Button>
            ) : showNextQuestionButton ? (
              <Button
                onClick={handleNextQuestion}
                className="flex items-center space-x-2"
              >
                <span>
                  {quizState.currentQuestion === quizQuestions.length - 1 ? '퀴즈 완료' : '다음 문제'}
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                해설을 확인하세요...
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
