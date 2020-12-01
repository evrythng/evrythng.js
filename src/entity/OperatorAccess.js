import Entity from './Entity'
import Resource from '../resource/Resource'

const path = '/operatorAccess'

/**
 * Represents an Access entity.
 *
 * @extends Entity
 */
export default class OperatorAccess extends Entity {
  /**
   * Return simple resource factory for  Accesses.
   *
   * @static
   * @return {{operatorAccess: Function}}
   */
  static resourceFactory () {
    return {
      operatorAccess (id) {
        return Resource.factoryFor(OperatorAccess, path).call(this, id)
      }
    }
  }
}
