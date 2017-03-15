import Entity from './Entity'
import Property from './Property'
import Action from './Action'
import Resource from '../resource/Resource'
import { mixinResources } from '../util/mixin'

const path = '/thngs'
const ThngResources = mixinResources([
  Property,
  Action
  // Location
])

/**
 * Represents a Thng entity object.
 *
 * @export
 * @class Thng
 */
export default class Thng extends ThngResources(Entity) {
  /**
   * Return simple resource factory for Thngs.
   *
   * @return {{product: Function}}
   */
  static resourceFactory () {
    return {
      thng: Resource.factoryFor(Thng, path, ThngResources)
    }
  }

  // TODO add readProduct() ?
}
