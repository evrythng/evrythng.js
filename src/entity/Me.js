import Entity from './Entity'
import Resource from '../resource/Resource'

const path = '/me'

/**
 * Represents an Access Policy entity.
 *
 * @extends Entity
 */
export default class Me extends Entity {
  /**
   * Return simple resource factory for Access Policies.
   *
   * @static
   * @return {{me: Function}}
   */
  static resourceFactory () {
    return {
      me () {
        // добавить проверки на неправильный url и scope
    return Resource.factoryFor(Me, path).call(this)
    }
    }
}
}
