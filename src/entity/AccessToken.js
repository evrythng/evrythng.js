import Entity from './Entity'
import Resource from '../resource/Resource'

const path = '/accessTokens'

/**
 * Represents an Access Token entity.
 *
 * @extends Entity
 */
export default class AccessToken extends Entity {
  /**
   * Return simple resource factory for Access Tokens.
   *
   * @static
   * @return {{accessToken: Function}}
   */
  static resourceFactory () {
    return {
      accessToken (id) {
        return Resource.factoryFor(AccessToken, path).call(this, id)
      }
    }
  }
}
