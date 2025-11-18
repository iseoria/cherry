// components/ui/input.tsx  ← 파일 하나만 있으면 됨

import React, { forwardRef } from "react";
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

export interface InputProps extends TextInputProps {
  containerStyle?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ style, containerStyle, ...props }, ref) => {
    return (
      <View style={[styles.container, containerStyle]}>
        <TextInput
          ref={ref}
          style={[styles.input, style as TextStyle]}
          placeholderTextColor="#9CA3AF"
          {...props}
        />
      </View>
    );
  },
);

Input.displayName = "Input";

const styles = StyleSheet.create<{
  container: ViewStyle;
  input: TextStyle;
}>({
  container: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#ffffff",
  },
  input: {
    fontSize: 14,
    color: "#111827",
  },
});

export default Input;
