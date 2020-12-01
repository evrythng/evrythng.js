import Entity from './Entity'
import Application from './Application'
import Resource from '../resource/Resource'
import { mixinResources } from '../util/mixin'

const path = '/projects'
const ProjectResources = mixinResources([Application])

/**
 * Represents a Project entity object.
 *
 * @extends Entity
 */
export default class Project extends ProjectResources(Entity) {
  /**
   * Return simple resource factory for Projects.
   *
   * @static
   * @return {{project: Function}}
   */
  static resourceFactory () {
    return {
      project: Resource.factoryFor(Project, path, ProjectResources)
    }
  }
}
