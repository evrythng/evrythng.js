/* eslint-env jasmine */
import fetchMock from 'fetch-mock'
import apiUrl from '../../helpers/apiUrl'
import Scope from '../../../src/scope/Scope'

const apiKey = 'apiKey'
const apiResponse = {
  apiKey,
  actor: {
    id: 'operatorId'
  }
}

describe('Scope', () => {
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
      let scope
      const operatorDocument = {
        id: 'operatorId',
        email: 'test@example.com'
      }

      beforeAll(() => fetchMock.mock(apiUrl('/access'), apiResponse))
      afterAll(fetchMock.restore)

      beforeEach(() => {
        scope = new Scope(apiKey, operatorDocument)
      })

      it('should have API Key', () => {
        expect(scope.apiKey).toEqual(apiKey)
      })

      it('should extend document with any pre-provided data', () => {
        expect(scope.id).toEqual(operatorDocument.id)
        expect(scope.email).toEqual(operatorDocument.email)
      })

      it('should expose $init promise', () => {
        expect(scope.$init).toBeDefined()
        expect(scope.$init instanceof Promise).toBe(true)
      })

      it('should fetch scope access using scope apiKey', done => {
        scope.$init.then(() => {
          expect(fetchMock.lastUrl()).toEqual(apiUrl('/access'))
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
