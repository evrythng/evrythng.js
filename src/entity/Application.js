import Entity from './Entity'
import ReactorScript from './ReactorScript'
import ReactorSchedule from './ReactorSchedule'
import ReactorLog from './ReactorLog'
import Resource from '../resource/Resource'
import Scope from '../scope/Scope'
import { mixinResources } from '../util/mixin'

const path = '/applications'
const ApplicationResources = mixinResources([
  ReactorScript,
  ReactorSchedule,
  ReactorLog
])

/**
 * Represents an Application entity.
 *
 * @extends Entity
 */
export default class Application extends ApplicationResources(Entity) {
  /**
   * Return simple resource factory for Applications.
   *
   * @static
   * @return {{applications: Function}}
   */
  static resourceFactory () {
    return {
      applications (id) {
        // Only allowed on Entities and Resources.
        if (this instanceof Scope) {
          throw new Error('Application is not a top-level resource.')
        }

        return Resource.factoryFor(Application, path, ApplicationResources)
          .call(this, id)
      }
    }
  }
}
