const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

const payload = {
  containerId: '82347927',
  transportationType: 'Pallet',
  products: [
    {
      id: 'gs1:01:000000001234',
      quantity: 562,
      unitOfMeasure: 'piece'
    }
  ],
  tags: [
    'important'
  ]
}

module.exports = () => {
  describe('Shipment Notice Containers', () => {
    let operator

    before(() => {
      operator = getScope('operator')
    })

    it('should create a shipment notice container', async () => {
      mockApi()
        .post('/shipmentNotices/containers', payload)
        .reply(201, payload)

      const res = await operator.shipmentNoticeContainer().create(payload)

      expect(res).to.be.an('object')
      expect(res.containerId).to.equal(payload.containerId)
    })

    it('should read a shipment notice container', async () => {
      mockApi()
        .get('/shipmentNotices/containers/containerId')
        .reply(200, payload)

      const res = await operator.shipmentNoticeContainer('containerId').read()

      expect(res).to.be.an('object')
      expect(res.containerId).to.equal(payload.containerId)
    })

    it('should update a shipment notice container', async () => {
      mockApi()
        .put('/shipmentNotices/containers/containerId')
        .reply(200, payload)

      const res = await operator.shipmentNoticeContainer('containerId').update(payload)

      expect(res).to.be.an('object')
      expect(res.tags).to.deep.equal(payload.tags)
    })

    it('should delete a shipment notice container', async () => {
      mockApi()
        .delete('/shipmentNotices/containers/containerId')
        .reply(204)

      await operator.shipmentNoticeContainer('containerId').delete()
    })
  })
}
