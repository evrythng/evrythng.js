const node = require('rollup-plugin-node-resolve')

/**
 * ES2015 + ES2015 module export
 */

module.exports = {
  entry: 'src/evrythng.js',
  dest: 'lib/evrythng.es6.js',
  plugins: [
    node({ jsnext: true })
  ]
}
