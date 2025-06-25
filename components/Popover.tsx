import { BlurView } from 'expo-blur';
import React, {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useState,
} from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Modal, Portal, Surface, useTheme } from 'react-native-paper';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export interface PopoverRef {
  show: () => void;
  hide: () => void;
}

interface PopoverProps {
  children: ReactNode;
  onDismiss?: () => void;
  containerStyle?: ViewStyle;
  surfaceStyle?: ViewStyle;
  maxWidth?: number;
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Popover = forwardRef<PopoverRef, PopoverProps>(
  (
    {
      children,
      onDismiss,
      containerStyle,
      surfaceStyle,
      maxWidth = 400,
      elevation = 5,
    },
    ref,
  ) => {
    const theme = useTheme();
    const [visible, setVisible] = useState(false);
    const scale = useSharedValue(0);

    const hideModal = () => {
      scale.value = withTiming(0.85, {
        duration: 200,
        easing: Easing.out(Easing.cubic),
      });
      setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, 250);
    };

    useImperativeHandle(ref, () => ({
      show: () => {
        setVisible(true);
        scale.value = withTiming(1, {
          duration: 400,
          easing: Easing.out(Easing.back(1.5)),
        });
      },
      hide: hideModal,
    }));

    const animatedModalStyle = useAnimatedStyle(() => ({
      transform: [
        { scale: interpolate(scale.value, [0.85, 1], [0.85, 1]) },
        {
          translateY: interpolate(scale.value, [0.85, 1], [30, 0]),
        },
      ],
      opacity: interpolate(scale.value, [0.85, 1], [0, 1]),
    }));

    // Animate the opacity of the Surface itself
    const animatedSurfaceStyle = useAnimatedStyle(() => ({
      opacity: interpolate(scale.value, [0.85, 1], [0, 1]),
    }));

    return (
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          style={{ marginTop: 0, marginBottom: 0 }}
          contentContainerStyle={[styles.modalContainer]}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
          >
            <AnimatedPressable
              style={StyleSheet.absoluteFillObject}
              onPress={hideModal}
            >
              <BlurView
                intensity={20}
                tint={'dark'}
                style={StyleSheet.absoluteFillObject}
              />
            </AnimatedPressable>
            <Pressable
              style={[styles.popoverContainer, { maxWidth }, containerStyle]}
              onPress={(e) => e.stopPropagation()}
            >
              <Animated.View style={animatedModalStyle}>
                <Animated.View style={animatedSurfaceStyle}>
                  <Surface
                    style={[
                      styles.surface,
                      // Use RGBA for backgroundColor to support opacity
                      { backgroundColor: theme.colors.surface + 'E6' }, // E6 = ~90% opacity
                      surfaceStyle,
                    ]}
                    elevation={elevation}
                  >
                    {children}
                  </Surface>
                </Animated.View>
              </Animated.View>
            </Pressable>
          </KeyboardAvoidingView>
        </Modal>
      </Portal>
    );
  },
);

const styles = StyleSheet.create({
  modalContainer: {
    height: '100%',

    overflow: 'visible',
  },
  keyboardAvoidingView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  popoverContainer: {
    width: width - 40,
  },
  surface: {
    borderRadius: 24,
    padding: 0,
  },
});

Popover.displayName = 'Popover';

export default Popover;
