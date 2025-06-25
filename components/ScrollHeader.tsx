import { useSessionStore } from '@hooks/sessionStore';
import { useNavigationPageContext } from 'context/NavigationPageContext';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getGreeting } from '../utils';

interface ScrollHeaderProps {
  scrollY: any;
  renderRight?: () => React.ReactNode;
  children?: React.ReactNode;
}

const ScrollHeader: React.FC<ScrollHeaderProps> = ({
  scrollY,
  renderRight,
  children,
}) => {
  const { navigation, route, options, setHeaderHeight, headerHeight } =
    useNavigationPageContext();
  const name = useSessionStore((s) => s.name);
  const signOut = useSessionStore((s) => s.signOut);

  const greeting = useMemo(() => getGreeting(name), [name]);
  const title = options?.title || route?.name;
  const [back] = useState(
    navigation?.canGoBack ? navigation.canGoBack() : false,
  );
  const { top } = useSafeAreaInsets();

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, headerHeight - top],
      [1, 0],
      'clamp',
    ),
  }));

  const handleLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <Animated.View onLayout={handleLayout} style={animatedStyle}>
        <Appbar.Header
          style={{
            backgroundColor: 'transparent',
            elevation: 0,
            shadowOpacity: 0,
            overflow: 'hidden',
          }}
        >
          {back ? (
            <Appbar.BackAction size={20} onPress={navigation.goBack} />
          ) : null}
          <View style={styles.contentContainer}>
            <Appbar.Content
              title={route?.name === 'LeadList' ? greeting : title}
              titleStyle={styles.greeting}
            />

            {renderRight?.()}
          </View>
        </Appbar.Header>
        {children}
      </Animated.View>
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
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default ScrollHeader;
