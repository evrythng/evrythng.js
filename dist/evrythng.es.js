/**
 * EVRYTHNG.JS v5.0.0-pre.4
 * (c) 2012-2017 EVRYTHNG Ltd. London / New York / San Francisco.
 * Released under the Apache Software License, Version 2.0.
 * For all details and usage:
 * https://github.com/evrythng/evrythng.js
 */

/**
 * An interceptor implements a request and/or response handlers that are called
 * before and after each request, respectively.
 *
 * @typedef {Object} Interceptor
 * @param {Function} request - Function to run before the request is sent
 * @param {Function} response - Function to run after the response is received
 */

/**
 * Settings can be applied globally or for individual requests.
 * Available options are provided below:
 *
 * @typedef {Object} Settings
 * @param {string} apiUrl - API url of request
 * @param {string} url - Url relative to `apiUrl`
 * @param {string} method - HTTP Method of request
 * @param {string} apiKey - API Key to use with request
 * @param {boolean} fullResponse - Flags if request should remain unwrapped
 * @param {boolean} geolocation - Flags if action creation should use the Web
 * Geolocation API
 * @param {number} timeout - Timeout for request
 * @param {Object} headers - Headers to send with request
 * @param {Interceptor[]} interceptors - List of request/response interceptors
 */

/**
 * Default settings. Never change.
 *
 * @type {Settings}
 */
const defaultSettings = {
  apiUrl: 'https://api.evrythng.com',
  apiKey: '',
  fullResponse: false,
  geolocation: true,
  timeout: 0,
  headers: {
    'content-type': 'application/json'
  },
  interceptors: []

  // Initialize settings with defaults.
};const settings = Object.assign({}, defaultSettings);

/**
 * Override global settings. Ignore unknown settings.
 *
 * @param {Object} customSettings - Custom settings
 * @returns {Object} new
 */
function setup(customSettings) {
  return Object.assign(settings, customSettings);
}

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Built-in value references. */
var Symbol$1 = root.Symbol;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

/** `Object#toString` result references. */
var nullTag = '[object Null]';
var undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]';
var funcTag = '[object Function]';
var genTag = '[object GeneratorFunction]';
var proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype;
var objectProto$2 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$1.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

const SPECIALS = ['&', '|', '!', '>', '<', '=', '~', '(', ')', ','];
const SPECIALS_REGEXP = new RegExp(`[${SPECIALS.join('\\')}]`, 'g');
const SPECIALS_ESCAPE = '\\$&';

/**
 * Build url safe parameter string if an object provided.
 *
 * @export
 * @param {(Object | string)} [params] key-value object or final query string
 * @param {boolean} [useEncoding] whether to skip encoding
 * @returns {string}
 */
function buildParams(params = {}, useEncoding = true) {
  return isPlainObject(params) ? Object.entries(params).map(buildParam(useEncoding)).join('&') : params;
}

/**
 * Returns reducer function that adds the encoded key-value params to
 * accumulator.
 *
 * @param {boolean} useEncoding
 * @returns {Function}
 */
function buildParam(useEncoding) {
  const encode = uriEncoder(useEncoding);
  return ([key, value]) => {
    return `${encode(key)}=${encode(buildParams(value))}`;
  };
}

/**
 * Returns function that encodes values using encodeURIComponent.
 *
 * @param {boolean} useEncoding
 * @returns {Function}
 */
function uriEncoder(useEncoding) {
  return value => useEncoding ? encodeURIComponent(value) : escapeSpecials(value);
}

/**
 * Escape special characters in value with the backslash (\) character.
 *
 * @param {string} value
 * @returns {string}
 */
function escapeSpecials(value) {
  return value.replace(SPECIALS_REGEXP, SPECIALS_ESCAPE);
}

/**
 * Concatenate url with parameters from request options.
 *
 * @export
 * @param {Object} options request options including url and params
 * @returns {string}
 */
function buildUrl(options) {
  let url = `${options.apiUrl}${options.url}`;

  if (options.params) {
    url += `?${buildParams(options.params)}`;
  }

  return url;
}

/**
 * Apply error-first callback if available.
 *
 * @param {function} callback - Error-first callback
 * @returns {function} - Response handler function
 */
function success(callback) {
  return response => {
    if (callback) callback(null, response);
    return response;
  };
}

/**
 * Apply error-first callback with error if available.
 *
 * @param {function} callback - Error-first callback
 * @returns {function} - Response handler function
 */
function failure(callback) {
  return err => {
    if (callback) callback(err);
    throw err;
  };
}

/**
 * Make API request to provided API Url. Custom user options are merged with
 * the globally defined settings and request defaults. Request interceptors can
 * manipulated this options before passing them on to Fetch. On response,
 * response interceptors may parse the result.
 *
 * This method returns both a Promise and accepts error first callbacks.
 *
 * @param {Settings} customOptions - User options for this single request
 * @param {function} callback - Error first callback
 * @returns {Promise} - Response promise
 */
function api(customOptions = {}, callback) {
  let initialOptions = mergeInitialOptions(customOptions);

  return applyRequestInterceptors(initialOptions).then(options => {
    return makeFetch(options).then(handleResponse(options)).then(applyResponseInterceptors(options));
  }).then(success(callback)).catch(failure(callback));
}

/**
 * Merge base options, global settings, one-off request options and nested
 * headers object. Use apiKey option if headers.authorization is not provided.
 *
 * @param {Settings} customOptions - User options
 * @returns {Settings} - Merged options for fetch
 */
function mergeInitialOptions(customOptions) {
  const options = Object.assign({ method: 'get', url: '' }, settings, customOptions, { headers: Object.assign({}, settings.headers, customOptions.headers) });

  // Use apiKey if authorization header is not explicitly provided.
  if (!options.headers.authorization && options.apiKey) {
    options.headers.authorization = options.apiKey;
  }

  // Stringify data if any
  if (options.data) {
    options.body = JSON.stringify(options.data);
    Reflect.deleteProperty(options, 'data');
  }

  return options;
}

/**
 * Apply request inteceptors functions in sequence, chaining each promise.
 *
 * @param {Settings} options - Request options
 * @returns {Promise} - Promise to updated request options
 */
function applyRequestInterceptors(options) {
  // Use closure to keep track if request as been cancelled in interceptors
  let cancelled = false;
  function cancel() {
    cancelled = true;
  }

  let intercepted = Promise.resolve(options);

  if (Array.isArray(options.interceptors)) {
    options.interceptors.filter(interceptor => isFunction(interceptor.request)).forEach(interceptor => {
      // Chain promises. If interceptor returns undefined, use previous options
      intercepted = intercepted.then(prevOptions => {
        if (cancelled) return prevOptions;
        return interceptor.request(prevOptions, cancel) || prevOptions;
      });
    });
  }

  return intercepted.then(finalOptions => {
    // Reject request if it has been cancelled by request interceptors.
    if (cancelled) {
      return Promise.reject({
        errors: ['Request cancelled on request interceptors'],
        cancelled: true
      });
    }
    return finalOptions;
  });
}

