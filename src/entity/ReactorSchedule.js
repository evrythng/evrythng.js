import Entity from './Entity'
import Resource from '../resource/Resource'

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
        // if (this instanceof AppScope) {
        //   TODO make sure all requests are made after $init promise
        // }

        return Resource.factoryFor(ReactorSchedule, path).call(this, id)
      }
    }
  }
}
