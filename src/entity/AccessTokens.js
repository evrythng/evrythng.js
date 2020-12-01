import Entity from './Entity'
import Resource from '../resource/Resource'

const path = '/accessTokens'

/**
 * Represents an Access Token entity.
 *
 * @extends Entity
 */
export default class AccessTokens extends Entity {
  /**
   * Return simple resource factory for Access Tokens.
   *
   * @static
   * @return {{accessTokens: Function}}
   */
  static resourceFactory () {
    return {
      accessTokens (id) {
        // добавить проверки на неправильный url и scope
        return Resource.factoryFor(AccessTokens, path).call(this, id)
      }
    }
  }
}
