const { expect } = require('chai')
const { getScope } = require('../util')

module.exports = () => {
  describe('Secret Key', () => {
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

    it('should read an application\'s secret key', async () => {
      const res = await operator.project(project.id).application(application.id)
        .secretKey()
        .read()

      expect(res).to.be.an('object')
      expect(res.secretApiKey).to.have.length(80)
    })
  })
}
