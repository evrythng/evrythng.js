const Chance = require('chance')

const chance = new Chance()

const characterPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const numberPool = '1234567890'
const wordPool = `${characterPool}${numberPool}`
const permissionPool = [
  ['actions:create', 'places:list,read,update'],
  ['products:list,read', 'purchaseOrders:list,read', 'thngs:read']
]
const uiPermissionPool = [
  ['activation', 'counterfeit'],
  ['authenticate', 'inventoryVisibility', 'inventoryTrace']
]
const customFieldsPool = [
  {
    brand: 12
  },
  {
    size: 'EU 45'
  }
]
const identifiersPool = [
  {
    'ean:': 'sadivnojs89324'
  },
  {
    'random:': 'random'
  }
]
const tagsPool = [
  ['roles', 'and', 'permissions'],
  ['end', 'to']
]

const policyData = () => {
  const uiPermissions = chance.pickone(uiPermissionPool)
  return {
    name: chance.string({ length: 30, pool: wordPool }),
    permissions: chance.pickone(permissionPool),
    uiPermissions,
    homepage: chance.pickone(uiPermissions),
    description: chance.string({ length: 100, pool: wordPool }),
    customFields: chance.pickone(customFieldsPool),
    identifiers: chance.pickone(identifiersPool),
    tags: chance.pickone(tagsPool)
  }
}

const operatorAccessData = (operatorEmail, evtAccountAdminPolicy) => ({
  email: operatorEmail,
  policies: [evtAccountAdminPolicy],
  conditions: [],
  customFields: {},
  identifiers: {},
  tags: []
})

const accessTokenData = (evtManagedPolicy) => ({
  conditions: [],
  name: chance.word({ length: 6 }),
  description: chance.sentence({ words: 10 }),
  policies: [evtManagedPolicy],
  customFields: {},
  identifiers: chance.pickone(identifiersPool),
  tags: chance.pickone(tagsPool)
})

const thngData = () => ({
  name: chance.word({ length: 3 }),
  description: chance.sentence({ words: 10 }),
  identifiers: {},
  customFields: {},
  properties: {
    status: chance.word({ length: 5 })
  }
})

module.exports = {
  policyData,
  operatorAccessData,
  accessTokenData,
  thngData
}
