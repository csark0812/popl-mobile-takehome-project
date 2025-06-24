import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ColorValue, StyleSheet, ViewProps } from 'react-native';

interface ProgressiveBlurViewProps extends ViewProps {
  intensity?: number;
  colors?: readonly [ColorValue, ColorValue, ...ColorValue[]];
  tint?: React.ComponentProps<typeof BlurView>['tint'];
  gradientDirection?: 'vertical' | 'horizontal';
  gradientStart?: number;
  gradientEnd?: number;
  children?: React.ReactNode;
}

const ProgressiveBlurView: React.FC<ProgressiveBlurViewProps> = ({
  intensity = 60,
  colors = ['transparent', 'white'],
  tint = 'light',
  gradientDirection = 'vertical',
  gradientStart = 1,
  gradientEnd = 0.3,
  children,
  style,
  ...rest
}) => {
  const isVertical = gradientDirection === 'vertical';
  return (
    <MaskedView
      style={[{ flex: 1 }, style]}
      maskElement={
        <LinearGradient
          colors={colors}
          start={
            isVertical ? { x: 0, y: gradientStart } : { x: gradientStart, y: 0 }
          }
          end={isVertical ? { x: 0, y: gradientEnd } : { x: gradientEnd, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
      }
      {...rest}
    >
      <BlurView
        intensity={intensity}
        tint={tint}
        style={StyleSheet.absoluteFillObject}
      ></BlurView>
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ProgressiveBlurView;
