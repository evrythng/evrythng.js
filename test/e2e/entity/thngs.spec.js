const { expect } = require('chai');
const { resources } = require('../util');

module.exports = (scope, scopeType) => {
  before(() => {
    scope = scope();
  });

  describe('Thngs', () => {
    it('should create a Thng', async () => {
      const payload = {
        name: 'Test Thng',
        customFields: {
          color: 'red',
          serial: Date.now(),
        },
      };
      
      resources.thng = await scope.thng().create(payload);

      expect(resources.thng).to.be.an('object');
      expect(resources.thng.customFields).to.deep.equal(payload.customFields);
    });

    it('should read a Thng', async () => {
      const res = await scope.thng(resources.thng.id).read();

      expect(res).to.be.an('object');
      expect(res.id).to.equal(resources.thng.id);
    });

    it('should read all Thngs', async () => {
      const res = await scope.thng().read();

      expect(res).to.be.an('array');
      expect(res).to.have.length.gte(1);
    });

    it('should update a Thng', async () => {
      const payload = { tags: ['updated'] };
      const res = await scope.thng(resources.thng.id).update(payload);
      
      expect(res).to.be.an('object');
      expect(res.tags).to.deep.equal(payload.tags);
    });

    if (['operator', 'trustedApp'].includes(scopeType)) {
      it('should delete a Thng', async () => {
        await scope.thng(resources.thng.id).delete();
      });
    }
  });
};
