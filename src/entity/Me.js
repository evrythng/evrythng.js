import Entity from './Entity'
import Resource from '../resource/Resource'

const path = '/me'

/**
 * Represents a Me entity.
 *
 * @extends Entity
 */
export default class Me extends Entity {
  /**
   * Return simple resource factory for Me.
   *
   * @static
   * @return {{me: Function}}
   */
  static resourceFactory () {
    return {
      me () {
        return Resource.factoryFor(Me, path).call(this)
      }
    }
  }
}
