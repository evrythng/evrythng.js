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
        err => reject(err),
        geolocationOptions
      )
    } else {
      throw new Error('Geolocation API not available.')
    }
  })
}
