const { Operator, Application, TrustedApplication } = require('evrythng')
const { OPERATOR_API_KEY, APPLICATION_API_KEY, TRUSTED_APPLICATION_API_KEY } = process.env

const scopes = {}
const resources = {}

/**
 * Initialise reusable entities in the specified Platform account.
 */
const setup = async () => {
  if (!OPERATOR_API_KEY || !APPLICATION_API_KEY || !TRUSTED_APPLICATION_API_KEY) {
    throw new Error('Please export OPERATOR_API_KEY, TRUSTED_APPLICATION_API_KEY, and APPLICATION_API_KEY')
  }

  scopes.operator = new Operator(OPERATOR_API_KEY)
  scopes.application = new Application(APPLICATION_API_KEY)
  await scopes.application.init()
  scopes.trustedApplication = new TrustedApplication(TRUSTED_APPLICATION_API_KEY)
  await scopes.trustedApplication.init()
  scopes.anonUser = await scopes.application.userAccess().create({ anonymous: true })
  await scopes.anonUser.init()
}

/**
 * Clean up resources set up in setup().
 */
const teardown = async () => {
}

const getScope = type => scopes[type]

module.exports = {
  resources,
  setup,
  teardown,
  getScope
}
