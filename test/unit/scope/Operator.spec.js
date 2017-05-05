/* eslint-env jasmine */
import Operator from '../../../src/scope/Operator'
import fetchMock from 'fetch-mock'
import mockApi from '../../helpers/apiMock'
import apiUrl from '../../helpers/apiUrl'
import paths from '../../helpers/paths'
import { apiKey, operatorTemplate } from '../../helpers/data'

let operator

describe('Operator', () => {
  mockApi()

  describe('constructor', () => {
    describe('existent', () => {
      beforeEach(() => {
        spyOn(Operator.prototype, 'read')
        operator = new Operator(apiKey)
      })

      it('should read itself', done => {
        operator.$init.then(() => {
          expect(Operator.prototype.read).toHaveBeenCalled()
          done()
        })
      })
    })

    describe('non-existent', () => {
      beforeEach(() => {
        operator = new Operator('invalidKey')
      })

      it('should throw error', done => {
        operator.$init
          .then(() => expect(true).toBe(false))
          .catch(() => expect(true).toBe(true))
          .then(done)
      })
    })
  })

  describe('read', () => {
    beforeEach(done => {
      operator = new Operator(apiKey)
      operator.$init.then(done)
    })

    it('should send get request to operator ID', done => {
      operator.read().then(() => {
        expect(fetchMock.lastUrl()).toEqual(apiUrl(paths.operator))
        expect(fetchMock.lastOptions().method).toEqual('get')
        done()
      })
    })

    it('should fill operator scope with details', done => {
      operator.read().then(response => {
        expect(operator).toBe(response)
        expect(operator).toEqual(jasmine.objectContaining(operatorTemplate))
        done()
      })
    })
  })

  describe('update', () => {
    beforeEach(done => {
      operator = new Operator(apiKey)
      operator.$init.then(done)
    })

    it('should send get request to operator ID', done => {
      operator.update(operatorTemplate).then(() => {
        expect(fetchMock.lastUrl()).toEqual(apiUrl(paths.operator))
        expect(fetchMock.lastOptions().method).toEqual('put')
        done()
      })
    })

    it('should fill operator scope with details', done => {
      operator.update(operatorTemplate).then(response => {
        expect(operator).toBe(response)
        expect(operator).toEqual(jasmine.objectContaining(operatorTemplate))
        done()
      })
    })
  })

  describe('access', () => {
    const operatorResources = [
      'product',
      'thng',
      'collection',
      'action',
      'actionType',
      'project'
    ]

    beforeEach(done => {
      operator = new Operator(apiKey)
      operator.$init.then(done)
    })

    operatorResources.forEach(resource => {
      it(`should have ${resource} resource`, () => {
        expect(operator[resource]).toBeDefined()
      })
    })
  })
})
