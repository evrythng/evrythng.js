import Entity from './Entity'
import Resource from '../resource/Resource'

const path = '/purchaseOrders'

/**
 * Represents a PurchaseOrder entity object.
 *
 * @extends Entity
 */
export default class PurchaseOrder extends Entity {
  /**
   * Return simple resource factory for ADI Orders.
   *
   * @static
   * @return {{purchaseOrder: Function}}
   */
  static resourceFactory () {
    return {
      purchaseOrder: Resource.factoryFor(PurchaseOrder, path)
    }
  }
}
