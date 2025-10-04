FE (React + TypeScript + Vite)

<실행 (Vite 개발 서버)>
npm run dev      # 개발 서버: http://localhost:5173
npm run build    # 배포용 빌드: dist/ 생성
npm run preview  # 빌드 미리보기 (dist/ 서빙)

<폴더 구조 (핵심)>
src/
├─ app/            # 앱 엔트리/레이아웃/라우팅 (App.tsx, router.tsx)
├─ pages/          # 라우트 화면 (예: Home, Settings)
├─ features/       # 기능 묶음 (예: auth, live-monitoring)
├─ entities/       # 도메인 타입/모델 (예: user)
├─ shared/         # 공통(재사용) 모듈
│  ├─ api/         # axios 인스턴스, 인터셉터
│  ├─ config/      # 환경변수(env.ts), 라우트 상수(routes.ts)
│  ├─ styles/      # 전역 스타일(index.css)
│  ├─ ui/          # 버튼/인풋/모달 등 공통 UI
│  ├─ hooks/       # 범용 훅
│  └─ lib/         # 범용 유틸
└─ assets/         # 이미지/아이콘/폰트

<백엔드와의 매핑>

config → shared/config

controllers → features/*

middlewares → shared/api/interceptors

models → entities/*

routes → app/router.tsx

swagger → docs/api

<환경변수>

.env는 커밋 금지, **.env.example**만 공유 (키 이름만)

Vite 규칙: 키는 VITE_ 접두사 필요

# .env.example
VITE_API_BASE_URL=http://localhost:8080


모든 API 호출은 src/shared/api/client.ts 통해서만

<Git 주의사항 (중요)>

올리지 말 것: node_modules/, dist/, .env, .DS_Store

올려도 됨: .env.example (샘플 키만)

<팀 작업 요약>

페이지는 pages/, 기능은 features/, 공통은 shared/

실행은 npm run dev, 배포는 npm run build

브랜치 → PR로 리뷰 후 머지