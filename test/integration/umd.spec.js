(function (root, factory) {
  /* global define */
  if (typeof define === 'function' && define.amd) {
    define(['setup', 'evrythng'], (setup, EVT) => {
      factory(setup.expect, EVT)
    })
  } else if (typeof module === 'object' && module.exports) {
    factory(require('../setup').expect, require('../../lib/evrythng.polyfill'))
  } else {
    factory(root.chai.expect, root.EVT)
  }
}(this, function factory (expect, EVT) {
  /* eslint-env mocha */

  describe('EVT Distribution', () => {
    it('should exist', () => {
      expect(EVT).to.exist()
    })
  })
}))

