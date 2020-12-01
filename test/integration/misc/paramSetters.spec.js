const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType, url) => {
  describe('Param Setters', () => {
    let scope, api

    before(async () => {
      scope = getScope(scopeType)
      api = mockApi(url);
    })

    it('should set withScopes via setWithScopes', async () => {
      api.get('/thngs?withScopes=true')
        .reply(200, [{
          name: 'Thng 1',
          scopes: {
            project: [],
            users: ['all']
          }
        }])
      const res = await scope.thng().setWithScopes().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
      expect(res[0].scopes).to.be.an('object')
    })

    it('should set context via setContext', async () => {
      api.get('/actions/all?context=true')
        .reply(200, [{
          type: 'scans',
          context: { countryCode: 'GB' }
        }])
      const res = await scope.action('all').setContext().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
      expect(res[0].context).to.be.an('object')
    })

    it('should set perPage via setPerPage', async () => {
      api.get('/thngs?perPage=1')
        .reply(200, [{ name: 'Thng 1' }])
      const res = await scope.thng().setPerPage(1).read()

      expect(res).to.be.an('array')
      expect(res).to.have.length(1)
    })

    it('should set project via setProject', async () => {
      api.get('/thngs?project=projectId')
        .reply(200, [{ name: 'Thng 1' }])
      const res = await scope.thng().setProject('projectId').read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should set filter via setFilter', async () => {
      api.get('/thngs?filter=name%3DTest')
        .reply(200, [{ name: 'Test' }])
      const res = await scope.thng().setFilter('name=Test').read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should set ids via setIds', async () => {
      const payload = [{ id: 'thngId1' }, { id: 'thngId2' }]
      api.get('/thngs?ids=thngId1%2CthngId2')
        .reply(200, payload)
      const res = await scope.thng().setIds(payload.map(p => p.id)).read()

      expect(res.length).to.equal(payload.length)
    })

    it('should allow chaining of multiple param setters', async () => {
      api.get('/thngs?project=projectId&filter=name%3DTest&perPage=1&withScopes=true')
        .reply(200, [{
          name: 'Test',
          scopes: {
            project: [],
            users: ['all']
          }
        }])
      const res = await scope.thng()
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
