/* eslint-env jasmine */
import Resource from '../../../src/resource/Resource'
import Entity from '../../../src/entity/Entity'
import fetchMock from 'fetch-mock'
import mockApi from '../../helpers/apiMock'
import apiUrl from '../../helpers/apiUrl'
import paths from '../../helpers/paths'
import { dummyScope, dummyResource, dummyEntity } from '../../helpers/dummy'
import { entityTemplate } from '../../helpers/data'

let resource
let scope

describe('Resource', () => {
  mockApi()

  beforeEach(() => {
    scope = dummyScope()
  })

  describe('constructor', () => {
    it('should require Scope', () => {
      const emptyConstructor = () => new Resource()
      expect(emptyConstructor).toThrow()
    })

    it('should require a Scope instance', () => {
      const invalidScopeConstructor = () => new Resource(1)
      expect(invalidScopeConstructor).toThrow()
    })

    it('should require a path', () => {
      const noPathConstructor = () => new Resource(scope)
      expect(noPathConstructor).toThrow()
    })

    it('should store scope', () => {
      resource = new Resource(scope, paths.dummy)
      expect(resource.scope).toEqual(scope)
    })

    it('should store path', () => {
      resource = new Resource(scope, paths.dummy)
      expect(resource.path).toEqual(paths.dummy)
    })

    it('should allow missing preceding slash for path', () => {
      const simplePath = 'foobar'
      resource = new Resource(scope, simplePath)
      expect(resource.path).toEqual(`/${simplePath}`)
    })

    it('should store entity if passed', () => {
      resource = new Resource(scope, paths.dummy, Entity)
      expect(resource.type).toEqual(Entity)
    })
  })

  describe('serialize', () => {
    it('should return object if there is no Entity', () => {
      resource = new Resource(scope, paths.dummy)
      expect(resource.serialize()).toEqual({})
      expect(resource.serialize(entityTemplate)).toEqual(entityTemplate)
    })

    it('should return JSON representation if Entity', () => {
      resource = new Resource(scope, paths.dummy, Entity)
      const dummy = new Entity(resource, entityTemplate)
      expect(resource.serialize(dummy)).toEqual(entityTemplate)
    })
  })

  describe('deserialize', () => {
    it('should return payload if there is no Entity', () => {
      resource = new Resource(scope, paths.dummy)
      expect(resource.deserialize(entityTemplate)).toEqual(entityTemplate)
    })

    describe('with Entity', () => {
      beforeEach(() => {
        resource = new Resource(scope, paths.dummy, Entity)
      })

      it('should return new entity with body', () => {
        const res = resource.deserialize(entityTemplate)
        expect(res instanceof Entity).toBe(true)
        expect(res.foo).toEqual(entityTemplate.foo)
        expect(res.resource).toBeDefined()
        expect(res.resource.scope).toEqual(resource.scope)
        expect(res.resource.path).toEqual(resource.path)
      })

      it('should create new path if entity contains ID', () => {
        const newBody = { id: 'newEntity' }
        const res = resource.deserialize(newBody)
        expect(res.resource.path).toEqual(`${resource.path}/${newBody.id}`)
      })

      it('should add serialize method if Response object', done => {
        const response = new Response(JSON.stringify(entityTemplate))
        const res = resource.deserialize(response)

        res.deserialize().then(res => {
          expect(res.foo).toEqual(entityTemplate.foo)
          done()
        })
      })

      it('should deserialize every element if array', () => {
        const res = resource.deserialize([entityTemplate, entityTemplate])
        expect(res.length).toEqual(2)
        res.forEach(item => {
          expect(item instanceof Entity).toBe(true)
          expect(item.foo).toEqual(entityTemplate.foo)
        })
      })
    })
  })

  describe('CRUD', () => {
    beforeEach(() => {
      resource = new Resource(scope, paths.dummy, Entity)
    })

    describe('read', () => {
      describe('valid', () => {
        it('should send get request to path', done => {
          resource.read().then(() => {
            expect(fetchMock.lastUrl()).toEqual(apiUrl(paths.dummy))
            expect(fetchMock.lastOptions().method).toEqual('get')
            done()
          })
        })

        // Bellow is testing the internal _request method

        it('should deserialize response', done => {
          resource.read().then(res => {
            expect(res.length).toEqual(2)
            res.forEach(item => {
              expect(item instanceof Entity).toBe(true)
              expect(item.foo).toEqual(entityTemplate.foo)
            })
            done()
          })
        })

        it('should accept user options', done => {
          const headers = { accept: 'text/html' }
          resource.read({ headers }).then(() => {
            expect(fetchMock.lastOptions().headers.accept)
              .toEqual(headers.accept)
            done()
          })
        })

        it('should override user options with mandatory ones', done => {
          resource.read({ method: 'post' }).then(() => {
            expect(fetchMock.lastOptions().method).toEqual('get')
            done()
          })
        })

        it('should use scope apiKey', done => {
          resource.read().then(() => {
            expect(fetchMock.lastOptions().headers.authorization)
              .toEqual(scope.apiKey)
            done()
          })
        })

        it('should allow callback in first param', done => {
          const cb = jasmine.createSpy('callback')
          resource.read(cb).then(res => {
            expect(cb).toHaveBeenCalledWith(null, res)
            done()
          })
        })
      })
    })

    describe('create', () => {
      it('should require payload', () => {
        const noPayload = () => resource.create()
        expect(noPayload).toThrow()
      })

      describe('valid', () => {
        it('should send post request to path', done => {
          resource.create(entityTemplate).then(() => {
            expect(fetchMock.lastUrl()).toEqual(apiUrl(paths.dummy))
            expect(fetchMock.lastOptions().method).toEqual('post')
            expect(fetchMock.lastOptions().body).toEqual(entityTemplate)
            done()
          })
        })

        // Bellow is testing the internal _request method

        it('should serialize body', done => {
          const newEntity = new Entity(resource, entityTemplate)
          resource.create(newEntity).then(() => {
            expect(fetchMock.lastOptions().body).toEqual(entityTemplate)
            done()
          })
        })
      })
    })

    describe('update', () => {
      it('should require payload', () => {
        const noPayload = () => resource.update()
        expect(noPayload).toThrow()
      })

      describe('valid', () => {
        it('should send put request to path', done => {
          resource.update(entityTemplate).then(() => {
            expect(fetchMock.lastUrl()).toEqual(apiUrl(paths.dummy))
            expect(fetchMock.lastOptions().method).toEqual('put')
            done()
          })
        })
      })
    })

    describe('delete', () => {
      it('should send delete request to path', done => {
        resource.delete().then(() => {
          expect(fetchMock.lastUrl()).toEqual(apiUrl(paths.dummy))
          expect(fetchMock.lastOptions().method).toEqual('delete')
          done()
        })
      })
    })
  })

  describe('factoryFor', () => {
    it('should require entity', () => {
      const emptyFactory = () => Resource.factoryFor()
      expect(emptyFactory).toThrow()
    })

    describe('valid', () => {
      let factory = Resource.factoryFor(Entity, paths.dummy)
      let testMixin = { test: factory }
      let extendedScope
      let extendedEntity
      let extendedResource

      beforeEach(() => {
        extendedScope = Object.assign(dummyScope(), testMixin)
        extendedResource = Object.assign(dummyResource(), testMixin)
        extendedEntity = Object.assign(dummyEntity(), testMixin)
      })

      it('should return a factory function', () => {
        expect(factory).toEqual(jasmine.any(Function))
      })

      it('should create a resource for Entity', () => {
        expect(extendedScope.test() instanceof Resource).toBe(true)
      })

      it('should have scope of creator', () => {
        const res = extendedScope.test()
        expect(res.scope).toEqual(extendedScope)
      })

      it('should have provided path', () => {
        const res = extendedScope.test()
        expect(res.path).toEqual(paths.dummy)
      })

      it('should have entity type defined', () => {
        const res = extendedScope.test()
        expect(res.type).toEqual(Entity)
      })

      it('should allow to be attached on entities', () => {
        expect(extendedEntity.test() instanceof Resource).toBe(true)
      })

      it('should allow to be attached on resources', () => {
        expect(extendedResource.test() instanceof Resource).toBe(true)
      })

      it('should not allow non-string arguments', () => {
        const nonStringId = () => extendedScope.test({})
        expect(nonStringId).toThrow()
      })

      it('should add ID to path', () => {
        const id = 'id'
        const res = extendedScope.test(id)
        expect(res.path).toEqual(`${paths.dummy}/${id}`)
      })

      it('should allow extending the Resource with a Mixin', () => {
        const Mixin = C => class extends C {
          mixedIn () {}
        }
        factory = Resource.factoryFor(Entity, paths.dummy, Mixin)
        testMixin = { test: factory }
        extendedScope = Object.assign(dummyScope(), testMixin)
        expect(extendedScope.test().mixedIn).toBeDefined()
      })
    })
  })
})
