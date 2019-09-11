const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = () => {
  describe('Device', () => {
    let device

    before(() => {
      device = getScope('device')
    })

    it('should represent a Thng', async () => {
      mockApi().get('/thngs/deviceThngId')
        .reply(200, { id: 'deviceThngId', apiKey: 'apiKey' })
      const res = await device.init()

      expect(res).to.be.an('object')
      expect(res.apiKey).to.be.a('string')
    })
  })
}
