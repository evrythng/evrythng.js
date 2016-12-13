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
   * @param {string} apiKey API Key of scope
   * @param {Object} [obj={}] Optional operator data
   *
   * @memberOf Operator
   */
  constructor (apiKey, obj = {}) {
    super(apiKey, obj)

    // Read Operator details and append to Scope.
    this.$init = this.$init
      .then(access => {
        this.id = access.actor.id
        return api({
          url: '/operators',
          authorization: this.apiKey
        })
      })
      .then(operator => Object.assign(this, operator))
      .catch(() => {
        throw new Error('There is no operator with this API Key')
      })
  }

  // TODO add API methods here
  // TODO add ability to update self (the operator)
}
