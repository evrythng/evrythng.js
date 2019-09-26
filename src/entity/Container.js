import Entity from './Entity'
import Resource from '../resource/Resource'

const path = '/containers'

/**
 * Represents a Container entity object.
 *
 * @extends Entity
 */
export default class Container extends Entity {
  /**
   * Return simple resource factory for shipment notice containers.
   *
   * @static
   * @return {{container: Function}}
   */
  static resourceFactory () {
    return {
      container: Resource.factoryFor(Container, path)
    }
  }
}
