const { getDefaultConfig } = require('expo/metro-config');

// Expo SDK 50+ reads tsconfig.json path aliases automatically.
// No custom resolver.alias needed — the default config handles @/* → src/*.
const config = getDefaultConfig(__dirname);

module.exports = config;
