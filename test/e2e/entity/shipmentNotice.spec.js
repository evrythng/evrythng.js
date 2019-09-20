const { expect } = require('chai')
const nock = require('nock')
const { getScope, mockApi } = require('../util')

const payload = {
  asnId: '2343689643',
  version: '1',
  issueDate: '2019-06-19T16:39:57-08:00',
  transportation: 'Expedited Freight',
  parties: [
    {
      id: 'gs1:414:01251',
      type: 'ship-from'
    },
    {
      name: 'The Landmark, Shop No. G14',
      type: 'ship-to',
      address: {
        street: '113-114, Central',
        city: 'Hong Kong'
      }
    }
  ],
  tags: [
    'ongoing'
  ]
}

module.exports = () => {
  describe('Shipment Notices', () => {
    let operator, shipmentNotice

    before(() => {
      operator = getScope('operator')
    })

    after(() => {
      // Last use of nock right now
      nock.cleanAll()
      nock.enableNetConnect()
    })

    it('should create a shipment notice', async () => {
      mockApi()
        .post('/shipmentNotices', payload)
        .reply(201, Object.assign({
          id: 'UEp4rDGsnpCAF6xABbys5Amc'
        }, payload))

      shipmentNotice = await operator.shipmentNotice().create(payload)

      expect(shipmentNotice).to.be.an('object')
    })

    it('should read a shipment notice', async () => {
      mockApi()
        .get(`/shipmentNotices/${shipmentNotice.id}`)
        .reply(200, shipmentNotice)

      const res = await operator.shipmentNotice(shipmentNotice.id).read()

      expect(res).to.be.an('object')
      expect(res.id).to.equal(shipmentNotice.id)
    })

    it('should update a shipment notice', async () => {
      mockApi()
        .put(`/shipmentNotices/${shipmentNotice.id}`)
        .reply(200, shipmentNotice)

      const res = await operator.shipmentNotice(shipmentNotice.id).update(shipmentNotice)

      expect(res).to.be.an('object')
      expect(res.tags).to.deep.equal(shipmentNotice.tags)
    })

    it('should delete a shipment notice', async () => {
      mockApi()
        .delete(`/shipmentNotices/${shipmentNotice.id}`)
        .reply(204)

      await operator.shipmentNotice(shipmentNotice.id).delete()
    })
  })
}
