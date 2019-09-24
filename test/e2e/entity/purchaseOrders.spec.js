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

module.exports = (scopeType) => {
  describe('Purchase Orders', () => {
    let scope

    before(() => {
      scope = getScope(scopeType)
    })

    it('should read all purchase orders', async () => {
      mockApi().get('/purchaseOrders')
        .reply(200, [payload])

      const res = await scope.purchaseOrder().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    if (scopeType === 'operator') {
      it('should create a purchase order', async () => {
        mockApi().post('/purchaseOrders', payload)
          .reply(201, payload)

        const res = await scope.purchaseOrder().create(payload)

        expect(res).to.be.an('object')
      })

      it('should read a purchase order', async () => {
        mockApi().get('/purchaseOrders/purchaseOrderId')
          .reply(200, payload)

        const res = await scope.purchaseOrder('purchaseOrderId').read()

        expect(res).to.be.an('object')
        expect(res.id).to.equal(payload.id)
      })

      it('should update a purchase order', async () => {
        mockApi().put('/purchaseOrders/purchaseOrderId', payload)
          .reply(200, payload)

        const res = await scope.purchaseOrder('purchaseOrderId').update(payload)

        expect(res).to.be.an('object')
        expect(res.tags).to.deep.equal(payload.tags)
      })

      it('should delete a purchaseOrder', async () => {
        mockApi().delete('/purchaseOrders/purchaseOrderId')
          .reply(204)

        await scope.purchaseOrder('purchaseOrderId').delete()
      })
    }
  })
}
