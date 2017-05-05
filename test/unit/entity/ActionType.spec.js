/* eslint-env jasmine */
import Resource from '../../../src/resource/Resource'
import ActionType from '../../../src/entity/ActionType'
import mockApi from '../../helpers/apiMock'
import paths from '../../helpers/paths'
import { dummyScope } from '../../helpers/dummy'
import { actionTypeTemplate, optionsTemplate } from '../../helpers/data'

const cb = () => {}
let actionTypeResource
let scope

describe('ActionType', () => {
  mockApi()

  beforeEach(() => {
    scope = Object.assign(dummyScope(), ActionType.resourceFactory())
    actionTypeResource = scope.actionType()
  })

  describe('resourceFactory', () => {
    it('should create new ActionType resource', () => {
      expect(actionTypeResource instanceof Resource).toBe(true)
      expect(actionTypeResource.type).toBe(ActionType)
    })

    it('should add action types path', () => {
      expect(actionTypeResource.path).toEqual(`${paths.actionTypes}`)
    })

    it('should add action type to path', () => {
      actionTypeResource = scope.actionType(actionTypeTemplate.name)
      expect(actionTypeResource.path)
        .toEqual(`${paths.actions}/${actionTypeTemplate.name}`)
    })

    describe('with normalization', () => {
      let response

      beforeEach(() => {
        response = [new ActionType(actionTypeResource, actionTypeTemplate)]
        spyOn(Resource.prototype, 'read').and.callFake(() => Promise.resolve(response))
      })

      describe('read', () => {
        describe('plural', () => {
          it('should support empty invocation', done => {
            actionTypeResource.read().then(() => {
              expect(Resource.prototype.read).toHaveBeenCalledWith()
              done()
            })
          })

          it('should support flexible arguments', done => {
            Promise.all([
              actionTypeResource.read(optionsTemplate).then(() => {
                expect(Resource.prototype.read).toHaveBeenCalledWith(optionsTemplate)
              }),
              actionTypeResource.read(cb).then(() => {
                expect(Resource.prototype.read).toHaveBeenCalledWith(cb)
              }),
              actionTypeResource.read(optionsTemplate, cb).then(() => {
                expect(Resource.prototype.read).toHaveBeenCalledWith(optionsTemplate, cb)
              })
            ]).then(done)
          })
        })

        describe('singular', () => {
          beforeEach(() => {
            actionTypeResource = scope.actionType(actionTypeTemplate.name)
          })

          it('should make a filter request to action types', done => {
            actionTypeResource.read().then(() => {
              expect(Resource.prototype.read).toHaveBeenCalledWith({
                url: paths.actionTypes,
                params: {
                  filter: {
                    name: actionTypeTemplate.name
                  }
                }
              })
              done()
            })
          })

          it('should support flexible arguments', done => {
            Promise.all([
              actionTypeResource.read(optionsTemplate).then(() => {
                expect(Resource.prototype.read).toHaveBeenCalledWith(
                  jasmine.objectContaining(optionsTemplate)
                )
              }),
              actionTypeResource.read(cb).then(() => {
                expect(Resource.prototype.read).toHaveBeenCalledWith(
                  jasmine.any(Object),
                  cb
                )
              }),
              actionTypeResource.read(optionsTemplate, cb).then(() => {
                expect(Resource.prototype.read).toHaveBeenCalledWith(
                  jasmine.objectContaining(optionsTemplate),
                  cb
                )
              })
            ]).then(done)
          })

          it('should respond with single entity', done => {
            actionTypeResource.read().then(actionType => {
              expect(actionType).toEqual(response[0])
              done()
            })
          })

          it('should reject promise if not found', done => {
            response = []
            actionTypeResource.read().catch(err => {
              expect(err.status).toEqual(404)
              expect(err.errors).toBeDefined()
              expect(err.errors[0]).toEqual('The action type was not found.')
              done()
            })
          })
        })
      })
    })
  })
})
