import Entity from './Entity'
import Resource from '../resource/Resource'
import api from '../api'
import symbols from '../symbols'
import isString from 'lodash-es/isString'
import User from '../scope/User'

const path = '/auth/evrythng/users'

/**
 * Represents an AppUser access entry object. In the API there is a distinction
 * and different actions available for AppUser access. I.e. they can be validated.
 *
 * @extends Entity
 */
export default class UserAccess extends Entity {
  /**
   * Return resource factory for AppUsers access.
   *
   * @static
   * @return {{userAccess: Function}}
   */
  static resourceFactory () {
    return {
      userAccess (id) {
        return Object.assign(
          Resource.factoryFor(UserAccess, path).call(this, id),
          {
            create (...args) {
              return createAppUser.call(this, ...args)
            },
            validate (...args) {
              return validate.call(this, ...args)
            }
          }
        )
      }
    }
  }

  /**
   * Convert evrythngUser id into standard ID field.
   *
   * @param {Resource} resource - Resource owner of this entity.
   * @param {Object} [body] Optional entity data
   */
  constructor (resource, body = {}) {
    const copy = Object.assign({}, body)
    if (copy.evrythngUser) {
      copy.id = copy.evrythngUser
      Reflect.deleteProperty(copy, 'evrythngUser')
    }
    super(resource, copy)
  }

  /**
   * Validate user access using own activation code.
   *
   * @return {Promise}
   */
  validate () {
    return validate.call(this, this.activationCode)
  }
}

/**
 * Create anonymous app user if anonymous property defined.
 *
 * @param {Array} args - Arguments array.
 * @return {Promise}
 */
function createAppUser (...args) {
  const [data] = args
  if (data && data.anonymous) {
    return createAnonymousUser.call(this, ...args)
  } else {
    return Resource.prototype.create.call(this, ...args)
  }
}

/**
 * Send a request to the validate endpoint with the given activation code.
 *
 * @param {String} activationCode - Activation code provided on creation.
 * @return {Promise}
 */
function validate (activationCode) {
  if (!activationCode || !isString(activationCode)) {
    throw new Error('Activation code must be a string.')
  }

  if (this.type === 'anonymous') {
    throw new Error("Anonymous users can't be validated.")
  }

  let scope = this.scope
  let path = this.path

  // If called from the entity, the scope is the resource's scope.
  if (this instanceof Entity) {
    scope = this[symbols.resource].scope
    path = `${this[symbols.resource].path}/${this.id}`
  }

  // Activate  user.
  return api({
    url: `${path}/validate`,
    method: 'post',
    apiKey: scope.apiKey,
    data: { activationCode }
  }).then((validated) => {
    // Return a ready-to-go user scope
    const newUser = new User(validated.evrythngApiKey)
    return newUser.init()
  })
}

/**
 * Create anonymous user in API and return new scope for that user.
 *
 * @return {Promise}
 */
function createAnonymousUser () {
  return api({
    url: this.path,
    method: 'post',
    params: {
      anonymous: true // must be set to create anonymous user
    },
    data: {},
    apiKey: this.scope.apiKey
  }).then(access => new User(access.evrythngApiKey, Object.assign(access, { type: 'anonymous' })))
}
