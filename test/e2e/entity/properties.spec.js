const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType, targetType) => {
  let scope

  describe(`Properties (${targetType})`, () => {
    before(async () => {
      scope = getScope(scopeType)
    })

    it(`should create a ${targetType} property`, async () => {
      const payload = { key: 'temp_c', value: 42 }
      mockApi().post(`/${targetType}s/targetId/properties`).reply(200, [payload])
      const res = await scope[targetType]('targetId').property().create(payload)

      expect(res).to.be.an('array')
      expect(res).to.have.length(1)
    })

    it(`should read all ${targetType} properties`, async () => {
      mockApi()
        .get(`/${targetType}s/targetId/properties`)
        .reply(200, [{ key: 'temp_c', value: 42 }])
      const res = await scope[targetType]('targetId').property().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length(1)
    })

    it(`should read a single ${targetType} property`, async () => {
      mockApi()
        .get(`/${targetType}s/targetId/properties/temp_c`)
        .reply(200, [{ value: 42 }])
      const res = await scope[targetType]('targetId').property('temp_c').read()

      expect(res).to.be.an('array')
      expect(res).to.have.length(1)
    })

    it(`should update a single ${targetType} property`, async () => {
      mockApi()
        .put(`/${targetType}s/targetId/properties/temp_c`, [{ value: 43 }])
        .reply(200, [{ value: 43 }])
      const res = await scope[targetType]('targetId').property('temp_c').update(43)

      expect(res).to.be.an('array')
      expect(res[0].value).to.equal(43)
    })

    if (scopeType !== 'anonUser') {
      it(`should delete a single ${targetType} property`, async () => {
        mockApi().delete(`/${targetType}s/targetId/properties/temp_c`).reply(200)
        await scope[targetType]('targetId').property('temp_c').delete()
      })
    }
  })
}