/**
 * Make the actual fetch request using the Fetch API (browser and Node.js).
 * Mimic timeout with Promise.race, rejecting request if timeout happens before
 * response arrives.
 * Note: timeout should be added to fetch spec:
 * https://github.com/whatwg/fetch/issues/20
 *
 * @param {Settings} options - Request options
 */
function makeFetch(options) {
  const req = fetch(buildUrl(options), options);
  if (!options.timeout) {
    return req;
  } else {
    return Promise.race([req, new Promise(function (resolve, reject) {
      setTimeout(() => reject('Request timeout'), options.timeout);
    })]);
  }
}

/**
 * Return initial response data depending on the options.fullResponse value.
 * Always resolve request on HTTP success code, reject otherwise. Return the
 * entire Response object in case of fullResponse option, default to JSON
 * parsing otherwise.
 *
 * @param {Settings} options - Request options
 * @returns {Promise} - Promise to {Response} or {Object}
 */
function handleResponse(options) {
  return response => {
    const res = options.fullResponse ? Promise.resolve(response) : response.status === 204 ? Promise.resolve() : response.json();

    return res.then(data => {
      if (response.ok) {
        return data;
      } else {
        throw data;
      }
    });
  };
}

/**
 * Apply response interceptors functions. When using fullResponse, response is
 * a Response object with a ReadableStream. Until transform streams arrive in
 * browser, there's no way to elegantly transform a response body, other than
 * monkey-patching .json method.
 *
 * @param {Settings} options - Request options
 * @returns {function} - Response handler function
 */
function applyResponseInterceptors(options) {
  return response => {
    let intercepted = Promise.resolve(response);

    if (Array.isArray(options.interceptors)) {
      options.interceptors.filter(interceptor => isFunction(interceptor.response)).forEach(interceptor => {
        // Chain promises.
        intercepted = intercepted.then(interceptor.response);
      });
    }

    return intercepted;
  };
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/** `Object#toString` result references. */
var stringTag = '[object String]';

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
}

var symbols = {
  init: Symbol('init'),
  path: Symbol('path'),
  resource: Symbol('resource')
};

/**
 * Scope defines the context in which API calls are made. A scope is defined
 * by its API Key. That key is sent in each request's Authorization header that
 * uses this scope.
 */
class Scope {
  /**
   * Creates an instance of Scope.
   *
   * @param {string} apiKey API Key of scope
   * @param {Object} [body={}] Optional scope data
   */
  constructor(apiKey, body = {}) {
    if (!isString(apiKey)) {
      throw new Error('Scope constructor should be called with an API Key');
    }

    this.apiKey = apiKey;

    // Define non-enumerable unique init property so it's not copied over in
    // shallow copies of this (e.g. using Object.assign).
    this[symbols.init] = api({
      url: '/access',
      apiKey: this.apiKey
    });

    // Extend scope with any given details.
    Object.assign(this, body);
  }

  /**
   * Read itself and extend scope document.
   *
   * @param {Settings} [options={}] - Optional API request options
   * @returns {Promise} - Updated operator scope
   */
  read(options = {}) {
    const opts = Object.assign(options, {
      method: 'get',
      url: this[symbols.path],
      apiKey: this.apiKey
    });

    return this._request(opts);
  }

  /**
   * Update self and extend scope document.
   *
   * @param {Object} data - Operator data
   * @param {Settings} [options={}] - Optional API request options
   * @returns {Promise} - Updated operator scope
   */
  update(data, options = {}) {
    const opts = Object.assign(options, {
      method: 'put',
      url: this[symbols.path],
      apiKey: this.apiKey,
      data
    });

    return this._request(opts);
  }

  // Private

  /**
   *
   * @param {Settings} options - Request options
   * @returns {Promise} - Updated operator scope
   * @private
   */
  _request(options) {
    return api(options).then(data => Object.assign(this, data));
  }
}

// Parse Link headers for API pagination.
// https://gist.github.com/niallo/3109252
function parseLinkHeader(header) {
  const links = {};

  if (header && header.length) {
    // Split parts by comma
    const parts = header.split(',');
    // Parse each part into a named link
    for (let i = 0; i < parts.length; i++) {
      const section = parts[i].split(';');
      const url = section[0].replace(/<(.*)>/, '$1').trim();
      const name = section[1].replace(/rel="(.*)"/, '$1').trim();
      links[name] = url;
    }
  }

  return links;
}

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();

/**
 * A Resource is the base class that implements the CRUD methods behavior.
 * All resource requests are scoped (i.e. they use the scope's API Key).
 *
 * Every resource operation tries to serialize/deserialize the type of object
 * corresponding to the resource (i.e. when creating a Thng, the developer gets
 * a Thng entity back, with nested methods).
 */
class Resource {
  /**
   * Returns a resource factory function for the given entity type.
   *
   * @static
   * @param {Entity} type - Entity sub-class
   * @param {string} path - Path for new resource
   * @param {Function} MixinNestedResources - Mixin that extends Resource class
   * with nested resources
   * @return {Function} - Resource factory function
   */
  static factoryFor(type, path = '', MixinNestedResources) {
    if (!type) {
      throw new Error('Entity type is necessary for resource factory.');
    }

    // No "this" binding with arrow function! This needs to run in the context
    // where it is mixed in / attached.
    return function (id) {
      // Allowed on Scopes, Resources and Entities.
      let parentPath, parentScope, newPath;

      if (this instanceof Scope) {
        parentScope = this;
        parentPath = '';
      } else if (this instanceof Resource) {
        parentScope = this.scope;
        parentPath = this.path;
      } else if (this instanceof Entity) {
        parentScope = this[symbols.resource].scope;
        parentPath = this[symbols.resource].path;
      }

      newPath = parentPath + path;

      if (id) {
        if (!isString(id)) {
          throw new TypeError('ID must be a string.');
        }
        newPath += `/${encodeURIComponent(id)}`;
      }

      const XResource = MixinNestedResources ? MixinNestedResources(Resource) : Resource;
      return new XResource(parentScope, newPath, type);
    };
  }

  /**
   * A Resource requires a Scope sub-class (App, Operator, etc.) and the
   * corresponding path in the Engine API. An Entity sub-class can be
   * provided, in which case is it used to create instance of that Entity class
   * when returning from API requests.
   *
   * @param {Scope} scope - Scope containing API Key
   * @param {string} path - Relative path to API resource
   * @param {Entity} [type] - Reference to Entity class (constructor)
   */
  constructor(scope, path, type) {
    if (!(scope && scope instanceof Scope)) {
      throw new TypeError('Scope should inherit from Scope (e.g. EVT.App).');
    }

    if (!isString(path)) {
      throw new TypeError('Resource must have a String path.');
    }

    // Setup scope for each of the subsequent calls.
    this.scope = scope;

    // Setup path and allow to omit leading '/'.
    this.path = `${path[0] !== '/' ? '/' : ''}${path}`;

    // Setup entity for serializing and deserializing results. It must
    // implement *toJSON()* method, as defined in the Entity base class.
    if (type && (type === Entity || type.prototype instanceof Entity)) {
      this.type = type;
    }
  }

