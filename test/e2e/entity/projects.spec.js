const { expect } = require('chai')
const { getScope } = require('../util')

const PROJECT_NAME = 'test'

module.exports = (scopeType) => {
  describe('Projects', () => {
    let scope, project

    before(() => {
      scope = getScope(scopeType)
    })

    it('should create a project', async () => {
      project = await scope.projects().create({ name: PROJECT_NAME })

      expect(project).to.be.an('object')
      expect(project.name).to.equal(PROJECT_NAME)
      expect(project.id).to.have.length(24)
    })

    it('should read all projects', async () => {
      const res = await scope.projects().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should read a project', async () => {
      const res = await scope.projects(project.id).read()

      expect(res).to.be.an('object')
      expect(res.id).to.equal(project.id)
    })

    it('should update a project', async () => {
      const payload = { tags: ['updated'] }
      const res = await scope.projects(project.id).update(payload)

      expect(res).to.be.an('object')
      expect(res.tags).to.deep.equal(payload.tags)
    })

    it('should delete a project', async () => {
      await scope.projects(project.id).delete()
    })
  })
}
