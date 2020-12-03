const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = () => {
  describe('Secret Key', () => {
    let operator

    before(async () => {
      operator = getScope('operator')
    })

    it("should read an application's secret key", async () => {
      mockApi()
        .get('/projects/projectId/applications/applicationId/secretKey')
        .reply(200, { secretApiKey: 'secretApiKey' })
      const res = await operator
        .project('projectId')
        .application('applicationId')
        .secretKey()
        .read()

      expect(res).to.be.an('object')
      expect(res.secretApiKey).to.be.a('string')
    })
  })
}
