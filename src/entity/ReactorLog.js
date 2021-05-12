import Entity from './Entity'
import Resource from '../resource/Resource'
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
      reactorLog (id) {
        // Reactor logs don't have single resource endpoint (e.g.: /logs/:id)
        if (isString(arguments[0])) {
          throw new TypeError('There is no single resource for Reactor Logs')
        }

        // Find the path to this application
        const appPath = `/projects/${this.project}/applications/${this.app}`

        return Object.assign(Resource.factoryFor(ReactorLog, appPath + path).call(this, id), {
          create (...args) {
            return createLogs.call(this, ...args)
          }
        })
      }
    }
  }
}

/**
 * Use bulk endpoint when creating array of logs.
 *
 * @param {Object} data - Logs payload.
 * @param {Object} options - Optional request options.
 * @return {Promise}
 */
function createLogs (data, options = {}) {
  const logs = Array.isArray(data) ? data : [data]

  // Change URL for bulk creation
  options.url = `${this.path}/bulk`

  return Resource.prototype.create.call(this, logs, options)
}
