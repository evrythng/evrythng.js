const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

const evrythng = require('../../../dist/evrythng.node');


module.exports = () => {
  describe('OperatorAccesses', () => {
    let operator
    let api

    before(async () => {
      // const useApiV2 = true

      // operator = getScope('operator');
      // api = mockApi(useApiV2);
      // console.log(operator)
    })

    it('should create operatorAccess', async () => {
      api.post('/accounts/accountId/operatorAccess', payload)
        .reply(201, payload)
      const res = await operator.operatorAccess().create(payload)

      expect(res).to.be.an('object')
    })

    it('test', async function test() {
      const customSettings = { 
        useApiV2: true,
        apiKey: 'sdEtrVGRrbKanKmnnlci6YfE8L7GonkSCWwzABgCQwlb2xgw7hTnjJnuAk2al7sZtaz6gztDapGp9BcN',
      };

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

      const setting = await evrythng.setup(customSettings);

      const operator = new evrythng.Operator(setting.apiKey)
      // console.log(operator)

      const getMe = await operator.me().create(customPolicyPayload);
      
       console.log(getMe)
    });
  })
}
