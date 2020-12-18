/* eslint-env jasmine */
import Resource from '../../../src/resource/Resource'
import Status from '../../../src/entity/Status'
import mockApi from '../../helpers/apiMock'
import paths from '../../helpers/paths'
import { dummyScope } from '../../helpers/dummy'

let statusResource
let scope

describe('Status', () => {
  mockApi()

  describe('resourceFactory', () => {
    beforeEach(() => {
      scope = Object.assign(dummyScope(), Status.resourceFactory())
    })

    it('should not allow single resource access', () => {
      const singleResource = () => scope.status('id')
      expect(singleResource).toThrow()
    })

    it('should create new Status resource', () => {
      statusResource = scope.status()
      expect(statusResource instanceof Resource).toBe(true)
      expect(statusResource.type).toBe(Status)
      expect(statusResource.path).toEqual(`${paths.status}`)
    })
  })
})
