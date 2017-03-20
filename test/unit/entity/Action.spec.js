/* eslint-env jasmine */
import Resource from '../../../src/resource/Resource'
import Action from '../../../src/entity/Action'
import Entity from '../../../src/entity/Entity'
import setup from '../../../src/setup'
import mockApi from '../../helpers/apiMock'
import paths from '../../helpers/paths'
import { dummyScope, dummyEntity } from '../../helpers/dummy'
import { actionTemplate, entityTemplate, optionsTemplate } from '../../helpers/data'

const cb = () => {}
let actionResource
let scope
let entity

describe('Action', () => {
  mockApi()

  describe('resourceFactory', () => {
    beforeEach(() => {
      scope = Object.assign(dummyScope(), Action.resourceFactory())
    })

    it('should throw if actionType not specified', () => {
      const noActionTypeResource = () => scope.action()
      expect(noActionTypeResource).toThrow()
    })

    it('should throw if actionType is not a string', () => {
      const noActionTypeResource = () => scope.action(1)
      expect(noActionTypeResource).toThrow()
    })

    it('should create new Action resource', () => {
      const actionResource = scope.action(actionTemplate.type)
      expect(actionResource instanceof Resource).toBe(true)
      expect(actionResource.type).toBe(Action)
    })

    it('should add actions path', () => {
      const actionResource = scope.action(actionTemplate.type)
      expect(actionResource.path)
        .toEqual(`${paths.actions}/${actionTemplate.type}`)
    })

    it('should add action to path', () => {
      const actionResource = scope.action(actionTemplate.type, actionTemplate.id)
      expect(actionResource.path)
        .toEqual(`${paths.actions}/${actionTemplate.type}/${actionTemplate.id}`)
    })

    describe('with normalization', () => {
      beforeEach(() => {
        spyOn(Resource.prototype, 'create').and.returnValue(Promise.resolve())
        setup({ geolocation: false })
      })

      describe('create', () => {
        describe('on Scope base', () => {
          beforeEach(() => {
            scope = Object.assign(dummyScope(), Action.resourceFactory())
          })

          it('should support empty invocation', done => {
            actionResource = scope.action(actionTemplate.type)
            actionResource.create().then(() => {
              expect(Resource.prototype.create).toHaveBeenCalled()
              done()
            })
          })

          it('should fill correct action type', done => {
            Promise.all([
              scope.action(actionTemplate.type).create().then(() => {
                expect(Resource.prototype.create).toHaveBeenCalledWith(
                  jasmine.objectContaining({
                    type: actionTemplate.type
                  })
                )
              }),
              scope.action('all').create().then(() => {
                expect(Resource.prototype.create).toHaveBeenCalledWith(
                  jasmine.objectContaining({
                    type: ''
                  })
                )
              }),
              scope.action('all').create({ type: 'test' }).then(() => {
                expect(Resource.prototype.create).toHaveBeenCalledWith(
                  jasmine.objectContaining({
                    type: 'test'
                  })
                )
              }),
              scope.action(actionTemplate.type).create([{foo: 1}, {foo: 2}]).then(() => {
                expect(Resource.prototype.create).toHaveBeenCalledWith([
                  jasmine.objectContaining({
                    type: actionTemplate.type,
                    foo: 1
                  }),
                  jasmine.objectContaining({
                    type: actionTemplate.type,
                    foo: 2
                  })
                ])
              })
            ]).then(done)
          })
        })

        describe('on Entity base', () => {
          beforeEach(() => {
            entity = Object.assign(
              dummyEntity(Entity, entityTemplate),
              Action.resourceFactory()
            )
            actionResource = entity.action(actionTemplate.type)
          })

          it('should fill correct entity ID', done => {
            Promise.all([
              actionResource.create().then(() => {
                expect(Resource.prototype.create).toHaveBeenCalledWith(
                  jasmine.objectContaining({
                    entity: entityTemplate.id
                  })
                )
              }),
              actionResource.create([{foo: 1}, {foo: 2}]).then(() => {
                expect(Resource.prototype.create).toHaveBeenCalledWith([
                  jasmine.objectContaining({
                    entity: entityTemplate.id,
                    foo: 1
                  }),
                  jasmine.objectContaining({
                    entity: entityTemplate.id,
                    foo: 2
                  })
                ])
              })
            ]).then(done)
          })

          it('should support callback in first param', done => {
            actionResource.create(cb).then(() => {
              expect(Resource.prototype.create.calls.mostRecent().args[1])
                .toEqual(cb)
            }).then(done)
          })

          it('should support callback in second param', done => {
            actionResource.create(actionTemplate, cb).then(() => {
              expect(Resource.prototype.create.calls.mostRecent().args[1])
                .toEqual(cb)
            }).then(done)
          })

          it('should support callback in third param', done => {
            actionResource.create(actionTemplate, optionsTemplate, cb)
              .then(() => {
                expect(Resource.prototype.create.calls.mostRecent().args[2])
                  .toEqual(cb)
              })
              .then(done)
          })
        })

        describe('with Geolocation', () => {
          // TODO
        })
      })
    })
  })
})
