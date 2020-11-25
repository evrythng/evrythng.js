const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType, url) => {
  describe('Thngs', () => {
    let scope, api

    before(() => {
      scope = getScope(scopeType)
      api = mockApi(url)
    })

    it('should create a Thng', async () => {
      const payload = { name: 'Test Thng' }
      api.post('/thngs', payload)
        .reply(201, payload)
      const res = await scope.thng().create(payload)

      expect(res).to.be.an('object')
      expect(res.name).to.equal(payload.name)
    })

    it('should read a Thng', async () => {
      api.get('/thngs/thngId')
        .reply(200, { id: 'thngId' })
      const res = await scope.thng('thngId').read()

      expect(res).to.be.an('object')
      expect(res.id).to.equal('thngId')
    })

    it('should read all Thngs', async () => {
      api.get('/thngs')
        .reply(200, [{ id: 'thngId' }])
      const res = await scope.thng().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should update a Thng', async () => {
      const payload = { tags: ['updated'] }
      api.put('/thngs/thngId', payload)
        .reply(200, payload)
      const res = await scope.thng('thngId').update(payload)

      expect(res).to.be.an('object')
      expect(res.tags).to.deep.equal(['updated'])
    })

    if (['operator', 'trustedApp'].includes(scopeType)) {
      it('should delete a Thng', async () => {
        api.delete('/thngs/thngId')
          .reply(200)
        const res = await scope.thng('thngId').delete()
        
        expect(res).to.not.exist
      })
    }
  })
}
