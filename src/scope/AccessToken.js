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
import AccessPolicy from '../entity/AccessPolicy'
import AccessTokenEntity from '../entity/AccessToken'
import Me from '../entity/Me'
import Access from '../entity/Access'
import { mixinResources } from '../util/mixin'

/**
 * Mixin with all AccessToken resources.
 *
 * @mixin
 */
const AccessTokenResources = mixinResources([
  Access,
  AccessPolicy,
  AccessTokenEntity,
  Account,
  Action,
  ActionType,
  ADIOrder,
  Collection,
  File,
  Me,
  Place,
  Product,
  Project,
  PurchaseOrder,
  Redirector,
  ShipmentNotice,
  Thng
])

/**
 * AccessToken is a Scope type for the v2 API with the potential to manage any account resources, depending on the API key's
 * permissions. It represents an API access for a specific purpose, instead of a type of Actor, such as an Operator.
 *
 * @extends Scope
 * @mixes AccessTokenResources
 */
export default class AccessToken extends AccessTokenResources(Scope) {
  /**
   * Creates an instance of AccessToken.
   *
   * @param {string} apiKey - API Key of scope
   * @param {Object} [data={}] - Optional data
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
