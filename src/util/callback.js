/**
 * Apply error-first callback if available.
 *
 * @param {function} callback - Error-first callback
 * @returns {function} - Response handler function
 */
export function success (callback) {
  return response => {
    if (callback) callback(null, response)
    return response
  }
}

/**
 * Apply error-first callback with error if available.
 *
 * @param {function} callback - Error-first callback
 * @returns {function} - Response handler function
 */
export function failure (callback) {
  return err => {
    if (callback) callback(err)
    throw err
  }
}
