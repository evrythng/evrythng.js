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
import ShipmentNotice from '../entity/ShipmentNotice'
import Place from '../entity/Place'
import File from '../entity/File'
import OpeatorAccess from '../entity/OperatorAccess'
import AccessPolicy from '../entity/AccessPolicy'
import AccessTokens from '../entity/AccessToken'
import Me from '../entity/Me'
import ADIOrderEvent from '../entity/ADIOrderEvent'
import CommissionState from '../entity/CommissionState'
import Access from '../entity/Access'
import Application from '../entity/Application'
import Domain from '../entity/Domain'
import Property from '../entity/Property'
import ReactorLog from '../entity/ReactorLog'
import ReactorSchedule from '../entity/ReactorSchedule'
import ReactorScript from '../entity/ReactorScript'
import Redirection from '../entity/Redirection'
import ShortDomain from '../entity/ShortDomain'
import { mixinResources } from '../util/mixin'

/**
 * Mixin with all AccessTokenR resources.
 *
 * @mixin
 */
const AccessTokenResources = mixinResources([
  Access, // LR
  AccessPolicy, // CRUDL
  AccessTokens, // CL
  Account, // LRU
  Action, // CRLD
  ActionType, // CRLD
  ADIOrder, // CRL
  ADIOrderEvent, // CRL
  Application, // CRUDL
  Collection, // CRUDL
  CommissionState, // R
  Domain, // L
  File, // RC
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
  ShipmentNotice, // CRUDL
  ShortDomain, // L
  Thng // CRUDL
])

/**
 * AccessToken is the Scope for v2 api version with permissions that can manage the account
 * resources. Should be used with caution in server-side code.
 *
 * @extends Scope
 * @mixes AccessTokenResources
 */
export default class AccessToken extends AccessTokenResources(Scope) {
  /**
   * Creates an instance of AccessToken.
   *
   * @param {string} apiKey - API Key of scope
   * @param {Object} [data={}] - Optional operator data
   */
  constructor (apiKey, data = {}) {
    super(apiKey, data)

    this.initPromise = super.readAccess()
  }

  /**
   * Read the access token's data asynchronously.
   *
   * @returns {Promise}
   */
  init () {
    return this.initPromise
  }
}
