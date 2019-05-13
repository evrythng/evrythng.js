const { expect } = require('chai')
const { getScope } = require('../util')

module.exports = () => {
  describe('Short Domains', () => {
    let operator, account

    before(async () => {
      operator = getScope('operator')

      const res = await operator.sharedAccount().read()
      account = res[0]
    })

    it('should read all short domains', async () => {
      const res = await operator.sharedAccount(account.id).shortDomain().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
      expect(res[0]).to.be.a('string')
    })
  })
}
