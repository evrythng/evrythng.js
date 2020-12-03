const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = () => {
  describe('Operator', () => {
    let operator

    before(() => {
      operator = getScope('operator')
    })

    it('should allow self-same Operator update', async () => {
      mockApi().put('/operators/operatorId').reply(200, {})
      const res = await operator.update({
        customFields: {
          foo: 'bar'
        }
      })

      expect(res).to.be.an('object')
    })
  })
}
