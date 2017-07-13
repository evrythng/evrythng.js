import Scope from './Scope'
import Product from '../entity/Product'
import Thng from '../entity/Thng'
import Collection from '../entity/Collection'
import Action from '../entity/Action'
import ActionType from '../entity/ActionType'
import Role from '../entity/Role'
import { mixinResources } from '../util/mixin'
import symbols from '../symbols'

/**
 * Mixin with all the top-level User resources.
 *
 * @mixin
 */
const UserAccess = mixinResources([
  Product,          // CRU
  Thng,             // CRU
  Collection,       // CRU
  Action,           // CR
  ActionType,       // R
  Role              // R
])

/**
 * User is the Scope that represents an application user. It is usually
 * retrieved by authenticating a user in an app, but can also be instantiated
 * explicitly if API Key and details are known (e.g. stored in localStorage).
 *
 * @extends Scope
 * @mixes UserAccess
 */
export default class User extends UserAccess(Scope) {
  /**
   * Creates an instance of Operator.
   *
   * @param {string} apiKey - API Key of scope
   * @param {Object} [data={}] - Optional operator data
   */
  constructor (apiKey, data = {}) {
    super(apiKey, data)

    this[symbols.init] = this[symbols.init]
      .then(access => {
        this.id = access.actor.id
        this[symbols.path] = this._getPath()
      })
      .then(this.read.bind(this))
      .catch(() => {
        throw new Error('There is no user with this API Key')
      })
  }

  // PRIVATE

  /**
   * Return user endpoint.
   *
   * @return {string}
   */
  _getPath () {
    return `/users/${this.id}`
  }
}
