const TESTS = 'test/integration/umd.spec.js'
const LIB = 'lib/evrythng.polyfill.js'
const ENTRY = 'test/require-main.js'

module.exports = function (config) {
  config.set({
    frameworks: ['mocha', 'requirejs', 'dirty-chai'],
    files: [
      ENTRY,
      { pattern: 'test/setup.js', included: false },
      { pattern: 'node_modules/whatwg-fetch/fetch.js', included: false },
      { pattern: 'node_modules/chai/chai.js', included: false },
      { pattern: 'node_modules/dirty-chai/lib/dirty-chai.js', included: false },
      { pattern: LIB, included: false },
      { pattern: TESTS, included: false }
    ],
    reporters: ['dots'],
    browsers: ['Chrome'],
    singleRun: true
  })
}
