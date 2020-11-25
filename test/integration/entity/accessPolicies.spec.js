const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

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

module.exports = (scopeType, settings) => {
  describe('AccessPolicies', () => {
    let scope, api

    before(async () => {
      scope = getScope(scopeType);
      api = mockApi(settings.apiUrl);
    })

    if(settings.apiVersion == 2) {
      it('should create access policy', async () => {
        api.post('/accessPolicies', payload)
          .reply(201, { id: 'accessPolicyId' })
        const res = await scope.accessPolicy().create(payload)

        expect(res).to.be.an('object')
        expect(res.id).to.be.a('string')
      })

      it('should read access policy by id', async () => {
        api.get('/accessPolicies/accessPolicyId')
          .reply(200, { id: 'accessPolicyId' })
        const res = await scope.accessPolicy('accessPolicyId').read()

        expect(res).to.be.an('object')
        expect(res.id).to.be.a('string')
      })

      it('should read all access policies', async () => {
        api.get('/accessPolicies')
          .reply(200, [payload])
        const res = await scope.accessPolicy().read()

        expect(res).to.be.an('array')
        expect(res).to.have.length.gte(1)
      })

      it('should update access policy', async () => {
        api.put('/accessPolicies/accessPolicyId',payload)
          .reply(200, payload)

        const res = await scope.accessPolicy('accessPolicyId').update(payload)

        expect(res).to.be.an('object')
        expect(res.name).to.deep.equal(payload.name)
      })

      it('should delete access policy', async () => {
        api.delete('/accessPolicies/accessPolicyId')
          .reply(204)
        const res = await scope.accessPolicy('accessPolicyId').delete()

        expect(res).to.not.exist
      })
  }
  })
}
