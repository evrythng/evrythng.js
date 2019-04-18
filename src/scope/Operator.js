import Scope from './Scope'
import Product from '../entity/Product'
import Thng from '../entity/Thng'
import Collection from '../entity/Collection'
import Action from '../entity/Action'
import ActionType from '../entity/ActionType'
import Project from '../entity/Project'
import Role from '../entity/Role'
import User from '../entity/User'
import Batch from '../entity/Batch'
import Place from '../entity/Place'
import File from '../entity/File'
import { mixinResources } from '../util/mixin'
import symbols from '../symbols'

/**
 * Mixin with all the top-level Operator resources.
 *
 * @mixin
 */
const OperatorAccess = mixinResources([
  Product,          // CRUD
  Thng,             // CRUD
  Collection,       // CRUD
  Action,           // CR
  ActionType,       // CRUD
  Project,          // CRUD
  Role,             // CRUD
  User,             // R
  Batch,            // CRUD
  Place,            // CRUD
  File              // CRUD
])

/**
 * Operator is the Scope with highest permissions that can manage the account
 * resources. Should be used with caution in server-side code.
 *
 * @extends Scope
 * @mixes OperatorAccess
 */
export default class Operator extends OperatorAccess(Scope) {
  /**
   * Creates an instance of Operator.
   *
   * @param {string} apiKey - API Key of scope
   * @param {Object} [data={}] - Optional operator data
   */
  constructor (apiKey, data = {}) {
    super(apiKey, data)

    this.init()
  }

  /**
   * Read the operator's data asynchronously.
   *
   * @returns {Promise}
   */
  init () {
    return super.init()
      .then(access => {
        this.id = access.actor.id
        this[symbols.path] = this._getPath()
      })
      .then(() => this.read())
  }

  // PRIVATE

  /**
   * Return operator access endpoint.
   *
   * @return {string}
   */
  _getPath () {
    return '/access'
  }
}
