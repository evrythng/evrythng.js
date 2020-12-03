const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (url) => {
  describe('Operator', () => {
    let operator, api

    before(() => {
      operator = getScope('operator')
      api = mockApi(url)
    })

    it('should allow self-same Operator update', async () => {
      api.put('/operators/operatorId').reply(200, {})
      const res = await operator.update({
        customFields: {
          foo: 'bar'
        }
      })

      expect(res).to.be.an('object')
    })
  })
}
