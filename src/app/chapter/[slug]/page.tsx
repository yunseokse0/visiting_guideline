'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  CheckCircle, 
  Circle,
  Clock,
  Target,
  PlayCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  XCircle,
  FileText
} from 'lucide-react'
import { storageManager } from '@/lib/storage'
import { formatTime } from '@/lib/utils'
import { Chapter, UserProgress } from '@/types'
import { getChapterBySlug } from '@/data/seed'

// 챕터별 상세 정보 헬퍼 함수들
const getChapterPurpose = (chapterId: string): string => {
  const purposes: Record<string, string> = {
    'ch0': '4대 핵심 시스템(W4C, 희망이음, 롱텀케어, 이지케어)의 역할과 연계 이해 및 법적 의무 확인 (법령 보강판)',
    'ch1': '수급자 등록 서류 목록과 법적 의무 숙지, 계약 체결 및 급여제공계획서 작성·통보 절차 이해 (법령 보강판)',
    'ch2': '신규 종사자 채용 시 필수 서류와 법적 요건 확인, 인력보고 및 배상책임보험 가입 의무 이해 (법령 보강판)',
    'ch3': '식사 지원과 영양 관리의 올바른 방법을 익혀 어르신의 건강 증진에 기여합니다.',
    'ch4': '이동 및 보행 지원의 안전한 방법을 학습하여 어르신의 독립성과 안전을 보장합니다.',
    'ch5': '가사지원 서비스의 범위와 방법을 이해하고 효율적으로 제공할 수 있습니다.',
    'ch6': '사회활동 지원을 통해 어르신의 삶의 질 향상과 사회적 연결감 증진에 기여합니다.',
    'ch7': '기본적인 의료지원 방법을 학습하여 응급상황 대응 능력을 향상시킵니다.',
    'ch8': '안전관리와 응급상황 대처 방법을 숙지하여 어르신의 안전을 최우선으로 보장합니다.',
    'ch9': '의사소통과 상담 기술을 향상시켜 어르신과의 신뢰관계 구축에 기여합니다.',
    'ch10': '기록 및 보고서 작성의 중요성을 이해하고 정확한 기록 관리를 할 수 있습니다.',
    'ch11': '품질관리와 평가 기준을 숙지하여 서비스 품질 향상에 기여합니다.',
    'ch12': '법적 책임과 윤리적 가치를 이해하고 전문직으로서의 자세를 갖춥니다.',
    'ch13': '팀워크와 협력의 중요성을 인식하고 효과적인 업무 협력을 할 수 있습니다.',
    'ch14': '지속적인 교육과 자기계발의 중요성을 인식하고 전문성 향상을 위한 계획을 수립합니다.',
    'ch15': '복지용구와 보조기구의 올바른 사용법을 익혀 어르신의 일상생활 지원에 기여합니다.',
    'ch16': '전화상담 상황에서의 체계적이고 전문적인 대응 방법을 학습하여 고객 만족도를 향상시킵니다.'
  }
  return purposes[chapterId] || '해당 챕터의 교육 목적을 학습합니다.'
}

