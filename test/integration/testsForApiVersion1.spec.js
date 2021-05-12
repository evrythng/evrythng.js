const { setupForApiVersion1 } = require('./util')
const evrythng = require('../../dist/evrythng.node')

describe('evrythng.js for apiVersion = 1', function () {
  let settings = evrythng.setup({ apiVersion: 1, geolocation: false })
  const { apiUrl, apiVersion } = settings

  before(async () => {
    settings = await evrythng.setup({ apiVersion: 1, geolocation: false })
    await setupForApiVersion1(apiUrl)
  })

  describe(`as Application for API v${apiVersion}`, () => {
    require('./entity/user.spec')('application', apiUrl)
  })

  describe(`as anonymous Application User for API ${apiVersion}`, () => {
    const scopeType = 'anonUser'
    require('./entity/actions.spec')(scopeType, apiUrl)
    require('./entity/actionTypes.spec')(scopeType, apiUrl)
    require('./entity/collections.spec')(scopeType, apiUrl)
    require('./entity/commissionState.spec')(scopeType, apiUrl)
    require('./entity/places.spec')(scopeType, apiUrl)
    require('./entity/products.spec')(scopeType, apiUrl)
    require('./entity/properties.spec')(scopeType, 'product', apiUrl)
    require('./entity/properties.spec')(scopeType, 'thng', apiUrl)
    require('./entity/purchaseOrders.spec')(scopeType, apiUrl)
    require('./entity/roles.spec')(scopeType, apiUrl)
    require('./entity/thngs.spec')(scopeType, apiUrl)
  })

  describe(`as Trusted Application for API v${apiVersion}`, () => {
    const scopeType = 'trustedApplication'
    require('./entity/actions.spec')(scopeType, apiUrl)
    require('./entity/actionTypes.spec')(scopeType, apiUrl)
    require('./entity/collections.spec')(scopeType, apiUrl)
    require('./entity/commissionState.spec')(scopeType, apiUrl)
    require('./entity/places.spec')(scopeType, apiUrl)
    require('./entity/products.spec')(scopeType, apiUrl)
    require('./entity/properties.spec')(scopeType, 'product', apiUrl)
    require('./entity/properties.spec')(scopeType, 'thng', apiUrl)
    require('./entity/purchaseOrders.spec')(scopeType, apiUrl)
    require('./entity/reactor.spec')(scopeType, apiUrl)
    require('./entity/thngs.spec')(scopeType, apiUrl)
  })

  describe(`as Operator for API v${apiVersion}`, () => {
    const scopeType = 'operator'
    require('./entity/accesses.spec')(scopeType, apiUrl)
    require('./entity/accountRedirector.spec')(scopeType, apiUrl)
    require('./entity/accounts.spec')(scopeType, apiUrl)
    require('./entity/actions.spec')(scopeType, apiUrl)
    require('./entity/actionTypes.spec')(scopeType, apiUrl)
    require('./entity/adiOrders.spec')(scopeType, apiUrl)
    require('./entity/adiOrderEvents.spec')(scopeType, apiUrl)
    require('./entity/applicationRedirector.spec')(scopeType, apiUrl)
    require('./entity/applications.spec')(scopeType, apiUrl)
    require('./entity/batches.spec')(scopeType, settings)
    require('./entity/collections.spec')(scopeType, apiUrl)
    require('./entity/commissionState.spec')(scopeType, apiUrl)
    require('./entity/domains.spec')(scopeType, apiUrl)
    require('./entity/files.spec')(scopeType, apiUrl)
    require('./entity/locations.spec')(scopeType, apiUrl)
    require('./entity/me.spec')(scopeType, settings)
    require('./entity/permissions.spec')(scopeType, apiUrl)
    require('./entity/permissions.spec')('userInApp', apiUrl)
    require('./entity/places.spec')(scopeType, apiUrl)
    require('./entity/products.spec')(scopeType, apiUrl)
    require('./entity/projects.spec')(scopeType, apiUrl)
    require('./entity/properties.spec')(scopeType, 'product', apiUrl)
    require('./entity/properties.spec')(scopeType, 'thng', apiUrl)
    require('./entity/purchaseOrders.spec')(scopeType, apiUrl)
    require('./entity/reactor.spec')(scopeType, apiUrl)
    require('./entity/redirection.spec')(scopeType, 'product', apiUrl)
    require('./entity/redirection.spec')(scopeType, 'thng', apiUrl)
    require('./entity/roles.spec')(scopeType, apiUrl)
    require('./entity/rules.spec')(scopeType, apiUrl)
    require('./entity/secretKey.spec')(scopeType, apiUrl)
    require('./entity/shipmentNotice.spec')(scopeType, apiUrl)
    require('./entity/shortDomains.spec')(scopeType, apiUrl)
    require('./entity/tasks.spec')(scopeType, apiUrl)
    require('./entity/thngs.spec')(scopeType, apiUrl)
    require('./entity/user.spec')(scopeType, apiUrl)
  })

  describe(`as Device for API v${apiVersion}`, () => {
    const scopeType = 'device'
    require('./scope/device.spec')(scopeType, apiUrl)
  })

  describe(`as ActionAppfor API v${apiVersion}`, () => {
    require('./scope/actionApp.spec')(apiUrl)
  })

  describe(`as Operator for API v${apiVersion}`, () => {
    require('./scope/operator.spec')(apiUrl)
  })

  describe(`Misc for API v${apiVersion}`, () => {
    const scopeType = 'operator'
    require('./misc/alias.spec')(scopeType, apiUrl)
    require('./misc/api.spec')(settings)
    require('./misc/find.spec')(scopeType, apiUrl)
    require('./misc/pages.spec')(scopeType, apiUrl)
    require('./misc/paramSetters.spec')(scopeType, apiUrl)
    require('./misc/rescope.spec')(scopeType, apiUrl)
    require('./misc/stream.spec')(scopeType, apiUrl)
    require('./misc/streamPages.spec')(scopeType, apiUrl)
    require('./misc/upsert.spec')(scopeType, apiUrl)
    require('./misc/use.spec')(scopeType, apiUrl)
  })
})
