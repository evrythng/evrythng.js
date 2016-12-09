let tests = []
for (let file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/spec\.js$/.test(file)) {
      tests.push(file)
    }
  }
}

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base/lib',

  deps: tests,

  paths: {
    evrythng: 'evrythng.polyfill',
    'isomorphic-fetch': '../node_modules/whatwg-fetch/fetch',
    setup: '../test/setup',
    chai: '../node_modules/chai/chai',
    'dirty-chai': '../node_modules/dirty-chai/lib/dirty-chai'
  },

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
})
