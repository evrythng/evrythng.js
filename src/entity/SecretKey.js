import Entity from './Entity'
import Resource from '../resource/Resource'
import isString from 'lodash-es/isString'

const path = '/secretKey'

/**
 * Represents a SecretKey entity on a Trusted Application.
 *
 * @extends Entity
 */
export default class SecretKey extends Entity {
  /**
   * Return simple resource factory for SecretKey.
   *
   * @static
   * @return {{secretKey: Function}}
   */
  static resourceFactory () {
    return {
      secretKey () {
        if (isString(arguments[0])) {
          throw new TypeError('There is no single resource for SecretKey')
        }

        return Resource.factoryFor(SecretKey, path).call(this)
      }
    }
  }
}
