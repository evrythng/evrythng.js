const { expect } = require('chai')
const { getScope } = require('../util')

module.exports = () => {
  describe('Batches', () => {
    let operator, batch

    before(() => {
      operator = getScope('operator')
    })

    it('should create a batch', async () => {
      const payload = {
        name: 'Test Batch',
        customFields: {
          color: 'red',
          serial: Date.now()
        }
      }

      batch = await operator.batches().create(payload)

      expect(batch).to.be.an('object')
      expect(batch.customFields).to.deep.equal(payload.customFields)
    })

    it('should read all batches', async () => {
      const res = await operator.batches().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should read a batch', async () => {
      const res = await operator.batches(batch.id).read()

      expect(res).to.be.an('object')
      expect(res.id).to.equal(batch.id)
    })

    it('should update a batch', async () => {
      const payload = { tags: ['updated'] }
      const res = await operator.batches(batch.id).update(payload)

      expect(res).to.be.an('object')
      expect(res.tags).to.deep.equal(payload.tags)
    })

    it('should delete a batch', async () => {
      await operator.batches(batch.id).delete()
    })
  })
}
