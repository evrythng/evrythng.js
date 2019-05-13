import Entity from './Entity'
import Resource from '../resource/Resource'

const path = '/redirector'

/**
 * Represents a Redirector entity object.
 *
 * @extends Entity
 */
export default class Redirector extends Entity {
  /**
   * Return simple resource factory for a Redirector.
   *
   * @static
   * @return {{redirector: Function}}
   */
  static resourceFactory () {
    return {
      redirector: Resource.factoryFor(Redirector, path)
    }
  }
}
