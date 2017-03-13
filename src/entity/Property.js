import Entity from './Entity'
import Resource from '../resource/Resource'
import isString from 'lodash-es/isString'
import isPlainObject from 'lodash-es/isPlainObject'

const path = '/properties'

/**
 * Represents a Property entity. Properties are always nested and require
 * to be constructed on Resource/Entity objects (not top level Scopes).
 *
 * @export
 * @class Property
 */
export default class Property extends Entity {
  static resourceFactory () {
    return {
      property (property) {
        if (this.apiKey) {
          throw new Error('Property is not a top-level resource.')
        }

        // Allowed on both Entities and Resources.
        const parent = this.resource ? this.resource : this
        let newPath = `${parent.path}${path}`

        if (property) {
          if (isString(property)) {
            newPath += `/${encodeURIComponent(property)}`
          } else {
            throw new TypeError('Property must be a key/name string.')
          }
        }

        // Creates and returns Resource of type Property.
        // Override property resource create/update to allow custom value
        // params. See `normalizeArguments()`.
        return Object.assign(
          new Resource(parent.scope, newPath, Property),
          {
            create (...args) {
              return Resource.prototype.create
                .call(this, ...normalizeArguments(...args))
            },
            update (...args) {
              return Resource.prototype.update
                .call(this, ...normalizeArguments(...args))
            }
          }
        )
      }
    }
  }
}

/**
 * The API only allows array format for property updates. The SDK relaxed that
 * and allows developers to pass in simple strings, numbers, booleans and objects.
 * It also allows to pass multiple key-value updates in a single object.
 *
 * E.g.
 * ```
 * .property().update({
 *   on: true,
 *   temp: 26,
  *  custom: ['1', '2']
 * })
 * ```
 * @param {*} data - Property data.
 * @param {*} rest - Rest of parameters.
 * @return {Array} - Same input format, with first data param updated.
 */
function normalizeArguments (data, ...rest) {
  if (
    isString(data) ||
    typeof data === 'number' ||
    typeof data === 'boolean'
  ) {
    // Convert simple property values to API format.
    data = [{ value: data }]
  } else if (isPlainObject(data)) {
    if (data.hasOwnProperty('value')) {
      // Update single property using object notation.
      data = [data]
    } else {
      // Update multiple properties creating an object for each key-value pair.
      data = Object.entries(data).map(val => ({
        key: val[0],
        value: val[1]
      }))
    }
  }

  return [data, ...rest]
}
