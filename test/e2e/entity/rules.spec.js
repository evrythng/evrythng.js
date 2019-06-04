const { expect } = require('chai')
const { getScope } = require('../util')

module.exports = () => {
  describe('Rules', () => {
    let operator

    before(() => {
      operator = getScope('operator')
    })

    it('should add a rule resource', async () => {
      expect(operator.rule).to.be.a('function')
    })

    it('should run a given rule');
  })
}
