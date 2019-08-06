const { expect } = require('chai')
const { getScope } = require('../util')

const shortDomain = 'tn.gg'
const defaultRedirectUrl = 'https://google.com'

module.exports = (scopeType, targetType) => {
  let scope, target

  describe(`Redirection (${targetType})`, () => {
    before(async () => {
      scope = getScope(scopeType)
      target = await scope[targetType]().create({ name: 'test' })
    })

    after(async () => {
      const operator = getScope('operator')
      await operator[targetType](target.id).delete()
    })

    it(`should create a ${targetType} redirection`, async () => {
      const payload = { defaultRedirectUrl }
      const res = await scope[targetType](target.id).redirection(shortDomain).create(payload)

      expect(res).to.be.an('object')
      expect(res.updatedAt).to.be.lte(Date.now())
    })

    it(`should read a ${targetType} redirection`, async () => {
      const res = await scope[targetType](target.id).redirection(shortDomain).read()

      expect(res.updatedAt).to.be.lte(Date.now())
      expect(res.hits).to.equal(0)
    })

    it(`should update a ${targetType} redirection`, async () => {
      const payload = { defaultRedirectUrl: 'https://google.com/updated?item={shortId}' }
      const res = await scope[targetType](target.id).redirection(shortDomain).update(payload)

      expect(res.updatedAt).to.be.lte(Date.now())
    })

    it(`should delete a ${targetType} redirection`, async () => {
      await scope[targetType](target.id).redirection(shortDomain).delete()
    })
  })
}
