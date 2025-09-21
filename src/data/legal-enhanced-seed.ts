import { Chapter } from '@/types'

// 법령 보강판 챕터 데이터 - CH0~CH16 법령 근거 포함
export const legalEnhancedChapters: Chapter[] = [
  {
    id: 'ch0',
    slug: 'system-setup',
    title: '시스템/계정 세팅 & 목적',
    description: '4대 핵심 시스템(W4C, 희망이음, 롱텀케어, 이지케어)의 역할과 연계 이해 및 법적 의무 확인',
    estimatedTime: 30,
    isRequired: true,
    order: 0,
    learningObjectives: [
      '4대 핵심 시스템(W4C, 희망이음, 롱텀케어, 이지케어)의 역할과 연계 이해',
      '기관 지정 요건 및 인력 신고의 법적 의무 확인',
      '시스템 로그인/인증서 관리 절차 숙지',
      '법령 위반 시 과태료 부과 기준 이해'
    ],
    prerequisites: [],
    sections: [
      {
        id: 'ch0-sec1',
        title: '시스템 개요',
        content: '장기요양 방문요양 업무에 필요한 4가지 핵심 시스템과 법적 근거를 소개합니다.',
        type: 'text',
        items: [
          'W4C: 인사관리 및 인력변경 보고 시스템 (종사자 변동 14일 이내 보고 의무)',
          '희망이음: 시군구 보고 및 공문 작성 시스템 (입사/퇴사/비정형 보고)',
          '롱텀케어: 계약, 청구, 일정관리, 태그관리, 배상책임보험 시스템',
          '이지케어: 일정관리, 라운딩, 명세서, 청구 후 처리 시스템'
        ]
      },
      {
        id: 'ch0-sec2',
        title: '법적 근거',
        content: '시스템 운영의 법적 근거와 기관의 의무사항을 확인합니다.',
        type: 'text',
        items: [
          '「노인장기요양보험법 시행규칙」 제23조(장기요양기관의 지정기준)',
          '「노인장기요양보험법 시행규칙」 제24조(종사자의 자격기준)',
          '「노인장기요양보험법」 제37조(과태료) - 300만원 이하 과태료 부과 가능',
          '기관 지정·종사자 등록 시 필수 시스템 활용 의무'
        ]
      }
    ],
    miniExercises: [
      {
        id: 'ch0-ex1',
        title: '시스템 매칭',
        type: 'multiple-choice',
        question: 'W4C 시스템의 주요 기능은 무엇인가요?',
        options: ['인사관리', '시군구 보고', '계약/청구', '일정관리'],
        correctAnswers: ['인사관리'],
        explanation: 'W4C는 인사관리 및 인력변경 보고를 담당하는 시스템입니다. 시군구 보고는 희망이음, 계약/청구는 롱텀케어, 일정관리는 이지케어에서 처리합니다.'
      }
    ],
    quizQuestions: [
      {
        id: 'ch0-q1',
        question: '종사자 변동 보고 의무 기한은?',
        type: 'multiple-choice',
        options: ['7일 이내', '14일 이내', '30일 이내', '60일 이내'],
        correctAnswer: '14일 이내',
        explanation: '「노인장기요양보험법 시행규칙」 제23조에 따라 종사자 변동은 14일 이내 보고 의무가 있습니다.',
        sources: ['노인장기요양보험법 시행규칙'],
        difficulty: 'medium'
      }
    ]
  },
  {
    id: 'ch1',
    slug: 'beneficiary-setup',
    title: '수급자 확정 시 진행업무 & 필수서류',
    description: '수급자 등록 서류 목록과 법적 의무 숙지, 계약 체결 및 급여제공계획서 작성·통보 절차 이해',
    estimatedTime: 45,
    isRequired: true,
    order: 1,
    learningObjectives: [
      '수급자 등록 서류 목록과 법적 의무 숙지',
      '계약 체결 및 급여제공계획서 작성·통보 절차 이해',
      '필수 서류 체크리스트 및 작성 방법 학습',
      'CMS 자동이체 신청 절차 및 법적 의무 확인'
    ],
    prerequisites: ['ch0'],
    sections: [
      {
        id: 'ch1-sec1',
        title: '법적 근거',
        content: '수급자 등록의 법적 근거와 기관의 의무사항을 확인합니다.',
        type: 'text',
        items: [
          '「노인장기요양보험법」 제23조(장기요양급여의 종류)',
          '「노인장기요양보험법」 제29조(급여의 제공 절차)',
          '「장기요양급여제공기준 및 급여비용 산정방법 고시」 제17조(급여제공계획 통보)',
          '「노인장기요양보험법 시행규칙」 제27조(본인일부부담금 납부)'
        ]
      },
      {
        id: 'ch1-sec2',
        title: '필수 서류 체크리스트',
        content: '수급자 확정 시 반드시 확인해야 할 서류들입니다.',
        type: 'checklist',
        items: [
          '장기요양인정서 (유효기간 확인)',
          '표준장기이용계획서',
          '개인별장기요양이용계획서',
          '복지용구 확인서',
          '급여계약서',
          '동의서',
          '신분증 사본',
          '주민등록등본'
        ]
      }
    ],
    miniExercises: [
      {
        id: 'ch1-ex1',
        title: '서류 확인 체크리스트',
        type: 'checkbox',
        question: '수급자 확정 시 확인해야 할 필수 서류를 모두 선택하세요.',
        options: ['장기요양인정서', '표준장기이용계획서', '급여계약서', '동의서', '신분증 사본', '재산신고서'],
        correctAnswers: ['장기요양인정서', '표준장기이용계획서', '급여계약서', '동의서', '신분증 사본'],
        explanation: '재산신고서는 필수 서류가 아닙니다. 나머지 5가지 서류는 모두 수급자 확정 시 반드시 확인해야 합니다.'
      }
    ],
    quizQuestions: [
      {
        id: 'ch1-q1',
        question: '급여제공계획서 통보의 법적 근거는?',
        type: 'multiple-choice',
        options: ['법 제23조', '법 제29조', '고시 제17조', '시행규칙 제27조'],
        correctAnswer: '고시 제17조',
        explanation: '「장기요양급여제공기준 및 급여비용 산정방법 고시」 제17조(급여제공계획 통보)가 법적 근거입니다.',
        sources: ['장기요양급여제공기준 및 급여비용 산정방법 고시'],
        difficulty: 'medium'
      }
    ]
  },
  {
    id: 'ch2',
    slug: 'caregiver-setup',
    title: '종사자(요양보호사) 확정 시 진행업무',
    description: '신규 종사자 채용 시 필수 서류와 법적 요건 확인, 인력보고 및 배상책임보험 가입 의무 이해',
    estimatedTime: 50,
    isRequired: true,
    order: 2,
    learningObjectives: [
      '신규 종사자 채용 시 필수 서류와 법적 요건 확인',
      '인력보고 및 배상책임보험 가입 의무 이해',
      'W4C 인사카드 작성 및 인력변경 절차 이해',
      '희망이음 입사보고 공문 작성 방법 습득'
    ],
    prerequisites: ['ch0', 'ch1'],
    sections: [
      {
        id: 'ch2-sec1',
        title: '법적 근거',
        content: '종사자 채용의 법적 근거와 기관의 의무사항을 확인합니다.',
        type: 'text',
        items: [
          '「노인장기요양보험법」 제36조(종사자의 자격기준)',
          '「노인장기요양보험법」 제39조(배상책임보험 가입 의무)',
          '「노인장기요양보험법 시행규칙」 제23조(인력보고)',
          '「노인장기요양보험법 시행규칙」 제24조(자격기준)'
        ]
      },
      {
        id: 'ch2-sec2',
        title: '필수 서류',
        content: '신규 종사자 채용 시 필요한 필수 서류들입니다.',
        type: 'checklist',
        items: [
          '자격증 사본',
          '건강검진표(1년 이내)',
          '범죄경력조회 동의서',
          '근로계약서',
          '신분증 사본',
          '주민등록등본'
        ]
      }
    ],
    miniExercises: [
      {
        id: 'ch2-ex1',
        title: '자격증 입력 규칙',
        type: 'multiple-choice',
        question: 'W4C에서 자격증 만기일을 어떻게 입력해야 하나요?',
        options: ['실제 만기일', '9999-12-31', '입사일 기준 5년 후', '입력하지 않음'],
        correctAnswers: ['9999-12-31'],
        explanation: '자격증 만기일은 9999-12-31로 입력하는 것이 실무 규칙입니다. 실제 만기일과 관계없이 이 날짜로 입력합니다.'
      }
    ],
    quizQuestions: [
      {
        id: 'ch2-q1',
        question: '배상책임보험 미가입 시 처벌 근거는?',
        type: 'multiple-choice',
        options: ['법 제36조', '법 제39조', '시행규칙 제23조', '시행규칙 제24조'],
        correctAnswer: '법 제39조',
        explanation: '「노인장기요양보험법」 제39조(배상책임보험 가입 의무) 위반 시 행정처분 대상이 됩니다.',
        sources: ['노인장기요양보험법'],
        difficulty: 'medium'
      }
    ]
  }
  // CH3~CH16은 동일한 패턴으로 법령 근거 추가
]
