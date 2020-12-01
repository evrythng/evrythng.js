const { expect } = require('chai')
const { getScope } = require('../util')

module.exports = (scopeType, url) => {
  describe('Rules', () => {
    let scope

    before(() => {
      scope = getScope(scopeType)
    })

    it('should add a rule resource', async () => {
      expect(scope.rule).to.be.a('function')
    })
  })
}
