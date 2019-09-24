const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = () => {
  describe('Projects', () => {
    let operator

    before(() => {
      operator = getScope('operator')
    })

    it('should create a project', async () => {
      const payload = { name: 'Test Project' }
      mockApi().post('/projects', payload)
        .reply(201, payload)

      const res = await operator.project().create(payload)

      expect(res).to.be.an('object')
      expect(res.name).to.equal('Test Project')
    })

    it('should read all projects', async () => {
      mockApi().get('/projects')
        .reply(200, [{ id: 'projectId' }])
      const res = await operator.project().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should read a project', async () => {
      mockApi().get('/projects/projectId')
        .reply(200, { id: 'projectId' })
      const res = await operator.project('projectId').read()

      expect(res).to.be.an('object')
      expect(res.id).to.be.a('string')
    })

    it('should update a project', async () => {
      const payload = { tags: ['updated'] }
      mockApi().put('/projects/projectId', payload)
        .reply(200, payload)
      const res = await operator.project('projectId').update(payload)

      expect(res).to.be.an('object')
      expect(res.tags).to.deep.equal(['updated'])
    })

    it('should delete a project', async () => {
      mockApi().delete('/projects/projectId')
        .reply(200)
      await operator.project('projectId').delete()
    })
  })
}
