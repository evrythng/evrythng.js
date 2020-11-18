const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

const evrythng = require('../../../dist/evrythng.node');


const payload = {
  name: 'custom policy',
  description: 'Create custom policy',
  policies: ['UPb7E6shapktcaaabfahfpds'],
  conditions: [],
  operator: 'UtnGTkaPDphkYDC9F2KHBtPp',
  tags: [
    	'operatorAccess'
    	],
    identifiers: {},
    customFields: {}
}

module.exports = () => {
  describe('AccessPolicies', () => {
    let operator
    let api

    before(async () => {
      // const useApiV2 = true

      // operator = getScope('operator');
      // api = mockApi(useApiV2);
      // console.log(operator)
    })

    it('should create access policy', async () => {
      api.post('/accounts/accountId/operatorAccess', payload)
        .reply(201, payload)
      const res = await operator.operatorAccess().create(payload)

      expect(res).to.be.an('object')
    })

    it.only('test', async function test() {
      const customSettings = { 
        apiKey: 'nqkEGxnzWPvile0uyvbVeTu2daitPV8mDDiu42S7UjHXgE6McWRh6K2MIzVCvBlq4wSfDUpovn3JYUri',
        // apiKey: 'ZkYvnpiaEsvCbMDre0OlR4wN6W96my8BEZiiafALgx7WF4vSZ8ls5TF4v4TrHP9yNihNzbGc6N6LVL5c'
      };

      const setting = await evrythng.setup(customSettings);

      const operator = new evrythng.Operator(setting.apiKey)
      // console.log(operator)
      console.log(1)
      //const operator = new evrythng.TrustedApplication(setting.apiKey)
      console.log(2)
      const customPolicyPayload = {
        name: "updated custom policy",
        permissions: [
    	    "actions:list,read,create,delete",
            "collections:list,read,create,update,delete",
            "collectionsActions:list,read,create,delete",
            "domains:list",
            "factories:list",
            "operators:read,update",
            "operatorAccess:list,read,create,update,delete",
            "places:list,read,create,update,delete",
            "products:list,read,create,update,delete",
            "productsActions:list,read,create",
            "purchaseOrders:create,read,update,delete,list",
            "purchaseOrdersAggregations:list",
            "redirections:read,create,update,delete",
            "redirector:read,update,delete",
            "me:read"
    	],
        tags: [],
        identifiers: {},
        customFields: {},
        uiPermissions: [
          "activation",
          "adiOrders",
          "authenticate",
          "consumerEngagement",
          "counterfeit",
          "grayMarket",
          "inventoryVisibility",
          "inventoryTrace",
          "looker",
          "factoryDetails",
          "purchaseOrders",
          "brandProtection",
          "developer"
        ],
        homepage: "adiOrders"
      };

      const createCustomPolicy = await operator.accessPolicy().create(customPolicyPayload);
      
    //   console.log(createCustomPolicy)
    });
  })
}
