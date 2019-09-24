const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

const payload = { name: 'Test Thng', identifiers: { serial: '78fd6hsd' } }

module.exports = () => {
  describe('stream', () => {
    let operator

    before(async () => {
      operator = getScope('operator')
    })

    it('should stream Thngs once at a time', (done) => {
      mockApi().get('/thngs')
        .reply(
          200,
          [{ name: 'Thng 1' }, { name: 'Thng 2' }],
          {
            link: '<https%3A%2F%2Fapi.evrythng.com%2Fthngs%3FperPage%3D30%26sortOrder%3DDESCENDING%26nextPageToken%3DU7hXyw5DVQ8QT7fYsbyEpdAp>; rel="next"'
          }
        )
      mockApi().get('/thngs?perPage=30&sortOrder=DESCENDING&nextPageToken=U7hXyw5DVQ8QT7fYsbyEpdAp')
        .reply(
          200,
          [{ name: 'Thng 3' }, { name: 'Thng 4' }],
          {
            link: '<https%3A%2F%2Fapi.evrythng.com%2Fthngs%3FperPage%3D2%26sortOrder%3DDESCENDING%26nextPageToken%3DUprntQaysgRph8aRwFTAKPtn>; rel="next"'
          }
        )
      const cb = (item, index) => {
        expect(item.name).to.be.a('string')
        expect(index).to.be.a('number')

        if (index === 2) {
          done()
          return true
        }
      }

      operator.thng().stream(cb)
    })
  })
}
