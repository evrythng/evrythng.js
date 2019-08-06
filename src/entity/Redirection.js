import Entity from './Entity'
import Resource from '../resource/Resource'
import Scope from '../scope/Scope'
import isString from 'lodash-es/isString'

/**
 * Represents a Redirection entity.
 *
 * @extends Entity
 */
export default class Redirection extends Entity {
  /**
   * Return simple resource factory for Redirections.
   *
   * @static
   * @return {{redirection: Function}}
   */
  static resourceFactory () {
    return {
      redirection (shortDomain) {
        // Redirections don't have single resource endpoint
        if (!isString(arguments[0])) {
          throw new TypeError('You must specify a shortDomain in redirection()')
        }

        // Only allowed on Entities and Resources.
        if (this instanceof Scope) {
          throw new Error('Redirection is not a top-level resource.')
        }

        /**
         * Helper for repetitive shortDomain focussed requests.
         *
         * @param {object} changes - Additional options.
         * @returns {Promise<object>} API response.
         */
        const shortDomainRequest = async changes =>
          Resource.prototype._request.call(_this, Object.assign({
            apiUrl: `https://${shortDomain}`,
            url: '/redirections',
            headers: {
              Accept: 'application/json'
            }
          }, changes))

        // Special case: use the shortDomain API instead of the /redirector API.
        const _this = this
        return {
          create (payload) {
            payload.evrythngId = _this.id
            payload.type = _this.typeName

            return shortDomainRequest({
              method: 'post',
              body: JSON.stringify(payload)
            })
          },
          async read () {
            const [first] = await shortDomainRequest({
              params: { evrythngId: _this.id }
            })
            return first
          },
          async update (payload) {
            const existing = await this.read()
            if (!existing) {
              return this.create(payload)
            }

            // Else update it
            return shortDomainRequest({
              url: `/redirections/${existing.shortId}`,
              method: 'put',
              body: JSON.stringify(payload)
            })
          },
          async delete () {
            const existing = await this.read()
            if (!existing) {
              return Promise.resolve()
            }

            // Else delete it
            return shortDomainRequest({
              url: `/redirections/${existing.shortId}`,
              method: 'delete'
            })
          }
        }
      }
    }
  }
}
