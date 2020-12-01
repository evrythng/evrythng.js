const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

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

module.exports = (scopeType, settings) => {
  describe('OperatorAccesses', () => {
    let scope, api

    before(async () => {
      scope = getScope(scopeType);
      api = mockApi(settings.apiUrl);
    })

    if(settings.apiVersion == 2) {
      it('should create operator access', async () => {
        api.post('/accounts/accountId/operatorAccess', payload)
          .reply(201, { id: 'operatorAccessId' })
        const res = await scope.sharedAccount('accountId').operatorAccess().create(payload)

        expect(res).to.be.an('object')
        expect(res.id).to.be.a('string')
      })

      it('should read operator access by id', async () => {
        api.get('/accounts/accountId/operatorAccess/operatorAccessId')
          .reply(200, { id: 'operatorAccessId' })
        const res = await scope.sharedAccount('accountId').operatorAccess('operatorAccessId').read()

        expect(res).to.be.an('object')
        expect(res.id).to.be.a('string')
      })

      it('should read all operator accesses', async () => {
        api.get('/accounts/accountId/operatorAccess')
          .reply(200, [payload])
        const res = await scope.sharedAccount('accountId').operatorAccess().read()

        expect(res).to.be.an('array')
        expect(res).to.have.length.gte(1)
      })

      it('should update operator access', async () => {
        api.put('/accounts/accountId/operatorAccess/operatorAccessId', payload)
          .reply(200, payload)

        const res = await scope.sharedAccount('accountId').operatorAccess('operatorAccessId').update(payload)

        expect(res).to.be.an('object')
        expect(res.name).to.deep.equal(payload.name)
      })

      it('should delete operator access', async () => {
        api.delete('/accounts/accountId/operatorAccess/operatorAccessId')
          .reply(204)
        const res = await scope.sharedAccount('accountId').operatorAccess('operatorAccessId').delete()

        expect(res).to.not.exist
      })
  }
  })
};

