const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = () => {
  describe('Batches', () => {
    let operator

    before(() => {
      operator = getScope('operator')
    })

    it('should create a batch', async () => {
      const payload = { name: 'Test Batch' }
      mockApi().post('/batches').reply(201, payload)
      const res = await operator.batch().create(payload)

      expect(res).to.be.an('object')
      expect(res.name).to.equal(payload.name)
    })

    it('should read all batches', async () => {
      mockApi()
        .get('/batches')
        .reply(200, [{ id: 'batchId' }])
      const res = await operator.batch().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should read a batch', async () => {
      mockApi().get('/batches/batchId').reply(200, { id: 'batchId' })
      const res = await operator.batch('batchId').read()

      expect(res).to.be.an('object')
      expect(res.id).to.equal('batchId')
    })

    it('should update a batch', async () => {
      const payload = { tags: ['updated'] }
      mockApi().put('/batches/batchId', payload).reply(200, payload)
      const res = await operator.batch('batchId').update(payload)

      expect(res).to.be.an('object')
      expect(res.tags).to.deep.equal(payload.tags)
    })

    it('should delete a batch', async () => {
      mockApi().delete('/batches/batchId').reply(200)
      await operator.batch('batchId').delete()
    })
  })
}
