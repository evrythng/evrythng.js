const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType) => {
  describe('Products', () => {
    let scope

    before(() => {
      scope = getScope(scopeType)
    })

    it('should create a product', async () => {
      const payload = { name: 'Test Product' }
      mockApi().post('/products', payload).reply(201, payload)
      const res = await scope.product().create(payload)

      expect(res).to.be.an('object')
      expect(res.name).to.equal(payload.name)
    })

    it('should read a product', async () => {
      mockApi().get('/products/productId').reply(200, { id: 'productId' })
      const res = await scope.product('productId').read()

      expect(res).to.be.an('object')
      expect(res.id).to.equal('productId')
    })

    it('should read all products', async () => {
      mockApi()
        .get('/products')
        .reply(200, [{ id: 'productId' }])
      const res = await scope.product().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should update a product', async () => {
      const payload = { tags: ['updated'] }
      mockApi().put('/products/productId', payload).reply(200, payload)
      const res = await scope.product('productId').update(payload)

      expect(res).to.be.an('object')
      expect(res.tags).to.deep.equal(['updated'])
    })

    if (['operator', 'trustedApp'].includes(scopeType)) {
      it('should delete a product', async () => {
        mockApi().delete('/products/productId').reply(200)
        await scope.product('productId').delete()
      })
    }
  })
}
