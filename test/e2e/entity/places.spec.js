const { expect } = require('chai');
const { resources } = require('../util');

module.exports = (scope, isOperator) => {
  before(() => {
    scope = scope();
  });
  
  describe('Places', () => {
    if (isOperator) {
      it('should create a place', async () => {
        const payload = {
          name: 'Test Place',
          customFields: {
            color: 'red',
            serial: Date.now(),
          },
        };
        
        resources.place = await scope.place().create(payload);

        expect(resources.place).to.be.an('object');
        expect(resources.place.customFields).to.deep.equal(payload.customFields);
      });

      it('should read a place', async () => {
        const res = await scope.place(resources.place.id).read();

        expect(res).to.be.an('object');
        expect(res.id).to.equal(resources.place.id);
      });

      it('should update a place', async () => {
        const payload = { tags: ['updated'] };
        const res = await scope.place(resources.place.id).update(payload);
        
        expect(res).to.be.an('object');
        expect(res.tags).to.deep.equal(payload.tags);
      });
    }

    it('should read all places', async () => {
      const res = await scope.place().read();

      expect(res).to.be.an('array');
      expect(res).to.have.length.gte(0);
    });

    if (isOperator) {
      it('should delete a place', async () => {
        await scope.place(resources.place.id).delete();
      });
    }
  });
};
