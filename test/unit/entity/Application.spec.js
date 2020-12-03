/* eslint-env jasmine */
import Resource from '../../../src/resource/Resource'
import Application from '../../../src/entity/Application'
import mockApi from '../../helpers/apiMock'
import paths from '../../helpers/paths'
import { dummyScope, dummyResource, dummyEntity } from '../../helpers/dummy'
import { applicationTemplate } from '../../helpers/data'

let applicationResource
let application

describe('Application', () => {
  mockApi()

  describe('resourceFactory', () => {
    it('should only be allowed as a nested resource', () => {
      const scope = Object.assign(dummyScope(), Application.resourceFactory())
      const wrongBase = () => scope.application()
      expect(wrongBase).toThrow()

      const resource = Object.assign(dummyResource(), Application.resourceFactory())
      const resourceProperty = () => resource.application()
      expect(resourceProperty).not.toThrow()

      const entity = Object.assign(dummyEntity(), Application.resourceFactory())
      const entityProperty = () => entity.application()
      expect(entityProperty).not.toThrow()
    })

    describe('valid', () => {
      beforeEach(() => {
        const resource = Object.assign(dummyResource(), Application.resourceFactory())
        applicationResource = resource.application(applicationTemplate.id)
      })

      it('should create new Product resource', () => {
        expect(applicationResource instanceof Resource).toBe(true)
        expect(applicationResource.type).toBe(Application)
        expect(applicationResource.path).toEqual(
          `${paths.dummy}${paths.applications}/${applicationTemplate.id}`
        )
      })

      it('should have nested reactorScript resource', () => {
        expect(applicationResource.reactorScript).toBeDefined()
      })

      it('should have nested reactorSchedule resource', () => {
        expect(applicationResource.reactorSchedule).toBeDefined()
      })

      it('should have nested reactorLog resource', () => {
        expect(applicationResource.reactorLog).toBeDefined()
      })
    })
  })

  describe('access', () => {
    beforeEach(() => {
      application = new Application(dummyResource())
    })

    it('should have reactorScript resource', () => {
      expect(application.reactorScript).toBeDefined()
    })

    it('should have reactorSchedule resource', () => {
      expect(application.reactorSchedule).toBeDefined()
    })

    it('should have reactorLog resource', () => {
      expect(application.reactorLog).toBeDefined()
    })
  })
})
