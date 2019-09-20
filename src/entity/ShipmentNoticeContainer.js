import Entity from './Entity'
import Resource from '../resource/Resource'

const path = '/shipmentNotices/containers'

/**
 * Represents a ShipmentNoticeContainer entity object.
 *
 * @extends Entity
 */
export default class ShipmentNoticeContainer extends Entity {
  /**
   * Return simple resource factory for shipment notice containers.
   *
   * @static
   * @return {{shipmentNoticeContainer: Function}}
   */
  static resourceFactory () {
    return {
      shipmentNoticeContainer: Resource.factoryFor(ShipmentNoticeContainer, path)
    }
  }
}
