const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = () => {
  describe('Application Redirector', () => {
    let operator

    before(async () => {
      operator = getScope('operator')
    })

    it('should read the application Redirector', async () => {
      mockApi().get('/projects/projectId/applications/applicationId/redirector')
        .reply(200, { rules: [] })
      const res = await operator.project('projectId').application('applicationId')
        .redirector()
        .read()

      expect(res).to.be.an('object')
      expect(res.rules).to.be.an('array')
    })

    it('should update the application redirector', async () => {
      const payload = {
        rules: [{ match: 'thng.name=test' }]
      }
      mockApi().put('/projects/projectId/applications/applicationId/redirector')
        .reply(200, payload)
      const res = await operator.project('projectId').application('applicationId')
        .redirector()
        .update(payload)

      expect(res.rules).to.deep.equal(payload.rules)
    })
  })
}
