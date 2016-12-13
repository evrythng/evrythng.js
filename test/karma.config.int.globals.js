const pkg = require('../package.json')

const TESTS = 'test/integration/umd.spec.js'
const LIB = pkg.main

module.exports = function (config) {
  config.set({
    basePath: '../',
    frameworks: ['jasmine'],
    files: [LIB, TESTS],
    reporters: ['dots'],
    browsers: ['Chrome'],
    singleRun: true
  })
}
