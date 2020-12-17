const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType, url) => {
  describe('Projects', () => {
    let scope, api

    before(() => {
      scope = getScope(scopeType)
      api = mockApi(url)
    })

    it('should create a project', async () => {
      const payload = { name: 'Test Project' }
      api.post('/projects', payload).reply(201, payload)

      const res = await scope.project().create(payload)

      expect(res).to.be.an('object')
      expect(res.name).to.equal('Test Project')
    })

    it('should read all projects', async () => {
      api.get('/projects').reply(200, [{ id: 'projectId' }])
      const res = await scope.project().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should read a project', async () => {
      api.get('/projects/projectId').reply(200, { id: 'projectId' })
      const res = await scope.project('projectId').read()

      expect(res).to.be.an('object')
      expect(res.id).to.be.a('string')
    })

    it('should update a project', async () => {
      const payload = { tags: ['updated'] }
      api.put('/projects/projectId', payload).reply(200, payload)
      const res = await scope.project('projectId').update(payload)

      expect(res).to.be.an('object')
      expect(res.tags).to.deep.equal(['updated'])
    })

    it('should delete a project', async () => {
      api.delete('/projects/projectId').reply(200)
      await scope.project('projectId').delete()
    })
  })
}
