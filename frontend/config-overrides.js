const webpack = require('webpack');

module.exports = function override(config, env) {
  // Add polyfills for Node.js globals and modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "buffer": require.resolve("buffer"),
    "process": require.resolve("process/browser"),
    "stream": require.resolve("stream-browserify"),
    "crypto": require.resolve("crypto-browserify"),
    "vm": require.resolve("vm-browserify"),
    "fs": false,
    "path": require.resolve("path-browserify"),
    "os": require.resolve("os-browserify/browser"),
    "util": require.resolve("util"),
  };

  // Add webpack plugins to provide global variables
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
    new webpack.DefinePlugin({
      global: 'globalThis',
    }),
  ];

  return config;
};