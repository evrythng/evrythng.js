import Entity from './Entity'
import Resource from '../resource/Resource'
import isString from 'lodash-es/isString'

const path = '/status'

export default class Status extends Entity {
  static resourceFactory () {
    return {
      status () {
        if (isString(arguments[0])) {
          throw new TypeError('There is no single resource for Status')
        }

        return Resource.factoryFor(Status, path).call(this)
      }
    }
  }
}
