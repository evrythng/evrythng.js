const { expect } = require('chai');

module.exports = (scope, isOperator, operatorScope) => {
  let actionType, action;

  describe('Actions', () => {
    before(async () => {
      scope = scope();
      operatorScope = isOperator ? scope : operatorScope();

      let payload = { name: `_actionType${Date.now()}` };
      actionType = await operatorScope.actionType().create(payload);
      payload = { scopes: { users: ['+all'] } };
      await operatorScope.actionType(actionType.name).update(payload);
    });

    after(async () => {
      await operatorScope.actionType(actionType.name).delete();
    });

    it('should create an action', async () => {
      const payload = { type: actionType.name, tags: ['foo'] };
      const res = await scope.action(actionType.name).create(payload);

      expect(res).to.be.an('object');
      expect(res.id).to.be.a('string');
      expect(res.id).to.have.length(24);
    });

    it('should read all actions of a type', async () => {
      const res = await scope.action(actionType.name).read();
      action = res[0];

      expect(res).to.be.an('array');
      expect(res).to.have.length.gte(0);
    });

    if (isOperator) {
      it('should read a single action', async () => {
        const res = await scope.action(actionType.name, action.id).read();

        expect(res).to.be.an('object');
        expect(res.id).to.be.a('string');
        expect(res.id).to.equal(action.id);
      });

      it('should delete an action', async () => {
        await scope.action(actionType.name, action.id).delete();
      });
    }
  });
};
