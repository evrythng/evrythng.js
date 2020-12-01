const { setupForApiVersion2 } = require('./util')
const evrythng = require('../../dist/evrythng.node')

describe('evrythng.js for apiVersion = 2', function () {
  let settings = evrythng.setup({ apiVersion: 2, geolocation: false })
  // await setupForApiVersion2(settings.apiUrl)

  before(async () => {
    settings = await evrythng.setup({ apiVersion: 2, geolocation: false })
    await setupForApiVersion2(settings.apiUrl)
  })

  describe('as Operator', () => {
    console.log(settings)
    const scope = 'operator'
    require('./entity/accessPolicies.spec')(scope, settings)
    require('./entity/accessTokens.spec')(scope, settings)
    require('./entity/accountRedirector.spec')(scope, settings.apiUrl)
    require('./entity/accounts.spec')(scope, settings.apiUrl)
    require('./entity/actions.spec')(scope, settings.apiUrl)
    require('./entity/actionTypes.spec')(scope, settings.apiUrl)
    require('./entity/adiOrders.spec')(scope, settings.apiUrl)
    require('./entity/adiOrderEvents.spec')(scope, settings.apiUrl)
    require('./entity/applicationRedirector.spec')(scope, settings.apiUrl)
    require('./entity/applications.spec')(scope, settings.apiUrl)
    require('./entity/batches.spec')(scope, settings)
    require('./entity/collections.spec')(scope, settings.apiUrl)
    require('./entity/commissionState.spec')(scope, settings.apiUrl)
    require('./entity/domains.spec')(scope, settings.apiUrl)
    require('./entity/files.spec')(scope, settings)
    require('./entity/locations.spec')(scope, settings.apiUrl)
    require('./entity/me.spec')(scope, settings)
    require('./entity/operatorAccesses.spec')(scope, settings)
    require('./entity/places.spec')(scope, settings.apiUrl)
    require('./entity/products.spec')(scope, settings.apiUrl)
    require('./entity/projects.spec')(scope, settings.apiUrl)
    require('./entity/properties.spec')(scope, 'product', settings.apiUrl)
    require('./entity/properties.spec')(scope, 'thng', settings.apiUrl)
    require('./entity/purchaseOrders.spec')(scope, settings.apiUrl)
    require('./entity/reactor.spec')(scope, settings.apiUrl)
    require('./entity/redirection.spec')(scope, 'product')
    require('./entity/redirection.spec')(scope, 'thng')
    require('./entity/shipmentNotice.spec')(scope, settings.apiUrl)
    require('./entity/shortDomains.spec')(scope, settings.apiUrl)
    require('./entity/thngs.spec')(scope, settings.apiUrl)
  })
  describe('as Access Token', () => {
    const scope = 'accessToken'
    require('./entity/accessPolicies.spec')(scope, settings)
    require('./entity/accessTokens.spec')(scope, settings)
    require('./entity/accountRedirector.spec')(scope, settings.apiUrl)
    require('./entity/accounts.spec')(scope, settings.apiUrl)
    require('./entity/actions.spec')(scope, settings.apiUrl)
    require('./entity/actionTypes.spec')(scope, settings.apiUrl)
    require('./entity/adiOrders.spec')(scope, settings.apiUrl)
    require('./entity/adiOrderEvents.spec')(scope, settings.apiUrl)
    require('./entity/applicationRedirector.spec')(scope, settings.apiUrl)
    require('./entity/applications.spec')(scope, settings.apiUrl)
    require('./entity/batches.spec')(scope, settings)
    require('./entity/collections.spec')(scope, settings.apiUrl)
    require('./entity/commissionState.spec')(scope, settings.apiUrl)
    require('./entity/domains.spec')(scope, settings.apiUrl)
    require('./entity/files.spec')(scope, settings)
    require('./entity/locations.spec')(scope, settings.apiUrl)
    require('./entity/me.spec')(scope, settings)
    require('./entity/operatorAccesses.spec')(scope, settings)
    require('./entity/places.spec')(scope, settings.apiUrl)
    require('./entity/products.spec')(scope, settings.apiUrl)
    require('./entity/projects.spec')(scope, settings.apiUrl)
    require('./entity/properties.spec')(scope, 'product', settings.apiUrl)
    require('./entity/properties.spec')(scope, 'thng', settings.apiUrl)
    require('./entity/purchaseOrders.spec')(scope, settings.apiUrl)
    require('./entity/reactor.spec')(scope, settings.apiUrl)
    require('./entity/redirection.spec')(scope, 'product')
    require('./entity/redirection.spec')(scope, 'thng')
    require('./entity/shipmentNotice.spec')(scope, settings.apiUrl)
    require('./entity/shortDomains.spec')(scope, settings.apiUrl)
    require('./entity/thngs.spec')(scope, settings.apiUrl)
  })
  describe('Misc', () => {
    const scope = 'operator'
    require('./misc/api.spec')(settings)
    require('./misc/find.spec')(scope, settings.apiUrl)
    require('./misc/pages.spec')(scope, settings.apiUrl)
    require('./misc/paramSetters.spec')(scope, settings.apiUrl)
    require('./misc/stream.spec')(scope, settings.apiUrl)
    require('./misc/streamPages.spec')(scope, settings.apiUrl)
    require('./misc/upsert.spec')(scope, settings.apiUrl)
    require('./misc/use.spec')(scope, settings.apiUrl)
  })
})
