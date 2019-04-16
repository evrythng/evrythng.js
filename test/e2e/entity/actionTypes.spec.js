const { expect } = require('chai');

module.exports = (scope, scopeType) => {
  before(() => {
    scope = scope();
  });

  describe('Action Types', () => {
    let actionType;

    it('should read all action types', async () => {
      const res = await scope.actionType().read();

      expect(res).to.be.an('array');
      expect(res).to.have.length.gte(5);
    });

    if (['operator', 'trustedApp'].includes(scopeType)) {
      it('should create an action type', async () => {
        const payload = { name: `_actionType${Date.now()}` };
        actionType = await scope.actionType().create(payload);

        expect(actionType).to.be.an('object');
      });

      it('should read an action type', async () => {
        const res = await scope.actionType(actionType.name).read();

        expect(res).to.be.an('object');
        expect(res.name).to.equal(actionType.name);
      });
    }

    if (scopeType === 'operator') {
      it('should update an action type', async () => {
        const payload = { tags: ['updated'] };
        const res = await scope.actionType(actionType.name).update(payload);

        expect(res).to.be.an('object');
        expect(res.tags).to.deep.equal(payload.tags);
      });
    }

    if (['operator', 'trustedApp'].includes(scopeType)) {
      it('should delete an actionType', async () => {
        await scope.actionType(actionType.name).delete();
      });
    }
  });
};
