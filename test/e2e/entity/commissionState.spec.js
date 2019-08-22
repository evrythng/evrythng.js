const { expect } = require('chai')
const { getScope } = require('../util')

const thngTemplate = {
  name: 'test',
  identifiers: {
    'gs1:21': '23984736'
  }
}

module.exports = (scopeType) => {
  let scope, thng

  describe('Commission State', () => {
    before(async () => {
      scope = getScope(scopeType)
      thng = await scope.thng().create(thngTemplate)
    })

    after(async () => {
      const operator = getScope('operator')
      await operator.thng(thng.id).delete()
    })

    it('should read a Thng\'s commissioning state', async () => {
      const thngIdentifier = `gs1:21:${thngTemplate.identifiers['gs1:21']}`
      const res = await scope.thng(thngIdentifier).commissionState().read()

      expect(res).to.be.an('object')
      expect(res.state).to.equal('not_commissioned')
    })
  })
}
