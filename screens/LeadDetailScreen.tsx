import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'LeadDetail'>;

export default function LeadDetailScreen({ route }: Props) {
  const { leadId } = route.params;

  // TODO: Fetch this lead from the API using react-query and leadsApi.getById(leadId)
  // Consider type safety, loading, and error states

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Lead ID: {leadId}</Text>
    </View>
  );
}
