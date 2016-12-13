import isString from 'lodash-es/isString'
import api from '../api'

/**
 * Scope defines the context in which API calls are made. A scope is defined
 * by its API Key that is sent in each request's Authorization header that
 * uses this scope.
 *
 * @export
 * @class Scope
 */
export default class Scope {
  /**
   * Creates an instance of Scope.
   *
   * @param {string} apiKey API Key of scope
   * @param {Object} [obj={}] Optional scope data
   *
   * @memberOf Scope
   */
  constructor (apiKey, obj = {}) {
    if (isString(apiKey)) {
      this.apiKey = apiKey
      this.$init = api({
        url: '/access',
        authorization: this.apiKey
      })

      // Extend scope with any given details.
      Object.assign(this, obj)
    } else {
      throw new Error('Scope constructor should be called with an API Key')
    }
  }
}
