// NEWKOREAMELON/App.tsx  (루트)

import React from "react";
import AppInner from "./baby-monitor-app/App"; 
// 만약 안쪽 파일 이름이 app.tsx(소문자 a)이면:
// import AppInner from "./baby-monitor-app/app";

export default function App() {
  return <AppInner />;
}
