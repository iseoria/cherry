// src/ui/textarea.tsx (React Native 버전)

import React from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  TextStyle,
} from 'react-native';

export interface TextareaProps extends TextInputProps {
  textStyle?: TextStyle;
}

export const Textarea = React.forwardRef<TextInput, TextareaProps>(
  ({ style, textStyle, multiline = true, numberOfLines = 4, ...rest }, ref) => {
    return (
      <TextInput
        ref={ref}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        style={[styles.base, style, textStyle]}
        placeholderTextColor="#9ca3af"
        {...rest}
      />
    );
  },
);

Textarea.displayName = 'Textarea';

const styles = StyleSheet.create({
  base: {
    minHeight: 96, // 대충 4줄 정도
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb', // gray-200
    backgroundColor: '#ffffff',
    fontSize: 14,
    color: '#111827', // gray-900
  },
});

export default Textarea;
