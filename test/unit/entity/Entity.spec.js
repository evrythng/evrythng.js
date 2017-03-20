/* eslint-env jasmine */
import Entity from '../../../src/entity/Entity'
import mockApi from '../../helpers/apiMock'
import { dummyResource } from '../../helpers/dummy'
import { entityTemplate } from '../../helpers/data'

const cb = () => {}
let entity

describe('Entity', () => {
  mockApi()

  it('should require Resource', () => {
    const emptyConstructor = () => new Entity()
    expect(emptyConstructor).toThrow()
  })

  describe('valid', () => {
    let resource

    beforeEach(() => {
      resource = dummyResource()
      entity = new Entity(resource)
    })

    it('should store resource', () => {
      entity = new Entity(resource)
      expect(entity.resource).toEqual(resource)
    })

    it('should have optional body', () => {
      entity = new Entity(resource)
      expect(Object.keys(entity).length).toEqual(1) // only .resource
    })

    it('should extend instance properties with body', () => {
      entity = new Entity(resource, entityTemplate)
      expect(entity.foo).toEqual(entityTemplate.foo)
    })

    describe('json', () => {
      it('should return empty object if Entity is empty', () => {
        entity = new Entity(resource)
        expect(entity.json()).toEqual({})
      })

      it('should return all properties apart from resource', () => {
        entity = new Entity(resource, entityTemplate)
        expect(entity.json()).toEqual(entityTemplate)
      })

      it('should return dynamically added properties', () => {
        const val = 'foobar'
        entity = new Entity(resource, entityTemplate)
        entity.test = val
        expect(entity.json().test).toEqual(val)
      })
    })

    describe('update', () => {
      const updatedEntity = Object.assign({}, entityTemplate, {
        updated: true
      })
      const dataToUpdate = {
        val: 'foobar'
      }

      beforeEach(() => {
        entity = new Entity(resource, entityTemplate)
        spyOn(resource, 'update').and.returnValue(Promise.resolve(updatedEntity))
      })

      it('should call resource update with entity\'s JSON', done => {
        entity.update().then(() => {
          expect(resource.update.calls.mostRecent().args[0]).toEqual(entityTemplate)
          done()
        })
      })

      it('should call resource update with provided body', done => {
        entity.update(dataToUpdate).then(() => {
          expect(resource.update.calls.mostRecent().args[0]).toEqual(dataToUpdate)
          done()
        })
      })

      it('should allow callback in first argument', done => {
        entity.update(cb).then(() => {
          expect(resource.update.calls.mostRecent().args[0]).toEqual(cb)
          done()
        })
      })

      it('should allow callback in second argument', done => {
        entity.update(dataToUpdate, cb).then(() => {
          expect(resource.update.calls.mostRecent().args[1]).toEqual(cb)
          done()
        })
      })

      it('should update', done => {
        entity.update().then(updated => {
          expect(entity.updated).toBe(true)
          expect(entity.foo).toBeDefined()
          expect(updated).toEqual(updatedEntity)
          done()
        })
      })
    })

    describe('delete', () => {
      beforeEach(() => {
        entity = new Entity(resource)
        spyOn(resource, 'delete').and.returnValue(Promise.resolve())
      })

      it('should call resource delete', done => {
        entity.delete().then(() => {
          expect(resource.delete).toHaveBeenCalled()
          done()
        })
      })

      it('should support callback', done => {
        entity.delete(cb).then(() => {
          expect(resource.delete.calls.mostRecent().args[0]).toBe(cb)
          done()
        })
      })
    })
  })
})