  /**
   * Convert an Entity instance into plain JSON payload for API requests.
   *
   * @param {Entity} entity - Instace of entity object
   * @returns {Object}
   */
  serialize(entity = {}) {
    if (!(this.type && entity instanceof this.type)) {
      return entity;
    }
    return entity.json();
  }

  /**
   * Opposite of serialization. Convert API responses into proper Entities
   * using the entity class of the resource. If response is a collection,
   * converts each of the items.
   *
   * @param {Object} response - JSON response from API
   * @returns {Object|Entity|Response} - Entity if able to deserialize;
   * Response if fullResponse option was used; Object otherwise.
   */
  deserialize(response) {
    if (response && this.type) {
      if (Array.isArray(response)) {
        return response.map(this.deserialize.bind(this));
      }

      if (response.body) {
        // Full response, add deserialize method to deserialize the Response's
        // json body
        response.deserialize = () => response.json().then(this.deserialize.bind(this));
      } else {
        // JSON response, base case.
        // Create new entity with updated resource derived from current.
        let newPath = this.path;

        // Expand resource path with ID of entity.
        if (response.id && newPath.indexOf(response.id) === -1) {
          newPath += `/${response.id}`;
        }

        const newResource = new Resource(this.scope, newPath, this.type);
        const EntityType = this.type;
        return new EntityType(newResource, response);
      }
    }

    return response;
  }

  /**
   * Create a new entity for this resource.
   *
   * @param {Object|Entity} body - Entity to create
   * @param {Settings} [options] - Options of the request
   * @param {Function} [callback] - Error-first callback
   * @returns {Promise}
   */
  create(body, options, callback) {
    if (!body || isFunction(body)) {
      throw new TypeError('Create method must have payload.');
    }

    return this._request({
      url: this.path,
      body,
      method: 'post'
    }, options, callback);
  }

  /**
   * Reads resource entities.
   *
   * @param {Settings} [options] - Options of the request
   * @param {Function} [callback] - Error-first callback
   * @returns {Promise}
   */
  read(options, callback) {
    return this._request({
      url: this.path,
      method: 'get'
    }, options, callback);
  }

  /**
   * Updates entity via this resource.
   *
   * @param {Object|Entity} body - Entity to create
   * @param {Settings} [options] - Options of the request
   * @param {Function} [callback] - Error-first callback
   * @returns {Promise}
   */
  update(body, options, callback) {
    if (!body || isFunction(body)) {
      throw new TypeError('Update method must have payload.');
    }

    return this._request({
      url: this.path,
      body,
      method: 'put'
    }, options, callback);
  }

  /**
   * Deletes entity in resource.
   *
   * @param {Settings} [options] - Options of the request
   * @param {Function} [callback] - Error-first callback
   * @returns {Promise}
   */
  ['delete'](options, callback) {
    return this._request({
      url: this.path,
      method: 'delete'
    }, options, callback);
  }

  /**
   * Returns a page iterator. It is essentially an async generator that returns
   * a promise to the next page on every `.next()` invocation.
   *
   * @param {Settings} [options] - Options of the request
   * @returns {AsyncGenerator}
   * @example
   *
   * ```
   *   const it = operator.thng().pages()
   *   it.next().then(console.log)
   *
   *   // or in ES7+
   *
   *   for await (let page of pages) {
   *     console.log(page)
   *   }
   * ```
   */
  pages(options = {}) {
    var _this = this;

    return asyncGenerator.wrap(function* () {
      const fullResponse = options.fullResponse;
      let response;

      // Read first 'page' with user-defined options.
      response = yield asyncGenerator.await(_this._linkRequest({ url: _this.path }, fullResponse, options));
      yield response.result;

      while (response.next) {
        response = yield asyncGenerator.await(_this._linkRequest({ apiUrl: response.next }, fullResponse));
        yield response.result;
      }
    })();
  }

  // PRIVATE

  /**
   * Actual request call. This method merges mandatory request options with
   * user provided ones and forces the resource path and API Key, so they are
   * not overriden. Serializes any body passed in, and deserializes response in
   * the end.
   *
   * Callback may be used in place of userOptions.
   *
   * @param {Settings} requestOptions - Mandatory request options
   * @param {Settings} [userOptions] - Optional user options
   * @param {Function} [callback] - Error-first callback
   * @returns {Promise.<Object|Entity|Response>}
   * @private
   */
  async _request(requestOptions, userOptions = {}, callback) {
    if (isFunction(userOptions)) {
      callback = userOptions;
    }

    // Merge options, priority to mandatory ones.
    const options = Object.assign({}, userOptions, requestOptions, {
      apiKey: this.scope.apiKey
    });

    // Serialize Entity into JSON payload.
    if (options.body) {
      options.body = await this.serialize(options.body);
    }

    // Execute callback after deserialization.
    try {
      const response = await api(options);
      const deserialized = await this.deserialize(response);
      return success(callback)(deserialized);
    } catch (err) {
      throw failure(callback)(err);
    }
  }

  /**
   * Async request that parses the link header if any.
   *
   * @param {Settings} requestOptions - Mandatory request options
   * @param {Boolean} fullResponse - Wrap Response or not
   * @param {Settings} [userOptions] - Optional user options
   * @returns {Promise.<{result: Response|Array, next: string}>}
   * @private
   */
  async _linkRequest(requestOptions, fullResponse, userOptions = {}) {
    const opts = Object.assign({ fullResponse: true }, requestOptions);
    const response = await this._request(opts, userOptions);
    const linkHeader = parseLinkHeader(response.headers.get('link'));
    const next = linkHeader.next && decodeURIComponent(linkHeader.next);
    const result = await (fullResponse ? response : response.json());
    return { result, next };
  }
}

/**
 * Entity is the base class for all types of entities in the EVRYTHNG API.
 * An Entity knows how to update and delete itself given that a resource is
 * provided.
 */
class Entity {
  /**
   * Creates an new entity of given Resource. Optionally can be initialized
   * with pre-defined data.
   *
   * @param {Resource} resource - Resource owner of this entity.
   * @param {Object} [body] Optional entity data
   */
  constructor(resource, body = {}) {
    if (!(resource && resource instanceof Resource)) {
      throw new Error('Resource must be a Resource.');
    }

    // Define non-enumerable unique resource property so it's not copied over
    // in shallow copies of this (e.g. using Object.assign).
    this[symbols.resource] = resource;

    // Extend Entity with data.
    Object.assign(this, body);
  }

  /**
   * Returns all enumerable properties.
   *
   * @returns {Object}
   */
  json() {
    return Object.entries(this).reduce((ret, [k, v]) => Object.assign(ret, { [k]: v }), {});
  }

  /**
   * Update itself by calling the update method of the owning resource and
   * passing the JSON representation of itself or the given body object.
   *
   * @param {Object} body - optional body, use self as default
   * @param {Function} callback - error-first callback
   * @returns {Promise.<Object>}
   */
  update(body = this.json(), callback) {
    return this[symbols.resource].update(body, callback).then(updated => {
      // Update self and keep chaining with API response.
      Object.assign(this, updated);
      return updated;
    });
  }

