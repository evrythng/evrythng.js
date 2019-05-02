const { expect } = require('chai')
const { getScope } = require('../util')

const PER_PAGE = 2
const NUM_TEST_THNGS = 5

module.exports = (scopeType) => {
  describe('pages', () => {
    let scope
    const thngs = []

    before(async () => {
      scope = getScope(scopeType)

      for (let i = 0; i < NUM_TEST_THNGS; i += 1) {
        thngs.push(await scope.thngs().create({ name: 'test' }))
      }
    })

    after(async () => {
      for (let i = 0; i < NUM_TEST_THNGS; i += 1) {
        await scope.thngs(thngs[i].id).delete()
      }
    })

    it('should read thngs through an async iterator', async () => {
      const params = { perPage: PER_PAGE }
      const it = scope.thngs().pages({ params })
      let page = await it.next()

      expect(page.value.length).to.equal(PER_PAGE)
      expect(page.done).to.equal(false)

      page = await it.next()

      expect(page.value.length).to.equal(PER_PAGE)
      expect(page.done).to.equal(false)
    })
  })
}
