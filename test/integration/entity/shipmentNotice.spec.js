const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

const noticePayload = {
  asnId: '2343689643',
  version: '1',
  issueDate: '2019-06-19T16:39:57-08:00',
  transportation: 'Expedited Freight',
  parties: [{
    id: 'gs1:414:01251',
    type: 'ship-from'
  }, {
    name: 'The Landmark, Shop No. G14',
    type: 'ship-to',
    address: {
      street: '113-114, Central',
      city: 'Hong Kong'
    }
  }],
  tags: ['ongoing']
}

const containerPayload = {
  containerId: '82347927',
  transportationType: 'Pallet',
  products: [{
    id: 'gs1:01:000000001234',
    quantity: 562,
    unitOfMeasure: 'piece'
  }],
  tags: ['important']
}

module.exports = () => {
  describe('Shipment Notices', () => {
    let operator

    before(() => {
      operator = getScope('operator')
    })

    it('should create a shipment notice', async () => {
      mockApi()
        .post('/shipmentNotices', noticePayload)
        .reply(201, noticePayload)

      const res = await operator.shipmentNotice().create(noticePayload)

      expect(res).to.be.an('object')
      expect(res.asnId).to.equal(noticePayload.asnId)
    })

    it('should read a shipment notice', async () => {
      mockApi()
        .get('/shipmentNotices/shipmentNoticeId')
        .reply(200, noticePayload)

      const res = await operator.shipmentNotice('shipmentNoticeId').read()

      expect(res).to.be.an('object')
      expect(res.asnId).to.equal(noticePayload.asnId)
    })

    it('should update a shipment notice', async () => {
      mockApi()
        .put('/shipmentNotices/shipmentNoticeId')
        .reply(200, noticePayload)

      const res = await operator.shipmentNotice('shipmentNoticeId').update(noticePayload)

      expect(res).to.be.an('object')
      expect(res.tags).to.deep.equal(noticePayload.tags)
    })

    it('should delete a shipment notice', async () => {
      mockApi()
        .delete('/shipmentNotices/shipmentNoticeId')
        .reply(204)

      await operator.shipmentNotice('shipmentNoticeId').delete()
    })
  })

  describe('Shipment Notice Containers', () => {
    let operator

    before(() => {
      operator = getScope('operator')
    })

    it('should create a shipment notice container', async () => {
      mockApi()
        .post('/shipmentNotices/containers', containerPayload)
        .reply(201, containerPayload)

      const res = await operator.shipmentNotice().container().create(containerPayload)

      expect(res).to.be.an('object')
      expect(res.containerId).to.equal(containerPayload.containerId)
    })

    it('should read a shipment notice container', async () => {
      mockApi()
        .get('/shipmentNotices/containers/containerId')
        .reply(200, containerPayload)

      const res = await operator.shipmentNotice().container('containerId').read()

      expect(res).to.be.an('object')
      expect(res.containerId).to.equal(containerPayload.containerId)
    })

    it('should update a shipment notice container', async () => {
      mockApi()
        .put('/shipmentNotices/containers/containerId')
        .reply(200, containerPayload)

      const res = await operator.shipmentNotice().container('containerId').update(containerPayload)

      expect(res).to.be.an('object')
      expect(res.tags).to.deep.equal(containerPayload.tags)
    })

    it('should delete a shipment notice container', async () => {
      mockApi()
        .delete('/shipmentNotices/containers/containerId')
        .reply(204)

      await operator.shipmentNotice().container('containerId').delete()
    })
  })
}
