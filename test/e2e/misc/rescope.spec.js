const { expect } = require('chai')
const { getScope } = require('../util')

module.exports = () => {
  describe('rescope', () => {
    let operator, project, thng

    before(async () => {
      operator = getScope('operator')

      project = await operator.project().create({ name: 'Test Project' })
      thng = await operator.thng().create({ name: 'Test Thng' })
    })

    after(async () => {
      await operator.project(project.id).delete()
      await operator.thng(thng.id).delete()
    })

    it('should remove all scopes', async () => {
      await operator.thng(thng.id).rescope([], [])
      const res = await operator.thng(thng.id).setWithScopes().read()

      expect(res.scopes.projects).to.be.an('array')
      expect(res.scopes.projects).to.have.length(0)
      expect(res.scopes.users).to.be.an('array')
      expect(res.scopes.users).to.have.length(0)
    })

    it('should set one project scope', async () => {
      await operator.thng(thng.id).rescope([project.id])
      const res = await operator.thng(thng.id).setWithScopes().read()

      expect(res.scopes.projects).to.be.an('array')
      expect(res.scopes.projects).to.have.length(1)
      expect(res.scopes.users).to.be.an('array')
      expect(res.scopes.users).to.have.length(0)
    })

    it('should set all users scope', async () => {
      await operator.thng(thng.id).rescope([project.id], ['all'])
      const res = await operator.thng(thng.id).setWithScopes().read()

      expect(res.scopes.projects).to.be.an('array')
      expect(res.scopes.projects).to.have.length(1)
      expect(res.scopes.users).to.be.an('array')
      expect(res.scopes.users).to.have.length(1)
      expect(res.scopes.users).to.include('all')
    })

    it('should remove only the project scopes', async () => {
      await operator.thng(thng.id).rescope([])
      const res = await operator.thng(thng.id).setWithScopes().read()

      expect(res.scopes.projects).to.be.an('array')
      expect(res.scopes.projects).to.have.length(0)
      expect(res.scopes.users).to.be.an('array')
      expect(res.scopes.users).to.have.length(1)
      expect(res.scopes.users).to.include('all')
    })
  })
}
