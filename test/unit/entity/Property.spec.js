/* eslint-env jasmine */
import Resource from '../../../src/resource/Resource'
import Property from '../../../src/entity/Property'
import { dummyScope, dummyResource, dummyEntity } from '../../helpers/dummy'

const propertiesPath = '/properties'
const property = 'test'
let mixin

describe('Property', () => {
  describe('resourceFactory', () => {
    it('should only be allowed as a nested resource', () => {
      const scopeMixin = Object.assign(
        dummyScope(),
        Property.resourceFactory()
      )
      const wrongBase = () => scopeMixin.property()
      expect(wrongBase).toThrow()

      const resourceMixin = Object.assign(
        dummyResource(),
        Property.resourceFactory()
      )
      const resourceProperty = () => resourceMixin.property()
      expect(resourceProperty).not.toThrow()

      const entityMixin = Object.assign(
        dummyEntity(),
        Property.resourceFactory()
      )
      const entityProperty = () => entityMixin.property()
      expect(entityProperty).not.toThrow()
    })

    describe('valid', () => {
      let resourcePath

      beforeEach(() => {
        const resource = dummyResource()
        resourcePath = resource.path
        mixin = Object.assign(resource, Property.resourceFactory())
      })

      it('should throw if property is not a string', () => {
        const numberResource = () => mixin.property(() => 'test')
        expect(numberResource).toThrow()
      })

      it('should create new Property resource', () => {
        const propertyResource = mixin.property()
        expect(propertyResource instanceof Resource).toBe(true)
        expect(propertyResource.type).toBe(Property)
      })

      it('should add properties path', () => {
        const propertyResource = mixin.property()
        expect(propertyResource.path).toEqual(`${resourcePath}${propertiesPath}`)
      })

      it('should add property to path', () => {
        const propertyResource = mixin.property(property)
        expect(propertyResource.path).toEqual(`${resourcePath}${propertiesPath}/${property}`)
      })

      describe('with normalization', () => {
        let propertyResource

        beforeEach(() => {
          propertyResource = mixin.property(property)
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
              const objProp = { value: 1 }
              propertyResource[method](objProp)
              expect(Resource.prototype[method]).toHaveBeenCalledWith([objProp])
            })

            it('should support regular arrays', () => {
              const arrProp = [{ value: 1 }, { value: 2 }]
              propertyResource[method](arrProp)
              expect(Resource.prototype[method]).toHaveBeenCalledWith(arrProp)
            })

            it('should support shorthand object update', () => {
              const shortHandProp = { foo: 'bar', test: 1 }
              propertyResource[method](shortHandProp)
              expect(Resource.prototype[method]).toHaveBeenCalledWith([{
                key: 'foo',
                value: 'bar'
              }, {
                key: 'test',
                value: 1
              }])
            })

            it('should support options', () => {
              const options = { fullResponse: true }
              propertyResource[method](1, options)
              expect(Resource.prototype[method].calls.mostRecent().args[1])
                .toEqual(options)
            })

            it('should support callbacks', () => {
              const cb = () => {}
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
