const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType, url) => {
  describe('Rules', () => {
    let scope, api

    before(() => {
      scope = getScope(scopeType)
      api =  mockApi(url)
    })

    it('should add a rule resource', async () => {
      expect(scope.rule).to.be.a('function')
    })
  })
}
