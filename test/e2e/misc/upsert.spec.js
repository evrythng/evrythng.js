const chai = require('chai')
const { getScope } = require('../util')
const chaiAsPromised = require('chai-as-promised')

const { expect } = chai
chai.use(chaiAsPromised)

const payload = { name: 'Test Thng', identifiers: { serial: `s-${Date.now()}` } }

module.exports = () => {
  describe('upsert', () => {
    let operator, thng, duplicate, originalId

    before(async () => {
      operator = getScope('operator')
    })

    after(async () => {
      await operator.thng(thng.id).delete()
      await operator.thng(duplicate.id).delete()
    })

    it('should create a Thng', async () => {
      const res = await operator.thng().upsert(payload, payload.identifiers)
      originalId = `${res.id}`
      thng = res

      expect(res).to.be.an('object')
      expect(res.name).to.equal(payload.name)
      expect(res.identifiers).to.deep.equal(payload.identifiers)
    })

    it('should update the same Thng', async () => {
      payload.name = 'Updated Thng'
      const res = await operator.thng().upsert(payload, payload.identifiers)

      expect(res).to.be.an('object')
      expect(res.id).to.equal(originalId)
      expect(res.name).to.equal(payload.name)
      expect(res.createdAt).to.not.equal(res.updatedAt)
    })

    it('should refuse to update if more than one Thng is found', async () => {
      duplicate = await operator.thng().create(payload)

      const attempt = operator.thng().upsert(payload, payload.identifiers)
      return expect(attempt).to.eventually.be.rejected
    })

    it('should allow overriding with allowPlural', async () => {
      payload.name = 'Twice Updated Thng'
      const res = await operator.thng().upsert(payload, payload.identifiers, true)

      expect(res).to.be.an('object')
      expect(res.id).to.equal(duplicate.id)
      expect(res.name).to.equal(payload.name)
      expect(res.createdAt).to.not.equal(res.updatedAt)
    })
  })
}
