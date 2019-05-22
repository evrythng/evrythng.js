/* eslint-env jasmine */
import Resource from '../../../src/resource/Resource'
import User from '../../../src/entity/User'
import mockApi from '../../helpers/apiMock'
import paths from '../../helpers/paths'
import { dummyScope } from '../../helpers/dummy'
import { userTemplate } from '../../helpers/data'

let userResource

describe('User', () => {
  mockApi()

  describe('resourceFactory', () => {
    beforeEach(() => {
      const scope = Object.assign(dummyScope(), User.resourceFactory())
      userResource = scope.user(userTemplate.id)
    })

    it('should create new Product resource', () => {
      expect(userResource instanceof Resource).toBe(true)
      expect(userResource.type).toBe(User)
      expect(userResource.path).toEqual(`${paths.users}/${userTemplate.id}`)
    })
  })
})
