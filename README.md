# evrythng.js [![Build Status](https://travis-ci.org/evrythng/evrythng.js.svg?branch=master)](https://travis-ci.org/evrythng/evrythng.js) [![Coverage Status](https://coveralls.io/repos/github/evrythng/evrythng.js/badge.svg)](https://coveralls.io/github/evrythng/evrythng.js)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)

## TODO
* [x] - Unit tests for Property
* [x] - Unit tests for Product resources
* [x] - Add Action entity
* [x] - Solve Collection circular reference problem
* [x] - Unit tests for Action
* [ ] - Add Geolocation utils
* [ ] - Rethink ES6 module stubbing with named aggregator modules (https://github.com/eventualbuddha/rollup-plugin-stub)
* [ ] - Unit tests for Thng resources
* [ ] - Complete collection entity
* [ ] - Replace individual fetchMock.mocks with apiMock

## Getting started

### Install evrythng.js using npm.

```javascript
npm install evrythng
```

Then require it into any module.

```javascript
const EVT = require('evrythng')

EVT.api({
  url: '/thngs'
  method: 'get'
}).then(console.log)
```

### Browser

To use evrythng from a browser, download `dist/evrythng.min.js` or use a CDN such as CDNJS or jsDelivr.

Then, add it as a script tag to your page:

```html
<script src="evrythng.min.js"></script>
<script>
    EVT.api({
      url: '/thngs'
      method: 'get'
    }).then(console.log)
</script>
```

Or use an AMD loader (such as RequireJS):

```javascript
require(['./evrythng.min.js'], EVT => {
    EVT.api({
      url: '/thngs'
      method: 'get'
    }).then(console.log)
})
```

If you're using browserify, the `evrythng` npm module also works from the browser.
