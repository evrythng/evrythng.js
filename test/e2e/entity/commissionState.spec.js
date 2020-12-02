const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType) => {
  let scope

  describe('Commission State', () => {
    before(async () => {
      scope = getScope(scopeType)
    })

    it("should read a Thng's commissioning state", async () => {
      mockApi()
        .get('/thngs/gs1%3A21%3A23984736/commissionState')
        .reply(200, { state: 'not_commissioned' })
      const res = await scope.thng('gs1:21:23984736').commissionState().read()

      expect(res).to.be.an('object')
      expect(res.state).to.equal('not_commissioned')
    })
  })
}
