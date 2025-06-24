import { useLead } from '@hooks/api';
import { RootStackParamList } from '@navigation/index';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

type Props = NativeStackScreenProps<RootStackParamList, 'LeadDetail'>;

export default function LeadDetailScreen({ route }: Props) {
  const { leadId } = route.params;
  const { data: lead, isLoading, isError } = useLead(leadId);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error loading lead</Text>
      </View>
    );
  }

  if (!lead) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Lead not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Lead ID: {lead.id}</Text>
      <Text>Name: {lead.name}</Text>
      <Text>Email: {lead.email}</Text>
    </View>
  );
}
