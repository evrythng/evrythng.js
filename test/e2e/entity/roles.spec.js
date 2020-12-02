const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType) => {
  describe('Roles', () => {
    let scope

    before(() => {
      scope = getScope(scopeType)
    })

    it('should read all roles', async () => {
      mockApi()
        .get('/roles')
        .reply(200, [{ id: 'roleId' }])
      const res = await scope.role().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    if (scopeType === 'operator') {
      it('should create a role', async () => {
        const payload = { name: 'Test Role' }
        mockApi().post('/roles', payload).reply(201, payload)
        const res = await scope.role().create(payload)

        expect(res).to.be.an('object')
        expect(res.name).to.equal('Test Role')
      })

      it('should read a role', async () => {
        mockApi().get('/roles/roleId').reply(200, { id: 'roleId' })
        const res = await scope.role('roleId').read()

        expect(res).to.be.an('object')
        expect(res.id).to.equal('roleId')
      })

      it('should update a role', async () => {
        const payload = { description: 'updated' }
        mockApi().put('/roles/roleId', payload).reply(200, payload)
        const res = await scope.role('roleId').update(payload)

        expect(res).to.be.an('object')
        expect(res.description).to.equal(payload.description)
      })

      it('should delete a role', async () => {
        mockApi().delete('/roles/roleId').reply(200)
        await scope.role('roleId').delete()
      })
    }
  })
}
