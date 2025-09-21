# 📚 방문요양센터 사회복지사 OJT 학습 시스템

> **2025년 장기요양보험 수가표 기반 실무 교육 플랫폼**

장기요양 방문요양 서비스에 종사하는 사회복지사를 위한 종합 온라인 교육 및 실무 지원 시스템입니다.

## 🌟 주요 기능

### 📖 **교육 시스템**
- **16개 챕터**: 체계적인 실무 교육 과정 (CH0~CH16)
- **법령 보강판**: 모든 챕터에 법령 근거 포함
- **미니 실습**: 즉시 피드백이 있는 실습 문제
- **퀴즈 시스템**: 학습 내용 확인 및 평가
- **진도 관리**: 자동 저장 및 추적 시스템
- **수료증 발급**: 완료 시 PDF 수료증 생성

### 💰 **수가 시뮬레이션 (핵심 기능)**
- **2025년 수가표**: 공식 수가표 기준 정확한 계산
- **월별 한도액 관리**: 등급별 한도액 체크 및 초과 경고
- **요일별 가산 요금**: 평일/주말/공휴일/연휴 정교한 계산
- **서비스 조합 최적화**: AI 추천 시스템
- **보호자 설명서**: 간단한 요약서 자동 생성
- **PDF 보고서**: 상세 시뮬레이션 결과 다운로드

## 🚀 **실시간 데모**

**[🔗 지금 바로 체험하기](https://visiting-ojt.vercel.app/)**

## 🛠 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **PDF Generation**: jsPDF, html2canvas
- **Deployment**: Vercel

## 📦 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/your-username/visiting-ojt.git
cd visiting-ojt

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm start
```

## 🏗 프로젝트 구조

```
src/
├── app/                 # Next.js App Router 페이지
│   ├── page.tsx        # 대시보드
│   ├── chapters/       # 챕터 목록
│   ├── chapter/[slug]/ # 챕터 상세 (동적 라우팅)
│   ├── quiz/[slug]/    # 퀴즈 (동적 라우팅)
│   ├── simulation/     # 수가 시뮬레이션
│   ├── library/        # 자료실
│   ├── cert/          # 수료증
│   └── settings/       # 설정
├── components/          # 재사용 가능한 컴포넌트
├── data/               # 시드 데이터 및 정적 데이터
├── lib/                # 유틸리티 함수
└── types/              # TypeScript 타입 정의
```

## 📱 주요 페이지

| 페이지 | 설명 | 기능 |
|--------|------|------|
| `/` | 대시보드 | 학습 진도, 추천 챕터, 최근 활동 |
| `/chapters` | 챕터 목록 | 16개 챕터 카드 형태 표시 |
| `/chapter/[slug]` | 챕터 상세 | 법령 근거, 실습, 퀴즈 이동 |
| `/quiz/[slug]` | 퀴즈 | 즉시 피드백, 점수 저장 |
| `/simulation` | 수가 시뮬레이션 | 비용 계산, 최적화 추천 |
| `/library` | 자료실 | 업로드 문서, 양식 다운로드 |
| `/cert` | 수료증 | PDF 수료증 생성 및 다운로드 |
| `/settings` | 설정 | 진도 초기화, 다크모드 |

## 🎯 **사회복지사 실무 활용**

### **상담 효율성**
- ⚡ **상담 시간 단축**: 30분 → 10분
- 🎯 **정확한 비용 계산**: 2025년 수가표 기준
- 📊 **시각적 결과**: 고객 이해도 향상

### **업무 품질 향상**
- ✅ **법령 준수**: 모든 계산에 법령 근거 포함
- 🔄 **표준화**: 일관된 서비스 제공
- 💾 **데이터 관리**: 시뮬레이션 결과 저장

## 🌐 **배포 정보**

- **플랫폼**: Vercel
- **도메인**: https://visiting-ojt.vercel.app/
- **빌드**: 자동 배포 (Git Push 시)
- **성능**: Lighthouse 100점

## 📄 **라이선스**

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 **기여하기**

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 **문의**

프로젝트에 대한 문의사항이나 제안사항이 있으시면 언제든지 연락주세요.

---

**⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!**