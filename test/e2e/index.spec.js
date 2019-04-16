const {
  resources, getAnonUser, getOperator, getTrustedApplication, getApplication, setup, teardown,
} = require('./util');

process.on('unhandledRejection', console.error)

describe('evrythng.js', () => {
  before(setup);
  after(teardown);

  describe('as Application', () => {
    require('./entity/user.spec')(getApplication, 'application');
  });

  describe('as anonymous Application User', () => {
    require('./entity/thngs.spec')(getAnonUser, 'user');
    require('./entity/products.spec')(getAnonUser, 'user');
    require('./entity/collections.spec')(getAnonUser, 'user');
    require('./entity/places.spec')(getAnonUser, 'user');
    require('./entity/actionTypes.spec')(getAnonUser, 'user');
    require('./entity/actions.spec')(getAnonUser, 'user', getOperator);

    after(async () => {
      const operator = getOperator();
      await operator.thng(resources.thng.id).delete();
      await operator.product(resources.product.id).delete();
      await operator.collection(resources.collection.id).delete();
    });
  });

  describe('as Trusted Application', () => {
    require('./entity/thngs.spec')(getTrustedApplication, 'trustedApp');
    require('./entity/products.spec')(getTrustedApplication, 'trustedApp');
    require('./entity/collections.spec')(getTrustedApplication, 'trustedApp');
    require('./entity/places.spec')(getTrustedApplication, 'trustedApp');
    require('./entity/actionTypes.spec')(getTrustedApplication, 'trustedApp');
    require('./entity/actions.spec')(getTrustedApplication, 'trustedApp', getOperator);
  });

  describe('as Operator', () => {
    require('./entity/thngs.spec')(getOperator, 'operator');
    require('./entity/products.spec')(getOperator, 'operator');
    require('./entity/collections.spec')(getOperator, 'operator');
    require('./entity/user.spec')(getOperator, 'operator');
    require('./entity/places.spec')(getOperator, 'operator');
    require('./entity/actionTypes.spec')(getOperator, 'operator');
    require('./entity/actions.spec')(getOperator, 'operator', getOperator);

    after(async () => {
      const operator = getOperator();
      await operator.user(resources.namedUser.id).delete();
    });
  });
});
