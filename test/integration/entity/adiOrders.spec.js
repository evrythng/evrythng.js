const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType, url) => {
  describe('ADI Orders', () => {
    let scope, api

    before(() => {
      scope = getScope(scopeType)
      api = mockApi(url)
    })

    it('should create an ADI Order', async () => {
      const payload = {
        ids: ['serial1', 'serial2'],
        purchaseOrder: '234567890',
        metadata: {
          identifierKey: 'gs1:21',
          customFields: { factory: '0400321' },
          tags: ['factory:0400321'],
          shortDomain: 'tn.gg',
          defaultRedirectUrl: 'https://evrythng.com?id={shortId}'
        },
        identifiers: { internalId: 'X7JF' },
        tags: ['X7JF']
      }

      api.post('/adis/orders', payload).reply(201, { id: 'UEp4rDGsnpCAF6xABbys5Amc' })
      const res = await scope.adiOrder().create(payload)

      expect(res).to.be.an('object')
      expect(res.id).to.have.length(24)
    })

    it('should read an ADI Order by ID', async () => {
      api.get('/adis/orders/adiOrderId').reply(200, { id: 'adiOrderId' })
      const res = await scope.adiOrder('adiOrderId').read()

      expect(res).to.be.an('object')
      expect(res.id).to.be.a('string')
    })

    it('should create an ADI Order event', async () => {
      const payload = {
        metadata: {
          type: 'encodings',
          tags: ['example']
        },
        ids: ['serial1', 'serial2'],
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
