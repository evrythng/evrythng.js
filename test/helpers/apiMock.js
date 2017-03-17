/* eslint-env jasmine */
import fetchMock from 'fetch-mock'
import apiUrl from './apiUrl'
import responses from './responses'

/**
 * Delayed promise.
 *
 * @param {Number} time - Delay time in milliseconds
 */
const delay = time => new Promise(resolve => setTimeout(resolve, time))

/**
 * Init whole API mock.
 */
beforeAll(() => {
  fetchMock.get(apiUrl('/access'), responses.access)
})

/**
 * Wait a few milliseconds to ensure there are no pending Promises
 * chains that will call fetch.
 */
afterAll(done => {
  delay(100)
    .then(fetchMock.restore)
    .then(done)
})
