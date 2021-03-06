import Scope from './Scope'
import Product from '../entity/Product'
import Thng from '../entity/Thng'
import Collection from '../entity/Collection'
import Action from '../entity/Action'
import ActionType from '../entity/ActionType'
import Role from '../entity/Role'
import Rule from '../entity/Rule'
import Place from '../entity/Place'
import PurchaseOrder from '../entity/PurchaseOrder'
import File from '../entity/File'
import { mixinResources } from '../util/mixin'
import api from '../api'
import symbols from '../symbols'

/**
 * Mixin with all the top-level User resources.
 *
 * @mixin
 */
const AppUser = mixinResources([
  Product, // CRU
  Thng, // CRU
  Collection, // CRU
  Action, // CR
  ActionType, // R
  PurchaseOrder, // R
  Role, // R
  Rule,
  Place, // R
  File // C
])

/**
 * User is the Scope that represents an application user. It is usually
 * retrieved by authenticating a user in an app, but can also be instantiated
 * explicitly if API Key and details are known (e.g. stored in localStorage).
 *
 * @extends Scope
 * @mixes AppUser
 */
export default class User extends AppUser(Scope) {
  /**
   * Creates an instance of User.
   *
   * @param {string} apiKey - API Key of scope
   * @param {Object} [data={}] - Optional user data
   */
  constructor (apiKey, data = {}) {
    super(apiKey, data)

    this.initPromise = super
      .readAccess()
      .then((access) => {
        this.id = access.actor.id
        this[symbols.path] = this._getPath()
      })
      .then(() => this.read())
  }

  /**
   * Read the user's data asynchronously.
   *
   * @returns {Promise}
   */
  init () {
    return this.initPromise
  }

  /**
   * Log current user out of EVRYTHNG platform. The API key is no longer valid.
   *
   * @param {Function} callback - Error first callback
   * @returns {Promise.<void>}
   */
  async logout (callback) {
    try {
      const res = await this._invalidateUser()
      if (callback) callback(res)
      return res
    } catch (err) {
      if (callback) callback(err)
      throw err
    }
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

  /**
   * Request to invalidate API Key.
   *
   * @returns {Promise}
   * @private
   */
  _invalidateUser () {
    return api({
      url: '/auth/all/logout',
      method: 'post',
      apiKey: this.apiKey
    })
  }
}
