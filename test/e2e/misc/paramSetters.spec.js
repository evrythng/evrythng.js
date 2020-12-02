const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = () => {
  describe('Param Setters', () => {
    let operator

    before(async () => {
      operator = getScope('operator')
    })

    it('should set withScopes via setWithScopes', async () => {
      mockApi()
        .get('/thngs?withScopes=true')
        .reply(200, [
          {
            name: 'Thng 1',
            scopes: {
              project: [],
              users: ['all']
            }
          }
        ])
      const res = await operator.thng().setWithScopes().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
      expect(res[0].scopes).to.be.an('object')
    })

    it('should set context via setContext', async () => {
      mockApi()
        .get('/actions/all?context=true')
        .reply(200, [
          {
            type: 'scans',
            context: { countryCode: 'GB' }
          }
        ])
      const res = await operator.action('all').setContext().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
      expect(res[0].context).to.be.an('object')
    })

    it('should set perPage via setPerPage', async () => {
      mockApi()
        .get('/thngs?perPage=1')
        .reply(200, [{ name: 'Thng 1' }])
      const res = await operator.thng().setPerPage(1).read()

      expect(res).to.be.an('array')
      expect(res).to.have.length(1)
    })

    it('should set project via setProject', async () => {
      mockApi()
        .get('/thngs?project=projectId')
        .reply(200, [{ name: 'Thng 1' }])
      const res = await operator.thng().setProject('projectId').read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should set filter via setFilter', async () => {
      mockApi()
        .get('/thngs?filter=name%3DTest')
        .reply(200, [{ name: 'Test' }])
      const res = await operator.thng().setFilter('name=Test').read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should set ids via setIds', async () => {
      const payload = [{ id: 'thngId1' }, { id: 'thngId2' }]
      mockApi().get('/thngs?ids=thngId1%2CthngId2').reply(200, payload)
      const res = await operator
        .thng()
        .setIds(payload.map((p) => p.id))
        .read()

      expect(res.length).to.equal(payload.length)
    })

    it('should allow chaining of multiple param setters', async () => {
      mockApi()
        .get('/thngs?project=projectId&filter=name%3DTest&perPage=1&withScopes=true')
        .reply(200, [
          {
            name: 'Test',
            scopes: {
              project: [],
              users: ['all']
            }
          }
        ])
      const res = await operator
        .thng()
        .setProject('projectId')
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
