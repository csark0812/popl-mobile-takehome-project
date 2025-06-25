import React, {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import Popover, { PopoverRef } from './Popover';

export interface LoadingOverlayRef {
  show: (message?: string) => void;
  hide: () => void;
  updateMessage: (message: string) => void;
}

interface LoadingOverlayProps {
  defaultMessage?: string;
  containerStyle?: ViewStyle;
  customSpinner?: ReactNode;
  onShow?: () => void;
  onHide?: () => void;
}

const LoadingOverlay = forwardRef<LoadingOverlayRef, LoadingOverlayProps>(
  (
    {
      defaultMessage = 'Loading...',
      containerStyle,
      customSpinner,
      onShow,
      onHide,
    },
    ref,
  ) => {
    const theme = useTheme();
    const popoverRef = useRef<PopoverRef>(null);
    const [message, setMessage] = useState(defaultMessage);

    const showOverlay = (loadingMessage?: string) => {
      if (loadingMessage) {
        setMessage(loadingMessage);
      }
      popoverRef.current?.show();
      onShow?.();
    };

    const hideOverlay = () => {
      popoverRef.current?.hide();
      onHide?.();
    };

    useImperativeHandle(ref, () => ({
      show: showOverlay,
      hide: hideOverlay,
      updateMessage: (newMessage: string) => {
        setMessage(newMessage);
      },
    }));

    return (
      <Popover
        ref={popoverRef}
        containerStyle={containerStyle}
        surfaceStyle={styles.surface}
        maxWidth={180}
        elevation={5}
        onDismiss={onHide}
      >
        <Animated.View style={styles.loadingContent}>
          {customSpinner || (
            <ActivityIndicator
              size="large"
              animating={true}
              color={theme.colors.primary}
              style={styles.spinner}
            />
          )}

          <Text
            variant="bodyLarge"
            style={[styles.message, { color: theme.colors.onSurface }]}
          >
            {message}
          </Text>
        </Animated.View>
      </Popover>
    );
  },
);

const styles = StyleSheet.create({
  surface: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginBottom: 16,
  },
  message: {
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});

LoadingOverlay.displayName = 'LoadingOverlay';

export default LoadingOverlay;
