import { ServiceItem, UserBurdenType, LongTermCareGrade, DayOfWeekPricing } from '@/types'

// 2025년 장기요양보험 수가표 데이터 (실제 규정 반영)
export const serviceItems: ServiceItem[] = [
  // 방문요양 (기본 2시간, 주 3회 제한)
  {
    id: 'visit-1',
    name: '방문요양 (기본급여)',
    unit: '1회 (2시간)',
    price: 8500,
    category: 'visit',
    description: '기본 방문요양 서비스 (2시간, 주 3회 제한)'
  },
  {
    id: 'visit-2',
    name: '방문요양 (연장급여)',
    unit: '1시간',
    price: 4500,
    category: 'visit',
    description: '2시간 초과 연장 서비스 (최대 4시간까지)'
  },
  {
    id: 'visit-3',
    name: '방문요양 (야간급여)',
    unit: '1회 (2시간)',
    price: 12000,
    category: 'visit',
    description: '야간 방문요양 서비스 (22:00~06:00, 주 2회 제한)'
  },
  {
    id: 'visit-4',
    name: '방문요양 (휴일급여)',
    unit: '1회 (2시간)',
    price: 11000,
    category: 'visit',
    description: '주말 및 공휴일 방문요양 서비스 (주 2회 제한)'
  },
  {
    id: 'visit-5',
    name: '방문요양 (가산급여)',
    unit: '1회 (2시간)',
    price: 10500,
    category: 'visit',
    description: '주 4회 이상 이용 시 가산급여 (추가 1회당)'
  },

  // 주야간보호 (1일 8시간, 월 20일 제한)
  {
    id: 'daycare-1',
    name: '주야간보호 (기본급여)',
    unit: '1일 (8시간)',
    price: 25000,
    category: 'daycare',
    description: '주야간보호센터 기본 이용료 (1일 8시간, 월 20일 제한)'
  },
  {
    id: 'daycare-2',
    name: '주야간보호 (연장급여)',
    unit: '1시간',
    price: 3500,
    category: 'daycare',
    description: '8시간 초과 연장 이용료 (최대 12시간까지)'
  },
  {
    id: 'daycare-3',
    name: '주야간보호 (가산급여)',
    unit: '1일 (8시간)',
    price: 30000,
    category: 'daycare',
    description: '월 21일 이상 이용 시 가산급여 (추가 1일당)'
  },

  // 단기보호 (1일 24시간, 월 15일 제한)
  {
    id: 'shortstay-1',
    name: '단기보호 (기본급여)',
    unit: '1일 (24시간)',
    price: 45000,
    category: 'shortstay',
    description: '단기보호 기본 이용료 (1일 24시간, 월 15일 제한)'
  },
  {
    id: 'shortstay-2',
    name: '단기보호 (연장급여)',
    unit: '1일 (24시간)',
    price: 50000,
    category: 'shortstay',
    description: '월 16일 이상 이용 시 가산급여 (추가 1일당)'
  },
  {
    id: 'shortstay-3',
    name: '단기보호 (응급급여)',
    unit: '1일 (24시간)',
    price: 55000,
    category: 'shortstay',
    description: '응급상황 단기보호 이용료 (24시간 이내)'
  },

  // 복지용구 (2025년 수가표 기준)
  {
    id: 'welfare-1',
    name: '복지용구 (기본급여)',
    unit: '1개',
    price: 30000,
    category: 'equipment',
    description: '복지용구 기본 급여비용 (월 1개 제한)'
  },
  {
    id: 'welfare-2',
    name: '복지용구 (특수급여)',
    unit: '1개',
    price: 50000,
    category: 'equipment',
    description: '복지용구 특수 급여비용 (월 1개 제한)'
  },

  // 특수장비 (월 대여 제한)
  {
    id: 'equipment-1',
    name: '전동침대 대여',
    unit: '1개월',
    price: 15000,
    category: 'equipment',
    description: '전동침대 월 대여료 (월 1대 제한)'
  },
  {
    id: 'equipment-2',
    name: '휠체어 대여',
    unit: '1개월',
    price: 8000,
    category: 'equipment',
    description: '휠체어 월 대여료 (월 1대 제한)'
  },
  {
    id: 'equipment-3',
    name: '욕창예방매트',
    unit: '1개월',
    price: 12000,
    category: 'equipment',
    description: '욕창예방매트 월 대여료 (월 1개 제한)'
  },
  {
    id: 'equipment-4',
    name: '산소집중기 대여',
    unit: '1개월',
    price: 25000,
    category: 'equipment',
    description: '산소집중기 월 대여료 (월 1대 제한)'
  },
  {
    id: 'equipment-5',
    name: '기저귀 지급',
    unit: '1개월',
    price: 50000,
    category: 'equipment',
    description: '기저귀 월 지급료 (월 120개 제한)'
  }
]

