const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType, url) => {
  describe('Short Domains', () => {
    let scope, api

    before(async () => {
      scope = getScope(scopeType)
      api = mockApi(url)
    })

    it('should read all short domains', async () => {
      api.get('/accounts/accountId/shortDomains').reply(200, ['tn.gg'])
      const res = await scope.sharedAccount('accountId').shortDomain().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })
  })
}
