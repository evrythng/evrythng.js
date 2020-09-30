const { resolve } = require('path')

const path = resolve(__dirname, 'dist')
const entry = './src/evrythng.polyfill.js'
const library = 'evrythng'

const babelrc = {
  presets: ['@babel/preset-env'],
  plugins: [
    ['@babel/transform-runtime', { regenerator: true }]
  ]
}

const browserConfig = {
  entry,
  output: {
    path,
    library,
    filename: 'evrythng.browser.js',
    libraryTarget: 'var'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: babelrc
      }
    }]
  }
}

const nodeConfig = {
  entry,
  target: 'node',
  output: {
    path,
    library,
    filename: 'evrythng.node.js',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'typeof self !== \'undefined\' ? self : this'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/
    }]
  }
}

module.exports = [
  browserConfig,
  nodeConfig
]
