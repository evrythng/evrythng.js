const { expect } = require('chai')
const { getScope } = require('../util')

const payload = { name: 'Test Thng', identifiers: { serial: '78fd6hsd' } }

module.exports = () => {
  describe('stream', () => {
    let operator, thng, thng2

    before(async () => {
      operator = getScope('operator')

      thng = await operator.thng().create(payload)
      thng2 = await operator.thng().create(payload)
    })

    after(async () => {
      await operator.thng(thng.id).delete()
      await operator.thng(thng2.id).delete()
    })

    it('should stream Thngs once at a time', (done) => {
      const cb = (item, index) => {
        expect(item.id).to.have.length(24)

        if (index === 2) {
          done()
          return true
        }
      }

      operator.thng().stream(cb)
    })
  })
}
