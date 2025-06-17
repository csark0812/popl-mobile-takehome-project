import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LeadListScreen from '../screens/LeadListScreen';
import LeadDetailScreen from '../screens/LeadDetailScreen';
import NewLeadScreen from '../screens/NewLeadScreen';

export type RootStackParamList = {
  LeadList: undefined;
  LeadDetail: { leadId: string };
  NewLead: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LeadList">
        <Stack.Screen
          name="LeadList"
          component={LeadListScreen}
          options={{ title: 'Leads' }}
        />
        <Stack.Screen
          name="LeadDetail"
          component={LeadDetailScreen}
          options={{ title: 'Lead Details' }}
        />

        <Stack.Screen
          name="NewLead"
          component={NewLeadScreen}
          options={{ title: 'New Lead', presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
