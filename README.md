# evrythng.js [![Build Status](https://travis-ci.org/evrythng/evrythng.js.svg?branch=v5.x)](https://travis-ci.org/evrythng/evrythng.js) [![Coverage Status](https://coveralls.io/repos/github/evrythng/evrythng.js/badge.svg?branch=v5.x)](https://coveralls.io/github/evrythng/evrythng.js?branch=v5.x) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

## TODO
* [x] - Unit tests for Property
* [x] - Unit tests for Product resources
* [x] - Add Action entity
* [x] - Solve Collection circular reference problem
* [x] - Unit tests for Action
* [x] - Add Geolocation utils
* [x] - Unit tests for Thng resources
* [x] - Add Location entity
* [x] - Unit tests for Location
* [x] - Complete collection entity
* [x] - Replace individual fetchMock.mocks with apiMock
* [x] - Unit tests for url utils
* [x] - Use Symbols for private properties (e.g. resource, path) - simpler Entity.json
* [ ] - Reconsider ES6 module stubbing with aggregator modules and named exports (https://github.com/eventualbuddha/rollup-plugin-stub)
* [x] - Yarn?
* [ ] - Validate JSDoc?
* [ ] - Prettier-standard? https://github.com/sheerun/prettier-standard
* [ ] - Gulp task to generate docs build
* [ ] - Publish JSDoc. Is it understandable?
* [ ] - Finish and polish README
* [ ] - Refactor tests with commonly used Jasmine matchers?

## Make sure it works with
* [x] - Node + NPM package (main field) -> UMD + ES5 + polyfill
* [x] - Node + NPM package + Webpack (module field) -> ESM + ES6 + polyfill
* [x] - Browser + NPM package + Globals (dist/evrythng.js) -> UMD + ES5 + polyfill
* [x] - Browser + NPM package + Globals (dist/evrythng.es6.js) -> ESM + ES6 (Safari 10.1 only)
* [x] - Browser + NPM package + RequireJS (dist/evrythng.js) -> UMD + ES5 + polyfill
* [x] - Browser + NPM package + Webpack (module + browser field) -> ESM + ES6
* [x] - Browser + NPM package + Rollup (module + browser field) -> ESM + ES6
* [x] - Browser + NPM package + Browserify (browser field) -> UMD + ES5 + polyfill


evrythng.js facilitates the communication with the [EVRYTHNG](https://developers.evrythng.com) REST API thanks to its fluent and
resource oriented API. It can be used both for server-side scripting (Node.js) or in client-side web applications.

## Getting started

#### [Install](#install)
#### [Compatibility](#compatibility)
#### [Scopes](#scopes)
#### [API](#api)
#### [Examples](#examples)
#### [Docs](#docs)

## Install

evrythng.js is distributed via NPM, Bower and the EVRYTHNG CDN. This ensures you can manage the version of the library that your
application or scripts uses.

### NPM

```javascript
npm install evrythng --save
```

or

```javascript
yarn add evrythng
```

Then require it into any module:

```javascript
const EVT = require('evrythng')

EVT.api({ url: '/thngs' })
  .then(console.log)
  .error(console.error)
```

If you're using [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/) or [Browserify](http://browserify.org/)
the `evrythng` NPM module also works from the browser using the CommonJS format (there's also an ES2015 version - see [Compatibility](#compatibility)).

If using evrythng.js in Node.js, you need to also load the fetch API polyfill (see [Compatibility](#compatibility)).

### Bower

You can also use Bower instead. The library is exactly the same.

```javascript
bower install evrythng --save
```

If you're using AMD (RequireJS), you can load it with:

```
requirejs.config({
  paths: {
    evrythng: '../bower_components/evrythng/dist/evrythng'
  }
})

require(['evrythng'], function (EVT) {
  EVT.api({ url: '/thngs' })
    .then(console.log)
    .catch(console.error)
})
```

### CDN

Or use a simple script tag to load it from the CDN.

```html
<script src="//cdn.evrythng.com/js/evrythng/v5.0.0-pre.2/evrythng.js"></script>
<script>
    EVT.api({ url: '/thngs' })
      .then(console.log)
      .catch(console.error)
</script>
```

## Compatibility

### Node.js + Older browsers

evrythng.js relies on the new standard resource fetching API (**fetch**) to communicate with the EVRYTHNG API. **fetch** has already
been shipped in all the major browsers (see http://caniuse.com/#feat=fetch). Nevertheless, if you're targeting older browsers or
running in Node.js you will also need to load the fetch polyfill. The polyfill dependency is already installed in both NPM or Bower
version. It just needs to be loaded.

#### CommonJS

**Note: Node.js always requires the polyfill.**

```javascript
require('isomorphic-fetch')
const EVT = require('evrythng')
```

#### RequireJS

```javascript
requirejs.config({
  paths: {
    evrythng: '../bower_components/evrythng/dist/evrythng',
    fetch: '../bower_components/fetch/fetch'
  },
  shim: {
    evrythng: ['fetch']
  }
})

require(['evrythng'], function (EVT) {
  ...
});
```

#### Globals

```html
<script src="//cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.min.js"></script>
<script src="//cdn.evrythng.com/js/evrythng/v5.0.0-pre.2/evrythng.js"></script>
```

### ES2015

If you're using modern bundlers like Webpack 2 and Rollup and using the new ES module definition (`import`/`export`), then you can
use the module version of evrythng.js as well, in order to take advantage of the static analysis that those bundlers provide
(e.g. tree-shaking).

Both Rollup and Webpack 2 will use the `pkg.module` entrypoint by default. I.e. you're already using ES2015 by default. Awesome.

```javascript
import {App} from 'evrythng'

const app = new App('<application_api_key>');
```

## Scopes

It's useful to understand the [different Scopes and API Keys that are used to interact with the API](https://developers.evrythng.com/docs/api-scope-and-key-permissions).
**Only the Application API Key can be safely versioned in public code!** The rest are private and secure API Keys with higher
permission sets and should not be hard-coded - ideally encrypted in configuration files or fetched at runtime from a server.

evrythng.js provides the following Scopes:

* **EVT.Operator**: Highest level scope that can manage the account structure, its resources, manage team members, etc.

```javascript
const operator = new EVT.Operator('<operator_api_key>')
```

* EVT.App - Public API key used for Product Recognition and authenticate application users

```javascript
const app = new EVT.App('<application_api_key>')
```

* EVT.TrustedApp - Secret Application API key used for scripting on behalf of the application (e.g. trigger rules or system integration)

```javascript
const app = new EVT.TrustedApp('<trusted_application_api_key>')
```

* EVT.User - usually not instantiated explicitly. It's returned from authentication:

```javascript
app.login(credentials).then(user => {
  // user is instance of EVT.User
})
```

The methods and API available for each of the above scopes matches the access level defined for
[each API Key](https://developers.evrythng.com/docs/api-scope-and-key-permissions).