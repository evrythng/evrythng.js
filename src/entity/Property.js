import Entity from './Entity'
import Resource from '../resource/Resource'
import Scope from '../scope/Scope'
import symbols from '../symbols'
import isString from 'lodash-es/isString'
import isPlainObject from 'lodash-es/isPlainObject'

const path = '/properties'

/**
 * Represents a Property entity. Properties are always nested and required
 * to be constructed on Resource/Entity objects (not top level Scopes).
 *
 * @extends Entity
 */
export default class Property extends Entity {
  /**
   * Return overridden resource factory for Properties. Properties are
   * sub-resources of Thngs and Products and are not allowed on top level
   * Scope classes. This factory also override the default Resource's create
   * and update methods to accept and normalize different types of arguments.
   *
   * @static
   * @return {{property: Function}}
   */
  static resourceFactory () {
    return {
      property (id) {
        const thngPath = this instanceof Scope ? this[symbols.path] : ''

        // Creates and returns Resource of type Property.
        // Override property resource create/update to allow custom value
        // params. See `normalizeArguments()`.
        return Object.assign(Resource.factoryFor(Property, thngPath + path).call(this, id), {
          create (...args) {
            return Resource.prototype.create.call(this, ...normalizeArguments(...args))
          },
          update (...args) {
            return Resource.prototype.update.call(this, ...normalizeArguments(...args))
          }
        })
      }
    }
  }
}

/**
 * The API only allows array format for property updates. The SDK relaxed that
 * and allows developers to pass in simple strings, numbers, booleans and objects.
 * It also allows to pass multiple key-value updates in a single object.
 *
 * @param {*} data - Property data.
 * @param {*} rest - Rest of parameters.
 * @return {Array} - Same input format, with first data param updated.
 * @example
 *
 * product.property().update({
 *   on: true,
 *   temp: 26,
 *   custom: ['1', '2']
 * })
 */
function normalizeArguments (data, ...rest) {
  if (isString(data) || typeof data === 'number' || typeof data === 'boolean') {
    // Convert simple property values to API format.
    data = [{ value: data }]
  } else if (isPlainObject(data)) {
    if (data.hasOwnProperty('value')) {
      // Update single property using object notation.
      data = [data]
    } else {
      // Update multiple properties creating an object for each key-value pair.
      data = Object.entries(data).map((val) => ({
        key: val[0],
        value: val[1]
      }))
    }
  }

  return [data, ...rest]
}
