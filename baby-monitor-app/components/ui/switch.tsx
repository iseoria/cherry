// src/components/ui/switch.tsx

import React from "react";
import {
  Switch as RNSwitch,
  SwitchProps as RNSwitchProps,
} from "react-native";

export interface SwitchProps
  extends Omit<RNSwitchProps, "value" | "onValueChange"> {
  // shadcn 스타일 이름 맞춰줌
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<RNSwitch, SwitchProps>(
  ({ checked, defaultChecked, onCheckedChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(
      defaultChecked ?? false
    );

    // controlled / uncontrolled 둘 다 지원
    const value = checked ?? internalValue;

    const handleValueChange = (next: boolean) => {
      // 외부에서 checked 안 넘기면 내부 state로 관리
      if (checked === undefined) {
        setInternalValue(next);
      }
      onCheckedChange?.(next);
    };

    return (
      <RNSwitch
        ref={ref}
        value={value}
        onValueChange={handleValueChange}
        {...props}
      />
    );
  }
);

Switch.displayName = "Switch";

export default Switch;
