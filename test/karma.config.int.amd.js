const TESTS = 'test/integration/umd.spec.js'
const LIB = 'dist/evrythng.polyfill.js'
const ENTRY = 'test/require-main.js'

module.exports = function (config) {
  config.set({
    basePath: '../',
    frameworks: ['jasmine', 'requirejs'],
    files: [
      ENTRY,
      { pattern: 'node_modules/whatwg-fetch/fetch.js', included: false },
      { pattern: LIB, included: false },
      { pattern: TESTS, included: false }
    ],
    reporters: ['dots'],
    browsers: ['Chrome'],
    singleRun: true
  })
}
