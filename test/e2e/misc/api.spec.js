const { expect } = require('chai')
const { api } = require('evrythng')
const { mockApi } = require('../util')

const apiKey = process.env.OPERATOR_API_KEY

const _api = (url, method = 'get', data = {}) => api({ url, method, apiKey, data })

module.exports = () => {
  describe('api', () => {
    it('should read access information', async () => {
      mockApi().get('/access')
        .reply(200, { actor: { type: 'operator' } })
      const res = await _api('/access')

      expect(res).to.be.an('object')
      expect(res.actor.type).to.equal('operator')
    })

    it('should manipulate some resource', async () => {
      // Create
      const payload = { name: 'test' }
      mockApi().post('/thngs', payload)
        .reply(201, { id: 'thngId' })
      let res = await _api('/thngs', 'post', payload)

      expect(res.id).to.be.a('string')

      // Read
      mockApi().get('/thngs/thngId')
        .reply(200, { id: 'thngId' })
      res = await _api('/thngs/thngId')

      expect(res.id).to.be.a('string')

      // Update
      payload.name = 'updated'
      mockApi().put('/thngs/thngId', payload)
        .reply(200, payload)
      res = await _api('/thngs/thngId', 'put', payload)

      expect(res.name).to.equal(payload.name)

      // Delete
      mockApi().delete('/thngs/thngId')
        .reply(200)
      await _api('/thngs/thngId', 'delete')
    })

    it('should throw a native Error', async () => {
      const payload = { foo: 'bar' }
      mockApi().post('/thngs', payload)
        .reply(404, {
          errors: ['Thng was not found'],
          moreInfo: 'https://developers.evrythng.com',
          status: 404
        })
      try {
        await _api('/thngs', 'post', payload)

        throw new Error('Error was not raised by api()')
      } catch (e) {
        expect(e.message).to.be.a('string')

        const json = JSON.parse(e.message)
        expect(json.errors).to.be.an('array')
        expect(json.moreInfo).to.be.a('string')
        expect(json.status).to.be.a('number')
      }
    })
  })
}
