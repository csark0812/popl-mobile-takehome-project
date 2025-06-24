import ChangeThemeAction from '@components/ChangeThemeAction';
import ScrollHeader from '@components/ScrollHeader';
import StickyHeader from '@components/StickyHeader';
import { useLeads } from '@hooks/api';
import { useSessionStore } from '@hooks/sessionStore';
import { RootStackParamList } from '@navigation/index';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Appbar, FAB, List } from 'react-native-paper';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

type Props = NativeStackScreenProps<RootStackParamList, 'LeadList'>;

// LeadCard component
function LeadCard({
  id,
  name,
  email,
  navigation,
}: {
  id: string;
  name: string;
  email: string;
  navigation: Props['navigation'];
}) {
  const handlePress = () => {
    navigation.navigate('LeadDetail', { leadId: id });
  };
  return <List.Item title={name} description={email} onPress={handlePress} />;
}

export default function LeadListScreen({ navigation }: Props) {
  const { data: leads, isLoading, isError } = useLeads();
  const signOut = useSessionStore((s) => s.signOut);

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <FAB
          icon="logout"
          onPress={signOut}
          style={{ backgroundColor: 'transparent', elevation: 0 }}
        />
      ),
    });
  }, [navigation, signOut]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <List.Item title="Loading..." />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <List.Item title="Error loading leads" />
      </View>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <List.Item title="No leads found" />
        <FAB
          icon="plus"
          onPress={() => navigation.navigate('NewLead')}
          style={{ position: 'absolute', right: 24, bottom: 40 }}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StickyHeader
        scrollY={scrollY}
        renderRight={() => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ChangeThemeAction />
            <Appbar.Action
              icon="logout"
              onPress={signOut}
              accessibilityLabel="Logout"
              size={20}
              style={{ margin: 0 }}
            />
          </View>
        )}
      />
      <Animated.FlatList
        data={leads}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <LeadCard {...item} id={item.id.toString()} navigation={navigation} />
        )}
        ListHeaderComponent={
          <ScrollHeader
            scrollY={scrollY}
            renderRight={() => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ChangeThemeAction />
                <Appbar.Action
                  icon="logout"
                  onPress={signOut}
                  accessibilityLabel="Logout"
                  size={20}
                  style={{ margin: 0 }}
                />
              </View>
            )}
          />
        }
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />

      <FAB
        icon="plus"
        onPress={() => navigation.navigate('NewLead')}
        style={{ position: 'absolute', right: 24, bottom: 40 }}
      />
    </View>
  );
}
