import { useSessionStore } from '@hooks/sessionStore';
import { useSelectedColorScheme } from '@hooks/useSelectedColorScheme';
import { useNavigationPageContext } from 'context/NavigationPageContext';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getGreeting } from '../utils';
import ProgressiveBlurView from './ProgressiveBlurView';

interface StickyHeaderProps {
  scrollY: any;
  renderRight?: () => React.ReactNode;
}

const StickyHeader: React.FC<StickyHeaderProps> = ({
  scrollY,
  renderRight,
}) => {
  const { navigation, route, options, headerHeight } =
    useNavigationPageContext();
  const name = useSessionStore((s) => s.name);
  const scheme = useSelectedColorScheme();
  const greeting = useMemo(() => getGreeting(name), [name]);
  const title = options?.title || route?.name;
  const [back] = useState(
    navigation?.canGoBack ? navigation.canGoBack() : false,
  );

  const { top } = useSafeAreaInsets();

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [headerHeight - top - 20, headerHeight],
      [0, 1],
      'clamp',
    ),
  }));

  return (
    <Animated.View
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
        tint={scheme === 'dark' ? 'dark' : 'light'}
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
          overflow: 'hidden',
        }}
      >
        {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
        <View style={styles.contentContainer}>
          <Appbar.Content title={title} titleStyle={styles.greeting} />
          {renderRight?.()}
        </View>
      </Appbar.Header>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
});

export default StickyHeader;
