const { expect } = require('chai')
const { getScope, mockApi } = require('../util')
const evrythng = require('../../../')

module.exports = (scopeType, url) => {
  describe('alias', () => {
    let scope, api

    before(() => {
      scope = getScope(scopeType)
      api = mockApi(url)
    })

    it("should alias 'product' to 'sku' for Operator scope", async () => {
      evrythng.alias({ product: 'sku' }, 'Operator')

      expect(scope.sku).to.be.a('function')
    })

    it("should use the alias to read all 'sku's", async () => {
      api.get('/products').reply(200, [{ id: 'productId' }])
      const skus = await scope.sku().read()

      expect(skus).to.be.an('array')
      expect(skus).to.have.length.gte(0)
    })

    it("should use the alias to create a 'sku'", async () => {
      const payload = { name: 'Example SKU' }
      api.post('/products', payload).reply(200, { id: 'productId' })
      const res = await scope.sku().create(payload)

      expect(res).to.be.an('object')
      expect(res.id).to.be.a('string')
    })

    it("should use the alias to read a 'sku'", async () => {
      api.get('/products/productId').reply(200, { id: 'productId' })
      const res = await scope.sku('productId').read()

      expect(res).to.be.an('object')
      expect(res.id).to.equal('productId')
    })

    it("should use the alias to update a 'sku'", async () => {
      const payload = { tags: ['updated'] }
      api.put('/products/productId', payload).reply(200, { id: 'productId' })
      const res = await scope.sku('productId').update(payload)

      expect(res).to.be.an('object')
      expect(res.id).to.equal('productId')
    })

    it("should use the alias to delete a 'sku'", async () => {
      api.delete('/products/productId').reply(200)
      await scope.sku('productId').delete()
    })
  })
}