  /**
   * Delete itself by calling the delete method of the owning resource.
   *
   * @param {Function} callback - error-first callback
   * @returns {Promise.<Object>}
   */
  ['delete'](callback) {
    return this[symbols.resource].delete(callback);
  }
}

const path$1 = '/properties';

/**
 * Represents a Property entity. Properties are always nested and required
 * to be constructed on Resource/Entity objects (not top level Scopes).
 *
 * @extends Entity
 */
class Property extends Entity {
  /**
   * Return overridden resource factory for Properties. Properties are
   * sub-resources of Thngs and Products and are not allowed on top level
   * Scope classes. This factory also override the default Resource's create
   * and update methods to accept and normalize different types of arguments.
   *
   * @static
   * @return {{property: Function}}
   */
  static resourceFactory() {
    return {
      property(id) {
        const thngPath = this instanceof Scope ? this[symbols.path] : '';

        // Creates and returns Resource of type Property.
        // Override property resource create/update to allow custom value
        // params. See `normalizeArguments()`.
        return Object.assign(Resource.factoryFor(Property, thngPath + path$1).call(this, id), {
          create(...args) {
            return Resource.prototype.create.call(this, ...normalizeArguments(...args));
          },
          update(...args) {
            return Resource.prototype.update.call(this, ...normalizeArguments(...args));
          }
        });
      }
    };
  }
}

/**
 * The API only allows array format for property updates. The SDK relaxed that
 * and allows developers to pass in simple strings, numbers, booleans and objects.
 * It also allows to pass multiple key-value updates in a single object.
 *
 * @param {*} data - Property data.
 * @param {*} rest - Rest of parameters.
 * @return {Array} - Same input format, with first data param updated.
 * @example
 *
 * product.property().update({
 *   on: true,
 *   temp: 26,
 *   custom: ['1', '2']
 * })
 */
function normalizeArguments(data, ...rest) {
  if (isString(data) || typeof data === 'number' || typeof data === 'boolean') {
    // Convert simple property values to API format.
    data = [{ value: data }];
  } else if (isPlainObject(data)) {
    if (data.hasOwnProperty('value')) {
      // Update single property using object notation.
      data = [data];
    } else {
      // Update multiple properties creating an object for each key-value pair.
      data = Object.entries(data).map(val => ({
        key: val[0],
        value: val[1]
      }));
    }
  }

  return [data, ...rest];
}

/**
 * Get browser's current position from Geolocation API.
 *
 * @return {Promise} - Resolves with current position or rejects with failure
 * explanation.
 */
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.navigator.geolocation) {
      const geolocationOptions = {
        maximumAge: 0,
        timeout: 10000,
        enableHighAccuracy: true
      };

      window.navigator.geolocation.getCurrentPosition(resolve, err => reject(err.message), geolocationOptions);
    } else {
      reject('Geolocation API not available.');
    }
  });
}

/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */
function isUndefined(value) {
  return value === undefined;
}

const path$2 = '/actions/:type';

/**
 * Represents an Action entity.
 *
 * @extends Entity
 */
class Action extends Entity {
  /**
   * Return overridden resource factory for Actions. Actions require an
   * action type to be specified before the ID. The action creation is also
   * different from any other Resource, as it fetches the user location and
   * pre-populates the action payload with the Resource type.
   *
   * @static
   * @return {{action: Function}}
   */
  static resourceFactory() {
    return {
      action(actionType, id) {
        if (!actionType) {
          throw new TypeError('Action type cannot be empty.');
        }

        if (!isString(actionType)) {
          throw new TypeError('Action type must be a name string');
        }

        const typePath = path$2.replace(':type', actionType);
        const thngPath = this instanceof Scope ? this[symbols.path] : '';
        const context = this;

        // Creates and returns Resource of type Action.
        // Override property resource create to allow custom value params and
        // fetch the user's geolocation. See `createAction()`.
        return Object.assign(Resource.factoryFor(Action, thngPath + typePath).call(this, id), {
          create(...args) {
            return createAction.call(this, context, actionType, ...args);
          }
        });
      }
    };
  }
}

/**
 * Create action of given type. Allow empty body and fetch geolocation if
 * setup and available.
 *
 * @param {Scope|Resource|Entity} caller - Where the resource is attached to
 * @param {string} actionType - Type of action
 * @param {*} args - Rest of arguments passed to resource creation
 * @return {Promise}
 */
function createAction(caller, actionType, ...args) {
  let [data, ...rest] = normalizeArguments$1(...args);
  let [options] = rest;

  // Auto-fill action payload with resource type and entity id.
  data = Array.isArray(data) ? data.map(action => fillAction(action, caller, actionType)) : data = fillAction(data, caller, actionType);

  const baseCreate = Resource.prototype.create.bind(this);
  const updatedArgs = () => [data, ...rest];

  if (useGeolocation(options)) {
    return getCurrentPosition().then(position => {
      data = fillActionLocation(data, position);
      return baseCreate(...updatedArgs());
    }).catch(err => {
      console.info(`Unable to get position: ${err}`);
      return baseCreate(...updatedArgs());
    });
  } else {
    return baseCreate(...updatedArgs());
  }
}

/**
 * Add an empty action object if none is provided.
 *
 * @param {*} args - Arguments array.
 * @return {Array} - Same input format, with first data param updated.
 * @example
 *
 * product.action().create()
 * product.action().create(<Action>)
 */
function normalizeArguments$1(...args) {
  let firstArg = args[0];
  if (isUndefined(firstArg) || isFunction(firstArg)) {
    args.unshift({});
  }
  return args;
}

/**
 * Fill action type and entity ID. Resource type takes precedence over given
 * type. Entity ID overrides any pre-defined target ID, if action is created on
 * an Entity instance.
 *
 * @param {Object} data - Action data
 * @param {Scope|Resource|Entity} caller - Where the resource is attached to
 * @param {string} actionType - Resource action type
 * @return {Object} - New action data
 */
function fillAction(data, caller, actionType) {
  const action = Object.assign({}, data);

  // Fill type from Resource or pre-defined type.
  action.type = actionType !== 'all' && actionType || data.type || '';

  // Fill in entity ID if called on an entity.
  const entityIdentifier = getIdentifier(caller);
  if (entityIdentifier) {
    action[entityIdentifier] = caller.id;
  }

  return action;
}

/**
 * Actions can be performed on Products, Thngs and Collections and the
 * property on the payload differs based on the target.
 *
 * @param {Scope|Resource|Entity} caller - Where the resource is attached to
 * @return {string}
 */
function getIdentifier(caller) {
  return caller instanceof Entity ? caller.constructor.name.toLocaleLowerCase() : '';
}

/**
 * Check if the library should request the browser geolocation. If local
 * option is available, it takes precedence over global setting.
 *
 * @param {Settings|Function} options - If function, it's the callback
 * @return {boolean}
 */
function useGeolocation(options) {
  return options && !isUndefined(options.geolocation) ? options.geolocation : settings.geolocation;
}

