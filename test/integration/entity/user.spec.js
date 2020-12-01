const { expect } = require('chai')
const { resources, getScope, mockApi } = require('../util')

const USER = {
  firstName: 'Test',
  lastName: 'User',
  email: `test.user-${Date.now()}@evrythng.com`,
  password: 'password'
}

module.exports = (scopeType, url) => {
  describe('Application Users', () => {
    let scope, api

    before(() => {
      scope = getScope(scopeType)
      api =  mockApi(url)
    })

    if (scopeType === 'application') {
      it('should create an anonymous Application User', async () => {
        api.post('/auth/evrythng/users?anonymous=true')
          .reply(201, { id: 'anonUser', evrythngApiKey: 'evrythngApiKey' })
        api.get('/access')
          .reply(200, { actor: { id: 'anonUser'} })
          api.get('/users/anonUser')
          .reply(200, { id: 'anonUser'})
        const res = await scope.appUser().create({ anonymous: true })
        resources.anonUser = res

        expect(res).to.be.an('object')
        expect(res.id).to.equal('anonUser')
      })

      it('should create and validate a named user', async () => {
        api.post('/auth/evrythng/users', USER)
          .reply(201, { evrythngUser: 'evrythngUser', activationCode: 'code' })
          api.post('/auth/evrythng/users/evrythngUser/validate', { activationCode: 'code' })
          .reply(201, { id: 'evrythngUser', evrythngApiKey: 'evrythngApiKey' })
          api.get('/access')
          .reply(200, { actor: { id: 'evrythngUser'} })
          api.get('/users/evrythngUser')
          .reply(200, { id: 'evrythngUser'})
        const res = await scope.appUser().create(USER)
          .then(res => res.validate())
        resources.namedUser = res

        expect(res).to.be.an('object')
        expect(res.id).to.be.a('string')
      })

      it('should login a named user', async () => {
        const loginDocument = { email: USER.email, password: USER.password }

        api.post('/users/login', loginDocument)
          .reply(201, { id: 'evrythngUser', access: { apiKey: 'evrythngApiKey' } })
          api.get('/access')
          .reply(200, { actor: { id: 'evrythngUser'} })
          api.get('/users/evrythngUser')
          .reply(200, { id: 'evrythngUser'})
        const res = await scope.login(loginDocument)

        expect(res).to.be.an('object')
        expect(res.id).to.be.a('string')
      })

      it('should logout a named user', async () => {
        api.post('/auth/all/logout').reply(201, { logout: 'ok' })
        const res = await resources.namedUser.logout()

        expect(res).to.be.an('object')
        expect(res.logout).to.equal('ok')
      })
      return
    }

    it('should read an Application User', async () => {
      api.get('/users/evrythngUser')
        .reply(200, { id: 'evrythngUser'})
      const res = await scope.user('evrythngUser').read()

      expect(res).to.be.an('object')
      expect(res.id).to.equal('evrythngUser')
    })

    it('should read all Application Users', async () => {
      api.get('/users')
        .reply(200, [{ id: 'evrythngUser'}])
      const res = await scope.user().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should update an Application User', async () => {
      const payload = { firstName: 'updated' }
      api.put('/users/evrythngUser', payload)
        .reply(200, payload)
      const res = await scope.user('evrythngUser').update(payload)

      expect(res).to.be.an('object')
      expect(res.firstName).to.equal(payload.firstName)
    })

    it('should delete an Application User', async () => {
      api.delete('/users/evrythngUser')
        .reply(200)
      await scope.user('evrythngUser').delete()
    })
  })
}
