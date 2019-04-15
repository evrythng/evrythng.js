const { expect } = require('chai');
const { resources } = require('../util');

module.exports = (scope, isOperator) => {
  before(() => {
    scope = scope();
  });
  
  describe('Products', () => {
    it('should create a product', async () => {
      const payload = {
        name: 'Test Product',
        customFields: {
          color: 'red',
          serial: Date.now(),
        },
      };
      
      resources.product = await scope.product().create(payload);

      expect(resources.product).to.be.an('object');
      expect(resources.product.customFields).to.deep.equal(payload.customFields);
    });

    it('should read a product', async () => {
      const res = await scope.product(resources.product.id).read();

      expect(res).to.be.an('object');
      expect(res.id).to.equal(resources.product.id);
    });

    it('should read all products', async () => {
      const res = await scope.product().read();

      expect(res).to.be.an('array');
      expect(res).to.have.length.gte(1);
    });

    it('should update a product', async () => {
      const payload = { tags: ['updated'] };
      const res = await scope.product(resources.product.id).update(payload);
      
      expect(res).to.be.an('object');
      expect(res.tags).to.deep.equal(payload.tags);
    });

    if (isOperator) {
      it('should delete a product', async () => {
        await scope.product(resources.product.id).delete();
      });
    }
  });
};