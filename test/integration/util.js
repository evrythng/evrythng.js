const { Operator, Application, TrustedApplication, Device, api, AccessToken } = require('../../dist/evrythng.node')
const nock = require('nock')

const OPERATOR_API_KEY = 'OPERATOR_API_KEY'

let scopes = {}
let resources = {}

/**
 * Mock an API response with nock.
 *
 * @param {string} [apiUrl] - Override API URL from the default.
 * @returns {object} nock mock.
 */

const mockApi = (apiUrl) => nock(apiUrl)


/**
 * Initialise reusable entities in the specified Platform account.
 */
const setupForApiVersion1 = async (apiUrl) => {
  mockApi(apiUrl).get('/access').reply(200, { actor: { id: 'operatorId' } })
  const operator = new Operator(OPERATOR_API_KEY)

  const projectPayload = { name: 'Test Project' }
  mockApi(apiUrl).post('/projects', projectPayload)
    .reply(201, { name: 'Test Project', id: 'projectId' })
  const appProject = await operator.project().create(projectPayload)

  const appPayload = { name: 'Test App', socialNetworks: {} }
  mockApi(apiUrl).post('/projects/projectId/applications', appPayload)
    .reply(201, {
      name: 'Test App',
      socialNetworks: {},
      id: 'applicationId',
      appApiKey: 'appApiKey'
    })
  const appResource = await operator.project(appProject.id).application()
    .create(appPayload)
  mockApi(apiUrl).get('/access').reply(200, { actor: { id: 'applicationId' } })
  mockApi(apiUrl).get('/applications/me').reply(200, { id: 'applicationId' })
  const application = new Application(appResource.appApiKey)

  mockApi(apiUrl).get('/projects/projectId/applications/applicationId/secretKey')
    .reply(200, { secretApiKey: 'secretApiKey' })
  const { secretApiKey } = await api({
    url: '/projects/projectId/applications/applicationId/secretKey',
    apiKey: operator.apiKey
  })
  mockApi(apiUrl).get('/access').reply(200, { actor: { id: 'applicationId' } })
  mockApi(apiUrl).get('/applications/me').reply(200, { id: 'applicationId' })
  const trustedApplication = new TrustedApplication(secretApiKey)

  mockApi(apiUrl).post('/auth/evrythng/users?anonymous=true')
    .reply(201, { id: 'evrythngUser', evrythngApiKey: 'evrythngApiKey' })
  mockApi(apiUrl).get('/access').reply(200, { actor: { id: 'evrythngUser' } })
  mockApi(apiUrl).get('/users/evrythngUser').reply(200, { id: 'evrythngUser' })
  const anonUser = await application.appUser().create({ anonymous: true })

  mockApi(apiUrl).post('/thngs').reply(201, { id: 'deviceThngId' })
  const deviceThng = await operator.thng().create({ name: 'Test Device' })
  mockApi(apiUrl).post('/auth/evrythng/thngs', { thngId: 'deviceThngId' })
    .reply(201, { thngId: 'deviceThngId', thngApiKey: 'thngApiKey'})
  const { thngApiKey } = await api({
    url: '/auth/evrythng/thngs',
    method: 'post',
    apiKey: operator.apiKey,
    data: { thngId: deviceThng.id }
  })
  mockApi(apiUrl).get('/access').reply(200, { actor: { id: 'deviceThngId' } })
  mockApi(apiUrl).get('/thngs/deviceThngId').reply(200, { id: 'deviceThngId' })
  const device = new Device(thngApiKey)

  scopes = {
    operator,
    application,
    trustedApplication,
    anonUser,
    device
  }
}

const setupForApiVersion2 = async (apiUrl) => {
  mockApi(apiUrl).get('/access').reply(200, { actor: { id: 'operatorId' } })
  const operator = new Operator(OPERATOR_API_KEY)

//   mockApi(apiUrl).post('/thngs').reply(201, { id: 'thngId' })
//  await operator.thng().create({ name: 'Test thng' })

  // const accessTokenPayload = {
  //   conditions: [],
  //   name: "AccessTokenName",
  //   policies: ["UPb7E6shapktcaaabfahfpds"],
  //   tags: [
  //     'operatorAccess'
  //     ],
  //   identifiers: {},
  //   customFields: {}
  // };

  // mockApi(API_URL_v2).post('/accessTokens', accessTokenPayload).reply(201, { id: 'accessTokenId', apiKey: 'accessTokenApiKey'})

  // const accessTokenResource = await operator.accessTokens().create(accessTokenPayload)
  // const accessToken = new AccessToken(accessTokenResource.apiKey)

  scopes = {
    operator,
   // accessToken
  }
}

const getScope = type => scopes[type]

module.exports = {
  setupForApiVersion1,
  setupForApiVersion2,
  getScope,
  mockApi
}
