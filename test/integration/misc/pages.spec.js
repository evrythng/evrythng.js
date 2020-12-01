const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType, url) => {
  describe('pages', () => {
    let scope, api

    before(async () => {
      scope = getScope(scopeType)
      api = mockApi(url)
    })

    it('should read thngs through an async iterator', async () => {
      const params = { perPage: 2 }
      const linkUrl = encodeURIComponent(url)
      const it = scope.thng().pages({ params })
      api.get('/thngs?perPage=2').reply(200, [{ name: 'Thng 1' }, { name: 'Thng 2' }], {
        link: `<${linkUrl}%2Fthngs%3FperPage%3D2%26sortOrder%3DDESCENDING%26nextPageToken%3DU7hXyw5DVQ8QT7fYsbyEpdAp>; rel="next"`
      })
      let page = await it.next()

      expect(page.value.length).to.equal(2)
      expect(page.done).to.equal(false)

      api
        .get('/thngs?perPage=2&sortOrder=DESCENDING&nextPageToken=U7hXyw5DVQ8QT7fYsbyEpdAp')
        .reply(200, [{ name: 'Thng 3' }, { name: 'Thng 4' }], {
          link: `<${linkUrl}<https%3A%2F%2Fapi.evrythng.com%2Fthngs%3FperPage%3D2%26sortOrder%3DDESCENDING%26nextPageToken%3DUprntQaysgRph8aRwFTAKPtn>; rel="next"`
        })
      page = await it.next()
      expect(page.value.length).to.equal(2)
      expect(page.done).to.equal(false)
    })
  })
}
