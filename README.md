1. 지금까지 한 작업 / 현재 상태

- Expo 기반 React Native 프로젝트 생성 및 TypeScript 세팅
- 안드로이드용 dev build 환경 구축 (Expo dev client)
- `react-native-vision-camera`, `react-native-webrtc`, `socket.io-client` 설치 및 안드로이드 빌드 정상 동작 확인
- ONNX 포즈 모델(`yolov8n-pose.onnx`)을 로드하는 AI 모듈 기본 구조 구현
- 카메라 화면(`CameraMode`)에서:
  - 기기 카메라 프리뷰 표시
  - 추후 AI 추론 / WebRTC 송출과 연동할 수 있도록 기본 코드 구조만 구성

지금 상태 = 안드로이드 dev build에서 앱이 실행되고, 카메라 + AI 파이프라인 뼈대까지 준비된 단계

---

2. 주요 파일 / 폴더

프로젝트 루트: `FE/`

```text
FE/
├─ baby-monitor-app/          # 실제 RN / Expo 앱
│  ├─ App.tsx                 # 앱 엔트리, SafeArea + AppRoot 렌더링
│  ├─ app_rout/index.tsx      # 메인 화면 라우트 (로그인, 카메라 등 전환)
│  ├─ components/
│  │  ├─ CameraMode.tsx       # 카메라 화면 (vision-camera, WebRTC 연동)
│  │  └─ ...                  # 로그인/역할 선택/캘린더 등 UI 컴포넌트
│  ├─ lib/ai/
│  │  ├─ yoloSession.ts       # ONNX 세션 생성, 포즈 모델 로드/추론
│  │  └─ motionDetection.ts   # 포즈 결과 기반 움직임 분석 로직
│  ├─ components/assets/models/
│  │  └─ yolov8n-pose.onnx    # YOLOv8 Pose ONNX 모델
│  ├─ android/                # 안드로이드 네이티브 프로젝트 (dev build용)
│  ├─ app.json                # Expo 설정 (name, slug, android 패키지 등)
│  └─ package.json            # 앱 의존성 및 스크립트
├─ package.json               # FE 루트 의존성
├─ tsconfig.json              # TypeScript 설정
└─ README.md

3. 개발 환경 요구사항

Node.js (LTS 권장, 예: 18.x)

npm 또는 Yarn

Android Studio

Android SDK 설치

안드로이드 에뮬레이터

JDK 17 (Android Gradle Plugin 요구 버전)

4. 설치 & 실행 방법
의존성 설치 : npm install

안드로이드 dev build 최초 설치 :
npx expo install expo-dev-client

# 안드로이드 dev build 빌드 & 설치 (에뮬레이터 켜둔 상태)

개발 서버 실행 (dev client 모드) :
cd FE/baby-monitor-app
npx expo start --dev-client
npx expo run:android

5. Android SDK / JDK 설정 방법 : SDK 경로 설정 (android/local.properties)

FE/baby-monitor-app/android/local.properties 파일을 만들고, 본인 환경에 맞게 설정하기

예시 (이건 제 경로, 버전입니다):
sdk.dir=/Users/iseol/Library/Android/sdk
org.gradle.java.home=/Applications/Android Studio.app/Contents/jbr/Contents/Home


sdk.dir : Android Studio에서 확인한 SDK 위치

org.gradle.java.home : JDK 17 경로 (보통 Android Studio 내 JBR 사용)

6. 주의사항 

Expo Go로는 실행 불가
react-native-vision-camera, react-native-webrtc 등 네이티브 모듈 때문에
반드시 expo run:android + expo start --dev-client 조합을 사용해야 합니다.

다음 파일/폴더는 Git에 올리지 않기

baby-monitor-app/node_modules/

baby-monitor-app/android/local.properties

*.keystore

.expo/, android/.gradle/ 등 빌드/캐시 폴더


7. Android 빌드 에러 발생 시 우선 확인:

JDK 17 사용 여부 (org.gradle.java.home)

Android SDK 경로(sdk.dir)가 올바른지

minSdkVersion이 24 이상인지
