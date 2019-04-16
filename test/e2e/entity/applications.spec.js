const { expect } = require('chai');
const { getScope } = require('../util');

const NAME = 'test';

module.exports = (scopeType) => {
  describe('Applications', () => {
    let scope, project, application;

    before(async () => {
      scope = getScope(scopeType);

      project = await scope.project().create({ name: NAME });
    });

    after(async () => {
      await scope.project(project.id).delete();
    });

    it('should create an application', async () => {
      const payload = { name: NAME, socialNetworks: {} };
      application = await scope.project(project.id).application().create(payload);

      expect(application).to.be.an('object');
      expect(application.name).to.equal(NAME);
      expect(application.id).to.have.length(24);
      expect(application.project).to.equal(project.id);
    });

    it('should read all applications', async () => {
      const res = await scope.project(project.id).application().read();

      expect(res).to.be.an('array');
      expect(res).to.have.length.gte(1);
    });

    it('should read an application', async () => {
      const res = await scope.project(project.id).application(application.id).read();

      expect(res).to.be.an('object');
      expect(res.id).to.equal(application.id);
    });

    it('should update an application', async () => {
      const payload = { tags: ['updated'] };
      const res = await scope.project(project.id).application(application.id).update(payload);
      
      expect(res).to.be.an('object');
      expect(res.tags).to.deep.equal(payload.tags);
    });

    it('should delete an application', async () => {
      await scope.project(project.id).application(application.id).delete();
    });
  });
};
