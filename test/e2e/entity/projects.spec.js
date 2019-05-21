const { expect } = require('chai')
const { getScope } = require('../util')

const PROJECT_NAME = 'test'

module.exports = () => {
  describe('Projects', () => {
    let operator, project

    before(() => {
      operator = getScope('operator')
    })

    it('should create a project', async () => {
      project = await operator.project().create({ name: PROJECT_NAME })

      expect(project).to.be.an('object')
      expect(project.name).to.equal(PROJECT_NAME)
      expect(project.id).to.have.length(24)
    })

    it('should read all projects', async () => {
      const res = await operator.project().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should read a project', async () => {
      const res = await operator.project(project.id).read()

      expect(res).to.be.an('object')
      expect(res.id).to.equal(project.id)
    })

    it('should update a project', async () => {
      const payload = { tags: ['updated'] }
      const res = await operator.project(project.id).update(payload)

      expect(res).to.be.an('object')
      expect(res.tags).to.deep.equal(payload.tags)
    })

    it('should delete a project', async () => {
      await operator.project(project.id).delete()
    })
  })
}
