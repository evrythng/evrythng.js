const rollup = require('rollup')
const uglify = require('rollup-plugin-uglify')
const { minify } = require('uglify-js')
const pkg = require('./package.json')

/**
 * Mandatory banner for all files published to CDN
 * (i.e. not distributed via a package manager).
 */
const currentYear = (new Date()).getFullYear()
const banner = `/**
 * EVRYTHNG JS SDK v${pkg.version}
 * (c) 2012-${currentYear} EVRYTHNG Ltd. London / New York / San Francisco.
 * Released under the Apache Software License, Version 2.0.
 * For all details and usage:
 * https://github.com/evrythng/evrythng.js
 */
`

/**
 * For each base config we'll also add a bundle with the Fetch
 * polyfill dependency and a minified version for all targets:
 *
 * - ES6 + ES Modules
 * - ES6 + ES Modules (minified)
 * - ES6 + ES Modules + Fetch Polyfill
 * - ES6 + ES Modules + Fetch Polyfill (minified)
 * - ES5 + UMD
 * - ES5 + UMD (minified)
 * - ES5 + UMD + Fetch Polyfill
 * - ES5 + UMD + Fetch Polyfill (minified)
 */
const configs = getTargetConfigs([
  require('./rollup.config.es6'),
  require('./rollup.config.umd')
])

build(configs)

/**
 * Add polyfill and minified versions to base targets.
 * @param targets {Object[]} Base target configurations
 */
function getTargetConfigs (targets) {
  const polyfills = targets.map(getPolyfillConfig)
  const uglifys = targets.concat(polyfills).map(getUglifyConfig)
  return targets.concat(polyfills, uglifys)
}

/**
 * Add polyfill version to given target. UMD needs the
 * global name of the Fetch api.
 * @param target {Object} Previous target
 * @returns {Object}
 */
function getPolyfillConfig (target) {
  let polyfill = Object.assign({}, target, {
    entry: addExtension(target.entry, 'polyfill'),
    dest: addExtension(target.dest, 'polyfill'),
    external: 'isomorphic-fetch'
  })

  if (target.format === 'umd') {
    polyfill.globals = {
      'isomorphic-fetch': 'fetch'
    }
  }

  return polyfill
}

/**
 * Add uglified version to previous targets. We're using Uglify Harmony
 * as the stable does not yet understand ES Modules. See:
 * https://github.com/TrySound/rollup-plugin-uglify#warning
 * @param target {Object} Previous target
 * @returns {Object[]}
 */
function getUglifyConfig (target) {
  return Object.assign({}, target, {
    dest: addExtension(target.dest, 'min'),
    plugins: target.plugins.concat(uglify({}, minify))
  })
}

/**
 * Add sub-extension to filename.
 * @param filename {string} Filename
 * @param ext {string} Extension to add before original extension
 * @returns {string}
 */
function addExtension (filename, ext) {
  return filename.replace('.js', `.${ext}.js`)
}

/**
 * Build all bundles with Rollup for each specified configuration.
 */
function build (configs) {
  configs.forEach(config => {
    rollup.rollup(config).then(bundle => {
      bundle.write({
        banner,
        sourceMap: true,
        format: config.format,
        dest: config.dest,
        moduleName: config.moduleName,
        globals: config.globals
      })
    })
  })
}
