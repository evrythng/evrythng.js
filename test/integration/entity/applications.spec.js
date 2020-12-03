const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType, url) => {
  describe('Applications', () => {
    let scope, api

    before(async () => {
      scope = getScope(scopeType)
      api = mockApi(url)
    })

    it('should create an application', async () => {
      const payload = { name: 'Application Name', socialNetworks: {} }
      api.post('/projects/projectId/applications').reply(201, payload)
      const res = await scope.project('projectId').application().create(payload)

      expect(res).to.be.an('object')
      expect(res.name).to.be.a('string')
    })

    it('should read all applications', async () => {
      api.get('/projects/projectId/applications').reply(200, [{ id: 'applicationId' }])
      const res = await scope.project('projectId').application().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should read an application', async () => {
      api.get('/projects/projectId/applications/applicationId').reply(200, { id: 'applicationId' })
      const res = await scope.project('projectId').application('applicationId').read()

      expect(res).to.be.an('object')
      expect(res.id).to.equal('applicationId')
    })

    it('should update an application', async () => {
      const payload = { tags: ['updated'] }
      api.put('/projects/projectId/applications/applicationId').reply(200, payload)
      const res = await scope.project('projectId').application('applicationId').update(payload)

      expect(res).to.be.an('object')
      expect(res.tags).to.deep.equal(payload.tags)
    })

    it('should delete an application', async () => {
      api.delete('/projects/projectId/applications/applicationId').reply(200)
      await scope.project('projectId').application('applicationId').delete()
    })
  })
}
