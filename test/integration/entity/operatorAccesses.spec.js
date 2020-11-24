const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

const evrythng = require('../../../dist/evrythng.node');


const payload = {
  email: 'operatorAccess@gmail.com',
  description: 'Create operator access',
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
        //useApiV2: true,
        apiKey: 'sdEtrVGRrbKanKmnnlci6YfE8L7GonkSCWwzABgCQwlb2xgw7hTnjJnuAk2al7sZtaz6gztDapGp9BcN',
      };

      const setting = await evrythng.setup(customSettings);

      const operator = new evrythng.Operator(setting.apiKey)
      // console.log(operator)

      const operatorAccessPayload = {
        email: "3dbml9j1ip@gmail.com",
        policies: ["UPbNYMshapktcaaabfahfpdr"],
        conditions: [],
        operator: "UQnHkYPXpCAYhRbFbxs7abmd",
        tags: [],
        identifiers: {},
        customFields: {}
      };

      // const createNewOperatorAccess = await operator.sharedAccount('UQ4nDr2FDWQ7N2aRqcTc2Qch').access().read();

      const createNewOperatorAccess = await operator.sharedAccount('UQ4nDr2FDWQ7N2aRqcTc2Qch').operatorAccess('UQHnk2xVnWHRBQaabwreUaKq').read;
      
       console.log(createNewOperatorAccess)
//create(operatorAccessPayload)
      // const a = await evrythng
      //   .api({ url: '/time' })
      //   .then(console.log)
      //   .catch(console.error);
    });
  })
}
