const {
  Operator,
  Application,
  TrustedApplication,
  Device,
  AccessToken
} = require('../../dist/evrythng.node')
const nock = require('nock')

const OPERATOR_API_KEY = 'OPERATOR_API_KEY'

let scopes = {}
const resources = {}

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
  mockApi(apiUrl)
    .get('/access')
    .reply(200, { actor: { id: 'operatorId' } })
  mockApi(apiUrl).get('/operators/operatorId').reply(200, {
    id: 'operatorId',
    createdAt: 1471862430968,
    updatedAt: 1607002260749,
    email: 'test.user@evrythng.com',
    firstName: 'Test',
    lastName: 'User'
  })
  const operator = new Operator(OPERATOR_API_KEY)
  await operator.init()

  mockApi(apiUrl)
    .get('/access')
    .reply(200, { actor: { id: 'applicationId' } })
  mockApi(apiUrl).get('/applications/me').reply(200, { id: 'applicationId' })
  const application = new Application('appApiKey')
  await application.init()

  mockApi(apiUrl)
    .get('/access')
    .reply(200, {
      actor: { id: 'applicationId' },
      project: 'projectId'
    })
  mockApi(apiUrl)
    .get('/access')
    .reply(200, {
      actor: { id: 'applicationId' },
      project: 'projectId'
    })
  mockApi(apiUrl).get('/applications/me').reply(200, { id: 'applicationId' })
  mockApi(apiUrl).get('/applications/me').reply(200, { id: 'applicationId' })
  const trustedApplication = new TrustedApplication('secretApiKey')
  await trustedApplication.init()

  mockApi(apiUrl)
    .post('/auth/evrythng/users?anonymous=true')
    .reply(201, { id: 'evrythngUser', evrythngApiKey: 'evrythngApiKey' })
  mockApi(apiUrl)
    .get('/access')
    .reply(200, { actor: { id: 'evrythngUser' } })
  mockApi(apiUrl).get('/users/evrythngUser').reply(200, { id: 'evrythngUser' })
  const anonUser = await application.appUser().create({ anonymous: true })
  await anonUser.init()

  mockApi(apiUrl)
    .get('/access')
    .reply(200, { actor: { id: 'deviceThngId' } })
  mockApi(apiUrl).get('/thngs/deviceThngId').reply(200, { id: 'deviceThngId' })
  const device = new Device('thngApiKey')
  await device.init()

  scopes = {
    operator,
    application,
    trustedApplication,
    anonUser,
    device
  }
  return scopes
}

const setupForApiVersion2 = async (apiUrl) => {
  mockApi(apiUrl)
    .get('/access')
    .reply(200, { actor: { id: 'operatorId' } })
  mockApi(apiUrl).get('/operators/operatorId').reply(200, {
    id: 'operatorId',
    createdAt: 1471862430968,
    updatedAt: 1607002260749,
    email: 'test.user@evrythng.com',
    firstName: 'Test',
    lastName: 'User'
  })
  const operator = new Operator(OPERATOR_API_KEY)

  const accessTokenApiKey = 'accessTokenApiKey'
  mockApi(apiUrl)
    .get('/access')
    .reply(200, { actor: { id: 'accessTokenId' } })
  const accessToken = new AccessToken(accessTokenApiKey)

  scopes = {
    operator,
    accessToken
  }
  return scopes
}

const getScope = (type) => scopes[type]

module.exports = {
  setupForApiVersion1,
  setupForApiVersion2,
  getScope,
  mockApi,
  resources
}
