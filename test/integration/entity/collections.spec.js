const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType) => {
  describe('Collections', () => {
    let scope

    before(() => {
      scope = getScope(scopeType)
    })

    it('should create a collection', async () => {
      const payload = { name: 'Test Collection' }
      mockApi().post('/collections', payload)
        .reply(200, payload)
      const res = await scope.collection().create(payload)

      expect(res).to.be.an('object')
      expect(res.name).to.equal('Test Collection')
    })

    it('should read a collection', async () => {
      mockApi().get('/collections/collectionId')
        .reply(200, { id: 'collectionId' })
      const res = await scope.collection('collectionId').read()

      expect(res).to.be.an('object')
      expect(res.id).to.equal('collectionId')
    })

    it('should read all collections', async () => {
      mockApi().get('/collections')
        .reply(200, [{ id: 'collectionId' }])
      const res = await scope.collection().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should update a collection', async () => {
      const payload = { tags: ['updated'] }
      mockApi().put('/collections/collectionId')
        .reply(200, { tags: ['updated'] })
      const res = await scope.collection('collectionId').update(payload)

      expect(res).to.be.an('object')
      expect(res.tags).to.deep.equal(['updated'])
    })

    if (['operator', 'trustedApp'].includes(scopeType)) {
      it('should delete a collection', async () => {
        mockApi().delete('/collections/collectionId')
          .reply(200)
        await scope.collection('collectionId').delete()
      })
    }
  })
}
