const { expect } = require('chai');
const { resources } = require('../util');

const TYPE_NAME = `_actionType${Date.now()}`;

module.exports = (scope, isOperator) => {
  before(() => {
    scope = scope();
  });

  describe('Action Types', () => {
    it('should read all action types', async () => {
      const res = await scope.actionType().read();

      expect(res).to.be.an('array');
      expect(res).to.have.length.gte(5);
    });

    if (isOperator) {
      it('should create an action type', async () => {
        const payload = { name: TYPE_NAME };
        resources.actionType = await scope.actionType().create(payload);

        expect(resources.actionType).to.be.an('object');
      });

      it('should read an action type', async () => {
        const res = await scope.actionType(resources.actionType.name).read();

        expect(res).to.be.an('object');
        expect(res.name).to.equal(resources.actionType.name);
      });

      it('should update an action type', async () => {
        const payload = { tags: ['updated'] };
        const res = await scope.actionType(resources.actionType.name).update(payload);

        expect(res).to.be.an('object');
        expect(res.tags).to.deep.equal(payload.tags);
      });

      it('should delete an actionType', async () => {
        await scope.actionType(resources.actionType.name).delete();
      });
    }
  });
};
