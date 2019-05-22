const { expect } = require('chai')
const { getScope } = require('../util')

module.exports = () => {
  describe('Param Setters', () => {
    let operator, project, thng

    before(async () => {
      operator = getScope('operator')

      const payload = { name: 'Test' }
      project = await operator.project().create(payload)

      const params = { project: project.id }
      thng = await operator.thng().create(payload, { params })

      await operator.action('scans').create({ type: 'scans', thng: thng.id })
    })

    after(async () => {
      await operator.thng(thng.id).delete()
      await operator.project(project.id).delete()
    })

    it('should set withScopes via setWithScopes', async () => {
      const res = await operator.thng().setWithScopes().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
      expect(res[0].scopes).to.be.an('object')
    })

    it('should set context via setContext', async () => {
      const res = await operator.action('all').setContext().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
      expect(res[0].context).to.be.an('object')
    })

    it('should set perPage via setPerPage', async () => {
      const res = await operator.thng().setPerPage(1).read()

      expect(res).to.be.an('array')
      expect(res).to.have.length(1)
    })

    it('should set project via setProject', async () => {
      const res = await operator.thng().setProject(project.id).read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should set filter via setFilter', async () => {
      const res = await operator.thng().setFilter('name=Test').read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should allow chaining of multiple param setters', async () => {
      const res = await operator.thng()
        .setProject(project.id)
        .setFilter('name=Test')
        .setPerPage(1)
        .setWithScopes()
        .read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
      expect(res[0].scopes).to.be.an('object')
    })
  })
}
