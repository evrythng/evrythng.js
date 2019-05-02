import Entity from './Entity'
import Resource from '../resource/Resource'

const path = '/places'

/**
 * Represents a Place entity object.
 *
 * @extends Entity
 */
export default class Place extends Entity {
  /**
   * Return simple resource factory for Places.
   *
   * @static
   * @return {{places: Function}}
   */
  static resourceFactory () {
    return {
      places: Resource.factoryFor(Place, path)
    }
  }
}
