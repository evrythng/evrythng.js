const chai = require('chai')
const { getScope } = require('../util')
const chaiAsPromised = require('chai-as-promised')

const { expect } = chai
chai.use(chaiAsPromised)

const payload = { name: 'Test Thng', identifiers: { serial: `s-${Date.now()}` } }

module.exports = () => {
  describe('upsert', () => {
    let operator, thng1, thng2, thng3

    before(async () => {
      operator = getScope('operator')
    })

    after(async () => {
      await operator.thng(thng1.id).delete()
      await operator.thng(thng2.id).delete()
      await operator.thng(thng3.id).delete()
    })

    it('should create a Thng by identifiers', async () => {
      thng1 = await operator.thng().upsert(payload, payload.identifiers)

      expect(thng1).to.be.an('object')
      expect(thng1.name).to.equal(payload.name)
      expect(thng1.identifiers).to.deep.equal(payload.identifiers)
    })

    it('should update the same Thng by identifiers', async () => {
      payload.name = 'Updated Thng'
      const res = await operator.thng().upsert(payload, payload.identifiers)

      expect(res).to.be.an('object')
      expect(res.id).to.equal(thng1.id)
      expect(res.name).to.equal(payload.name)
      expect(res.createdAt).to.not.equal(res.updatedAt)
    })

    it('should refuse to update if more than one Thng is found', async () => {
      thng2 = await operator.thng().create(payload)

      const attempt = operator.thng().upsert(payload, payload.identifiers)
      return expect(attempt).to.eventually.be.rejected
    })

    it('should allow overriding with allowPlural', async () => {
      payload.name = 'Twice Updated Thng'
      const res = await operator.thng().upsert(payload, payload.identifiers, true)

      expect(res).to.be.an('object')
      expect(res.id).to.equal(thng2.id)
      expect(res.name).to.equal(payload.name)
      expect(res.createdAt).to.not.equal(res.updatedAt)
    })

    it('should create a Thng by name', async () => {
      payload.name = `Thng ${Date.now()}`
      thng3 = await operator.thng().upsert(payload, payload.name)

      expect(thng3).to.be.an('object')
      expect(thng3.name).to.equal(payload.name)
      expect(thng3.identifiers).to.deep.equal(payload.identifiers)
    })

    it('should update a Thng by name', async () => {
      payload.tags = ['test', 'tags']
      const res = await operator.thng().upsert(payload, payload.name)

      expect(res).to.be.an('object')
      expect(res.id).to.equal(thng3.id)
      expect(res.name).to.equal(payload.name)
      expect(res.createdAt).to.not.equal(res.updatedAt)
      expect(res.tags).to.deep.equal(payload.tags)
    })
  })
}
