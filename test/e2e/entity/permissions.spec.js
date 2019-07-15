const { expect } = require('chai')
const { getScope } = require('../util')

const describeOperatorPermissionTests = () => {
  describe('Permissions (Operator Roles)', () => {
    let operator, role

    before(async () => {
      operator = getScope('operator')
      role = await operator.role().create({ name: 'test role' })
    })

    after(async () => {
      await operator.role(role.id).delete()
    })

    it('should read all role permissions', async () => {
      const res = await operator.role(role.id).permission().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(2)
      expect(res[0].name).to.equal('global_read')
    })

    it('should read a single role permission', async () => {
      const name = 'global_read'
      const res = await operator.role(role.id).permission(name).read()

      expect(res).to.be.an('object')
      expect(res.name).to.equal(name)
    })

    it('should update a single role permission', async () => {
      const name = 'global_read'
      const payload = { name, enabled: false }
      const res = await operator.role(role.id).permission(name).update(payload)

      expect(res).to.be.an('object')
      expect(res.enabled).to.equal(false)
    })
  })
}

const describeAppUserPermissionTests = () => {
  describe('Permissions (App User Roles)', () => {
    let operator, role

    before(async () => {
      operator = getScope('operator')

      const payload = {
        name: 'test role',
        type: 'userInApp',
        version: 2
      }
      role = await operator.role().create(payload)
    })

    after(async () => {
      await operator.role(role.id).delete()
    })

    it('should read all role permissions', async () => {
      const res = await operator.role(role.id).permission().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(5)
    })

    it('should update role permissions', async () => {
      const payload = [{ path: '/thngs', access: 'cr' }]
      const res = await operator.role(role.id).permission().update(payload)

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(6)
    })

    it('should minimise role permissions', async () => {
      const payload = []
      const res = await operator.role(role.id).permission().update(payload)

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(5)
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
