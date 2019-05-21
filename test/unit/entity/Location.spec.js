/* eslint-env jasmine */
import Resource from '../../../src/resource/Resource'
import Location from '../../../src/entity/Location'
import setup from '../../../src/setup'
import mockApi from '../../helpers/apiMock'
import paths from '../../helpers/paths'
import { dummyResource } from '../../helpers/dummy'
import {
  locationTemplate,
  positionTemplate,
  optionsTemplate
} from '../../helpers/data'

const cb = () => {}
let locationResource
let resource

describe('Location', () => {
  mockApi()

  describe('resourceFactory', () => {
    beforeEach(() => {
      resource = Object.assign(dummyResource(), Location.resourceFactory())
    })

    it('should not allow single resource access', () => {
      const singleResource = () => resource.location('id')
      expect(singleResource).toThrow()
    })

    it('should create new Location resource', () => {
      locationResource = resource.location()
      expect(locationResource instanceof Resource).toBe(true)
      expect(locationResource.type).toBe(Location)
    })

    it('should add locations path', () => {
      locationResource = resource.location()
      expect(locationResource.path)
        .toEqual(`${paths.dummy}${paths.locations}`)
    })

    describe('with normalization', () => {
      beforeEach(() => {
        spyOn(Resource.prototype, 'update').and.returnValue(Promise.resolve())
        setup({ geolocation: false })
      })

      describe('update', () => {
        beforeEach(() => {
          locationResource = resource.location()
        })

        it('should support empty invocation', done => {
          locationResource.update().then(() => {
            expect(Resource.prototype.update).toHaveBeenCalledWith([])
            done()
          })
        })

        it('should wrap single location update into list', done => {
          locationResource.update(locationTemplate).then(() => {
            expect(Resource.prototype.update)
              .toHaveBeenCalledWith([locationTemplate])
          }).then(done)
        })

        it('should support callback in first param', done => {
          locationResource.update(cb).then(() => {
            expect(Resource.prototype.update.calls.mostRecent().args[1])
              .toEqual(cb)
          }).then(done)
        })

        it('should support callback in second param', done => {
          locationResource.update(locationTemplate, cb).then(() => {
            expect(Resource.prototype.update.calls.mostRecent().args[1])
              .toEqual(cb)
          }).then(done)
        })

        it('should support callback in third param', done => {
          locationResource.update(locationTemplate, optionsTemplate, cb)
            .then(() => {
              expect(Resource.prototype.update.calls.mostRecent().args[2])
                .toEqual(cb)
            })
            .then(done)
        })

        if (typeof window !== 'undefined') {
          describe('with Geolocation', () => {
            beforeEach(() => setup({ geolocation: true }))
            afterEach(() => setup({ geolocation: false }))

            it('should request user location none defined', done => {
              spyOn(window.navigator.geolocation, 'getCurrentPosition')
                .and.callFake(success => success(positionTemplate))

              locationResource.update().then(() => {
                expect(window.navigator.geolocation.getCurrentPosition).toHaveBeenCalled()
                expect(Resource.prototype.update.calls.mostRecent().args[0])
                  .toEqual(jasmine.objectContaining([{
                    position: {
                      type: 'Point',
                      coordinates: [
                        positionTemplate.coords.longitude,
                        positionTemplate.coords.latitude
                      ]
                    }
                  }]))
              }).then(done)
            })

            it('should create action even if geolocation failed', done => {
              spyOn(window.navigator.geolocation, 'getCurrentPosition')
                .and.callFake((success, error) => error(new Error()))
              spyOn(console, 'info').and.callFake(() => {})

              locationResource.update().catch(() => {
                expect(window.navigator.geolocation.getCurrentPosition).toHaveBeenCalled()
                expect(Resource.prototype.update).toHaveBeenCalled()
              }).then(done)
            })
          })
        }
      })
    })
  })
})
