import isString from 'lodash-es/isString'
import Entity from './Entity'
import Resource from '../resource/Resource'

const path = '/rules'

/**
 * Represents a Rule entity object.
 *
 * @extends Entity
 */
export default class Rule extends Entity {
  /**
   * Return simple resource factory for Rules.
   *
   * @static
   * @return {{rule: Function}}
   */
  static resourceFactory () {
    return {
      rule (ruleName) {
        if (!isString(ruleName)) {
          throw new TypeError('Rule name must be a string')
        }

        return Object.assign(
          Resource.factoryFor(Rule, path).call(this, ruleName),
          {
            run (...args) {
              return Resource.prototype.create.call(this, ...args)
            }
          }
        )
      }
    }
  }
}
