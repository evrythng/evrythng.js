import './apiMock'
import Scope from '../../src/scope/Scope'
import Resource from '../../src/resource/Resource'
import Entity from '../../src/entity/Entity'

// Any call to dummy creators below should be inside test blocks (either
// `beforeAll`, `beforeEach` or `it`).

/**
 * Return new simplistic Scope as base for scope mixins.
 *
 * @param {string} [apiKey] - Optional API Key
 * @return {Scope}
 */
export function dummyScope (apiKey = 'apiKey') {
  return new Scope(apiKey)
}

/**
 * Return new simplistic Resource as base for resource mixins.
 *
 * @param {Entity} [EntityType] - Entity class
 * @param {string} [path] - Path for resource
 * @return {Resource}
 */
export function dummyResource (EntityType = Entity, path = '/path') {
  const scope = dummyScope()
  return new Resource(scope, path, EntityType)
}

/**
 * Return new simplistic Entity as base for entity mixins.
 *
 * @param {Entity} [EntityType] - Entity class
 * @param {Object} [body] - Predefined entity body
 * @return {Entity}
 */
export function dummyEntity (EntityType = Entity, body = {}) {
  const resource = dummyResource()
  return new EntityType(resource, body)
}
