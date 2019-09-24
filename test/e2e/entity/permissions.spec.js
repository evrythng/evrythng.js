const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

const describeOperatorPermissionTests = () => {
  describe('Permissions (Operator Roles)', () => {
    let operator

    before(async () => {
      operator = getScope('operator')
    })

    it('should read all role permissions', async () => {
      mockApi().get('/roles/roleId/permissions')
        .reply(200, [{ name: 'global_read' }])
      const res = await operator.role('roleId').permission().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should read a single role permission', async () => {
      mockApi().get('/roles/roleId/permissions/global_read')
        .reply(200, { name: 'global_read' })
      const res = await operator.role('roleId').permission('global_read').read()

      expect(res).to.be.an('object')
      expect(res.name).to.equal('global_read')
    })

    it('should update a single role permission', async () => {
      const payload = { name: 'global_read', enabled: false }
      mockApi().put('/roles/roleId/permissions/global_read', payload)
        .reply(200, payload)
      const res = await operator.role('roleId').permission('global_read').update(payload)

      expect(res).to.be.an('object')
      expect(res.enabled).to.equal(false)
    })
  })
}

const describeAppUserPermissionTests = () => {
  describe('Permissions (App User Roles)', () => {
    let operator

    before(async () => {
      operator = getScope('operator')
    })

    it('should read all role permissions', async () => {
      mockApi().get('/roles/roleId/permissions')
        .reply(200, [{ access: 'cru', path: '/thngs' }])
      const res = await operator.role('roleId').permission().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should update role permissions', async () => {
      const payload = [{ path: '/thngs', access: 'cr' }]
      mockApi().put('/roles/roleId/permissions', payload)
        .reply(200, payload)
      const res = await operator.role('roleId').permission().update(payload)

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should minimise role permissions', async () => {
      const payload = []
      mockApi().put('/roles/roleId/permissions', payload)
        .reply(200, payload)
      const res = await operator.role('roleId').permission().update(payload)

      expect(res).to.be.an('array')
    })
  })
}

module.exports = (type) => {
  if (type === 'operator') {
    describeOperatorPermissionTests()
  }

  if (type === 'userInApp') {
    describeAppUserPermissionTests()
  }
}
