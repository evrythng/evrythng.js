const { expect } = require('chai')
const { getScope } = require('../util')

module.exports = (scopeType) => {
  describe('Places', () => {
    let scope, place

    before(() => {
      scope = getScope(scopeType)
    })

    it('should read all places', async () => {
      const res = await scope.places().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(0)
    })

    if (['operator', 'trustedApp'].includes(scopeType)) {
      it('should create a place', async () => {
        const payload = {
          name: 'Test Place',
          customFields: {
            color: 'red',
            serial: Date.now()
          }
        }

        place = await scope.places().create(payload)

        expect(place).to.be.an('object')
        expect(place.customFields).to.deep.equal(payload.customFields)
      })

      it('should read a place', async () => {
        const res = await scope.places(place.id).read()

        expect(res).to.be.an('object')
        expect(res.id).to.equal(place.id)
      })

      it('should update a place', async () => {
        const payload = { tags: ['updated'] }
        const res = await scope.places(place.id).update(payload)

        expect(res).to.be.an('object')
        expect(res.tags).to.deep.equal(payload.tags)
      })

      it('should delete a place', async () => {
        await scope.places(place.id).delete()
      })
    }
  })
}
