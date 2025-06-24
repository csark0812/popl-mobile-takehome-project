import { useSessionStore } from '@hooks/sessionStore';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LeadDetailScreen from '@screens/LeadDetailScreen';
import LeadListScreen from '@screens/LeadListScreen';
import NewLeadScreen from '@screens/NewLeadScreen';
import SignupScreen from '@screens/SignupScreen';
import { NavigationPageProvider } from 'context/NavigationPageContext';
import React from 'react';
import { useTheme } from 'react-native-paper';

export type RootStackParamList = {
  Signup: undefined;
  LeadList: undefined;
  LeadDetail: { leadId: string };
  NewLead: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const isSignedIn = useSessionStore((s) => s.isSignedIn);
  const theme = useTheme();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenLayout={(props) => <NavigationPageProvider {...props} />}
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
        initialRouteName={isSignedIn ? 'LeadList' : 'Signup'}
      >
        {!isSignedIn && (
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ title: 'Sign Up', headerShown: false }}
          />
        )}
        {isSignedIn && (
          <>
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
              options={{ title: 'New Lead', presentation: 'formSheet' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
