import { useNavigationPageContext } from 'context/NavigationPageContext';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import ActionBarIcon from './ActionBarIcon';
import ProgressiveBlurView from './ProgressiveBlurView';

interface ModalHeaderProps {
  scrollY: any;
  onClose?: () => void;
  children?: React.ReactNode;
  style?: ViewStyle;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
  scrollY,
  onClose,
  children,
  style,
}) => {
  const { navigation, route, options, setStickyHeaderHeight } =
    useNavigationPageContext();
  const theme = useTheme();
  const title = options?.title || route?.name;

  // Create animated style for progressive blur opacity
  const blurAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, Math.max(0, 20)],
      [0, 1],
      'clamp',
    );
    return {
      opacity,
    };
  });

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigation?.goBack();
    }
  };

  const renderRight = () => (
    <ActionBarIcon
      icon="close"
      onPress={handleClose}
      type="light"
      style={styles.closeButton}
    />
  );

  return (
    <Animated.View
      onLayout={(e) => {
        setStickyHeaderHeight(e.nativeEvent.layout.height);
      }}
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          paddingBottom: 10,
          pointerEvents: 'box-none',
        },
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { pointerEvents: 'box-none' },
          blurAnimatedStyle,
        ]}
      >
        <ProgressiveBlurView
          style={[StyleSheet.absoluteFillObject, { pointerEvents: 'box-none' }]}
          tint={
            theme.dark ? 'systemThickMaterialDark' : 'systemThickMaterialLight'
          }
          intensity={50}
          gradientStart={1}
          gradientEnd={0.6}
        />
      </Animated.View>

      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={[styles.currentContent, style]}
      >
        <View style={styles.contentContainer}>
          <Appbar.Content title={title} titleStyle={styles.greeting} />
          {renderRight()}
        </View>
      </Animated.View>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  currentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    paddingLeft: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  backButton: {
    marginLeft: 16,
  },
  closeButton: {
    marginRight: 0,
  },
});

export default ModalHeader;
