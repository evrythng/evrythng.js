const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = () => {
  describe('Accounts', () => {
    let operator

    before(() => {
      operator = getScope('operator')
    })

    it('should read all shared accounts', async () => {
      mockApi()
        .get('/accounts')
        .reply(200, [{ id: 'accountId' }])
      const res = await operator.sharedAccount().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should read a shared account', async () => {
      mockApi().get('/accounts/accountId').reply(200, { id: 'accountId' })
      const res = await operator.sharedAccount('accountId').read()

      expect(res).to.be.an('object')
      expect(res.id).to.be.a('string')
    })

    it('should update a shared account', async () => {
      const payload = { customFields: { env: 'test' } }
      mockApi().put('/accounts/accountId', payload).reply(200, payload)
      const res = await operator.sharedAccount('accountId').update(payload)

      expect(res).to.be.an('object')
      expect(res.customFields).to.deep.equal(payload.customFields)
    })
  })
}
