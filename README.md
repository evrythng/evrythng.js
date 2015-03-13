# [EVRYTHNG](https://www.evrythng.com) Client JavaScript SDK


evrythng.js is a Javascript library making it a breeze to interact with the EVRYTHNG API thanks to its fluent API. Because of its [UMD](https://github.com/umdjs/umd)-compatibility it can be used for your Web (mobile, desktop or hybrid) apps as well as directly embedded in Node.js apps.


## Installation

### Browser

Use `Bower`:

    bower install evrythng

Or include the script from our CDN in your HTML file using:

    <script src="//cdn.evrythng.net/toolkit/evrythng-js-sdk/evrythng-2.1.1.min.js"></script>
 
Or always get the last stable release:

    <script src="//cdn.evrythng.net/toolkit/evrythng-js-sdk/evrythng.js"></script>
    <script src="//cdn.evrythng.net/toolkit/evrythng-js-sdk/evrythng.min.js"></script>
    
For HTTPs you'll have to use:

    <script src="//d10ka0m22z5ju5.cloudfront.net/toolkit/evrythng-js-sdk/evrythng-2.1.1.min.js"></script>

respectively

    <script src="//d10ka0m22z5ju5.cloudfront.net/toolkit/evrythng-js-sdk/evrythng.min.js"></script>
    
### Node.js

If you are working on a Node.js app then you should take the advantage of using [`evrythng-extended.js`](https://github.com/evrythng/evrythng-extended.js) which allows you to perform more operations. If you don't need more then evrythng.js is also available as an NPM package. Install it using:

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

evrythng.js uses UMD, which makes it available in every environment running Javascript.

For advanced usage and options, see the [Documentation section](#documentation) below and the API 
documentation on [EVRYTHNG's Developer Portal](https://dashboard.evrythng.com/developers/apidoc). 

**Note:** Be sure to only include your EVRYTHNG App API key and **not** your Operator or User
App key in any public application code (read more [here](https://dashboard.evrythng.com/developers/apidoc#appusers)).

### With RequireJS (AMD)

```javascript
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

Note: the Node.js version is currently experimental.

```javascript
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


## Documentation

The [EVRYTHNG API is documented here](https://dashboard.evrythng.com/developers/apidoc).

## Source Maps

Source Maps are available, which means that when using the minified version, if a developer 
opens the Developer Tools, .map files will be downloaded to help them debug code using the original 
uncompressed version of the library.

## License

Apache 2.0 License, check `LICENSE.txt`

Copyright (c) EVRYTHNG Ltd.