/**
 * Fill action location with coordinates from browser's Geolocation API.
 *
 * @param {Object} data - Action data
 * @param {Object} position - Geolocation API position coordinates
 * @return {Object} - New action data
 */
function fillActionLocation(data, position) {
  const action = Object.assign({}, data);
  action.location = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude
  };
  action.locationSource = 'sensor';
  return action;
}

/**
 * Return a subclass factory function that mixins the resource factory
 * functions from all the entities provided.
 * This provides a way to extend a Scope class and add a mixin that contains
 * all the resource methods available for that scope.
 *
 * E.g.
 * ```
 *  class Operator extends OperatorAccess(Scope) {}
 * ```
 *
 * See: http://raganwald.com/2015/12/28/mixins-subclass-factories-and-method-advice.html#fn:simplified
 *
 * @param {Array} entities - List of entities to add resources to
 * @return {function(Scope)}
 */
function mixinResources(entities) {
  const resourceFactories = entities.map(e => e.resourceFactory());
  const accessResources = Object.assign({}, ...resourceFactories);
  return Superclass => mixin(accessResources)(class extends Superclass {});
}

/**
 * Simplified mixin definition. Enough for our use case.
 * See: http://raganwald.com/2015/06/17/functional-mixins.html
 *
 * @param {Object} behaviour - Shared behaviour object literal
 * @param {Boolean} proto - Indicates if mixin should be applied to prototype
 * @return {function(target)}
 */
function mixin(behaviour, proto = true) {
  return target => {
    for (let property of Reflect.ownKeys(behaviour)) {
      Object.defineProperty(proto ? target.prototype : target, property, { value: behaviour[property] });
    }
    return target;
  };
}

const path = '/products';
const ProductResources = mixinResources([Property, Action]);

/**
 * Represents a Product entity object.
 *
 * @extends Entity
 */
class Product extends ProductResources(Entity) {
  /**
   * Return simple resource factory for Products.
   *
   * @static
   * @return {{product: Function}}
   */
  static resourceFactory() {
    return {
      product: Resource.factoryFor(Product, path, ProductResources)
    };
  }
}

// import Location from './Location'
const path$3 = '/thngs';
const ThngResources = mixinResources([Property, Action
// Location
]);

/**
 * Represents a Thng entity object.
 *
 * @extends Entity
 */
class Thng extends ThngResources(Entity) {
  /**
   * Return simple resource factory for Thngs.
   *
   * @static
   * @return {{product: Function}}
   */
  static resourceFactory() {
    return {
      thng: Resource.factoryFor(Thng, path$3, ThngResources)
    };
  }
}

const path$4 = '/collections';
const CollectionResources = mixinResources([Thng, Action
// Collection // Read explanation below.
]);

/**
 * Represents a Collection entity object. Collection has nested Collections
 * sub-resources. The workaround for the circular dependency is to only add
 * the Collection resource mixin after the class definition. This is different
 * than baking it in the parent Class Expression mixin
 * (i.e. CollectionResources) as the method is attached to the Collection
 * prototype, rather than the extended Entity class. Though, given the JS
 * prototype chain, there is no difference for the end user.
 *
 * @extends Entity
 */
class Collection extends CollectionResources(Entity) {
  /**
   * Return simple resource factory for Collections.
   *
   * @static
   * @return {{collection: Function}}
   */
  static resourceFactory() {
    return {
      collection(id) {
        // Explicitly add Collection resource mixin to nested resource.
        return Object.assign(Resource.factoryFor(Collection, path$4, CollectionResources).call(this, id), Collection.resourceFactory());
      }
    };
  }
}

// Explicitly add Collection resource mixin to Collection.
mixin(Collection.resourceFactory())(Collection);

const path$5 = '/actions';

/**
 * Represents an ActionType entity. Action types endpoint it weird as it
 * overlaps with the Actions (/actions), so there is a normalization necessary
 * on the read method.
 *
 * @extends Entity
 */
class ActionType extends Entity {
  /**
   * Return overridden resource factory for ActionsTypes. Read method needs to
   * use a filter as there is no single action type resource endpoint.
   *
   * @static
   * @return {{actionType: Function}}
   */
  static resourceFactory() {
    return {
      actionType(id) {
        return Object.assign(Resource.factoryFor(ActionType, path$5).call(this, id), {
          read(...args) {
            return readActionType.call(this, id, ...args);
          }
        });
      }
    };
  }
}

/**
 * Normalize arguments and response on single read request.
 *
 * @param {String} id - Action type ID
 * @param {*} args - Arguments passed to .read method
 * @return {Promise}
 */
function readActionType(id, ...args) {
  if (!id) {
    return Resource.prototype.read.call(this, ...args);
  } else {
    const normalizedArgs = normalizeArguments$2(id)(...args);
    return new Promise((resolve, reject) => {
      Resource.prototype.read.call(this, ...normalizedArgs).then(actionTypes => {
        if (!actionTypes.length) {
          // Fake 404
          reject({
            status: 404,
            errors: ['The action type was not found.']
          });
        }
        resolve(actionTypes[0]);
      });
    });
  }
}

/**
 * Curry normalizeArguments with action type id. Converts single resource path
 * (e.g. /actions/_custom) into plural with filter
 * (e.g. /actions?filter=name=_custom).
 *
 * @param {String} id - ID of action type
 * @return {Function} Normalize arguments transformer.
 */
function normalizeArguments$2(id) {
  return (...args) => {
    let options;
    let firstArg = args[0];

    if (isUndefined(firstArg) || isFunction(firstArg)) {
      options = {};
      args.unshift(options);
    } else {
      options = firstArg;
    }

    options.url = path$5;
    options.params = Object.assign({ filter: { name: decodeURIComponent(id) } }, options.params);

    return args;
  };
}

const path$9 = '/status';

class Status extends Entity {
  static resourceFactory() {
    return {
      status() {
        if (isString(arguments[0])) {
          throw new TypeError('There is no single resource for Status');
        }

        return Resource.factoryFor(Status, path$9).call(this);
      }
    };
  }
}

const path$8 = '/reactor/script';
const ReactorScriptResources = mixinResources([Status]);

/**
 * Represents a ReactorScript entity object.
 *
 * @extends Entity
 */
class ReactorScript extends ReactorScriptResources(Entity) {
  static resourceFactory() {
    return {
      reactorScript() {
        // Reactor scripts don't have single resource endpoint (e.g.: /scripts/:id)
        if (isString(arguments[0])) {
          throw new TypeError('There is no single resource for Reactor Scripts');
        }

        return Resource.factoryFor(ReactorScript, path$8, ReactorScriptResources).call(this);
      }
    };
  }
}

const path$10 = '/reactor/schedules';

/**
 * Represents a ReactorSchedule entity object.
 *
 * @extends Entity
 */
class ReactorSchedule extends Entity {
  static resourceFactory() {
    return {
      reactorSchedule(id) {
        const appPath = this instanceof Scope ? this[symbols.path] : '';

        return Resource.factoryFor(ReactorSchedule, appPath + path$10).call(this, id);
      }
    };
  }
}

