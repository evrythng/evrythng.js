const { expect } = require('chai')
const { api } = require('../../../')
const { mockApi } = require('../util')

const apiKey = process.env.OPERATOR_API_KEY

const _api = (url, method = 'get', data, opts) => api({ ...opts, url, method, apiKey, data })

module.exports = (settings) => {
  describe('api', () => {
    let apiMock

    before(async () => {
      apiMock = mockApi(settings.apiUrl)
    })

    it('should read access information', async () => {
      apiMock.get('/access').reply(200, { actor: { type: 'operator' } })
      const res = await _api('/access')

      expect(res).to.be.an('object')
      expect(res.actor.type).to.equal('operator')
    })

    if (settings.apiVersion == 2) {
      it('should read access information with /me', async () => {
        apiMock.get('/me').reply(200, { actor: { type: 'operator' } })
        const res = await _api('/me')

        expect(res).to.be.an('object')
        expect(res.actor.type).to.equal('operator')
      })
    }

    it('should manipulate some resource', async () => {
      // Create
      const payload = { name: 'test' }
      apiMock.post('/thngs', payload).reply(201, { id: 'thngId' })
      let res = await _api('/thngs', 'post', payload)

      expect(res.id).to.be.a('string')

      // Read
      apiMock.get('/thngs/thngId').reply(200, { id: 'thngId' })
      res = await _api('/thngs/thngId')

      expect(res.id).to.be.a('string')

      // Update
      payload.name = 'updated'
      apiMock.put('/thngs/thngId', payload).reply(200, payload)
      res = await _api('/thngs/thngId', 'put', payload)

      expect(res.name).to.equal(payload.name)

      // Delete
      apiMock.delete('/thngs/thngId').reply(200)
      await _api('/thngs/thngId', 'delete')
    })

    it('should return full response for success', async () => {
      const payload = { name: 'bar' }
      apiMock.post('/thngs', payload).reply(201, payload)

      const res = await _api('/thngs', 'post', payload, { fullResponse: true })
      expect(res.status).to.equal(201)
      expect(res.statusText).to.equal('Created')
      expect(res.headers).to.not.equal(undefined)
    })

    it('should return full response for failure', async () => {
      const payload = { foo: 'bar' }
      const errObj = {
        errors: ['thng.name cannot be blank'],
        moreInfo: 'https://developers.evrythng.com',
        status: 400
      }
      apiMock.post('/thngs', payload).reply(400, errObj)

      const res = await _api('/thngs', 'post', payload, { fullResponse: true })
      expect(res.status).to.equal(400)
      expect(res.statusText).to.equal('Bad Request')
      expect(res.headers).to.not.equal(undefined)

      const json = await res.json()
      expect(json).to.deep.equal(errObj)
    })

    it('should throw a native Error', async () => {
      let caughtError = false
      const errObj = {
        errors: ['Thng was not found'],
        moreInfo: 'https://developers.evrythng.com',
        status: 404
      }
      apiMock.get('/thngs/foo').reply(404, errObj)

      try {
        await _api('/thngs/foo', 'get')

        throw new Error('Error was not raised by api()')
      } catch (e) {
        caughtError = true
        expect(e.message).to.be.a('string')

        const json = JSON.parse(e.message)
        expect(json).to.deep.equal(errObj)
      }
      expect(caughtError).to.be.equal(true)
    })

    it('should throw a native Error when HTML is returned', async () => {
      let caughtError = false
      apiMock.get('/thngs/foo').reply(404, '<html><title>Apache Error 500</title></html>')

      try {
        await _api('/thngs/foo', 'get')

        throw new Error('Error was not raised by api()')
      } catch (e) {
        caughtError = true
        expect(e.message).to.be.a('string')
        expect(e.message).to.deep.equal(
          'Unexpected non-JSON response: <html><title>Apache Error 500</title></html>'
        )
      }
      expect(caughtError).to.be.equal(true)
    })
  })
}
