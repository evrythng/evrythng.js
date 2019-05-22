const { expect } = require('chai')
const { getScope } = require('../util')

module.exports = () => {
  describe('Domains', () => {
    let operator, account

    before(async () => {
      operator = getScope('operator')

      const res = await operator.sharedAccount().read()
      account = res[0]
    })

    it('should read all domains', async () => {
      const res = await operator.sharedAccount(account.id).domain().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })
  })
}
