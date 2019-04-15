const { getAnonUser, getOperator, getApplication, resources, setup, teardown } = require('./util');

process.on('unhandledRejection', console.error)

describe('evrythng.js', () => {
  before(async () => await setup());
  after(async () => await teardown());

  describe('as Application', () => {
    require('./entity/user.spec')(getApplication);
  });

  describe('as anonymous Application User', () => {
    require('./entity/thngs.spec')(getAnonUser);
    require('./entity/products.spec')(getAnonUser);
    require('./entity/collections.spec')(getAnonUser);
    require('./entity/places.spec')(getAnonUser);
    require('./entity/actionTypes.spec')(getAnonUser);

    after(async () => {
      const operator = getOperator();
      await operator.thng(resources.thng.id).delete();
      await operator.product(resources.product.id).delete();
      await operator.collection(resources.collection.id).delete();
    });
  });

  describe('as Operator', () => {
    require('./entity/thngs.spec')(getOperator, true);
    require('./entity/products.spec')(getOperator, true);
    require('./entity/collections.spec')(getOperator, true);
    require('./entity/user.spec')(getOperator, true);
    require('./entity/places.spec')(getOperator, true);
    require('./entity/actionTypes.spec')(getOperator, true);

    after(async () => {
      const operator = getOperator();
      await operator.user(resources.namedUser.id).delete();
    });
  });
});
