1. 폴더 구조

현재 Expo 프로젝트 구조는 아래와 같이 정리됨.

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

2. Expo 설정 (app.json)

딥링크용 scheme 등록을 위해 app.json에 scheme를 추가했다.

{
  "expo": {
    "name": "BabyMonitoring",
    "slug": "baby-monitoring",
    "scheme": "myapp",
    // ... 기타 설정
  }
}

scheme: 딥링크에서 사용할 스킴 이름

예: myapp://login-callback

모바일 앱 빌드 시 myapp://... 링크를 클릭하면 이 앱이 열리도록 하는 역할.

3. API_BASE_URL (프론트 환경변수)

Expo에서는 EXPO_PUBLIC_ prefix가 붙은 값만 프론트에서 접근 가능하다.

# .env (프론트 기준, Expo)
EXPO_PUBLIC_API_BASE_URL=http://<백엔드_IP>:3000
# 예: 로컬에서 직접 띄우는 경우
# EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
# 또는
# EXPO_PUBLIC_API_BASE_URL=http://192.168.0.10:3000

4. 구글 로그인 흐름:

/auth/google
→ 구글 로그인 페이지로 리다이렉트

/auth/google/callback
→ 구글이 code 전달
→ access token 발급
→ 사용자 정보 조회
→ DB 저장/조회
→ JWT 발급
→ 프론트 URL로 token, name 쿼리 붙여 리다이렉트

5. 실행 방법
5.1 백엔드
cd  # 백엔드 폴더로 이동
npm install
npm run dev 

5.2 프론트 (Expo)
cd #프론트 폴더로 이동
npm install
npx expo start # Expo 실행