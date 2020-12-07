import Scope from './Scope'
import Account from '../entity/Account'
import ADIOrder from '../entity/ADIOrder'
import Product from '../entity/Product'
import Thng from '../entity/Thng'
import Collection from '../entity/Collection'
import Action from '../entity/Action'
import ActionType from '../entity/ActionType'
import Project from '../entity/Project'
import PurchaseOrder from '../entity/PurchaseOrder'
import Redirector from '../entity/Redirector'
import Role from '../entity/Role'
import Rule from '../entity/Rule'
import ShipmentNotice from '../entity/ShipmentNotice'
import User from '../entity/User'
import Batch from '../entity/Batch'
import Place from '../entity/Place'
import File from '../entity/File'
import OpeatorAccess from '../entity/OperatorAccess'
import AccessPolicy from '../entity/AccessPolicy'
import AccessToken from '../entity/AccessToken'
import Me from '../entity/Me'
import Access from '../entity/Access'
import { mixinResources } from '../util/mixin'
import symbols from '../symbols'

/**
 * Mixin with all the top-level Operator resources.
 *
 * @mixin
 */
const OperatorAccess = mixinResources([
  Access, // LR
  AccessPolicy, // CRUDL
  AccessToken, // CL
  Account, // LRU
  Action, // CRLD
  ActionType, // CRULD
  ADIOrder, // CRL
  Batch, // CRUD
  Collection, // CRUDL
  File, // CRUD
  Me, // R
  OpeatorAccess, // CRUDL
  Place, // CRUDL
  Product, // CRUDL
  Project, // CRUDL
  PurchaseOrder, // CRUDL
  Redirector, // RUD
  Role, // CRUD
  Rule,
  ShipmentNotice, // CRUDL
  Thng, // CRUDL
  User // R
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

    this.initPromise = super
      .readAccess()
      .then((access) => {
        this.id = access.actor.id
        this[symbols.path] = this._getPath()
      })
      .then(() => this.read())
  }

  /**
   * Read the operator's data asynchronously.
   *
   * @returns {Promise}
   */
  init () {
    return this.initPromise
  }

  /**
   * Update the self-same Operator's data.
   *
   * @param {object} data - Update payload, such as { customFields }
   */
  update (data) {
    const opts = {
      method: 'put',
      url: `/operators/${this.id}`,
      apiKey: this.apiKey,
      data
    }

    return this._request(opts)
  }

  // PRIVATE

  /**
   * Return operator endpoint.
   *
   * @return {string}
   */
  _getPath () {
    return `/operators/${this.id}`
  }
}
