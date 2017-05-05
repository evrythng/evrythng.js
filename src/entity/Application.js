import Entity from './Entity'
import Resource from '../resource/Resource'
import Scope from '../scope/Scope'

const path = '/applications'

/**
 * Represents an Application entity.
 *
 * @extends Entity
 */
export default class Application extends Entity {
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

        return Resource.factoryFor(Application, path).call(this, id)
      }
    }
  }
}
