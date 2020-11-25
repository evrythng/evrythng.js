const { expect } = require('chai')
const { getScope, mockApi } = require('../util')


module.exports = (scopeType, targetType) => {
  let scope, api

  describe(`Redirection (${targetType})`, () => {
    before(async () => {
      scope = getScope(scopeType)
    })

    it(`should create a ${targetType} redirection`, async () => {
      const payload = { defaultRedirectUrl: 'https://www.google.com' }
      mockApi('https://tn.gg').post('/redirections', payload)
        .reply(201, payload)
      const res = await scope[targetType]('targetId').redirection().create(payload)

      expect(res).to.be.an('object')
      expect(res.defaultRedirectUrl).to.be.a('string')
    })

    it(`should read a ${targetType} redirection`, async () => {
      mockApi('https://tn.gg').get('/redirections?evrythngId=targetId')
        .reply(200, [{ hits: 0 }])
      const res = await scope[targetType]('targetId').redirection().read()

      expect(res.hits).to.equal(0)
    })

    it(`should read a ${targetType} redirection with explicit shortDomain`, async () => {
      mockApi('https://abc.tn.gg').get('/redirections?evrythngId=targetId')
        .reply(200, [{ hits: 0 }])
      const res = await scope[targetType]('targetId').redirection('abc.tn.gg').read()

      expect(res.hits).to.equal(0)
    })

    it(`should update a ${targetType} redirection`, async () => {
      const payload = { defaultRedirectUrl: 'https://google.com/updated?item={shortId}' }
      mockApi('https://tn.gg').get('/redirections?evrythngId=targetId')
        .reply(200, [{ hits: 0, shortId: 'shortId' }])
      mockApi('https://tn.gg').put('/redirections/shortId', payload)
        .reply(200, payload)
      const res = await scope[targetType]('targetId').redirection().update(payload)

      expect(res).to.be.an('object')
    })

    it(`should delete a ${targetType} redirection`, async () => {
      mockApi('https://tn.gg').get('/redirections?evrythngId=targetId')
        .reply(200, [{ hits: 0, shortId: 'shortId' }])
      mockApi('https://tn.gg').delete('/redirections/shortId')
        .reply(200)
      const res = await scope[targetType]('targetId').redirection().delete()

      expect(res).to.not.exist
    })
  })
}
