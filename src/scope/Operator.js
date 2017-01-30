import Scope from './Scope'
import api from '../api'

/**
 * Operator is the Scope with highest permissions that can manage the account
 * resources. Should be used with caution in server-side code.
 *
 * An Operator currently has access to:
 * - App User resource (R)
 * - Project resource (CRUD)
 * - Product resource (CRUD)
 * - Thng resource (CRUD)
 * - ActionType resource (CR)
 * - Action resource (CRUD)
 * - Collection resource (CRUD)
 * - Batch resource (CRUD)
 *
 * @export
 * @class Operator
 * @extends {Scope}
 */
export default class Operator extends Scope {
  /**
   * Creates an instance of Operator.
   *
   * @param {string} apiKey - API Key of scope
   * @param {Object} [data={}] - Optional operator data
   *
   * @memberOf Operator
   */
  constructor (apiKey, data = {}) {
    super(apiKey, data)
    this.$init = this.$init
      .then(access => {
        this.id = access.actor.id
      })
      .then(this.read)
      .catch(() => {
        throw new Error('There is no operator with this API Key')
      })
  }

  /**
   * Read itself and extend scope document.
   *
   * @returns {Promise} - Updated operator scope
   */

  /**
   * Read itself and extend scope document.
   *
   * @param {Object} [options={}] - Optional API request options
   * @returns {Promise} - Update operator scope
   */
  read (options = {}) {
    const opts = Object.assign(options, {
      method: 'get',
      url: '/operators',
      authorization: this.apiKey
    })

    return api(opts).then(this._extend)
  }

  /**
   * Update self and extend scope document.
   *
   * @param {Object} data - Operator data
   * @param {Object} [options={}] - Optional API request options
   * @returns {Promise} - Update operator scope
   */
  update (data, options = {}) {
    const opts = Object.assign(options, {
      method: 'put',
      url: `/operators/${this.id}`,
      authorization: this.apiKey,
      data: data
    })

    return api(opts).then(this._extend)
  }

  // Operator Scope Resources API

  // TODO add API methods here

  // Private

  _extend (data) {
    return Object.assign(this, data)
  }
}
