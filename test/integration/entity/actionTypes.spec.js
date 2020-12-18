const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType, url) => {
  describe('Action Types', () => {
    let scope, api

    before(() => {
      scope = getScope(scopeType)
      api = mockApi(url)
    })

    it('should read all action types', async () => {
      api.get('/actions').reply(200, [{ name: '_CustomType' }])
      const res = await scope.actionType().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    if (['operator', 'trustedApp'].includes(scopeType)) {
      it('should create an action type', async () => {
        const payload = { name: '_CustomType' }
        api.post('/actions', payload).reply(201, { name: '_CustomType' })
        const res = await scope.actionType().create(payload)

        expect(res).to.be.an('object')
        expect(res.name).to.equal(payload.name)
      })

      it('should read an action type', async () => {
        api.get('/actions?filter=name%3D_CustomType').reply(200, [{ name: '_CustomType' }])
        const res = await scope.actionType('_CustomType').read()

        expect(res).to.be.an('object')
        expect(res.name).to.equal('_CustomType')
      })
    }

    if (scopeType === 'operator') {
      it('should update an action type', async () => {
        const payload = { tags: ['updated'] }
        api.put('/actions/_CustomType', payload).reply(200, payload)
        const res = await scope.actionType('_CustomType').update(payload)

        expect(res).to.be.an('object')
        expect(res.tags).to.deep.equal(payload.tags)
      })
    }

    if (['operator', 'trustedApp'].includes(scopeType)) {
      it('should delete an actionType', async () => {
        api.delete('/actions/_CustomType').reply(200)
        await scope.actionType('_CustomType').delete()
      })
    }
  })
}
