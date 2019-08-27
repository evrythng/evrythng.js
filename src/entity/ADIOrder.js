import Entity from './Entity'
import ADIOrderEvent from './ADIOrderEvent'
import Resource from '../resource/Resource'
import { mixinResources } from '../util/mixin'

const path = '/adis/orders'
const ADIOrderResources = mixinResources([
  ADIOrderEvent
])

/**
 * Represents a ADIOrder entity object.
 *
 * @extends Entity
 */
export default class ADIOrder extends ADIOrderResources(Entity) {
  /**
   * Return simple resource factory for ADI Orders.
   *
   * @static
   * @return {{adiOrder: Function}}
   */
  static resourceFactory () {
    return {
      adiOrder: Resource.factoryFor(ADIOrder, path, ADIOrderResources)
    }
  }
}
