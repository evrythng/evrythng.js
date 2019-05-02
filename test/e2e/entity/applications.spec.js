const { expect } = require('chai')
const { getScope } = require('../util')

const NAME = 'test'

module.exports = (scopeType) => {
  describe('Applications', () => {
    let scope, project, application

    before(async () => {
      scope = getScope(scopeType)

      project = await scope.projects().create({ name: NAME })
    })

    after(async () => {
      await scope.projects(project.id).delete()
    })

    it('should create an application', async () => {
      const payload = { name: NAME, socialNetworks: {} }
      application = await scope.projects(project.id).applications().create(payload)

      expect(application).to.be.an('object')
      expect(application.name).to.equal(NAME)
      expect(application.id).to.have.length(24)
      expect(application.project).to.equal(project.id)
    })

    it('should read all applications', async () => {
      const res = await scope.projects(project.id).applications().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should read an application', async () => {
      const res = await scope.projects(project.id).applications(application.id).read()

      expect(res).to.be.an('object')
      expect(res.id).to.equal(application.id)
    })

    it('should update an application', async () => {
      const payload = { tags: ['updated'] }
      const res = await scope.projects(project.id).applications(application.id).update(payload)

      expect(res).to.be.an('object')
      expect(res.tags).to.deep.equal(payload.tags)
    })

    it('should delete an application', async () => {
      await scope.projects(project.id).applications(application.id).delete()
    })
  })
}
