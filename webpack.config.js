const path = require('path');

const browserConfig = {
  entry: './src/evrythng.polyfill.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'evrythng.browser.js',
    library: 'evrythng',
    libraryTarget: 'var',
  },
};

const nodeConfig = {
  entry: './src/evrythng.polyfill.js',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'evrythng.node.js',
    library: 'evrythng',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'typeof self !== \'undefined\' ? self : this',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
    }],
  },
};

module.exports = [
  browserConfig,
  nodeConfig,
];
