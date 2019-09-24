const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType) => {
  let scope

  describe('Locations', () => {
    before(async () => {
      scope = getScope(scopeType)
    })

    it('should update a Thng\'s location', async () => {
      const payload = [{
        position: { type: 'Point', coordinates: [-17.3, 36] }
      }]
      mockApi().put('/thngs/thngId/location', payload)
        .reply(200, payload)
      const res = await scope.thng('thngId').locations().update(payload)

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should read a Thng\'s location', async () => {
      mockApi().get('/thngs/thngId/location')
        .reply(200, [{
          position: { type: 'Point', coordinates: [-17.3, 36] }
        }])
      const res = await scope.thng('thngId').locations().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should delete a Thng\'s location', async () => {
      mockApi().delete('/thngs/thngId/location')
        .reply(200)
      await scope.thng('thngId').locations().delete()
    })
  })
}
