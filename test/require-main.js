const paths = {
  evrythng: 'evrythng.polyfill',
  'isomorphic-fetch': '../node_modules/whatwg-fetch/fetch'
}

if (typeof module !== 'undefined') {
  module.exports = paths
} else {
  const tests = []
  for (const file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
      if (/spec\.js$/.test(file)) {
        tests.push(file)
      }
    }
  }

  require.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: '/base/dist',

    deps: tests,

    paths,

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start
  })
}
