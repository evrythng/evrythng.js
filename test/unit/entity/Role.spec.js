/* eslint-env jasmine */
import Resource from '../../../src/resource/Resource'
import Role from '../../../src/entity/Role'
import mockApi from '../../helpers/apiMock'
import paths from '../../helpers/paths'
import { dummyScope, dummyResource } from '../../helpers/dummy'
import { roleTemplate } from '../../helpers/data'

let roleResource
let role

describe('Role', () => {
  mockApi()

  describe('resourceFactory', () => {
    beforeEach(() => {
      const scope = Object.assign(dummyScope(), Role.resourceFactory())
      roleResource = scope.role(roleTemplate.id)
    })

    it('should create new Product resource', () => {
      expect(roleResource instanceof Resource).toBe(true)
      expect(roleResource.type).toBe(Role)
      expect(roleResource.path).toEqual(`${paths.roles}/${roleTemplate.id}`)
    })

    it('should have nested permission resource', () => {
      expect(roleResource.permission).toBeDefined()
    })
  })

  describe('access', () => {
    beforeEach(() => {
      role = new Role(dummyResource())
    })

    it('should have permission resource', () => {
      expect(role.permission).toBeDefined()
    })
  })
})
