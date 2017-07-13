export const version = '5.0.0'

// Globals
export { default as settings } from './settings'
export { default as setup } from './setup'
export { default as api } from './api'

// TODO add method to install plugins

// Scopes
export { default as Operator } from './scope/Operator'
export { default as Application } from './scope/Application'
export { default as TrustedApplication } from './scope/TrustedApplication'
export { default as User } from './scope/User'

// Namespaces for: Entities and Symbols
export { default as Entity } from './entities'
export { default as Symbol } from './symbols'

// Internal modules
export { default as _Resource } from './resource/Resource'
export { default as _Entity } from './entity/Entity'
export { default as _Scope } from './scope/Scope'
