const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType, url) => {
  describe('Application Redirector', () => {
    let scope, api

    before(async () => {
      scope = getScope(scopeType)
      api = mockApi(url)
    })

    it('should read the application Redirector', async () => {
      api.get('/projects/projectId/applications/applicationId/redirector')
        .reply(200, { rules: [] })
      const res = await scope.project('projectId').application('applicationId')
        .redirector()
        .read()

      expect(res).to.be.an('object')
      expect(res.rules).to.be.an('array')
    })

    it('should update the application redirector', async () => {
      const payload = {
        rules: [{ match: 'thng.name=test' }]
      }
      api.put('/projects/projectId/applications/applicationId/redirector')
        .reply(200, payload)
      const res = await scope.project('projectId').application('applicationId')
        .redirector()
        .update(payload)

      expect(res.rules).to.deep.equal(payload.rules)
    })

    it('should delete the application redirector', async () => {
      const payload = {
        rules: [{ match: 'thng.name=test' }]
      }
      api.delete('/projects/projectId/applications/applicationId/redirector')
        .reply(204)
      const res = await scope.project('projectId').application('applicationId')
        .redirector()
        .delete()

      expect(res).to.not.exist
    })
  })
}
