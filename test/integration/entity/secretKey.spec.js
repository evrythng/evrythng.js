const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType, url) => {
  describe('Secret Key', () => {
    let scope, api

    before(async () => {
      scope = getScope(scopeType)
      api = mockApi(url)
    })

    it("should read an application's secret key", async () => {
      api
        .get('/projects/projectId/applications/applicationId/secretKey')
        .reply(200, { secretApiKey: 'secretApiKey' })
      const res = await scope.project('projectId').application('applicationId').secretKey().read()

      expect(res).to.be.an('object')
      expect(res.secretApiKey).to.be.a('string')
    })
  })
}