const path$11 = '/reactor/logs';

/**
 * Represents a ReactorLog entity object.
 *
 * @extends Entity
 */
class ReactorLog extends Entity {
  static resourceFactory() {
    return {
      reactorLog(id) {
        // Reactor logs don't have single resource endpoint (e.g.: /logs/:id)
        if (isString(arguments[0])) {
          throw new TypeError('There is no single resource for Reactor Logs');
        }

        const appPath = this instanceof Scope ? this[symbols.path] : '';

        return Object.assign(Resource.factoryFor(ReactorLog, appPath + path$11).call(this, id), {
          create(...args) {
            return createLogs.call(this, ...args);
          }
        });
      }
    };
  }
}

/**
 * Use bulk endpoint when creating array of logs.
 *
 * @param {Object} data - Log payload.
 * @param {Array} rest - Rest of arguments.
 * @return {Promise}
 */
function createLogs(data, ...rest) {
  if (Array.isArray(data)) {
    let [options] = rest;
    if (isUndefined(options) || isFunction(options)) {
      options = {};
      rest.unshift(options);
    }
    options.url = `${this.path}/bulk`;
  }

  return Resource.prototype.create.call(this, data, ...rest);
}

const path$7 = '/applications';
const ApplicationResources = mixinResources([ReactorScript, ReactorSchedule, ReactorLog]);

/**
 * Represents an Application entity.
 *
 * @extends Entity
 */
class Application extends ApplicationResources(Entity) {
  /**
   * Return simple resource factory for Applications.
   *
   * @static
   * @return {{application: Function}}
   */
  static resourceFactory() {
    return {
      application(id) {
        // Only allowed on Entities and Resources.
        if (this instanceof Scope) {
          throw new Error('Application is not a top-level resource.');
        }

        return Resource.factoryFor(Application, path$7, ApplicationResources).call(this, id);
      }
    };
  }
}

const path$6 = '/projects';
const ProjectResources = mixinResources([Application]);

/**
 * Represents a Project entity object.
 *
 * @extends Entity
 */
class Project extends ProjectResources(Entity) {
  /**
   * Return simple resource factory for Projects.
   *
   * @static
   * @return {{project: Function}}
   */
  static resourceFactory() {
    return {
      project: Resource.factoryFor(Project, path$6, ProjectResources)
    };
  }
}

const path$13 = '/permissions';

/**
 * Represents a Permission entity.
 *
 * @extends Entity
 */
class Permission extends Entity {
  /**
   * Return simple resource factory for Permissions.
   *
   * @static
   * @return {{permission: Function}}
   */
  static resourceFactory() {
    return {
      permission() {
        // Permissions don't have single resource endpoint (e.g.: /permissions/:id)
        if (isString(arguments[0])) {
          throw new TypeError('There is no single resource for Permissions');
        }

        // Only allowed on Entities and Resources.
        if (this instanceof Scope) {
          throw new Error('Permission is not a top-level resource.');
        }

        return Resource.factoryFor(Permission, path$13).call(this);
      }
    };
  }
}

const path$12 = '/roles';
const RoleResources = mixinResources([Permission]);

/**
 * Represents a Role entity object.
 *
 * @extends Entity
 */
class Role extends RoleResources(Entity) {
  /**
   * Return simple resource factory for Roles.
   *
   * @static
   * @return {{role: Function}}
   */
  static resourceFactory() {
    return {
      role: Resource.factoryFor(Role, path$12, RoleResources)
    };
  }
}

const path$14 = '/users';

/**
 * Represents a User entity object.
 *
 * @extends Entity
 */
class User extends Entity {
  /**
   * Return simple resource factory for AppUsers.
   *
   * @static
   * @return {{appUser: Function}}
   */
  static resourceFactory() {
    return {
      user: Resource.factoryFor(User, path$14)
    };
  }
}

const path$16 = '/tasks';

/**
 * Represents a Task entity.
 *
 * @extends Entity
 */
class Task extends Entity {
  /**
   * Return simple resource factory for Tasks.
   *
   * @static
   * @return {{task: Function}}
   */
  static resourceFactory() {
    return {
      task(id) {
        // Only allowed on Entities and Resources.
        if (this instanceof Scope) {
          throw new Error('Permission is not a top-level resource.');
        }

        return Resource.factoryFor(Task, path$16).call(this, id);
      }
    };
  }
}

const path$15 = '/batches';
const BatchResources = mixinResources([Task]);

/**
 * Represents a Batch entity object.
 *
 * @extends Entity
 */
class Batch extends BatchResources(Entity) {
  /**
   * Return simple resource factory for Batches.
   *
   * @static
   * @return {{batch: Function}}
   */
  static resourceFactory() {
    return {
      batch: Resource.factoryFor(Batch, path$15, BatchResources)
    };
  }
}

const path$17 = '/places';

/**
 * Represents a Place entity object.
 *
 * @extends Entity
 */
class Place extends Entity {
  /**
   * Return simple resource factory for Places.
   *
   * @static
   * @return {{place: Function}}
   */
  static resourceFactory() {
    return {
      place: Resource.factoryFor(Place, path$17)
    };
  }
}

const path$18 = '/files';

/**
 * Represents a File entity object.
 *
 * @extends Entity
 */
class File extends Entity {
  /**
   * Return simple resource factory for Files.
   *
   * @static
   * @return {{file: Function}}
   */
  static resourceFactory() {
    // TODO enable Node.js File streams and multipart/form-data files/blobs

    return {
      file: Resource.factoryFor(File, path$18)
    };
  }
}

/**
 * Mixin with all the top-level Operator resources.
 *
 * @mixin
 */
const OperatorAccess = mixinResources([Product, // CRUD
Thng, // CRUD
Collection, // CRUD
Action, // CR
ActionType, // CRUD
Project, // CRUD
Role, // CRUD
User, // R
Batch, // CRUD
Place, // CRUD
File // CRUD
]);

/**
 * Operator is the Scope with highest permissions that can manage the account
 * resources. Should be used with caution in server-side code.
 *
 * @extends Scope
 * @mixes OperatorAccess
 */
class Operator extends OperatorAccess(Scope) {
  /**
   * Creates an instance of Operator.
   *
   * @param {string} apiKey - API Key of scope
   * @param {Object} [data={}] - Optional operator data
   */
  constructor(apiKey, data = {}) {
    super(apiKey, data);

    this[symbols.init] = this[symbols.init].then(access => {
      this.id = access.actor.id;
      this[symbols.path] = this._getPath();
    }).then(this.read.bind(this)).catch(() => {
      throw new Error('There is no operator with this API Key');
    });
  }

  // PRIVATE

  /**
   * Return operator endpoint.
   *
   * @return {string}
   */
  _getPath() {
    return `/operators/${this.id}`;
  }
}

/**
 * Mixin with all the top-level User resources.
 *
 * @mixin
 */
const UserAccess = mixinResources([Product, // CRU
Thng, // CRU
Collection, // CRU
Action, // CR
ActionType, // R
Role, // R
Place // R
]);

