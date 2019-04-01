const { resolve } = require('path')

const path = resolve(__dirname, 'dist')
const entry = './src/evrythng.polyfill.js'
const library = 'evrythng'

const browserConfig = {
  entry,
  output: {
    path,
    library,
    filename: 'evrythng.browser.js',
    libraryTarget: 'var'
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
