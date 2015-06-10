# [EVRYTHNG](https://www.evrythng.com) Client JavaScript SDK

**evrythng.js** is a Javascript library making it a breeze to interact with the EVRYTHNG API thanks to its fluent API. 
We provide two environment-specific versions: AMD and CommonJS to utilise the best of both browser and Node.js.

## Installation

**Note**: `evrythng.js` uses [promises](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise). Not all browsers support that natively; we include [Native Promise Only](https://github.com/getify/native-promise-only) polyfill and suggest loading it before evrythng.js.

### Browsers

#### With [Bower](http://bower.io/)

The Bower package includes the AMD build of evrythng.js. You can either load it directly or use a loader like [require.js](http://requirejs.org/).

    bower install evrythng
    
Then just load the script in your page:

    <script src="bower_components/evrythng/dist/evrythng.js"></script>

Once the script loads, `EVT` becomes available as a browser global. 

If you want to automate this, there are several [Grunt](http://gruntjs.com/) plugins which you may find useful:

* [grunt-wiredep](https://github.com/stephenplusplus/grunt-wiredep) finds your components and injects them directly into the HTML file you specify.
* [grunt-bower-concat](https://github.com/sapegin/grunt-bower-concat) does automatic concatenation of installed Bower components (JS and/or CSS) in the right order.

Or if you prefer [Gulp](http://gulpjs.com/):

* [main-bower-files](https://github.com/ck86/main-bower-files) (works with Grunt too)
* [gulp-bower-src](https://github.com/bclozel/gulp-bower-src) - `gulp.src` files from your bower components directory, using your bower.json configuration file.

#### Load from CDN

The CDN version includes [Native Promise Only](https://github.com/getify/native-promise-only), so all you need is to include the script from our CDN in your HTML file using:

    <script src="//cdn.evrythng.net/toolkit/evrythng-js-sdk/evrythng-3.0.2.min.js"></script>
 
Or always get the last stable release:

    <script src="//cdn.evrythng.net/toolkit/evrythng-js-sdk/evrythng.js"></script>
    <script src="//cdn.evrythng.net/toolkit/evrythng-js-sdk/evrythng.min.js"></script>
    
For HTTPs you'll have to use:

    <script src="//d10ka0m22z5ju5.cloudfront.net/toolkit/evrythng-js-sdk/evrythng-3.0.2.min.js"></script>

respectively

    <script src="//d10ka0m22z5ju5.cloudfront.net/toolkit/evrythng-js-sdk/evrythng.min.js"></script>
    
### Node.js

`evrythng.js` is also available in CommonJS format as a NPM package. Install it using:

    npm install evrythng

## Additional tools

### `scanthng.js`

[`scanthng.js`](https://github.com/evrythng/scanthng.js) is an additional module that lets you identify Products and Thngs
right from your browser, without using a standalone QR Code scanning app. It also supports [image recognition](https://dashboard.evrythng.com/developers/quickstart#quickstart-ir).
It's available from our CDN or as a Bower module. Please refer to [`scanthng.js` README](https://github.com/evrythng/scanthng.js) for details.

### `evrythng-extended.js`

[`evrythng-extended.js`](https://github.com/evrythng/evrythng-extended.js) is an extended version of `evrythng.js` which includes operator access to the API.
It's available as a Node module. Please refer to [`evrythng-extended.js` README](https://github.com/evrythng/evrythng-extended.js) for details.

## Usage

For advanced usage and options, see the [Documentation section](#documentation) below and the API 
documentation on [EVRYTHNG's Developer Portal](https://dashboard.evrythng.com/developers/apidoc). 

**Note:** Be sure to only include your EVRYTHNG App API key and **not** your Operator or User
App key in any public application code (read more [here](https://dashboard.evrythng.com/developers/apidoc#appusers)).

### With RequireJS (AMD)

```javascript
var bowerPath = '../bower_components/'; // replace with path to your local bower directory
requirejs.config({
    paths: {
        evrythng: bowerPath + 'evrythng/dist/evrythng'
    }
});
    
require(['evrythng'], function (EVT) {

  EVT.setup({
    apiUrl: 'xxx'
  });
    
  var app = new EVT.App('appApiKey');

  // Promise API
  app.product('123').read().then(function(prod){
  
    // Properties
    
    // update single property
    prod.property('status').update('off');
        
    // update multiple properties
    prod.property().update({
      status: 'off',
      level: '80'
    });
    
    // read current property
    console.log(prod.properties['status']);
    
    // read property history
    prod.property('status').read().then(function(statusHistory){
    
      console.log(statusHistory);
      
    });
    
    ...
  });
    
  // Login user (with Evrythng Auth) and create user scope  
  app.login({
    email: 'myemail',
    password: 'mypass'
  }).then(function(response){
    
    // every call using user will use its User Api Key
    var user = response.user;
    
   
    // Manage thngs
    user.thng().read().then(function(thngs){
        
      thngs[0].description = 'newDesc';              
      return thngs[0].update();
            
    }).then(function(thng){
        
      console.log('thng updated');
            
    });

    // Update existing thng
    user.thng('123').update({
      description: 'new desc'
    });
    
    // Create a thng
    user.thng().create({
      name: 'name',
      description: 'desc'
    });

    
    
    // Actions
    
    user.thng('1').read().then(function(thng1){
      
      thng1.action('scans').create();
      
      thng1.action('_customAction').create({
        customFields: {
          foo: 'bar'
        }
      });
    
    });
    
    user.logout();
    
    ...
  });
  
  
  // Callback API
  app.product().read(function(products){
  
    console.log(products);
    
  });
  
  // Raw API Calls and multiple API designs example
  var options = {
    url: '/products',
    method: 'post',
    authorization: 'userApiKey',
    data: {
      fn: 'My cool product'
    },
    params: {
      foo: 'bar'
    },
    success: function(product){
      console.log(product);
    },
    error: function(err){
      console.log(err);                            
    }
  }
  
  EVT.api(options).then(successHandler, errorHandler);
  
  EVT.api(options);
  
  EVT.api(options, successCb, errorCb);
  
  
  // Facebook - in order to use FB login, the application needs to
  // be initialized with facebook: true
  app = new EVT.App({
    apiKey: 'appApiKey',
    facebook: true
  });
  
  app.login('facebook').then(function(response){
  
    var user = response.user;
    
    console.log(app.socialNetworks.facebook.appId);
    
    user.logout('facebook');
  });
  ...
});
```

### Plain Javascript

If you aren't using any of the above script loading mechanisms, the EVT module is available
as a browser global:

```javascript
var app = new EVT.App('apiKey');
...
```

### Node.js

**Note**: Node.js in versions before 0.12 does not support promises natively. Load the polyfill before `evrythng.js`:

```javascript
require('native-promise-only);

var EVT = require('evrythng');

var app = new EVT.App('apiKey');
...
```

## More examples

### Create and validate app users

```javascript
// Initialize app using appApiKey
var app = new EVT.App('APP-API-KEY');

// create app user
app.appUser().create({
  email: 'someone@anyone.com',
  password: 'password', // don't put this one in the code :)
  firstName: 'Some',
  lastName: 'One'
}).then(function(appUser){
  console.log('Created user: ', appUser);

  // validate app user
  return appUser.validate();

}).then(function(appUser){

  // validated user and his api key
  console.log('Validated app user: ', appUser);
});
```

### Create anonymous user to track a device without creating a full app user

```javascript
// Initialize app using appApiKey
var app = new EVT.App('APP-API-KEY');

// create anonymous user
app.appUser().create({
  anonymous: true
}).then(function(anonymousUser){
  console.log('Created anonymous user: ', anonymousUser); // good to go, doesn't need validation

  // store anonymous user details locally
  if (window.localStorage) {
    localStorage['userId'] = anonymousUser.id;
    localStorage['apiKey'] = anonymousUser.apiKey;
  }
});

...
// restore user from saved details
var anonymousUser = new EVT.User({
    id: localStorage['userId'],
    apiKey: localStorage['apiKey']
  }, app);

```

### Log an EVRYTHNG user in and get their Thngs

```javascript
app.login({
  email: 'some@one.com',
  password: 'password' // don't put this one in the code :)
}).then(function(authResponse){
  var user = authResponse.user;
  user.thng().read().then(function(thngs){
    console.log('thngs: ' thngs);
  });
});
```

### As a Device

```javascript
var device = new EVT.Device({
  apiKey: 'DEVICE-API-KEY',
  id: 'thngId'
});

// update the related thng
device.update({
  customFields: {
    foo: 'bar'
  }
}).then(function(updated){
  console.log('updated device details: ', updated);
});

// CRUD properties
device.property('temperature').update(32);
device.property('humidity').read().then(function(results){
  console.log('humidity readings:', results);
});

// CR actions
device.action('_turnOn').create();
```

## Documentation

The [EVRYTHNG API is documented here](https://dashboard.evrythng.com/developers/apidoc).

## Source Maps

Source Maps are available, which means that when using the minified version, if a developer 
opens the Developer Tools, .map files will be downloaded to help them debug code using the original 
uncompressed version of the library.

## License

Apache 2.0 License, check `LICENSE.txt`

Copyright (c) EVRYTHNG Ltd.
