// app/_layout.tsx
import React from "react";
import { View } from "react-native";
import { Slot } from "expo-router";
import { globalStyles } from "../styles/theme";

export default function RootLayout() {
  return (
    <View style={globalStyles.screen}>
      <View style={globalStyles.appFrame}>
        <Slot />
      </View>
    </View>
  );
}
