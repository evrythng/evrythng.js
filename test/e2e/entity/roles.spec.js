const { expect } = require('chai')
const { getScope } = require('../util')

module.exports = (scopeType) => {
  describe('Roles', () => {
    let scope, role

    before(() => {
      scope = getScope(scopeType)
    })

    it('should read all roles', async () => {
      const res = await scope.role().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(0)
    })

    if (scopeType === 'operator') {
      it('should create a role', async () => {
        const payload = { name: 'Test Role' }
        role = await scope.role().create(payload)

        expect(role).to.be.an('object')
        expect(role.name).to.equal(payload.name)
      })

      it('should read a role', async () => {
        const res = await scope.role(role.id).read()

        expect(res).to.be.an('object')
        expect(res.id).to.equal(role.id)
      })

      it('should update a role', async () => {
        const payload = { description: 'updated' }
        const res = await scope.role(role.id).update(payload)

        expect(res).to.be.an('object')
        expect(res.description).to.deep.equal(payload.description)
      })

      it('should delete a role', async () => {
        await scope.role(role.id).delete()
      })
    }
  })
}
