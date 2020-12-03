const { setupForApiVersion1 } = require('./util')
const evrythng = require('../../dist/evrythng.node')

describe('evrythng.js for apiVersion = 1', function () {
  let settings = evrythng.setup({ apiVersion: 1, geolocation: false })

  before(async () => {
    settings = await evrythng.setup({ apiVersion: 1, geolocation: false })
    await setupForApiVersion1(settings.apiUrl)
  })

  describe(`as Application for ${settings.apiVersion}`, () => {
    require('./entity/user.spec')('application', settings.apiUrl)
  })

  describe(`as anonymous Application User for ${settings.apiVersion}`, () => {
    const scope = 'anonUser'
    require('./entity/actions.spec')(scope, settings.apiUrl)
    require('./entity/actionTypes.spec')(scope, settings.apiUrl)
    require('./entity/collections.spec')(scope, settings.apiUrl)
    require('./entity/commissionState.spec')(scope, settings.apiUrl)
    require('./entity/places.spec')(scope, settings.apiUrl)
    require('./entity/products.spec')(scope, settings.apiUrl)
    require('./entity/properties.spec')(scope, 'product', settings.apiUrl)
    require('./entity/properties.spec')(scope, 'thng', settings.apiUrl)
    require('./entity/purchaseOrders.spec')(scope, settings.apiUrl)
    require('./entity/roles.spec')(scope, settings.apiUrl)
    require('./entity/thngs.spec')(scope, settings.apiUrl)
  })

  describe(`as Trusted Application for ${settings.apiVersion}`, () => {
    const scope = 'trustedApplication'
    require('./entity/actions.spec')(scope, settings.apiUrl)
    require('./entity/actionTypes.spec')(scope, settings.apiUrl)
    require('./entity/collections.spec')(scope, settings.apiUrl)
    require('./entity/commissionState.spec')(scope, settings.apiUrl)
    require('./entity/places.spec')(scope, settings.apiUrl)
    require('./entity/products.spec')(scope, settings.apiUrl)
    require('./entity/properties.spec')(scope, 'product', settings.apiUrl)
    require('./entity/properties.spec')(scope, 'thng', settings.apiUrl)
    require('./entity/purchaseOrders.spec')(scope, settings.apiUrl)
    require('./entity/thngs.spec')(scope, settings.apiUrl)
  })

  describe(`as Operator for ${settings.apiVersion}`, () => {
    const scope = 'operator'
    require('./entity/accesses.spec')(scope, settings.apiUrl)
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
    require('./entity/files.spec')(scope, settings.apiUrl)
    require('./entity/locations.spec')(scope, settings.apiUrl)
    require('./entity/me.spec')(scope, settings)
    require('./entity/permissions.spec')(scope, settings.apiUrl)
    require('./entity/permissions.spec')('userInApp', settings.apiUrl)
    require('./entity/places.spec')(scope, settings.apiUrl)
    require('./entity/products.spec')(scope, settings.apiUrl)
    require('./entity/projects.spec')(scope, settings.apiUrl)
    require('./entity/properties.spec')(scope, 'product', settings.apiUrl)
    require('./entity/properties.spec')(scope, 'thng', settings.apiUrl)
    require('./entity/purchaseOrders.spec')(scope, settings.apiUrl)
    require('./entity/reactor.spec')(scope, settings.apiUrl)
    require('./entity/redirection.spec')(scope, 'product', settings.apiUrl)
    require('./entity/redirection.spec')(scope, 'thng', settings.apiUrl)
    require('./entity/roles.spec')(scope, settings.apiUrl)
    require('./entity/rules.spec')(scope, settings.apiUrl)
    require('./entity/secretKey.spec')(scope, settings.apiUrl)
    require('./entity/shipmentNotice.spec')(scope, settings.apiUrl)
    require('./entity/shortDomains.spec')(scope, settings.apiUrl)
    require('./entity/tasks.spec')(scope, settings.apiUrl)
    require('./entity/thngs.spec')(scope, settings.apiUrl)
    require('./entity/user.spec')(scope, settings.apiUrl)
  })

  describe(`as Device for ${settings.apiVersion}`, () => {
    const scope = 'device'
    require('./scope/device.spec')(scope, settings.apiUrl)
  })

  describe(`as ActionAppfor ${settings.apiVersion}`, () => {
    require('./scope/actionApp.spec')(settings.apiUrl)
  })

  describe('as Operator', () => {
    require('./scope/operator.spec')(settings.apiUrl)
  })

  describe(`Misc for ${settings.apiVersion}`, () => {
    const scope = 'operator'
    require('./misc/alias.spec')(scope, settings.apiUrl)
    require('./misc/api.spec')(settings)
    require('./misc/find.spec')(scope, settings.apiUrl)
    require('./misc/pages.spec')(scope, settings.apiUrl)
    require('./misc/paramSetters.spec')(scope, settings.apiUrl)
    require('./misc/rescope.spec')(scope, settings.apiUrl)
    require('./misc/stream.spec')(scope, settings.apiUrl)
    require('./misc/streamPages.spec')(scope, settings.apiUrl)
    require('./misc/upsert.spec')(scope, settings.apiUrl)
    require('./misc/use.spec')(scope, settings.apiUrl)
  })
})
