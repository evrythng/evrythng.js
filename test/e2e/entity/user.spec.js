const { expect } = require('chai');
const { resources } = require('../util');

const USER = {
  firstName: 'Test',
  lastName: 'User',
  email: `test.user-${Date.now()}@evrythng.com`,
  password: 'password',
};

module.exports = (scope, scopeType) => {
  before(() => {
    scope = scope();
  });

  describe('Application Users', () => {
    if (scopeType === 'application') {
      it('should create an anonymous Application User', async () => {
        const res = await scope.userAccess().create({ anonymous: true });
        resources.anonUser = res;

        expect(res).to.be.an('object');
        expect(res.status).to.equal('anonymous');
        expect(res.evrythngApiKey).to.be.a('string');
        expect(res.evrythngApiKey).to.have.length(80);
      });

      it('should create and validate a named user', async () => {
        const res = await scope.userAccess().create(USER)
          .then(res => res.validate());
        resources.namedUser = res;

        expect(res).to.be.an('object');
        expect(res.id).to.be.a('string');
        expect(res.id).to.have.length(24);
        expect(res.apiKey).to.be.a('string');
        expect(res.apiKey).to.have.length(80);
        expect(res.firstName).to.equal(USER.firstName);
        expect(res.lastName).to.equal(USER.lastName);
        expect(res.email).to.equal(USER.email);
      });

      it('should login a named user', async () => {
        const res = await scope.login({
          email: USER.email,
          password: USER.password,
        });

        expect(res).to.be.an('object');
        expect(res.id).to.have.length(24);
        expect(res.apiKey).to.be.a('string');
        expect(res.apiKey).to.have.length(80);
        expect(res.firstName).to.equal(USER.firstName);
        expect(res.lastName).to.equal(USER.lastName);
        expect(res.email).to.equal(USER.email);
      });

      it('should logout a named user', async () => {
        const res = await resources.namedUser.logout();

        expect(res).to.be.an('object');
        expect(res.logout).to.equal('ok');

        // Re-authenticate the user
        resources.namedUser = await scope.login({
          email: USER.email,
          password: USER.password,
        });
      });
      return;
    }

    it('should read an Application User', async () => {
      const res = await scope.user(resources.anonUser.id).read();

      expect(res).to.be.an('object');
      expect(res.id).to.equal(resources.anonUser.id);
    });

    it('should read all Application Users', async () => {
      const res = await scope.user().read();

      expect(res).to.be.an('array');
      expect(res).to.have.length.gte(1);
    });

    it('should update an Application User', async () => {
      const payload = { firstName: 'updated' };
      const res = await scope.user(resources.anonUser.id).update(payload);

      expect(res).to.be.an('object');
      expect(res.firstName).to.equal(payload.firstName);
    });

    it('should delete an Application User', async () => {
      await scope.user(resources.anonUser.id).delete();
    });
  });
};
