const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

const payload = {
  id: `${Date.now()}`,
  status: 'open',
  type: 'stand-alone',
  description: 'A purchase order for 100 items',
  issueDate: '2019-09-13',
  parties: [
    { id: 'gs1:414:943234', type: 'supplier' },
    { id: 'gs1:414:01251', type: 'ship-from' },
    { id: 'gs1:414:NA0193', type: 'ship-to' }
  ],
  lines: [
    {
      id: '00010',
      quantity: 100,
      product: 'gs1:01:00000123456789',
      exportDate: '2019-02-17',
      deliveryDate: '2019-02-20'
    }
  ]
}

module.exports = (scopeType, url) => {
  describe('Purchase Orders', () => {
    let scope, api

    before(() => {
      scope = getScope(scopeType)
      api = mockApi(url)
    })

    it('should read all purchase orders', async () => {
      api.get('/purchaseOrders').reply(200, [payload])

      const res = await scope.purchaseOrder().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    if (scopeType === 'operator') {
      it('should create a purchase order', async () => {
        api.post('/purchaseOrders', payload).reply(201, payload)

        const res = await scope.purchaseOrder().create(payload)

        expect(res).to.be.an('object')
      })

      it('should read a purchase order', async () => {
        api.get('/purchaseOrders/purchaseOrderId').reply(200, payload)

        const res = await scope.purchaseOrder('purchaseOrderId').read()

        expect(res).to.be.an('object')
        expect(res.id).to.equal(payload.id)
      })

      it('should update a purchase order', async () => {
        api.put('/purchaseOrders/purchaseOrderId', payload).reply(200, payload)

        const res = await scope.purchaseOrder('purchaseOrderId').update(payload)

        expect(res).to.be.an('object')
        expect(res.tags).to.deep.equal(payload.tags)
      })

      it('should delete a purchaseOrder', async () => {
        api.delete('/purchaseOrders/purchaseOrderId').reply(204)

        const res = await scope.purchaseOrder('purchaseOrderId').delete()

        expect(res).to.not.exist
      })
    }
  })
}
