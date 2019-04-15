const { Operator, Application } = require('evrythng');
const { OPERATOR_API_KEY, APPLICATION_API_KEY } = process.env;

const scopes = {};
const resources = {};

/**
 * Initialise reusable entities in the specified Platform account.
 */
const setup = async () => {
  if (!OPERATOR_API_KEY || !APPLICATION_API_KEY) {
    throw new Error('Please export OPERATOR_API_KEY and APPLICATION_API_KEY');
  }

  scopes.operator = new Operator(OPERATOR_API_KEY);
  scopes.application = new Application(APPLICATION_API_KEY);
  await scopes.application.init();
  scopes.anonUser = await scopes.application.userAccess().create({ anonymous: true });
  await scopes.anonUser.init();

  console.log('Setup complete');
};

/**
 * Clean up resources set up in setup().
 */
const teardown = async () => {
  console.log('Teardown complete');
};

module.exports = {
  resources,
  setup,
  teardown,

  getOperator: () => scopes.operator,
  getApplication: () => scopes.application,
  getAnonUser: () => scopes.anonUser,
};
