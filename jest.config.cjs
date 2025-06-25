module.exports = {
  preset: 'jest-expo',
  // Using the default transformer from the preset
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^context/(.*)$': '<rootDir>/context/$1',
  },
  setupFiles: ['<rootDir>/jest.setup.cjs'],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-native-community|@react-navigation|@expo|expo(nent)?|expo-modules-core|expo-[a-zA-Z-]+|@unimodules|unimodules|sentry-expo|native-base|react-native-svg|react-native-reanimated|react-native-gesture-handler|react-native-safe-area-context|react-native-screens|@react-native-masked-view|@react-native-picker|@react-native-async-storage|@react-native-firebase|@invertase|react-native-keyboard-aware-scroll-view|react-native-toast-message|@csark0812/zustand-expo-devtools|@shopify|@gorhom|@rneui|@react-native-segmented-control|@react-native-segmented-control/segmented-control|react-native-paper|react-native-vector-icons|react-native/Libraries|react-native-iphone-x-helper|@react-native/js-polyfills)/)',
  ],
};
