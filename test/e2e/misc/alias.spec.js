const { expect } = require('chai')
const { resources, getScope } = require('../util')
const evrythng = require('evrythng')

module.exports = (scopeType) => {
  describe('alias', () => {
    let operator, sku

    before(() => {
      operator = getScope('operator')
    })

    it('should alias \'product\' to \'sku\' for Operator scope', async () => {
      evrythng.alias({ product: 'sku' }, 'Operator')

      expect(operator.sku).to.be.a('function')
    })

    it('should use the alias to read all \'sku\'s', async () => {
      const skus = await operator.sku().read()

      expect(skus).to.be.an('array')
      expect(skus).to.have.length.gte(0)
    })

    it('should use the alias to create a \'sku\'', async () => {
      const payload = { name: 'Example SKU' }
      sku = await operator.sku().create(payload)

      expect(sku).to.be.an('object')
      expect(sku.id).to.have.length(24)
      expect(sku.name).to.equal(payload.name)
    })

    it('should use the alias to read a \'sku\'', async () => {
      const res = await operator.sku(sku.id).read()

      expect(res).to.be.an('object')
      expect(res.id).to.equal(sku.id)
      expect(res.name).to.equal(sku.name)
    })

    it('should use the alias to update a \'sku\'', async () => {
      const payload = { tags: ['updated'] }
      const res = await operator.sku(sku.id).update(payload)

      expect(res).to.be.an('object')
      expect(res.id).to.equal(sku.id)
      expect(res.tags).to.deep.equal(payload.tags)
    })

    it('should use the alias to delete a \'sku\'', async () => {
      await operator.sku(sku.id).delete()
    })
  })
}
