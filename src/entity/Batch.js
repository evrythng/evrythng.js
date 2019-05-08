import Entity from './Entity'
import Task from './Task'
import Resource from '../resource/Resource'
import { mixinResources } from '../util/mixin'

const path = '/batches'
const BatchResources = mixinResources([
  Task
])

/**
 * Represents a Batch entity object.
 *
 * @extends Entity
 */
export default class Batch extends BatchResources(Entity) {
  /**
   * Return simple resource factory for Batches.
   *
   * @static
   * @return {{batch: Function}}
   */
  static resourceFactory () {
    return {
      batch: Resource.factoryFor(Batch, path, BatchResources)
    }
  }
}
