/* eslint-env jasmine */
import fetchMock from 'fetch-mock'
import apiUrl from './apiUrl'
import responses from './responses'
import paths from './paths'
import { apiKey, operatorApiKey, appApiKey } from './data'

/**
 * Mock API for each separate test block. It is important that tests run
 * independently from each other by guaranteeing there's only one fetchMock
 * instance at a time. Otherwise, one instance tracks and matches the requests
 * from another (as there's only one global fetch). Thus, this method should
 * be called within the first describe block for the module.
 *
 * @example
 *
 * describe('Operator', () => {
 *   mockApi()
 *
 *   ...
 * }
 */
export default function mockApi () {
  beforeAll(prepare)
  afterAll(tearDown)
}

/**
 * Delayed promise.
 *
 * @param {Number} time - Delay time in milliseconds
 */
const delay = time => new Promise(resolve => setTimeout(resolve, time))

/**
 * Init API mock as a whole.
 */
function prepare () {
  // Root - generic requests handles
  fetchMock.mock(apiUrl(), responses.ok)
  fetchMock.mock(/\?.*/, responses.ok)
  fetchMock.mock(`${paths.testBase}${paths.dummy}`, responses.ok)

  // Unavailable/error endpoint
  fetchMock.get(apiUrl(paths.error), responses.error.generic)

  // Access
  fetchMock.get(apiUrl(paths.access), (url, opts) => validAccess(opts))

  // Dummy resource path for entities
  fetchMock.get(apiUrl(paths.dummy), responses.entity.multiple)
  fetchMock.post(apiUrl(paths.dummy), responses.entity.one)
  fetchMock.put(apiUrl(paths.dummy), responses.entity.one)
  fetchMock.delete(apiUrl(paths.dummy), responses.noContent)

  // Operator
  fetchMock.get(apiUrl(paths.operator), responses.operator.one)
  fetchMock.post(apiUrl(paths.operators), responses.operator.one)
  fetchMock.put(apiUrl(paths.operator), responses.operator.one)

  // Application
  fetchMock.get(apiUrl(paths.application), responses.application.one)
  fetchMock.put(apiUrl(paths.application), responses.application.one)
}

/**
 * Wait a few milliseconds to ensure there are no pending Promises
 * chains that will call fetch.
 *
 * @param {Function} done - Jasmine done callback
 */
function tearDown (done) {
  delay(100).then(fetchMock.restore).then(done)
}

/**
 * Verifies if access is valid by matching to the globally defined apiKey.
 *
 * @param {Object} opts - Request options
 * @return {Object} - Response
 */
function validAccess (opts) {
  if (opts.headers.authorization === apiKey ||
    opts.headers.authorization === operatorApiKey) {
    return responses.access.operator
  } else if (opts.headers.authorization === appApiKey) {
    return responses.access.application
  } else {
    return responses.error.generic
  }
}
