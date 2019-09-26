import { mixinResources } from '../util/mixin'
import Container from './Container'
import Entity from './Entity'
import Resource from '../resource/Resource'

const path = '/shipmentNotices'

const ShipmentNoticeResources = mixinResources([
  Container
])

/**
 * Represents a ShipmentNotice entity object.
 *
 * @extends Entity
 */
export default class ShipmentNotice extends ShipmentNoticeResources(Entity) {
  /**
   * Return simple resource factory for shipment notices.
   *
   * @static
   * @return {{shipmentNotice: Function}}
   */
  static resourceFactory () {
    return {
      shipmentNotice: Resource.factoryFor(ShipmentNotice, path, ShipmentNoticeResources)
    }
  }
}
