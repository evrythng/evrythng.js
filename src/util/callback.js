/**
 * Apply error-first callback if available.
 *
 * @param {function} callback - Error-first callback
 * @returns {function} - Response handler function
 */
export function success (callback) {
  return (response) => {
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
  return async (err) => {
    if (callback) callback(err)

    if (!err) {
      throw new Error(`No error message available, err was: ${JSON.stringify(err)}`)
    }

    if (typeof err.ok !== 'undefined' && !err.ok) {
      err = await err.text()
    }
    try {
      err = JSON.parse(err)
    } catch (e) {
      // display not json text for error
    }

    // Throw a native Error to play nicer with error handling/retry libraries
    // Bonus: no need to check both e.message and e.errors
    throw new Error(err.message || JSON.stringify(err))
  }
}
