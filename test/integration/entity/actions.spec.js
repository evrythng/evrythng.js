const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType) => {
  let scope, operatorScope

  describe('Actions', () => {
    before(async () => {
      scope = getScope(scopeType)
      operatorScope = getScope('operator')
    })

    it('should create an action', async () => {
      const payload = { type: 'scans', thng: 'thngId', tags: ['foo'] }
      mockApi().post('/actions/scans', payload)
        .reply(201, { id: 'actionId' })
      const res = await scope.action('scans').create(payload)

      expect(res).to.be.an('object')
      expect(res.id).to.be.a('string')
    })

    it('should read all actions of a type', async () => {
      mockApi().get('/actions/scans')
        .reply(200, [{ id: 'actionId' }])
      const res = await scope.action('scans').read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(0)
    })

    it('should create an aliased action', async () => {
      const payload = { type: 'scans' }
      mockApi().post('/thngs/thngId/actions/scans', payload)
        .reply(201, { id: 'actionId' })
      const res = await scope.thng('thngId').action('scans')
        .create(payload)

      expect(res).to.be.an('object')
      expect(res.id).to.be.a('string')
    })

    it('should read all aliased actions', async () => {
      mockApi().get('/thngs/thngId/actions/scans')
        .reply(200, [{ id: 'actionId' }])
      const res = await scope.thng('thngId').action('scans').read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    if (scopeType === 'operator') {
      it('should read a single action', async () => {
        mockApi().get('/actions/scans/actionId')
          .reply(200, { id: 'actionId' })
        const res = await scope.action('scans', 'actionId').read()

        expect(res).to.be.an('object')
        expect(res.id).to.be.a('string')
      })

      it('should delete an action', async () => {
        mockApi().delete('/actions/scans/actionId')
          .reply(200)
        await scope.action('scans', 'actionId').delete()
      })
    }
  })
}