const getChapterKeyContent = (chapterId: string): string => {
  const contents: Record<string, string> = {
    'ch0': '장기요양제도 이해, 방문요양 서비스 개요, 요양보호사 역할과 책임, 서비스 제공 기준',
    'ch1': '이지케어 시스템 로그인, 서비스 기록 입력, 일정 관리, 급여 청구 시스템',
    'ch2': '목욕 지원, 세면 및 양치 지원, 머리 감기, 손발톱 관리, 옷 갈아입기 지원',
    'ch3': '식사 준비 및 배식, 식사 지원, 영양 상태 관찰, 식이 제한 사항 관리',
    'ch4': '침상에서 일어나기, 보행 지원, 휠체어 이용, 이동 시 안전 관리',
    'ch5': '청소 및 정리, 세탁 지원, 간단한 요리, 쇼핑 지원, 환경 정리',
    'ch6': '대화 및 상담, 취미 활동 지원, 사회활동 참여 지원, 정서적 지지',
    'ch7': '체온 측정, 혈압 측정, 약물 복용 지원, 증상 관찰 및 기록',
    'ch8': '낙상 예방, 화재 안전, 응급상황 대처, 안전 점검, 사고 예방',
    'ch9': '효과적인 의사소통, 경청 기술, 갈등 해결, 어르신 심리 이해',
    'ch10': '서비스 기록 작성, 보고서 작성, 의사소통 기록, 변화 관찰 기록',
    'ch11': '서비스 품질 평가, 개선 방안 도출, 고객 만족도 조사, 피드백 수집',
    'ch12': '요양보호사 법적 지위, 윤리 강령, 개인정보 보호, 의무와 권리',
    'ch13': '팀 구성원과의 협력, 역할 분담, 정보 공유, 갈등 해결',
    'ch14': '전문성 개발, 교육 참여, 자기평가, 지속적 학습 계획',
    'ch15': '복지용구 종류별 사용법, 보조기구 관리, 안전 사용 지침, 점검 및 관리',
    'ch16': '전화상담 유형별 대응, 민감한 상황 처리, 상담 후 기록, 보고 체계'
  }
  return contents[chapterId] || '해당 챕터의 핵심 학습 내용을 다룹니다.'
}

