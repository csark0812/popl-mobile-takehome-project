import React from 'react';
import { FlatList, View } from 'react-native';
import { FAB, List } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { Lead } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'LeadList'>;

// TODO: Replace static leads with useQuery + leadsApi.getAll()
// Consider loading, error, and empty states
const leads: Lead[] = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
];

export default function LeadListScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={leads}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={item.email}
            onPress={() =>
              navigation.navigate('LeadDetail', { leadId: item.id.toString() })
            }
          />
        )}
      />

      <FAB
        icon="plus"
        onPress={() => navigation.navigate('NewLead')}
        style={{ position: 'absolute', right: 24, bottom: 40 }}
      />
    </View>
  );
}
