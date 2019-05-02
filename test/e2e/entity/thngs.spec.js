const { expect } = require('chai')
const { resources, getScope } = require('../util')

module.exports = (scopeType) => {
  describe('Thngs', () => {
    let scope

    before(() => {
      scope = getScope(scopeType)
    })

    it('should create a Thng', async () => {
      const payload = {
        name: 'Test Thng',
        customFields: {
          color: 'red',
          serial: Date.now()
        }
      }

      resources.thng = await scope.thngs().create(payload)

      expect(resources.thng).to.be.an('object')
      expect(resources.thng.customFields).to.deep.equal(payload.customFields)
    })

    it('should read a Thng', async () => {
      const res = await scope.thngs(resources.thng.id).read()

      expect(res).to.be.an('object')
      expect(res.id).to.equal(resources.thng.id)
    })

    it('should read all Thngs', async () => {
      const res = await scope.thngs().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should update a Thng', async () => {
      const payload = { tags: ['updated'] }
      const res = await scope.thngs(resources.thng.id).update(payload)

      expect(res).to.be.an('object')
      expect(res.tags).to.deep.equal(payload.tags)
    })

    if (['operator', 'trustedApp'].includes(scopeType)) {
      it('should delete a Thng', async () => {
        await scope.thngs(resources.thng.id).delete()
      })
    }
  })
}
