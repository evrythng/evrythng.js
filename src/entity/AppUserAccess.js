import Entity from './Entity'
import Resource from '../resource/Resource'
import api from '../api'
import isString from 'lodash-es/isString'

const path = '/auth/evrythng/users'

/**
 * Represents a Role entity object.
 *
 * @extends Entity
 */
export default class AppUserAccess extends Entity {
  /**
   * Return resource factory for AppUsers.
   *
   * @static
   * @return {{role: Function}}
   */
  static resourceFactory (customPath) {
    return {
      appUser (id) {
        return Object.assign(
          Resource.factoryFor(AppUserAccess, customPath || path).call(this, id),
          {
            validate (...args) {
              return validate.call(this, ...args)
            },
            create (...args) {
              const [data] = args
              if (data && data.anonymous) {
                return createAnonymousUser.call(this, ...args)
              } else {
                return Resource.prototype.create.call(this, ...args)
              }
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
    if (body.evrythngUser) {
      body.id = body.evrythngUser
      Reflect.deleteProperty(body, 'evrythngUser')
    }
    super(resource, body)
  }

  validate () {
    return validate.call(this.activationCode)
  }
}

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
    scope = this.resource.scope
    path = `${this.resource.path}/${this.id}`
  }

  // Activate newly created user.
  return api({
    url: `${path}/validate`,
    method: 'post',
    authorization: scope.apiKey,
    data: { activationCode }
  })
}

function createAnonymousUser () {
  return api({
    url: this.path,
    method: 'post',
    params: {
      anonymous: true // must be set to create anonymous user
    },
    data: {},
    authorization: this.scope.apiKey
  })
    .then(createUserScope.bind(this))
}

// Create User Scope
function createUserScope (access) {
  // return new User({
  //   id: access.evrythngUser,
  //   apiKey: access.evrythngApiKey,
  //   type: 'anonymous'
  // })
}
