/* eslint-env jasmine */
import Entity from '../../../src/entity/Entity'
import { dummyResource } from '../../helpers/dummy'

const body = {
  foo: 'bar'
}
let entity

describe('Entity', () => {
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
      entity = new Entity(resource, body)
      expect(entity.foo).toEqual(body.foo)
    })

    describe('json', () => {
      it('should return empty object if Entity is empty', () => {
        entity = new Entity(resource)
        expect(entity.json()).toEqual({})
      })

      it('should return all properties apart from resource', () => {
        entity = new Entity(resource, body)
        expect(entity.json()).toEqual(body)
      })

      it('should return dynamically added properties', () => {
        const val = 'foobar'
        entity = new Entity(resource, body)
        entity.test = val
        expect(entity.json().test).toEqual(val)
      })
    })

    describe('update', () => {
      let callback = jasmine.createSpy('callback')
      const updatedEntity = {
        updated: true
      }
      const dataToUpdate = {
        val: 'foobar'
      }

      beforeEach(() => {
        entity = new Entity(resource, body)
        spyOn(resource, 'update').and.returnValue(Promise.resolve(updatedEntity))
        callback.calls.reset()
      })

      it('should call resource update with entity\'s JSON', done => {
        entity.update().then(() => {
          expect(resource.update.calls.mostRecent().args[0]).toEqual(body)
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
        entity.update(callback).then(() => {
          expect(resource.update.calls.mostRecent().args[0]).toEqual(callback)
          done()
        })
      })

      it('should allow callback in second argument', done => {
        entity.update(dataToUpdate, callback).then(() => {
          expect(resource.update.calls.mostRecent().args[1]).toEqual(callback)
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
        entity = new Entity(resource, body)
        spyOn(resource, 'delete').and.returnValue(Promise.resolve())
      })

      it('should call resource delete', done => {
        entity.delete().then(() => {
          expect(resource.delete).toHaveBeenCalled()
          done()
        })
      })

      it('should allow callback', done => {
        const callback = () => {}
        entity.delete(callback).then(() => {
          expect(resource.delete.calls.mostRecent().args[0]).toBe(callback)
          done()
        })
      })
    })
  })
})
