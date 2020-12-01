const chai = require('chai')
const { getScope, mockApi } = require('../util')
const chaiAsPromised = require('chai-as-promised')

const { expect } = chai
chai.use(chaiAsPromised)

const payload = { name: 'Test Thng', identifiers: { serial: '78fd6hsd' } }

module.exports = (scopeType, url) => {
  describe('find', () => {
    let operator, api

    before(async () => {
      operator = getScope(scopeType)
      api = mockApi(url)
    })

    it('should find Thngs by identifiers', async () => {
      const payload1 = { name: 'Test Thng', identifiers: { serial: '78fd6hsd' } }
      api.get('/thngs?filter=identifiers.serial=78fd6hsd').reply(200, [payload])

      const res = await operator.thng().find(payload1.identifiers)

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should refuse to find if given more than one key-value', async () => {
      payload.identifiers.foo = 'bar'

      api.get('/thngs?filter=identifiers.serial%3D78fd6hsd').reply(200, payload)
      const attempt = operator.thng().find(payload.identifiers)
      return expect(attempt).to.eventually.be.rejected
    })

    it('should find Thngs by name', async () => {
      api.get('/thngs?filter=name%3DTest%20Thng').reply(200, [payload])
      const res = await operator.thng().find(payload.name)

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })
  })
}
