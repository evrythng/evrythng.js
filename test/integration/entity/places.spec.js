const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType, url) => {
  describe('Places', () => {
    let scope, api

    before(() => {
      scope = getScope(scopeType)
      api = mockApi(url)
    })

    it('should read all places', async () => {
      api.get('/places').reply(200, [{ id: 'placeId' }])
      const res = await scope.place().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(0)
    })

    if (['operator', 'trustedApp'].includes(scopeType)) {
      it('should create a place', async () => {
        const payload = { name: 'Test Place' }
        api.post('/places', payload).reply(201, payload)
        const res = await scope.place().create(payload)

        expect(res).to.be.an('object')
        expect(res.name).to.equal(payload.name)
      })

      it('should read a place', async () => {
        api.get('/places/placeId').reply(200, { id: 'placeId' })
        const res = await scope.place('placeId').read()

        expect(res).to.be.an('object')
        expect(res.id).to.equal('placeId')
      })

      it('should update a place', async () => {
        const payload = { tags: ['updated'] }
        api.put('/places/placeId', payload).reply(200, payload)
        const res = await scope.place('placeId').update(payload)

        expect(res).to.be.an('object')
        expect(res.tags).to.deep.equal(['updated'])
      })

      it('should delete a place', async () => {
        api.delete('/places/placeId').reply(200)
        await scope.place('placeId').delete()
      })
    }
  })
}
