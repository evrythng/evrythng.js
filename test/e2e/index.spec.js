const evrythng = require('../../dist/evrythng.node')
const { assert } = require('chai')
const { OPERATOR_API_KEY, OPERATOR_EMAIL, ACCOUNT_ID } = require('./config')
const { policyData, operatorAccessData, accessTokenData, thngData } = require('./dataGenerator')

describe('e2e tests for apiVersion=2', () => {
  describe('as Operator', () => {
    let operator
    before(async () => {
      evrythng.setup({ apiKey: OPERATOR_API_KEY })
      operator = new evrythng.Operator(OPERATOR_API_KEY)
    })
    it('should create and read access policy', async () => {
      const data = await policyData()
      const policy = await operator.accessPolicy().create(data)
      assert.deepInclude(policy, data, 'Incorrect policy is created')
      const readPolicy = await operator.accessPolicy(policy.id).read()
      assert.equal(readPolicy.id, policy.id, `Can not read policy by ${policy.id}`)
    })
    it('should create operator access and read it', async function test () {
      this.timeout(10000)
      const findAdminAccountPolicy = await operator
        .accessPolicy()
        .setFilter('name=evt:accountAdmin')
        .read()
      const adminAccountPolicy = findAdminAccountPolicy[0].id
      const operatorData = await operatorAccessData(OPERATOR_EMAIL, adminAccountPolicy)
      const createdOperarorAccess = await operator
        .sharedAccount(ACCOUNT_ID)
        .operatorAccess()
        .create(operatorData)
      assert.deepInclude(
        createdOperarorAccess,
        operatorData,
        'Incorrect operatorAccess is created'
      )
      const readOperatorAccess = await operator
        .sharedAccount(ACCOUNT_ID)
        .operatorAccess(createdOperarorAccess.id)
        .read()
      assert.equal(
        readOperatorAccess.id,
        createdOperarorAccess.id,
        `Can not read operator access by ${createdOperarorAccess.id}`
      )
    })
    it('should get your own access', async function () {
      const findAdminAccountPolicy = await operator
        .accessPolicy()
        .setFilter('name=evt:accountAdmin')
        .read()
      const adminAccountPolicy = findAdminAccountPolicy[0].id
      const myAccess = await operator.me().read()
      assert.equal(
        myAccess.permissions,
        adminAccountPolicy.permissions,
        'Can not get my own access'
      )
    })
  })
  describe('as AccessToken', () => {
    let accessToken
    before(async function () {
      this.timeout(10000)
      evrythng.setup({ apiKey: OPERATOR_API_KEY })
      const operator = new evrythng.Operator(OPERATOR_API_KEY)

      const findAdminAccountPolicy = await operator
        .accessPolicy()
        .setFilter('name=evt:accountAdmin')
        .read()
      const adminAccountPolicy = findAdminAccountPolicy[0].id

      const data = accessTokenData(adminAccountPolicy)
      const createdAccessToken = await operator.accessTokens().create(data)

      const accessTokenApiKey = createdAccessToken.apiKey
      accessToken = new evrythng.AccessToken(accessTokenApiKey)
    })
    it('create access policy', async () => {
      const data = await policyData()
      const policy = await accessToken.accessPolicy().create(data)
      assert.deepInclude(policy, data, 'Incorrect policy is created')
      const readPolicy = await accessToken.accessPolicy(policy.id).read()
      assert.equal(readPolicy.id, policy.id, `Can not read policy by ${policy.id}`)
    })
    it('create thng', async () => {
      const data = thngData()
      const thng = await accessToken.thng().create(data)
      assert.deepInclude(thng, data, 'Can not create thng')
    })
  })
})
