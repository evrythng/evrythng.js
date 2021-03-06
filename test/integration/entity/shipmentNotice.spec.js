const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

const noticePayload = {
  asnId: '2343689643',
  version: '1',
  issueDate: '2019-06-19T16:39:57-08:00',
  transportation: 'Expedited Freight',
  parties: [
    {
      id: 'gs1:414:01251',
      type: 'ship-from'
    },
    {
      name: 'The Landmark, Shop No. G14',
      type: 'ship-to',
      address: {
        street: '113-114, Central',
        city: 'Hong Kong'
      }
    }
  ],
  tags: ['ongoing']
}

module.exports = (scopeType, url) => {
  describe('Shipment Notices', () => {
    let scope, api

    before(() => {
      scope = getScope(scopeType)
      api = mockApi(url)
    })

    it('should create a shipment notice', async () => {
      api.post('/shipmentNotices', noticePayload).reply(201, noticePayload)

      const res = await scope.shipmentNotice().create(noticePayload)

      expect(res).to.be.an('object')
      expect(res.asnId).to.equal(noticePayload.asnId)
    })

    it('should read a shipment notice', async () => {
      api.get('/shipmentNotices/shipmentNoticeId').reply(200, noticePayload)

      const res = await scope.shipmentNotice('shipmentNoticeId').read()

      expect(res).to.be.an('object')
      expect(res.asnId).to.equal(noticePayload.asnId)
    })

    it('should update a shipment notice', async () => {
      api.put('/shipmentNotices/shipmentNoticeId').reply(200, noticePayload)

      const res = await scope.shipmentNotice('shipmentNoticeId').update(noticePayload)

      expect(res).to.be.an('object')
      expect(res.tags).to.deep.equal(noticePayload.tags)
    })

    it('should delete a shipment notice', async () => {
      api.delete('/shipmentNotices/shipmentNoticeId').reply(204)

      const res = await scope.shipmentNotice('shipmentNoticeId').delete()

      expect(res).to.not.exist
    })
  })
}
