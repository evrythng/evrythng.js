const EVT = require('evrythng')

console.log('It loads!')
console.log('EVT version', EVT.version)

EVT.api().catch(e => {
  console.log('Fetch works!')
  console.log('API response', e)
})
