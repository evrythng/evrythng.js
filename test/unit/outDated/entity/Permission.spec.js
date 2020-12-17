/* eslint-env jasmine */
import Resource from '../../../src/resource/Resource'
import Permission from '../../../src/entity/Permission'
import mockApi from '../../helpers/apiMock'
import paths from '../../helpers/paths'
import { dummyScope, dummyResource } from '../../helpers/dummy'

let permissionResource
let resource

describe('Permission', () => {
  mockApi()

  describe('resourceFactory', () => {
    beforeEach(() => {
      resource = Object.assign(dummyResource(), Permission.resourceFactory())
    })

    it('should not allow single resource access', () => {
      const singleResource = () => resource.permission('id')
      expect(singleResource).toThrow()
    })

    it('should not be allowed as top level resource (on Scopes)', () => {
      const scope = Object.assign(dummyScope(), Permission.resourceFactory())
      const topLevelResource = () => scope.permission()
      expect(topLevelResource).toThrow()
    })

    it('should create new Permission resource', () => {
      permissionResource = resource.permission()
      expect(permissionResource instanceof Resource).toBe(true)
      expect(permissionResource.type).toBe(Permission)
    })

    it('should add permissions path', () => {
      permissionResource = resource.permission()
      expect(permissionResource.path).toEqual(`${paths.dummy}${paths.permissions}`)
    })
  })
})
