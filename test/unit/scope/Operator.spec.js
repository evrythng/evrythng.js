/* eslint-env jasmine */
import fetchMock from 'fetch-mock'
import apiUrl from '../../helpers/apiUrl'
import responses from '../../helpers/responses'
import data from '../../helpers/data'
import Operator from '../../../src/scope/Operator'

const apiKey = data.apiKey
const operatorId = data.operator.id

let operator

describe('Operator', () => {
  beforeEach(() => {
    fetchMock.get(apiUrl('/access'), responses.access.operator)
  })
  afterEach(fetchMock.restore)

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
        fetchMock.get(apiUrl(`/operators/${operatorId}`), responses.error.generic)
        operator = new Operator(apiKey)
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
      fetchMock.get(apiUrl(`/operators/${operatorId}`), responses.operator.one)
      operator = new Operator(apiKey)
      operator.$init.then(done)
    })

    it('should send get request to operator ID', done => {
      operator.read().then(() => {
        expect(fetchMock.lastUrl()).toEqual(apiUrl(`/operators/${operatorId}`))
        expect(fetchMock.lastOptions().method).toEqual('get')
        done()
      })
    })

    it('should fill operator scope with details', done => {
      operator.read().then(response => {
        expect(operator).toBe(response)
        expect(operator).toEqual(jasmine.objectContaining(data.operator))
        done()
      })
    })
  })

  describe('update', () => {
    const payload = {
      firstName: 'firstName'
    }
    const updateResponse = Object.assign({}, responses.operator.one)
    Object.assign(updateResponse.body, payload)

    beforeEach(done => {
      fetchMock.get(apiUrl(`/operators/${operatorId}`), responses.operator.one)
      fetchMock.put(apiUrl(`/operators/${operatorId}`), updateResponse)
      operator = new Operator(apiKey)
      operator.$init.then(done)
    })

    it('should send get request to operator ID', done => {
      operator.update(payload).then(() => {
        expect(fetchMock.lastUrl()).toEqual(apiUrl(`/operators/${operatorId}`))
        expect(fetchMock.lastOptions().method).toEqual('put')
        done()
      })
    })

    it('should fill operator scope with details', done => {
      operator.read(payload).then(response => {
        expect(operator.firstName).toEqual(payload.firstName)
        expect(operator).toBe(response)
        expect(operator).toEqual(jasmine.objectContaining(data.operator))
        done()
      })
    })
  })
})
