(function (root, factory) {
  /* global define */
  if (typeof define === 'function' && define.amd) {
    define(['evrythng'], factory)
  } else if (typeof module === 'object' && module.exports) {
    factory(require('../../dist/evrythng.polyfill'))
  } else {
    factory(root.EVT)
  }
}(this, function factory (EVT) {
  /* eslint-env jasmine */

  describe('EVT Distribution', () => {
    it('should exist', () => {
      expect(EVT).toBeDefined()
    })
  })
}))
