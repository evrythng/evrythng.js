/* eslint-env jasmine */
import fetchMock from 'fetch-mock'
import apiUrl from '../../helpers/apiUrl'
import Scope from '../../../src/scope/Scope'
import Resource from '../../../src/resource/Resource'
import Entity from '../../../src/entity/Entity'

const apiKey = 'apiKey'
const path = '/foobar'
const scope = new Scope(apiKey)
const body = {
  foo: 'bar'
}
let resource

describe('Resource', () => {
  describe('constructor', () => {
    it('should require Scope', () => {
      const emptyConstructor = () => new Resource()
      expect(emptyConstructor).toThrow()
    })

    it('should require a Scope instance', () => {
      const invalidScopeConstructor = () => new Resource(() => {})
      expect(invalidScopeConstructor).toThrow()
    })

    it('should require a path', () => {
      const noPathConstructor = () => new Resource(scope)
      expect(noPathConstructor).toThrow()
    })

    it('should store scope', () => {
      resource = new Resource(scope, path)
      expect(resource.scope).toEqual(scope)
    })

    it('should store path', () => {
      resource = new Resource(scope, path)
      expect(resource.path).toEqual(path)
    })

    it('should allow missing preceding slash for path', () => {
      const simplePath = 'foobar'
      resource = new Resource(scope, simplePath)
      expect(resource.path).toEqual(`/${simplePath}`)
    })

    it('should store entity if passed', () => {
      resource = new Resource(scope, path, Entity)
      expect(resource.entity).toEqual(Entity)
    })
  })

  describe('serialize', () => {
    it('should return object if there is no Entity', () => {
      resource = new Resource(scope, path)
      expect(resource.serialize()).toEqual({})
      expect(resource.serialize(body)).toEqual(body)
    })

    it('should return JSON representation if Entity', () => {
      resource = new Resource(scope, path, Entity)
      const dummy = new Entity(resource, body)
      expect(resource.serialize(dummy)).toEqual(body)
    })
  })

  describe('deserialize', () => {
    it('should return payload if there is no Entity', () => {
      resource = new Resource(scope, path)
      expect(resource.deserialize(body)).toEqual(body)
    })

    describe('with Entity', () => {
      beforeEach(() => {
        resource = new Resource(scope, path, Entity)
      })

      it('should return new entity with body', () => {
        const res = resource.deserialize(body)
        expect(res instanceof Entity).toBe(true)
        expect(res.foo).toEqual(body.foo)
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
        const response = new Response(JSON.stringify(body))
        const res = resource.deserialize(response)

        res.deserialize().then(res => {
          expect(res.foo).toEqual(body.foo)
          done()
        })
      })

      it('should deserialize every element if array', () => {
        const res = resource.deserialize([body, body])
        expect(res.length).toEqual(2)
        res.forEach(item => {
          expect(item instanceof Entity).toBe(true)
          expect(item.foo).toEqual(body.foo)
        })
      })
    })
  })

  describe('CRUD', () => {
    afterAll(fetchMock.restore)

    beforeEach(() => {
      resource = new Resource(scope, path, Entity)
    })

    describe('read', () => {
      describe('valid', () => {
        beforeAll(() => {
          fetchMock.get(apiUrl(path), [body, body])
        })

        it('should send get request to path', done => {
          resource.read().then(() => {
            expect(fetchMock.lastUrl()).toEqual(apiUrl(path))
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
              expect(item.foo).toEqual(body.foo)
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
              .toEqual(apiKey)
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
        beforeAll(() => {
          fetchMock.post(apiUrl(path), body)
        })

        it('should send post request to path', done => {
          resource.create(body).then(() => {
            expect(fetchMock.lastUrl()).toEqual(apiUrl(path))
            expect(fetchMock.lastOptions().method).toEqual('post')
            expect(fetchMock.lastOptions().body).toEqual(body)
            done()
          })
        })

        // Bellow is testing the internal _request method

        it('should serialize body', done => {
          const newEntity = new Entity(resource, body)
          resource.create(newEntity).then(() => {
            expect(fetchMock.lastOptions().body).toEqual(body)
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
        beforeAll(() => {
          fetchMock.put(apiUrl(path), body)
        })

        it('should send put request to path', done => {
          resource.update(body).then(() => {
            expect(fetchMock.lastUrl()).toEqual(apiUrl(path))
            expect(fetchMock.lastOptions().method).toEqual('put')
            done()
          })
        })
      })
    })

    describe('delete', () => {
      beforeAll(() => {
        fetchMock.delete(apiUrl(path), body)
      })

      it('should send delete request to path', done => {
        resource.delete().then(() => {
          expect(fetchMock.lastUrl()).toEqual(apiUrl(path))
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
      const resPath = '/foobar'
      const factory = Resource.factoryFor(Entity, resPath)

      const extendedScope = new Scope(apiKey)
      extendedScope.foobar = factory

      const extendedEntity = new Entity(new Resource(scope, path, Entity))
      extendedEntity.foobar = factory

      it('should return a factory function', () => {
        expect(factory).toEqual(jasmine.any(Function))
      })

      it('should create a resource for Entity', () => {
        expect(extendedScope.foobar() instanceof Resource).toBe(true)
      })

      it('should have scope of creator', () => {
        const res = extendedScope.foobar()
        expect(res.scope).toEqual(extendedScope)
      })

      it('should have provided path', () => {
        const res = extendedScope.foobar()
        expect(res.path).toEqual(resPath)
      })

      it('should have entity class defined', () => {
        const res = extendedScope.foobar()
        expect(res.entity).toEqual(Entity)
      })

      it('should allow to be attached on entities', () => {
        expect(extendedEntity.foobar() instanceof Resource).toBe(true)
      })

      it('should not allow non-string arguments', () => {
        const nonStringId = () => extendedScope.foobar({})
        expect(nonStringId).toThrow()
      })

      it('should add ID to path', () => {
        const id = 'id'
        const res = extendedScope.foobar(id)
        expect(res.path).toEqual(`${resPath}/${id}`)
      })
    })
  })
})
