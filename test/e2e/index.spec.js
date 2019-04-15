const { getAnonUser, getOperator, getApplication, resources, setup, teardown } = require('./util');

const teardownBasicResources = async () => {
  const operator = getOperator();
  await operator.thng(resources.thng.id).delete();
  await operator.product(resources.product.id).delete();
  await operator.collection(resources.collection.id).delete();
};

describe('evrythng.js', () => {
  before(async () => await setup());
  after(async () => await teardown());

  describe('as Application', () => {
    require('./entity/appUser.spec')(getApplication);
  });

  describe('as anonymous Application User', () => {
    require('./entity/thngs.spec')(getAnonUser);
    require('./entity/products.spec')(getAnonUser);
    require('./entity/collections.spec')(getAnonUser);

    after(async () => await teardownBasicResources());
  });

  describe('as Operator', () => {
    require('./entity/thngs.spec')(getOperator, true);
    require('./entity/products.spec')(getOperator, true);
    require('./entity/collections.spec')(getOperator, true);
    require('./entity/appUser.spec')(getOperator, true);
  });
});
