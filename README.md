1. 폴더 구조

현재 프로젝트 구조는 아래와 같이 정리됨.

FE/           # 프로젝트 루트
├── app.json             # Expo 설정 (scheme 설정 포함)
├── App.tsx              # 루트 진입점 (브리지 컴포넌트)
├── package.json
├── node_modules
├── tsconfig.json
└── baby-monitor-app/    # 실제 앱 코드 위치
    ├── App.tsx          # 메인 화면(루트 컴포넌트)
    ├── app_rout/             # 화면/라우팅 관련 파일들
    └── components/      # 각종 컴포넌트 (Login 등)
    
assets/models/여기에 욜로 모델 들어잇음

lib/ai 요기 안에 뒤척임 감지로직이랑 욜로세션 파일 잇음

metro/config.js는 욜로 관련파일

2. Expo 설정 (app.json)

딥링크용 scheme

{
  "expo": {
    "name": "BabyMonitor",
    "slug": "baby-monitor",
    "scheme": "babymonitor"
  }
}
으로 고정

3. 구글 로그인 흐름:

/auth/google
→ 구글 로그인 페이지로 리다이렉트

/auth/google/callback
→ 구글이 code 전달
→ access token 발급
→ 사용자 정보 조회
→ DB 저장/조회
→ JWT 발급
→ 프론트 URL로 token, name 쿼리 붙여 리다이렉트
