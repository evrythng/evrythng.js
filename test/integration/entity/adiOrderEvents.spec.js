const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType, url) => {
  describe('ADI Orders', () => {
    let scope, api

    before(() => {
      scope = getScope(scopeType)
      api = mockApi(url)
    })

    it('should create an ADI Order event', async () => {
      const payload = {
        metadata: {
          type: 'encodings',
          tags: ['example']
        },
        ids: [
          'serial1',
          'serial2'
        ],
        customFields: { internalId: 'X7JF' },
        tags: ['X7JF']
      }

      api
        .post('/adis/orders/adiOrderId/events', payload)
        .reply(201, { id: 'UrCPgMhMMmPEY6awwEf6gKfb' })
      const res = await scope.adiOrder('adiOrderId').event().create(payload)

      expect(res).to.be.an('object')
      expect(res.id).to.be.a('string')
    })
  })
}
