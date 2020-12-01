const { expect } = require('chai')
const { getScope, mockApi } = require('../util')
const evrythng = require('../../../')

const TestPlugin = {
  install: (api) => {
    // Extend the Operator scope API
    api.scopes.Operator.prototype.getFoo = () => 'foo'

    // Add functionality to a Thng
    api.entities.Thng.prototype.getSummary = function () {
      return `${this.name} (${this.id})`
    }
  }
}

module.exports = (scopeType, url) => {
  describe('use', () => {
    let scope, api, thng

    before(async () => {
      scope = getScope(scopeType)
      api = mockApi(url);

      const payload = { name: 'test' }
      api.post('/thngs', payload)
        .reply(201, payload)
      thng = await scope.thng().create(payload)
    })

    it('should not throw when installing a plugin', async () => {
      evrythng.use(TestPlugin)
    })

    it('should extend a scope with a new method', async () => {
      expect(evrythng.Operator.prototype.getFoo).to.be.a('function')
      expect(scope.getFoo).to.be.a('function')
      expect(scope.getFoo()).to.equal('foo')
    })

    it('should expect an entity with a new method', async () => {
      const expected = `${thng.name} (${thng.id})`
      expect(thng.getSummary).to.be.a('function')
      expect(thng.getSummary()).to.equal(expected)
    })
  })
}
