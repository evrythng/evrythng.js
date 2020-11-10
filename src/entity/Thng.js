import CommissionState from './CommissionState'
import Entity from './Entity'
import Property from './Property'
import Action from './Action'
import Location from './Location'
import Redirection from './Redirection'
import Resource from '../resource/Resource'
import { mixinResources } from '../util/mixin'

const path = '/thngs'
const ThngResources = mixinResources([
  Property,
  Action,
  Location,
  Redirection,
  CommissionState
  // Thng // Read explanation below.
])

/**
 * Represents a Thng entity object. Thng has nested Thngs
 * sub-resources. The workaround for the circular dependency is to only add
 * the Thng resource mixin after the class definition. This is different
 * than baking it in the parent Class Expression mixin
 * (i.e. ThngResources) as the method is attached to the Thng
 * prototype, rather than the extended Entity class. Though, given the JS
 * prototype chain, there is no difference for the end user.
 *
 * @extends Entity
 */
export default class Thng extends ThngResources(Entity) {
  /**
   * Return simple resource factory for Thngs.
   *
   * @static
   * @return {{thng: Function}}
   */
  static resourceFactory () {
    return {
      thng(id) { 
        // Explicitly add Thng resource mixin to nested resource.
        return Object.assign(
          Resource.factoryFor(Thng, path, ThngResources, 'thng')
            .call(this, id),
          Thng.resourceFactory()
        )
      }
    }
  }
}
