const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType) => {
  describe('Thngs', () => {
    let scope

    before(() => {
      scope = getScope(scopeType)
    })

    it('should create a Thng', async () => {
      const payload = { name: 'Test Thng' }
      mockApi().post('/thngs', payload)
        .reply(201, payload)
      const res = await scope.thng().create(payload)

      expect(res).to.be.an('object')
      expect(res.name).to.equal(payload.name)
    })

    it('should read a Thng', async () => {
      mockApi().get('/thngs/thngId')
        .reply(200, { id: 'thngId' })
      const res = await scope.thng('thngId').read()

      expect(res).to.be.an('object')
      expect(res.id).to.equal('thngId')
    })

    it('should read nested Thng', async () => {
      mockApi().get('/thngs/thngId/thngs')
        .reply(200,  [{ id: 'child1Id' }, { id: 'child2Id' }])
      const res = await scope.thng('thngId').thng().read()

      expect(res).to.be.an('array')
      expect(res[0].id).to.equal('child1Id')
      expect(res[1].id).to.equal('child2Id')
    })

    it('should read all Thngs', async () => {
      mockApi().get('/thngs')
        .reply(200, [{ id: 'thngId' }])
      const res = await scope.thng().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should update a Thng', async () => {
      const payload = { tags: ['updated'] }
      mockApi().put('/thngs/thngId', payload)
        .reply(200, payload)
      const res = await scope.thng('thngId').update(payload)

      expect(res).to.be.an('object')
      expect(res.tags).to.deep.equal(['updated'])
    })

    if (['operator', 'trustedApp'].includes(scopeType)) {
      it('should delete a Thng', async () => {
        mockApi().delete('/thngs/thngId')
          .reply(200)
        await scope.thng('thngId').delete()
      })
    }
  })
}
