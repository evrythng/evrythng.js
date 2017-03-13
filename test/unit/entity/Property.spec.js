/* eslint-env jasmine */
import Scope from '../../../src/scope/Scope'
import Resource from '../../../src/resource/Resource'
import Entity from '../../../src/entity/Entity'
import Property from '../../../src/entity/Property'

const path = '/foobar'
const scope = new Scope('apiKey')
const resource = new Resource(scope, path, Entity)
const entity = new Entity(resource)
const propertiesPath = '/properties'
const property = 'test'
let mixin

describe('Property', () => {
  describe('resourceFactory', () => {
    it('should only be allowed as a nested resource', () => {
      const scopeMixin = Object.assign({}, scope, Property.resourceFactory())
      const wrongBase = () => scopeMixin.property()
      expect(wrongBase).toThrow()
      delete scope.property

      const resourceMixin = Object.assign({}, resource, Property.resourceFactory())
      const resourceProperty = () => resourceMixin.property()
      expect(resourceProperty).not.toThrow()
      delete resource.property

      const entityMixin = Object.assign({}, entity, Property.resourceFactory())
      const entityProperty = () => entityMixin.property()
      expect(entityProperty).not.toThrow()
      delete entity.property
    })

    describe('valid', () => {
      beforeEach(() => {
        mixin = Object.assign({}, resource, Property.resourceFactory())
      })

      it('should throw if property is not a string', () => {
        const numberResource = () => mixin.property(() => 'test')
        expect(numberResource).toThrow()
      })

      it('should create new resource', () => {
        expect(mixin.property() instanceof Resource).toBe(true)
      })

      it('should add properties path', () => {
        const propertiesResource = mixin.property()
        expect(propertiesResource.path).toEqual(`${path}${propertiesPath}`)
      })

      it('should add property to path', () => {
        const propertiesResource = mixin.property(property)
        expect(propertiesResource.path).toEqual(`${path}${propertiesPath}/${property}`)
      })

      describe('with normalization', () => {
        let propertiesResource

        beforeEach(() => {
          propertiesResource = mixin.property(property)
          spyOn(Resource.prototype, 'create')
          spyOn(Resource.prototype, 'update')
        })

        ;['create', 'update'].forEach(method => {
          describe(method, () => {
            it('should support simple values', () => {
              propertiesResource[method](1)
              expect(Resource.prototype[method]).toHaveBeenCalledWith([{ value: 1 }])

              propertiesResource[method]('blue')
              expect(Resource.prototype[method]).toHaveBeenCalledWith([{ value: 'blue' }])

              propertiesResource[method](true)
              expect(Resource.prototype[method]).toHaveBeenCalledWith([{ value: true }])
            })

            it('should support regular objects', () => {
              const objProp = { value: 1 }
              propertiesResource[method](objProp)
              expect(Resource.prototype[method]).toHaveBeenCalledWith([objProp])
            })

            it('should support regular arrays', () => {
              const arrProp = [{ value: 1 }, { value: 2 }]
              propertiesResource[method](arrProp)
              expect(Resource.prototype[method]).toHaveBeenCalledWith(arrProp)
            })

            it('should support shorthand object update', () => {
              const shortHandProp = { foo: 'bar', test: 1 }
              propertiesResource[method](shortHandProp)
              expect(Resource.prototype[method]).toHaveBeenCalledWith([{
                key: 'foo',
                value: 'bar'
              }, {
                key: 'test',
                value: 1
              }])
            })
          })
        })
      })
    })
  })
})
