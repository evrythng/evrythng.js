import Scope from './Scope'
import Thng from '../entity/Thng'
import symbols from '../symbols'

/**
 * Device is the Scope that represents an active/smart Thng. It can only
 * essentially update itself and its nested resources (e.g. Property, Location,
 * Action).
 *
 * @extends Scope
 */
export default class Device extends Scope {
  /**
   * Creates an instance of Device.
   *
   * @param {string} apiKey - API Key of scope
   * @param {Object} [data={}] - Optional device data
   */
  constructor (apiKey, data = {}) {
    super(apiKey, data)

    this[symbols.init] = this[symbols.init]
      .catch(() => {
        throw new Error('There is no thng with this API Key')
      })
      .then(access => {
        this.id = access.actor.id
        this[symbols.path] = this._getPath()
      })
      .then(this.read.bind(this))
  }

  /**
   * Proxy request to Thng resource.
   *
   * @param {*} args - Defined in Property
   */
  property (...args) {
    return this._getResource().property(...args)
  }

  /**
   * Proxy request to Thng resource.
   *
   * @param {*} args - Defined in Action
   */
  action (...args) {
    return this._getResource().action(...args)
  }

  /**
   * Proxy request to Thng resource.
   *
   * @param {*} args - Defined in Location
   */
  location (...args) {
    return this._getResource().location(...args)
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

  /**
   * Return newly instantiated Thng resource for this device ID.
   *
   * @returns {Resource}
   * @private
   */
  _getResource () {
    return Thng.resourceFactory().thng.call(this, this.id)
  }
}
