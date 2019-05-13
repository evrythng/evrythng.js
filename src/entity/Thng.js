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
  Redirection
])

/**
 * Represents a Thng entity object.
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
      thng: Resource.factoryFor(Thng, path, ThngResources)
    }
  }
}
