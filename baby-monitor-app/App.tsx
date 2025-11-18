// baby-monitor-app/App.tsx
import React from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import AppRoot from "./app_rout"; // 폴더 app_rout/index.tsx 를 가리킴

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AppRoot />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f3ff",
  },
});
