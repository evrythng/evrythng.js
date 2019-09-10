const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = () => {
  describe('Short Domains', () => {
    let operator

    before(async () => {
      operator = getScope('operator')
    })

    it('should read all short domains', async () => {
      mockApi().get('/accounts/accountId/shortDomains')
        .reply(200, ['tn.gg'])
      const res = await operator.sharedAccount('accountId').shortDomain().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })
  })
}
