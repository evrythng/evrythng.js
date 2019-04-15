const { Operator, Application } = require('evrythng');
const ctx = require('./ctx');

const { OPERATOR_API_KEY, APPLICATION_API_KEY } = process.env;

/**
 * Initialise reusable entities in the specified Platform account.
 */
const setup = async () => {
  if (!OPERATOR_API_KEY || !APPLICATION_API_KEY) {
    throw new Error('Please export OPERATOR_API_KEY and APPLICATION_API_KEY');
  }

  ctx.operator = new Operator(OPERATOR_API_KEY);
  ctx.app = new Application(APPLICATION_API_KEY);
  ctx.anonUser = await ctx.app.userAccess().create({ anonymous: true });
  await ctx.anonUser.init();

  console.log('Setup complete');
};

/**
 * Clean up resources set up in setup().
 */
const teardown = async () => {
  await ctx.operator.thng(ctx.thng.id).delete();
  await ctx.operator.product(ctx.product.id).delete();
  await ctx.operator.collection(ctx.collection.id).delete();

  console.log('Teardown complete');
};

describe('evrythng.js', () => {
  before(async () => await setup());
  after(async () => await teardown());

  describe('as anonymous Application User', () => {
    require('./entity/thngs.spec');
    require('./entity/products.spec');
    require('./entity/collections.spec');
  });
});
