const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType, url) => {
  describe('Roles', () => {
    let scope, api

    before(() => {
      scope = getScope(scopeType)
      api = mockApi(url)
    })

    it('should read all roles', async () => {
      api.get('/roles').reply(200, [{ id: 'roleId' }])
      const res = await scope.role().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    if (scopeType === 'operator') {
      it('should create a role', async () => {
        const payload = { name: 'Test Role' }
        api.post('/roles', payload).reply(201, payload)
        const res = await scope.role().create(payload)

        expect(res).to.be.an('object')
        expect(res.name).to.equal('Test Role')
      })

      it('should read a role', async () => {
        api.get('/roles/roleId').reply(200, { id: 'roleId' })
        const res = await scope.role('roleId').read()

        expect(res).to.be.an('object')
        expect(res.id).to.equal('roleId')
      })

      it('should update a role', async () => {
        const payload = { description: 'updated' }
        api.put('/roles/roleId', payload).reply(200, payload)
        const res = await scope.role('roleId').update(payload)

        expect(res).to.be.an('object')
        expect(res.description).to.equal(payload.description)
      })

      it('should delete a role', async () => {
        api.delete('/roles/roleId').reply(200)
        await scope.role('roleId').delete()
      })
    }
  })
}
