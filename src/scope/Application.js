import Scope from './Scope'
import Product from '../entity/Product'
import Action from '../entity/Action'
import Place from '../entity/Place'
import AppUserAccess from '../entity/AppUserAccess'
import { mixinResources } from '../util/mixin'

/**
 * Mixin with all the top-level Operator resources.
 *
 * @mixin
 */
const ApplicationAccess = mixinResources([
  Product,          // R
  Action,           // C scans
  AppUserAccess,    // C
  Place             // R
])

/**
 * Application is the Scope with the least permissions. It is meant to be used
 * to create and authenticate application users.
 *
 * @extends Scope
 * @mixes ApplicationAccess
 */
export default class Operator extends ApplicationAccess(Scope) {
  /**
   * Creates an instance of Application.
   *
   * @param {string} apiKey - API Key of scope
   * @param {Object} [data={}] - Optional application data
   */
  constructor (apiKey, data = {}) {
    super(apiKey, data)
    this.$init = this.$init
      .then(access => {
        this.id = access.actor.id
        this.project = access.project
      })
      .then(this.read.bind(this))
      .catch(() => {
        throw new Error('There is no application with this API Key')
      })
  }

  /**
   * Return application endpoint, nested within projects.
   *
   * @return {string}
   */
  get scopePath () {
    return `/projects/${this.project}/applications/${this.id}`
  }
}
