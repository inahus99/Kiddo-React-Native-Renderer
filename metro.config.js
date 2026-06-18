const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Resolve @/* path aliases defined in tsconfig.json
config.resolver.alias = {
  '@': path.resolve(__dirname, 'src'),
};

module.exports = config;
