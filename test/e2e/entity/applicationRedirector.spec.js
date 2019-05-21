const { expect } = require('chai')
const { getScope } = require('../util')

module.exports = () => {
  describe('Application Redirector', () => {
    let operator, project, application

    before(async () => {
      operator = getScope('operator')

      const payload = { name: 'Test' }
      project = await operator.project().create(payload)
      payload.socialNetworks = {}
      application = await operator.project(project.id).application().create(payload)
    })

    after(async () => {
      await operator.project(project.id).application(application.id).delete()
      await operator.project(project.id).delete()
    })

    it('should read the application Redirector', async () => {
      const res = await operator.project(project.id).application(application.id)
        .redirector()
        .read()

      expect(res).to.be.an('object')
      expect(res.rules).to.be.an('array')
    })

    it('should update the application redirector', async () => {
      const payload = {
        rules: [{ match: 'thng.name=test' }]
      }
      const res = await operator.project(project.id).application(application.id)
        .redirector()
        .update(payload)

      expect(res.rules).to.deep.equal(payload.rules)
    })
  })
}
