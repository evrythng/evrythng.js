/* eslint-env jasmine */
import Resource from '../../../src/resource/Resource'
import Action from '../../../src/entity/Action'
import Entity from '../../../src/entity/Entity'
import setup from '../../../src/setup'
import { dummyScope, dummyEntity } from '../../helpers/dummy'
import data from '../../helpers/data'

const actionsPath = '/actions'
const actionType = 'tests'
const actionId = 'actionId'
let mixin

describe('Action', () => {
  describe('resourceFactory', () => {
    beforeEach(() => {
      mixin = Object.assign(dummyScope(), Action.resourceFactory())
    })

    it('should throw if actionType not specified', () => {
      const noActionTypeResource = () => mixin.action(() => 'test')
      expect(noActionTypeResource).toThrow()
    })

    it('should throw if actionType is not a string', () => {
      const noActionTypeResource = () => mixin.action(() => 'test')
      expect(noActionTypeResource).toThrow()
    })

    it('should create new Action resource', () => {
      const actionResource = mixin.action(actionType)
      expect(actionResource instanceof Resource).toBe(true)
      expect(actionResource.type).toBe(Action)
    })

    it('should add actions path', () => {
      const actionResource = mixin.action(actionType)
      expect(actionResource.path).toEqual(`${actionsPath}/${actionType}`)
    })

    it('should add action to path', () => {
      const actionResource = mixin.action(actionType, actionId)
      expect(actionResource.path).toEqual(`${actionsPath}/${actionType}/${actionId}`)
    })

    describe('with normalization', () => {
      let actionResource

      beforeEach(() => {
        spyOn(Resource.prototype, 'create').and.returnValue(Promise.resolve())
        setup({ geolocation: false })
      })

      describe('create', () => {
        describe('on Scope base', () => {
          beforeEach(() => {
            mixin = Object.assign(dummyScope(), Action.resourceFactory())
          })

          it('should support empty invocation', done => {
            actionResource = mixin.action(actionType)
            actionResource.create().then(() => {
              expect(Resource.prototype.create).toHaveBeenCalled()
              done()
            })
          })

          it('should fill correct action type', done => {
            Promise.all([
              mixin.action(actionType).create().then(() => {
                expect(Resource.prototype.create).toHaveBeenCalledWith(
                  jasmine.objectContaining({
                    type: actionType
                  })
                )
              }),
              mixin.action('all').create().then(() => {
                expect(Resource.prototype.create).toHaveBeenCalledWith(
                  jasmine.objectContaining({
                    type: ''
                  })
                )
              }),
              mixin.action('all').create({ type: 'test' }).then(() => {
                expect(Resource.prototype.create).toHaveBeenCalledWith(
                  jasmine.objectContaining({
                    type: 'test'
                  })
                )
              }),
              mixin.action(actionType).create([{foo: 1}, {foo: 2}]).then(() => {
                expect(Resource.prototype.create).toHaveBeenCalledWith([
                  jasmine.objectContaining({
                    type: actionType,
                    foo: 1
                  }),
                  jasmine.objectContaining({
                    type: actionType,
                    foo: 2
                  })
                ])
              })
            ]).then(done)
          })
        })

        describe('on Entity base', () => {
          beforeEach(() => {
            mixin = Object.assign(
              dummyEntity(Entity, data.thng),
              Action.resourceFactory()
            )
          })

          it('should fill correct entity ID', done => {
            Promise.all([
              mixin.action(actionType).create().then(() => {
                expect(Resource.prototype.create).toHaveBeenCalledWith(
                  jasmine.objectContaining({
                    entity: data.thng.id
                  })
                )
              }),
              mixin.action(actionType).create([{foo: 1}, {foo: 2}]).then(() => {
                expect(Resource.prototype.create).toHaveBeenCalledWith([
                  jasmine.objectContaining({
                    entity: data.thng.id,
                    foo: 1
                  }),
                  jasmine.objectContaining({
                    entity: data.thng.id,
                    foo: 2
                  })
                ])
              })
            ]).then(done)
          })
        })

        describe('with Geolocation', () => {
          // TODO
        })
      })
    })
  })
})
