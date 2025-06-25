import { useSessionStore } from '@hooks/sessionStore';
import { RootStackParamList } from '@navigation/index';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  Button,
  Card,
  Surface,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  interpolate,
  runOnJS,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Add navigation prop for going to LeadList after signup

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

// Animated components
// const AnimatedCard = Animated.createAnimatedComponent(Card);
// const AnimatedSurface = Animated.createAnimatedComponent(Surface);

export default function SignupScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showFormCard, setShowFormCard] = useState(false);

  const isSignedIn = useSessionStore((s) => s.isSignedIn);
  const signIn = useSessionStore((s) => s.signIn);
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();

  // Animation values
  const titleProgress = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    if (isSignedIn) {
      navigation.reset({ index: 0, routes: [{ name: 'LeadList' }] });
    }
  }, [isSignedIn, navigation]);

  // Start title animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      titleProgress.value = withTiming(1, { duration: 800 });
      runOnJS(setShowTitle)(true);
      setShowFormCard(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Animated styles
  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(titleProgress.value, [0, 1], [0, 1]),
    transform: [
      {
        scale: interpolate(titleProgress.value, [0, 1], [0.8, 1]),
      },
      {
        translateY: interpolate(titleProgress.value, [0, 1], [20, 0]),
      },
    ],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleSignup = () => {
    if (!name.trim() || !password.trim()) {
      setError('Name and password are required');
      return;
    }

    setError('');
    setIsLoading(true);

    // Add button press animation
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 }),
    );

    // Simulate loading then sign in
    setTimeout(() => {
      setIsLoading(false);
      signIn(name.trim(), password.trim());
    }, 1000);
  };

  const gradientColors = [
    theme.colors.background,
    theme.colors.surfaceVariant,
    theme.colors.surface,
  ] as const;

  return (
    <LinearGradient
      colors={gradientColors}
      style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        extraScrollHeight={24}
        extraHeight={24}
      >
        {/* Animated Title Section */}
        <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
          <Text
            variant="titleLarge"
            style={[styles.title, { color: theme.colors.primary }]}
          >
            Popl Takehome Project
          </Text>
          <Text
            variant="bodyLarge"
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            Christopher Sarkissian
          </Text>
        </Animated.View>

        {/* Demo Notice */}
        <Animated.View entering={FadeInUp.delay(600).duration(600)}>
          <Surface
            style={[
              styles.demoNotice,
              { backgroundColor: theme.colors.primaryContainer },
            ]}
            elevation={1}
          >
            <Text
              variant="bodyMedium"
              style={[
                styles.demoText,
                { color: theme.colors.onPrimaryContainer },
              ]}
            >
              Use any username and password (like 'demo' / 'password') to
              explore!
            </Text>
          </Surface>
        </Animated.View>

        {/* Form Card */}
        {showFormCard && (
          <Animated.View
            entering={SlideInDown.delay(800).duration(700).springify()}
          >
            <Card
              style={[
                styles.formCard,
                { backgroundColor: theme.colors.surface },
              ]}
              elevation={3}
            >
              <Card.Content style={styles.formContent}>
                <Animated.View entering={FadeInDown.delay(1000).duration(500)}>
                  <TextInput
                    label="Your Name"
                    mode="outlined"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                    autoCapitalize="words"
                    placeholder="e.g., Alex Smith or just 'demo'"
                    left={<TextInput.Icon icon="account" />}
                  />
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(1200).duration(500)}>
                  <TextInput
                    label="Password"
                    mode="outlined"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                    placeholder="Any password will work!"
                    left={<TextInput.Icon icon="lock" />}
                  />
                </Animated.View>

                {error ? (
                  <Animated.View entering={FadeIn.duration(300)}>
                    <Text
                      style={[styles.errorText, { color: theme.colors.error }]}
                    >
                      {error}
                    </Text>
                  </Animated.View>
                ) : null}

                <Animated.View
                  entering={FadeInUp.delay(1400).duration(500)}
                  style={buttonAnimatedStyle}
                >
                  <Button
                    mode="contained"
                    onPress={handleSignup}
                    disabled={!name.trim() || !password.trim() || isLoading}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                    loading={isLoading}
                  >
                    {isLoading ? 'Getting ready...' : "Let's explore together!"}
                  </Button>
                </Animated.View>
              </Card.Content>
            </Card>
          </Animated.View>
        )}

        {/* Helpful Hints */}
        <Animated.View
          entering={FadeIn.delay(1600).duration(600)}
          style={styles.hintsContainer}
        >
          <Text
            variant="bodySmall"
            style={[styles.hintText, { color: theme.colors.onSurfaceVariant }]}
          >
            Credentials are saved in storage via Zustand and will persist
            sessions.
          </Text>
        </Animated.View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.8,
  },
  demoNotice: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  demoText: {
    textAlign: 'center',
    lineHeight: 20,
    flexShrink: 1,
  },
  formCard: {
    borderRadius: 16,
    marginBottom: 24,
  },
  formContent: {
    padding: 8,
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  hintsContainer: {
    alignItems: 'center',
  },
  hintText: {
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.7,
  },
});
