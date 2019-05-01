const evrythng = require('evrythng')

evrythng.api({
  url: '/time'
})
  .then(res => console.log(`Current time: ${res.timestamp}`))
  .catch(console.log)