/**
 * User is the Scope that represents an application user. It is usually
 * retrieved by authenticating a user in an app, but can also be instantiated
 * explicitly if API Key and details are known (e.g. stored in localStorage).
 *
 * @extends Scope
 * @mixes UserAccess
 */
class User$1 extends UserAccess(Scope) {
  /**
   * Creates an instance of User.
   *
   * @param {string} apiKey - API Key of scope
   * @param {Object} [data={}] - Optional user data
   */
  constructor(apiKey, data = {}) {
    super(apiKey, data);

    this[symbols.init] = this[symbols.init].then(access => {
      this.id = access.actor.id;
      this[symbols.path] = this._getPath();
    }).then(this.read.bind(this)).catch(() => {
      throw new Error('There is no user with this API Key');
    });
  }

  /**
   * Log current user out of EVRYTHNG platform. I.e. API Key is not longer
   * valid.
   *
   * @param {Function} callback - Error first callback
   * @returns {Promise.<void>}
   */
  async logout(callback) {
    try {
      await this._invalidateUser();
      if (callback) callback(null);
    } catch (err) {
      if (callback) callback(err);
      throw err;
    }
  }

  // PRIVATE

  /**
   * Return user endpoint.
   *
   * @return {string}
   */
  _getPath() {
    return `/users/${this.id}`;
  }

  /**
   * Request to invalidate API Key.
   *
   * @returns {Promise}
   * @private
   */
  _invalidateUser() {
    return api({
      url: '/auth/all/logout',
      method: 'post',
      apiKey: this.apiKey
    });
  }
}

const path$19 = '/auth/evrythng/users';

/**
 * Represents an AppUser access entry object. In the API there is a distinction
 * and different actions available for AppUser access. I.e. they can be validated.
 *
 * @extends Entity
 */
class UserAccess$1 extends Entity {
  /**
   * Return resource factory for AppUsers access.
   *
   * @static
   * @return {{appUser: Function}}
   */
  static resourceFactory() {
    return {
      userAccess(id) {
        return Object.assign(Resource.factoryFor(UserAccess$1, path$19).call(this, id), {
          create(...args) {
            return createAppUser.call(this, ...args);
          },
          validate(...args) {
            return validate.call(this, ...args);
          }
        });
      }
    };
  }

  /**
   * Convert evrythngUser id into standard ID field.
   *
   * @param {Resource} resource - Resource owner of this entity.
   * @param {Object} [body] Optional entity data
   */
  constructor(resource, body = {}) {
    const copy = Object.assign({}, body);
    if (copy.evrythngUser) {
      copy.id = copy.evrythngUser;
      Reflect.deleteProperty(copy, 'evrythngUser');
    }
    super(resource, copy);
  }

  /**
   * Validate user access using own activation code.
   *
   * @return {Promise}
   */
  validate() {
    return validate.call(this, this.activationCode);
  }
}

/**
 * Create anonymous app user if anonymous property defined.
 *
 * @param {Array} args - Arguments array.
 * @return {Promise}
 */
function createAppUser(...args) {
  const [data] = args;
  if (data && data.anonymous) {
    return createAnonymousUser.call(this, ...args);
  } else {
    return Resource.prototype.create.call(this, ...args);
  }
}

/**
 * Send a request to the validate endpoint with the given activation code.
 *
 * @param {String} activationCode - Activation code provided on creation.
 * @return {Promise}
 */
function validate(activationCode) {
  if (!activationCode || !isString(activationCode)) {
    throw new Error('Activation code must be a string.');
  }

  if (this.type === 'anonymous') {
    throw new Error("Anonymous users can't be validated.");
  }

  let scope = this.scope;
  let path = this.path;

  // If called from the entity, the scope is the resource's scope.
  if (this instanceof Entity) {
    scope = this[symbols.resource].scope;
    path = `${this[symbols.resource].path}/${this.id}`;
  }

  // Activate  user.
  return api({
    url: `${path}/validate`,
    method: 'post',
    apiKey: scope.apiKey,
    data: { activationCode }
  });
}

/**
 * Create anonymous user in API and return new scope for that user.
 *
 * @return {Promise}
 */
function createAnonymousUser() {
  return api({
    url: this.path,
    method: 'post',
    params: {
      anonymous: true // must be set to create anonymous user
    },
    data: {},
    apiKey: this.scope.apiKey
  }).then(createUserScope.bind(this));
}

// TODO Create User Scope
function createUserScope(access) {
  // return new User({
  //   id: access.evrythngUser,
  //   apiKey: access.evrythngApiKey,
  //   type: 'anonymous'
  // })
}

/**
 * E-mail and password used to create a user into the platform.
 *
 * @typedef {Object} AccessCredentials
 * @param {string} email - E-mail used on registration
 * @param {string} password - Password defined on registration
 */

/**
 * Mixin with all the top-level Application resources.
 *
 * @mixin
 */
const ApplicationAccess = mixinResources([Product, // R
Action, // C scans
UserAccess$1, // C
Place // R
]);

/**
 * Application is the Scope with the least permissions. It is meant to be used
 * to create and authenticate application users.
 *
 * @extends Scope
 * @mixes ApplicationAccess
 */
class Application$1 extends ApplicationAccess(Scope) {
  /**
   * Creates an instance of Application.
   *
   * @param {string} apiKey - API Key of scope
   * @param {Object} [data={}] - Optional application data
   */
  constructor(apiKey, data = {}) {
    super(apiKey, data);

    this[symbols.init] = this[symbols.init].then(access => {
      this.id = access.actor.id;
      this.project = access.project;
      this[symbols.path] = this._getPath();
    }).then(this.read.bind(this)).catch(() => {
      throw new Error('There is no application with this API Key');
    });
  }

  /**
   * Login user using EVRYTHNG credentials and create User scope on success.
   *
   * @param {AccessCredentials} credentials - User login credentials
   * @param {Function} callback - Error first callback
   * @returns {Promise.<User>} - Authorized User scope
   */
  async login(credentials, callback) {
    try {
      const user = await this._authenticateUser(credentials);
      const userScope = new User$1(user.access.apiKey, user);
      if (callback) callback(null, userScope);
      return userScope;
    } catch (err) {
      if (callback) callback(err);
      throw err;
    }
  }

  // PRIVATE

  /**
   * Return application endpoint, nested within projects.
   *
   * @returns {string}
   * @private
   */
  _getPath() {
    return `/projects/${this.project}/applications/${this.id}`;
  }

  /**
   * Validate user credentials.
   *
   * @param {AccessCredentials} credentials - User login credentials
   * @returns {Promise.<Object>} - User details with access
   * @private
   */
  _authenticateUser(credentials) {
    if (!credentials || !isPlainObject(credentials)) {
      throw new TypeError('Credentials are missing.');
    }

    return api({
      url: '/users/login',
      method: 'post',
      data: credentials,
      apiKey: this.apiKey
    });
  }
}

/**
 * E-mail and password used to create a user into the platform.
 *
 * @typedef {Object} AccessCredentials
 * @param {string} email - E-mail used on registration
 * @param {string} password - Password defined on registration
 */

