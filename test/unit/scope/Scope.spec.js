/* eslint-env jasmine */
import Scope from '../../../src/scope/Scope'
import fetchMock from 'fetch-mock'
import mockApi from '../../helpers/apiMock'
import apiUrl from '../../helpers/apiUrl'
import paths from '../../helpers/paths'
import { apiKey, operatorTemplate } from '../../helpers/data'

let scope

describe('Scope', () => {
  mockApi()

  describe('constructor', () => {
    describe('invalid', () => {
      it('should need an API key', () => {
        const badCall = () => new Scope()
        expect(badCall).toThrow()
      })

      it('should need a String API Key', () => {
        const badCall = () => new Scope({ apiKey })
        expect(badCall).toThrow()
      })
    })

    describe('valid', () => {
      beforeEach(() => {
        scope = new Scope(apiKey, operatorTemplate)
      })

      it('should have API Key', () => {
        expect(scope.apiKey).toEqual(apiKey)
      })

      it('should extend document with any pre-provided data', () => {
        expect(scope.id).toEqual(operatorTemplate.id)
        expect(scope.email).toEqual(operatorTemplate.email)
      })

      it('should expose $init promise', () => {
        expect(scope.$init).toBeDefined()
        expect(scope.$init instanceof Promise).toBe(true)
      })

      it('should fetch scope access using scope apiKey', done => {
        scope.$init.then(() => {
          expect(fetchMock.lastUrl()).toEqual(apiUrl(paths.access))
          expect(fetchMock.lastOptions()).toEqual(
            jasmine.objectContaining({
              headers: jasmine.objectContaining({ authorization: apiKey })
            })
          )
          done()
        })
      })
    })
  })
})
