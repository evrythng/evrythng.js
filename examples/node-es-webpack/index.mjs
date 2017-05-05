import { api, version } from 'evrythng'

console.log('It loads!')
console.log('EVT version', version)

api().catch(e => {
  console.log('Fetch works!')
  console.log('API response', e)
})
