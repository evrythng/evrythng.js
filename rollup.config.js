const node = require('rollup-plugin-node-resolve')
const cjs = require('rollup-plugin-commonjs')

/**
 * ES2015 + ES2015 module export
 */

module.exports = {
  entry: 'test/setup.js',
  dest: 'test/setup.rollup.js',
  format: 'umd',
  moduleName: 'setup',
  external: ['chai', 'dirty-chai'],
  plugins: [
    node({ jsnext: true }),
    cjs({
      exclude: 'node_modules/**/*'
    })
  ]
}
