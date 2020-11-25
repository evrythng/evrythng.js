const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType, url) => {
  describe('Products', () => {
    let scope, api

    before(() => {
      scope = getScope(scopeType)
      api = mockApi(url)
    })

    it('should create a product', async () => {
      const payload = { name: 'Test Product' }
      api.post('/products', payload)
        .reply(201, payload)
      const res = await scope.product().create(payload)

      expect(res).to.be.an('object')
      expect(res.name).to.equal(payload.name)
    })

    it('should read a product', async () => {
      api.get('/products/productId')
        .reply(200, { id: 'productId' })
      const res = await scope.product('productId').read()

      expect(res).to.be.an('object')
      expect(res.id).to.equal('productId')
    })

    it('should read all products', async () => {
      api.get('/products')
        .reply(200, [{ id: 'productId' }])
      const res = await scope.product().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should update a product', async () => {
      const payload = { tags: ['updated'] }
      api.put('/products/productId', payload)
        .reply(200, payload)
      const res = await scope.product('productId').update(payload)

      expect(res).to.be.an('object')
      expect(res.tags).to.deep.equal(['updated'])
    })

    if (['operator', 'trustedApp'].includes(scopeType)) {
      it('should delete a product', async () => {
        api.delete('/products/productId')
          .reply(200)
        await scope.product('productId').delete()
      })
    }
  })
}
