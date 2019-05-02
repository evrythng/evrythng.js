const { expect } = require('chai')
const { getScope } = require('../util')

module.exports = (scopeType) => {
  let scope, thng

  describe('Locations', () => {
    before(async () => {
      scope = getScope(scopeType)
      thng = await scope.thngs().create({ name: 'test' })
    })

    after(async () => {
      const operator = getScope('operator')
      await operator.thngs(thng.id).delete()
    })

    it('should update a Thng\'s location', async () => {
      const payload = [{
        position: { type: 'Point', coordinates: [-17.3, 36] }
      }]
      const res = await scope.thngs(thng.id).locations().update(payload)

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should read a Thng\'s location', async () => {
      const res = await scope.thngs(thng.id).locations().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should delete a Thng\'s location', async () => {
      await scope.thngs(thng.id).locations().delete()
    })
  })
}
