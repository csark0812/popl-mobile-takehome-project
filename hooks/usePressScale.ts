import React from 'react';
import type { ViewStyle } from 'react-native';
import {
  type AnimatedStyleProp,
  type SharedValue,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export interface UsePressScaleOptions {
  /**
   * Scale value when pressed (0-1)
   * @default animation.scale.pressDown (0.98)
   */
  pressScale?: number;

  /**
   * Animation duration in milliseconds
   * @default "fast" (150ms)
   */
  duration?: number;

  /**
   * Whether to use spring animation instead of timing
   * @default false
   */
  useSpring?: boolean;

  /**
   * Spring configuration (only used if useSpring is true)
   */
  springConfig?: {
    damping?: number;
    stiffness?: number;
    mass?: number;
  };

  /**
   * Callback when press starts
   */
  onPressStart?: () => void;

  /**
   * Callback when press ends
   */
  onPressEnd?: () => void;
}

export interface UsePressScaleResult {
  /**
   * Animated style object to apply to the component
   */
  animatedStyle: AnimatedStyleProp<ViewStyle>;

  /**
   * Function to call when press starts
   */
  handlePressIn: () => void;

  /**
   * Function to call when press ends
   */
  handlePressOut: () => void;

  /**
   * Shared value for the current scale (for advanced usage)
   */
  scale: SharedValue<number>;
}

/**
 * Hook for handling press scale animations with design system integration
 *
 * @example
 * ```tsx
 * function MyButton() {
 *   const { animatedStyle, handlePressIn, handlePressOut } = usePressScale({
 *     pressScale: "pressDown", // or 0.95
 *     duration: "fast",
 *     useSpring: true
 *   });
 *
 *   return (
 *     <AnimatedTouchableOpacity
 *       style={[styles.button, animatedStyle]}
 *       onPressIn={handlePressIn}
 *       onPressOut={handlePressOut}
 *     >
 *       <Text>Press me</Text>
 *     </AnimatedTouchableOpacity>
 *   );
 * }
 * ```
 */
export function usePressScale(
  options: UsePressScaleOptions = {},
): UsePressScaleResult {
  const {
    pressScale = 0.98,
    duration = 150,
    useSpring = false,
    springConfig = {
      damping: 15,
      stiffness: 150,
      mass: 1,
    },
    onPressStart,
    onPressEnd,
  } = options;

  // Convert design system tokens to actual values

  // Shared value for the scale animation
  const scale = useSharedValue(1);

  // Create animated style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  }, []);

  // Press handlers
  const handlePressIn = React.useCallback(() => {
    if (useSpring) {
      scale.value = withSpring(pressScale, springConfig, (finished) => {
        if (finished && onPressStart) {
          runOnJS(onPressStart)();
        }
      });
    } else {
      scale.value = withTiming(
        pressScale,
        { duration: duration },
        (finished) => {
          if (finished && onPressStart) {
            runOnJS(onPressStart)();
          }
        },
      );
    }
  }, [scale, pressScale, duration, useSpring, springConfig, onPressStart]);

  const handlePressOut = React.useCallback(() => {
    if (useSpring) {
      scale.value = withSpring(1, springConfig, (finished) => {
        if (finished && onPressEnd) {
          runOnJS(onPressEnd)();
        }
      });
    } else {
      scale.value = withTiming(1, { duration: duration }, (finished) => {
        if (finished && onPressEnd) {
          runOnJS(onPressEnd)();
        }
      });
    }
  }, [scale, duration, useSpring, springConfig, onPressEnd]);

  return {
    animatedStyle,
    handlePressIn,
    handlePressOut,
    scale,
  };
}
