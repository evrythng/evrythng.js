const evrythng = require('evrythng')

evrythng.api({
  url: '/time'
})
  .then((res) => {
    const output = document.getElementById('output')
    output.innerHTML = res.timestamp
  })
  .catch(alert)
