import Entity from './Entity'
import Resource from '../resource/Resource'
import settings from '../settings'
import getCurrentPosition from '../util/getCurrentPosition'
import isString from 'lodash-es/isString'
import isFunction from 'lodash-es/isFunction'
import isArray from 'lodash-es/isArray'
import isUndefined from 'lodash-es/isUndefined'

const path = '/actions/:type'

/**
 * Represents a Property entity. Properties are always nested and require
 * to be constructed on Resource/Entity objects (not top level Scopes).
 *
 * @export
 * @class Action
 */
export default class Action extends Entity {
  /**
   * Return overridden resource factory for Actions. Actions require an
   * action type to be specified before the ID. The action creation is also
   * different from any other Resource, as it fetches the user location and
   * pre-populates the action payload with the Resource type.
   *
   * @return {{action: Function}}
   */
  static resourceFactory () {
    return {
      action (actionType, id) {
        if (!actionType) {
          throw new TypeError('Action type cannot be empty.')
        }

        if (!isString(actionType)) {
          throw new TypeError('Action type must be a name string')
        }

        const typePath = path.replace(':type', actionType)

        // Creates and returns Resource of type Action.
        // Override property resource create to allow custom value params and
        // fetch the user's geolocation. See `createAction()`.
        return Object.assign(
          Resource.factoryFor(Action, typePath).call(this, id),
          {
            create (...args) {
              return createAction.call(this, actionType, ...args)
            }
          }
        )
      }
    }
  }
}

/**
 * Create action of given type. Allow empty body and fetch geolocation if
 * setup and available.
 *
 * @param {string} actionType - Type of action
 * @param {*} args - Rest of arguments passed to resource creation
 * @return {Promise}
 */
function createAction (actionType, ...args) {
  let [data, options, ...rest] = normalizeArguments(...args)
  if (isArray(data)) {
    data = data.map(action => {
      return fillAction(action, actionType, this)
    })
  } else {
    data = fillAction(data, actionType, this)
  }

  const request = Resource.prototype.create.bind(this)

  if (useGeolocation(options)) {
    return getCurrentPosition()
      .then(position => {
        data = fillActionLocation(data, position)
        return request(...[data, options, ...rest])
      })
      .catch(err => {
        console.info('Unable to get position:', err)
        return request(...[data, options, ...rest])
      })
  } else {
    return request(...[data, options, ...rest])
  }
}

/**
 * Add an empty action object if none is provided.
 *
 * E.g.:
 * ```
 * .action().create()
 * ```
 *
 * @param {*} data - Property data.
 * @param {*} rest - Rest of parameters.
 * @return {Array} - Same input format, with first data param updated.
 */
function normalizeArguments (data, ...rest) {
  if (isUndefined(data) || isFunction(data)) {
    rest.unshift(data)
    data = {}
  }

  return [data, ...rest]
}

/**
 * Fill action type and entity ID. Resource type takes precedence over given
 * type. Entity ID overrides any pre-defined target ID, if action is created on
 * an Entity instance.
 *
 * @param {Object} data - Action data
 * @param {Scope|Resource|Entity} caller - Where the resource is attached to
 * @param {string} actionType - Resource action type
 * @return {Object} - New action data
 */
function fillAction (data, actionType, caller) {
  const action = Object.assign({}, data)

  // Fill type from Resource or pre-defined type.
  action.type = actionType !== 'all' && actionType || data.type || ''

  // Fill in entity ID if called on an entity.
  const entityIdentifier = getIdentifier(caller)
  if (entityIdentifier) {
    action[entityIdentifier] = caller.id
  }

  return action
}

/**
 * Actions can be performed on Products, Thngs and Collections and the
 * property on the payload differs based on the target.
 *
 * @param {Scope|Resource|Entity} caller - Where the resource is attached to
 * @return {string}
 */
function getIdentifier (caller) {
  return caller instanceof Entity
    ? caller.constructor.name.toLocaleLowerCase()
    : ''
}

/**
 * Check if the library should request the browser geolocation. If local
 * option is available, it takes precedence over global setting.
 *
 * @param {Settings|Function} options - If function, it's the callback
 * @return {boolean}
 */
function useGeolocation (options) {
  return options && !isUndefined(options.geolocation)
    ? options.geolocation
    : settings.geolocation
}

/**
 * Fill action location with coordinates from browser's Geolocation API.
 *
 * @param {Object} data - Action data
 * @param {GeoJSON} position - GeoJSON with position coordinates
 * @return {Object} - New action data
 */
function fillActionLocation (data, position) {
  const action = Object.assign({}, data)
  action.location = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude
  }
  action.locationSource = 'sensor'
  return action
}
