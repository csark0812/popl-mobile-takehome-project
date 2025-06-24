import { useSessionStore } from '@hooks/sessionStore';
import { RootStackParamList } from '@navigation/index';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

// Add navigation prop for going to LeadList after signup

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

export default function SignupScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const isSignedIn = useSessionStore((s) => s.isSignedIn);
  const signIn = useSessionStore((s) => s.signIn);

  useEffect(() => {
    if (isSignedIn) {
      navigation.reset({ index: 0, routes: [{ name: 'LeadList' }] });
    }
  }, [isSignedIn, navigation]);

  const handleSignup = () => {
    if (!name.trim() || !password.trim()) {
      setError('Name and password are required');
      return;
    }
    setError('');
    signIn(name.trim(), password.trim());
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
      <Text
        variant="headlineMedium"
        style={{ marginBottom: 24, textAlign: 'center' }}
      >
        Sign Up
      </Text>
      <TextInput
        label="Name"
        mode="outlined"
        value={name}
        onChangeText={setName}
        style={{ marginBottom: 16 }}
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginBottom: 16 }}
      />
      {error ? (
        <Text style={{ color: 'red', marginBottom: 16 }}>{error}</Text>
      ) : null}
      <Button
        mode="contained"
        onPress={handleSignup}
        disabled={!name.trim() || !password.trim()}
      >
        Sign Up
      </Button>
    </View>
  );
}
