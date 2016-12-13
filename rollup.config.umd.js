const babel = require('rollup-plugin-babel')
const node = require('rollup-plugin-node-resolve')
const pkg = require('./package.json')
const config = require('./evrythng.config')

/**
 * ES5 + UMD module export
 */

module.exports = {
  entry: `src/${pkg.name}.js`,
  dest: `dist/${pkg.name}.js`,
  format: 'umd',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    node()
  ],
  moduleName: config.moduleName,
  external: config.external,
  globals: config.globals
}
