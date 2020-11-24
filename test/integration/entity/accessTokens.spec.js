const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

const evrythng = require('../../../dist/evrythng.node');


const payload = {
  name: 'accessTokens',
  description: 'create accessTokens',
  policies: ['UPb7E6shapktcaaabfahfpds'],
  conditions: [],
  tags: [
    	'operatorAccess'
    	],
    identifiers: {},
    customFields: {}
}

module.exports = () => {
  describe('AccessTokens', () => {
    let operator
    let api

    before(async () => {
    
    })

    it('should create operatorAccess', async () => {
      api.post('/accounts/accountId/operatorAccess', payload)
        .reply(201, payload)
      const res = await operator.operatorAccess().create(payload)

      expect(res).to.be.an('object')
    })

    it.only('test', async function test() {
      this.timeout = 5000;
      
      const customSettings = { 
        apiVersion: 2,
        apiKey: 's8A2I0YRNbcmQIuf9Dy7lk9TR78ZiWAbiGasLnihY2UAPTIJEteKdACzYaovlqdchNPik30krKnIxlXs',
      };

      //console.log(`!!!! ${a}`)

      const setting = await evrythng.setup(customSettings);

      const operator = new evrythng.Operator(setting.apiKey)
      
      console.log(setting)

      const operatorAccessPayload = {
        name: 'accessTokens',
        description: 'create accessTokens',
        policies: ['UPb7E6shapktcaaabfahfpds'],
        conditions: [],
        tags: [
            'operatorAccess'
            ],
          identifiers: {},
          customFields: {}
      };

      // const createNewOperatorAccess = await operator.sharedAccount('UQ4nDr2FDWQ7N2aRqcTc2Qch').access().read();

      const createNewOperatorAccess = await operator.accessTokens().create(operatorAccessPayload);
      
       console.log(createNewOperatorAccess)
//create(operatorAccessPayload)
      // const a = await evrythng
      //   .api({ url: '/time' })
      //   .then(console.log)
      //   .catch(console.error);
    });
  })
}
