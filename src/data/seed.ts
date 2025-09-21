import { Chapter } from '@/types'

// 법령 보강판 챕터 데이터 - CH0~CH16 법령 근거 포함
export const chaptersData: Chapter[] = [
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
      },
      {
        id: 'ch0-sec3',
        title: '실무 순서',
        content: '시스템 활용의 올바른 순서와 실무 팁을 학습합니다.',
        type: 'text',
        items: [
          '1단계: W4C - 종사자 인사카드 등록, 입·퇴사 신고',
          '2단계: 희망이음 - 시군구 보고(입사/퇴사/비정형 보고), 공지사항 확인',
          '3단계: 롱텀케어 - 수급자·종사자 계약/해지, 급여제공계획서 통보, 태그점검, 청구',
          '4단계: 이지케어 - 일정관리, 급여명세서, CMS 자동이체'
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
      },
      {
        id: 'ch0-ex2',
        title: '희망이음 시스템 기능',
        type: 'multiple-choice',
        question: '희망이음 시스템의 주요 기능은 무엇인가요?',
        options: ['인사관리', '시군구 보고', '계약/청구', '일정관리'],
        correctAnswers: ['시군구 보고'],
        explanation: '희망이음은 시군구 보고 및 공문 작성을 담당하는 시스템입니다. 각 시스템은 고유한 업무 영역을 담당하며 상호 연계되어 작동합니다.'
      }
    ],
    quizQuestions: [
      {
        id: 'ch0-q1',
        question: 'W4C 시스템의 주요 기능은 무엇인가요?',
        type: 'multiple-choice',
        options: ['인사관리 및 인력변경 보고', '계약 및 청구 관리', '일정 관리', '명세서 작성'],
        correctAnswer: '인사관리 및 인력변경 보고',
        explanation: 'W4C는 Work for Care의 줄임말로, 요양보호사 인사관리와 인력변경 보고를 담당하는 시스템입니다.',
        sources: ['시스템 매뉴얼'],
        difficulty: 'easy'
      },
      {
        id: 'ch0-q2',
        question: '이지케어 시스템에서 처리하는 주요 업무는 무엇인가요?',
        type: 'multiple-choice',
        options: ['인사관리', '일정관리 및 라운딩', '계약 관리', '보험 관리'],
        correctAnswer: '일정관리 및 라운딩',
        explanation: '이지케어는 일정관리, 라운딩, 명세서 작성, 청구 후 처리를 담당하는 시스템입니다.',
        sources: ['시스템 매뉴얼'],
        difficulty: 'easy'
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
      },
      {
        id: 'ch1-sec3',
        title: '실무 팁',
        content: '수급자 등록 시 주의사항과 실무 요령을 학습합니다.',
        type: 'text',
        items: [
          '계약서·동의서는 2부 작성(센터·보호자 보관)',
          'CMS 자동이체 신청 누락 시 법 제27조 위반 소지',
          '급여제공계획서 통보는 반드시 법령 기한 내 완료',
          '서류 보관 의무: 5년 이상 보관 (법 제41조)'
        ]
      }
    ],
    miniExercises: [
      {
        id: 'ch1-ex1',
        title: '서류 확인 체크리스트',
        type: 'checkbox',
        question: '수급자 확정 시 확인해야 할 필수 서류를 모두 선택하세요.',
        options: ['장기요양인정서', '표준장기이용계획서', '개인별장기요양이용계획서', '신분증 사본', '주민등록등본', '의료보험증', '재산신고서'],
        correctAnswers: ['장기요양인정서', '표준장기이용계획서', '개인별장기요양이용계획서', '신분증 사본', '주민등록등본', '의료보험증'],
        explanation: '재산신고서는 필수 서류가 아닙니다. 나머지 6가지 서류는 모두 수급자 확정 시 반드시 확인해야 합니다.'
      }
    ],
    quizQuestions: [
      {
        id: 'ch1-q1',
        question: '수급자 확정 시 가장 먼저 확인해야 할 서류는 무엇인가요?',
        type: 'multiple-choice',
        options: ['표준장기이용계획서', '장기요양인정서', '개인별장기요양이용계획서', '신분증 사본'],
        correctAnswer: '장기요양인정서',
        explanation: '장기요양인정서는 수급자 자격을 확인하는 가장 기본적인 서류이며, 유효기간도 함께 확인해야 합니다.',
        sources: ['수급자 관리 매뉴얼'],
        difficulty: 'easy'
      },
      {
        id: 'ch1-q2',
        question: '장기요양인정서 확인 시 가장 중요한 점은 무엇인가요?',
        type: 'multiple-choice',
        options: ['발급일 확인', '유효기간 확인', '발급기관 확인', '인정등급 확인'],
        correctAnswer: '유효기간 확인',
        explanation: '장기요양인정서의 유효기간이 만료되면 서비스 제공이 중단될 수 있으므로 반드시 확인해야 합니다.',
        sources: ['수급자 관리 매뉴얼'],
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
        title: '요양보호사 등록 절차',
        content: '요양보호사 확정 시 진행해야 할 업무 절차입니다.',
        type: 'procedure',
        procedures: [
          { id: 'step1', title: '필요서류 준비', description: '요양보호사 자격증, 신분증, 건강진단서 등 준비', isCompleted: false, order: 1 },
          { id: 'step2', title: 'W4C 인사카드 등록', description: 'W4C 시스템에서 인사카드 작성 및 등록', isCompleted: false, order: 2 },
          { id: 'step3', title: '희망이음 입사보고', description: '희망이음 시스템에서 입사보고 공문 작성', isCompleted: false, order: 3 },
          { id: 'step4', title: '롱텀 RFID 등록', description: '롱텀케어 시스템에서 RFID 태그 등록', isCompleted: false, order: 4 },
          { id: 'step5', title: '배상책임보험 가입', description: '배상책임보험 가입 및 등록', isCompleted: false, order: 5 }
        ]
      }
    ],
    miniExercises: [
      {
        id: 'ch2-ex1',
        title: '등록 순서 정렬',
        type: 'sort',
        question: '요양보호사 등록 시 올바른 순서로 정렬하세요.',
        options: ['희망이음 입사보고', 'W4C 인사카드 등록', '필요서류 준비', '롱텀 RFID 등록', '배상책임보험 가입'],
        correctAnswers: ['필요서류 준비', 'W4C 인사카드 등록', '희망이음 입사보고', '롱텀 RFID 등록', '배상책임보험 가입'],
        explanation: '서류 준비 → W4C 등록 → 희망이음 보고 → RFID 등록 → 보험 가입 순서로 진행해야 합니다.'
      }
    ],
    quizQuestions: [
      {
        id: 'ch2-q1',
        question: '요양보호사 등록 시 W4C 인사카드 등록 다음 단계는 무엇인가요?',
        type: 'multiple-choice',
        options: ['롱텀 RFID 등록', '희망이음 입사보고', '배상책임보험 가입', '건강진단서 제출'],
        correctAnswer: '희망이음 입사보고',
        explanation: 'W4C 인사카드 등록 후 희망이음 시스템에서 입사보고 공문을 작성해야 합니다.',
        sources: ['W4C 매뉴얼'],
        difficulty: 'easy'
      },
      {
        id: 'ch2-q2',
        question: '롱텀 RFID 등록의 목적은 무엇인가요?',
        type: 'multiple-choice',
        options: ['급여 계산', '전자출결 관리', '일정 관리', '서류 관리'],
        correctAnswer: '전자출결 관리',
        explanation: 'RFID는 전자출결 시스템으로 요양보호사의 출입 및 근무시간을 자동으로 기록합니다.',
        sources: ['롱텀케어 가이드'],
        difficulty: 'medium'
      }
    ]
  },
  {
    id: 'ch16',
    slug: 'phone-consultation-advanced',
    title: '전화상담(사회복지사 케이스별 대응 – 심화판)',
    description: '방문요양센터 사회복지사의 전화 상담 유형을 이해하고, 민감하거나 난감한 케이스별 대응 방법을 학습합니다.',
    estimatedTime: 60,
    isRequired: true,
    order: 16,
    learningObjectives: [
      '방문요양센터 사회복지사의 전화 상담 유형 이해',
      '민감하거나 난감한 어글리 케이스에서 근거와 절차 기반 대처 능력 습득',
      '상담 후 기록·보고 체계 준수 습관 형성',
      '신규 수급자, 요양보호사, 일정·청구·서류, 긴급·민감 상황별 대응 방법 숙지'
    ],
    prerequisites: ['ch0', 'ch1', 'ch2', 'ch8', 'ch13'],
    sections: [
      {
        id: 'ch16-sec1',
        title: '신규 수급자·보호자 대응',
        content: '신규 수급자와 보호자의 다양한 요청에 대한 체계적 대응 방법을 학습합니다.',
        type: 'text',
        items: [
          '등급 미확정 상태 서비스 요청 시: 불법 제공 시 불이익(청구 불능·보험 미적용) 설명 → 임시 대안(지자체 바우처) 안내',
          '비용 할인 요구 시: 본인부담률·감경 제도 근거 설명, 고시 기준 준수 원칙 안내'
        ]
      },
      {
        id: 'ch16-sec2',
        title: '요양보호사 관련 케이스',
        content: '요양보호사와 관련된 민감한 상황에 대한 대응 절차를 학습합니다.',
        type: 'text',
        items: [
          '어르신 폭언·폭행 신고: 즉시 안전 확보 → 센터장·보호자 보고 → 필요 시 노인학대 신고',
          '급여 적게 나왔다며 항의: 이지케어 명세서 확인 → 공휴일/가족요양 공제 근거 설명'
        ]
      },
      {
        id: 'ch16-sec3',
        title: '일정·청구·서류 관련 대응',
        content: '일정, 청구, 서류 관련 민원에 대한 체계적 대응 방법을 학습합니다.',
        type: 'text',
        items: [
          '서비스 시간 누락 항의: 태그/기록 누락 여부 확인 → 보완청구 가능 여부 설명 → 기록지 확보 안내',
          '청구 금액 차이로 고성: 공단 부담금 vs 본인부담금 구조 설명 → CMS 출금일 안내'
        ]
      },
      {
        id: 'ch16-sec4',
        title: '긴급·민감 상황 대응',
        content: '긴급하고 민감한 상황에서의 대응 절차와 보고 체계를 학습합니다.',
        type: 'text',
        items: [
          '귀중품 도난 의혹 제기: 사실 확인, 센터장 보고, 필요 시 경찰/공단 등 외부기관 절차 안내',
          '응급실 이송 후 보호자 항의: 기록 근거 확인, 공단 지침·보험 보장 범위 설명, 의료기관 연계 안내'
        ]
      },
      {
        id: 'ch16-sec5',
        title: '복지용구/부가 서비스 대응',
        content: '복지용구 및 부가 서비스 관련 요청에 대한 대응 방법을 학습합니다.',
        type: 'text',
        items: [
          '복지용구 업체 변경 요구: 표준장기요양이용계획서 확인 후 변경 절차 안내',
          '병원 동행 과도 요구: 장기요양 급여 항목 근거로 설명 → 필요 시 추가 계약 안내'
        ]
      }
    ],
    miniExercises: [
      {
        id: 'ch16-ex1',
        title: '상담 답변 순서 정렬',
        type: 'sort',
        question: '보호자가 "서비스부터 해달라"고 강하게 요구했을 때 올바른 답변 순서를 배열하세요.',
        options: ['감정 완화 및 경청', '불법 제공 시 불이익 설명', '임시 대안(바우처) 안내', '근거 제시'],
        correctAnswers: ['감정 완화 및 경청', '근거 제시', '불법 제공 시 불이익 설명', '임시 대안(바우처) 안내'],
        explanation: '감정을 먼저 완화하고 경청한 후, 근거를 제시하고 불이익을 설명한 뒤 대안을 안내하는 것이 효과적입니다.'
      },
      {
        id: 'ch16-ex2',
        title: '급여 항의 대응',
        type: 'multiple-choice',
        question: '요양보호사가 급여가 적게 나왔다며 항의할 때, 먼저 확인해야 할 것은?',
        options: ['근로계약서', '이지케어 급여명세서', '보호자 동의서', '본인부담금 고지서'],
        correctAnswers: ['이지케어 급여명세서'],
        explanation: '이지케어 급여명세서를 확인하여 공휴일/가족요양 공제 등이 올바르게 반영되었는지 먼저 확인해야 합니다.'
      },
      {
        id: 'ch16-ex3',
        title: '병원 이송 상황 대응',
        type: 'multiple-choice',
        question: '어르신이 병원 이송 중 보호자가 센터 책임을 묻는다면 가장 먼저 해야 할 조치는?',
        options: ['센터장 보고', '기록 근거 확인', '공단 지침 설명', '의료기관 연계'],
        correctAnswers: ['기록 근거 확인'],
        explanation: '먼저 기록 근거를 확인하여 상황을 정확히 파악한 후, 공단 지침과 보험 보장 범위를 설명해야 합니다.'
      }
    ],
    quizQuestions: [
      {
        id: 'ch16-q1',
        question: '등급 미확정 상태에서 서비스 제공 시 문제점은?',
        type: 'multiple-choice',
        options: ['본인부담 증가', '청구 불능 및 보험 미적용', '센터 운영비 증가', '등급 자동 반영'],
        correctAnswer: '청구 불능 및 보험 미적용',
        explanation: '등급이 미확정된 상태에서 서비스를 제공하면 청구가 불가능하고 보험 혜택을 받을 수 없어 불법 제공이 됩니다.',
        sources: ['장기요양급여 제공기준 고시'],
        difficulty: 'medium'
      },
      {
        id: 'ch16-q2',
        question: '요양보호사 급여가 적다는 항의 시 가장 먼저 확인해야 할 것은?',
        type: 'multiple-choice',
        options: ['근로계약서', '이지케어 급여명세서', '보호자 동의서', '본인부담금 고지서'],
        correctAnswer: '이지케어 급여명세서',
        explanation: '이지케어 급여명세서를 확인하여 공휴일, 가족요양 공제 등이 올바르게 반영되었는지 먼저 확인해야 합니다.',
        sources: ['이지케어 시스템 가이드'],
        difficulty: 'easy'
      },
      {
        id: 'ch16-q3',
        question: '보호자가 "센터가 돈을 빼돌렸다"고 항의할 때 가장 먼저 설명해야 할 항목은?',
        type: 'multiple-choice',
        options: ['CMS 출금 방식', '공단 부담금과 본인부담금 구조', '복지용구 신청 절차', '청구서 발송 방법'],
        correctAnswer: '공단 부담금과 본인부담금 구조',
        explanation: '공단 부담금과 본인부담금의 구조를 명확히 설명하여 투명한 비용 산정 과정을 안내해야 합니다.',
        sources: ['장기요양급여비용 산정방법 고시'],
        difficulty: 'medium'
      },
      {
        id: 'ch16-q4',
        question: '어르신 폭언·폭행 신고 시 사회복지사의 1차 조치는?',
        type: 'multiple-choice',
        options: ['공단 보고', '즉시 안전 확보 및 보고', '보호자 동의서 작성', '기록지 출력'],
        correctAnswer: '즉시 안전 확보 및 보고',
        explanation: '안전을 최우선으로 하고 즉시 센터장과 보호자에게 보고한 후, 필요시 노인학대 신고 절차를 진행해야 합니다.',
        sources: ['노인학대 예방 및 신고 가이드'],
        difficulty: 'easy'
      },
      {
        id: 'ch16-q5',
        question: '복지용구 변경 요청 시 먼저 확인해야 할 서류는?',
        type: 'multiple-choice',
        options: ['근로계약서', '표준장기요양이용계획서', '명세서', '청구서'],
        correctAnswer: '표준장기요양이용계획서',
        explanation: '표준장기요양이용계획서를 확인하여 복지용구 변경이 가능한지, 어떤 절차가 필요한지 파악해야 합니다.',
        sources: ['복지용구 지급 및 관리 가이드'],
        difficulty: 'easy'
      },
      {
        id: 'ch16-q6',
        question: '상담 후 기록·보고 체계에서 상담 중 가장 중요한 것은?',
        type: 'multiple-choice',
        options: ['빠른 해결책 제시', '경청 → 근거 제시 → 감정 완화', '상급자 즉시 연락', '서류 즉시 출력'],
        correctAnswer: '경청 → 근거 제시 → 감정 완화',
        explanation: '상담 중에는 먼저 상대방의 이야기를 경청하고, 근거를 제시한 후 감정을 완화시키는 것이 중요합니다.',
        sources: ['사회복지사 상담 매뉴얼'],
        difficulty: 'medium'
      }
    ]
  }
]

// 더 많은 챕터 데이터는 별도 파일로 분리하거나 여기에 추가
export const getChapterBySlug = (slug: string): Chapter | undefined => {
  return chaptersData.find(chapter => chapter.slug === slug)
}

export const getChaptersByOrder = (): Chapter[] => {
  return [...chaptersData].sort((a, b) => a.order - b.order)
}

export const getRequiredChapters = (): Chapter[] => {
  return chaptersData.filter(chapter => chapter.isRequired)
}
