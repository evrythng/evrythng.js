const { expect } = require('chai')
const { getScope, mockApi } = require('../util')
const { ActionApp } = require('evrythng')

// Mocks
global.localStorage = {
  data: {},
  getItem: key => global.localStorage.data[key],
  setItem: (key, value) => {
    global.localStorage.data[key] = value
  },
}
global.window = {
  location: { href: 'mocha test location' }
}

module.exports = () => {
  describe('ActionApp', () => {
    let operator, actionApp

    before(async () => {
      mockApi().get('/access').times(2)
        .reply(200, { actor: { id: 'actorId' } })
      mockApi().get('/applications/me')
        .reply(200, { id: 'applicationId' })
      mockApi().post('/auth/evrythng/users?anonymous=true')
        .reply(201, { evrythngApiKey: 'evrythngApiKey' })
      mockApi().get('/users/actorId')
        .reply(200, { id: 'evrythngUser' })
      actionApp = new ActionApp('actionAppApiKey')
      await actionApp.init()
    })

    it('should export helper functions', async () => {
      expect(actionApp.pageVisited).to.be.a('function')
      expect(actionApp.createAction).to.be.a('function')
    })

    it('should create a \'_PageVisited\' action with pageVisited()', async () => {
      mockApi().get('/actions?filter=name%3D_PageVisited')
        .reply(200, [{ name: '_PageVisited' }])
      mockApi().post('/actions/_PageVisited', {
        type: '_PageVisited',
        customFields: { url: global.window.location.href }
      })
        .reply(201, {
          id: 'actionId',
          type: '_PageVisited',
          customFields: { url: global.window.location.href }
        })
      const res = await actionApp.pageVisited()

      expect(res.id).to.be.a('string')
      expect(res.type).to.equal('_PageVisited')
      expect(res.customFields.url).to.equal(global.window.location.href)
    })

    it('should create an action with custom data', async () => {
      mockApi().get('/actions?filter=name%3D_PageVisited')
        .reply(200, [{ name: '_PageVisited' }])
      mockApi().post('/actions/_PageVisited', {
        type: '_PageVisited',
        customFields: { foo: 'bar' }
      })
        .reply(201, {
          id: 'actionId',
          type: '_PageVisited',
          customFields: { foo: 'bar' }
        })
      const res = await actionApp.createAction('_PageVisited', { foo: 'bar' })

      expect(res.type).to.equal('_PageVisited')
      expect(res.customFields.foo).to.equal('bar')
    })

    it('should re-use previous Application User credentials', async () => {
      mockApi().get('/access').times(2)
        .reply(200, { actor: { id: 'actorId' } })
      mockApi().get('/applications/me')
        .reply(200, { id: 'applicationId' })
      mockApi().get('/users/actorId')
        .reply(200, { id: 'evrythngUser' })
      const otherActionApp = new ActionApp('actionAppApiKey')
      await otherActionApp.init()

      expect(otherActionApp.anonUser.apiKey).to.equal(actionApp.anonUser.apiKey)
    })
  })
}
