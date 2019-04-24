const { expect } = require('chai')
const { getScope } = require('../util')

module.exports = (scopeType) => {
  let scope, thng

  describe('Locations', () => {
    before(async () => {
      scope = getScope(scopeType)
      thng = await scope.thng().create({ name: 'test' })
    })

    after(async () => {
      const operator = getScope('operator')
      await operator.thng(thng.id).delete()
    })

    it('should update a Thng\'s location', async () => {
      const payload = [{
        position: { type: 'Point', coordinates: [-17.3, 36] }
      }]
      const res = await scope.thng(thng.id).location().update(payload)

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)      
    })

    it('should read a Thng\'s location', async () => {
      const res = await scope.thng(thng.id).location().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should delete a Thng\'s location', async () => {
      await scope.thng(thng.id).location().delete()
    })
  })
}
