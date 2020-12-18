const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

const payload = {
  name: 'accessTokens',
  description: 'create accessTokens',
  policies: ['UPb7E6shapktcaaabfahfpds'],
  conditions: [],
  tags: ['operatorAccess'],
  identifiers: {},
  customFields: {}
}

module.exports = (scopeType, settings) => {
  describe('AccessTokens', () => {
    let scope, api

    before(async () => {
      scope = getScope(scopeType)
      api = mockApi(settings.apiUrl)
    })

    if (settings.apiVersion == 2) {
      it('should create access token', async () => {
        api.post('/accessTokens', payload).reply(201, { id: 'accessTokenId' })
        const res = await scope.accessToken().create(payload)

        expect(res).to.be.an('object')
        expect(res.id).to.be.a('string')
      })

      it('should read access token by id', async () => {
        api.get('/accessTokens/accessTokenId').reply(200, { id: 'accessTokenId' })
        const res = await scope.accessToken('accessTokenId').read()

        expect(res).to.be.an('object')
        expect(res.id).to.be.a('string')
      })

      it('should read all accessTokens', async () => {
        api.get('/accessTokens').reply(200, [payload])
        const res = await scope.accessToken().read()

        expect(res).to.be.an('array')
        expect(res).to.have.length.gte(1)
      })

      it('should update accessToken', async () => {
        api.put('/accessTokens/accessTokenId', payload).reply(200, payload)

        const res = await scope.accessToken('accessTokenId').update(payload)

        expect(res).to.be.an('object')
        expect(res.name).to.deep.equal(payload.name)
      })

      it('should delete access policy', async () => {
        api.delete('/accessTokens/accessTokenId').reply(204)
        const res = await scope.accessToken('accessTokenId').delete()

        expect(res).to.not.exist
      })
    }
  })
}
