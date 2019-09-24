const { expect } = require('chai')
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
    let operator

    before(() => {
      operator = getScope('operator')
    })

    it('should create a shipment notice', async () => {
      mockApi()
        .post('/shipmentNotices', payload)
        .reply(201, payload)

      const res = await operator.shipmentNotice().create(payload)

      expect(res).to.be.an('object')
      expect(res.asnId).to.equal(payload.asnId)
    })

    it('should read a shipment notice', async () => {
      mockApi()
        .get('/shipmentNotices/shipmentNoticeId')
        .reply(200, payload)

      const res = await operator.shipmentNotice('shipmentNoticeId').read()

      expect(res).to.be.an('object')
      expect(res.asnId).to.equal(payload.asnId)
    })

    it('should update a shipment notice', async () => {
      mockApi()
        .put('/shipmentNotices/shipmentNoticeId')
        .reply(200, payload)

      const res = await operator.shipmentNotice('shipmentNoticeId').update(payload)

      expect(res).to.be.an('object')
      expect(res.tags).to.deep.equal(payload.tags)
    })

    it('should delete a shipment notice', async () => {
      mockApi()
        .delete('/shipmentNotices/shipmentNoticeId')
        .reply(204)

      await operator.shipmentNotice('shipmentNoticeId').delete()
    })
  })
}
