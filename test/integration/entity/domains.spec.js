const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = () => {
  describe('Domains', () => {
    let operator

    before(async () => {
      operator = getScope('operator')
    })

    it('should read all domains', async () => {
      mockApi().get('/accounts/accountId/domains')
        .reply(200, [{ domain: 'wrxfq.tn.gg' }])
      const res = await operator.sharedAccount('accountId').domain().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })
  })
}
