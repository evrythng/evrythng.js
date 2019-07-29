const chai = require('chai')
const { getScope } = require('../util')
const chaiAsPromised = require('chai-as-promised')

const { expect } = chai
chai.use(chaiAsPromised)

const payload = { name: 'Test Thng', identifiers: { serial: '78fd6hsd' } }

module.exports = () => {
  describe('find', () => {
    let operator, thng

    before(async () => {
      operator = getScope('operator')

      thng = await operator.thng().create(payload)
    })

    after(async () => {
      await operator.thng(thng.id).delete()
    })

    it('should find Thngs by identifiers', async () => {
      const res = await operator.thng().find(payload.identifiers)

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should refuse to find if given more than one key-value', async () => {
      payload.identifiers.foo = 'bar'

      const attempt = operator.thng().find(payload.identifiers)
      return expect(attempt).to.eventually.be.rejected
    })

    it('should find Thngs by name', async () => {
      const res = await operator.thng().find(payload.name)

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })
  })
}
