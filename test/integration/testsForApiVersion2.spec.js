const { setupForApiVersion2 } = require('./util')
const evrythng = require('../../dist/evrythng.node')

describe('evrythng.js for apiVersion = 2', function () {
  let settings = evrythng.setup({ apiVersion: 2, geolocation: false })
  const { apiUrl, apiVersion } = settings

  before(async () => {
    settings = await evrythng.setup({ apiVersion: 2, geolocation: false })
    await setupForApiVersion2(apiUrl)
  })

  describe(`as Operator for API v${apiVersion}`, () => {
    const scopeType = 'operator'
    require('./entity/accessPolicies.spec')(scopeType, settings)
    require('./entity/accessTokens.spec')(scopeType, settings)
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
    require('./entity/operatorAccesses.spec')(scopeType, settings)
    require('./entity/places.spec')(scopeType, apiUrl)
    require('./entity/products.spec')(scopeType, apiUrl)
    require('./entity/projects.spec')(scopeType, apiUrl)
    require('./entity/properties.spec')(scopeType, 'product', apiUrl)
    require('./entity/properties.spec')(scopeType, 'thng', apiUrl)
    require('./entity/purchaseOrders.spec')(scopeType, apiUrl)
    require('./entity/reactor.spec')(scopeType, apiUrl)
    require('./entity/redirection.spec')(scopeType, 'product')
    require('./entity/redirection.spec')(scopeType, 'thng')
    require('./entity/shipmentNotice.spec')(scopeType, apiUrl)
    require('./entity/shortDomains.spec')(scopeType, apiUrl)
    require('./entity/thngs.spec')(scopeType, apiUrl)
  })
  describe(`as Access Token for API v${apiVersion}`, () => {
    const scopeType = 'accessToken'
    require('./entity/accessPolicies.spec')(scopeType, settings)
    require('./entity/accessTokens.spec')(scopeType, settings)
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
    require('./entity/operatorAccesses.spec')(scopeType, settings)
    require('./entity/places.spec')(scopeType, apiUrl)
    require('./entity/products.spec')(scopeType, apiUrl)
    require('./entity/projects.spec')(scopeType, apiUrl)
    require('./entity/properties.spec')(scopeType, 'product', apiUrl)
    require('./entity/properties.spec')(scopeType, 'thng', apiUrl)
    require('./entity/purchaseOrders.spec')(scopeType, apiUrl)
    require('./entity/reactor.spec')(scopeType, apiUrl)
    require('./entity/redirection.spec')(scopeType, 'product')
    require('./entity/redirection.spec')(scopeType, 'thng')
    require('./entity/shipmentNotice.spec')(scopeType, apiUrl)
    require('./entity/shortDomains.spec')(scopeType, apiUrl)
    require('./entity/thngs.spec')(scopeType, apiUrl)
  })
  describe(`as Operator for API v${apiVersion}`, () => {
    require('./scope/operator.spec')(apiUrl)
  })

  describe(`Misc for API v${apiVersion}`, () => {
    const scopeType = 'operator'
    require('./misc/api.spec')(settings)
    require('./misc/find.spec')(scopeType, apiUrl)
    require('./misc/pages.spec')(scopeType, apiUrl)
    require('./misc/paramSetters.spec')(scopeType, apiUrl)
    require('./misc/stream.spec')(scopeType, apiUrl)
    require('./misc/streamPages.spec')(scopeType, apiUrl)
    require('./misc/upsert.spec')(scopeType, apiUrl)
    require('./misc/use.spec')(scopeType, apiUrl)
  })
})
