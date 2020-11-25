const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType, settings) => {
  describe('Batches', () => {
    let scope, api
    let caughtError = false;

    before(() => {
      scope = getScope(scopeType)
      api = mockApi(settings.apiUrl)
    })

    if(settings.apiVersion == 1) {
    it('should create a batch', async () => {
      const payload = { name: 'Test Batch' }
      api.post('/batches', payload)
        .reply(201, payload)
      const res = await scope.batch().create(payload)

      expect(res).to.be.an('object')
      expect(res.name).to.equal(payload.name)
    })

    it('should read all batches', async () => {
      api.get('/batches')
        .reply(200, [{ id: 'batchId' }])
      const res = await scope.batch().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should read a batch', async () => {
      api.get('/batches/batchId')
        .reply(200, { id: 'batchId' })
      const res = await scope.batch('batchId').read()

      expect(res).to.be.an('object')
      expect(res.id).to.equal('batchId')
    })

    it('should update a batch', async () => {
      const payload = { tags: ['updated'] }
      api.put('/batches/batchId', payload)
        .reply(200, payload)
      const res = await scope.batch('batchId').update(payload)

      expect(res).to.be.an('object')
      expect(res.tags).to.deep.equal(payload.tags)
    })

    it('should delete a batch', async () => {
      api.delete('/batches/batchId')
        .reply(200)
      await scope.batch('batchId').delete()
    })
  }
  if(settings.apiVersion == 2) {
    it.only('should NOT create a batch', async () => {
      const payload = { name: 'Test Batch' }
      try{
      api.post('/batches', payload)
        .reply(403, {status: 403})
      const res = await scope.batch().create(payload)
      } catch (err) {
      caughtError = true;
      console.log(err)
     expect(err[0]).to.have.members({status: 403})
      }
      expect(caughtError).to.be.equal(true);
    })

    it('should read all batches', async () => {
      api.get('/batches')
        .reply(200, [{ id: 'batchId' }])
      const res = await scope.batch().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should read a batch', async () => {
      api.get('/batches/batchId')
        .reply(200, { id: 'batchId' })
      const res = await scope.batch('batchId').read()

      expect(res).to.be.an('object')
      expect(res.id).to.equal('batchId')
    })

    it('should update a batch', async () => {
      const payload = { tags: ['updated'] }
      api.put('/batches/batchId', payload)
        .reply(200, payload)
      const res = await scope.batch('batchId').update(payload)

      expect(res).to.be.an('object')
      expect(res.tags).to.deep.equal(payload.tags)
    })

    it('should delete a batch', async () => {
      api.delete('/batches/batchId')
        .reply(200)
      await scope.batch('batchId').delete()
    })
  }
  })
}
