const { expect } = require('chai')
const nock = require('nock')
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
    let operator, container

    before(() => {
      operator = getScope('operator')
    })

    after(() => {
      // Last use of nock right now
      nock.cleanAll()
      nock.enableNetConnect()
    })

    it('should create a shipment notice container', async () => {
      mockApi()
        .post('/shipmentNotices/containers', payload)
        .reply(201, payload)

      container = await operator.shipmentNoticeContainer().create(payload)

      expect(container).to.be.an('object')
    })

    it('should read a shipment notice container', async () => {
      mockApi()
        .get(`/shipmentNotices/containers/${container.containerId}`)
        .reply(200, container)

      const res = await operator.shipmentNoticeContainer(container.containerId).read()

      expect(res).to.be.an('object')
      expect(res.containerId).to.equal(container.containerId)
    })

    it('should update a shipment notice container', async () => {
      mockApi()
        .put(`/shipmentNotices/containers/${container.containerId}`)
        .reply(200, container)

      const res = await operator.shipmentNoticeContainer(container.containerId).update(container)

      expect(res).to.be.an('object')
      expect(res.tags).to.deep.equal(container.tags)
    })

    it('should delete a shipment notice container', async () => {
      mockApi()
        .delete(`/shipmentNotices/containers/${container.containerId}`)
        .reply(204)

      await operator.shipmentNoticeContainer(container.containerId).delete()
    })
  })
}
