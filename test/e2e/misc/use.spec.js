const { expect } = require('chai')
const { getScope } = require('../util')
const evrythng = require('evrythng')

const TestPlugin = {
  install: (api) => {
    // Extend the Operator scope API
    api.scopes.Operator.prototype.getFoo = () => 'foo'
  }
}

module.exports = () => {
  describe('use', () => {
    let operator

    before(() => {
      operator = getScope('operator')
    })

    it('should install a plugin', () => {
      evrythng.use(TestPlugin)

      expect(evrythng.Operator.prototype.getFoo).to.be.a('function')
      expect(operator.getFoo).to.be.a('function')
      expect(operator.getFoo()).to.equal('foo')
    })
  })
}
