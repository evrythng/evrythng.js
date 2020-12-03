const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = () => {
  describe('Operator', () => {
    let operator

    before(() => {
      operator = getScope('operator')
    })

    it('should read Operator resource', async () => {
      expect(operator.id).to.equal('operatorId')
      expect(operator.email).to.equal('test.user@evrythng.com')
      expect(operator.firstName).to.equal('Test')
      expect(operator.lastName).to.equal('User')
    })

    it('should allow self-same Operator update', async () => {
      mockApi().put('/operators/operatorId')
        .reply(200, {
          customFields: { foo: 'bar' }
        })
      const res = await operator.update({
        customFields: {
          foo: 'bar'
        }
      })

      // Response should be accurate of new state
      expect(res).to.be.an('object')
      expect(res.customFields.foo).to.equal('bar')

      // Operator should have updated state
      expect(operator.customFields.foo).to.equal('bar')
    })
  })
}
