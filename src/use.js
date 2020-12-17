import Application from './scope/Application'
import Device from './scope/Device'
import Operator from './scope/Operator'
import TrustedApplication from './scope/TrustedApplication'
import User from './scope/User'
import AccessToken from './scope/AccessToken'

import Action from './entity/Action'
import ActionType from './entity/ActionType'
import ApplicationEntity from './entity/Application'
import AppUser from './entity/AppUser'
import Batch from './entity/Batch'
import Collection from './entity/Collection'
import Entity from './entity/Entity'
import File from './entity/File'
import Location from './entity/Location'
import Permission from './entity/Permission'
import Place from './entity/Place'
import Product from './entity/Product'
import Project from './entity/Project'
import Property from './entity/Property'
import ReactorSchedule from './entity/ReactorSchedule'
import ReactorScript from './entity/ReactorScript'
import Redirection from './entity/Redirection'
import Redirector from './entity/Redirector'
import Resource from './resource/Resource'
import Role from './entity/Role'
import Thng from './entity/Thng'
import UserEntity from './entity/User'
import OperatorAccess from './entity/OperatorAccess'
import AccessPolicy from './entity/AccessPolicy'
import Me from './entity/Me'
import AccessTokens from './entity/AccessToken'
import Account from './entity/Account'
import Access from './entity/Access'
import ADIOrder from './entity/ADIOrder'
import ADIOrderEvent from './entity/ADIOrderEvent'
import CommissionState from './entity/CommissionState'
import Domain from './entity/Domain'
import PurchaseOrder from './entity/PurchaseOrder'
import ReactorLog from './entity/ReactorLog'
import ShipmentNotice from './entity/ShipmentNotice'
import ShortDomain from './entity/ShortDomain'

/**
 * The items that the plugin may access and manipulate to install new functionality.
 *
 * Think carefully before changing this contract!
 */
const API = {
  scopes: {
    AccessToken,
    Operator,
    Application,
    TrustedApplication,
    User,
    Device
  },
  entities: {
    Access,
    AccessPolicy,
    AccessTokens,
    Account,
    Action,
    ActionType,
    ADIOrder,
    ADIOrderEvent,
    Application: ApplicationEntity,
    AppUser,
    Batch,
    Collection,
    CommissionState,
    Domain,
    Entity,
    File,
    Location,
    Me,
    OperatorAccess,
    Permission,
    Place,
    Product,
    Project,
    Property,
    PurchaseOrder,
    ReactorLog,
    ReactorSchedule,
    ReactorScript,
    Redirection,
    Redirector,
    Role,
    ShipmentNotice,
    ShortDomain,
    Thng,
    User: UserEntity
  },
  resources: {
    Resource
  }
}

/**
 * Install a plugin, such as scanthng.js
 *
 * The plugin is provided an API object with items for it to manipulate in its
 * `install()` method, such as adding new methods to scope prototypes.
 *
 * @param {object} plugin - The plugin object, which must implement the `install()` method.
 */
export default function use (plugin) {
  if (!plugin.install || typeof plugin.install !== 'function') {
    throw new Error("Plugin must implement an 'install()' method")
  }

  try {
    plugin.install(API)
  } catch (e) {
    console.log('Failed to install plugin')
    console.log(e)
  }
}
