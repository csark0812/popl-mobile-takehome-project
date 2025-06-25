/* eslint-disable */
// Jest setup file to mock native modules

const React = require('react');
const { lightTheme } = require('./themes/theme');

// AsyncStorage mock
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Safe‐area helper so screens relying on insets don't crash
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const SafeAreaInsetsContext = React.createContext({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });
  return {
    SafeAreaProvider: ({ children }) => children,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    SafeAreaInsetsContext,
    SafeAreaContext: SafeAreaInsetsContext,
    SafeAreaConsumer: SafeAreaInsetsContext.Consumer,
  };
});

// React Navigation helpers
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
  };
});

// Third-party UI / util mocks
jest.mock('@csark0812/zustand-expo-devtools', () => ({
  devtools: () => (f) => f,
}));
jest.mock('react-native-iphone-x-helper', () => ({}));
jest.mock('react-native-keyboard-aware-scroll-view', () => ({
  KeyboardAwareScrollView: ({ children }) => children,
}));
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}));

// Mock Expo Vector Icons to prevent async state update warnings in tests
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');

  const MockIcon = React.forwardRef((props, ref) => {
    return React.createElement(View, {
      ...props,
      ref,
      testID: props.testID || 'mock-icon',
      accessibilityRole: 'button',
      children: null,
    });
  });

  return {
    MaterialIcons: MockIcon,
    Ionicons: MockIcon,
    FontAwesome: MockIcon,
    AntDesign: MockIcon,
    Entypo: MockIcon,
    EvilIcons: MockIcon,
    Feather: MockIcon,
    Foundation: MockIcon,
    MaterialCommunityIcons: MockIcon,
    Octicons: MockIcon,
    SimpleLineIcons: MockIcon,
    Zocial: MockIcon,
  };
});

// Provide default implementations for hooks/api when a test hasn't mocked them explicitly
jest.mock('@hooks/api', () => ({
  useLeads: () => ({ data: [], isLoading: false, isError: false }),
  useLead: () => ({ data: {}, isLoading: false, isError: false }),
  useCreateLead: () => ({ mutate: jest.fn(), isPending: false }),
  useUpdateLead: () => ({ mutate: jest.fn(), isPending: false }),
  useDeleteLead: () => ({ mutate: jest.fn(), isPending: false }),
  useFormConfig: () => ({ data: null, isLoading: false }),
}));

// Custom render that wraps components with needed providers
jest.mock('@testing-library/react-native', () => {
  const rtl = jest.requireActual('@testing-library/react-native');
  const { NavigationContainer } = require('@react-navigation/native');
  const { SafeAreaProvider } = require('react-native-safe-area-context');
  const { Provider: PaperProvider } = require('react-native-paper');
  const { NavigationPageProvider } = require('./context/NavigationPageContext');

  const AllProviders = ({ children }) =>
    React.createElement(
      NavigationContainer,
      null,
      React.createElement(
        SafeAreaProvider,
        null,
        React.createElement(
          PaperProvider,
          { theme: lightTheme },
          React.createElement(NavigationPageProvider, null, children),
        ),
      ),
    );

  return {
    ...rtl,
    render: (ui, options) =>
      rtl.render(ui, { wrapper: AllProviders, ...options }),
  };
});
