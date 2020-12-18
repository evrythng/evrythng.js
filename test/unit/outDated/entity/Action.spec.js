/* eslint-env jasmine */
import Resource from '../../../src/resource/Resource'
import Action from '../../../src/entity/Action'
import Entity from '../../../src/entity/Entity'
import setup from '../../../src/setup'
import mockApi from '../../helpers/apiMock'
import paths from '../../helpers/paths'
import { dummyResource, dummyEntity } from '../../helpers/dummy'
import {
  actionTemplate,
  entityTemplate,
  optionsTemplate,
  positionTemplate
} from '../../helpers/data'

const cb = () => {}
let actionResource
let resource
let entity

describe('Action', () => {
  mockApi()

  describe('resourceFactory', () => {
    beforeEach(() => {
      resource = Object.assign(dummyResource(), Action.resourceFactory())
    })

    it('should throw if actionType not specified', () => {
      const noActionTypeResource = () => resource.action()
      expect(noActionTypeResource).toThrow()
    })

    it('should throw if actionType is not a string', () => {
      const noActionTypeResource = () => resource.action(1)
      expect(noActionTypeResource).toThrow()
    })

    it('should create new Action resource', () => {
      const actionResource = resource.action(actionTemplate.type)
      expect(actionResource instanceof Resource).toBe(true)
      expect(actionResource.type).toBe(Action)
    })

    it('should add actions path', () => {
      const actionResource = resource.action(actionTemplate.type)
      expect(actionResource.path).toEqual(`${paths.dummy}${paths.actions}/${actionTemplate.type}`)
    })

    it('should add action to path', () => {
      const actionResource = resource.action(actionTemplate.type, actionTemplate.id)
      expect(actionResource.path).toEqual(
        `${paths.dummy}${paths.actions}/${actionTemplate.type}/${actionTemplate.id}`
      )
    })

    describe('with normalization', () => {
      beforeEach(() => {
        spyOn(Resource.prototype, 'create').and.returnValue(Promise.resolve())
        setup({ geolocation: false })
      })

      describe('create', () => {
        describe('on Scope base', () => {
          beforeEach(() => {
            resource = Object.assign(dummyResource(), Action.resourceFactory())
          })

          it('should support empty invocation', (done) => {
            actionResource = resource.action(actionTemplate.type)
            actionResource.create().then(() => {
              expect(Resource.prototype.create).toHaveBeenCalled()
              done()
            })
          })

          it('should fill correct action type', (done) => {
            Promise.all([
              resource
                .action(actionTemplate.type)
                .create()
                .then(() => {
                  expect(Resource.prototype.create).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                      type: actionTemplate.type
                    })
                  )
                }),
              resource
                .action('all')
                .create()
                .then(() => {
                  expect(Resource.prototype.create).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                      type: ''
                    })
                  )
                }),
              resource
                .action('all')
                .create({ type: 'test' })
                .then(() => {
                  expect(Resource.prototype.create).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                      type: 'test'
                    })
                  )
                }),
              resource
                .action(actionTemplate.type)
                .create([{ foo: 1 }, { foo: 2 }])
                .then(() => {
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
            entity = Object.assign(dummyEntity(Entity, entityTemplate), Action.resourceFactory())
            actionResource = entity.action(actionTemplate.type)
          })

          it('should fill correct entity ID', (done) => {
            Promise.all([
              actionResource.create().then(() => {
                expect(Resource.prototype.create).toHaveBeenCalledWith(
                  jasmine.objectContaining({
                    entity: entityTemplate.id
                  })
                )
              }),
              actionResource.create([{ foo: 1 }, { foo: 2 }]).then(() => {
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

          it('should support callback in first param', (done) => {
            actionResource
              .create(cb)
              .then(() => {
                expect(Resource.prototype.create.calls.mostRecent().args[1]).toEqual(cb)
              })
              .then(done)
          })

          it('should support callback in second param', (done) => {
            actionResource
              .create(actionTemplate, cb)
              .then(() => {
                expect(Resource.prototype.create.calls.mostRecent().args[1]).toEqual(cb)
              })
              .then(done)
          })

          it('should support callback in third param', (done) => {
            actionResource
              .create(actionTemplate, optionsTemplate, cb)
              .then(() => {
                expect(Resource.prototype.create.calls.mostRecent().args[2]).toEqual(cb)
              })
              .then(done)
          })
        })

        if (typeof window !== 'undefined') {
          describe('with Geolocation', () => {
            beforeEach(() => {
              resource = Object.assign(dummyResource(), Action.resourceFactory())
              actionResource = resource.action(actionTemplate.type)
            })

            it('should request user location if local config is passed', (done) => {
              spyOn(window.navigator.geolocation, 'getCurrentPosition').and.callFake((success) =>
                success(positionTemplate)
              )

              actionResource
                .create(actionTemplate, { geolocation: true })
                .then(() => {
                  expect(window.navigator.geolocation.getCurrentPosition).toHaveBeenCalled()
                  expect(Resource.prototype.create.calls.mostRecent().args[0]).toEqual(
                    jasmine.objectContaining({
                      location: positionTemplate.coords
                    })
                  )
                })
                .then(done)
            })

            it('should create action even if geolocation failed', (done) => {
              spyOn(
                window.navigator.geolocation,
                'getCurrentPosition'
              ).and.callFake((success, error) => error(new Error()))
              spyOn(console, 'info').and.callFake(() => {})

              actionResource
                .create(actionTemplate, { geolocation: true })
                .catch(() => {
                  expect(window.navigator.geolocation.getCurrentPosition).toHaveBeenCalled()
                  expect(Resource.prototype.create).toHaveBeenCalled()
                })
                .then(done)
            })
          })
        }
      })
    })
  })
})
