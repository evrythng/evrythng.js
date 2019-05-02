const { expect } = require('chai')
const { getScope } = require('../util')

const PROPERTY_NAME = 'temp'
const PROPERTY_VALUE = 42

module.exports = (scopeType, targetType) => {
  let scope, target

  describe(`Properties (${targetType})`, () => {
    before(async () => {
      scope = getScope(scopeType)

      target = await scope[targetType]().create({ name: 'test' })
    })

    after(async () => {
      const operator = getScope('operator')
      await operator[targetType](target.id).delete()
    })

    it(`should create a ${targetType} property`, async () => {
      const payload = { key: PROPERTY_NAME, value: PROPERTY_VALUE }
      const res = await scope[targetType](target.id).properties().create(payload)

      expect(res).to.be.an('array')
      expect(res).to.have.length(1)
      expect(res[0].key).to.equal(PROPERTY_NAME)
      expect(res[0].value).to.equal(PROPERTY_VALUE)
    })

    it(`should read all ${targetType} properties`, async () => {
      const res = await scope[targetType](target.id).properties().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length(1)
      expect(res[0].key).to.equal(PROPERTY_NAME)
      expect(res[0].value).to.equal(PROPERTY_VALUE)
    })

    it(`should read a single ${targetType} property`, async () => {
      const res = await scope[targetType](target.id).properties(PROPERTY_NAME).read()

      expect(res).to.be.an('array')
      expect(res[0].value).to.equal(PROPERTY_VALUE)
    })

    it(`should update a single ${targetType} property`, async () => {
      const res = await scope[targetType](target.id).properties(PROPERTY_NAME).update(PROPERTY_VALUE + 1)

      expect(res).to.be.an('array')
      expect(res[0].value).to.equal(PROPERTY_VALUE + 1)
    })

    if (scopeType !== 'anonUser') {
      it(`should delete a single ${targetType} property`, async () => {
        await scope[targetType](target.id).properties(PROPERTY_NAME).delete()
      })
    }
  })
}
