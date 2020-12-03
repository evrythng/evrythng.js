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
import AccessTokens from '../entity/AccessToken'
import Me from '../entity/Me'
import Access from '../entity/Access'
import ADIOrderEvent from '../entity/ADIOrderEvent'
import Application from '../entity/Application'
import CommissionState from '../entity/CommissionState'
import Domain from '../entity/Domain'
import Property from '../entity/Property'
import ReactorLog from '../entity/ReactorLog'
import ReactorSchedule from '../entity/ReactorSchedule'
import ReactorScript from '../entity/ReactorScript'
import Redirection from '../entity/Redirection'
import ShortDomain from '../entity/ShortDomain'
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
  AccessTokens, // CL
  Account, // LRU
  Action, // CRLD
  ActionType, // CRULD
  ADIOrder, // CRL
  ADIOrderEvent, // CRL
  Application, // CRUDL
  Batch, // CRUD
  Collection, // CRUDL
  CommissionState, // R
  Domain, // L
  File, // CRUD
  Me, // R
  OpeatorAccess, // CRUDL
  Place, // CRUDL
  Product, // CRUDL
  Project, // CRUDL
  Property, // CRUDL
  PurchaseOrder, // CRUDL
  ReactorLog, // RD
  ReactorSchedule, // CRUD
  ReactorScript, // RU
  Redirection, // CRUD
  Redirector, // RUD
  Role, // CRUD
  Rule,
  ShipmentNotice, // CRUDL
  ShortDomain, // L
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

    this.initPromise = super.readAccess().then((access) => {
      this.id = access.actor.id
      this[symbols.path] = this._getPath()
    })
  }

  /**
   * Read the operator's data asynchronously.
   *
   * @returns {Promise}
   */
  init () {
    return this.initPromise
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
