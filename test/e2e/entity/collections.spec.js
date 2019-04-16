const { expect } = require('chai');
const { resources, getScope } = require('../util');

module.exports = (scopeType) => {
  describe('Collections', () => {
    let scope;
    
    before(() => {
      scope = getScope(scopeType);
    });

    it('should create a collection', async () => {
      const payload = {
        name: 'Test Collection',
        customFields: {
          color: 'red',
          serial: Date.now(),
        },
      };
      
      resources.collection = await scope.collection().create(payload);

      expect(resources.collection).to.be.an('object');
      expect(resources.collection.customFields).to.deep.equal(payload.customFields);
    });

    it('should read a collection', async () => {
      const res = await scope.collection(resources.collection.id).read();

      expect(res).to.be.an('object');
      expect(res.id).to.equal(resources.collection.id);
    });

    it('should read all collections', async () => {
      const res = await scope.collection().read();

      expect(res).to.be.an('array');
      expect(res).to.have.length.gte(1);
    });

    it('should update a collection', async () => {
      const payload = { tags: ['updated'] };
      const res = await scope.collection(resources.collection.id).update(payload);
      
      expect(res).to.be.an('object');
      expect(res.tags).to.deep.equal(payload.tags);
    });

    if (['operator', 'trustedApp'].includes(scopeType)) {
      it('should delete a collection', async () => {
        await scope.collection(resources.collection.id).delete();
      });
    }
  });
};
