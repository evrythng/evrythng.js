const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType, url) => {
  describe('Accesses', () => {
    let scope, api
    before(() => {
      scope = getScope(scopeType)
      api =  mockApi(url)
    })

    it('should read all account accesses', async () => {
      api.get('/accounts/accountId/accesses')
        .reply(200, [{ id: 'accessId' }])
      const res = await scope.sharedAccount('accountId').access().read()

      expect(res).to.have.length.gte(1)
    })

    it('should read a single account access', async () => {
     api.get('/accounts/accountId/accesses/accessId')
        .reply(200, { id: 'accessId' })
      const res = await scope.sharedAccount('accountId').access('accessId').read()

      expect(res).to.be.an('object')
      expect(res.id).to.be.a('string')
    })

    it('should update a single account access', async () => {
      const payload = { role: 'admin' }
      api.put('/accounts/accountId/accesses/accessId', payload)
        .reply(200, { id: 'accessId' })
      const res = await scope.sharedAccount('accountId').access('accessId').update(payload)

      expect(res).to.be.an('object')
      expect(res.id).to.equal('accessId')
    })
  })
}
