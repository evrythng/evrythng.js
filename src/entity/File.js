import fetch from 'node-fetch'
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
    return {
      file (id) {
        return Object.assign(
          Resource.factoryFor(File, path).call(this, id),
          {
            upload
          }
        )
      }
    }
  }
}

/**
 * Upload file data, previously obtained from disk or the user.
 *
 * Note: Only text or encoded text is currently supported here.
 *
 * @param {*} data - Data as buffer or string.
 */
async function upload (data) {
  const resource = await this.read()
  const opts = {
    method: 'put',
    headers: {
      'Content-Type': resource.type,
      'x-amz-acl': resource.privateAccess ? 'private' : 'public-read'
    },
    body: data
  }

  return fetch(resource.uploadUrl, opts)
}
