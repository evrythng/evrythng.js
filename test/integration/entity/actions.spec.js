const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType, url) => {
  let scope, api

  describe('Actions', () => {
    before(async () => {
      scope = getScope(scopeType)
      api = mockApi(url)
    })

    it('should create an action', async () => {
      const payload = { type: 'scans', thng: 'thngId', tags: ['foo'] }
      api.post('/actions/scans', payload)
        .reply(201, { id: 'actionId' })
      const res = await scope.action('scans').create(payload)

      expect(res).to.be.an('object')
      expect(res.id).to.be.a('string')
    })

    it('should read all actions of a type', async () => {
      api.get('/actions/scans')
        .reply(200, [{ id: 'actionId' }])
      const res = await scope.action('scans').read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(0)
    })

    it('should create an aliased action', async () => {
      const payload = { type: 'scans' }
      api.post('/thngs/thngId/actions/scans', payload)
        .reply(201, { id: 'actionId' })
      const res = await scope.thng('thngId').action('scans')
        .create(payload)

      expect(res).to.be.an('object')
      expect(res.id).to.be.a('string')
    })

    it('should read all aliased actions', async () => {
      api.get('/thngs/thngId/actions/scans')
        .reply(200, [{ id: 'actionId' }])
      const res = await scope.thng('thngId').action('scans').read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    if (scopeType === 'operator') {
      it('should read a single action', async () => {
        api.get('/actions/scans/actionId')
          .reply(200, { id: 'actionId' })
        const res = await scope.action('scans', 'actionId').read()

        expect(res).to.be.an('object')
        expect(res.id).to.be.a('string')
      })

      it('should delete an action', async () => {
        api.delete('/actions/scans/actionId')
          .reply(200)
        await scope.action('scans', 'actionId').delete()
      })
    }
  })
}
