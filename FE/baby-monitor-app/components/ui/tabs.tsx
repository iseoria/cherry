// components/ui/tabs.tsx – React Native용 Tabs

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ViewProps,
} from "react-native";

type TabsContextValue = {
  value: string;
  setValue: (v: string) => void;
};

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error("Tabs.* components must be used inside <Tabs>");
  }
  return ctx;
}

export interface TabsProps extends ViewProps {
  value?: string;
  defaultValue: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
  value,
  defaultValue,
  onValueChange,
  children,
  style,
  ...rest
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? (value as string) : internalValue;

  const handleChange = (v: string) => {
    if (!isControlled) setInternalValue(v);
    onValueChange?.(v);
  };

  const ctxValue = useMemo<TabsContextValue>(
    () => ({
      value: currentValue,
      setValue: handleChange,
    }),
    [currentValue],
  );

  return (
    <TabsContext.Provider value={ctxValue}>
      <View style={[styles.tabsRoot, style]} {...rest}>
        {children}
      </View>
    </TabsContext.Provider>
  );
};

// ===== TabsList =====

export interface TabsListProps extends ViewProps {
  children: ReactNode;
}

export const TabsList: React.FC<TabsListProps> = ({
  children,
  style,
  ...rest
}) => {
  return (
    <View style={[styles.tabsList, style]} {...rest}>
      {children}
    </View>
  );
};

// ===== TabsTrigger =====

export interface TabsTriggerProps {
  value: string;
  children?: ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  style,
  textStyle,
}) => {
  const { value: activeValue, setValue } = useTabsContext();
  const isActive = activeValue === value;

  return (
    <TouchableOpacity
      onPress={() => setValue(value)}
      style={[
        styles.triggerBase,
        isActive ? styles.triggerActive : styles.triggerInactive,
        style,
      ]}
    >
      <Text
        style={[
          styles.triggerText,
          isActive ? styles.triggerTextActive : styles.triggerTextInactive,
          textStyle,
        ]}
      >
        {children ?? value}
      </Text>
    </TouchableOpacity>
  );
};

// ===== TabsContent =====

export interface TabsContentProps extends ViewProps {
  value: string;
  children?: ReactNode;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  style,
  ...rest
}) => {
  const { value: activeValue } = useTabsContext();
  if (activeValue !== value) return null;

  return (
    <View style={[styles.content, style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create<{
  tabsRoot: ViewStyle;
  tabsList: ViewStyle;
  triggerBase: ViewStyle;
  triggerActive: ViewStyle;
  triggerInactive: ViewStyle;
  triggerText: TextStyle;
  triggerTextActive: TextStyle;
  triggerTextInactive: TextStyle;
  content: ViewStyle;
}>({
  tabsRoot: {
    width: "100%",
  },
  tabsList: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 9999,
    backgroundColor: "#F3F4F6", // gray-100 느낌
    padding: 4,
  },
  triggerBase: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  triggerActive: {
    backgroundColor: "#FFFFFF",
  },
  triggerInactive: {
    backgroundColor: "transparent",
  },
  triggerText: {
    fontSize: 14,
    fontWeight: "500",
  },
  triggerTextActive: {
    color: "#111827", // gray-900
  },
  triggerTextInactive: {
    color: "#6B7280", // gray-500
  },
  content: {
    marginTop: 12,
  },
});
