# evrythng.js [![Build Status](https://travis-ci.org/evrythng/evrythng.js.svg?branch=master)](https://travis-ci.org/evrythng/evrythng.js)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)

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