const getChapterLearningTips = (chapterId: string): string[] => {
  const tips: Record<string, string[]> = {
    'ch0': [
      '장기요양제도의 기본 철학을 이해하고 어르신 중심의 서비스를 제공하세요',
      '요양보호사로서의 역할과 한계를 명확히 구분하여 안전한 서비스를 제공하세요',
      '서비스 제공 시 개인정보 보호와 인권 존중을 최우선으로 하세요'
    ],
    'ch1': [
      '이지케어 시스템 사용 전 반드시 매뉴얼을 숙지하고 연습하세요',
      '서비스 기록은 정확하고 상세하게 작성하여 연속성을 유지하세요',
      '시스템 오류 시 즉시 관리자에게 보고하고 백업 방법을 준비하세요'
    ],
    'ch2': [
      '개인위생 지원 시 어르신의 존엄성을 최우선으로 고려하세요',
      '안전한 온도와 환경을 조성하여 편안한 위생 관리가 되도록 하세요',
      '어르신의 선호도와 건강 상태를 고려한 맞춤형 서비스를 제공하세요'
    ],
    'ch3': [
      '식사 지원 시 어르신의 식이 제한 사항을 반드시 확인하세요',
      '영양 균형을 고려한 식단을 준비하고 충분한 수분 섭취를 도와주세요',
      '식사 시간을 여유롭게 가져 어르신이 편안하게 식사할 수 있도록 하세요'
    ],
    'ch4': [
      '이동 지원 시 어르신의 체력과 건강 상태를 고려하여 안전한 방법을 선택하세요',
      '보조기구 사용법을 숙지하고 정기적으로 점검하여 안전을 보장하세요',
      '이동 중 낙상 위험을 최소화하기 위해 주변 환경을 미리 점검하세요'
    ],
    'ch5': [
      '가사지원 시 어르신의 개인적 선호도와 생활 패턴을 존중하세요',
      '안전한 가사 도구 사용법을 익히고 위험한 작업은 전문가에게 의뢰하세요',
      '어르신의 독립성을 유지할 수 있는 범위에서 지원을 제공하세요'
    ],
    'ch6': [
      '사회활동 지원 시 어르신의 관심사와 능력을 고려한 활동을 제안하세요',
      '대화와 상담을 통해 어르신의 정서적 안정감을 도모하세요',
      '사회적 고립을 방지하고 가족과의 관계 개선에 기여하세요'
    ],
    'ch7': [
      '의료지원 시 요양보호사의 한계를 명확히 인식하고 의료진과 협력하세요',
      '생체 신호 측정 시 정확한 방법을 숙지하고 기록을 체계적으로 관리하세요',
      '응급상황 시 즉시 의료진에게 연락하고 응급처치 지식을 활용하세요'
    ],
    'ch8': [
      '안전관리를 위해 정기적인 안전 점검을 실시하고 위험 요소를 미리 제거하세요',
      '응급상황 대처 매뉴얼을 숙지하고 정기적으로 응급처치 교육을 받으세요',
      '어르신의 안전을 최우선으로 하며 예방적 안전 관리에 집중하세요'
    ],
    'ch9': [
      '의사소통 시 어르신의 개별적 특성과 상황을 고려한 방법을 사용하세요',
      '경청과 공감을 바탕으로 신뢰관계를 구축하고 어르신의 의견을 존중하세요',
      '갈등 상황에서는 중립적 입장을 유지하고 건설적인 해결책을 모색하세요'
    ],
    'ch10': [
      '서비스 기록은 정확하고 객관적으로 작성하여 서비스 연속성을 보장하세요',
      '변화 관찰 기록을 통해 어르신의 상태 변화를 세심하게 관찰하고 기록하세요',
      '기록 보관 및 개인정보 보호에 대한 법적 의무를 준수하세요'
    ],
    'ch11': [
      '품질관리를 위해 정기적인 서비스 평가를 실시하고 개선점을 도출하세요',
      '고객 피드백을 적극적으로 수집하고 서비스 개선에 반영하세요',
      '팀 내 품질관리 문화를 조성하고 지속적인 품질 향상을 추구하세요'
    ],
    'ch12': [
      '법적 책임과 윤리적 가치를 바탕으로 전문적인 서비스를 제공하세요',
      '개인정보 보호와 인권 존중을 최우선으로 하며 비밀 유지를 철저히 하세요',
      '윤리적 딜레마 상황에서는 상급자와 상담하고 올바른 판단을 내리세요'
    ],
    'ch13': [
      '팀워크를 통해 효율적인 서비스 제공과 어르신의 삶의 질 향상에 기여하세요',
      '역할 분담과 책임 소재를 명확히 하여 서비스 연속성을 보장하세요',
      '갈등 상황에서는 건설적인 소통을 통해 해결책을 모색하세요'
    ],
    'ch14': [
      '지속적인 교육과 자기계발을 통해 전문성을 향상시키고 서비스 품질을 개선하세요',
      '자기평가를 통해 부족한 부분을 파악하고 개선 계획을 수립하세요',
      '동료와의 정보 공유와 경험 교환을 통해 함께 성장하세요'
    ],
    'ch15': [
      '복지용구 사용법을 숙지하고 정기적으로 점검하여 안전을 보장하세요',
      '어르신의 개별 상황에 맞는 보조기구를 선택하고 올바른 사용법을 안내하세요',
      '용구 관리와 청소를 통해 위생적이고 안전한 사용 환경을 조성하세요'
    ],
    'ch16': [
      '전화상담 시 전문적이고 친절한 태도로 고객의 요청을 정확히 파악하세요',
      '민감한 상황에서는 감정을 완화하고 근거 기반의 해결책을 제시하세요',
      '상담 후 기록과 보고를 통해 체계적인 고객 관리를 실시하세요'
    ]
  }
  return tips[chapterId] || [
    '실습을 통해 이론을 실제 상황에 적용해보세요',
    '어르신의 개별 상황을 고려한 맞춤형 서비스를 제공하세요',
    '지속적인 학습과 피드백을 통해 전문성을 향상시키세요'
  ]
}

