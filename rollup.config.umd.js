const babel = require('rollup-plugin-babel')
const node = require('rollup-plugin-node-resolve')

/**
 * ES5 + UMD module export
 */

module.exports = {
  entry: 'src/evrythng.js',
  format: 'umd',
  dest: 'lib/evrythng.js',
  moduleName: 'EVT',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    node()
  ]
}
