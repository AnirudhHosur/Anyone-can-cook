module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // This has to be the last one here
    plugins: ['react-native-reanimated/plugin'],
  };
};
