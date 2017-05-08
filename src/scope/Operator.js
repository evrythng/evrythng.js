import Scope from './Scope'
import Product from '../entity/Product'
import Thng from '../entity/Thng'
import Collection from '../entity/Collection'
import Action from '../entity/Action'
import ActionType from '../entity/ActionType'
import Project from '../entity/Project'
import Role from '../entity/Role'
import api from '../api'
import { mixinResources } from '../util/mixin'

/**
 * An Operator has access to:
 *  - Product resource (CRUD)
 *  - Thng resource (CRUD)
 *  - Collection resource (CRUD)
 *  - Action resource (CRUD)
 *  - ActionType resource (CR)
 *  - Project resource (CRUD)
 *  - App User resource (R)
 *  - Batch resource (CRUD)
 *  - Role resource (CRUD)
 *  - File resource (CRD)
 *  - Place resource (CRUD)
 */
const operatorResources = [
  Product,
  Thng,
  Collection,
  Action,
  ActionType,
  Project,
  Role
]

/**
 * Operator Access Mixin
 */
const OperatorAccess = mixinResources(operatorResources)

/**
 * Operator is the Scope with highest permissions that can manage the account
 * resources. Should be used with caution in server-side code.
 *
 * @extends Scope
 */
export default class Operator extends OperatorAccess(Scope) {
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
      .then(this.read.bind(this))
      .catch(() => {
        throw new Error('There is no operator with this API Key')
      })
  }

  /**
   * Read itself and extend scope document.
   *
   * @param {Object} [options={}] - Optional API request options
   * @returns {Promise} - Update operator scope
   */
  read (options = {}) {
    const opts = Object.assign(options, {
      method: 'get',
      url: `/operators/${this.id}`,
      authorization: this.apiKey
    })

    return api(opts).then(this._extend.bind(this))
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

    return api(opts).then(this._extend.bind(this))
  }

  // Private

  _extend (data) {
    return Object.assign(this, data)
  }
}
