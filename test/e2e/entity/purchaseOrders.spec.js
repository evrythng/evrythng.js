const { expect } = require('chai')
const { getScope } = require('../util')

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
    let scope, purchaseOrder

    before(() => {
      scope = getScope(scopeType)
    })

    it('should read all purchase orders', async () => {
      const res = await scope.purchaseOrder().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    if (scopeType === 'operator') {
      it('should create a purchase order', async () => {
        purchaseOrder = await scope.purchaseOrder().create(payload)

        expect(purchaseOrder).to.be.an('object')
      })

      it('should read a purchase order', async () => {
        const res = await scope.purchaseOrder(purchaseOrder.id).read()

        expect(res).to.be.an('object')
        expect(res.id).to.equal(purchaseOrder.id)
      })

      it('should update a purchase order', async () => {
        payload.lines[0].quantity = 150
        const res = await scope.purchaseOrder(purchaseOrder.id).update(payload)

        expect(res).to.be.an('object')
        expect(res.tags).to.deep.equal(payload.tags)
      })

      it('should delete a purchaseOrder', async () => {
        await scope.purchaseOrder(purchaseOrder.id).delete()
      })
    }
  })
}
