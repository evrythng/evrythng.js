import isFunction from 'lodash-es/isFunction'
import settings from './settings'
import buildUrl from './util/buildUrl'
import { success, failure } from './util/callback'

/**
 * Make API request to provided API Url. Custom user options are merged with
 * the globally defined settings and request defaults. Request interceptors can
 * manipulated this options before passing them on to Fetch. On response,
 * response interceptors may parse the result.
 *
 * This method returns both a Promise and accepts error first callbacks.
 *
 * @param {Settings} customOptions - User options for this single request
 * @param {function} callback - Error first callback
 * @returns {Promise} - Response promise
 */
export default function api (customOptions = {}, callback) {
  let initialOptions = mergeInitialOptions(customOptions)

  return applyRequestInterceptors(initialOptions)
    .then(options => {
      return makeFetch(options)
        .then(handleResponse(options))
        .then(applyResponseInterceptors(options))
    })
    .then(success(callback))
    .catch(failure(callback))
}

/**
 * Merge base options, global settings, one-off request options and nested
 * headers object. Use apiKey option if headers.authorization is not provided.
 *
 * @param {Settings} customOptions - User options
 * @returns {Settings} - Merged options for fetch
 */
function mergeInitialOptions (customOptions) {
  const options = Object.assign(
    { method: 'get', url: '' },
    settings,
    customOptions,
    { headers: Object.assign({}, settings.headers, customOptions.headers) }
  )

  // Use apiKey if authorization header is not explicitly provided.
  if (!options.headers.authorization && options.apiKey) {
    options.headers.authorization = options.apiKey
  }

  // Stringify data if any
  if (options.data) {
    options.body = JSON.stringify(options.data)
    Reflect.deleteProperty(options, 'data')
  }

  return options
}

/**
 * Apply request inteceptors functions in sequence, chaining each promise.
 *
 * @param {Settings} options - Request options
 * @returns {Promise} - Promise to updated request options
 */
function applyRequestInterceptors (options) {
  // Use closure to keep track if request as been cancelled in interceptors
  let cancelled = false
  function cancel () {
    cancelled = true
  }

  let intercepted = Promise.resolve(options)

  if (Array.isArray(options.interceptors)) {
    options.interceptors
      .filter(interceptor => isFunction(interceptor.request))
      .forEach(interceptor => {
        // Chain promises. If interceptor returns undefined, use previous options
        intercepted = intercepted.then(prevOptions => {
          if (cancelled) return prevOptions
          return interceptor.request(prevOptions, cancel) || prevOptions
        })
      })
  }

  return intercepted.then(finalOptions => {
    // Reject request if it has been cancelled by request interceptors.
    if (cancelled) {
      return Promise.reject({
        errors: ['Request cancelled on request interceptors'],
        cancelled: true
      })
    }
    return finalOptions
  })
}

/**
 * Make the actual fetch request using the Fetch API (browser and Node.js).
 * Mimic timeout with Promise.race, rejecting request if timeout happens before
 * response arrives.
 * Note: timeout should be added to fetch spec:
 * https://github.com/whatwg/fetch/issues/20
 *
 * @param {Settings} options - Request options
 */
function makeFetch (options) {
  const req = fetch(buildUrl(options), options)
  if (!options.timeout) {
    return req
  } else {
    return Promise.race([
      req,
      new Promise(function (resolve, reject) {
        setTimeout(() => reject('Request timeout'), options.timeout)
      })
    ])
  }
}

/**
 * Return initial response data depending on the options.fullResponse value.
 * Always resolve request on HTTP success code, reject otherwise. Return the
 * entire Response object in case of fullResponse option, default to JSON
 * parsing otherwise.
 *
 * @param {Settings} options - Request options
 * @returns {Promise} - Promise to {Response} or {Object}
 */
function handleResponse (options) {
  return async (response) => {
    const res = options.fullResponse
      // Full response requested by user
      ? Promise.resolve(response)
      : response.status === 204 || options.method.toLowerCase() === 'delete'
        // Accepted or DELETE requests have no body
        ? Promise.resolve()
        // Attempt to decode the response JSON body
        : response.json()

    let data = ''
    try {
      data = await res
    } catch (e) {
      // Non-standard empty body response, allow it
    }

    if (!response.ok) {
      // If a request we expect to have no response body fails, we are still interested in the error
      throw (typeof data === 'object') ? data : await response.json()
    }

    return data
  }
}

/**
 * Apply response interceptors functions. When using fullResponse, response is
 * a Response object with a ReadableStream. Until transform streams arrive in
 * browser, there's no way to elegantly transform a response body, other than
 * monkey-patching .json method.
 *
 * @param {Settings} options - Request options
 * @returns {function} - Response handler function
 */
function applyResponseInterceptors (options) {
  return response => {
    let intercepted = Promise.resolve(response)

    if (Array.isArray(options.interceptors)) {
      options.interceptors
        .filter(interceptor => isFunction(interceptor.response))
        .forEach(interceptor => {
          // Chain promises.
          intercepted = intercepted.then(interceptor.response)
        })
    }

    return intercepted
  }
}
