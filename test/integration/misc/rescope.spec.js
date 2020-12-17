const { getScope, mockApi } = require('../util')

module.exports = (scopeType, url) => {
  describe('rescope', () => {
    let scope, api

    before(async () => {
      scope = getScope(scopeType)
      api = mockApi(url)
    })

    it('should remove all scopes', async () => {
      api.get('/thngs/thngId?withScopes=true').reply(200, {
        scopes: {
          projects: ['projectId'],
          users: ['all']
        }
      })
      api
        .put('/thngs/thngId', {
          scopes: {
            projects: ['projectId'],
            users: []
          }
        })
        .reply(200, {})
      await scope.thng('thngId').rescope(['projectId'], [])
    })

    it('should set one project scope', async () => {
      api.get('/thngs/thngId?withScopes=true').reply(200, {
        scopes: {
          projects: ['projectId'],
          users: ['all']
        }
      })
      api
        .put('/thngs/thngId', {
          scopes: {
            projects: ['projectId'],
            users: ['all']
          }
        })
        .reply(200, {})
      await scope.thng('thngId').rescope(['projectId'])
    })

    it('should set all users scope', async () => {
      api.get('/thngs/thngId?withScopes=true').reply(200, {
        scopes: {
          projects: ['projectId'],
          users: []
        }
      })
      api
        .put('/thngs/thngId', {
          scopes: {
            projects: ['projectId'],
            users: ['all']
          }
        })
        .reply(200, {})
      await scope.thng('thngId').rescope(['projectId'], ['all'])
    })

    it('should remove only the project scopes', async () => {
      api.get('/thngs/thngId?withScopes=true').reply(200, {
        scopes: {
          projects: ['projectId'],
          users: ['userId']
        }
      })
      api
        .put('/thngs/thngId', {
          scopes: {
            projects: [],
            users: ['userId']
          }
        })
        .reply(200, {})
      await scope.thng('thngId').rescope([])
    })
  })
}
