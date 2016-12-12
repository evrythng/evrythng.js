const node = require('rollup-plugin-node-resolve')
const istanbul = require('rollup-plugin-istanbul')

const TESTS = 'test/unit/**/*.spec.js'
const EXTERNAL = ['test/**/*', 'node_modules/**/*']

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: [TESTS],
    preprocessors: {
      [TESTS]: ['rollup']
    },
    rollupPreprocessor: {
      plugins: [
        istanbul({ exclude: EXTERNAL }),
        node({ jsnext: true })
      ],
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