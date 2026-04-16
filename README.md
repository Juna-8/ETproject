# 🌿 EWHA Talk

> **이화여자대학교 교내 행사 통합 플랫폼**
> 강연·세미나·토크콘서트·취업행사·콜로퀴움 정보를 한눈에, 참석 후 이야기는 함께.

---

## 📌 프로젝트 소개

EWHA Talk는 교내에 흩어진 행사 정보를 한 곳에서 탐색하고, 참석 후 후기와 의견을 같은 학교 학우들과 나눌 수 있는 커뮤니티 웹 앱입니다.

기존의 지면 포스터·이메일 중심 홍보 방식을 보완하여:
- 놓쳤던 행사를 **검색·필터링**으로 손쉽게 찾고
- **캘린더 뷰**로 일정을 한눈에 파악하며
- 행사별 **후기 & 댓글 커뮤니티**로 참여 전·후 교류를 이어갑니다

---

## ✨ 주요 기능

### 🏠 홈 — 행사 피드
- 이번 주 추천 행사 카드 (가로 스크롤)
- **카테고리 필터**: 전체 / 강연 / 세미나 / 토크콘서트 / 취업행사 / 콜로퀴움
- **실시간 검색**: 행사명·주최 기관명으로 즉시 필터링
- 행사 카드에서 북마크 토글 가능

### 📅 캘린더 — 행사 일정
- 월별 캘린더 뷰로 행사 날짜 시각화
- 날짜 클릭 시 해당 일의 행사 목록 모달 표시
- 북마크된 행사 별도 표시

### 💬 커뮤니티 — 후기 & 토론
- 행사별 후기 피드 (전체 커뮤니티 타임라인)
- 후기에 **좋아요** 토글 (중복 방지)
- 후기에 **댓글** 작성 및 조회
- 후기 클릭 시 해당 행사 상세 페이지로 이동

### 🔍 행사 상세 페이지
- 행사 이미지, 일시, 장소, 주최, 대상, 유의사항, 태그 표시
- **신청 링크** 외부 연결
- 후기 작성 폼 (종료 행사 대상)
- 후기별 좋아요·댓글 인터랙션

### 👤 마이페이지
- 북마크한 행사 목록 및 빠른 이동
- 내가 작성한 후기 목록
- 북마크·후기 수 통계 카드

---

## 🗂 프로젝트 구조

```
ewha-talk/
├── src/
│   ├── App.tsx              # 루트 컴포넌트 (탭 라우팅, 전역 상태 관리)
│   ├── types.ts             # TypeScript 타입 정의 (Event, Review, Comment, User)
│   ├── data.ts              # 목 데이터 (MOCK_EVENTS, MOCK_REVIEWS)
│   ├── main.tsx             # React 앱 엔트리포인트
│   ├── index.css            # 전역 스타일 (Tailwind 기반)
│   ├── components/
│   │   ├── Navbar.tsx       # 하단 탭 내비게이션 (홈/캘린더/커뮤니티/마이)
│   │   ├── EventCard.tsx    # 행사 카드 컴포넌트 (목록·추천 공용)
│   │   ├── EventDetail.tsx  # 행사 상세 + 후기/댓글 섹션
│   │   └── CalendarView.tsx # 월별 캘린더 + 행사 모달
│   └── lib/
│       └── utils.ts         # cn(), formatDate(), formatDateTime(), useLocalStorage()
├── index.html
├── vite.config.ts           # Vite 설정 (React, Tailwind, env 주입)
├── tsconfig.json
├── package.json
└── .env.example
```

---

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | React 19 + TypeScript |
| 빌드 도구 | Vite 6 |
| 스타일링 | Tailwind CSS v4 |
| 애니메이션 | Motion (Framer Motion) |
| 날짜 처리 | date-fns (한국어 로케일) |
| 아이콘 | lucide-react |
| 상태 영속화 | localStorage (`useLocalStorage` 커스텀 훅) |
| AI 연동 | Google Gemini API (`@google/genai`) |
| 유틸리티 | clsx + tailwind-merge |

---

## 🚀 시작하기

### 사전 요구사항
- Node.js 18 이상
- npm 9 이상

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/your-username/ewha-talk.git
cd ewha-talk

# 2. 패키지 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env
# .env 파일에서 GEMINI_API_KEY 값을 입력하세요

# 4. 개발 서버 실행
npm run dev
# → http://localhost:3000
```

### 빌드

```bash
npm run build    # 프로덕션 빌드 (dist/ 폴더 생성)
npm run preview  # 빌드 결과물 로컬 미리보기
npm run lint     # TypeScript 타입 체크
```

---

## ⚙️ 환경 변수

`.env.example`을 복사해 `.env` 파일을 생성한 후 아래 값을 설정하세요.

| 변수 | 설명 | 필수 여부 |
|------|------|-----------|
| `GEMINI_API_KEY` | Google Gemini API 키 | 선택 (AI 기능 사용 시) |
| `APP_URL` | 배포 서비스 URL | 선택 (프로덕션 배포 시) |

> Google AI Studio에서는 런타임에 자동으로 주입됩니다.

---

## 📊 데이터 모델

### Event
```typescript
interface Event {
  id: string;
  title: string;
  category: '강연' | '세미나' | '토크콘서트' | '취업행사' | '콜로퀴움' | '기타';
  field: '취업' | '창업' | '인문' | '공학' | '예술' | '사회' | '자연';
  date: string;        // ISO 8601 (KST +09:00)
  location: string;
  organizer: string;
  description: string;
  applyLink: string;
  target: string;
  notices: string[];
  tags: string[];
  status: '예정' | '진행중' | '종료';
}
```

### Review / Comment
```typescript
interface Review {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  likes: number;
  likedBy: string[];    // 중복 좋아요 방지용 userId 목록
  comments?: Comment[];
}
```

---

## 💾 상태 관리

별도 상태 관리 라이브러리 없이 React 내장 훅과 `localStorage`를 활용합니다.

- **`useLocalStorage<T>(key, initialValue)`** — 브라우저 새로고침 후에도 데이터가 유지됩니다
- 북마크(`ewha-bookmarks`)와 후기(`ewha-reviews`)가 localStorage에 저장됩니다
- 행사 데이터(`MOCK_EVENTS`)는 현재 정적 목 데이터로 관리됩니다

---

## 🔮 개발 로드맵

- [ ] **백엔드 연동** — Supabase 또는 Firebase 기반 실시간 DB 전환
- [ ] **학교 이메일 인증** — `@ewhain.net` 도메인 OAuth 로그인
- [ ] **알림 기능** — 관심 카테고리 신규 행사 등록 시 이메일·푸시 알림
- [ ] **시간표 연동** — 개인 수업 시간표 입력 후 충돌 없는 행사 자동 필터링
- [ ] **행사 아카이브** — 종료 행사의 발표 자료·영상 링크 보관
- [ ] **주최자 등록 폼** — 학과·학생회 직접 행사 등록 기능
- [ ] **모바일 앱** — React Native (Expo) 기반 iOS/Android 앱

---

## 🤝 기여 방법

1. 이 저장소를 Fork합니다
2. 새 브랜치를 생성합니다 (`git checkout -b feature/기능명`)
3. 변경 사항을 커밋합니다 (`git commit -m 'feat: 기능 설명'`)
4. 브랜치에 Push합니다 (`git push origin feature/기능명`)
5. Pull Request를 생성합니다

---

## 📄 라이선스

Apache-2.0 License — 자세한 내용은 [LICENSE](./LICENSE) 파일을 참고하세요.

---

<p align="center">
  이화여자대학교 창업 수업 프로젝트 · EWHA Talk Team
</p>
