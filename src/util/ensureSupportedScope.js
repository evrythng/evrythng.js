import settings from '../settings'
import Operator from '../scope/Operator'
import AccessToken from '../scope/AccessToken'

/**
 * Ensure valid scope is used for apiVersion:2 requests.
 */
export default function ensureSupportedScopeForApiVersionV2 () {
        // if(!(settings.apiKey instanceof Operator) || !(settings.apiKey instanceof AccessToken)) {
        //     console.log(settings.apiKey instanceof Operator)
        //     throw new Error('For apiVersion:2 only operator and access token scopes are supported.')
        // }
}