const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType) => {
  describe('pages', () => {
    let scope

    before(async () => {
      scope = getScope(scopeType)
    })

    it('should read thngs through an async iterator', async () => {
      const params = { perPage: 2 }
      const it = scope.thng().pages({ params })
      mockApi()
        .get('/thngs?perPage=2')
        .reply(200, [{ name: 'Thng 1' }, { name: 'Thng 2' }], {
          link:
            '<https%3A%2F%2Fapi.evrythng.com%2Fthngs%3FperPage%3D2%26sortOrder%3DDESCENDING%26nextPageToken%3DU7hXyw5DVQ8QT7fYsbyEpdAp>; rel="next"'
        })
      let page = await it.next()

      expect(page.value.length).to.equal(2)
      expect(page.done).to.equal(false)

      mockApi()
        .get('/thngs?perPage=2&sortOrder=DESCENDING&nextPageToken=U7hXyw5DVQ8QT7fYsbyEpdAp')
        .reply(200, [{ name: 'Thng 3' }, { name: 'Thng 4' }], {
          link:
            '<https%3A%2F%2Fapi.evrythng.com%2Fthngs%3FperPage%3D2%26sortOrder%3DDESCENDING%26nextPageToken%3DUprntQaysgRph8aRwFTAKPtn>; rel="next"'
        })
      page = await it.next()

      expect(page.value.length).to.equal(2)
      expect(page.done).to.equal(false)
    })
  })
}
