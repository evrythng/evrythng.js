import isArray from 'lodash-es/isArray'
import isFunction from 'lodash-es/isFunction'
import settings from './settings'
import { buildUrl } from './util'

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
 *
 * @param customOptions
 * @returns {*}
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

  return options
}

/**
 *
 * @param options
 * @returns {Promise.<TResult>}
 */
function applyRequestInterceptors (options) {
  // Use closure to keep track if request as been cancelled in interceptors
  let cancelled = false
  function cancel () {
    cancelled = true
  }

  let intercepted = Promise.resolve(options)

  if (isArray(options.interceptors)) {
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
 *
 * @param options
 */
function makeFetch (options) {
  const req = fetch(buildUrl(options), options)
  if (!options.timeout) {
    return req
  } else {
    // Use Promise.race for timeout for now until it's added to fetch spec
    // https://github.com/whatwg/fetch/issues/20
    return Promise.race([
      req,
      new Promise(function (resolve, reject) {
        setTimeout(() => reject('Request timeout'), options.timeout)
      })
    ])
  }
}

/**
 *
 * @param options
 * @returns {*}
 */
function handleResponse (options) {
  return response => {
    const res = options.fullResponse
      ? Promise.resolve(response)
      : response.json()

    return res.then(data => {
      if (response.ok) {
        return data
      } else {
        throw data
      }
    })
  }
}

/**
 *
 * @param options
 * @returns {function(*=)}
 */
function applyResponseInterceptors (options) {
  return response => {
    let intercepted = Promise.resolve(response)

    if (isArray(options.interceptors)) {
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

/**
 *
 * @param callback
 * @returns {function(*=)}
 */
function success (callback) {
  return response => {
    if (callback) callback(null, response)
    return response
  }
}

/**
 *
 * @param callback
 * @returns {function(*=)}
 */
function failure (callback) {
  return err => {
    if (callback) callback(err)
    throw err
  }
}