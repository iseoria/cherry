// components/ImageWithFallback.tsx
import React, { useState } from "react";
import {
  Image,
  ImageProps,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";

// 웹에서 쓰던 SVG data URL 그대로 사용 가능 (base64)
const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

interface ImageWithFallbackProps extends ImageProps {
  /** 이미지 주변 래퍼 뷰 스타일 (선택) */
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * React Native용 ImageWithFallback
 * - source 로 받은 이미지 로딩 실패 시 ERROR_IMG_SRC 로 대체
 */
export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  containerStyle,
  style,
  source,
  ...rest
}) => {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Image
        {...rest}
        style={[styles.image, style]}
        source={didError ? { uri: ERROR_IMG_SRC } : source}
        onError={handleError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // 웹의 inline-block + 가운데 정렬 비슷하게
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    // 기본값 (필요하면 사용 시 override)
    resizeMode: "cover",
  },
});
