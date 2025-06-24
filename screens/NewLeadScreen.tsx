import { useCreateLead } from '@hooks/api';
import { RootStackParamList } from '@navigation/index';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

// Add navigation prop for going back after creation
// If you want to keep this screen generic, you can use useNavigation instead

type Props = NativeStackScreenProps<RootStackParamList, 'NewLead'>;

export default function NewLeadScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { mutate, isPending, isError, isSuccess, error } = useCreateLead();

  const handleSave = () => {
    mutate(
      { name, email },
      {
        onSuccess: () => {
          navigation.goBack();
        },
      },
    );
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        label="Name"
        mode="outlined"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        label="Email"
        mode="outlined"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {isError && (
        <Text style={{ color: 'red', marginTop: 8 }}>
          {error?.message || 'Error creating lead'}
        </Text>
      )}
      {isPending && <Text style={{ marginTop: 8 }}>Saving...</Text>}

      <Button
        mode="contained"
        onPress={handleSave}
        style={{ marginTop: 16 }}
        disabled={isPending || !name || !email}
      >
        Save
      </Button>
    </View>
  );
}
