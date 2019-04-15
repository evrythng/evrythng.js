const { expect } = require('chai');

const TYPE_NAME = `_actionType${Date.now()}`;

module.exports = (scope, isOperator) => {
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

    if (isOperator) {
      it('should create an action type', async () => {
        const payload = { name: TYPE_NAME };
        actionType = await scope.actionType().create(payload);

        expect(actionType).to.be.an('object');
      });

      it('should read an action type', async () => {
        const res = await scope.actionType(actionType.name).read();

        expect(res).to.be.an('object');
        expect(res.name).to.equal(actionType.name);
      });

      it('should update an action type', async () => {
        const payload = { tags: ['updated'] };
        const res = await scope.actionType(actionType.name).update(payload);

        expect(res).to.be.an('object');
        expect(res.tags).to.deep.equal(payload.tags);
      });

      it('should delete an actionType', async () => {
        await scope.actionType(actionType.name).delete();
      });
    }
  });
};
