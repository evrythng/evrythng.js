const { resources, getScope, setup, teardown } = require('./util');
const evrythng = require('evrythng');

evrythng.setup({ geolocation: false });

process.on('unhandledRejection', console.error)

describe('evrythng.js', () => {
  before(setup);
  after(teardown);

  describe('as Application', () => {
    require('./entity/user.spec')('application');
  });

  describe('as anonymous Application User', () => {
    require('./entity/thngs.spec')('anonUser');
    require('./entity/products.spec')('anonUser');
    require('./entity/collections.spec')('anonUser');
    require('./entity/places.spec')('anonUser');
    require('./entity/actionTypes.spec')('anonUser');
    require('./entity/actions.spec')('anonUser');
    require('./entity/properties.spec')('anonUser', 'thng');
    require('./entity/properties.spec')('anonUser', 'product');

    after(async () => {
      const operator = getScope('operator');
      await operator.thng(resources.thng.id).delete();
      await operator.product(resources.product.id).delete();
      await operator.collection(resources.collection.id).delete();
    });
  });

  describe('as Trusted Application', () => {
    require('./entity/thngs.spec')('trustedApplication');
    require('./entity/products.spec')('trustedApplication');
    require('./entity/collections.spec')('trustedApplication');
    require('./entity/places.spec')('trustedApplication');
    require('./entity/actionTypes.spec')('trustedApplication');
    require('./entity/actions.spec')('trustedApplication');
    require('./entity/properties.spec')('trustedApplication', 'thng');
    require('./entity/properties.spec')('trustedApplication', 'product');
  });

  describe('as Operator', () => {
    require('./entity/thngs.spec')('operator');
    require('./entity/products.spec')('operator');
    require('./entity/collections.spec')('operator');
    require('./entity/user.spec')('operator');
    require('./entity/places.spec')('operator');
    require('./entity/actionTypes.spec')('operator');
    require('./entity/actions.spec')('operator');
    require('./entity/properties.spec')('operator', 'thng');
    require('./entity/properties.spec')('operator', 'product');

    after(async () => {
      const operator = getScope('operator');
      await operator.user(resources.namedUser.id).delete();
    });
  });
});
