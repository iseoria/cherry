// components/ui/separator.tsx – React Native용 Separator

import React from "react";
import { View, StyleSheet, ViewProps, ViewStyle } from "react-native";

export interface SeparatorProps extends ViewProps {
  /** 가로 / 세로 방향 */
  orientation?: "horizontal" | "vertical";
  /** 선 두께 (기본 1px) */
  thickness?: number;
}

export const Separator: React.FC<SeparatorProps> = ({
  orientation = "horizontal",
  thickness,
  style,
  ...rest
}) => {
  const baseStyle: ViewStyle =
    orientation === "horizontal"
      ? {
          ...styles.horizontal,
          ...(thickness != null ? { height: thickness } : null),
        }
      : {
          ...styles.vertical,
          ...(thickness != null ? { width: thickness } : null),
        };

  return <View style={[baseStyle, style]} {...rest} />;
};

const styles = StyleSheet.create<{
  horizontal: ViewStyle;
  vertical: ViewStyle;
}>({
  horizontal: {
    width: "100%",
    height: 1,
    backgroundColor: "#E5E7EB", // gray-200 정도
  },
  vertical: {
    width: 1,
    height: "100%",
    backgroundColor: "#E5E7EB",
  },
});

export default Separator;
