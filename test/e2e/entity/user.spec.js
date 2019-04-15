const { expect } = require('chai');
const { resources } = require('../util');

module.exports = (scope, isOperator) => {
  before(() => {
    scope = scope();
  });

  describe('Application Users', () => {
    if (!isOperator) {
      it('should create an anonymous Application User', async () => {
        resources.user = await scope.userAccess().create({ anonymous: true });
        await resources.user.init();

        expect(resources.user).to.be.an('object');
      });
      return;
    }

    it('should read an Application User', async () => {
      const res = await scope.user(resources.user.id).read();

      expect(res).to.be.an('object');
      expect(res.id).to.equal(resources.user.id);
    });

    it('should read all Application Users', async () => {
      const res = await scope.user().read();

      expect(res).to.be.an('array');
      expect(res).to.have.length.gte(1);
    });

    it('should update an Application User', async () => {
      const payload = { firstName: 'updated' };
      const res = await scope.user(resources.user.id).update(payload);

      expect(res).to.be.an('object');
      expect(res.firstName).to.deep.equal(payload.firstName);
    });

    it('should delete an Application User', async () => {
      await scope.user(resources.user.id).delete();
    });
  });
};
