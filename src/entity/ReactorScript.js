import Entity from './Entity'
import Status from './Status'
import Resource from '../resource/Resource'
import { mixinResources } from '../util/mixin'
import isString from 'lodash-es/isString'

const path = '/reactor/script'
const ReactorScriptResources = mixinResources([Status])

/**
 * Represents a ReactorScript entity object.
 *
 * @extends Entity
 */
export default class ReactorScript extends ReactorScriptResources(Entity) {
  static resourceFactory () {
    return {
      reactorScript () {
        // Reactor scripts don't have single resource endpoint (e.g.: /scripts/:id)
        if (isString(arguments[0])) {
          throw new TypeError('There is no single resource for Reactor Scripts')
        }

        return Resource.factoryFor(ReactorScript, path, ReactorScriptResources).call(this)
      }
    }
  }
}
