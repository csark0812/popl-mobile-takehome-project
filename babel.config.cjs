module.exports = {
  presets: [['babel-preset-expo', { jsxRuntime: 'classic' }]],
  overrides: [
    {
      test: /\\.tsx?$/,
      presets: [
        [
          '@babel/preset-typescript',
          {
            isTSX: true,
            allExtensions: true,
          },
        ],
      ],
    },
  ],
  plugins: ['react-native-reanimated/plugin'],
};
