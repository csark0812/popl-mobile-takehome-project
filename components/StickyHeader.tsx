import { useSelectedColorScheme } from '@hooks/useSelectedColorScheme';
import { useNavigationPageContext } from 'context/NavigationPageContext';
import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ActionBarIcon from './ActionBarIcon';
import ProgressiveBlurView from './ProgressiveBlurView';

interface StickyHeaderProps {
  scrollY: any;
  renderRight?: () => React.ReactNode;
  children?: React.ReactNode;
  style?: ViewStyle;
  alwaysShow?: boolean;
}

const StickyHeader: React.FC<StickyHeaderProps> = ({
  scrollY,
  renderRight,
  children,
  style,
  alwaysShow = false,
}) => {
  const { navigation, route, options, headerHeight, setStickyHeaderHeight } =
    useNavigationPageContext();
  const scheme = useSelectedColorScheme();
  const theme = useTheme();
  const title = options?.title || route?.name;
  const [back] = useState(
    navigation?.canGoBack ? navigation.canGoBack() : false,
  );

  const { top } = useSafeAreaInsets();

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: alwaysShow
      ? withTiming(1, { duration: 300 })
      : interpolate(
          scrollY.value,
          [headerHeight - top - 20, headerHeight],
          [0, 1],
          'clamp',
        ),
  }));

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
        },
        animatedStyle,
      ]}
    >
      <ProgressiveBlurView
        style={StyleSheet.absoluteFillObject}
        tint={'systemThickMaterial'}
        intensity={50}
        gradientStart={1}
        gradientEnd={0.7}
      />
      <Appbar.Header
        style={{
          marginBottom: 10,
          backgroundColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
        }}
      >
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={[styles.currentContent, style]}
        >
          {back ? (
            <ActionBarIcon
              icon="arrow-left"
              onPress={navigation.goBack}
              type="dark"
              style={styles.backButton}
            />
          ) : null}
          <View style={styles.contentContainer}>
            <Appbar.Content title={title} titleStyle={styles.greeting} />
            {renderRight?.()}
          </View>
        </Animated.View>
        {children}
      </Appbar.Header>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  currentContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
});

export default StickyHeader;