// 챕터별 법령 근거 정보
const getChapterLegalBasis = (chapterId: string): string[] => {
  const legalBasis: Record<string, string[]> = {
    'ch0': [
      '「노인장기요양보험법 시행규칙」 제23조(장기요양기관의 지정기준)',
      '「노인장기요양보험법 시행규칙」 제24조(종사자의 자격기준)',
      '「노인장기요양보험법」 제37조(과태료) - 300만원 이하 과태료 부과 가능'
    ],
    'ch1': [
      '「노인장기요양보험법」 제23조(장기요양급여의 종류)',
      '「노인장기요양보험법」 제29조(급여의 제공 절차)',
      '「장기요양급여제공기준 및 급여비용 산정방법 고시」 제17조(급여제공계획 통보)',
      '「노인장기요양보험법 시행규칙」 제27조(본인일부부담금 납부)'
    ],
    'ch2': [
      '「노인장기요양보험법」 제36조(종사자의 자격기준)',
      '「노인장기요양보험법」 제39조(배상책임보험 가입 의무)',
      '「노인장기요양보험법 시행규칙」 제23조(인력보고)',
      '「노인장기요양보험법 시행규칙」 제24조(자격기준)'
    ]
  }
  return legalBasis[chapterId] || []
}

const getSectionDetailContent = (chapterId: string, sectionId: string): string => {
  const details: Record<string, Record<string, string>> = {
    'ch0': {
      'ch0-sec1': '장기요양제도는 2008년 도입된 사회보험 제도로, 노인 장기요양보험을 통해 어르신들의 일상생활 지원 서비스를 제공합니다. 이 제도는 가족의 부담을 줄이고 어르신의 삶의 질을 향상시키는 것을 목표로 합니다.',
      'ch0-sec2': '방문요양 서비스는 어르신이 거주하는 곳에서 직접 서비스를 받을 수 있는 제도입니다. 개인위생, 식사, 이동, 가사지원, 사회활동 지원 등 다양한 서비스를 제공하여 어르신의 독립적인 생활을 지원합니다.',
      'ch0-sec3': '요양보호사는 장기요양서비스법에 의해 인증받은 전문직으로, 어르신의 일상생활을 지원하는 역할을 담당합니다. 서비스 제공 시 안전, 존엄, 개별성을 최우선으로 고려해야 합니다.'
    },
    'ch1': {
      'ch1-sec1': '이지케어 시스템은 장기요양 서비스의 디지털 관리 플랫폼입니다. 서비스 제공자와 수급자 간의 효율적인 소통과 서비스 품질 향상을 위해 개발되었으며, 실시간 서비스 기록과 관리 기능을 제공합니다.',
      'ch1-sec2': '시스템 로그인 시 개인정보보호를 위한 2단계 인증을 반드시 거쳐야 합니다. 비밀번호는 정기적으로 변경하고, 공용 컴퓨터 사용 시 로그아웃을 반드시 확인해야 합니다.',
      'ch1-sec3': '서비스 기록 입력 시 정확성과 상세함이 중요합니다. 제공한 서비스의 내용, 시간, 어르신의 상태 변화 등을 객관적으로 기록하여 서비스 연속성을 보장해야 합니다.'
    },
    'ch2': {
      'ch2-sec1': '목욕 지원은 어르신의 개인위생 관리에서 가장 중요한 서비스 중 하나입니다. 안전한 온도(37-40도)를 유지하고, 미끄러짐 방지를 위한 안전장치를 반드시 점검해야 합니다.',
      'ch2-sec2': '세면 및 양치 지원 시 어르신의 건강 상태와 치아 상태를 고려해야 합니다. 구강 건강은 전반적인 건강과 직결되므로 세심한 관찰과 기록이 필요합니다.',
      'ch2-sec3': '머리 감기와 손발톱 관리 시 어르신의 선호도와 건강 상태를 존중해야 합니다. 특히 당뇨나 순환 장애가 있는 어르신의 경우 전문가와 상담 후 진행해야 합니다.'
    }
  }
  
  return details[chapterId]?.[sectionId] || ''
}

