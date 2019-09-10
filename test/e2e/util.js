const { Operator, Application, TrustedApplication, Device, api } = require('evrythng')
const nock = require('nock')

const OPERATOR_API_KEY = 'OPERATOR_API_KEY'
const API_URL = 'https://api.evrythng.com'

let scopes = {}
let resources = {}

/**
 * Mock an API response with nock.
 */
const mockApi = () => nock(API_URL)

/**
 * Initialise reusable entities in the specified Platform account.
 */
const setup = async () => {
  mockApi().get('/access').reply(200, { actor: { id: 'operatorId' } })
  const operator = new Operator(OPERATOR_API_KEY)

  const projectPayload = { name: 'Test Project' }
  mockApi().post('/projects', projectPayload)
    .reply(201, { name: 'Test Project', id: 'projectId' })
  const appProject = await operator.project().create(projectPayload)

  const appPayload = { name: 'Test App', socialNetworks: {} }
  mockApi().post('/projects/projectId/applications', appPayload)
    .reply(201, {
      name: 'Test App',
      socialNetworks: {},
      id: 'applicationId',
      appApiKey: 'appApiKey'
    })
  const appResource = await operator.project(appProject.id).application()
    .create(appPayload)
  mockApi().get('/access').reply(200, { actor: { id: 'applicationId' } })
  mockApi().get('/applications/me').reply(200, { id: 'applicationId' })
  const application = new Application(appResource.appApiKey)

  mockApi().get('/projects/projectId/applications/applicationId/secretKey')
    .reply(200, { secretApiKey: 'secretApiKey' })
  const { secretApiKey } = await api({
    url: '/projects/projectId/applications/applicationId/secretKey',
    apiKey: operator.apiKey
  })
  mockApi().get('/access').reply(200, { actor: { id: 'applicationId' } })
  mockApi().get('/applications/me').reply(200, { id: 'applicationId' })
  const trustedApplication = new TrustedApplication(secretApiKey)

  mockApi().post('/auth/evrythng/users?anonymous=true')
    .reply(201, { id: 'evrythngUser', evrythngApiKey: 'evrythngApiKey' })
  mockApi().get('/access').reply(200, { actor: { id: 'evrythngUser' } })
  mockApi().get('/users/evrythngUser').reply(200, { id: 'evrythngUser' })
  const anonUser = await application.appUser().create({ anonymous: true })

  mockApi().post('/thngs').reply(201, { id: 'deviceThngId' })
  const deviceThng = await operator.thng().create({ name: 'Test Device' })
  mockApi().post('/auth/evrythng/thngs', { thngId: 'deviceThngId' })
    .reply(201, { thngId: 'deviceThngId', thngApiKey: 'thngApiKey'})
  const { thngApiKey } = await api({
    url: '/auth/evrythng/thngs',
    method: 'post',
    apiKey: operator.apiKey,
    data: { thngId: deviceThng.id }
  })
  mockApi().get('/access').reply(200, { actor: { id: 'deviceThngId' } })
  mockApi().get('/thngs/deviceThngId').reply(200, { id: 'deviceThngId' })
  const device = new Device(thngApiKey)

  scopes = {
    operator,
    application,
    trustedApplication,
    anonUser,
    device
  }
}

/**
 * Clean up resources set up in setup().
 */
const teardown = async () => {
  await scopes.operator.thng(resources.deviceThng.id).delete()
  await scopes.operator.project(resources.appProject.id).delete()
}

const getScope = type => scopes[type]

module.exports = {
  resources,
  setup,
  teardown,
  getScope,
  mockApi
}
