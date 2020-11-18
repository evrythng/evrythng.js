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
      this.timeout = 5000;

      const customSettings = { 
        //apiVersion: ,
        apiKey: 'GEFtii9UYTIOTZoiRWeqYSjbS0PV96sws1MnUEvD57LBivg9reQPX2CuJQAUydKfJWcXJUEznttgJMDN',
      };
      const a = typeof customSettings.apiVersion

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
