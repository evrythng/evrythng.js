import Entity from './Entity'
import Resource from '../resource/Resource'
import settings from '../settings'
import symbols from '../symbols'
import getCurrentPosition from '../util/getCurrentPosition'
import isString from 'lodash-es/isString'
import isFunction from 'lodash-es/isFunction'
import isUndefined from 'lodash-es/isUndefined'

const path = '/actions/:type'

/**
 * Represents an Action entity.
 *
 * @extends Entity
 */
export default class Action extends Entity {
  /**
   * Return overridden resource factory for Actions. Actions require an
   * action type to be specified before the ID. The action creation is also
   * different from any other Resource, as it fetches the user location and
   * pre-populates the action payload with the Resource type.
   *
   * @static
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

        const relativePath = path.replace(':type', actionType)
        const context = this

        // Creates and returns Resource of type Action.
        // Override property resource create to allow custom value params and
        // fetch the user's geolocation. See `createAction()`.
        return Object.assign(
          Resource.factoryFor(Action, relativePath).call(this, id),
          {
            create (...args) {
              return createAction.call(this, context, actionType, ...args)
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
 * @param {Scope|Resource|Entity} caller - Where the resource is attached to
 * @param {string} actionType - Type of action
 * @param {*} args - Rest of arguments passed to resource creation
 * @return {Promise}
 */
function createAction (caller, actionType, ...args) {
  let [data, ...rest] = normalizeArguments(...args)
  let [options] = rest

  // Auto-fill action payload with resource type and entity id.
  data = Array.isArray(data)
    ? data.map(action => fillAction(action, caller, actionType))
    : data = fillAction(data, caller, actionType)

  const baseCreate = Resource.prototype.create.bind(this)
  const updatedArgs = () => [data, ...rest]

  if (useGeolocation(options)) {
    return getCurrentPosition()
      .then(position => {
        data = fillActionLocation(data, position)
        return baseCreate(...updatedArgs())
      })
      .catch(err => {
        console.info(`Unable to get position: ${err}`)
        return baseCreate(...updatedArgs())
      })
  } else {
    return baseCreate(...updatedArgs())
  }
}

/**
 * Add an empty action object if none is provided.
 *
 * @param {*} args - Arguments array.
 * @return {Array} - Same input format, with first data param updated.
 * @example
 *
 * product.action().create()
 * product.action().create(<Action>)
 */
function normalizeArguments (...args) {
  let firstArg = args[0]
  if (isUndefined(firstArg) || isFunction(firstArg)) {
    args.unshift({})
  }
  return args
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
function fillAction (data, caller, actionType) {
  const action = Object.assign({}, data)

  // Fill type from Resource or pre-defined type.
  action.type = actionType !== 'all' ? actionType : data.type || ''

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
    ? caller[symbols.actionIdentifier]
      ? caller[symbols.actionIdentifier]
      : ''
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
 * @param {Object} position - Geolocation API position coordinates
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
