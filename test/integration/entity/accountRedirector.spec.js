const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType, url) => {
  describe('Account Redirector', () => {
    let scope, api

    before(() => {
      scope = getScope(scopeType)
      api = mockApi(url)

    })

    it('should read the account Redirector', async () => {
      api.get('/redirector')
        .reply(200, { rules: [] })
      const res = await scope.redirector().read()

      expect(res).to.be.an('object')
      expect(res.rules).to.be.an('array')
    })

    it('should update the account redirector', async () => {
      const payload = {
        rules: [{ match: 'thng.name=test' }]
      }
      api.put('/redirector', payload)
        .reply(200, payload)
      const res = await scope.redirector().update(payload)

      expect(res.rules).to.deep.equal(payload.rules)
    })

    it('should delete the account redirector', async () => {
      api.delete('/redirector')
        .reply(204)
      const res = await scope.redirector().delete()
      
      expect(res).to.not.exist
    })
  })
}
