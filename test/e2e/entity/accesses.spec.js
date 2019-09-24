const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = () => {
  describe('Accesses', () => {
    let operator

    before(async () => {
      operator = getScope('operator')
    })

    it('should read all account accesses', async () => {
      mockApi().get('/accounts/accountId/accesses')
        .reply(200, [{ id: 'accessId' }])
      const res = await operator.sharedAccount('accountId').access().read()

      expect(res).to.have.length.gte(1)
    })

    it('should read a single account access', async () => {
      mockApi().get('/accounts/accountId/accesses/accessId')
        .reply(200, { id: 'accessId' })
      const res = await operator.sharedAccount('accountId').access('accessId').read()

      expect(res).to.be.an('object')
      expect(res.id).to.be.a('string')
    })

    it('should update a single account access', async () => {
      const payload = { role: 'admin' }
      mockApi().put('/accounts/accountId/accesses/accessId', payload)
        .reply(200, { id: 'accessId' })
      const res = await operator.sharedAccount('accountId').access('accessId').update(payload)

      expect(res).to.be.an('object')
      expect(res.id).to.equal('accessId')
    })
  })
}
