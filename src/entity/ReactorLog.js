import Entity from './Entity'
import Resource from '../resource/Resource'
import Scope from '../scope/Scope'
import symbols from '../symbols'
import isUndefined from 'lodash-es/isUndefined'
import isFunction from 'lodash-es/isFunction'
import isString from 'lodash-es/isString'

const path = '/reactor/logs'

/**
 * Represents a ReactorLog entity object.
 *
 * @extends Entity
 */
export default class ReactorLog extends Entity {
  static resourceFactory () {
    return {
      reactorLogs (id) {
        // Reactor logs don't have single resource endpoint (e.g.: /logs/:id)
        if (isString(arguments[0])) {
          throw new TypeError('There is no single resource for Reactor Logs')
        }

        const appPath = this instanceof Scope ? this[symbols.path] : ''

        return Object.assign(
          Resource.factoryFor(ReactorLog, appPath + path).call(this, id),
          {
            create (...args) {
              return createLogs.call(this, ...args)
            }
          }
        )
      }
    }
  }
}

/**
 * Use bulk endpoint when creating array of logs.
 *
 * @param {Object} data - Log payload.
 * @param {Array} rest - Rest of arguments.
 * @return {Promise}
 */
function createLogs (data, ...rest) {
  if (Array.isArray(data)) {
    let [options] = rest
    if (isUndefined(options) || isFunction(options)) {
      options = {}
      rest.unshift(options)
    }
    options.url = `${this.path}/bulk`
  }

  return Resource.prototype.create.call(this, data, ...rest)
}