export default function ChapterDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [completedSections, setCompletedSections] = useState<string[]>([])
  const [completedMiniExercises, setCompletedMiniExercises] = useState<string[]>([])
  const [isCompleted, setExerciseCompleted] = useState(false)

  useEffect(() => {
    if (params.slug) {
      const chapterData = getChapterBySlug(params.slug as string)
      const userProgress = storageManager.getProgress()
      
      setChapter(chapterData || null)
      setProgress(userProgress)
      
      if (chapterData && userProgress) {
        const chapterProgress = userProgress.chapters[chapterData.id]
        if (chapterProgress) {
          setCompletedSections(chapterProgress.sectionsCompleted || [])
          setCompletedMiniExercises(chapterProgress.miniExercisesCompleted || [])
          setExerciseCompleted(chapterProgress.completed || false)
        }
      }
    }
  }, [params.slug])

  const markSectionComplete = (sectionId: string) => {
    if (!chapter || !progress) return

    const updatedProgress = { ...progress }
    if (!updatedProgress.chapters[chapter.id]) {
      updatedProgress.chapters[chapter.id] = {
        completed: false,
        progress: 0,
        lastAccessed: new Date().toISOString(),
        sectionsCompleted: [],
        miniExercisesCompleted: []
      }
    }

    const chapterProgress = updatedProgress.chapters[chapter.id]
    if (!chapterProgress.sectionsCompleted.includes(sectionId)) {
      chapterProgress.sectionsCompleted.push(sectionId)
    }

    // 진행률 계산
    const totalSections = chapter.sections.length + chapter.miniExercises.length
    const completedCount = chapterProgress.sectionsCompleted.length + chapterProgress.miniExercisesCompleted.length
    chapterProgress.progress = Math.round((completedCount / totalSections) * 100)
    
    // 모든 섹션 완료 시 챕터 완료로 표시
    if (chapterProgress.progress >= 100) {
      chapterProgress.completed = true
    }

    chapterProgress.lastAccessed = new Date().toISOString()
    
    setProgress(updatedProgress)
    storageManager.saveProgress(updatedProgress)
    setCompletedSections([...chapterProgress.sectionsCompleted])

    // 다음 섹션으로 자동 스크롤
    setTimeout(() => {
      const nextSectionIndex = chapter.sections.findIndex(section => section.id === sectionId) + 1
      if (nextSectionIndex < chapter.sections.length) {
        setCurrentSection(nextSectionIndex)
        // 스크롤을 맨 위로
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        // 마지막 섹션 완료 시 미니 실습으로 스크롤
        const firstExercise = document.querySelector('[data-exercise-id]')
        if (firstExercise) {
          firstExercise.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }, 1000)
  }

  const handleMiniExerciseComplete = (exerciseId: string) => {
    if (!chapter || !progress) return

    const updatedProgress = { ...progress }
    
    // 챕터 진행률이 없으면 초기화
    if (!updatedProgress.chapters[chapter.id]) {
      updatedProgress.chapters[chapter.id] = {
        completed: false,
        progress: 0,
        lastAccessed: new Date().toISOString(),
        sectionsCompleted: [],
        miniExercisesCompleted: []
      }
    }
    
    const chapterProgress = updatedProgress.chapters[chapter.id]
    
    // 미니 실습 완료 추가
    if (!chapterProgress.miniExercisesCompleted.includes(exerciseId)) {
      chapterProgress.miniExercisesCompleted.push(exerciseId)
    }

    // 진행률 재계산
    const totalSections = chapter.sections.length + chapter.miniExercises.length
    const completedCount = chapterProgress.sectionsCompleted.length + chapterProgress.miniExercisesCompleted.length
    chapterProgress.progress = Math.round((completedCount / totalSections) * 100)
    
    console.log('진행률 업데이트:', {
      exerciseId,
      completedCount,
      totalSections,
      progress: chapterProgress.progress,
      sectionsCompleted: chapterProgress.sectionsCompleted,
      miniExercisesCompleted: chapterProgress.miniExercisesCompleted
    })
    
    // 모든 섹션과 미니 실습이 완료되면 챕터 완료
    if (completedCount >= totalSections) {
      chapterProgress.completed = true
      chapterProgress.progress = 100
      setExerciseCompleted(true)
      console.log('챕터 완료됨:', chapter.id)
    }

    chapterProgress.lastAccessed = new Date().toISOString()
    
    setProgress(updatedProgress)
    storageManager.saveProgress(updatedProgress)
    
    // 상태 업데이트
    setCompletedMiniExercises([...chapterProgress.miniExercisesCompleted])
  }

  if (!chapter) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">챕터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  const currentChapterProgress = progress?.chapters[chapter.id]
  const hasQuizCompleted = progress?.quizScores[chapter.id] ? true : false

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Chapter Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>뒤로</span>
            </Button>
          </div>
          
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
                {isCompleted && (
                  <span className="text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                    완료
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {chapter.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                {chapter.description}
              </p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>예상 소요시간: {formatTime(chapter.estimatedTime)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{chapter.sections.length}개 섹션</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="h-4 w-4" />
                  <span>{chapter.miniExercises.length}개 실습</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter Overview */}
        <div className="card p-6 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-600" />
            학습 개요
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">교육 목적</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {getChapterPurpose(chapter.id)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">핵심 학습 내용</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {getChapterKeyContent(chapter.id)}
              </p>
            </div>
          </div>
        </div>

        {/* Legal Basis */}
        {getChapterLegalBasis(chapter.id).length > 0 && (
          <div className="card p-6 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              법령 근거
            </h2>
            <div className="space-y-3">
              {getChapterLegalBasis(chapter.id).map((legal, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-100 dark:border-blue-800">
                  <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-blue-800 dark:text-blue-200 font-medium">{legal}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Tips */}
        <div className="card p-6 mb-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2 text-green-600" />
            학습 팁
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getChapterLearningTips(chapter.id).map((tip, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-green-100 dark:border-green-800">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Progress & Navigation */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                학습 진행
              </h3>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    진행률
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {currentChapterProgress?.progress || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${currentChapterProgress?.progress || 0}%` }}
                  />
                </div>
              </div>

              {/* Learning Objectives */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  학습 목표
                </h4>
                <ul className="space-y-2">
                  {chapter.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <Circle className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary-600" />
                      <span className="text-gray-600 dark:text-gray-400">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Section Navigation */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  섹션 목록
                </h4>
                <div className="space-y-2">
                  {chapter.sections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => setCurrentSection(index)}
                      className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                        currentSection === index
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {completedSections.includes(section.id) ? (
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        )}
                        <span className="line-clamp-2">{section.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {chapter.sections[currentSection] && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  {chapter.sections[currentSection].title}
                </h2>
                
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">섹션 개요</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {chapter.sections[currentSection].content}
                    </p>
                  </div>
                  
                  {chapter.sections[currentSection].items && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                        <Target className="h-5 w-5 mr-2 text-primary-600" />
                        주요 학습 내용
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {chapter.sections[currentSection].items!.map((item, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 섹션별 상세 설명 추가 */}
                  {getSectionDetailContent(chapter.id, chapter.sections[currentSection].id) && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-primary-600" />
                        상세 설명
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {getSectionDetailContent(chapter.id, chapter.sections[currentSection].id)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section Completion Button */}
                {!completedSections.includes(chapter.sections[currentSection].id) && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      onClick={() => markSectionComplete(chapter.sections[currentSection].id)}
                      className="flex items-center space-x-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>이 섹션 완료</span>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Mini Exercises */}
            {chapter.miniExercises.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  미니 실습
                </h3>
                <div className="space-y-6">
                  {chapter.miniExercises.map((exercise) => (
                    <MiniExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                      onComplete={() => handleMiniExerciseComplete(exercise.id)}
                      chapter={chapter}
                      progress={progress}
                      setProgress={setProgress}
                      setChapterCompleted={setExerciseCompleted}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                disabled={currentSection === 0}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>이전 섹션</span>
              </Button>
              
              <Button
                onClick={() => setCurrentSection(Math.min(chapter.sections.length - 1, currentSection + 1))}
                disabled={currentSection === chapter.sections.length - 1}
                className="flex items-center space-x-2"
              >
                <span>다음 섹션</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Quiz Button */}
            {(isCompleted || (currentChapterProgress && currentChapterProgress.completed)) && (
              <div className="mt-8 card p-6 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800" data-quiz-button>
                <div className="text-center">
                  <Award className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    🎉 챕터 완료!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {hasQuizCompleted && progress
                      ? `퀴즈 점수: ${Math.round((progress.quizScores[chapter.id].score / progress.quizScores[chapter.id].maxScore) * 100)}점. 다시 도전해보세요!`
                      : '이제 퀴즈를 통해 학습 내용을 확인해보세요.'
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => router.push(`/quiz/${chapter.slug}`)}
                      className="flex items-center space-x-2"
                    >
                      <PlayCircle className="h-4 w-4" />
                      <span>{hasQuizCompleted ? '퀴즈 다시 보기' : '퀴즈 시작'}</span>
                    </Button>
                    <Button
                      onClick={() => router.push('/chapters')}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>다른 챕터</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

// Mini Exercise Card Component
function MiniExerciseCard({ exercise, onComplete, chapter, progress, setProgress, setChapterCompleted }: { 
  exercise: any, 
  onComplete: () => void,
  chapter: Chapter | null,
  progress: UserProgress | null,
  setProgress: (progress: UserProgress) => void,
  setChapterCompleted: (completed: boolean) => void
}) {
  const [userAnswer, setUserAnswer] = useState<string | string[] | null>(null)
  const [exerciseCompleted, setExerciseCompleted] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showNextButton, setShowNextButton] = useState(false)

  // 이미 완료된 실습인지 확인
  const isAlreadyCompleted = chapter && progress && 
    progress.chapters[chapter.id]?.miniExercisesCompleted?.includes(exercise.id)

  useEffect(() => {
    if (isAlreadyCompleted) {
      setExerciseCompleted(true)
      setShowResult(true)
      setShowNextButton(true)
      setIsCorrect(true) // 이미 완료된 경우 정답으로 표시
    }
  }, [isAlreadyCompleted])

  const checkAnswer = (userAnswer: any, correctAnswers: any): boolean => {
    if (!userAnswer) return false
    
    if (Array.isArray(correctAnswers)) {
      if (Array.isArray(userAnswer)) {
        // 둘 다 배열인 경우
        return JSON.stringify([...correctAnswers].sort()) === JSON.stringify([...userAnswer].sort())
      } else {
        // correctAnswers는 배열, userAnswer는 단일 값인 경우
        return correctAnswers.includes(userAnswer)
      }
    } else {
      // correctAnswers가 단일 값인 경우
      if (Array.isArray(userAnswer)) {
        return userAnswer.includes(correctAnswers)
      } else {
        return userAnswer === correctAnswers
      }
    }
  }

  const handleSubmit = () => {
    if (!userAnswer) {
      alert('답변을 선택해주세요.')
      return
    }
    
    try {
      const correct = checkAnswer(userAnswer, exercise.correctAnswers)
      setIsCorrect(correct)
      setExerciseCompleted(true)
      setShowResult(true)
      
      // 즉시 완료 처리
      onComplete()
      
      // 1초 후 다음 단계 버튼 표시
      setTimeout(() => {
        setShowNextButton(true)
      }, 1000)
      
    } catch (error) {
      console.error('답변 검증 중 오류 발생:', error)
      alert('답변 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  const handleNext = () => {
    console.log('다음 단계 버튼 클릭됨:', exercise.id)
    
    // 다음 미니 실습 찾기
    const allExercises = document.querySelectorAll('[data-exercise-id]')
    console.log('전체 실습 개수:', allExercises.length)
    
    const currentIndex = Array.from(allExercises).findIndex(el => el.getAttribute('data-exercise-id') === exercise.id)
    console.log('현재 실습 인덱스:', currentIndex)
    
    const nextExercise = allExercises[currentIndex + 1]
    console.log('다음 실습:', nextExercise)
    
    if (nextExercise) {
      // 다음 실습으로 스크롤
      console.log('다음 실습으로 이동:', nextExercise.getAttribute('data-exercise-id'))
      setTimeout(() => {
        nextExercise.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } else {
      // 모든 미니 실습이 완료된 경우
      console.log('모든 실습 완료, 챕터 완료 확인')
      
      // 챕터 완료 상태 확인 후 퀴즈 버튼으로 스크롤
      setTimeout(() => {
        const quizButton = document.querySelector('[data-quiz-button]')
        if (quizButton) {
          console.log('퀴즈 버튼 찾음, 스크롤')
          quizButton.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          console.log('퀴즈 버튼 없음, 페이지 하단으로 스크롤')
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
        }
      }, 300)
    }
  }

  return (
    <div className={`card p-6 border-l-4 ${
      exerciseCompleted || isAlreadyCompleted 
        ? 'border-l-green-500 bg-green-50 dark:bg-green-900/10' 
        : 'border-l-primary-500'
    }`} data-exercise-id={exercise.id} data-completed={exerciseCompleted || isAlreadyCompleted}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {exercise.title}
        </h4>
        {(exerciseCompleted || isAlreadyCompleted) && (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">완료</span>
          </div>
        )}
      </div>
      <div className="mb-4">
        <p className="text-gray-700 dark:text-gray-300 mb-3">
          {exercise.question}
        </p>
        
        {/* 힌트 제공 */}
        {exercise.id === 'ch0-ex1' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800 mb-3">
            <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">💡 힌트</h5>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              <strong>W4C</strong>는 <strong>인사관리</strong> 시스템입니다.<br/>
              각 시스템의 역할을 생각해보세요: 인사 → W4C, 보고 → 희망이음, 계약 → 롱텀케어, 일정 → 이지케어
            </p>
          </div>
        )}
        
        {exercise.id === 'ch0-ex2' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800 mb-3">
            <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">💡 힌트</h5>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              <strong>희망이음</strong>은 <strong>시군구 보고</strong> 시스템입니다.<br/>
              시군구에 보고하는 업무를 담당하는 시스템을 찾아보세요.
            </p>
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        {exercise.options.map((option: string, index: number) => (
          <label key={index} className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-colors ${
            exerciseCompleted ? 'cursor-not-allowed opacity-60' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}>
            <input
              type={exercise.type === 'checkbox' ? 'checkbox' : 'radio'}
              name={`exercise-${exercise.id}`}
              value={option}
              disabled={exerciseCompleted}
                    onChange={(e) => {
                      try {
                        if (exercise.type === 'checkbox') {
                          const current = Array.isArray(userAnswer) ? userAnswer : []
                          if (e.target.checked) {
                            setUserAnswer([...current, option])
                          } else {
                            setUserAnswer(current.filter(item => item !== option))
                          }
                        } else {
                          setUserAnswer(option)
                        }
                      } catch (error) {
                        console.error('답변 선택 중 오류 발생:', error)
                      }
                    }}
              className="h-4 w-4 text-primary-600"
            />
            <span className="text-gray-700 dark:text-gray-300">{option}</span>
          </label>
        ))}
      </div>

      {!exerciseCompleted && (
        <div className="mt-6">
          <Button onClick={handleSubmit} disabled={!userAnswer}>
            제출하기
          </Button>
        </div>
      )}

      {showResult && (
        <div className={`mt-4 p-4 rounded-lg border ${
          isCorrect 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            {isCorrect ? (
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
          
          <p className={`text-sm ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
            {exercise.explanation}
          </p>
          
          {!isCorrect && (
            <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded border">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <strong>정답:</strong> {Array.isArray(exercise.correctAnswers) ? exercise.correctAnswers.join(', ') : exercise.correctAnswers}
              </p>
            </div>
          )}
        </div>
      )}

      {showNextButton && (
        <div className="mt-4 flex justify-end">
          <Button onClick={handleNext} variant="outline" className="flex items-center space-x-2">
            <span>
              {(() => {
                const allExercises = document.querySelectorAll('[data-exercise-id]')
                const currentIndex = Array.from(allExercises).findIndex(el => el.getAttribute('data-exercise-id') === exercise.id)
                const isLast = currentIndex === allExercises.length - 1
                return isLast ? '퀴즈로 이동' : '다음 실습'
              })()}
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
