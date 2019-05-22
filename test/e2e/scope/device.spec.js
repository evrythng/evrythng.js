const { expect } = require('chai')
const { getScope } = require('../util')

module.exports = () => {
  describe('Device', () => {
    let device

    before(() => {
      device = getScope('device')
    })

    it('should represent a Thng', async () => {
      const res = await device.init()

      expect(res).to.be.an('object')
      expect(res.id).to.have.length(24)
      expect(res.apiKey).to.have.length(80)
    })
  })
}
