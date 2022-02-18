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
  return (err) => {
    if (callback) callback(err)

    if (!err) {
      throw new Error('No error message available, err was:', err)
    }

    // Native Error?
    if (err.name && err.name.includes('Error')) {
      throw err
    }

    // If a Fetch API response, get the body text
    if (typeof err.ok !== 'undefined' && !err.ok) {
      // Must use 'then' instead of an async function here, or a client-side
      // 'catch' will pass a rejected Promise instead of an error.
      return err.text().then((body) => Promise.reject(body))
    }

    // If it's text instead of an already-parsed JSON object
    if (typeof err === 'string') {
      try {
        err = JSON.parse(err)
      } catch (e) {
        // The error text is not JSON
      }
    }

    // Throw a native Error to play nicer with error handling/retry libraries
    // Bonus: no need to check both e.message and e.errors
    throw new Error(err.message || JSON.stringify(err))
  }
}
