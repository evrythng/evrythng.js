const { expect } = require('chai')
const { getScope } = require('../util')

module.exports = () => {
  describe('Accesses', () => {
    let operator, account, access

    before(async () => {
      operator = getScope('operator')

      const accounts = await operator.sharedAccount().read()
      account = accounts[0]
    })

    it('should read all account accesses', async () => {
      const res = await operator.sharedAccount(account.id).access().read()
      access = res[0]

      expect(res).to.have.length.gte(1)
      expect(access.account).to.equal(account.id)
      expect(access.apiKey).to.have.length(80)
    })

    it('should read a single account access', async () => {
      const res = await operator.sharedAccount(account.id).access(access.id).read()

      expect(res).to.be.an('object')
      expect(res.id).to.equal(access.id)
      expect(res.account).to.equal(account.id)
      expect(res.apiKey).to.have.length(80)
    })

    it('should update a single account access', async () => {
      const payload = { role: access.role }
      const res = await operator.sharedAccount(account.id).access(access.id).update(payload)

      expect(res).to.be.an('object')
      expect(res.id).to.equal(access.id)
      expect(res.role).to.equal(payload.role)
    })
  })
}