/**
 * Mixin with all the top-level Application resources.
 *
 * @mixin
 */
const ApplicationAccess$1 = mixinResources([Thng, // CRUD
Collection, // CRUD
ActionType, // CR
User, // R
ReactorSchedule, // C
ReactorLog // C

// From Application:
// Product        // CRUD
// Place          // CRUD
// Action         // CR
]);

/**
 * Application is the Scope with the least permissions. It is meant to be used
 * to create and authenticate application users.
 *
 * @extends Scope
 * @mixes ApplicationAccess
 */
class TrustedApplication extends ApplicationAccess$1(Application$1) {
  /**
   * Creates an instance of Application.
   *
   * @param {string} apiKey - API Key of scope
   * @param {Object} [data={}] - Optional application data
   */
  constructor(apiKey, data = {}) {
    super(apiKey, data);

    this[symbols.init] = this[symbols.init].then(access => {
      this.id = access.actor.id;
      this.project = access.project;
      this[symbols.path] = this._getPath();
    }).then(this.read.bind(this)).catch(() => {
      throw new Error('There is no application with this API Key');
    });
  }

  /**
   * Login user using EVRYTHNG credentials and create User scope on success.
   *
   * @param {AccessCredentials} credentials - User login credentials
   * @param {Function} callback - Error first callback
   * @returns {Promise.<User>} - Authorized User scope
   */
  async login(credentials, callback) {
    try {
      const user = await this._authenticateUser(credentials);
      const userScope = new User(user.access.apiKey, user);
      if (callback) callback(null, userScope);
      return userScope;
    } catch (err) {
      if (callback) callback(err);
      throw err;
    }
  }

  // PRIVATE

  /**
   * Return application endpoint, nested within projects.
   *
   * @returns {string}
   * @private
   */
  _getPath() {
    return `/projects/${this.project}/applications/${this.id}`;
  }

  /**
   * Validate user credentials.
   *
   * @param {AccessCredentials} credentials - User login credentials
   * @returns {Promise.<Object>} - User details with access
   * @private
   */
  _authenticateUser(credentials) {
    if (!credentials || !isPlainObject(credentials)) {
      throw new TypeError('Credentials are missing.');
    }

    return api({
      url: '/users/login',
      method: 'post',
      data: credentials,
      apiKey: this.apiKey
    });
  }
}

// import Location from '../entity/Location'
/**
 * Mixin with all the top-level Application resources.
 *
 * @mixin
 */
const DeviceAccess = mixinResources([Property, // CRUD
Action // CRUD
// Location           // CRUD
]);

/**
 * Device is the Scope that represents an active/smart Thng. It can only
 * essentially update itself and its nested resources (e.g. Property, Location,
 * Action).
 *
 * @extends Scope
 */
class Device extends DeviceAccess(Scope) {
  /**
   * Creates an instance of Device.
   *
   * @param {string} apiKey - API Key of scope
   * @param {Object} [data={}] - Optional device data
   */
  constructor(apiKey, data = {}) {
    super(apiKey, data);

    this[symbols.init] = this[symbols.init].catch(() => {
      throw new Error('There is no thng with this API Key');
    }).then(access => {
      this.id = access.actor.id;
      this[symbols.path] = this._getPath();
    }).then(this.read.bind(this));
  }

  // PRIVATE

  /**
   * Return device thng endpoint.
   *
   * @return {string}
   */
  _getPath() {
    return `/thngs/${this.id}`;
  }
}

const path$20 = '/locations';

/**
 * Represents a Location entity. Locations are always nested and required
 * to be constructed on Resource/Entity objects (not top level Scopes).
 *
 * @extends Entity
 */
class Location extends Entity {
  /**
   * Return overridden resource factory for Locations. Locations are
   * sub-resources of Thngs and are not allowed on top level Scope classes.
   * This factory also override the default Resource's update method to allow
   * empty invocations that send the current browser's location as the payload.
   *
   * @static
   * @return {{property: Function}}
   */
  static resourceFactory() {
    return {
      location() {
        // Locations don't have single resource endpoint (e.g.: /locations/:id)
        if (isString(arguments[0])) {
          throw new TypeError('There is no single resource for Locations');
        }

        const thngPath = this instanceof Scope ? this[symbols.path] : '';

        // Creates and returns Resource of type Location.
        // Override property resource update to allow empty updates.
        // See `updateLocation()`.
        return Object.assign(Resource.factoryFor(Location, thngPath + path$20).call(this), {
          update(...args) {
            return updateLocation.call(this, ...args);
          }
        });
      }
    };
  }
}

/**
 * Update locations given an array of new locations. If none is provided
 * it tries to use the current browser location for the update.
 *
 * @param {*} args - List of locations or nothing
 * @return {Promise}
 */
function updateLocation(...args) {
  let [data, ...rest] = normalizeArguments$3(...args);
  const baseUpdate = Resource.prototype.update.bind(this);
  const updatedArgs = () => [data, ...rest];

  if (useGeolocation$1(data)) {
    return getCurrentPosition().then(position => {
      data[0] = fillLocation(data[0], position);
      return baseUpdate(...updatedArgs());
    }).catch(err => {
      console.info(`Unable to get position: ${err}`);
      return baseUpdate(...updatedArgs());
    });
  } else {
    return baseUpdate(...updatedArgs());
  }
}

/**
 * Convert simple object to array. Add an empty location array if none is
 * provided.
 *
 * @param {*} args - Arguments array.
 * @return {Array} - Same input format, with first data param updated.
 * @example
 *
 * thng.location().update()
 * thng.location().update([<Location>])
 */
function normalizeArguments$3(...args) {
  let firstArg = args[0];
  if (isPlainObject(firstArg)) {
    args[0] = [firstArg];
  } else if (isUndefined(firstArg) || isFunction(firstArg)) {
    args.unshift([]);
  }
  return args;
}

/**
 * Use geolocation if no location was provided and global settings allow to use
 * geolocation.
 *
 * @param {Array} data - Data passed to the update (list of locations)
 * @return {boolean}
 */
function useGeolocation$1(data) {
  return data.length === 0 && settings.geolocation;
}

/**
 * Fill location coordinates from browser's Geolocation API.
 *
 * @param {Object} data - Location data
 * @param {Object} position - Geolocation API position coordinates
 * @return {Object} - New location data
 */
function fillLocation(data, position) {
  const location = Object.assign({}, data);
  location.position = {
    type: 'Point',
    coordinates: [position.coords.longitude, position.coords.latitude]
  };
  return location;
}

var entities = {
  Product,
  Thng,
  Collection,
  Property,
  Action,
  ActionType,
  Application,
  User,
  Batch,
  Location,
  Permission,
  Project,
  Role,
  Task
};

// Globals

export { settings, setup, api, Operator, Application$1 as Application, TrustedApplication, User$1 as User, Device, entities as Entity, symbols as Symbol, Resource as _Resource, Entity as _Entity, Scope as _Scope };
//# sourceMappingURL=evrythng.es.js.map
