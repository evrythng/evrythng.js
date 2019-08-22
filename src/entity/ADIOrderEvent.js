import Entity from './Entity'
import Resource from '../resource/Resource'

const path = '/events'

/**
 * Represents a ADIOrderEvent entity object.
 *
 * @extends Entity
 */
export default class ADIOrderEvent extends Entity {
  /**
   * Return simple resource factory for ADI Order events.
   *
   * @static
   * @return {{event: Function}}
   */
  static resourceFactory () {
    return {
      event: Resource.factoryFor(ADIOrderEvent, path)
    }
  }
}
