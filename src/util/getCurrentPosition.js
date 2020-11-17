// Maximum acceptable age of cached location from the browser
const maximumAge = 5 * 60 * 1000;

/**
 * Get browser's current position from Geolocation API.
 *
 * @return {Promise} - Resolves with current position or rejects with failure
 * explanation.
 */
export default function getCurrentPosition () {
  return new Promise((resolve, reject) => {
    if (!window.navigator.geolocation) throw new Error('Geolocation API not available.')

    const geolocationOptions = {
      maximumAge,
      timeout: 10000,
      enableHighAccuracy: true
    }

    window.navigator.geolocation.getCurrentPosition(
      resolve,
      err => reject(err),
      geolocationOptions
    )
  })
}
