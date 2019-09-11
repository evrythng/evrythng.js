const { resources, getScope, setup, teardown } = require('./util')
const evrythng = require('../../')

evrythng.setup({ geolocation: false })

process.on('unhandledRejection', console.error)

describe('evrythng.js', () => {
  before(setup)

  describe('as Application', () => {
    require('./entity/user.spec')('application')
  })

  describe('as anonymous Application User', () => {
    require('./entity/actions.spec')('anonUser')
    require('./entity/actionTypes.spec')('anonUser')
    require('./entity/collections.spec')('anonUser')
    require('./entity/commissionState.spec')('anonUser')
    require('./entity/places.spec')('anonUser')
    require('./entity/products.spec')('anonUser')
    require('./entity/properties.spec')('anonUser', 'product')
    require('./entity/properties.spec')('anonUser', 'thng')
    require('./entity/roles.spec')('anonUser')
    require('./entity/thngs.spec')('anonUser')
  })

  describe('as Trusted Application', () => {
    require('./entity/actions.spec')('trustedApplication')
    require('./entity/actionTypes.spec')('trustedApplication')
    require('./entity/collections.spec')('trustedApplication')
    require('./entity/commissionState.spec')('trustedApplication')
    require('./entity/places.spec')('trustedApplication')
    require('./entity/products.spec')('trustedApplication')
    require('./entity/properties.spec')('trustedApplication', 'product')
    require('./entity/properties.spec')('trustedApplication', 'thng')
    require('./entity/thngs.spec')('trustedApplication')
  })

  describe('as Operator', () => {
    require('./entity/accesses.spec')()
    require('./entity/accountRedirector.spec')()
    require('./entity/accounts.spec')()
    require('./entity/actions.spec')('operator')
    require('./entity/actionTypes.spec')('operator')
    require('./entity/adiOrders.spec')()
    require('./entity/applicationRedirector.spec')()
    require('./entity/applications.spec')('operator')
    require('./entity/batches.spec')()
    require('./entity/commissionState.spec')('operator')
    require('./entity/collections.spec')('operator')
    require('./entity/domains.spec')()
    require('./entity/files.spec')('operator')
    require('./entity/locations.spec')('operator')
    require('./entity/permissions.spec')('operator')
    require('./entity/permissions.spec')('userInApp')
    require('./entity/places.spec')('operator')
    require('./entity/products.spec')('operator')
    require('./entity/projects.spec')()
    require('./entity/properties.spec')('operator', 'product')
    require('./entity/properties.spec')('operator', 'thng')
    require('./entity/reactor.spec')('operator')
    require('./entity/redirection.spec')('operator', 'product')
    require('./entity/redirection.spec')('operator', 'thng')
    require('./entity/roles.spec')('operator')
    require('./entity/rules.spec')()
    require('./entity/secretKey.spec')()
    require('./entity/shortDomains.spec')()
    require('./entity/tasks.spec')()
    require('./entity/thngs.spec')('operator')
    require('./entity/user.spec')('operator')
  })

  describe('as Device', () => {
    require('./scope/device.spec')()
  })

  describe('as ActionApp', () => {
    require('./scope/actionApp.spec')()
  })

  describe('Misc', () => {
    require('./misc/alias.spec')()
    require('./misc/api.spec')('operator')
    require('./misc/find.spec')()
    require('./misc/pages.spec')('operator')
    require('./misc/paramSetters.spec')()
    require('./misc/rescope.spec')()
    require('./misc/stream.spec')()
    require('./misc/upsert.spec')()
    require('./misc/use.spec')()
  })
})
