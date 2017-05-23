import isString from 'lodash-es/isString'
import api from '../api'

/**
 * Scope defines the context in which API calls are made. A scope is defined
 * by its API Key. That key is sent in each request's Authorization header that
 * uses this scope.
 */
export default class Scope {
  /**
   * Creates an instance of Scope.
   *
   * @param {string} apiKey API Key of scope
   * @param {Object} [body={}] Optional scope data
   */
  constructor (apiKey, body = {}) {
    if (!isString(apiKey)) {
      throw new Error('Scope constructor should be called with an API Key')
    }

    this.apiKey = apiKey
    this.$init = api({
      url: '/access',
      apiKey: this.apiKey
    })

    // Extend scope with any given details.
    Object.assign(this, body)
  }

  /**
   * Read itself and extend scope document.
   *
   * @param {Settings} [options={}] - Optional API request options
   * @returns {Promise} - Updated operator scope
   */
  read (options = {}) {
    const opts = Object.assign(options, {
      method: 'get',
      url: this.scopePath,
      authorization: this.apiKey
    })

    return this._request(opts)
  }

  /**
   * Update self and extend scope document.
   *
   * @param {Object} data - Operator data
   * @param {Settings} [options={}] - Optional API request options
   * @returns {Promise} - Updated operator scope
   */
  update (data, options = {}) {
    const opts = Object.assign(options, {
      method: 'put',
      url: this.scopePath,
      authorization: this.apiKey,
      data
    })

    return this._request(opts)
  }

  /**
   * Path to this scope's entity.
   *
   * @return {string}
   */
  get scopePath () {
    return ''
  }

  // Private

  /**
   *
   * @param {Settings} options - Request options
   * @returns {Promise} - Updated operator scope
   * @private
   */
  _request (options) {
    return api(options).then(data => Object.assign(this, data))
  }
}
