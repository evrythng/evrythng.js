const TESTS = 'test/integration/es6.spec.js'

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: [TESTS],
    preprocessors: {
      [TESTS]: ['rollup']
    },
    rollupPreprocessor: {
      context: 'window',
      format: 'iife',
      moduleName: 'EVTIntegration'
    },
    reporters: ['dots'],
    browsers: ['Chrome'],
    singleRun: true
  })
}
