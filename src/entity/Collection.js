import Entity from './Entity'
import Thng from './Thng'
import Action from './Action'
import Resource from '../resource/Resource'
import { mixinResources } from '../util/mixin'

const path = '/collections'
const CollectionResources = mixinResources([
  Thng,
  // Collection,
  Action
])

/**
 * Represents a Collection entity object.
 *
 * @export
 * @class Collection
 */
export default class Collection extends CollectionResources(Entity) {
  /**
   * Return simple resource factory for Collections.
   *
   * @return {{product: Function}}
   */
  static resourceFactory () {
    return {
      collection: Resource.factoryFor(Collection, path, CollectionResources)
    }
  }
}
