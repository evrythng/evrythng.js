const { expect } = require('chai')
const { getScope } = require('../util')

const ACTION_TYPE = 'scans'

module.exports = (scopeType) => {
  let scope, operatorScope, action, thng

  describe('Actions', () => {
    before(async () => {
      scope = getScope(scopeType)
      operatorScope = getScope('operator')

      thng = await scope.thngs().create({ name: 'test' })
    })

    after(async () => {
      await operatorScope.thngs(thng.id).delete()
    })

    it('should create an action', async () => {
      const payload = { type: ACTION_TYPE, thng: thng.id, tags: ['foo'] }
      const res = await scope.actions(ACTION_TYPE).create(payload)

      expect(res).to.be.an('object')
      expect(res.id).to.be.a('string')
      expect(res.id).to.have.length(24)
    })

    it('should read all actions of a type', async () => {
      const res = await scope.actions(ACTION_TYPE).read()
      action = res[0]

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(0)
    })

    it('should create an aliased action', async () => {
      const res = await thng.actions(ACTION_TYPE).create({ type: ACTION_TYPE })

      expect(res).to.be.an('object')
    })

    it('should read all aliased actions', async () => {
      const res = await thng.actions(ACTION_TYPE).read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    if (scopeType === 'operator') {
      it('should read a single action', async () => {
        const res = await scope.actions(ACTION_TYPE, action.id).read()

        expect(res).to.be.an('object')
        expect(res.id).to.be.a('string')
        expect(res.id).to.equal(action.id)
      })

      it('should delete an action', async () => {
        await scope.actions(ACTION_TYPE, action.id).delete()
      })
    }
  })
}
