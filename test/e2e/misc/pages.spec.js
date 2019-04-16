const { expect } = require('chai');
const { getScope } = require('../util');

const PER_PAGE = 1;
const NUM_TEST_THNGS = 5;

module.exports = (scopeType) => {
  describe('pages', () => {
    let scope;
    const thngs = [];

    before(async () => {
      scope = getScope(scopeType);

      for (let i = 0; i < NUM_TEST_THNGS; i += 1) {
        thngs.push(await scope.thng().create({ name: 'test' }));
      }
    });

    after(async () => {
      for (let i = 0; i < NUM_TEST_THNGS; i += 1) {
        await scope.thng(thngs[i].id).delete();
      }
    });

    it('should read thngs through an async iterator', async () => {
      const params = { perPage: PER_PAGE };
      const it = scope.thng().pages({ params });
      let page = await it.next();
      
      expect(page.value.length).to.equal(PER_PAGE);
      expect(page.done).to.equal(false);

      page = await it.next();
      expect(page.value.length).to.equal(PER_PAGE);
      expect(page.done).to.equal(false);
    });
  });
};
