const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (url) => {
  describe('Device', () => {
    let device, api

    before(() => {
      device = getScope('device')
      api = mockApi(url)
    })

    it('should represent a Thng', async () => {
      api.get('/thngs/deviceThngId').reply(200, { id: 'deviceThngId', apiKey: 'apiKey' })
      const res = await device.init()

      expect(res).to.be.an('object')
      expect(res.apiKey).to.be.a('string')
    })
  })
}
