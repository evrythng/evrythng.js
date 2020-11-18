import Entity from './Entity'
import Resource from '../resource/Resource'

const path = '/operatorAccess'

/**
 * Represents an Operator Access entity.
 *
 * @extends Entity
 */
export default class OpeatorAccess extends Entity {
  /**
   * Return simple resource factory for Operator Accesses.
   *
   * @static
   * @return {{operatorAccess: Function}}
   */
  static resourceFactory () {
    return {
      operatorAccess (id) {
        // добавить проверки на неправильный url и scope
     return Resource.factoryFor(OpeatorAccess, path).call(this, id)
    }
  }
}
}
