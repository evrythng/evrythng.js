const { expect } = require('chai')
const { getScope } = require('../util')
const { ActionApp } = require('evrythng')

const PAGE_VISITED = '_PageVisited'

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
    let operator, application, actionApp

    before(async () => {
      application = getScope('application')
      operator = getScope('operator')
      await operator.actionType().setProject(application.project).create({ name: PAGE_VISITED })

      actionApp = new ActionApp(application.appApiKey)
      await actionApp.init()
    })

    after(async () => {
      await operator.actionType(PAGE_VISITED).delete()
    })

    it('should export helper functions', async () => {
      expect(actionApp.pageVisited).to.be.a('function')
      expect(actionApp.createAction).to.be.a('function')
    })

    it('should create a _PageVisited action with pageVisited()', async () => {
      const res = await actionApp.pageVisited()

      expect(res.id).to.have.length(24)
      expect(res.type).to.equal(PAGE_VISITED)
      expect(res.customFields.url).to.equal(global.window.location.href)
    })

    it('should create an action with custom data', async () => {
      const res = await actionApp.createAction(PAGE_VISITED, { foo: 'bar' })

      expect(res.type).to.equal(PAGE_VISITED)
      expect(res.customFields.foo).to.equal('bar')
    })

    it('should re-use previous Application User credentials', async () => {
      const otherActionApp = new ActionApp(application.appApiKey)
      await otherActionApp.init()

      expect(otherActionApp.anonUser.apiKey).to.equal(actionApp.anonUser.apiKey)
    })
  })
}
