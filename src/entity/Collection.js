import Entity from './Entity'
import Thng from './Thng'
import Action from './Action'
import Resource from '../resource/Resource'
import mixin, { mixinResources } from '../util/mixin'

const path = '/collections'
const CollectionResources = mixinResources([
  Thng,
  Action
  // Collection // Read explanation below.
])

/**
 * Represents a Collection entity object. Collection has nested Collections
 * sub-resources. The workaround for the circular dependency is to only add
 * the Collection resource mixin after the class definition. This is different
 * than baking it in the parent Class Expression mixin
 * (i.e. CollectionResources) as the method is attached to the Collection
 * prototype, rather than the extended Entity class. Though, given the JS
 * prototype chain, there is no difference for the end user.
 *
 * @extends Entity
 */
export default class Collection extends CollectionResources(Entity) {
  /**
   * Return simple resource factory for Collections.
   *
   * @static
   * @return {{collection: Function}}
   */
  static resourceFactory () {
    return {
      collection (id) {
        // Explicitly add Collection resource mixin to nested resource.
        return Object.assign(
          Resource.factoryFor(Collection, path, CollectionResources)
            .call(this, id),
          Collection.resourceFactory()
        )
      }
    }
  }
}

// Explicitly add Collection resource mixin to Collection.
mixin(Collection.resourceFactory())(Collection)
