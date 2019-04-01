import Scope from './Scope'
import Property from '../entity/Property'
import Action from '../entity/Action'
// import Location from '../entity/Location'
import symbols from '../symbols'
import { mixinResources } from '../util/mixin'

/**
 * Mixin with all the top-level Application resources.
 *
 * @mixin
 */
const DeviceAccess = mixinResources([
  Property,          // CRUD
  Action             // CRUD
  // Location           // CRUD
])

/**
 * Device is the Scope that represents an active/smart Thng. It can only
 * essentially update itself and its nested resources (e.g. Property, Location,
 * Action).
 *
 * @extends Scope
 */
export default class Device extends DeviceAccess(Scope) {
  /**
   * Creates an instance of Device.
   *
   * @param {string} apiKey - API Key of scope
   * @param {Object} [data={}] - Optional device data
   */
  constructor (apiKey, data = {}) {
    super(apiKey, data)
  }

  /**
   * Read the Thng's data asynchronously.
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
      .catch(() => {
        throw new Error('There is no Thng with this API Key')
      })
  }

  // PRIVATE

  /**
   * Return device thng endpoint.
   *
   * @return {string}
   */
  _getPath () {
    return `/thngs/${this.id}`
  }
}
