const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType, settings) => {
  describe('Me', () => {
    let scope, api

    before(async () => {
      scope = getScope(scopeType)
      api = mockApi(settings.apiUrl)
    })

    if (settings.apiVersion == 2) {
      it('should read access', async () => {
        api.get('/me').reply(200, { id: 'operatorId' })
        const res = await scope.me().read()

        expect(res).to.be.an('object')
        expect(res.id).to.be.a('string')
      })
    }
    if (settings.apiVersion == 1) {
      it('should NOT read access', async () => {
        let caughtError = false
        try {
          api.get('/me').reply(403, {})
          await scope.me().read()
        } catch (err) {
          caughtError = true
          expect(err).to.exist
        }
        expect(caughtError).to.be.equal(true)
      })
    }
  })
}
