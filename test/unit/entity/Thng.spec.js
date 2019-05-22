/* eslint-env jasmine */
import Resource from '../../../src/resource/Resource'
import Thng from '../../../src/entity/Thng'
import mockApi from '../../helpers/apiMock'
import paths from '../../helpers/paths'
import { dummyScope, dummyResource } from '../../helpers/dummy'
import { thngTemplate } from '../../helpers/data'

let thngResource
let thng

describe('Thng', () => {
  mockApi()

  describe('resourceFactory', () => {
    beforeEach(() => {
      const scope = Object.assign(dummyScope(), Thng.resourceFactory())
      thngResource = scope.thng(thngTemplate.id)
    })

    it('should create new Thng resource', () => {
      expect(thngResource instanceof Resource).toBe(true)
      expect(thngResource.type).toBe(Thng)
      expect(thngResource.path).toEqual(`${paths.thngs}/${thngTemplate.id}`)
    })

    it('should have nested property resource', () => {
      expect(thngResource.property).toBeDefined()
    })

    it('should have nested action resource', () => {
      expect(thngResource.action).toBeDefined()
    })
  })

  describe('access', () => {
    beforeEach(() => {
      thng = new Thng(dummyResource())
    })

    it('should have property resource', () => {
      expect(thng.property).toBeDefined()
    })

    it('should have action resource', () => {
      expect(thng.action).toBeDefined()
    })
  })
})
