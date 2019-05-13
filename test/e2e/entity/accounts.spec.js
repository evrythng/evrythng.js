const { expect } = require('chai')
const { getScope } = require('../util')

module.exports = () => {
  describe('Accounts', () => {
    let operator, account

    before(() => {
      operator = getScope('operator')
    })

    it('should read all shared accounts', async () => {
      const res = await operator.sharedAccount().read()
      account = res[0]

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should read a shared account', async () => {
      const res = await operator.sharedAccount(account.id).read()

      expect(res).to.be.an('object')
      expect(res.id).to.equal(account.id)
    })

    it('should update a shared account', async () => {
      const payload = {
        customFields: { env: 'test' }
      }
      const res = await operator.sharedAccount(account.id).update(payload)

      expect(res).to.be.an('object')
      expect(res.customFields).to.deep.equal(payload.customFields)
    })
  })
}
