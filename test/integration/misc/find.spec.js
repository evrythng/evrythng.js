const chai = require('chai')
const { getScope, mockApi } = require('../util')
const chaiAsPromised = require('chai-as-promised')

const { expect } = chai
chai.use(chaiAsPromised)

const payload = { name: 'Test Thng', identifiers: { serial: '78fd6hsd' } }

module.exports = () => {
  describe('find', () => {
    let operator

    before(async () => {
      operator = getScope('operator')
    })

    it('should find Thngs by identifiers', async () => {
      mockApi().get('/thngs?filter=identifiers.serial%3D78fd6hsd').reply(200, [payload])
      const res = await operator.thng().find(payload.identifiers)

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should refuse to find if given more than one key-value', async () => {
      payload.identifiers.foo = 'bar'

      mockApi().get('/thngs?filter=identifiers.serial%3D78fd6hsd').reply(200, payload)
      const attempt = operator.thng().find(payload.identifiers)
      return expect(attempt).to.eventually.be.rejected
    })

    it('should find Thngs by name', async () => {
      mockApi().get('/thngs?filter=name%3DTest%20Thng').reply(200, [payload])
      const res = await operator.thng().find(payload.name)

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })
  })
}
