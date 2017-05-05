import buildParams from './buildParams'

/**
 * Concatenate url with parameters from request options.
 *
 * @export
 * @param {Object} options request options including url and params
 * @returns {string}
 */
export default function buildUrl (options) {
  let url = `${options.apiUrl}${options.url}`

  if (options.params) {
    url += `?${buildParams(options.params)}`
  }

  return url
}
