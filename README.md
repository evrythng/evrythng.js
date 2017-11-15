# [EVRYTHNG](https://www.evrythng.com) Client Javascript SDK

**evrythng.js** is a Javascript library that facilitates the interaction with the EVRYTHNG REST API thanks to its 
fluent API. It helps EVRYTHNG Application developers to build client apps faster and easier.

**evrythng.js** can be used both in Web applications (Browser) and embedded/server applications using Node.js. The
difference being the transport layer - Browser's XHR vs Node's HTTP.

> **evrythng.js** is intended to be used with EVRYTHNG [Applications](https://developers.evrythng.com/reference#applications-1)
and corresponding [Application Users](https://developers.evrythng.com/reference#application-users-1) or with 
[Devices](https://developers.evrythng.com/reference#section-thngs-as-devices). 
Be sure to only include your EVRYTHNG **Application API key** and **not** your Operator, User or Device key in any 
public source code (read more about [Scope Permissions](https://developers.evrythng.com/docs/scope-api-and-permissions)).

> See [Related Tools](#related-tools) below for other usages.

## Installation

### Browser

##### With [Bower](http://bower.io/)

    bower install evrythng --save
    
The Bower package is [AMD](http://requirejs.org/docs/whyamd.html)-compatible. This means you can load 
it asynchronously using tools like [Require.js](http://requirejs.org/) or simply dropping the script tag 
into your HTML page:

    <script src="bower_components/evrythng/dist/evrythng.js"></script>

See [Usage](#usage) below for more details.

##### Load from CDN

Add the script tag into your HTML page:

    <script src="//cdn.evrythng.com/toolkit/evrythng-js-sdk/evrythng-4.7.2.min.js"></script>
 
Or always get the latest release (warning, new releases might break your code!):

    <script src="//cdn.evrythng.com/toolkit/evrythng-js-sdk/evrythng.js"></script>
    <script src="//cdn.evrythng.com/toolkit/evrythng-js-sdk/evrythng.min.js"></script>
    
For HTTPS you need to use:

    <script src="//d10ka0m22z5ju5.cloudfront.net/toolkit/evrythng-js-sdk/evrythng-4.7.2.min.js"></script>
    <script src="//d10ka0m22z5ju5.cloudfront.net/toolkit/evrythng-js-sdk/evrythng.js"></script>
    <script src="//d10ka0m22z5ju5.cloudfront.net/toolkit/evrythng-js-sdk/evrythng.min.js"></script>
    
### Node.js

    npm install evrythng --save

## Usage

For advanced usage and options, see [Documentation](#documentation) below.

#### RequireJS (AMD)

```javascript
requirejs.config({
  paths: {
    evrythng: '../bower_components/evrythng/dist/evrythng'
  }
});
    
require(['evrythng'], function (EVT) {

  var app = new EVT.App(APP_API_KEY);
  ...
  
});
```

#### Node.js

Create a new scope object of the required actor type to begin making API 
requests with it:

```javascript
var EVT = require('evrythng');

var app = new EVT.App(APP_API_KEY);
...
```

The scope can be used immediately to make other API calls (that do not
require information about the scope beyond the API key used to construct it):

```javascript
var app = new EVT.App(APP_API_KEY);

// Read all products
app.product().read().then(console.log);
```

However, if information about the scope itself (such as the application ID for 
an `EVT.App` scope, for example) is required as soon as possible, use the 
returned promise to be notified when the scope is ready for use. 

**Note**: This applies to all scopes (including `EVT.Operator`, 
`EVT.TrustedApp`, `EVT.User`, and `EVT.Device`). 

Below is an example of this mode of usage:

```javascript
var app = new EVT.App(APP_API_KEY);

app.$init.then((app) => {
  // The scope 'id' property is now ready for use
  console.log(app.id);
});
```


#### Globals

If you aren't using any of the above script loading mechanisms, the EVT module is available
as a global (`EVT`):

```javascript
var app = new EVT.App(APP_API_KEY);
...
```

## Examples

#### General

Setup global settings ([see all options](http://evrythng.github.io/evrythng-source.js/src/core.html)):

```javascript
EVT.setup({
  apiUrl: 'http://api.evrythng.com'
});
```

Access resources using the Promise API:

```javascript
app.product('57bad69fc18104025b292da8').read().then(function(product) {
  console.log(product);
});
```

#### Products and Properties

Update single product property:

```javascript
product.property('status').update('off');
```
      
Update multiple properties:

```javascript
product.property().update({
  status: 'off',
  level: '80'
});
```
  
Read current property:

```javascript
console.log(product.properties['status']);
```
  
Read property history:

```javascript
product.property('status').read().then(function(statusHistory) {
  console.log(statusHistory);
});
```

#### Users

Login an existing user (with Evrythng Auth) and create user scope:

```javascript
app.login({
  email: 'myemail',
  password: 'mypass'
}).then(function(response) {
  // every call using user will use its User Api Key
  var user = response.user;
});
```

Log the user out:

```javascript  
user.logout();
```  

#### Thngs

Create a Thng:

```javascript
user.thng().create({
  name: 'name',
  description: 'desc'
});
```

Read all thngs and update first Thng's description:

```javascript
user.thng().read().then(function(thngs) {
  thngs[0].description = 'newDesc';              
  return thngs[0].update();
}).then(function(thng) {
  console.log('thng 0 updated');
});
```
  
Update existing Thng:

```javascript
user.thng('123').update({
  description: 'new desc'
});
```

#### Actions

Create a new action:

```javascript  
// Actions request device geolocation by default (if available)
// Use 'geolocation: false' option globally or per request to turn it off
thng.action('scans').create();
```

Create a custom action:

```javascript
thng.action('_customAction').create({
  customFields: {
    foo: 'bar'
  }
});
```

### Using request options 

([Read more about options](http://evrythng.github.io/evrythng-source.js/src/ajax.html)):

```javascript
app.product().read({
  fullResponse: true,
  params: {
    perPage: 100,
    project: '123',
    context: true     // actions only
    ...
  },
  headers: {
    authorization: 'anotherApiKey',
    accepts: 'image/png'
  }
}).then(function(result) {
  // Using fullResponse, result contains 'data', 'headers' and 'status'
  console.log(result.headers['x-result-count'] + ' Products:', result.data);
});
```

### Using filters

Specify filter `params` to limit the returned results to matched criteria:

```javascript
app.product().read({
  params: {
    filter: 'name=My Product&tags=shipped'   // regular parameter string notation
  }
});

app.product().read({
  params: {
    filter: {
      name: 'My Product',   // object notation
      tags: 'shipped'
    }
  } 
});
```

### Facebook login

In order to use FB login, the application needs to be initialized with `facebook` property having truthy value:

```javascript
app = new EVT.App({
  apiKey: APP_API_KEY,
  facebook: true
});

app.login('facebook').then(function(response) {
  var user = response.user;
  
  console.log(app.socialNetworks.facebook.appId);
  
  user.logout('facebook');
});
```
It's possible to pass custom configuration to `FB.init` via `faceboook` config property:
```javascript
app = new EVT.App({
  apiKey: APP_API_KEY,
  facebook: { 
    version: 'v2.8'
    cookie: false,
    fbml: true
  }
});
```
For more options see the method [reference](https://developers.facebook.com/docs/javascript/reference/FB.init).

#### New app users

Create and validate a new app user:

```javascript
app.appUser().create({
  email: 'someone@anyone.com',
  password: 'password', // don't put this one in the code :)
  firstName: 'Some',
  lastName: 'One'
}).then(function(appUser) {
  console.log('Created user: ', appUser);

  // validate app user
  return appUser.validate();
}).then(function(appUser) {
  // validated user and his api key
  console.log('Validated app user: ', appUser);
});
```

#### Create an anonymous user

Track a device without creating a full app user:

```javascript
// Create anonymous user
app.appUser().create({
  anonymous: true
}).then(function(anonymousUser) {
  console.log('Created anonymous user: ', anonymousUser); // good to go, doesn't need validation

  // store anonymous user details locally
  if (window.localStorage) {
    localStorage['userId'] = anonymousUser.id;
    localStorage['apiKey'] = anonymousUser.apiKey;
  }
});
```

Restore a user from saved details:

```javascript
var anonymousUser = new EVT.User({
  id: localStorage['userId'],
  apiKey: localStorage['apiKey']
}, app);
```

#### As a [Device](https://developers.evrythng.com/reference#section-thngs-as-devices)

Create a `Device` scope to manage a Thng and allow it to update itself: 

```javascript
var device = new EVT.Device({
  apiKey: DEVICE_API_KEY,
  id: 'thngId'
});

// update the related thng
device.update({
  customFields: {
    foo: 'bar'
  }
}).then(function(updated) {
  console.log('updated device details: ', updated);
});

// CRUD properties
device.property('temperature').update(32);
device.property('humidity').read().then(function(results) {
  console.log('humidity readings:', results);
});

// CR actions
device.action('_turnOn').create();
```


#### Iterator API

The Iterator API is an [Async Generator Function](https://github.com/tc39/proposal-async-iteration) added to each Resource.

```javascript
// Initialize app using appApiKey
var app = new EVT.App('APP_API_KEY');

var it = app.product().iterator();

// .next() returns a promise with the next generator value (page value from API).
// result.done denotes when the iterator reached the end.

// Get page by page
it.next().then(function(result){
  console.log(result.value);
  return it.next();
}).then(result){
  console.log(result.value);
  console.log(result.done);
});

// The iterator can be initialized with the same options as any CRUD request.
// This will iterate through all the Products in the Application's project scope,
// that are tagged with 'test', with the result in ascending order and in chunks of 100

var it = app.product().iterator({
  params: {
    perPage: 100,
    sortOrder: 'ASCENDING',
    filter: {
      tags: 'test'
    }
  }
});

it.next().then(function(result){
  console.log(result.value);
});


// In order to easily loop through all the items, we provide a utility function
// that asynchronously iterates through all the generated pages in order, until
// there are no more results

EVT.Utils.forEachAsync(it, function(val){
  val.forEach(function(product){
    console.log(product.name);
  });
});

```

#### Spawn Generators

[Generator functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) and the `yield`
keyword arrived with great excitement in Node v0.11.2 and the latest evergreen browsers.

This allows people targeting these platforms to write asynchrounous code that looks synchronous. 
[ES7 Async Functions](https://jakearchibald.com/2014/es7-async-functions/) will give you a quick introduction.

```javascript
function *apiCalls(){
  try{
    
    // Yield promise to thngs (i.e. wait for it to resolve/reject)
    var thngs = yield user.thng().read();
    console.log(thngs.length);
    
    // Yield promise to thng properties
    var properties = yield thngs[0].property().read();
    console.info(properties);
    
  } catch(e){
  
    // Will catch every rejected request as well as exceptions
    console.info('Caught: ', e);
    
  }
}

// Iterate through generator
EVT.Utils.spawn(apiCalls());
```

---

## Documentation

The [EVRYTHNG API](https://developers.evrythng.com/docs/api-overview) has *evrythng.js* examples whenever applicable.
If you'd like to see what's going on under the hood, check out the [Annotated Source](http://evrythng.github.io/evrythng-source.js/src/evrythng.html).

## Source Maps

Source Maps are available, which means that when using the minified version, if you open 
Developer Tools (Chrome, Safari, Firefox), *.map* files will be downloaded to help you debug code using the 
original uncompressed version of the library.

## Related tools

#### evrythng-extended.js

[`evrythng-extended.js`](https://github.com/evrythng/evrythng-extended.js) is an extended version of *evrythng.js* which 
includes Operator access to the API.

#### evrythng-scan.js

[`evrythng-scan.js`](https://github.com/evrythng/evrythng-scan.js) is an *evrythng.js* plugin that lets you identify 
Products and Thngs right from your browser, without using a standalone QR Code scanning app. It also supports 
[Image Recognition](https://developers.evrythng.com/docs/identifier-recognition).

#### evrythng-mqtt.js

[`evrythng-mqtt`](https://www.npmjs.com/package/evrythng-mqtt) is an *evrythng.js* plugin for Node.js that adds support
for real-time MQTT methods to any resource.

#### evrythng-hub.js

[`evrythng-hub`](https://github.com/evrythng/evrythng-hub.js) is an *evrythng.js* plugin for both Browser and Node.js that
adds smart routing of local requests when in the context of a Thng-Hub Gateway.

## License

Apache 2.0 License, check `LICENSE.txt`

Copyright (c) EVRYTHNG Ltd.
