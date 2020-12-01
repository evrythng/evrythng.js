const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType, url) => {
  describe('Domains', () => {
    let scope, api

    before(async () => {
      scope = getScope(scopeType)
      api = mockApi(url)
    })

    it('should read all domains', async () => {
      api.get('/accounts/accountId/domains')
        .reply(200, [{ domain: 'wrxfq.tn.gg' }])
      const res = await scope.sharedAccount('accountId').domain().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })
  })
}
