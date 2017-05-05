module.exports = {
  moduleName: 'EVT',
  polyfill: {
    external: 'isomorphic-fetch',
    globals: {
      'isomorphic-fetch': 'fetch'
    }
  }
}
