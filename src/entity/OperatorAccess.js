import Entity from './Entity'
import Resource from '../resource/Resource'

const path = '/operatorAccess'

/**
 * Represents an Operator Access entity.
 *
 * @extends Entity
 */
export default class OperatorAccess extends Entity {
  /**
   * Return simple resource factory for  Operator Accesses.
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
