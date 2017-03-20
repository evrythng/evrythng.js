/* eslint-env jasmine */
import getCurrentPosition from '../../../src/util/getCurrentPosition'
import { positionTemplate } from '../../helpers/data'

if (typeof window !== 'undefined') {
  describe('getCurrentPosition', () => {
    describe('success', () => {
      beforeEach(() => {
        spyOn(window.navigator.geolocation, 'getCurrentPosition')
          .and.callFake(success => success(positionTemplate))
      })

      it('should use defaults', () => {
        getCurrentPosition()
        expect(
          window.navigator.geolocation.getCurrentPosition.calls.mostRecent().args[2]
        ).toEqual(jasmine.objectContaining({
          maximumAge: 0,
          timeout: 10000,
          enableHighAccuracy: true
        }))
      })

      it('should resolve with Geolocation', done => {
        getCurrentPosition().then(resp => {
          expect(resp).toEqual(positionTemplate)
          done()
        })
      })
    })

    describe('error', () => {
      beforeEach(() => {
        spyOn(window.navigator.geolocation, 'getCurrentPosition')
          .and.callFake((success, error) => error({ code: 10 }))
      })

      it('should reject with text message', done => {
        getCurrentPosition().catch(resp => {
          expect(resp).toEqual(jasmine.any(String))
          done()
        })
      })
    })
  })
}
