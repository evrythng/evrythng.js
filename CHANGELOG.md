# v4.7.2 (11-15-2017)

## Bug fixes

-**Places**: Do not geolocate place with id

# v4.7.1 (30-06-2017)

## Features

-**Policies**: Allow single Policy access.

# v4.7.0 (29-06-2017)

## Features

-**Policies**: Add Policy resource to Roles.

# v4.6.0 (09-06-2017)

## Features

-**Schemas**: Add Schema resource in Operator scope.

# v4.5.1 (30-05-2017)

## Bug fixes

-**Permissions**: Add support for old Permission API.

# v4.5.0 (25-04-2017)

## Features

-**Permissions**: Add Permission resource to Roles.

# v4.4.1 (25-04-2017)

## Bug fixes

- **HTTP**: Fix incorrect Content-Type header check in Node.

# v4.4.0 (03-04-2017)

## Features

-**Roles**: Add Role resource in Operator and User scope.

# v4.3.0 (30-01-2017)

## Features

- **Files**: CRD access in the Operator scope.

# v4.2.0 (10-01-2017)

## Features

- **Scopes**: Read data from any scope on creation via `$init`.

# v4.1.0 (12-10-2016)

## Features

- **Reactor scripts**: Add nested reactor script status 
resource `app.reactor.script().status()`.

# v4.0.1 (11-10-2016)

## Bug fixes

- **Auth**: Allow to pass FB initialization settings
- **Auth**: Read user details when login in application

# v4.0.0 (04-10-2016)

## Breaking changes

- **Reactor logs**: Move `app.reactorLog()` resource within the `app.reactor.log()` namespace 
(only available in **evrythng-extended.js**).
- **Search**: Global `.search()` has been removed to match API. Use filters instead.
- **Multimedia**: Multimedia resource has been removed to match API.

## Features

- **Reactor schedules**: Add Reactor schedules resource in the `app.reactor.schedule()` namespace 
(only available in **evrythng-extended.js**).
- **Reactor scripts**: Add Reactor scripts resource in the `app.reactor.script()` namespace 
(only available in **evrythng-extended.js**).

# v3.7.0 (16-06-2016)

## Features

- **Collections**: Add nested collection resource `operator.collection('id').collection()`.

# v3.6.1 (09-06-2016)

## Bug fixes

- **Iterator API**: Use `sortOrder=DESCENDING` param by default.
- **Application**: Reject `application.$init` promise if app does not exist.
- **AJAX Headers**: Fix response headers not being handled correctly.

# v3.6.0 (02-06-2016)

## Features

- **Batches**: CRUD access in the Operator scope.
- **Batch tasks**: CR access in the Batch resource.

# v3.5.0 (12-05-2016)

## Features

- **Iterator API**: Async generator `iterator()` added to every Resource, supporting looping 
through the new pagination links.
- **Utils**: Added `forEachAsync()` utility to loop through async generator values.
- **Utils**: Added `spawn()` utility to run through generator function.

## Breaking changes

- **Count**: `count()` method on the Resource has been removed.

## Bug fixes

- **AJAX Headers**: Header values were being lowercased.

# v3.4.4 (26-04-2016)

## Bug fixes

- **Request interceptors**: Added Promise support for request interceptors.

# v3.4.3 (26-01-2016)

## Changes

- **Callback API**: Make deprecation warning mutable.

# v3.4.2 (22-12-2015)

## Changes

- **Errors**: Added `code` and `moreInfo` and removed `message` and `type` to/from EVT.js errors.
- **Callback API**: Added deprecation when callbacks are executed.

# v3.4.1 (14-12-2015)

## Changes

- **Transport**: Common transport module for Node.js and Browser.

# v3.4.0 (02-12-2015)

## Features

- **Projects**: CRUD access in the Operator scope.
- **Applications**: CRUD access in the Project resource.
- **Reactor Logs**: RD access in the Operator scope.
- **Actions**: allow to override global Geolocation setting per request.

# v3.3.2 (27-10-2015)

## Bug fixes

- **Resource path**: newly created entities have wrong resource path [#37].

# v3.3.1 (09-09-2015)

## Bug fixes

- **Properties**: normalize arguments with falsy values (e.g. `0`, `false`) on property creation or update.

# v3.3.0 (07-09-2015)

## Features

- **Trusted App**: updated permissions for TrustedApp scope.
- **Custom headers**: allow to setup custom headers with **headers** object option.
- **Action Types**: CRUD access like other entities.
- **Filters**: escape special characters for filter param when using object notation.

## Bug fixes

- **Properties**: normalize arguments on creation, just like updates. Read properties with special characters.
- **Empty fields**: empty fields not being sent to API request.
- **Encoding**: nested params objects (e.g. filters) are only encoded once.

# v3.2.0 (10-08-2015)

## Features

- **Trusted App**: scope to use with you **Application Secret Key**, mainly used in Reactor scripts
(only available in **evrythng-extended.js**).

## Breaking changes

- **plugins**: `EVT.use()` to install plugin is now synchronous. Callback has been removed. Required dependencies
now use `$inject` property instead of `requires`.

# v3.1.2 (25-06-2015)

## Features

- **documentation**: clearer usage and installation steps. Consistent format from other libs.

# v3.1.1 (19-06-2015)

## Bug fixes

- **package.json**: Github url with `git://` protocol.

# v3.1.0 (17-06-2015)

## Bug fixes

- **xhr**: responses without headers were being ignored.

## Features

- **interceptors**: setup request and response interceptors globally or as a one-off request settings.
- **plugins**: ability to install/use plugins for additional functionality.

## Breaking changes

- **synchronous requests**: sync option removed for Node.js vs Browser consistency and to promote best practices.
