const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType, url) => {
  describe('Accounts', () => {
    let scope, api

    before(() => {
      scope = getScope(scopeType)
      api = mockApi(url)
    })

    it('should read all shared accounts', async () => {
      api.get('/accounts').reply(200, [{ id: 'accountId' }])
      const res = await scope.sharedAccount().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should read a shared account', async () => {
      api.get('/accounts/accountId').reply(200, { id: 'accountId' })
      const res = await scope.sharedAccount('accountId').read()

      expect(res).to.be.an('object')
      expect(res.id).to.be.a('string')
    })

    it('should update a shared account', async () => {
      const payload = { customFields: { env: 'test' } }
      api.put('/accounts/accountId', payload).reply(200, payload)
      const res = await scope.sharedAccount('accountId').update(payload)

      expect(res).to.be.an('object')
      expect(res.customFields).to.deep.equal(payload.customFields)
    })
  })
}
