/* eslint-env jasmine */
import Resource from '../../../src/resource/Resource'
import ReactorScript from '../../../src/entity/ReactorScript'
import mockApi from '../../helpers/apiMock'
import paths from '../../helpers/paths'
import { dummyScope, dummyResource } from '../../helpers/dummy'

let reactorScriptResource
let reactorScript
let scope

describe('ReactorScript', () => {
  mockApi()

  describe('resourceFactory', () => {
    beforeEach(() => {
      scope = Object.assign(dummyScope(), ReactorScript.resourceFactory())
    })

    it('should not allow single resource access', () => {
      const singleResource = () => scope.location('id')
      expect(singleResource).toThrow()
    })

    it('should create new Product resource', () => {
      reactorScriptResource = scope.reactorScript()
      expect(reactorScriptResource instanceof Resource).toBe(true)
      expect(reactorScriptResource.type).toBe(ReactorScript)
      expect(reactorScriptResource.path).toEqual(`${paths.reactorScript}`)
    })

    it('should have nested status resource', () => {
      expect(reactorScriptResource.status).toBeDefined()
    })
  })

  describe('access', () => {
    beforeEach(() => {
      reactorScript = new ReactorScript(dummyResource())
    })

    it('should have status resource', () => {
      expect(reactorScript.status).toBeDefined()
    })
  })
})
