import Entity from './Entity'
import Resource from '../resource/Resource'

const path = '/files'

/**
 * Represents a File entity object.
 *
 * @extends Entity
 */
export default class File extends Entity {
  /**
   * Return simple resource factory for Files.
   *
   * @static
   * @return {{file: Function}}
   */
  static resourceFactory () {
    // TODO enable Node.js File streams and multipart/form-data files/blobs

    return {
      file: Resource.factoryFor(File, path)
    }
  }
}
