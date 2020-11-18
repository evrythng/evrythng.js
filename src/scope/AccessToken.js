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
import Rule from '../entity/Rule'
import ShipmentNotice from '../entity/ShipmentNotice'
import Place from '../entity/Place'
import File from '../entity/File'
import OperatorAccess from '../entity/OperatorAccess'
import AccessPolicy from '../entity/AccessPolicies'
import AccessTokens from '../entity/AccessTokens'
import Me from '../entity/Me'
import { mixinResources } from '../util/mixin'
import symbols from '../symbols'

/**
 * Mixin with all the access tokens resources.
 *
 * @mixin
 */
const AccessToken = mixinResources([
  Account, // RU
  ADIOrder,  // CR
  Product, // CRUD
  Thng, // CRUD
  Collection, // CRUD
  Action, // CR
  ActionType, // CRUD
  Project, // CRUD
  PurchaseOrder, // CRUD
  Redirector, // RU
  Rule,
  ShipmentNotice, // CRUD
  Place, // CRUD
  File, // CRD
  OperatorAccess, // CRUD
  AccessPolicy, // CRUD
  Me, // R
  AccessTokens // CRUD
])

/**
 * AccessToken is the Scope with permissions that can manage the account
 * resources. Should be used with caution in server-side code.
 *
 * @extends Scope
 * @mixes AccessToken
 */
export default class Token extends AccessToken(Scope) {
  /**
   * Creates an instance of Token.
   *
   * @param {string} apiKey - API Key of scope
   * @param {Object} [data={}] - Optional operator data
   */
  // constructor (apiKey, data = {}) {
  //   super(apiKey, data)

  //   this.initPromise = super.readAccess()
  //     .then(access => {
  //       //this.id = access.actor.id
  //       this[symbols.path] = this._getPath()
  //     })
  // }

  // /**
  //  * Read the operator's data asynchronously.
  //  *
  //  * @returns {Promise}
  //  */
  // init () {
  //   return this.initPromise
  // }

  // // PRIVATE

  // /**
  //  * Return operator access endpoint.
  //  *
  //  * @return {string}
  //  */
  // _getPath () {
  //   return '/access'
  // }
}
