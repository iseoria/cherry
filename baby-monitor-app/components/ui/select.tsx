// components/ui/select.tsx  - React Native용 간단 Select

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  ViewStyle,
  TextStyle,
} from "react-native";

type SelectContextValue = {
  value?: string;
  setValue: (v: string) => void;
  open: boolean;
  setOpen: (o: boolean) => void;
};

const SelectContext = createContext<SelectContextValue | undefined>(undefined);

function useSelectContext() {
  const ctx = useContext(SelectContext);
  if (!ctx) {
    throw new Error("Select.* components must be used inside <Select>");
  }
  return ctx;
}

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  value,
  defaultValue,
  onValueChange,
  children,
}) => {
  const [internalValue, setInternalValue] = useState<string | undefined>(
    defaultValue,
  );
  const [open, setOpen] = useState(false);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (v: string) => {
    if (!isControlled) setInternalValue(v);
    onValueChange?.(v);
  };

  const ctxValue = useMemo<SelectContextValue>(
    () => ({
      value: currentValue,
      setValue: handleChange,
      open,
      setOpen,
    }),
    [currentValue, open],
  );

  return (
    <SelectContext.Provider value={ctxValue}>
      {children}
    </SelectContext.Provider>
  );
};

// ----- Trigger -----

export interface SelectTriggerProps {
  children: ReactNode;
  style?: ViewStyle;
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({
  children,
  style,
}) => {
  const { setOpen } = useSelectContext();
  return (
    <TouchableOpacity
      style={[styles.trigger, style]}
      onPress={() => setOpen(true)}
    >
      {children}
    </TouchableOpacity>
  );
};

// ----- Value -----

export interface SelectValueProps {
  placeholder?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const SelectValue: React.FC<SelectValueProps> = ({
  placeholder = "선택하세요",
  style,
  textStyle,
}) => {
  const { value } = useSelectContext();
  return (
    <View style={[styles.valueContainer, style]}>
      <Text style={[styles.valueText, textStyle]}>
        {value ?? placeholder}
      </Text>
    </View>
  );
};

// ----- Content (드롭다운 영역) -----

export interface SelectContentProps {
  children: ReactNode;
  style?: ViewStyle;
}

export const SelectContent: React.FC<SelectContentProps> = ({
  children,
  style,
}) => {
  const { open, setOpen } = useSelectContext();

  return (
    <Modal
      transparent
      visible={open}
      animationType="fade"
      onRequestClose={() => setOpen(false)}
    >
      <View style={styles.backdrop}>
        <View style={[styles.content, style]}>
          <ScrollView>{children}</ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// ----- Item -----

export interface SelectItemProps {
  value: string;
  children?: ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const SelectItem: React.FC<SelectItemProps> = ({
  value,
  children,
  style,
  textStyle,
}) => {
  const { setValue, setOpen } = useSelectContext();

  const handlePress = () => {
    setValue(value);
    setOpen(false);
  };

  return (
    <TouchableOpacity style={[styles.item, style]} onPress={handlePress}>
      <Text style={[styles.itemText, textStyle]}>
        {children ?? value}
      </Text>
    </TouchableOpacity>
  );
};

// ----- Label (옵션 그룹 라벨 등) -----

export const SelectLabel: React.FC<{
  children?: ReactNode;
  style?: TextStyle;
}> = ({ children, style }) => (
  <Text style={[styles.label, style]}>{children}</Text>
);

const styles = StyleSheet.create<{
  trigger: ViewStyle;
  valueContainer: ViewStyle;
  valueText: TextStyle;
  backdrop: ViewStyle;
  content: ViewStyle;
  item: ViewStyle;
  itemText: TextStyle;
  label: TextStyle;
}>({
  trigger: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#ffffff",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  valueText: {
    fontSize: 14,
    color: "#111827",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "80%",
    maxHeight: "60%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 8,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  itemText: {
    fontSize: 14,
    color: "#111827",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingVertical: 4,
    color: "#6b7280",
  },
});
