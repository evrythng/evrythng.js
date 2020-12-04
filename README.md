# evrythng.js

The official `evrythng.js` SDK facilitates communication with the
[EVRYTHNG](https://developers.evrythng.com) REST API thanks to its fluent and
resource oriented API. It can be used both for server-side scripting (Node.js)
or in client-side web applications in modern browsers.

- [Installation](#installation)
- [Compatibility](#compatibility)
- [Scopes](#scopes)
- [API](#api)
- [Plugins](#plugins)
- [Documentation and Examples](#documentation-and-examples)

## Installation

`evrythng.js` is distributed via [NPM](https://www.npmjs.com/package/evrythng)
and the EVRYTHNG CDN, allowing you to manage the version of the library that
your application or scripts uses.

### NPM

Install as an app dependency:

```
npm install --save evrythng
```

or as a development dependency:

```
npm install --save-dev evrythng
```

Then require it in any module:

```js
const evrythng = require('evrythng');

evrythng.api({ url: '/time' }).then(console.log).error(console.error);
```

Or using ES6 `import`/`export` syntax when available:

```js
import { Application } from 'evrythng';
```

```js
import evrythng from 'evrythng';

// Alternatively
import * as evrythng from 'evrythng';
```

### CDN

Or use a simple script tag to load it from the CDN.

```html
<script src="https://d10ka0m22z5ju5.cloudfront.net/js/evrythng/6.0/evrythng-6.0.js"></script>
```

Then use in a browser `script` tag using the `evrythng` global variable:

```html
<script>
  evrythng.api({ url: '/time' }).then(console.log).catch(console.error);
</script>
```

## Compatibility

`evrythng.js` relies on the standard resource fetching API (`fetch`) to
communicate with the EVRYTHNG API. `fetch` has already been shipped in all the
major browsers (see http://caniuse.com/#feat=fetch). The `isomorphic-fetch`
dependency of this project should take care of this for you.

When using Node.js, version 10 and above is required.

## Scopes

There are several types of
[Scopes and API Keys](https://developers.evrythng.com/docs/api-scope-and-key-permissions)
that are used to interact with the API. Each represents a type of user or
resource in an EVRYTHNG account.

> Note: Only the **Application API Key** can be safely versioned in public code!
> The other API key types are secret and secure API Keys with higher permission
> sets and should not be hard-coded - ideally encrypted in configuration files
> or fetched at runtime from a server.

In a nutshell, `evrythng.js` provides the following scopes. Once a scope is
created it provides an appropriate API for the resources it can manage
(see [API](#api) below).

For `apiVersion:2` next scopes are avaliable:

- `Operator`
- `AccessToken`

`Operator` and `AccessToken` scopes can have a different set of permissions, which is defined on [access policy](https://developers.evrythng.com/reference/access-policies-1) and assigned during creation of [operator access](https://developers.evrythng.com/reference/operator-access) and [access token](https://developers.evrythng.com/reference/access-tokens).

For `apiVersion:1` next scopes are avaliable:

- `Operator` - Highest level scope that can manage the account structure, all
  its resources and projects, etc.

```js
const operator = new evrythng.Operator(OPERATOR_API_KEY);
```

- `Application` - Public application scopes used for Identifier Recognition and
  to authenticate Application Users.

```js
const application = new evrythng.Application(APPLICATION_API_KEY);
```

- `TrustedApplication` - Secret type of `Application` scope with expended
  permissions, intended for use for scripting and backend integrations on behalf
  of the application (e.g. trigger rules or system integration functionality).

```js
const trustedApplication = new evrythng.TrustedApplication(TRUSTED_APP_API_KEY);
```

- `User` - Usually returned from authentication via an `Application` scope, but
  can also be created manually with an Application User API Key:

```js
// Registered user with email + password
const credentials = { email: 'example@evrythng.com', password };
app.login(credentials).then((user) => console.log(user.apiKey));

// Or, an anonymous user
app
  .appUser()
  .create({ anonymous: true })
  .then((anonUser) => console.log(anonUser.apiKey));

// Or using a pre-existing API key
const userApiKey = localStorage.getItem('user_api_key');
const user = new evrythng.User(userApiKey);
```

- `ActionApp` - Special version of the Application scope designed to make it as
  simple as possible to create instrumentation actions in web apps. It creates
  and remembers an anonymous Application User in LocalStorage and provides a
  simple interface for creating actions:

```js
import { ActionApp } from 'evrythng';

const actionApp = new ActionApp(appApiKey);
await actionApp.init();

// Create a scan action on a Thng identified in the query
const thng = getQueryParam('thng');
const data = { thng, userAgent };
const action = await actionApp.createAction('scans', data);

// Log a page was visited (the current URL)
await actionApp.pageVisited();

// Retrieve the managed Application User
const anonymousUser = await actionApp.getAnonymousUser();
```

For any scope, if the scope's own data (such as an Application's `customFields`)
is required immediately, use the `init()` method to wait until this data is
available. If not, this step can be ignored:

```js
import { Application } from 'evrythng';

const application = new Application(apiKey);
application.init().then(() => console.log(application.customFields));
```

## API

The methods available for each of the above scope types matches the general
access level defined for each type of
API Key for [apiVersion:2](https://developers.evrythng.com/docs/api-keys-and-key-permissions-v2-1) or [apiVersion:1](https://developers.evrythng.com/docs/api-scope-and-key-permissions).
For example - the `Application` scope can read products in its project, but can
only create `User`s who in turn have higher access to manage resources.

### Methods

The API for each scope follows a fluent pattern that decreases the time required
to begin making effective use of the SDK. In general, the format is:

```
SCOPE
  .RESOURCE(id)
  .METHOD(payload, params)
  .then(...)
  .catch(console.error)
```

Where:

- `SCOPE` - One of the scope types shown above.
- `RESOURCE` - can be any resource type, such as `thng`, `product`, `collection`
  etc. found in the
  [API Reference](https://developers.evrythng.com/reference).
  - `id` - specified if manipulating a specific resource of this type.
- `METHOD` - one of `create`, `read`, `update`, `delete`, `rescope`, `find`, or `upsert`.
  - `payload` - JSON payload object if performing a create or update.
  - `params` - Parameters object used if required.

Therefore to read all Thngs as a `TrustedApplication` scope:

```js
trustedApplication
  .thng()
  .read()
  .then((thngs) => console.log(`Read ${thngs.length} Thngs!`));
```

or to create a product as a `User`:

```js
const payload = { name: 'Test Product', tags: ['evrythng.js'] };
user
  .product()
  .create(payload)
  .then((product) => console.log(`Created product ${product.id}!`));
```

or to read a known Thng using its `id` as an Operator:

```js
const thngId = 'UqKWAsTpdxCA3KwaaGmTxAhp';

operator
  .thng(thngId)
  .read()
  .then((thng) => console.log(`Thng tags: ${thng.tags.join(', ')}`));
```

### Promises

All methods return Promises, making chaining operations and catching errors very
simple:

```js
user
  .thng()
  .create(payload)
  .then((res) => console.log('Success!'))
  .catch((err) => console.log(`Oh no! Error: ${err.message}`));
```

Users of modern browsers and Node.js 8+ can take advantage `async`/`await`
syntax as an alternative to Promise chaining when performing sequences of
operations:

```js
const testThngUpdate = async () => {
  // Read all Thngs and find one
  const thngs = await operator.thng().read();
  const testThng = thngs.find((p) => p.tags.includes('test'));

  // Update its tags
  const payload = { tags: ['updated'] };
  const updatedThng = await operator.thng(testThng.id).update(payload);

  // Check the update was successful
  expect(updatedThng.tags).to.equal(payload.tags);
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
    tags: 'test',
  },
  // More items per page
  perPage: 100,
};

user
  .product()
  .read({ params })
  .then((products) => console.log(`Found ${products.length} 'test' products`));
```

Another example is creating resources in a specific project scope:

```js
const params = { project: projectId };
const payload = { name: 'Test Thng' };

user
  .thng()
  .create(payload, { params })
  .then((thng) => console.log(`Created Thng ${thng.id} in project ${projectId}`));
```

Parameters can also be specified using chainable parameter setter methods:

```js
user
  .product()
  .setFilter({ tags: 'test' })
  .setPerPage(100)
  .read()
  .then((products) => console.log(`Found ${products.length} 'test' products`));
```

Other parameter setters include `setWithScopes()`, `setContext()`,
`setPerPage()`, `setProject()` and `setFilter()`.

## Plugins

This SDK can be extended with plugins that enhance existing functionality by
modifying the capabilities of Scopes and Entities. This is done by supplying an
object with at least an `install()` method, that is provided an `api` object
(see `src/use.js` for details of this API).

For example, adding a `getSummary()` method to Thngs:

```js
const SummaryPlugin = {
  // Required method
  install: (api) => {
    // Add new functionality to all Thng entities
    api.entities.Thng.prototype.getSummary = function () {
      return `${this.name} (${this.id})`;
    };
  },
};
```

The plugin is then installed using `use()`:

```js
const SummaryPlugin = require('summary-plugin');

evrythng.use(SummaryPlugin);
```

Then, the plugin's functionality can be used:

```js
// Read one Thng
const [thng] = await user.thng().setPerPage(1).read();

// Use the newly installed method
console.log(thng.getSummary());
```

```
Test Thng (U6ssDxRBD8kQATawwGrEyaRm)
```

## Documentation and Examples

For specific resource examples, see the relevant section of the
[API Reference](https://developers.evrythng.com/reference), or look in the
`examples` directory in this repository.

## Build and Deploy

See `./jenkins/deploy.sh` for instructions on deploying new versions.
