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
      /**
       * ReactorLog Entity resource. If using with Operator, app and project
       * details are required.
       *
       * @param {string} projectId - Project ID, if using with Operator scope.
       * @param {string} applicationId - Application ID, if using with Operator scope.
       * @returns {Object}
       */
      reactorLog (projectId, applicationId) {
        if (isString(projectId) && !isString(applicationId)) {
          throw new Error('When using with Operator, projectId and applicationId are required')
        }

        const useProjectId = projectId || this.project
        const useApplicationId = applicationId || this.app

        // Find the path to this application
        const appPath = `/projects/${useProjectId}/applications/${useApplicationId}`

        return Object.assign(Resource.factoryFor(ReactorLog, appPath + path).call(this), {
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
