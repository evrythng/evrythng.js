import Entity from './Entity'
import Resource from '../resource/Resource'
import Scope from '../scope/Scope'
import settings from '../settings'
import symbols from '../symbols'
import getCurrentPosition from '../util/getCurrentPosition'
import isUndefined from 'lodash-es/isUndefined'
import isFunction from 'lodash-es/isFunction'
import isPlainObject from 'lodash-es/isPlainObject'
import isString from 'lodash-es/isString'

const path = '/location'

/**
 * Represents a Location entity. Locations are always nested and required
 * to be constructed on Resource/Entity objects (not top level Scopes).
 *
 * @extends Entity
 */
export default class Location extends Entity {
  /**
   * Return overridden resource factory for Locations. Locations are
   * sub-resources of Thngs and are not allowed on top level Scope classes.
   * This factory also override the default Resource's update method to allow
   * empty invocations that send the current browser's location as the payload.
   *
   * @static
   * @return {{location: Function}}
   */
  static resourceFactory () {
    return {
      location () {
        // Locations don't have single resource endpoint (e.g.: /locations/:id)
        if (isString(arguments[0])) {
          throw new TypeError('There is no single resource for Locations')
        }

        const thngPath = this instanceof Scope ? this[symbols.path] : ''

        // Creates and returns Resource of type Location.
        // Override property resource update to allow empty updates.
        // See `updateLocation()`.
        return Object.assign(
          Resource.factoryFor(Location, thngPath + path).call(this),
          {
            update (...args) {
              return updateLocation.call(this, ...args)
            }
          }
        )
      }
    }
  }
}

/**
 * Update locations given an array of new locations. If none is provided
 * it tries to use the current browser location for the update.
 *
 * @param {*} args - List of locations or nothing
 * @return {Promise}
 */
function updateLocation (...args) {
  let [data, ...rest] = normalizeArguments(...args)
  const baseUpdate = Resource.prototype.update.bind(this)
  const updatedArgs = () => [data, ...rest]

  if (useGeolocation(data)) {
    return getCurrentPosition()
      .then(position => {
        data[0] = fillLocation(data[0], position)
        return baseUpdate(...updatedArgs())
      })
      .catch(err => {
        console.info(`Unable to get position: ${err}`)
        return baseUpdate(...updatedArgs())
      })
  } else {
    return baseUpdate(...updatedArgs())
  }
}

/**
 * Convert simple object to array. Add an empty location array if none is
 * provided.
 *
 * @param {*} args - Arguments array.
 * @return {Array} - Same input format, with first data param updated.
 * @example
 *
 * thng.location().update()
 * thng.location().update([<Location>])
 */
function normalizeArguments (...args) {
  let firstArg = args[0]
  if (isPlainObject(firstArg)) {
    args[0] = [firstArg]
  } else if (isUndefined(firstArg) || isFunction(firstArg)) {
    args.unshift([])
  }
  return args
}

/**
 * Use geolocation if no location was provided and global settings allow to use
 * geolocation.
 *
 * @param {Array} data - Data passed to the update (list of locations)
 * @return {boolean}
 */
function useGeolocation (data) {
  return data.length === 0 && settings.geolocation
}

/**
 * Fill location coordinates from browser's Geolocation API.
 *
 * @param {Object} data - Location data
 * @param {Object} position - Geolocation API position coordinates
 * @return {Object} - New location data
 */
function fillLocation (data, position) {
  const location = Object.assign({}, data)
  location.position = {
    type: 'Point',
    coordinates: [position.coords.longitude, position.coords.latitude]
  }
  return location
}
