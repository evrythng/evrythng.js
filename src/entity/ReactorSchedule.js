import Entity from './Entity'
import Resource from '../resource/Resource'
import Scope from '../scope/Scope'
import symbols from '../symbols'

const path = '/reactor/schedules'

/**
 * Represents a ReactorSchedule entity object.
 *
 * @extends Entity
 */
export default class ReactorSchedule extends Entity {
  static resourceFactory () {
    return {
      reactorSchedule (id) {
        const appPath = this instanceof Scope ? this[symbols.path] : ''

        return Resource.factoryFor(ReactorSchedule, appPath + path)
          .call(this, id)
      }
    }
  }
}
