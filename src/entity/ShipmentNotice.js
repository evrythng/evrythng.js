import Entity from './Entity'
import Resource from '../resource/Resource'

const path = '/shipmentNotices'

/**
 * Represents a ShipmentNotice entity object.
 *
 * @extends Entity
 */
export default class ShipmentNotice extends Entity {
  /**
   * Return simple resource factory for shipment notices.
   *
   * @static
   * @return {{shipmentNotice: Function}}
   */
  static resourceFactory () {
    return {
      shipmentNotice: Resource.factoryFor(ShipmentNotice, path)
    }
  }
}
