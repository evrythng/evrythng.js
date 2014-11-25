# [EVRYTHNG](https://www.evrythng.com) Client JavaScript SDK


evrythng.js is a Javascript library making it a breeze to interact with the EVRYTHNG API thanks to its fluent API. Because of its [UMD](https://github.com/umdjs/umd)-compatibility it can be used for your Web (mobile, desktop or hybrid) apps as well as directly embedded in Node.js apps.


## Installation

### Browser

Use `Bower`:

    bower install evrythng

Or include the script from our CDN in your HTML file using:

    <script src="//cdn.evrythng.net/toolkit/evrythng-js-sdk/evrythng-2.0.8.min.js"></script>
 
Or always get the last stable release:

    <script src="//cdn.evrythng.net/toolkit/evrythng-js-sdk/evrythng.js"></script>
    <script src="//cdn.evrythng.net/toolkit/evrythng-js-sdk/evrythng.min.js"></script>
    
For HTTPs you'll have to use:

    <script src="//d10ka0m22z5ju5.cloudfront.net/toolkit/evrythng-js-sdk/evrythng-2.0.8.min.js"></script>

respectively

    <script src="//d10ka0m22z5ju5.cloudfront.net/toolkit/evrythng-js-sdk/evrythng.min.js"></script>
    
### Node.js

evrythng.js is also available as an NPM package. Install it using:

    npm install evrythng


## Usage

evrythng.js uses UMD, which makes it available in every environment running Javascript.

For advanced usage and options, see the [Documentation section](#documentation) below and the API 
documentation on [EVRYTHNG's Developer Portal](https://dev.evrythng.com/documentation). 

**Note:** Be sure to only include your EVRYTHNG App API key and **not** your Operator or User
App key in any public application code (read more [here](https://dev.evrythng.com/documentation/api#users)).

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
    
    user.thng('123').update({
      description: 'new desc'
    });
    
    var newThng = new EVT.Thng();
    newThng.name = 'name';
    newThng.description = 'desc';
    
    user.thng().create(newThng);
    
    
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

Note: the Node.js version is currently experiemental.

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

### Log an EVRYTHNG user it and get his Thngs

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

For in-depth documentation beyond the one provided here, we encourage you please have a look at the 
[Annotated Source Code](https://evrythng.github.io/evrythng-js-sdk).

The [EVRYTHNG API is documented here](https://dev.evrythng.com/documentation/api).

## Source Maps

Source Maps are available, which means that when using the minified version, if a developer 
opens the Developer Tools, .map files will be downloaded to help him debug code using the original 
uncompressed version of the library.

### Size

22.08 kB (min) → 4.4 kB (gzip)

## Development

Check the Development Notes in [`DEVELOPMENT.md`](./DEVELOPMENT.md).

### Testing

Run tests by:

    grunt test // unit testing with Karma + PhantomJS
    
    grunt test:dist // test UMD in Chrome (AMD + browser globals) and Node
    
    grunt test:sauce // browser globals test in multiple browsers in SauceLabs

## License

Apache 2.0 License, check `LICENSE.txt`

Copyright (c) EVRYTHNG Ltd.
