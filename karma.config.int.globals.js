const TESTS = 'test/integration/umd.spec.js'
const LIB = 'lib/evrythng.polyfill.js'

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: [LIB, TESTS],
    reporters: ['dots'],
    browsers: ['Chrome'],
    singleRun: true
  })
}