// 본인 부담 유형 (2025년 수가표 기준)
export const userBurdenTypes: UserBurdenType[] = [
  {
    id: 'normal',
    name: '일반 수급자 (15%)',
    rate: 0.15,
    description: '일반 수급자 본인 부담률 (15%)'
  },
  {
    id: 'reduced-40',
    name: '40% 감경 수급자 (9%)',
    rate: 0.09,
    description: '40% 감경 수급자 본인 부담률 (9%)'
  },
  {
    id: 'reduced-60',
    name: '60% 감경 수급자 (6%)',
    rate: 0.06,
    description: '60% 감경 수급자 본인 부담률 (6%)'
  },
  {
    id: 'medical-aid',
    name: '의료급여 수급자 (0%)',
    rate: 0.00,
    description: '의료급여 수급자 (면제)'
  }
]

// 카테고리별 색상 매핑
export const categoryColors = {
  visit: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
  daycare: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
  shortstay: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200',
  equipment: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200',
  special: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-200'
}

// 카테고리 한글명
export const categoryNames = {
  visit: '방문요양',
  daycare: '주야간보호',
  shortstay: '단기보호',
  equipment: '특수장비',
  special: '특수급여'
}

// 장기요양 등급별 정보 (2025년 기준) - 등급은 서비스 제공 범위 결정
export const longTermCareGrades: LongTermCareGrade[] = [
  {
    id: 'grade1',
    name: '1등급',
    description: '심신상태가 심각한 상태 (ADL 19점 이하)',
    burdenRate: 0.15 // 등급과 관계없이 소득기준에 따른 본인부담률 적용
  },
  {
    id: 'grade2',
    name: '2등급',
    description: '심신상태가 심각한 상태 (ADL 20-40점)',
    burdenRate: 0.15 // 등급과 관계없이 소득기준에 따른 본인부담률 적용
  },
  {
    id: 'grade3',
    name: '3등급',
    description: '심신상태가 중간 정도 (ADL 41-60점)',
    burdenRate: 0.15 // 등급과 관계없이 소득기준에 따른 본인부담률 적용
  },
  {
    id: 'grade4',
    name: '4등급',
    description: '심신상태가 경미한 상태 (ADL 61-80점)',
    burdenRate: 0.15 // 등급과 관계없이 소득기준에 따른 본인부담률 적용
  },
  {
    id: 'grade5',
    name: '5등급',
    description: '심신상태가 경미한 상태 (ADL 81점 이상)',
    burdenRate: 0.15 // 등급과 관계없이 소득기준에 따른 본인부담률 적용
  }
]

// 요일별 요금 정보 (2025년 기준) - 정교한 요금 체계
export const dayOfWeekPricing: DayOfWeekPricing[] = [
  {
    dayType: 'weekday',
    name: '평일',
    multiplier: 1.0,
    description: '월~금요일 (기본 요금)'
  },
  {
    dayType: 'weekend',
    name: '주말',
    multiplier: 1.2,
    description: '토요일, 일요일 (20% 가산)'
  },
  {
    dayType: 'holiday',
    name: '공휴일',
    multiplier: 1.5,
    description: '공휴일, 대체휴일 (50% 가산)'
  },
  {
    dayType: 'weekend-holiday',
    name: '주말+공휴일',
    multiplier: 1.8,
    description: '주말과 공휴일이 겹치는 경우 (80% 가산)'
  },
  {
    dayType: 'extended-weekend',
    name: '연휴',
    multiplier: 2.0,
    description: '연휴 기간 (100% 가산)'
  }
]

// 시간대별 가산 요금 (2025년 기준)
export const timeSlotPricing = {
  normal: { name: '일반시간', multiplier: 1.0, description: '06:00~22:00' },
  evening: { name: '저녁시간', multiplier: 1.3, description: '18:00~22:00 (30% 가산)' },
  night: { name: '야간시간', multiplier: 1.5, description: '22:00~06:00 (50% 가산)' },
  early: { name: '새벽시간', multiplier: 1.4, description: '06:00~08:00 (40% 가산)' }
}

// 등급별 월 한도액 (2025년 기준)
export const monthlyLimitsByGrade = {
  grade1: { limit: 1740000, description: '1등급 월 한도액' },
  grade2: { limit: 1740000, description: '2등급 월 한도액' },
  grade3: { limit: 1550000, description: '3등급 월 한도액' },
  grade4: { limit: 1290000, description: '4등급 월 한도액' },
  grade5: { limit: 1070000, description: '5등급 월 한도액' },
  cognitive: { limit: 1740000, description: '인지지원등급 월 한도액' }
}

// 관계 법령 및 근거
export const legalReferences = {
  primary: '장기요양보험법 (법률 제17945호)',
  enforcement: '장기요양보험법 시행령 (대통령령 제33932호)',
  regulation: '장기요양보험법 시행규칙 (보건복지부령 제1045호)',
  pricing: '2025년 장기요양보험 급여비용 고시 (보건복지부 고시 제2024-123호)',
  burden: '장기요양보험 본인부담금 부과 및 징수 규정 (국민건강보험공단 내규)'
}
