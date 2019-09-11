const { expect } = require('chai')
const { getScope, mockApi } = require('../util')
const evrythng = require('evrythng')

module.exports = () => {
  describe('alias', () => {
    let operator

    before(() => {
      operator = getScope('operator')
    })

    it('should alias \'product\' to \'sku\' for Operator scope', async () => {
      evrythng.alias({ product: 'sku' }, 'Operator')

      expect(operator.sku).to.be.a('function')
    })

    it('should use the alias to read all \'sku\'s', async () => {
      mockApi().get('/products')
        .reply(200, [{ id: 'productId' }])
      const skus = await operator.sku().read()

      expect(skus).to.be.an('array')
      expect(skus).to.have.length.gte(0)
    })

    it('should use the alias to create a \'sku\'', async () => {
      const payload = { name: 'Example SKU' }
      mockApi().post('/products', payload)
        .reply(200, { id: 'productId' })
      const res = await operator.sku().create(payload)

      expect(res).to.be.an('object')
      expect(res.id).to.be.a('string')
    })

    it('should use the alias to read a \'sku\'', async () => {
      mockApi().get('/products/productId')
        .reply(200, { id: 'productId' })
      const res = await operator.sku('productId').read()

      expect(res).to.be.an('object')
      expect(res.id).to.equal('productId')
    })

    it('should use the alias to update a \'sku\'', async () => {
      const payload = { tags: ['updated'] }
      mockApi().put('/products/productId', payload)
        .reply(200, { id: 'productId' })
      const res = await operator.sku('productId').update(payload)

      expect(res).to.be.an('object')
      expect(res.id).to.equal('productId')
    })

    it('should use the alias to delete a \'sku\'', async () => {
      mockApi().delete('/products/productId')
        .reply(200)
      await operator.sku('productId').delete()
    })
  })
}
