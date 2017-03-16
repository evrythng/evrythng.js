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
}
