const { expect } = require('chai')
const { getScope } = require('../util')

module.exports = () => {
  describe('Account Redirector', () => {
    let operator

    before(() => {
      operator = getScope('operator')
    })

    it('should read the account Redirector', async () => {
      const res = await operator.redirector().read()

      expect(res).to.be.an('object')
      expect(res.rules).to.be.an('array')
    })

    it('should update the account redirector', async () => {
      const payload = {
        rules: [{ match: 'thng.name=test' }]
      }
      const res = await operator.redirector().update(payload)

      expect(res.rules).to.deep.equal(payload.rules)
    })
  })
}
