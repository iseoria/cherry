// src/ui/slider.tsx (React Native 버전)

import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';

type SliderValue = number[];

export interface SliderProps {
  value?: SliderValue;              // 컨트롤드
  defaultValue?: SliderValue;       // 언컨트롤드 초기값
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;

  onValueChange?: (value: SliderValue) => void;
  onValueCommit?: (value: SliderValue) => void;

  style?: any;
  trackStyle?: any;
  rangeStyle?: any;
  thumbStyle?: any;
}

/**
 * shadcn/ui Slider를 흉내낸 RN 버전
 * - 현재는 1개 값만 지원 (value[0])
 * - value / defaultValue 둘 다 배열로 받지만 내부에선 첫 번째 값만 사용
 */
export const Slider: React.FC<SliderProps> = ({
  value,
  defaultValue = [0],
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  onValueChange,
  onValueCommit,
  style,
  trackStyle,
  rangeStyle,
  thumbStyle,
}) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<number>(
    clamp(defaultValue[0] ?? 0, min, max),
  );

  const currentValue = useMemo(
    () => clamp((value?.[0] ?? internalValue) as number, min, max),
    [value, internalValue, min, max],
  );

  const [trackWidth, setTrackWidth] = useState(0);
  const draggingRef = useRef(false);

  const ratio = trackWidth > 0 ? (currentValue - min) / (max - min) : 0;
  const thumbPosition = trackWidth * ratio;

  const updateValueFromPosition = useCallback(
    (x: number, commit?: boolean) => {
      if (trackWidth <= 0) return;

      const clampedX = Math.min(Math.max(x, 0), trackWidth);
      const newRatio = clampedX / trackWidth;
      const raw = min + newRatio * (max - min);

      // step에 맞게 스냅
      const stepped = Math.round(raw / step) * step;
      const finalValue = clamp(stepped, min, max);

      if (!isControlled) {
        setInternalValue(finalValue);
      }
      onValueChange?.([finalValue]);

      if (commit) {
        onValueCommit?.([finalValue]);
      }
    },
    [trackWidth, min, max, step, isControlled, onValueChange, onValueCommit],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onMoveShouldSetPanResponder: () => !disabled,
        onPanResponderGrant: (evt: GestureResponderEvent) => {
          draggingRef.current = true;
          const x = evt.nativeEvent.locationX;
          updateValueFromPosition(x);
        },
        onPanResponderMove: (evt: GestureResponderEvent, gesture: PanResponderGestureState) => {
          if (!draggingRef.current) return;
          const x = evt.nativeEvent.locationX;
          updateValueFromPosition(x);
        },
        onPanResponderRelease: (evt: GestureResponderEvent) => {
          draggingRef.current = false;
          const x = evt.nativeEvent.locationX;
          updateValueFromPosition(x, true);
        },
        onPanResponderTerminationRequest: () => true,
        onPanResponderTerminate: (evt: GestureResponderEvent) => {
          draggingRef.current = false;
          const x = evt.nativeEvent.locationX;
          updateValueFromPosition(x, true);
        },
      }),
    [disabled, updateValueFromPosition],
  );

  const handleTrackLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  return (
    <View style={[styles.container, style]} pointerEvents={disabled ? 'none' : 'auto'}>
      <View
        style={[styles.track, trackStyle]}
        onLayout={handleTrackLayout}
        {...panResponder.panHandlers}
      >
        {/* 채워진 구간 */}
        <View
          style={[
            styles.range,
            { width: thumbPosition },
            rangeStyle,
          ]}
        />
        {/* 썸(동그라미) */}
        <View
          style={[
            styles.thumb,
            { left: thumbPosition - THUMB_SIZE / 2 },
            thumbStyle,
          ]}
          pointerEvents="none"
        />
      </View>
    </View>
  );
};

const THUMB_SIZE = 20;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 8,
  },
  track: {
    height: 4,
    borderRadius: 999,
    backgroundColor: '#e5e7eb', // gray-200
    justifyContent: 'center',
  },
  range: {
    position: 'absolute',
    left: 0,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#b19cd9', // primary
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#b19cd9',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
});

function clamp(value: number, min: number, max: number) {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

export default Slider;
