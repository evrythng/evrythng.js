const { expect } = require('chai')
const nock = require('nock')
const { getScope, mockApi } = require('../util')

module.exports = () => {
  describe('ADI Orders', () => {
    let operator, order

    before(() => {
      operator = getScope('operator')
    })

    after(() => {
      // Last use of nock right now
      nock.cleanAll()
      nock.enableNetConnect()
    })

    it('should create an ADI Order', async () => {
      const payload = {
        ids: [
          'serial1',
          'serial2'
        ],
        purchaseOrder: '234567890',
        metadata: {
          identifierKey: 'gs1:21',
          customFields: {
            factory: '0400321'
          },
          tags: [
            'factory:0400321'
          ],
          shortDomain: 'tn.gg',
          defaultRedirectUrl: 'https://evrythng.com?id={shortId}'
        },
        identifiers: {
          internalId: 'X7JF'
        },
        tags: [
          'X7JF'
        ]
      }

      mockApi()
        .post('/adis/orders', payload)
        .reply(201, Object.assign({
          id: 'UEp4rDGsnpCAF6xABbys5Amc'
        }, payload))

      order = await operator.adiOrder().create(payload)

      expect(order).to.be.an('object')
      expect(order.id).to.have.length(24)
      expect(order.metadata.identifierKey).to.equal(payload.metadata.identifierKey)
    })

    it('should read an ADI Order by ID', async () => {
      mockApi()
        .get(`/adis/orders/${order.id}`)
        .reply(200, order)

      const res = await operator.adiOrder(order.id).read()

      expect(order).to.be.an('object')
      expect(order.id).to.have.length(24)
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
        customFields: {
          internalId: 'X7JF'
        },
        tags: ['X7JF']
      }

      mockApi()
        .post(`/adis/orders/${order.id}/events`, payload)
        .reply(201, Object.assign({ id: 'UrCPgMhMMmPEY6awwEf6gKfb' }, payload))

      const res = await operator.adiOrder(order.id).event().create(payload)

      expect(res).to.be.an('object')
      expect(res.id).to.have.length(24)
      expect(res.metadata.type).to.equal(payload.metadata.type)
    })
  })
}
