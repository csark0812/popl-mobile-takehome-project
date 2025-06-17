import React from 'react';
import { View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

export default function NewLeadScreen() {
  // You'll likely want to POST to the API to create a new lead
  // Consider using leadsApi.create(...) and handling success/failure states

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput label="Name" mode="outlined" />
      <TextInput label="Email" mode="outlined" keyboardType="email-address" />

      <Button mode="contained" onPress={() => {}} style={{ marginTop: 16 }}>
        Save
      </Button>
    </View>
  );
}
