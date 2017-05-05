import Entity from './Entity'
import Resource from '../resource/Resource'
import isFunction from 'lodash-es/isFunction'
import isUndefined from 'lodash-es/isUndefined'

const path = '/actions'

/**
 * Represents an ActionType entity. Action types endpoint it weird as it
 * overlaps with the Actions (/actions), so there is a normalization necessary
 * on the read method.
 *
 * @extends Entity
 */
export default class ActionType extends Entity {
  /**
   * Return overridden resource factory for ActionsTypes. Read method needs to
   * use a filter as there is no single action type resource endpoint.
   *
   * @static
   * @return {{actionType: Function}}
   */
  static resourceFactory () {
    return {
      actionType (id) {
        return Object.assign(
          Resource.factoryFor(ActionType, path).call(this, id),
          {
            read (...args) {
              return readActionType.call(this, id, ...args)
            }
          }
        )
      }
    }
  }
}

/**
 * Normalize arguments and response on single read request.
 *
 * @param {String} id - Action type ID
 * @param {*} args - Arguments passed to .read method
 * @return {Promise}
 */
function readActionType (id, ...args) {
  if (!id) {
    return Resource.prototype.read.call(this, ...args)
  } else {
    const normalizedArgs = normalizeArguments(id)(...args)
    return new Promise((resolve, reject) => {
      Resource.prototype.read.call(this, ...normalizedArgs)
        .then(actionTypes => {
          if (!actionTypes.length) {
            // Fake 404
            reject({
              status: 404,
              errors: ['The action type was not found.']
            })
          }
          resolve(actionTypes[0])
        })
    })
  }
}

/**
 * Curry normalizeArguments with action type id. Converts single resource path
 * (e.g. /actions/_custom) into plural with filter
 * (e.g. /actions?filter=name=_custom).
 *
 * @param {String} id - ID of action type
 * @return {Function} Normalize arguments transformer.
 */
function normalizeArguments (id) {
  return (...args) => {
    let options
    let firstArg = args[0]

    if (isUndefined(firstArg) || isFunction(firstArg)) {
      options = {}
      args.unshift(options)
    } else {
      options = firstArg
    }

    options.url = path
    options.params = Object.assign(
      { filter: { name: decodeURIComponent(id) } },
      options.params
    )

    return args
  }
}
