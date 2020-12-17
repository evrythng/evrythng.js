const chai = require('chai')
const { getScope, mockApi } = require('../util')
const chaiAsPromised = require('chai-as-promised')

const { expect } = chai
chai.use(chaiAsPromised)

const payload = { name: 'Test Thng', identifiers: { serial: '8230947' } }

module.exports = (scopeType, url) => {
  describe('upsert', () => {
    let scope, api

    before(async () => {
      scope = getScope(scopeType)
      api = mockApi(url)
    })

    it('should create a Thng by identifiers', async () => {
      api.get('/thngs?filter=identifiers.serial%3D8230947').reply(200, [])
      api.post('/thngs', payload).reply(201, payload)
      const res = await scope.thng().upsert(payload, payload.identifiers)

      expect(res).to.be.an('object')
      expect(res.name).to.equal(payload.name)
      expect(res.identifiers).to.deep.equal(payload.identifiers)
    })

    it('should update the same Thng by identifiers', async () => {
      payload.name = 'Updated Thng'
      api
        .get('/thngs?filter=identifiers.serial%3D8230947')
        .reply(200, [{ id: 'thngId', name: 'Updated Thng' }])
      api.put('/thngs/thngId', payload).reply(200, payload)
      const res = await scope.thng().upsert(payload, payload.identifiers)

      expect(res).to.be.an('object')
      expect(res.name).to.equal(payload.name)
    })

    it('should refuse to update if more than one Thng is found', async () => {
      api
        .get('/thngs?filter=identifiers.serial%3D8230947')
        .reply(200, [{ id: 'thngId' }, { id: 'thngId2' }])
      const attempt = scope.thng().upsert(payload, payload.identifiers)
      return expect(attempt).to.eventually.be.rejected
    })

    it('should allow overriding with allowPlural', async () => {
      payload.name = 'Twice Updated Thng'
      api
        .get('/thngs?filter=identifiers.serial%3D8230947')
        .reply(200, [{ id: 'thngId' }, { id: 'thngId2' }])
      api.put('/thngs/thngId', payload).reply(200, { id: 'thngId' })
      const res = await scope.thng().upsert(payload, payload.identifiers, true)

      expect(res).to.be.an('object')
      expect(res.id).to.equal('thngId')
    })

    it('should create a Thng by name', async () => {
      payload.name = 'New Thng Name'
      api.get('/thngs?filter=name%3DNew%20Thng%20Name').reply(200, [])
      api.post('/thngs', payload).reply(200, { id: 'thngId', name: 'New Thng Name' })
      const res = await scope.thng().upsert(payload, payload.name)

      expect(res).to.be.an('object')
      expect(res.name).to.equal(payload.name)
    })

    it('should update a Thng by name', async () => {
      payload.tags = ['test', 'tags']
      api.get('/thngs?filter=name%3DNew%20Thng%20Name').reply(200, [{ id: 'thngId' }])
      api.put('/thngs/thngId', payload).reply(200, payload)
      const res = await scope.thng().upsert(payload, payload.name)

      expect(res).to.be.an('object')
      expect(res.name).to.equal(payload.name)
      expect(res.tags).to.deep.equal(payload.tags)
    })
  })
}
