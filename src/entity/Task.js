import Entity from './Entity'
import Resource from '../resource/Resource'
import Scope from '../scope/Scope'

const path = '/tasks'

/**
 * Represents a Task entity.
 *
 * @extends Entity
 */
export default class Task extends Entity {
  /**
   * Return simple resource factory for Tasks.
   *
   * @static
   * @return {{tasks: Function}}
   */
  static resourceFactory () {
    return {
      tasks (id) {
        // Only allowed on Entities and Resources.
        if (this instanceof Scope) {
          throw new Error('Task is not a top-level resource.')
        }

        return Resource.factoryFor(Task, path).call(this, id)
      }
    }
  }
}
