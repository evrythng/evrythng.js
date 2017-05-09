import Entity from './Entity'
import ReactorScript from './ReactorScript'
import ReactorSchedule from './ReactorSchedule'
import Resource from '../resource/Resource'
import Scope from '../scope/Scope'
import { mixinResources } from '../util/mixin'

const path = '/applications'
const ApplicationResources = mixinResources([
  ReactorScript,
  ReactorSchedule
  // ReactorLog,
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
   * @return {{application: Function}}
   */
  static resourceFactory () {
    return {
      application (id) {
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
