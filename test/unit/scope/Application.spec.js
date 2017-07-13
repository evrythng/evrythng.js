/* eslint-env jasmine */
import Application from '../../../src/scope/Application'
import symbols from '../../../src/symbols'
import fetchMock from 'fetch-mock'
import mockApi from '../../helpers/apiMock'
import apiUrl from '../../helpers/apiUrl'
import paths from '../../helpers/paths'
import { appApiKey, applicationTemplate } from '../../helpers/data'

let application

describe('Application', () => {
  mockApi()

  describe('constructor', () => {
    describe('existent', () => {
      beforeEach(() => {
        spyOn(Application.prototype, 'read')
        application = new Application(appApiKey)
      })

      it('should read itself', done => {
        application[symbols.init].then(() => {
          expect(Application.prototype.read).toHaveBeenCalled()
          done()
        })
      })
    })

    describe('non-existent', () => {
      beforeEach(() => {
        application = new Application('invalidKey')
      })

      it('should throw error', done => {
        application[symbols.init]
          .catch(() => expect(true).toBe(true))
          .then(done)
      })
    })
  })

  describe('read', () => {
    beforeEach(done => {
      application = new Application(appApiKey)
      application[symbols.init].then(done)
    })

    it('should send get request to project and application ID', done => {
      application.read().then(() => {
        expect(fetchMock.lastUrl()).toEqual(apiUrl(paths.application))
        expect(fetchMock.lastOptions().method).toEqual('get')
        done()
      })
    })

    it('should fill operator scope with details', done => {
      application.read().then(response => {
        expect(application).toBe(response)
        expect(application).toEqual(jasmine.objectContaining(applicationTemplate))
        done()
      })
    })
  })

  describe('update', () => {
    beforeEach(done => {
      application = new Application(appApiKey)
      application[symbols.init].then(done)
    })

    it('should send get request to operator ID', done => {
      application.update(applicationTemplate).then(() => {
        expect(fetchMock.lastUrl()).toEqual(apiUrl(paths.application))
        expect(fetchMock.lastOptions().method).toEqual('put')
        done()
      })
    })

    it('should fill operator scope with details', done => {
      application.update(applicationTemplate).then(response => {
        expect(application).toBe(response)
        expect(application).toEqual(jasmine.objectContaining(applicationTemplate))
        done()
      })
    })
  })

  describe('access', () => {
    const operatorResources = [
      'product',
      'action',
      'place',
      'userAccess'
    ]

    beforeEach(done => {
      application = new Application(appApiKey)
      application[symbols.init].then(done)
    })

    operatorResources.forEach(resource => {
      it(`should have ${resource} resource`, () => {
        expect(application[resource]).toBeDefined()
      })
    })
  })
})
