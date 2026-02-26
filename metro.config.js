const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Reduce file watcher strain
config.watchFolders = [__dirname];
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx'];

// Limit concurrent workers
config.maxWorkers = 2;

module.exports = config;
