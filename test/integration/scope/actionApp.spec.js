const { expect } = require('chai')
const { mockApi } = require('../util')
const { ActionApp } = require('../../../')

// Mocks
global.localStorage = {
  data: {},
  getItem: (key) => global.localStorage.data[key],
  setItem: (key, value) => {
    global.localStorage.data[key] = value
  }
}
global.window = {
  location: { href: 'mocha test location' }
}

module.exports = (url) => {
  describe('ActionApp', () => {
    let actionApp, api

    before(async () => {
      api = mockApi(url)
      api
        .get('/access')
        .times(2)
        .reply(200, { actor: { id: 'actorId' } })
      api.get('/applications/me').reply(200, { id: 'applicationId' })
      api.post('/auth/evrythng/users?anonymous=true').reply(201, {
        evrythngApiKey:
          '12341234123412341234123412341234123412341234123412341234123412341234123412341234'
      })
      api.get('/users/actorId').reply(200, { id: 'U5FfSmUtQt4emDwaR3hw2tfc' })

      actionApp = new ActionApp('actionAppApiKey')
      await actionApp.init()
    })

    it('should export helper functions', async () => {
      expect(actionApp.pageVisited).to.be.a('function')
      expect(actionApp.createAction).to.be.a('function')
      expect(actionApp.getAnonymousUser).to.be.a('function')
    })

    it("should create a '_PageVisited' action with pageVisited()", async () => {
      api.get('/actions?filter=name%3D_PageVisited').reply(200, [{ name: '_PageVisited' }])
      api
        .post('/actions/_PageVisited', {
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
      api.get('/actions?filter=name%3D_PageVisited').reply(200, [{ name: '_PageVisited' }])
      api
        .post('/actions/_PageVisited', {
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

    it('should provide access to the underlying anonymous Application User', async () => {
      const anonUser = await actionApp.getAnonymousUser()

      expect(anonUser.id).to.be.a('string')
      expect(anonUser.id).to.have.length(24)
      expect(anonUser.apiKey).to.be.a('string')
      expect(anonUser.apiKey).to.have.length(80)
    })

    it('should create a scans action with a Thng specified', async () => {
      const thng = 'UKYDHeYCQbgDppRwRkHVMHhg'
      api
        .post('/actions/scans', {
          type: 'scans',
          customFields: { foo: 'bar' },
          thng
        })
        .reply(201, {
          id: 'actionId',
          type: 'scans',
          thng,
          customFields: { foo: 'bar' }
        })

      const res = await actionApp.createAction('scans', { thng, foo: 'bar' })

      expect(res.type).to.equal('scans')
      expect(res.customFields.foo).to.equal('bar')
      expect(res.thng).to.equal('UKYDHeYCQbgDppRwRkHVMHhg')
    })

    it('should create a scans action with a product specified', async () => {
      const product = 'UKYDHeYCQbgDppRwRkHVMHhg'
      api
        .post('/actions/scans', {
          type: 'scans',
          customFields: { foo: 'bar' },
          product
        })
        .reply(201, {
          id: 'actionId',
          type: 'scans',
          product,
          customFields: { foo: 'bar' }
        })

      const res = await actionApp.createAction('scans', { product, foo: 'bar' })

      expect(res.type).to.equal('scans')
      expect(res.customFields.foo).to.equal('bar')
      expect(res.product).to.equal('UKYDHeYCQbgDppRwRkHVMHhg')
    })

    it('should re-use previous Application User credentials', async () => {
      api
        .get('/access')
        .times(2)
        .reply(200, { actor: { id: 'actorId' } })
      api.get('/applications/me').reply(200, { id: 'applicationId' })
      api.get('/users/actorId').reply(200, { id: 'U5FfSmUtQt4emDwaR3hw2tfc' })
      const otherActionApp = new ActionApp('actionAppApiKey')
      await otherActionApp.init()

      expect(otherActionApp.anonUser.apiKey).to.equal(actionApp.anonUser.apiKey)
    })
  })
}
