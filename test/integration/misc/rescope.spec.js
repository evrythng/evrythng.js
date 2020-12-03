const { getScope, mockApi } = require('../util')

module.exports = () => {
  describe('rescope', () => {
    let operator

    before(async () => {
      operator = getScope('operator')
    })

    it('should remove all scopes', async () => {
      mockApi()
        .get('/thngs/thngId?withScopes=true')
        .reply(200, {
          scopes: {
            projects: ['projectId'],
            users: ['all']
          }
        })
      mockApi()
        .put('/thngs/thngId', {
          scopes: {
            projects: ['projectId'],
            users: []
          }
        })
        .reply(200, {})
      await operator.thng('thngId').rescope(['projectId'], [])
    })

    it('should set one project scope', async () => {
      mockApi()
        .get('/thngs/thngId?withScopes=true')
        .reply(200, {
          scopes: {
            projects: ['projectId'],
            users: ['all']
          }
        })
      mockApi()
        .put('/thngs/thngId', {
          scopes: {
            projects: ['projectId'],
            users: ['all']
          }
        })
        .reply(200, {})
      await operator.thng('thngId').rescope(['projectId'])
    })

    it('should set all users scope', async () => {
      mockApi()
        .get('/thngs/thngId?withScopes=true')
        .reply(200, {
          scopes: {
            projects: ['projectId'],
            users: []
          }
        })
      mockApi()
        .put('/thngs/thngId', {
          scopes: {
            projects: ['projectId'],
            users: ['all']
          }
        })
        .reply(200, {})
      await operator.thng('thngId').rescope(['projectId'], ['all'])
    })

    it('should remove only the project scopes', async () => {
      mockApi()
        .get('/thngs/thngId?withScopes=true')
        .reply(200, {
          scopes: {
            projects: ['projectId'],
            users: ['userId']
          }
        })
      mockApi()
        .put('/thngs/thngId', {
          scopes: {
            projects: [],
            users: ['userId']
          }
        })
        .reply(200, {})
      await operator.thng('thngId').rescope([])
    })
  })
}
