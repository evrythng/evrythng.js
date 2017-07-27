/**
 * EVRYTHNG.JS v5.0.0-pre.4
 * (c) 2012-2017 EVRYTHNG Ltd. London / New York / San Francisco.
 * Released under the Apache Software License, Version 2.0.
 * For all details and usage:
 * https://github.com/evrythng/evrythng.js
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('isomorphic-fetch')) :
	typeof define === 'function' && define.amd ? define(['exports', 'isomorphic-fetch'], factory) :
	(factory((global.EVT = global.EVT || {})));
}(this, (function (exports) { 'use strict';

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
var defaultSettings = {
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
};var settings = Object.assign({}, defaultSettings);

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



var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};





var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();











var toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var SPECIALS = ['&', '|', '!', '>', '<', '=', '~', '(', ')', ','];
var SPECIALS_REGEXP = new RegExp('[' + SPECIALS.join('\\') + ']', 'g');
var SPECIALS_ESCAPE = '\\$&';

/**
 * Build url safe parameter string if an object provided.
 *
 * @export
 * @param {(Object | string)} [params] key-value object or final query string
 * @param {boolean} [useEncoding] whether to skip encoding
 * @returns {string}
 */
function buildParams() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var useEncoding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

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
  var encode = uriEncoder(useEncoding);
  return function (_ref) {
    var _ref2 = slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    return encode(key) + '=' + encode(buildParams(value));
  };
}

/**
 * Returns function that encodes values using encodeURIComponent.
 *
 * @param {boolean} useEncoding
 * @returns {Function}
 */
