const { Operator, Application, TrustedApplication, Device, api } = require('evrythng')
const { OPERATOR_API_KEY } = process.env

let scopes = {}
let resources = {}

/**
 * Initialise reusable entities in the specified Platform account.
 */
const setup = async () => {
  if (!OPERATOR_API_KEY) {
    throw new Error('Please export OPERATOR_API_KEY')
  }

  const operator = new Operator(OPERATOR_API_KEY)
  await operator.init()

  const appProject = await operator.projects().create({ name: 'Test Project' })
  const payload = { name: 'Test App', socialNetworks: {} }
  const appResource = await operator.projects(appProject.id).applications().create(payload)
  const application = new Application(appResource.appApiKey)
  await application.init()

  const { secretApiKey } = await api({
    url: `/projects/${appProject.id}/applications/${application.id}/secretKey`,
    apiKey: operator.apiKey
  })
  const trustedApplication = new TrustedApplication(secretApiKey)
  await trustedApplication.init()

  const anonUser = await application.appUsers().create({ anonymous: true })
  await anonUser.init()

  const deviceThng = await operator.thngs().create({ name: 'Test Device' })
  const { thngApiKey } = await api({
    url: '/auth/evrythng/thngs',
    method: 'post',
    apiKey: operator.apiKey,
    data: { thngId: deviceThng.id }
  })
  const device = new Device(thngApiKey)
  await device.init()

  scopes = {
    operator,
    application,
    trustedApplication,
    anonUser,
    device
  }
  resources = {
    appProject,
    deviceThng
  }
}

/**
 * Clean up resources set up in setup().
 */
const teardown = async () => {
  await scopes.operator.thngs(resources.deviceThng.id).delete()
  await scopes.operator.projects(resources.appProject.id).delete()
}

const getScope = type => scopes[type]

module.exports = {
  resources,
  setup,
  teardown,
  getScope
}
