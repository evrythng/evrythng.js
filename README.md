# evrythng.js [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

The official `evrythng.js` SDK facilitates communication with the
[EVRYTHNG](https://developers.evrythng.com) REST API thanks to its fluent and
resource oriented API. It can be used both for server-side scripting (Node.js)
or in client-side web applications in modern browsers.

* [Installation](#installation)
* [Compatibility](#compatibility)
* [Scopes](#scopes)
* [API](#api)
* [Documentation and Examples](#documentation-and-examples)


## Installation

`evrythng.js` is distributed via NPM and the EVRYTHNG CDN. This ensures you can
manage the version of the library that your application or scripts uses.


### NPM / Yarn

```
npm install --save evrythng
```

```
yarn add evrythng
```

Then require it into any module:

```js
const evrythng = require('evrythng')

evrythng.api({ url: '/thngs' })
  .then(console.log)
  .error(console.error)
```

Or using ES6 `import`/`export` syntax when available:

```js
import { Application } from 'evrythng'
```

```js
import * as evrythng from 'evrythng'
```


### CDN

Or use a simple script tag to load it from the CDN.

```html
<script src="//cdn.evrythng.com/js/evrythng/v5.0.0-beta.1/evrythng.js"></script>
<script>
    evrythng.api({ url: '/time' })
      .then(console.log)
      .catch(console.error)
</script>
```

## Compatibility

`evrythng.js` relies on the standard resource fetching API (`fetch`) to
communicate with the EVRYTHNG API. `fetch` has already been shipped in all the
major browsers (see http://caniuse.com/#feat=fetch). The `isomorphic-fetch`
dependency of this project should take care of this for you.


## Scopes

There are several types of
[Scopes and API Keys](https://developers.evrythng.com/docs/api-scope-and-key-permissions)
that are used to interact with the API. Each represents a type of user or
resource in an EVRYTHNG account.

> Note: Only the **Application API Key** can be safely versioned in public code!
  The other API key types are secret and secure API Keys with higher permission
  sets and should not be hard-coded - ideally encrypted in configuration files
  or fetched at runtime from a server.

In a nutshell, `evrythng.js` provides the following Scopes. Once a scope is
created it provides an appropriate API for the resources it can manage
(see [API](#api) below):

* `Operator` - Highest level scope that can manage the account structure, all
  its resources and projects, etc.

```js
const operator = new evrythng.Operator(OPERATOR_API_KEY)
```

* `Application` - Public application scopes used for Identifier Recognition and
  to authenticate Application Users.

```js
const application = new evrythng.Application(APPLICATION_API_KEY)
```

* `TrustedApplication` - Secret type of `Application` scope with expended
  permissions, intended for use for scripting and backend integrations on behalf
  of the application (e.g. trigger rules or system integration functionality).

```js
const trustedApplication = new evrythng.TrustedApplication(TRUSTED_APP_API_KEY)
```

* `User` - usually not instantiated explicitly. It's returned from
  authentication via an `Application` scope:

```js
// Registered user with email + password
app.login(credentials)
  .then(user => console.log(user))

// Or, an anonymous user
app.appUser().create({ anonymous: true })
  .then(anonUser => console.log(anonUser.apiKey))
```

For any scope, if the scope's own data (such as an Application's `customFields`)
is required immediately, use the `init()` method to wait until this data is 
available. If not, this step can be ignored:

```js
import { Application } from 'evrythng'

const application = new Application(apiKey)
application.init()
  .then(() => console.log(application.customFields))
```


## API

The methods available for each of the above scope types matches the general
access level defined for each type of
[API Key](https://developers.evrythng.com/docs/api-scope-and-key-permissions).
For example - the `Application` scope can read products in its project, but can
only create `User`s who in turn have higher access to manage resources.


### Methods

The API for each scope follows a fluent pattern that decreases the time required
to begin making effective use of the SDK. In general, the format is:

```
scope.RESOURCE().METHOD().then(...).catch(console.error)
```

Where `RESOURCE` can be any resource type, such as `thng`, `product`,
`collection` etc. found in the
[API Reference](https://developers.evrythng.com/reference), and `METHOD` is one
of `create`, `read`, `update`, or `delete`. Therefore to read all Thngs as a
`TrustedApplication`:

```js
trustedApplication.thng().read()
  .then(thngs => console.log(`Read ${thngs.length} Thngs!`))
```

or to create a product as a `User`:

```js
const payload = { name: 'Test Product', tags: ['evrythng.js'] }
user.product().create(payload)
  .then(product => console.log(`Created product ${product.id}!`))
```

or to read a known Thng using its `id` as an Operator:

```js
const thngId = 'UqKWAsTpdxCA3KwaaGmTxAhp'

operator.thng(thngId).read()
  .then(thng => console.log(`Thng tags: ${thng.tags.join(', ')}`))
```


### Promises

All methods return Promises, making chaining operations and catching errors very
simple:

```js
user.thng().create(payload)
  .then(res => console.log('Success!'))
  .catch(err => console.log(`Oh no! Error: ${err.message}`))
```

Users of modern browsers and Node.js 8+ can take advantage `async`/`await`
syntax as an alternative to Promise chaining when performing sequences of
operations:

```js
const testThngUpdate = async () => {
  // Read all Thngs and find one
  const thngs = await operator.thng().read()
  const testThng = thngs.find(p => p.tags.includes('test'))

  // Update its tags
  const payload = { tags: ['updated'] }
  const updatedThng = await operator.thng(testThng.id).update(payload)

  // Check the update was successful
  expect(updatedThng.tags).to.equal(payload.tags)
};
```


### Parameters

Each of the methods described above can accept parameters identical to those
available when using the REST API, and are placed in the `params` object as
shown below:

```js
const params = {
  // Only with these tags
  filter: {
    tags: 'test'
  }
}

user.product().read({ params })
  .then(products => console.log(`Found ${products.length} 'test' products`))
```

Another example is creating resources in a specific project scope:

```js
const params = { project: projectId }
const payload = { name: 'Test Thng' }

user.thng().create(payload, { params })
  .then(thng => console.log(`Created Thng ${thng.id} in project ${projectId}`))
```


## Documentation and Examples

For specific resource examples, see the relevant section of the
[API Reference](https://developers.evrythng.com/reference), or look in the 
`examples` directory in this repository.
