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
    it('should NOT create a batch', async () => {
      const payload = { name: 'Test Batch' }
      try{
      api.post('/batches', payload)
        .reply(403, {status: 403})
      await scope.batch().create(payload)
      } catch (err) {
      caughtError = true;
      expect(err);
      }
      expect(caughtError).to.be.equal(true);
    })

    it('should NOT read all batches', async () => {
      try{
      api.get('/batches')
        .reply(200, [{ id: 'batchId' }])
      await scope.batch().read()

    } catch (err) {
      caughtError = true;
      expect(err);
      }
      expect(caughtError).to.be.equal(true);
    })

    it('should NOT read a batch', async () => {
      try{
      api.get('/batches/batchId')
        .reply(200, { id: 'batchId' })
       await scope.batch('batchId').read()

    } catch (err) {
      caughtError = true;
      expect(err);
      }
      expect(caughtError).to.be.equal(true);
    })

    it('should NOT update a batch', async () => {
      const payload = { tags: ['updated'] }
      try {
      api.put('/batches/batchId', payload)
        .reply(200, payload)
      const res = await scope.batch('batchId').update(payload)
    } catch (err) {
      caughtError = true;
      expect(err);
      }
      expect(caughtError).to.be.equal(true);
    })

    it('should NOT delete a batch', async () => {
      try {
      api.delete('/batches/batchId')
        .reply(200)
      await scope.batch('batchId').delete()
    } catch (err) {
      caughtError = true;
      expect(err);
      }
      expect(caughtError).to.be.equal(true);
    })
  }
  })
}
