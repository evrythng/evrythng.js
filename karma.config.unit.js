const node = require('rollup-plugin-node-resolve')
const cjs = require('rollup-plugin-commonjs')
const istanbul = require('rollup-plugin-istanbul')

const TESTS = 'test/unit/**/*.spec.js'
const EXTERNAL = ['test/**/*', 'node_modules/**/*']

module.exports = function (config) {
  config.set({
    frameworks: ['mocha', 'dirty-chai'],
    files: [TESTS],
    preprocessors: {
      [TESTS]: ['rollup']
    },
    rollupPreprocessor: {
      plugins: [
        istanbul({ exclude: EXTERNAL }),
        node({
          jsnext: true,
          preferBuiltins: false // use provided 'buffer' in browser
        }),
        cjs()
      ],
      useStrict: false, // Chai doesn't use strict mode
      format: 'iife',
      sourceMap: 'inline'
    },
    reporters: ['dots', 'junit', 'coverage'],
    junitReporter: {
      outputDir: 'report',
      outputFile: 'test-result.xml',
      useBrowserName: false
    },
    coverageReporter: {
      dir: 'report',
      reporters: [
        { type: 'html', subdir: 'html-coverage' },
        { type: 'cobertura', subdir: '.' }
      ]
    },
    browsers: ['Chrome'],
    singleRun: true
  })
}