function uriEncoder(useEncoding) {
  return function (value) {
    return useEncoding ? encodeURIComponent(value) : escapeSpecials(value);
  };
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
  var url = '' + options.apiUrl + options.url;

  if (options.params) {
    url += '?' + buildParams(options.params);
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
  return function (response) {
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
  return function (err) {
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
function api() {
  var customOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var callback = arguments[1];

  var initialOptions = mergeInitialOptions(customOptions);

  return applyRequestInterceptors(initialOptions).then(function (options) {
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
  var options = Object.assign({ method: 'get', url: '' }, settings, customOptions, { headers: Object.assign({}, settings.headers, customOptions.headers) });

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
  var cancelled = false;
  function cancel() {
    cancelled = true;
  }

  var intercepted = Promise.resolve(options);

  if (Array.isArray(options.interceptors)) {
    options.interceptors.filter(function (interceptor) {
      return isFunction(interceptor.request);
    }).forEach(function (interceptor) {
      // Chain promises. If interceptor returns undefined, use previous options
      intercepted = intercepted.then(function (prevOptions) {
        if (cancelled) return prevOptions;
        return interceptor.request(prevOptions, cancel) || prevOptions;
      });
    });
  }

  return intercepted.then(function (finalOptions) {
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
  var req = fetch(buildUrl(options), options);
  if (!options.timeout) {
    return req;
  } else {
    return Promise.race([req, new Promise(function (resolve, reject) {
      setTimeout(function () {
        return reject('Request timeout');
      }, options.timeout);
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
  return function (response) {
    var res = options.fullResponse ? Promise.resolve(response) : response.status === 204 ? Promise.resolve() : response.json();

    return res.then(function (data) {
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
  return function (response) {
    var intercepted = Promise.resolve(response);

    if (Array.isArray(options.interceptors)) {
      options.interceptors.filter(function (interceptor) {
        return isFunction(interceptor.response);
      }).forEach(function (interceptor) {
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

var Scope = function () {
  /**
   * Creates an instance of Scope.
   *
   * @param {string} apiKey API Key of scope
   * @param {Object} [body={}] Optional scope data
   */
  function Scope(apiKey) {
    var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, Scope);

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


  createClass(Scope, [{
    key: 'read',
    value: function read() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var opts = Object.assign(options, {
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

  }, {
    key: 'update',
    value: function update(data) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var opts = Object.assign(options, {
        method: 'put',
        url: this[symbols.path],
        apiKey: this.apiKey,
        data: data
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

  }, {
    key: '_request',
    value: function _request(options) {
      var _this = this;

      return api(options).then(function (data) {
        return Object.assign(_this, data);
      });
    }
  }]);
  return Scope;
}();

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = 'object' === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof global.process === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof commonjsGlobal === "object" ? commonjsGlobal :
  typeof window === "object" ? window :
  typeof self === "object" ? self : commonjsGlobal
);
});

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g =
  typeof commonjsGlobal === "object" ? commonjsGlobal :
  typeof window === "object" ? window :
  typeof self === "object" ? self : commonjsGlobal;

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

var runtimeModule = runtime;

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}

var index = runtimeModule;

// Parse Link headers for API pagination.
// https://gist.github.com/niallo/3109252
function parseLinkHeader(header) {
  var links = {};

  if (header && header.length) {
    // Split parts by comma
    var parts = header.split(',');
    // Parse each part into a named link
    for (var i = 0; i < parts.length; i++) {
      var section = parts[i].split(';');
      var url = section[0].replace(/<(.*)>/, '$1').trim();
      var name = section[1].replace(/rel="(.*)"/, '$1').trim();
      links[name] = url;
    }
  }

  return links;
}

/**
 * A Resource is the base class that implements the CRUD methods behavior.
 * All resource requests are scoped (i.e. they use the scope's API Key).
 *
 * Every resource operation tries to serialize/deserialize the type of object
 * corresponding to the resource (i.e. when creating a Thng, the developer gets
 * a Thng entity back, with nested methods).
 */

var Resource = function () {
  createClass(Resource, null, [{
    key: 'factoryFor',

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
    value: function factoryFor(type) {
      var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var MixinNestedResources = arguments[2];

      if (!type) {
        throw new Error('Entity type is necessary for resource factory.');
      }

      // No "this" binding with arrow function! This needs to run in the context
      // where it is mixed in / attached.
      return function (id) {
        // Allowed on Scopes, Resources and Entities.
        var parentPath = void 0,
            parentScope = void 0,
            newPath = void 0;

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
          newPath += '/' + encodeURIComponent(id);
        }

        var XResource = MixinNestedResources ? MixinNestedResources(Resource) : Resource;
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

  }]);

  function Resource(scope, path, type) {
    classCallCheck(this, Resource);

    if (!(scope && scope instanceof Scope)) {
      throw new TypeError('Scope should inherit from Scope (e.g. EVT.App).');
    }

    if (!isString(path)) {
      throw new TypeError('Resource must have a String path.');
    }

    // Setup scope for each of the subsequent calls.
    this.scope = scope;

    // Setup path and allow to omit leading '/'.
    this.path = '' + (path[0] !== '/' ? '/' : '') + path;

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


  createClass(Resource, [{
    key: 'serialize',
    value: function serialize() {
      var entity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

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

  }, {
    key: 'deserialize',
    value: function deserialize(response) {
      var _this = this;

      if (response && this.type) {
        if (Array.isArray(response)) {
          return response.map(this.deserialize.bind(this));
        }

        if (response.body) {
          // Full response, add deserialize method to deserialize the Response's
          // json body
          response.deserialize = function () {
            return response.json().then(_this.deserialize.bind(_this));
          };
        } else {
          // JSON response, base case.
          // Create new entity with updated resource derived from current.
          var newPath = this.path;

          // Expand resource path with ID of entity.
          if (response.id && newPath.indexOf(response.id) === -1) {
            newPath += '/' + response.id;
          }

          var newResource = new Resource(this.scope, newPath, this.type);
          var EntityType = this.type;
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

  }, {
    key: 'create',
    value: function create(body, options, callback) {
      if (!body || isFunction(body)) {
        throw new TypeError('Create method must have payload.');
      }

      return this._request({
        url: this.path,
        body: body,
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

  }, {
    key: 'read',
    value: function read(options, callback) {
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

  }, {
    key: 'update',
    value: function update(body, options, callback) {
      if (!body || isFunction(body)) {
        throw new TypeError('Update method must have payload.');
      }

      return this._request({
        url: this.path,
        body: body,
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

  }, {
    key: 'delete',
    value: function _delete(options, callback) {
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

  }, {
    key: 'pages',
    value: function () {
      var _ref = asyncGenerator.wrap(index.mark(function _callee() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var fullResponse, response;
        return index.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                fullResponse = options.fullResponse;
                response = void 0;

                // Read first 'page' with user-defined options.

                _context.next = 4;
                return asyncGenerator.await(this._linkRequest({ url: this.path }, fullResponse, options));

              case 4:
                response = _context.sent;
                _context.next = 7;
                return response.result;

              case 7:
                if (!response.next) {
                  _context.next = 15;
                  break;
                }

                _context.next = 10;
                return asyncGenerator.await(this._linkRequest({ apiUrl: response.next }, fullResponse));

              case 10:
                response = _context.sent;
                _context.next = 13;
                return response.result;

              case 13:
                _context.next = 7;
                break;

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function pages() {
        return _ref.apply(this, arguments);
      }

      return pages;
    }()

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

  }, {
    key: '_request',
    value: function () {
      var _ref2 = asyncToGenerator(index.mark(function _callee2(requestOptions) {
        var userOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var callback = arguments[2];
        var options, response, deserialized;
        return index.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (isFunction(userOptions)) {
                  callback = userOptions;
                }

                // Merge options, priority to mandatory ones.
                options = Object.assign({}, userOptions, requestOptions, {
                  apiKey: this.scope.apiKey
                });

                // Serialize Entity into JSON payload.

                if (!options.body) {
                  _context2.next = 6;
                  break;
                }

                _context2.next = 5;
                return this.serialize(options.body);

              case 5:
                options.body = _context2.sent;

              case 6:
                _context2.prev = 6;
                _context2.next = 9;
                return api(options);

              case 9:
                response = _context2.sent;
                _context2.next = 12;
                return this.deserialize(response);

              case 12:
                deserialized = _context2.sent;
                return _context2.abrupt('return', success(callback)(deserialized));

              case 16:
                _context2.prev = 16;
                _context2.t0 = _context2['catch'](6);
                throw failure(callback)(_context2.t0);

              case 19:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[6, 16]]);
      }));

      function _request(_x5) {
        return _ref2.apply(this, arguments);
      }

      return _request;
    }()

    /**
     * Async request that parses the link header if any.
     *
     * @param {Settings} requestOptions - Mandatory request options
     * @param {Boolean} fullResponse - Wrap Response or not
     * @param {Settings} [userOptions] - Optional user options
     * @returns {Promise.<{result: Response|Array, next: string}>}
     * @private
     */

  }, {
    key: '_linkRequest',
    value: function () {
      var _ref3 = asyncToGenerator(index.mark(function _callee3(requestOptions, fullResponse) {
        var userOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var opts, response, linkHeader, next, result;
        return index.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                opts = Object.assign({ fullResponse: true }, requestOptions);
                _context3.next = 3;
                return this._request(opts, userOptions);

              case 3:
                response = _context3.sent;
                linkHeader = parseLinkHeader(response.headers.get('link'));
                next = linkHeader.next && decodeURIComponent(linkHeader.next);
                _context3.next = 8;
                return fullResponse ? response : response.json();

              case 8:
                result = _context3.sent;
                return _context3.abrupt('return', { result: result, next: next });

              case 10:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function _linkRequest(_x7, _x8) {
        return _ref3.apply(this, arguments);
      }

      return _linkRequest;
    }()
  }]);
  return Resource;
}();

/**
 * Entity is the base class for all types of entities in the EVRYTHNG API.
 * An Entity knows how to update and delete itself given that a resource is
 * provided.
 */

var Entity = function () {
  /**
   * Creates an new entity of given Resource. Optionally can be initialized
   * with pre-defined data.
   *
   * @param {Resource} resource - Resource owner of this entity.
   * @param {Object} [body] Optional entity data
   */
  function Entity(resource) {
    var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, Entity);

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


  createClass(Entity, [{
    key: 'json',
    value: function json() {
      return Object.entries(this).reduce(function (ret, _ref) {
        var _ref2 = slicedToArray(_ref, 2),
            k = _ref2[0],
            v = _ref2[1];

        return Object.assign(ret, defineProperty({}, k, v));
      }, {});
    }

    /**
     * Update itself by calling the update method of the owning resource and
     * passing the JSON representation of itself or the given body object.
     *
     * @param {Object} body - optional body, use self as default
     * @param {Function} callback - error-first callback
     * @returns {Promise.<Object>}
     */

  }, {
    key: 'update',
    value: function update() {
      var _this = this;

      var body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.json();
      var callback = arguments[1];

      return this[symbols.resource].update(body, callback).then(function (updated) {
        // Update self and keep chaining with API response.
        Object.assign(_this, updated);
        return updated;
      });
    }

    /**
     * Delete itself by calling the delete method of the owning resource.
     *
     * @param {Function} callback - error-first callback
     * @returns {Promise.<Object>}
     */

  }, {
    key: 'delete',
    value: function _delete(callback) {
      return this[symbols.resource].delete(callback);
    }
  }]);
  return Entity;
}();

var path$1 = '/properties';

/**
 * Represents a Property entity. Properties are always nested and required
 * to be constructed on Resource/Entity objects (not top level Scopes).
 *
 * @extends Entity
 */

var Property = function (_Entity) {
  inherits(Property, _Entity);

  function Property() {
    classCallCheck(this, Property);
    return possibleConstructorReturn(this, (Property.__proto__ || Object.getPrototypeOf(Property)).apply(this, arguments));
  }

  createClass(Property, null, [{
    key: 'resourceFactory',

    /**
     * Return overridden resource factory for Properties. Properties are
     * sub-resources of Thngs and Products and are not allowed on top level
     * Scope classes. This factory also override the default Resource's create
     * and update methods to accept and normalize different types of arguments.
     *
     * @static
     * @return {{property: Function}}
     */
    value: function resourceFactory() {
      return {
        property: function property(id) {
          var thngPath = this instanceof Scope ? this[symbols.path] : '';

          // Creates and returns Resource of type Property.
          // Override property resource create/update to allow custom value
          // params. See `normalizeArguments()`.
          return Object.assign(Resource.factoryFor(Property, thngPath + path$1).call(this, id), {
            create: function create() {
              var _Resource$prototype$c;

              return (_Resource$prototype$c = Resource.prototype.create).call.apply(_Resource$prototype$c, [this].concat(toConsumableArray(normalizeArguments.apply(undefined, arguments))));
            },
            update: function update() {
              var _Resource$prototype$u;

              return (_Resource$prototype$u = Resource.prototype.update).call.apply(_Resource$prototype$u, [this].concat(toConsumableArray(normalizeArguments.apply(undefined, arguments))));
            }
          });
        }
      };
    }
  }]);
  return Property;
}(Entity);

function normalizeArguments(data) {
  if (isString(data) || typeof data === 'number' || typeof data === 'boolean') {
    // Convert simple property values to API format.
    data = [{ value: data }];
  } else if (isPlainObject(data)) {
    if (data.hasOwnProperty('value')) {
      // Update single property using object notation.
      data = [data];
    } else {
      // Update multiple properties creating an object for each key-value pair.
      data = Object.entries(data).map(function (val) {
        return {
          key: val[0],
          value: val[1]
        };
      });
    }
  }

  for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    rest[_key - 1] = arguments[_key];
  }

  return [data].concat(rest);
}

/**
 * Get browser's current position from Geolocation API.
 *
 * @return {Promise} - Resolves with current position or rejects with failure
 * explanation.
 */
function getCurrentPosition() {
  return new Promise(function (resolve, reject) {
    if (typeof window !== 'undefined' && window.navigator.geolocation) {
      var geolocationOptions = {
        maximumAge: 0,
        timeout: 10000,
        enableHighAccuracy: true
      };

      window.navigator.geolocation.getCurrentPosition(resolve, function (err) {
        return reject(err.message);
      }, geolocationOptions);
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

var path$2 = '/actions/:type';

/**
 * Represents an Action entity.
 *
 * @extends Entity
 */

var Action = function (_Entity) {
  inherits(Action, _Entity);

  function Action() {
    classCallCheck(this, Action);
    return possibleConstructorReturn(this, (Action.__proto__ || Object.getPrototypeOf(Action)).apply(this, arguments));
  }

  createClass(Action, null, [{
    key: 'resourceFactory',

    /**
     * Return overridden resource factory for Actions. Actions require an
     * action type to be specified before the ID. The action creation is also
     * different from any other Resource, as it fetches the user location and
     * pre-populates the action payload with the Resource type.
     *
     * @static
     * @return {{action: Function}}
     */
    value: function resourceFactory() {
      return {
        action: function action(actionType, id) {
          if (!actionType) {
            throw new TypeError('Action type cannot be empty.');
          }

          if (!isString(actionType)) {
            throw new TypeError('Action type must be a name string');
          }

          var typePath = path$2.replace(':type', actionType);
          var thngPath = this instanceof Scope ? this[symbols.path] : '';
          var context = this;

          // Creates and returns Resource of type Action.
          // Override property resource create to allow custom value params and
          // fetch the user's geolocation. See `createAction()`.
          return Object.assign(Resource.factoryFor(Action, thngPath + typePath).call(this, id), {
            create: function create() {
              for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              return createAction.call.apply(createAction, [this, context, actionType].concat(args));
            }
          });
        }
      };
    }
  }]);
  return Action;
}(Entity);

function createAction(caller, actionType) {
  for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  var _normalizeArguments = normalizeArguments$1.apply(undefined, args),
      _normalizeArguments2 = toArray(_normalizeArguments),
      data = _normalizeArguments2[0],
      rest = _normalizeArguments2.slice(1);

  var _rest = slicedToArray(rest, 1),
      options = _rest[0];

  // Auto-fill action payload with resource type and entity id.


  data = Array.isArray(data) ? data.map(function (action) {
    return fillAction(action, caller, actionType);
  }) : data = fillAction(data, caller, actionType);

  var baseCreate = Resource.prototype.create.bind(this);
  var updatedArgs = function updatedArgs() {
    return [data].concat(toConsumableArray(rest));
  };

  if (useGeolocation(options)) {
    return getCurrentPosition().then(function (position) {
      data = fillActionLocation(data, position);
      return baseCreate.apply(undefined, toConsumableArray(updatedArgs()));
    }).catch(function (err) {
      console.info('Unable to get position: ' + err);
      return baseCreate.apply(undefined, toConsumableArray(updatedArgs()));
    });
  } else {
    return baseCreate.apply(undefined, toConsumableArray(updatedArgs()));
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
function normalizeArguments$1() {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  var firstArg = args[0];
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
  var action = Object.assign({}, data);

  // Fill type from Resource or pre-defined type.
  action.type = actionType !== 'all' && actionType || data.type || '';

  // Fill in entity ID if called on an entity.
  var entityIdentifier = getIdentifier(caller);
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
  var action = Object.assign({}, data);
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
  var resourceFactories = entities.map(function (e) {
    return e.resourceFactory();
  });
  var accessResources = Object.assign.apply(Object, [{}].concat(toConsumableArray(resourceFactories)));
  return function (Superclass) {
    return mixin(accessResources)(function (_Superclass) {
      inherits(_class, _Superclass);

      function _class() {
        classCallCheck(this, _class);
        return possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
      }

      return _class;
    }(Superclass));
  };
}

/**
 * Simplified mixin definition. Enough for our use case.
 * See: http://raganwald.com/2015/06/17/functional-mixins.html
 *
 * @param {Object} behaviour - Shared behaviour object literal
 * @param {Boolean} proto - Indicates if mixin should be applied to prototype
 * @return {function(target)}
 */
function mixin(behaviour) {
  var proto = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  return function (target) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Reflect.ownKeys(behaviour)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var property = _step.value;

        Object.defineProperty(proto ? target.prototype : target, property, { value: behaviour[property] });
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return target;
  };
}

var path = '/products';
var ProductResources = mixinResources([Property, Action]);

/**
 * Represents a Product entity object.
 *
 * @extends Entity
 */

var Product = function (_ProductResources) {
  inherits(Product, _ProductResources);

  function Product() {
    classCallCheck(this, Product);
    return possibleConstructorReturn(this, (Product.__proto__ || Object.getPrototypeOf(Product)).apply(this, arguments));
  }

  createClass(Product, null, [{
    key: 'resourceFactory',

    /**
     * Return simple resource factory for Products.
     *
     * @static
     * @return {{product: Function}}
     */
    value: function resourceFactory() {
      return {
        product: Resource.factoryFor(Product, path, ProductResources)
      };
    }
  }]);
  return Product;
}(ProductResources(Entity));

// import Location from './Location'
var path$3 = '/thngs';
var ThngResources = mixinResources([Property, Action
// Location
]);

/**
 * Represents a Thng entity object.
 *
 * @extends Entity
 */

var Thng = function (_ThngResources) {
  inherits(Thng, _ThngResources);

  function Thng() {
    classCallCheck(this, Thng);
    return possibleConstructorReturn(this, (Thng.__proto__ || Object.getPrototypeOf(Thng)).apply(this, arguments));
  }

  createClass(Thng, null, [{
    key: 'resourceFactory',

    /**
     * Return simple resource factory for Thngs.
     *
     * @static
     * @return {{product: Function}}
     */
    value: function resourceFactory() {
      return {
        thng: Resource.factoryFor(Thng, path$3, ThngResources)
      };
    }
  }]);
  return Thng;
}(ThngResources(Entity));

var path$4 = '/collections';
var CollectionResources = mixinResources([Thng, Action
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

var Collection = function (_CollectionResources) {
  inherits(Collection, _CollectionResources);

  function Collection() {
    classCallCheck(this, Collection);
    return possibleConstructorReturn(this, (Collection.__proto__ || Object.getPrototypeOf(Collection)).apply(this, arguments));
  }

  createClass(Collection, null, [{
    key: 'resourceFactory',

    /**
     * Return simple resource factory for Collections.
     *
     * @static
     * @return {{collection: Function}}
     */
    value: function resourceFactory() {
      return {
        collection: function collection(id) {
          // Explicitly add Collection resource mixin to nested resource.
          return Object.assign(Resource.factoryFor(Collection, path$4, CollectionResources).call(this, id), Collection.resourceFactory());
        }
      };
    }
  }]);
  return Collection;
}(CollectionResources(Entity));

mixin(Collection.resourceFactory())(Collection);

var path$5 = '/actions';

/**
 * Represents an ActionType entity. Action types endpoint it weird as it
 * overlaps with the Actions (/actions), so there is a normalization necessary
 * on the read method.
 *
 * @extends Entity
 */

var ActionType = function (_Entity) {
  inherits(ActionType, _Entity);

  function ActionType() {
    classCallCheck(this, ActionType);
    return possibleConstructorReturn(this, (ActionType.__proto__ || Object.getPrototypeOf(ActionType)).apply(this, arguments));
  }

  createClass(ActionType, null, [{
    key: 'resourceFactory',

    /**
     * Return overridden resource factory for ActionsTypes. Read method needs to
     * use a filter as there is no single action type resource endpoint.
     *
     * @static
     * @return {{actionType: Function}}
     */
    value: function resourceFactory() {
      return {
        actionType: function actionType(id) {
          return Object.assign(Resource.factoryFor(ActionType, path$5).call(this, id), {
            read: function read() {
              for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              return readActionType.call.apply(readActionType, [this, id].concat(args));
            }
          });
        }
      };
    }
  }]);
  return ActionType;
}(Entity);

function readActionType(id) {
  var _this2 = this;

  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  if (!id) {
    var _Resource$prototype$r;

    return (_Resource$prototype$r = Resource.prototype.read).call.apply(_Resource$prototype$r, [this].concat(args));
  } else {
    var normalizedArgs = normalizeArguments$2(id).apply(undefined, args);
    return new Promise(function (resolve, reject) {
      var _Resource$prototype$r2;

      (_Resource$prototype$r2 = Resource.prototype.read).call.apply(_Resource$prototype$r2, [_this2].concat(toConsumableArray(normalizedArgs))).then(function (actionTypes) {
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
  return function () {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    var options = void 0;
    var firstArg = args[0];

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

var path$9 = '/status';

var Status = function (_Entity) {
  inherits(Status, _Entity);

  function Status() {
    classCallCheck(this, Status);
    return possibleConstructorReturn(this, (Status.__proto__ || Object.getPrototypeOf(Status)).apply(this, arguments));
  }

  createClass(Status, null, [{
    key: 'resourceFactory',
    value: function resourceFactory() {
      return {
        status: function status() {
          if (isString(arguments[0])) {
            throw new TypeError('There is no single resource for Status');
          }

          return Resource.factoryFor(Status, path$9).call(this);
        }
      };
    }
  }]);
  return Status;
}(Entity);

var path$8 = '/reactor/script';
var ReactorScriptResources = mixinResources([Status]);

/**
 * Represents a ReactorScript entity object.
 *
 * @extends Entity
 */

var ReactorScript = function (_ReactorScriptResourc) {
  inherits(ReactorScript, _ReactorScriptResourc);

  function ReactorScript() {
    classCallCheck(this, ReactorScript);
    return possibleConstructorReturn(this, (ReactorScript.__proto__ || Object.getPrototypeOf(ReactorScript)).apply(this, arguments));
  }

  createClass(ReactorScript, null, [{
    key: 'resourceFactory',
    value: function resourceFactory() {
      return {
        reactorScript: function reactorScript() {
          // Reactor scripts don't have single resource endpoint (e.g.: /scripts/:id)
          if (isString(arguments[0])) {
            throw new TypeError('There is no single resource for Reactor Scripts');
          }

          return Resource.factoryFor(ReactorScript, path$8, ReactorScriptResources).call(this);
        }
      };
    }
  }]);
  return ReactorScript;
}(ReactorScriptResources(Entity));

var path$10 = '/reactor/schedules';

/**
 * Represents a ReactorSchedule entity object.
 *
 * @extends Entity
 */

var ReactorSchedule = function (_Entity) {
  inherits(ReactorSchedule, _Entity);

  function ReactorSchedule() {
    classCallCheck(this, ReactorSchedule);
    return possibleConstructorReturn(this, (ReactorSchedule.__proto__ || Object.getPrototypeOf(ReactorSchedule)).apply(this, arguments));
  }

  createClass(ReactorSchedule, null, [{
    key: 'resourceFactory',
    value: function resourceFactory() {
      return {
        reactorSchedule: function reactorSchedule(id) {
          var appPath = this instanceof Scope ? this[symbols.path] : '';

          return Resource.factoryFor(ReactorSchedule, appPath + path$10).call(this, id);
        }
      };
    }
  }]);
  return ReactorSchedule;
}(Entity);

var path$11 = '/reactor/logs';

/**
 * Represents a ReactorLog entity object.
 *
 * @extends Entity
 */

var ReactorLog = function (_Entity) {
  inherits(ReactorLog, _Entity);

  function ReactorLog() {
    classCallCheck(this, ReactorLog);
    return possibleConstructorReturn(this, (ReactorLog.__proto__ || Object.getPrototypeOf(ReactorLog)).apply(this, arguments));
  }

  createClass(ReactorLog, null, [{
    key: 'resourceFactory',
    value: function resourceFactory() {
      return {
        reactorLog: function reactorLog(id) {
          // Reactor logs don't have single resource endpoint (e.g.: /logs/:id)
          if (isString(arguments[0])) {
            throw new TypeError('There is no single resource for Reactor Logs');
          }

          var appPath = this instanceof Scope ? this[symbols.path] : '';

          return Object.assign(Resource.factoryFor(ReactorLog, appPath + path$11).call(this, id), {
            create: function create() {
              for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              return createLogs.call.apply(createLogs, [this].concat(args));
            }
          });
        }
      };
    }
  }]);
  return ReactorLog;
}(Entity);

function createLogs(data) {
  var _Resource$prototype$c;

  for (var _len2 = arguments.length, rest = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    rest[_key2 - 1] = arguments[_key2];
  }

  if (Array.isArray(data)) {
    var options = rest[0];

    if (isUndefined(options) || isFunction(options)) {
      options = {};
      rest.unshift(options);
    }
    options.url = this.path + '/bulk';
  }

  return (_Resource$prototype$c = Resource.prototype.create).call.apply(_Resource$prototype$c, [this, data].concat(rest));
}

var path$7 = '/applications';
var ApplicationResources = mixinResources([ReactorScript, ReactorSchedule, ReactorLog]);

/**
 * Represents an Application entity.
 *
 * @extends Entity
 */

var Application = function (_ApplicationResources) {
  inherits(Application, _ApplicationResources);

  function Application() {
    classCallCheck(this, Application);
    return possibleConstructorReturn(this, (Application.__proto__ || Object.getPrototypeOf(Application)).apply(this, arguments));
  }

  createClass(Application, null, [{
    key: 'resourceFactory',

    /**
     * Return simple resource factory for Applications.
     *
     * @static
     * @return {{application: Function}}
     */
    value: function resourceFactory() {
      return {
        application: function application(id) {
          // Only allowed on Entities and Resources.
          if (this instanceof Scope) {
            throw new Error('Application is not a top-level resource.');
          }

          return Resource.factoryFor(Application, path$7, ApplicationResources).call(this, id);
        }
      };
    }
  }]);
  return Application;
}(ApplicationResources(Entity));

var path$6 = '/projects';
var ProjectResources = mixinResources([Application]);

/**
 * Represents a Project entity object.
 *
 * @extends Entity
 */

var Project = function (_ProjectResources) {
  inherits(Project, _ProjectResources);

  function Project() {
    classCallCheck(this, Project);
    return possibleConstructorReturn(this, (Project.__proto__ || Object.getPrototypeOf(Project)).apply(this, arguments));
  }

  createClass(Project, null, [{
    key: 'resourceFactory',

    /**
     * Return simple resource factory for Projects.
     *
     * @static
     * @return {{project: Function}}
     */
    value: function resourceFactory() {
      return {
        project: Resource.factoryFor(Project, path$6, ProjectResources)
      };
    }
  }]);
  return Project;
}(ProjectResources(Entity));

var path$13 = '/permissions';

/**
 * Represents a Permission entity.
 *
 * @extends Entity
 */

var Permission = function (_Entity) {
  inherits(Permission, _Entity);

  function Permission() {
    classCallCheck(this, Permission);
    return possibleConstructorReturn(this, (Permission.__proto__ || Object.getPrototypeOf(Permission)).apply(this, arguments));
  }

  createClass(Permission, null, [{
    key: 'resourceFactory',

    /**
     * Return simple resource factory for Permissions.
     *
     * @static
     * @return {{permission: Function}}
     */
    value: function resourceFactory() {
      return {
        permission: function permission() {
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
  }]);
  return Permission;
}(Entity);

var path$12 = '/roles';
var RoleResources = mixinResources([Permission]);

/**
 * Represents a Role entity object.
 *
 * @extends Entity
 */

var Role = function (_RoleResources) {
  inherits(Role, _RoleResources);

  function Role() {
    classCallCheck(this, Role);
    return possibleConstructorReturn(this, (Role.__proto__ || Object.getPrototypeOf(Role)).apply(this, arguments));
  }

  createClass(Role, null, [{
    key: 'resourceFactory',

    /**
     * Return simple resource factory for Roles.
     *
     * @static
     * @return {{role: Function}}
     */
    value: function resourceFactory() {
      return {
        role: Resource.factoryFor(Role, path$12, RoleResources)
      };
    }
  }]);
  return Role;
}(RoleResources(Entity));

var path$14 = '/users';

/**
 * Represents a User entity object.
 *
 * @extends Entity
 */

var User = function (_Entity) {
  inherits(User, _Entity);

  function User() {
    classCallCheck(this, User);
    return possibleConstructorReturn(this, (User.__proto__ || Object.getPrototypeOf(User)).apply(this, arguments));
  }

  createClass(User, null, [{
    key: 'resourceFactory',

    /**
     * Return simple resource factory for AppUsers.
     *
     * @static
     * @return {{appUser: Function}}
     */
    value: function resourceFactory() {
      return {
        user: Resource.factoryFor(User, path$14)
      };
    }
  }]);
  return User;
}(Entity);

var path$16 = '/tasks';

/**
 * Represents a Task entity.
 *
 * @extends Entity
 */

var Task = function (_Entity) {
  inherits(Task, _Entity);

  function Task() {
    classCallCheck(this, Task);
    return possibleConstructorReturn(this, (Task.__proto__ || Object.getPrototypeOf(Task)).apply(this, arguments));
  }

  createClass(Task, null, [{
    key: 'resourceFactory',

    /**
     * Return simple resource factory for Tasks.
     *
     * @static
     * @return {{task: Function}}
     */
    value: function resourceFactory() {
      return {
        task: function task(id) {
          // Only allowed on Entities and Resources.
          if (this instanceof Scope) {
            throw new Error('Permission is not a top-level resource.');
          }

          return Resource.factoryFor(Task, path$16).call(this, id);
        }
      };
    }
  }]);
  return Task;
}(Entity);

var path$15 = '/batches';
var BatchResources = mixinResources([Task]);

/**
 * Represents a Batch entity object.
 *
 * @extends Entity
 */

var Batch = function (_BatchResources) {
  inherits(Batch, _BatchResources);

  function Batch() {
    classCallCheck(this, Batch);
    return possibleConstructorReturn(this, (Batch.__proto__ || Object.getPrototypeOf(Batch)).apply(this, arguments));
  }

  createClass(Batch, null, [{
    key: 'resourceFactory',

    /**
     * Return simple resource factory for Batches.
     *
     * @static
     * @return {{batch: Function}}
     */
    value: function resourceFactory() {
      return {
        batch: Resource.factoryFor(Batch, path$15, BatchResources)
      };
    }
  }]);
  return Batch;
}(BatchResources(Entity));

var path$17 = '/places';

/**
 * Represents a Place entity object.
 *
 * @extends Entity
 */

var Place = function (_Entity) {
  inherits(Place, _Entity);

  function Place() {
    classCallCheck(this, Place);
    return possibleConstructorReturn(this, (Place.__proto__ || Object.getPrototypeOf(Place)).apply(this, arguments));
  }

  createClass(Place, null, [{
    key: 'resourceFactory',

    /**
     * Return simple resource factory for Places.
     *
     * @static
     * @return {{place: Function}}
     */
    value: function resourceFactory() {
      return {
        place: Resource.factoryFor(Place, path$17)
      };
    }
  }]);
  return Place;
}(Entity);

var path$18 = '/files';

/**
 * Represents a File entity object.
 *
 * @extends Entity
 */

var File = function (_Entity) {
  inherits(File, _Entity);

  function File() {
    classCallCheck(this, File);
    return possibleConstructorReturn(this, (File.__proto__ || Object.getPrototypeOf(File)).apply(this, arguments));
  }

  createClass(File, null, [{
    key: 'resourceFactory',

    /**
     * Return simple resource factory for Files.
     *
     * @static
     * @return {{file: Function}}
     */
    value: function resourceFactory() {
      // TODO enable Node.js File streams and multipart/form-data files/blobs

      return {
        file: Resource.factoryFor(File, path$18)
      };
    }
  }]);
  return File;
}(Entity);

/**
 * Mixin with all the top-level Operator resources.
 *
 * @mixin
 */
var OperatorAccess = mixinResources([Product, // CRUD
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

var Operator = function (_OperatorAccess) {
  inherits(Operator, _OperatorAccess);

  /**
   * Creates an instance of Operator.
   *
   * @param {string} apiKey - API Key of scope
   * @param {Object} [data={}] - Optional operator data
   */
  function Operator(apiKey) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, Operator);

    var _this = possibleConstructorReturn(this, (Operator.__proto__ || Object.getPrototypeOf(Operator)).call(this, apiKey, data));

    _this[symbols.init] = _this[symbols.init].then(function (access) {
      _this.id = access.actor.id;
      _this[symbols.path] = _this._getPath();
    }).then(_this.read.bind(_this)).catch(function () {
      throw new Error('There is no operator with this API Key');
    });
    return _this;
  }

  // PRIVATE

  /**
   * Return operator endpoint.
   *
   * @return {string}
   */


  createClass(Operator, [{
    key: '_getPath',
    value: function _getPath() {
      return '/operators/' + this.id;
    }
  }]);
  return Operator;
}(OperatorAccess(Scope));

/**
 * Mixin with all the top-level User resources.
 *
 * @mixin
 */
var UserAccess = mixinResources([Product, // CRU
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

var User$2 = function (_UserAccess) {
  inherits(User, _UserAccess);

  /**
   * Creates an instance of User.
   *
   * @param {string} apiKey - API Key of scope
   * @param {Object} [data={}] - Optional user data
   */
  function User(apiKey) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, User);

    var _this = possibleConstructorReturn(this, (User.__proto__ || Object.getPrototypeOf(User)).call(this, apiKey, data));

    _this[symbols.init] = _this[symbols.init].then(function (access) {
      _this.id = access.actor.id;
      _this[symbols.path] = _this._getPath();
    }).then(_this.read.bind(_this)).catch(function () {
      throw new Error('There is no user with this API Key');
    });
    return _this;
  }

  /**
   * Log current user out of EVRYTHNG platform. I.e. API Key is not longer
   * valid.
   *
   * @param {Function} callback - Error first callback
   * @returns {Promise.<void>}
   */


  createClass(User, [{
    key: 'logout',
    value: function () {
      var _ref = asyncToGenerator(index.mark(function _callee(callback) {
        return index.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return this._invalidateUser();

              case 3:
                if (callback) callback(null);
                _context.next = 10;
                break;

              case 6:
                _context.prev = 6;
                _context.t0 = _context['catch'](0);

                if (callback) callback(_context.t0);
                throw _context.t0;

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 6]]);
      }));

      function logout(_x2) {
        return _ref.apply(this, arguments);
      }

      return logout;
    }()

    // PRIVATE

    /**
     * Return user endpoint.
     *
     * @return {string}
     */

  }, {
    key: '_getPath',
    value: function _getPath() {
      return '/users/' + this.id;
    }

    /**
     * Request to invalidate API Key.
     *
     * @returns {Promise}
     * @private
     */

  }, {
    key: '_invalidateUser',
    value: function _invalidateUser() {
      return api({
        url: '/auth/all/logout',
        method: 'post',
        apiKey: this.apiKey
      });
    }
  }]);
  return User;
}(UserAccess(Scope));

var path$19 = '/auth/evrythng/users';

/**
 * Represents an AppUser access entry object. In the API there is a distinction
 * and different actions available for AppUser access. I.e. they can be validated.
 *
 * @extends Entity
 */

var UserAccess$1 = function (_Entity) {
  inherits(UserAccess, _Entity);
  createClass(UserAccess, null, [{
    key: 'resourceFactory',

    /**
     * Return resource factory for AppUsers access.
     *
     * @static
     * @return {{appUser: Function}}
     */
    value: function resourceFactory() {
      return {
        userAccess: function userAccess(id) {
          return Object.assign(Resource.factoryFor(UserAccess, path$19).call(this, id), {
            create: function create() {
              for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              return createAppUser.call.apply(createAppUser, [this].concat(args));
            },
            validate: function validate() {
              for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
              }

              return _validate.call.apply(_validate, [this].concat(args));
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

  }]);

  function UserAccess(resource) {
    var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, UserAccess);

    var copy = Object.assign({}, body);
    if (copy.evrythngUser) {
      copy.id = copy.evrythngUser;
      Reflect.deleteProperty(copy, 'evrythngUser');
    }
    return possibleConstructorReturn(this, (UserAccess.__proto__ || Object.getPrototypeOf(UserAccess)).call(this, resource, copy));
  }

  /**
   * Validate user access using own activation code.
   *
   * @return {Promise}
   */


  createClass(UserAccess, [{
    key: 'validate',
    value: function validate() {
      return _validate.call(this, this.activationCode);
    }
  }]);
  return UserAccess;
}(Entity);

function createAppUser() {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  var data = args[0];

  if (data && data.anonymous) {
    return createAnonymousUser.call.apply(createAnonymousUser, [this].concat(args));
  } else {
    var _Resource$prototype$c;

    return (_Resource$prototype$c = Resource.prototype.create).call.apply(_Resource$prototype$c, [this].concat(args));
  }
}

/**
 * Send a request to the validate endpoint with the given activation code.
 *
 * @param {String} activationCode - Activation code provided on creation.
 * @return {Promise}
 */
function _validate(activationCode) {
  if (!activationCode || !isString(activationCode)) {
    throw new Error('Activation code must be a string.');
  }

  if (this.type === 'anonymous') {
    throw new Error("Anonymous users can't be validated.");
  }

  var scope = this.scope;
  var path = this.path;

  // If called from the entity, the scope is the resource's scope.
  if (this instanceof Entity) {
    scope = this[symbols.resource].scope;
    path = this[symbols.resource].path + '/' + this.id;
  }

  // Activate  user.
  return api({
    url: path + '/validate',
    method: 'post',
    apiKey: scope.apiKey,
    data: { activationCode: activationCode }
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
var ApplicationAccess = mixinResources([Product, // R
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

var Application$2 = function (_ApplicationAccess) {
  inherits(Application, _ApplicationAccess);

  /**
   * Creates an instance of Application.
   *
   * @param {string} apiKey - API Key of scope
   * @param {Object} [data={}] - Optional application data
   */
  function Application(apiKey) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, Application);

    var _this = possibleConstructorReturn(this, (Application.__proto__ || Object.getPrototypeOf(Application)).call(this, apiKey, data));

    _this[symbols.init] = _this[symbols.init].then(function (access) {
      _this.id = access.actor.id;
      _this.project = access.project;
      _this[symbols.path] = _this._getPath();
    }).then(_this.read.bind(_this)).catch(function () {
      throw new Error('There is no application with this API Key');
    });
    return _this;
  }

  /**
   * Login user using EVRYTHNG credentials and create User scope on success.
   *
   * @param {AccessCredentials} credentials - User login credentials
   * @param {Function} callback - Error first callback
   * @returns {Promise.<User>} - Authorized User scope
   */


  createClass(Application, [{
    key: 'login',
    value: function () {
      var _ref = asyncToGenerator(index.mark(function _callee(credentials, callback) {
        var user, userScope;
        return index.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return this._authenticateUser(credentials);

              case 3:
                user = _context.sent;
                userScope = new User$2(user.access.apiKey, user);

                if (callback) callback(null, userScope);
                return _context.abrupt('return', userScope);

              case 9:
                _context.prev = 9;
                _context.t0 = _context['catch'](0);

                if (callback) callback(_context.t0);
                throw _context.t0;

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 9]]);
      }));

      function login(_x2, _x3) {
        return _ref.apply(this, arguments);
      }

      return login;
    }()

    // PRIVATE

    /**
     * Return application endpoint, nested within projects.
     *
     * @returns {string}
     * @private
     */

  }, {
    key: '_getPath',
    value: function _getPath() {
      return '/projects/' + this.project + '/applications/' + this.id;
    }

    /**
     * Validate user credentials.
     *
     * @param {AccessCredentials} credentials - User login credentials
     * @returns {Promise.<Object>} - User details with access
     * @private
     */

  }, {
    key: '_authenticateUser',
    value: function _authenticateUser(credentials) {
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
  }]);
  return Application;
}(ApplicationAccess(Scope));

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
var ApplicationAccess$1 = mixinResources([Thng, // CRUD
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

var TrustedApplication = function (_ApplicationAccess) {
  inherits(TrustedApplication, _ApplicationAccess);

  /**
   * Creates an instance of Application.
   *
   * @param {string} apiKey - API Key of scope
   * @param {Object} [data={}] - Optional application data
   */
  function TrustedApplication(apiKey) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, TrustedApplication);

    var _this = possibleConstructorReturn(this, (TrustedApplication.__proto__ || Object.getPrototypeOf(TrustedApplication)).call(this, apiKey, data));

    _this[symbols.init] = _this[symbols.init].then(function (access) {
      _this.id = access.actor.id;
      _this.project = access.project;
      _this[symbols.path] = _this._getPath();
    }).then(_this.read.bind(_this)).catch(function () {
      throw new Error('There is no application with this API Key');
    });
    return _this;
  }

  /**
   * Login user using EVRYTHNG credentials and create User scope on success.
   *
   * @param {AccessCredentials} credentials - User login credentials
   * @param {Function} callback - Error first callback
   * @returns {Promise.<User>} - Authorized User scope
   */


  createClass(TrustedApplication, [{
    key: 'login',
    value: function () {
      var _ref = asyncToGenerator(index.mark(function _callee(credentials, callback) {
        var user, userScope;
        return index.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return this._authenticateUser(credentials);

              case 3:
                user = _context.sent;
                userScope = new User(user.access.apiKey, user);

                if (callback) callback(null, userScope);
                return _context.abrupt('return', userScope);

              case 9:
                _context.prev = 9;
                _context.t0 = _context['catch'](0);

                if (callback) callback(_context.t0);
                throw _context.t0;

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 9]]);
      }));

      function login(_x2, _x3) {
        return _ref.apply(this, arguments);
      }

      return login;
    }()

    // PRIVATE

    /**
     * Return application endpoint, nested within projects.
     *
     * @returns {string}
     * @private
     */

  }, {
    key: '_getPath',
    value: function _getPath() {
      return '/projects/' + this.project + '/applications/' + this.id;
    }

    /**
     * Validate user credentials.
     *
     * @param {AccessCredentials} credentials - User login credentials
     * @returns {Promise.<Object>} - User details with access
     * @private
     */

  }, {
    key: '_authenticateUser',
    value: function _authenticateUser(credentials) {
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
  }]);
  return TrustedApplication;
}(ApplicationAccess$1(Application$2));

// import Location from '../entity/Location'
/**
 * Mixin with all the top-level Application resources.
 *
 * @mixin
 */
var DeviceAccess = mixinResources([Property, // CRUD
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

var Device = function (_DeviceAccess) {
  inherits(Device, _DeviceAccess);

  /**
   * Creates an instance of Device.
   *
   * @param {string} apiKey - API Key of scope
   * @param {Object} [data={}] - Optional device data
   */
  function Device(apiKey) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, Device);

    var _this = possibleConstructorReturn(this, (Device.__proto__ || Object.getPrototypeOf(Device)).call(this, apiKey, data));

    _this[symbols.init] = _this[symbols.init].catch(function () {
      throw new Error('There is no thng with this API Key');
    }).then(function (access) {
      _this.id = access.actor.id;
      _this[symbols.path] = _this._getPath();
    }).then(_this.read.bind(_this));
    return _this;
  }

  // PRIVATE

  /**
   * Return device thng endpoint.
   *
   * @return {string}
   */


  createClass(Device, [{
    key: '_getPath',
    value: function _getPath() {
      return '/thngs/' + this.id;
    }
  }]);
  return Device;
}(DeviceAccess(Scope));

var path$20 = '/locations';

/**
 * Represents a Location entity. Locations are always nested and required
 * to be constructed on Resource/Entity objects (not top level Scopes).
 *
 * @extends Entity
 */

var Location = function (_Entity) {
  inherits(Location, _Entity);

  function Location() {
    classCallCheck(this, Location);
    return possibleConstructorReturn(this, (Location.__proto__ || Object.getPrototypeOf(Location)).apply(this, arguments));
  }

  createClass(Location, null, [{
    key: 'resourceFactory',

    /**
     * Return overridden resource factory for Locations. Locations are
     * sub-resources of Thngs and are not allowed on top level Scope classes.
     * This factory also override the default Resource's update method to allow
     * empty invocations that send the current browser's location as the payload.
     *
     * @static
     * @return {{property: Function}}
     */
    value: function resourceFactory() {
      return {
        location: function location() {
          // Locations don't have single resource endpoint (e.g.: /locations/:id)
          if (isString(arguments[0])) {
            throw new TypeError('There is no single resource for Locations');
          }

          var thngPath = this instanceof Scope ? this[symbols.path] : '';

          // Creates and returns Resource of type Location.
          // Override property resource update to allow empty updates.
          // See `updateLocation()`.
          return Object.assign(Resource.factoryFor(Location, thngPath + path$20).call(this), {
            update: function update() {
              for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              return updateLocation.call.apply(updateLocation, [this].concat(args));
            }
          });
        }
      };
    }
  }]);
  return Location;
}(Entity);

function updateLocation() {
  var _normalizeArguments = normalizeArguments$3.apply(undefined, arguments),
      _normalizeArguments2 = toArray(_normalizeArguments),
      data = _normalizeArguments2[0],
      rest = _normalizeArguments2.slice(1);

  var baseUpdate = Resource.prototype.update.bind(this);
  var updatedArgs = function updatedArgs() {
    return [data].concat(toConsumableArray(rest));
  };

  if (useGeolocation$1(data)) {
    return getCurrentPosition().then(function (position) {
      data[0] = fillLocation(data[0], position);
      return baseUpdate.apply(undefined, toConsumableArray(updatedArgs()));
    }).catch(function (err) {
      console.info('Unable to get position: ' + err);
      return baseUpdate.apply(undefined, toConsumableArray(updatedArgs()));
    });
  } else {
    return baseUpdate.apply(undefined, toConsumableArray(updatedArgs()));
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
function normalizeArguments$3() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  var firstArg = args[0];
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
  var location = Object.assign({}, data);
  location.position = {
    type: 'Point',
    coordinates: [position.coords.longitude, position.coords.latitude]
  };
  return location;
}

var entities = {
  Product: Product,
  Thng: Thng,
  Collection: Collection,
  Property: Property,
  Action: Action,
  ActionType: ActionType,
  Application: Application,
  User: User,
  Batch: Batch,
  Location: Location,
  Permission: Permission,
  Project: Project,
  Role: Role,
  Task: Task
};

// Globals

exports.settings = settings;
exports.setup = setup;
exports.api = api;
exports.Operator = Operator;
exports.Application = Application$2;
exports.TrustedApplication = TrustedApplication;
exports.User = User$2;
exports.Device = Device;
exports.Entity = entities;
exports.Symbol = symbols;
exports._Resource = Resource;
exports._Entity = Entity;
exports._Scope = Scope;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=evrythng.polyfill.js.map
