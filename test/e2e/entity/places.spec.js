const { expect } = require('chai');

module.exports = (scope, scopeType) => {
  before(() => {
    scope = scope();
  });
  
  describe('Places', () => {
    let place;

    it('should read all places', async () => {
      const res = await scope.place().read();

      expect(res).to.be.an('array');
      expect(res).to.have.length.gte(0);
    });

    if (['operator', 'trustedApp'].includes(scopeType)) {
      it('should create a place', async () => {
        const payload = {
          name: 'Test Place',
          customFields: {
            color: 'red',
            serial: Date.now(),
          },
        };
        
        place = await scope.place().create(payload);

        expect(place).to.be.an('object');
        expect(place.customFields).to.deep.equal(payload.customFields);
      });

      it('should read a place', async () => {
        const res = await scope.place(place.id).read();

        expect(res).to.be.an('object');
        expect(res.id).to.equal(place.id);
      });

      it('should update a place', async () => {
        const payload = { tags: ['updated'] };
        const res = await scope.place(place.id).update(payload);
        
        expect(res).to.be.an('object');
        expect(res.tags).to.deep.equal(payload.tags);
      });

      it('should delete a place', async () => {
        await scope.place(place.id).delete();
      });
    }
  });
};
