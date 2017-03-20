/**
 * Get browser's current position from Geolocation API.
 *
 * @return {Promise} - Resolves with current position or rejects with failure
 * explanation.
 */
export default function getCurrentPosition () {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.navigator.geolocation) {
      const geolocationOptions = {
        maximumAge: 0,
        timeout: 10000,
        enableHighAccuracy: true
      }

      window.navigator.geolocation.getCurrentPosition(
        resolve,
        err => {
          reject(mapError(err))
        },
        geolocationOptions
      )
    } else {
      reject('Geolocation API not available.')
    }
  })
}

/**
 * Convert Geolocation API error code to readable message.
 *
 * @param {Error} err - Geolocation API error
 * @return {string}
 */
function mapError (err) {
  let errorMessage
  switch (err.code) {
    case 1:
      errorMessage = 'User did not share location.'
      break
    case 2:
      errorMessage = 'Couldn\'t detect current location.'
      break
    case 3:
      errorMessage = 'Retrieving position timed out.'
      break
    default:
      errorMessage = 'Unknown error.'
      break
  }
  return errorMessage
}
