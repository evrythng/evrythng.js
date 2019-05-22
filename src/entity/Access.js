import Entity from './Entity'
import Resource from '../resource/Resource'
import Scope from '../scope/Scope'

const path = '/accesses'

/**
 * Represents an Access entity.
 *
 * @extends Entity
 */
export default class Access extends Entity {
  /**
   * Return simple resource factory for Accesses.
   *
   * @static
   * @return {{access: Function}}
   */
  static resourceFactory () {
    return {
      access (id) {
        // Only allowed on Entities and Resources.
        if (this instanceof Scope) {
          throw new Error('Access is not a top-level resource.')
        }

        return Resource.factoryFor(Access, path).call(this, id)
      }
    }
  }
}
