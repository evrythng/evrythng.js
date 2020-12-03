const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = () => {
  describe('streamPages', () => {
    let operator

    before(async () => {
      operator = getScope('operator')
    })

    it('should stream pages of Thngs', (done) => {
      mockApi()
        .get('/thngs')
        .reply(200, [{ name: 'Thng 1' }, { name: 'Thng 2' }], {
          link:
            '<https%3A%2F%2Fapi.evrythng.com%2Fthngs%3FperPage%3D30%26sortOrder%3DDESCENDING%26nextPageToken%3DU7hXyw5DVQ8QT7fYsbyEpdAp>; rel="next"'
        })
      mockApi()
        .get('/thngs?perPage=30&sortOrder=DESCENDING&nextPageToken=U7hXyw5DVQ8QT7fYsbyEpdAp')
        .reply(200, [{ name: 'Thng 3' }, { name: 'Thng 4' }], {
          link:
            '<https%3A%2F%2Fapi.evrythng.com%2Fthngs%3FperPage%3D2%26sortOrder%3DDESCENDING%26nextPageToken%3DUprntQaysgRph8aRwFTAKPtn>; rel="next"'
        })
      const eachPageCb = (page, totalSoFar) => {
        expect(page.length).to.equal(2)

        const [item] = page
        expect(item.name).to.be.a('string')

        if (totalSoFar === 2) {
          done()
          return true
        }
      }

      operator.thng().streamPages(eachPageCb)
    })
  })
}
