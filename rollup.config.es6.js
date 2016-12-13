const node = require('rollup-plugin-node-resolve')
const pkg = require('./package.json')
const config = require('./evrythng.config')

/**
 * ES2015 + ES2015 module export
 */

module.exports = {
  entry: `src/${pkg.name}.js`,
  dest: `dist/${pkg.name}.es6.js`,
  plugins: [
    node({ jsnext: true })
  ],
  external: config.external
}
