/* eslint-env jasmine */
import Resource from '../../../src/resource/Resource'
import Property from '../../../src/entity/Property'
import mockApi from '../../helpers/apiMock'
import paths from '../../helpers/paths'
import { dummyScope, dummyResource, dummyEntity } from '../../helpers/dummy'
import { propertyTemplate, optionsTemplate } from '../../helpers/data'

const cb = () => {}
let propertyResource
let resource

describe('Property', () => {
  mockApi()

  describe('resourceFactory', () => {
    it('should only be allowed as a nested resource', () => {
      const scope = Object.assign(
        dummyScope(),
        Property.resourceFactory()
      )
      const wrongBase = () => scope.property()
      expect(wrongBase).toThrow()

      const resource = Object.assign(
        dummyResource(),
        Property.resourceFactory()
      )
      const resourceProperty = () => resource.property()
      expect(resourceProperty).not.toThrow()

      const entity = Object.assign(
        dummyEntity(),
        Property.resourceFactory()
      )
      const entityProperty = () => entity.property()
      expect(entityProperty).not.toThrow()
    })

    describe('valid', () => {
      beforeEach(() => {
        resource = Object.assign(dummyResource(), Property.resourceFactory())
      })

      it('should throw if property is not a string', () => {
        const numberResource = () => resource.property(1)
        expect(numberResource).toThrow()
      })

      it('should create new Property resource', () => {
        propertyResource = resource.property()
        expect(propertyResource instanceof Resource).toBe(true)
        expect(propertyResource.type).toBe(Property)
      })

      it('should add properties path', () => {
        propertyResource = resource.property()
        expect(propertyResource.path).toEqual(`${paths.dummy}${paths.properties}`)
      })

      it('should add property to path', () => {
        propertyResource = resource.property(propertyTemplate.key)
        expect(propertyResource.path)
          .toEqual(`${paths.dummy}${paths.properties}/${propertyTemplate.key}`)
      })

      describe('with normalization', () => {
        beforeEach(() => {
          propertyResource = resource.property(propertyTemplate.key)
          spyOn(Resource.prototype, 'create')
          spyOn(Resource.prototype, 'update')
        })

        ;['create', 'update'].forEach(method => {
          describe(method, () => {
            it('should support simple values', () => {
              propertyResource[method](1)
              expect(Resource.prototype[method]).toHaveBeenCalledWith([{ value: 1 }])

              propertyResource[method]('blue')
              expect(Resource.prototype[method]).toHaveBeenCalledWith([{ value: 'blue' }])

              propertyResource[method](true)
              expect(Resource.prototype[method]).toHaveBeenCalledWith([{ value: true }])
            })

            it('should support regular objects', () => {
              propertyResource[method](propertyTemplate)
              expect(Resource.prototype[method]).toHaveBeenCalledWith([propertyTemplate])
            })

            it('should support regular arrays', () => {
              const arrProp = [propertyTemplate, propertyTemplate]
              propertyResource[method](arrProp)
              expect(Resource.prototype[method]).toHaveBeenCalledWith(arrProp)
            })

            it('should support shorthand object update', () => {
              const shortHandProp = { foo: 'bar', bar: 'foo' }
              propertyResource[method](shortHandProp)
              expect(Resource.prototype[method]).toHaveBeenCalledWith([{
                key: 'foo',
                value: 'bar'
              }, {
                key: 'bar',
                value: 'foo'
              }])
            })

            it('should support options', () => {
              propertyResource[method](1, optionsTemplate)
              expect(Resource.prototype[method].calls.mostRecent().args[1])
                .toEqual(optionsTemplate)
            })

            it('should support callbacks', () => {
              propertyResource[method](1, cb)
              expect(Resource.prototype[method].calls.mostRecent().args[1])
                .toEqual(cb)

              propertyResource[method](1, {}, cb)
              expect(Resource.prototype[method].calls.mostRecent().args[2])
                .toEqual(cb)
            })
          })
        })
      })
    })
  })
})
