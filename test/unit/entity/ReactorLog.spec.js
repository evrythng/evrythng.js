/* eslint-env jasmine */
import Resource from '../../../src/resource/Resource'
import ReactorLog from '../../../src/entity/ReactorLog'
import mockApi from '../../helpers/apiMock'
import paths from '../../helpers/paths'
import { dummyScope } from '../../helpers/dummy'
import { reactorLogTemplate } from '../../helpers/data'

let reactorLogResource
let scope

describe('ReactorLog', () => {
  mockApi()

  describe('resourceFactory', () => {
    beforeEach(() => {
      scope = Object.assign(dummyScope(), ReactorLog.resourceFactory())
    })

    it('should not allow single resource access', () => {
      const singleResource = () => scope.reactorLog('id')
      expect(singleResource).toThrow()
    })

    it('should create new ReactorLog resource', () => {
      reactorLogResource = scope.reactorLog()
      expect(reactorLogResource instanceof Resource).toBe(true)
      expect(reactorLogResource.type).toBe(ReactorLog)
      expect(reactorLogResource.path).toEqual(`${paths.reactorLogs}`)
    })

    describe('with normalization', () => {
      beforeEach(() => {
        spyOn(Resource.prototype, 'create').and.returnValue(Promise.resolve())
        scope = Object.assign(dummyScope(), ReactorLog.resourceFactory())
      })

      describe('create', () => {
        it('should do nothing for single log', done => {
          reactorLogResource = scope.reactorLog()
          reactorLogResource.create(reactorLogTemplate).then(() => {
            expect(Resource.prototype.create).toHaveBeenCalledWith(reactorLogTemplate)
            done()
          })
        })

        it('should use bulk endpoint for multiple logs', done => {
          const data = [reactorLogTemplate, reactorLogTemplate]
          scope.reactorLog().create(data).then(() => {
            expect(Resource.prototype.create).toHaveBeenCalledWith(
              data,
              jasmine.objectContaining({
                url: `${paths.reactorLogs}/bulk`
              })
            )
            done()
          })
        })
      })
    })
  })
})
