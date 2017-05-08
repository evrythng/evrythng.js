/* eslint-env jasmine */
import Resource from '../../../src/resource/Resource'
import AppUser from '../../../src/entity/AppUser'
import mockApi from '../../helpers/apiMock'
import paths from '../../helpers/paths'
import { dummyScope } from '../../helpers/dummy'
import { appUserTemplate } from '../../helpers/data'

let appUserResource

describe('AppUser', () => {
  mockApi()

  describe('resourceFactory', () => {
    beforeEach(() => {
      const scope = Object.assign(dummyScope(), AppUser.resourceFactory())
      appUserResource = scope.appUser(appUserTemplate.id)
    })

    it('should create new Product resource', () => {
      expect(appUserResource instanceof Resource).toBe(true)
      expect(appUserResource.type).toBe(AppUser)
      expect(appUserResource.path).toEqual(`${paths.appUsers}/${appUserTemplate.id}`)
    })
  })
})
