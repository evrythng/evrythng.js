// EVRYTHNG JS SDK v4.7.2
// (c) 2012-2017 EVRYTHNG Ltd. London / New York / San Francisco.
// Released under the Apache Software License, Version 2.0.
// For all details and usage:
// https://github.com/evrythng/evrythng.js

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

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
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

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";

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
  // `value instanceof AwaitArgument` to determine if the yielded value is
  // meant to be awaited. Some may consider the name of this method too
  // cutesy, but they are curmudgeons.
  runtime.awrap = function(arg) {
    return new AwaitArgument(arg);
  };

  function AwaitArgument(arg) {
    this.arg = arg;
  }

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value instanceof AwaitArgument) {
          return Promise.resolve(value.arg).then(function(value) {
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

    if (typeof process === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
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

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          if (method === "return" ||
              (method === "throw" && delegate.iterator[method] === undefined)) {
            // A return or throw (when the delegate iterator has no throw
            // method) always terminates the yield* loop.
            context.delegate = null;

            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            var returnMethod = delegate.iterator["return"];
            if (returnMethod) {
              var record = tryCatch(returnMethod, delegate.iterator, arg);
              if (record.type === "throw") {
                // If the return method threw an exception, let that
                // exception prevail over the original return or throw.
                method = "throw";
                arg = record.arg;
                continue;
              }
            }

            if (method === "return") {
              // Continue with the outer return, now that the delegate
              // iterator has been terminated.
              continue;
            }
          }

          var record = tryCatch(
            delegate.iterator[method],
            delegate.iterator,
            arg
          );

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;
            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = arg;

        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }

        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(arg) call above.
          method = "throw";
          arg = record.arg;
        }
      }
    };
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp[toStringTagSymbol] = "Generator";

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
        return !!caught;
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
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
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

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);
(function (root, factory) {

  // AMD. Usually browsers but could be node too...
  if (typeof define === 'function' && define.amd) {
    define([], factory(XMLHttpRequest, null));
  // Browser globals
  } else {
    root.EVT = root.Evrythng = factory(XMLHttpRequest, null);
  }

}(this, function (XMLHttpRequest, request) {
/**
 * @license almond 0.3.3 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, http://github.com/requirejs/almond/LICENSE
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part, normalizedBaseParts,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name) {
            name = name.split('/');
            lastIndex = name.length - 1;

            // If wanting node ID compatibility, strip .js from end
            // of IDs. Have to do this here, and not in nameToUrl
            // because node allows either .js or non .js to map
            // to same file.
            if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
            }

            // Starts with a '.' so need the baseName
            if (name[0].charAt(0) === '.' && baseParts) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that 'directory' and not name of the baseName's
                //module. For instance, baseName of 'one/two/three', maps to
                //'one/two/three.js', but we want the directory, 'one/two' for
                //this normalization.
                normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                name = normalizedBaseParts.concat(name);
            }

            //start trimDots
            for (i = 0; i < name.length; i++) {
                part = name[i];
                if (part === '.') {
                    name.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    // If at the start, or previous value is still ..,
                    // keep them so that when converted to a path it may
                    // still work when converted to a path, even though
                    // as an ID it is less than ideal. In larger point
                    // releases, may be better to just kick out an error.
                    if (i === 0 || (i === 1 && name[2] === '..') || name[i - 1] === '..') {
                        continue;
                    } else if (i > 0) {
                        name.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
            //end trimDots

            name = name.join('/');
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    //Creates a parts array for a relName where first part is plugin ID,
    //second part is resource ID. Assumes relName has already been normalized.
    function makeRelParts(relName) {
        return relName ? splitPrefix(relName) : [];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relParts) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0],
            relResourceName = relParts[1];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relResourceName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relResourceName));
            } else {
                name = normalize(name, relResourceName);
            }
        } else {
            name = normalize(name, relResourceName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i, relParts,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;
        relParts = makeRelParts(relName);

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relParts);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, makeRelParts(callback)).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("almond", function(){});

/*! Native Promise Only
    v0.7.8-a (c) Kyle Simpson
    MIT License: http://getify.mit-license.org
*/

(function UMD(name,context,definition){
	// special form of UMD for polyfilling across evironments
	context[name] = context[name] || definition();
	if (typeof define == "function" && define.amd) { define('promise',[],function $AMD$(){ return context[name]; }); }
	else if (typeof module != "undefined" && module.exports) { module.exports = context[name]; }
})("Promise",typeof global != "undefined" ? global : this,function DEF(){
	/*jshint validthis:true */
	"use strict";

	var builtInProp, cycle, scheduling_queue,
		ToString = Object.prototype.toString,
		timer = (typeof setImmediate != "undefined") ?
			function timer(fn) { return setImmediate(fn); } :
			setTimeout
	;

	// dammit, IE8.
	try {
		Object.defineProperty({},"x",{});
		builtInProp = function builtInProp(obj,name,val,config) {
			return Object.defineProperty(obj,name,{
				value: val,
				writable: true,
				configurable: config !== false
			});
		};
	}
	catch (err) {
		builtInProp = function builtInProp(obj,name,val) {
			obj[name] = val;
			return obj;
		};
	}

	// Note: using a queue instead of array for efficiency
	scheduling_queue = (function Queue() {
		var first, last, item;

		function Item(fn,self) {
			this.fn = fn;
			this.self = self;
			this.next = void 0;
		}

		return {
			add: function add(fn,self) {
				item = new Item(fn,self);
				if (last) {
					last.next = item;
				}
				else {
					first = item;
				}
				last = item;
				item = void 0;
			},
			drain: function drain() {
				var f = first;
				first = last = cycle = void 0;

				while (f) {
					f.fn.call(f.self);
					f = f.next;
				}
			}
		};
	})();

	function schedule(fn,self) {
		scheduling_queue.add(fn,self);
		if (!cycle) {
			cycle = timer(scheduling_queue.drain);
		}
	}

	// promise duck typing
	function isThenable(o) {
		var _then, o_type = typeof o;

		if (o != null &&
			(
				o_type == "object" || o_type == "function"
			)
		) {
			_then = o.then;
		}
		return typeof _then == "function" ? _then : false;
	}

	function notify() {
		for (var i=0; i<this.chain.length; i++) {
			notifyIsolated(
				this,
				(this.state === 1) ? this.chain[i].success : this.chain[i].failure,
				this.chain[i]
			);
		}
		this.chain.length = 0;
	}

	// NOTE: This is a separate function to isolate
	// the `try..catch` so that other code can be
	// optimized better
	function notifyIsolated(self,cb,chain) {
		var ret, _then;
		try {
			if (cb === false) {
				chain.reject(self.msg);
			}
			else {
				if (cb === true) {
					ret = self.msg;
				}
				else {
					ret = cb.call(void 0,self.msg);
				}

				if (ret === chain.promise) {
					chain.reject(TypeError("Promise-chain cycle"));
				}
				else if (_then = isThenable(ret)) {
					_then.call(ret,chain.resolve,chain.reject);
				}
				else {
					chain.resolve(ret);
				}
			}
		}
		catch (err) {
			chain.reject(err);
		}
	}

	function resolve(msg) {
		var _then, def_wrapper, self = this;

		// already triggered?
		if (self.triggered) { return; }

		self.triggered = true;

		// unwrap
		if (self.def) {
			self = self.def;
		}

		try {
			if (_then = isThenable(msg)) {
				def_wrapper = new MakeDefWrapper(self);
				_then.call(msg,
					function $resolve$(){ resolve.apply(def_wrapper,arguments); },
					function $reject$(){ reject.apply(def_wrapper,arguments); }
				);
			}
			else {
				self.msg = msg;
				self.state = 1;
				if (self.chain.length > 0) {
					schedule(notify,self);
				}
			}
		}
		catch (err) {
			reject.call(def_wrapper || (new MakeDefWrapper(self)),err);
		}
	}

	function reject(msg) {
		var self = this;

		// already triggered?
		if (self.triggered) { return; }

		self.triggered = true;

		// unwrap
		if (self.def) {
			self = self.def;
		}

		self.msg = msg;
		self.state = 2;
		if (self.chain.length > 0) {
			schedule(notify,self);
		}
	}

	function iteratePromises(Constructor,arr,resolver,rejecter) {
		for (var idx=0; idx<arr.length; idx++) {
			(function IIFE(idx){
				Constructor.resolve(arr[idx])
				.then(
					function $resolver$(msg){
						resolver(idx,msg);
					},
					rejecter
				);
			})(idx);
		}
	}

	function MakeDefWrapper(self) {
		this.def = self;
		this.triggered = false;
	}

	function MakeDef(self) {
		this.promise = self;
		this.state = 0;
		this.triggered = false;
		this.chain = [];
		this.msg = void 0;
	}

	function Promise(executor) {
		if (typeof executor != "function") {
			throw TypeError("Not a function");
		}

		if (this.__NPO__ !== 0) {
			throw TypeError("Not a promise");
		}

		// instance shadowing the inherited "brand"
		// to signal an already "initialized" promise
		this.__NPO__ = 1;

		var def = new MakeDef(this);

		this["then"] = function then(success,failure) {
			var o = {
				success: typeof success == "function" ? success : true,
				failure: typeof failure == "function" ? failure : false
			};
			// Note: `then(..)` itself can be borrowed to be used against
			// a different promise constructor for making the chained promise,
			// by substituting a different `this` binding.
			o.promise = new this.constructor(function extractChain(resolve,reject) {
				if (typeof resolve != "function" || typeof reject != "function") {
					throw TypeError("Not a function");
				}

				o.resolve = resolve;
				o.reject = reject;
			});
			def.chain.push(o);

			if (def.state !== 0) {
				schedule(notify,def);
			}

			return o.promise;
		};
		this["catch"] = function $catch$(failure) {
			return this.then(void 0,failure);
		};

		try {
			executor.call(
				void 0,
				function publicResolve(msg){
					resolve.call(def,msg);
				},
				function publicReject(msg) {
					reject.call(def,msg);
				}
			);
		}
		catch (err) {
			reject.call(def,err);
		}
	}

	var PromisePrototype = builtInProp({},"constructor",Promise,
		/*configurable=*/false
	);

	// Note: Android 4 cannot use `Object.defineProperty(..)` here
	Promise.prototype = PromisePrototype;

	// built-in "brand" to signal an "uninitialized" promise
	builtInProp(PromisePrototype,"__NPO__",0,
		/*configurable=*/false
	);

	builtInProp(Promise,"resolve",function Promise$resolve(msg) {
		var Constructor = this;

		// spec mandated checks
		// note: best "isPromise" check that's practical for now
		if (msg && typeof msg == "object" && msg.__NPO__ === 1) {
			return msg;
		}

		return new Constructor(function executor(resolve,reject){
			if (typeof resolve != "function" || typeof reject != "function") {
				throw TypeError("Not a function");
			}

			resolve(msg);
		});
	});

	builtInProp(Promise,"reject",function Promise$reject(msg) {
		return new this(function executor(resolve,reject){
			if (typeof resolve != "function" || typeof reject != "function") {
				throw TypeError("Not a function");
			}

			reject(msg);
		});
	});

	builtInProp(Promise,"all",function Promise$all(arr) {
		var Constructor = this;

		// spec mandated checks
		if (ToString.call(arr) != "[object Array]") {
			return Constructor.reject(TypeError("Not an array"));
		}
		if (arr.length === 0) {
			return Constructor.resolve([]);
		}

		return new Constructor(function executor(resolve,reject){
			if (typeof resolve != "function" || typeof reject != "function") {
				throw TypeError("Not a function");
			}

			var len = arr.length, msgs = Array(len), count = 0;

			iteratePromises(Constructor,arr,function resolver(idx,msg) {
				msgs[idx] = msg;
				if (++count === len) {
					resolve(msgs);
				}
			},reject);
		});
	});

	builtInProp(Promise,"race",function Promise$race(arr) {
		var Constructor = this;

		// spec mandated checks
		if (ToString.call(arr) != "[object Array]") {
			return Constructor.reject(TypeError("Not an array"));
		}

		return new Constructor(function executor(resolve,reject){
			if (typeof resolve != "function" || typeof reject != "function") {
				throw TypeError("Not a function");
			}

			iteratePromises(Constructor,arr,function resolver(idx,msg){
				resolve(msg);
			},reject);
		});
	});

	return Promise;
});

// ## UTILS.JS

// **The Utils module provide a set of utility methods used
// across the whole library. For that, it doesn't have any
// dependency.**

define('utils',['promise'], function (Promise) {
  'use strict';

  return {

    // Check if a reference is defined.
    isDefined: function(value){
      return typeof value !== 'undefined';
    },

    // Check if a variable is a function.
    isFunction: function(fn){
      return Object.prototype.toString.call(fn) == '[object Function]';
    },

    // Check if a variable is a string.
    isString: function(str){
      return Object.prototype.toString.call(str) == '[object String]';
    },

    // Check if a variable is an array.
    isArray: function(arr){
      return Object.prototype.toString.call(arr) == '[object Array]';
    },

    // Check if a variable is an Object (includes Object functions and
    // plain objects)
    isObject: function(obj) {
      return obj === Object(obj) && !this.isArray(obj);
    },

    // Simple and shallow extend method, used to extend an object's properties
    // with another object's. The `override` parameter defines if the
    // source object should be overriden or if this method should return a new
    // object (it is *false by default*).
    extend: function(source, obj, override) {
      var out;

      // Create extensible object.
      if(override) {
        out = source;
      } else {
        // Create shallow copy of source.
        out = {};
        for(var i in source){
          if(source.hasOwnProperty(i)) {
            out[i] = source[i];
          }
        }
      }

      // Copy properties.
      for(var j in obj) {
        if(obj.hasOwnProperty(j)) {
          out[j] = obj[j];
        }
      }

      return out;
    },

    // Curried version of extend function above, e.g:
    // Utils.extend(source)(target);
    extendCurried: function(source) {
      var $this = this;

      return function(obj) {
        return $this.extend(source, obj, true);
      };
    },

    // Build URL query string params out of a javascript object.
    // Encode key and value components as they are appended to query string.
    buildParams: function (params, noEncode) {
      if(this.isObject(params)){

        var paramsStr = [];

        for (var key in params) {
          if (params.hasOwnProperty(key) && params[key] !== undefined) {
            var value = this.isObject(params[key])? this.buildParams(params[key], true) : params[key];
            paramsStr.push((noEncode? key : encodeURIComponent(key)) +
              '=' + (noEncode? this.escapeSpecials(value) : encodeURIComponent(value)));
          }
        }

        // Build string from the array.
        return paramsStr.join('&');

      } else {
        return params;
      }
    },

    // Build full URL from a base url and params, if there are any.
    buildUrl: function(options){
      var url = options.apiUrl + (options.url ? options.url : '');

      if(options.params) {
        url += (url.indexOf('?') === -1 ? '?' : '&') + this.buildParams(options.params);
      }

      return url;
    },

    // Get current position using HTML5 Geolocation and resolve promise
    // once it has returned.
    getCurrentPosition: function(options){
      if (typeof window !== 'undefined' && window.navigator.geolocation) {

        // Have default options, but allow to extend with custom.
        var geolocationOptions = this.extend({
          maximumAge: 0,
          timeout: 10000,
          enableHighAccuracy: true
        }, options);

        return new Promise(function (resolve, reject) {

          window.navigator.geolocation.getCurrentPosition(function (position) {

            resolve(position);

          }, function (err) {

            var errorMessage = 'Geolocation: ';
            if(err.code === 1) {
              errorMessage = 'You didn\'t share your location.';
            } else if(err.code === 2) {
              errorMessage = 'Couldn\'t detect your current location.';
            } else if(err.code === 3) {
              errorMessage = 'Retrieving position timed out.';
            } else {
              errorMessage = 'Unknown error.';
            }
            reject(errorMessage);

          }, geolocationOptions);

        });

      }else{
        return new Promise(function (resolve, reject) {
          reject('Your browser\/environment doesn\'t support geolocation.');
        });
      }
    },

    // Escape special characters from a string (with "\").
    escapeSpecials: function(input) {

      // Specials to be escaped by default.
      var specials = ['&','|','!','>','<','=','~','(',')',','];

      var specialsRegex = new RegExp('[' + specials.join('\\') + ']', 'g');

      if (input && typeof input === 'string') {
        input = input.replace(specialsRegex, '\\$&');
      }

      return input;
    },

    // Parse Link headers for API pagination.
    // https://gist.github.com/niallo/3109252
    parseLinkHeader: function (header) {
      var links = {};

      if (header && header.length) {
        // Split parts by comma
        var parts = header.split(',');
        // Parse each part into a named link
        for (var i = 0; i < parts.length; i++) {
          var section = parts[i].split(';');
          if (section.length !== 2) {
            throw new Error("section could not be split on ';'");
          }
          var url = section[0].replace(/<(.*)>/, '$1').trim();
          var name = section[1].replace(/rel="(.*)"/, '$1').trim();
          links[name] = url;
        }
      }

      return links;
    },

    // Iterate over *Iterator*.
    // https://gist.github.com/jakearchibald/31b89cba627924972ad6
    spawn: function (iter) {
      function continuer(verb, arg) {
        var result;
        try {
          result = iter[verb](arg);
        } catch (err) {
          return Promise.reject(err);
        }
        if (result.done) {
          return result.value;
        } else {
          return Promise.resolve(result.value).then(onFulfilled, onRejected);
        }
      }
      var onFulfilled = continuer.bind(continuer, "next");
      var onRejected = continuer.bind(continuer, "throw");
      return onFulfilled();
    },

    // Iterate over *AsyncIterator* and execute given function for each value.
    forEachAsync: function (iter, fn) {
      return new Promise(function (resolve) {
        var i = 0;
        function next() {
          return iter.next().then(function (result) {
            if (result.done) {
              return result.value;
            }
            fn(result.value, i++);
            return next();
          });
        }
        resolve(next());
      });
    }

  };

});

// ## CORE.JS

// **The Core module specifies the core EVT module and the client
// default settings. The library is built by adding functionality or
// sub-modules to EVT.**

define('core',[
  'utils'
], function (Utils) {
  'use strict';

  // Version is updated from package.json using `grunt-version` on build.
  var version = '4.7.2';


  // Setup default settings:

  // - _**apiUrl**: String - change the default API host_
  // - _**fullResponse**: Boolean - by default the response of every call if the JSON
  // body. However if you need to access the 'status' or 'responseHeaders' in responses
  // set this to 'true'. The full response has the structure:_

  // ```
  //  {
  //    data: <JSON data>,
  //    headers: <response headers map>
  //    status: <HTTP status code>
  //  }
  // ```

  // - _**quiet**: Boolean - set to true if you don't want EVT.js to write anything to the console_
  // - _**geolocation**: Boolean - set to true to ask for Geolocation when needed_
  // - _**interceptors**: Array - each interceptor implements 'request' and/or 'response' functions
  // that run before or after each HTTP call:_

  // ```
  //  var myInterceptor = {
  //    request: function(options){
  //      // do anything with options.data, options.headers, start spinner, etc.
  //      return options;
  //    },
  //    response: function(result){
  //      // do anything with result, stop spinner, etc. (can return promise)
  //      return result;
  //    }
  //  }
  // ```

  // - _**timeout**: Integer - set the request timeout, in ms_
  // - _**apiKey**: String - set the authorization API key used for all raw requests_
  var defaultSettings = {
    apiUrl: 'https://api.evrythng.com',
    fullResponse: false,
    quiet: false,
    geolocation: true,
    interceptors: []
  };


  // Module definition and raw API.
  var EVT = {
    version: version,

    settings: defaultSettings,

    Utils: Utils,

    Entity: {},

    // Setup method allows the developer to change overall settings for every
    // subsequent request. However, these can be overridden for each request as well.
    // Setup merges current settings with the new custom ones.
    setup: function (customSettings) {
      if(Utils.isObject(customSettings)){
        this.settings = Utils.extend(this.settings, customSettings);
      }else{
        throw new TypeError('Setup should be called with an options object.');
      }
      return this.settings;
    },


    // Use the passed plugin features by requiring its dependencies and installing it.
    use: function (plugin){
      if (Utils.isObject(plugin) && Utils.isFunction(plugin.install)) {
        var installArgs = [];

        // Inject plugin dependencies as requested, using the synchronous
        // require API for Require.js and Almond.js.
        if(plugin.$inject){
          plugin.$inject.forEach(function (dependency) {
            installArgs.push(require(dependency));
          });
        }

        plugin.install.apply(plugin, installArgs);

        return this;
      } else {
        throw new TypeError('Plugin must implement \'install()\' method.');
      }
    }
  };

  return EVT;

});

// ## LOGGER.JS

// **The Logger module is simple wrapper for console log
// that prefixes EvrythngJS's logs with a custom header.**

define('logger',[
  'core'
], function (EVT) {
  'use strict';

  var header = 'EvrythngJS';

  return {

    error: function (data) {
      if (EVT.settings.quiet === false) {
        console.error(header + ' Error:', data);
      }
    },

    info: function (data) {
      if (EVT.settings.quiet === false) {
        console.info(header + ' Info:', data);
      }
    },

    // TODO remove when callbacks deprecated
    warnCallbackDeprecation: function () {
      if (EVT.settings.quiet === false) {
        console.warn(header + ' Warning: Callbacks are deprecated, and are scheduled to be ' +
          'removed in the next major release of the library. Please, use the Promise API instead.');
      }
    }

  };

});

// ## CORS.JS

// **The CORS module implements a simple CORS request using *XmlHttpRequest*.
// For browsers that don't properly support CORS (XHR2) we use JSON-P
// instead.**

// **In Node.js the *XmlHttpRequest* is proxied using the `w3c-xmlhttprequest`
// dependency, which is installed when installing EvrythngJS NPM package.**

// *This implementation is based on Nicholas Zakas' in
// [html5rocks](http://www.html5rocks.com/en/tutorials/cors/).*

define('network/cors',[
  'core',
  'promise',
  'utils',
  'logger'
], function (EVT, Promise, Utils, Logger) {
  'use strict';

  // Helper method used to build the returned response. It parses the JSON
  // 'data' response and wraps the 'status' and 'headers' in an object in
  // case the flag `fullResponse` is enabled as a global in `EVT.settings`
  // or in this particular request. *200 OK* responses without data,
  // return *null*.
  function _buildResponse(xhr, fullResponse) {
    // XMLHttpRequest returns a not very usable single big string with all headers
    var _parseHeaders = function (headers) {
      var parsed = {};

      if (headers) {
        headers = headers.trim().split("\n");
        for (var h in headers) {
          if (headers.hasOwnProperty(h)) {
            var header = headers[h].match(/([^:]+):(.*)/);
            parsed[header[1].trim().toLowerCase()] = header[2].trim();
          }
        }
      }
      return parsed;
    };

    var headers = _parseHeaders(xhr.getAllResponseHeaders()),
      response = null;

    if (xhr.responseText) {
      var contentType = headers['content-type'];
      if (contentType && contentType.indexOf('application/json') !== -1) {
        // try to parse the response if looks like json
        try {
          response = JSON.parse(xhr.responseText);
        } catch (e) {
          response = xhr.responseText;
        }
      } else {
        response = xhr.responseText;
      }
    }

    if (fullResponse) {
      response = {
        data: response,
        headers: headers,
        status: xhr.status
      };

      // If any errors received, pull them to top level
      if (response.data && response.data.errors) {
        response.errors = response.data.errors;
        delete response.data.errors;
      }
    }

    return response;
  }

  // Forward EVRYTHNG API error and extend with URL and Method.
  function _buildError(xhr, url, method, response) {
    var errorData = response || {};

    errorData.status = xhr.status;
    errorData.url = url;
    errorData.method = method;

    return errorData;
  }


  // Create an asynchronous XHR2 object.
  function _createXhr(method, url, options) {
    var xhr = new XMLHttpRequest();

    xhr.open(method, url);

    // Setup headers, including the *Authorization* that holds the Api Key.
    for (var header in options.headers) {
      if (options.headers.hasOwnProperty(header)) {
        xhr.setRequestHeader(header, options.headers[header]);
      }
    }

    // Set timeout.
    if (options.timeout > 0) {
      xhr.timeout = options.timeout;
    }

    return xhr;
  }


  // Make the actual CORS request. Options available are defined in the [`ajax`
  // module doc](../ajax.html). Default method is `GET`, URL is relative to
  // `EVT.settings.apiUrl`, it is asynchronous by default, returns the
  // JSON data response and will not time out.
  function cors(options, successCallback, errorCallback) {

    options = options || {};

    // The browser sets the Content-type header for FormData requests
    // automatically, so we need to remove it.
    if(options.formData && options.headers){
      delete options.headers['content-type'];
    }

    var method = options.method || 'get',
      url = Utils.buildUrl(options),
      xhr = _createXhr(method, url, options),
      sendable;

    // Create form data or send simple request.
    if(options.formData){
      sendable = new FormData();
      for(var key in options.formData){
        sendable.append(key, options.formData[key]);
      }

    } else {
      // Serialise JSON data before sending.
      sendable = options.data ? JSON.stringify(options.data) : null;
    }


    // Do a normal asynchronous request and return a promise. If there
    // are callbacks execute them as well before resolving the promise.
    return new Promise(function (resolve, reject) {

      // Define internal error handler.
      function errorHandler(response) {
        if (response) {
          var errorData = _buildError(xhr, url, method, response);
          Logger.error(errorData);

          if (errorCallback) {
            Logger.warnCallbackDeprecation();
            errorCallback(errorData);
          }
          reject(errorData);
        }
      }

      // Define the response handler.
      function handler() {
        try {
          if (this.readyState === this.DONE) {

            var response = _buildResponse(this, options.fullResponse);

            // Resolve or reject promise given the response status.
            // HTTP status of 2xx is considered a success.
            if (this.status >= 200 && this.status < 300) {

              if (successCallback) {
                Logger.warnCallbackDeprecation();
                successCallback(response);
              }
              resolve(response);

            } else {
              errorHandler(response);
            }
          }
        } catch (exception) {
          // Do nothing, will be handled by ontimeout.
        }
      }

      // Set timeout handler if needed.
      if (options.timeout > 0) {
        xhr.ontimeout = function () {
          var timeoutErrResponse = {errors: ['Request timed out.']};
          errorHandler(timeoutErrResponse);
        };
      }

      // Could not execute request at all (destination unreachable, offline, ...?)
      xhr.onerror = function () {
        var networkErrResponse = {errors: ['Network error.']};
        errorHandler(networkErrResponse);
      };

      // Send the request and wait for the response in the handler.
      xhr.onreadystatechange = handler;

      xhr.send(sendable);
    });
  }

  return cors;

});

// ## JSONP.JS

// **The Jsonp module implements a simple JSON-P fetcher. JSON-P is
// deprecated until IE<10 cease to exist and only works in browsers.**

// *This implementation is based on
// [Lightweight-JSONP](https://github.com/IntoMethod/Lightweight-JSONP).*

define('network/jsonp',[
  'core',
  'promise',
  'utils',
  'logger'
], function (EVT, Promise, Utils, Logger) {
  'use strict';

  // Counter defines uniquely identified callbacks.
  var counter = 0, head;

  // Forward EVRYTHNG API error and extend with URL and Method.
  function _buildError(url, status, method, response) {
    var errorData = response || {};

    errorData.status = status;
    errorData.url = url;
    errorData.method = method;

    return errorData;
  }

  // Making the request is as simple as appending a new script tag
  // to the document. The URL has the *callback* parameter with the
  // function that will be called with the response data.
  function _load(url) {

    var script = document.createElement('script'),
      done = false;
    script.src = url;

    // Once the script has been loaded remove the tag from the document.
    script.onload = script.onreadystatechange = function() {
      if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
        done = true;
        script.onload = script.onreadystatechange = null;
        if ( script && script.parentNode ) {
          script.parentNode.removeChild( script );
        }
      }
    };

    if ( !head ) {
      head = document.getElementsByTagName('head')[0];
    }

    // Actually load script.
    head.appendChild( script );
  }


  // Jsonp method sets prepares the script url with all the information
  // provided and defines the callback handler.
  function jsonp(options, successCallback, errorCallback) {
    /*jshint camelcase:false */

    options = options || {};

    // Define unique callback name.
    var uniqueName = 'callback_json' + (++counter);

    // Send all data (including method, api key and data) via GET
    // request params.
    var params = options.params || {};
    params.callback = uniqueName;
    params.access_token = options.authorization;
    params.method = options.method || 'get';
    params.data = JSON.stringify(options.data);
    options.params = params;

    options.apiUrl = options.apiUrl && options.apiUrl.replace('//api', '//js-api');

    // Evrythng REST API default endpoint does not provide JSON-P
    // support, which '//js-api.evrythng.com' does.
    var url = Utils.buildUrl(options);

    // Return a promise and resolve/reject it in the callback function.
    return new Promise(function(resolve, reject) {

      // Attach callback as a global method. Evrythng's REST API error
      // responses always have a status and array of errors.
      window[uniqueName] = function(response){

        if (response.errors && response.status) {

          var errorData = _buildError(url, response.status, params.method, response);
          Logger.error(errorData);

          if(errorCallback) {
            Logger.warnCallbackDeprecation();
            errorCallback(errorData);
          }
          reject(errorData);

        }else {

          if(successCallback) {
            Logger.warnCallbackDeprecation();
            successCallback(response);
          }

          try {
            response = JSON.parse(response);
          } catch(e){}

          resolve(response);
        }

        // Remove callback from window.
        try {
          delete window[uniqueName];
        } catch (e) {}
        window[uniqueName] = null;
      };

      _load(url, reject);

    });
  }

  return jsonp;

});

// ## AJAX.JS

// Ajax module controls the raw request to the API, first by
// trying a CORS request and if it fails, continuing with JSON-P.**

define('transport',[
  'network/cors',
  'network/jsonp',
  'utils',
  'logger'
], function (cors, jsonp, Utils, Logger) {
  'use strict';

  return function (requestOptions, successCb, errorCb) {

    // *withCredentials* only exists on XmlHttpRequest2 objects.
    var isXHR2 = typeof new XMLHttpRequest().withCredentials === 'boolean',
      response;

    // Use XmlHttpRequest with CORS if available, otherwise fall back to JSON-P.
    if (isXHR2) {
      response = cors(requestOptions, successCb, errorCb);
    } else {
      /*TODO remove jsonp, we're building modern stuff here..*/
      Logger.info('CORS not supported, falling back to JSONP.');
      response = jsonp(requestOptions, successCb, errorCb);
    }

    return response;
  };

});

// ## API.JS

// **The API module attaches the api() method to the EVT module.

define('api',[
  'core',
  'transport',
  'promise',
  'utils'
], function(EVT, transport, Promise, Utils) {
  'use strict';

  // The api() method or EVT.api() returns a **Promise**. Nevertheless,
  // it still allows the old-styled callback API as follows:

  // - **EVT.api(options)** - options object can contain `success` or `error`
  // properties to define success and error callbacks
  // - **EVT.api(options, successCb, errorCb)**

  // Options available are:

  // ```
  // fullResponse - override fullResponse global setting (see module `core`)
  // apiUrl - override default `EVT.settings.apiUrl`
  // url - URL of the request, relative to `EVT.settings.apiUrl`
  // method - HTTP method, default: `GET`
  // authorization - Authorization header content, should contain API Key
  // success - success handler function
  // error - error handler function
  // interceptors - override interceptors pipeline. If you want to extend, use:
  //    interceptors: EVT.settings.interceptors.concat([{...}])
  // ```

  function api(options, successCallback, errorCallback) {

    // Merge options with defaults setup in `EVT.settings`.
    var requestOptions = Utils.extend({
      apiUrl: EVT.settings.apiUrl,
      url: '',
      fullResponse: EVT.settings.fullResponse,
      authorization: EVT.settings.apiKey || EVT.settings.authorization,
      timeout: EVT.settings.timeout,
      interceptors: EVT.settings.interceptors
    }, options);

    // Merge nested headers object. Allow users to use both `options.authorization`
    // and `options.headers.authorization`.
    requestOptions.headers = Utils.extend({
      authorization: requestOptions.authorization,
      accept: '*/*',
      'content-type': 'application/json'
    }, options.headers);

    // Setup callbacks giving priority to parameters.
    var successCb, errorCb, cancelled = false,
      request, response;

    request = Promise.resolve(requestOptions);

    if (Utils.isFunction(successCallback)) {
      successCb = successCallback;
    } else if (options && Utils.isFunction(options.success)) {
      successCb = options.success;
    }

    if (Utils.isFunction(errorCallback)) {
      errorCb = errorCallback;
    } else if (options && Utils.isFunction(options.error)) {
      errorCb = options.error;
    }

    // Cancel request, simply adds the flag to be processed afterwards.
    function cancel() {
      cancelled = true;
    }

    // Apply request interceptors
    if (Utils.isArray(requestOptions.interceptors)) {
      requestOptions.interceptors.forEach(function (interceptor) {
        if (interceptor.request && Utils.isFunction(interceptor.request)) {

          // Chain promises
          request = request.then(function (requestOptions) {
            if (cancelled) {
              return requestOptions;
            }

            return interceptor.request(requestOptions, cancel) || requestOptions;
          });

        }
      });
    }

    return request.then(function (requestOptions) {

      // Reject request if it has been cancelled by request interceptors.
      if (cancelled) {
        return Promise.reject({
          errors: ['Request cancelled on request interceptors.'],
          cancelled: true
        });
      }

      response = transport(requestOptions, successCb, errorCb);

      // Apply response interceptors
      if (Utils.isArray(requestOptions.interceptors)) {
        requestOptions.interceptors.forEach(function (interceptor) {
          if (interceptor.response && Utils.isFunction(interceptor.response)) {

            // Chain promises
            response = response.then(interceptor.response);

          }
        });
      }

      return response;
    });
  }

  // Attach api method to the EVT module.
  EVT.api = api;

  return EVT;

});

// ## SCOPE.JS

// **Scope defines the context in which API calls are made.
// Thus, it stores its defining API Key. Scopes send their
// respective `API Key` in their request's `Authorization` header.**

// *For example, reads on products using ApplicationScope or
// EVT.App only return the products created for that specific
// application/scope.*

define('scope/scope',[
  'core',
  'utils'
], function (EVT, Utils) {
  'use strict';

  // Scope super class constructor:

  // - _**new Scope(apiKey)** - API Key string_
  var Scope = function(apiKey){

    // Default parent scope does not have parent.
    this.parentScope = null;

    // Setup apiKey of the current Scope if it is a String.
    if(Utils.isString(apiKey)){
      this.apiKey = apiKey;
    }else{
      throw new TypeError('Scope constructor should be called with API Key.');
    }

    this.$init = EVT.api({
      url: '/access',
      authorization: this.apiKey
    });
  };

  // Return Scope factory function
  return Scope;

});

define('iterator',[
  'utils'
], function (Utils) {
  'use strict';

  /* jshint ignore:start */
  return function (request) {
    return regeneratorRuntime.mark(function gen(options) {
      var result, links, awaitResult;

      return regeneratorRuntime.async(function gen$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
        case 0:
          awaitResult = function awaitResult(requestPromise) {
            return regeneratorRuntime.async(function awaitResult$(context$4$0) {
              while (1) switch (context$4$0.prev = context$4$0.next) {
              case 0:
                context$4$0.next = 2;
                return regeneratorRuntime.awrap(requestPromise);
              case 2:
                result = context$4$0.sent;
                links = Utils.parseLinkHeader(result.headers.link);
                return context$4$0.abrupt("return", result.data);
              case 5:
              case "end":
                return context$4$0.stop();
              }
            }, null, this);
          };

          options = options || {};

          // TODO: Remove when page API is fully deprecated.
          options.params = Utils.extend({
            sortOrder: 'DESCENDING'
          }, options.params);

          context$3$0.next = 5;

          return awaitResult(request.call(this, {
            url: this.path,
            fullResponse: true
          }, options));
        case 5:
          if (!links.next) {
            context$3$0.next = 10;
            break;
          }

          context$3$0.next = 8;

          return awaitResult(request.call(this, {
            apiUrl: decodeURIComponent(links.next),
            fullResponse: true
          }));
        case 8:
          context$3$0.next = 5;
          break;
        case 10:
        case "end":
          return context$3$0.stop();
        }
      }, gen, this);
    });
  };
  /* jshint ignore:end */

});

// ## RESOURCE.JS

// **The private Resource module setups up the base resource CRUD methods.
// All requests made on a resource are scoped, meaning they will send the
// resouce's owner scope's API Key.**

// **Another important feature is that if the resource has a class/entity, which
// it allows to serialize and deserialize requests and responses. Also, with the
// `fetchCascade` option enabled, an entity knows how to automatically fetch nested
// entities.**

// *For example, the result of a .read() can be a Thng entity, that has specific
// methods to update itself, get the corresponding product or manage properties.*

define('resource',[
  'core',
  'promise',
  'iterator',
  'scope/scope',
  'utils',
  'logger'
], function (EVT, Promise, iterator, Scope, Utils, Logger) {
  'use strict';

  // Resource constructor. As this is a private module, all resource constructors
  // are called within scopes. It accepts:

  // - _**scope**: scope that owns this resource (`EVT.App`, `EVT.User`)_
  // - _**path**: relative path to `EVT.settings.apiUrl` of this resource.
  // It can represent a list or a single object (e.g. '/thngs', '/thngs/1')_
  // - _**classFn**: class of the current resource, used to serialize/deserialize
  // requests/responses. If the response does not need special treatment and the
  // JSON representation is enough, the classFn can be omitted._
  var Resource = function (scope, path, classFn) {

    // Setup scope for each of the subsequent calls.
    if (scope && scope instanceof Scope) {
      this.scope = scope;
    } else {
      throw new TypeError('Scope should inherit from Scope (e.g. EVT.App).');
    }

    // Setup path and allow to omit leading '/'.
    if (Utils.isString(path)) {

      if (path[0] != '/') {
        path = '/' + path;
      }
      this.path = path;

    } else {
      throw new TypeError('Resource must have a String path.');
    }

    // Setup class for serializing and deserializing results. It must implement
    // a *toJSON()* method. This method is in the Entity prototype. Since all of our
    // entities inherit from Entity, by default all of them will have this.
    if (Utils.isFunction(classFn)) {

      if (Utils.isFunction(classFn.prototype.toJSON)) {
        this['class'] = classFn;
      } else {
        Logger.error('Class for resource "' + path + '" does not implement toJSON().');
      }

    } else {
      Logger.info('Class for resource "' + path + '" undefined. It will not return ' +
        'proper Entities nor cascaded Entities.');
    }

  };


  // Helper method to prepare and handle a request giving the parameters passed to
  // any of the resource methods. Allow to have callbacks as separate parameters or
  // included in the options object, providing exactly the same interface as `EVT.api()`.
  function _request(requestOptions, userOptions, successCallback, errorCallback) {
    var successCb = successCallback,
      errorCb = errorCallback,
      request;

    // This verification allows not to pass any options, and have callbacks in
    // its place. It also allows passing *null* if there is no success callback.
    if (Utils.isFunction(userOptions) || userOptions === null) {

      successCb = userOptions;
      errorCb = successCallback;

    } else if (Utils.isObject(userOptions)) {

      // If options is an object, merge it with the request options. Callbacks
      // can be included in this object or as separate parameters (same as
      // `EVT.api()`).
      requestOptions = Utils.extend(requestOptions, userOptions);

    }

    // Use current scope's API key to perform the request.
    requestOptions.authorization = this.scope.apiKey;

    // If parentScope is set to operator scope, use the operator API key.
    if (EVT.Operator && this.scope.parentScope instanceof EVT.Operator) {
      requestOptions.authorization = this.scope.parentScope.apiKey;

      // If we're working in application scope as an operator,
      // we need to send the application id as a parameter.
      if (this.scope instanceof EVT.App) {
        requestOptions.params = requestOptions.params || {};
        requestOptions.params.project = this.scope.project;
      }
    }

    // Actually make the request and handle its response, by forwarding to
    // the raw `EVT.api()` method.
    request = EVT.api(requestOptions, successCb, errorCb);

    return _handleResponse.call(this, request);
  }

  // Handle asynchronous requests based on the custom or default options.
  function _handleResponse(request) {
    var $this = this;

    // Before returning the response, parse it.
    // This success handler is called inside the Promise, so we need to
    // keep the current context.

    // Also, By not providing an error interceptor, we will let the error
    // propagate from `EVT.api()` to the `resource.read()` promise error
    // handler
    return request.then(function (response) {
      return $this.parse(response);
    });
  }


  // ### Resource API

  // Any resource create in a scope will inherit these methods. However, it
  // is possible to add custom methods to a resource in a custom Entity
  // *resourceConstructor* (e.g. refer to the [`entity/user` doc](entity/user.html),
  // where a *.validate()* method is added to every User resource).

  // **Remember that all CRUD methods forward to `EVT.api()` which returns a Promise.**

  // #### Parse

  // Parse a given response into an instance of this resource's
  // class/entity, if possible. An entity always keeps a reference to its
  // mother resource, in order to alias methods (e.g. the *entity.update()*
  // method calls the mother *resource.update(entity.toJSON())* ).
  // We expect the response to be one of these:
  // * an object containing results (array of or single object) in "data",
  // * an array of results
  // * a single result object
  Resource.prototype.parse = function (response) {
    var parsedResponse = null;

    if (this['class'] && response) {

      var resource = this;

      if (Utils.isArray(response)) {

        // Response is array of results, parse to an array of entities.
        parsedResponse = response.map(this.parse, this);

      } else if (Utils.isObject(response)) {
        if (response.hasOwnProperty('data')) {
          // Full response - it is an object and includes "data", parse just the data.

          parsedResponse = response;
          parsedResponse.data = resource.parse(parsedResponse.data);

          // If response contains results count header, add a shortcut to it
          if (Utils.isObject(parsedResponse.headers) && Utils.isString(parsedResponse.headers['x-result-count'])) {
            parsedResponse.count = parseInt(parsedResponse.headers['x-result-count']);
          }

        } else {

          // Response is a single result, parse to single entity.
          var updatedPath = this.path,
            updatedResource;

          // Add entity id to resource path. If it is already there - do nothing.
          if (response.id) {
            updatedPath += (updatedPath.indexOf(response.id) === -1) ? '/' + response.id : '';
          }

          updatedResource = new Resource(this.scope, updatedPath, this['class']);

          parsedResponse = new this['class'](response, updatedResource);
        }
      } else {
        // Response is most likely a string, just forward it
        parsedResponse = response;
      }

    } else {
      // We don't have enough information to parse the response, so just forward it.
      parsedResponse = response;
    }
    return parsedResponse;
  };


  // #### Jsonify

  // The opposite of parse. It takes an entity and returns only the JSON
  // part of it, used to make the calls to the REST API. If the passed object
  // is a plain object, do nothing.
  Resource.prototype.jsonify = function (classObject) {

    if (this['class'] && (classObject instanceof this['class'])) {
      return classObject.toJSON();
    } else {
      return classObject || {};
    }

  };


  // #### Create

  // Create sends a `POST` request to the REST API with the provided object data.
  // It always returns an entity or JSON object on success. It accepts the
  // following parameters:

  // - _**create(data)**: just send data (entity or plain JSON), no options,
  // no callbacks_
  // - _**create(data, options)**: no callbacks or they are included in options_
  // - _**create(data, options, successCb, errorCb)**: all explicit params_
  // - _**create(data, successCb, errorCb)**: no options, just callbacks_
  Resource.prototype.create = function (data, options, successCallback, errorCallback) {
    if (!data || Utils.isFunction(data)) {
      throw new TypeError('Create method should have payload.');
    }

    var requestOptions = {
      url: this.path,
      method: 'post',
      data: this.jsonify(data)
    };

    return _request.call(this, requestOptions, options, successCallback, errorCallback);

  };


  // #### Read

  // Read sends a `GET` request to the REST API. It always returns an entity
  // or JSON object on success. It accepts the following parameters:

  // - _**read()**: no options, no callbacks_
  // - _**read(options)**: no callbacks or they are included in options_
  // - _**read(options, successCb, errorCb)**: all explicit params_
  // - _**read(successCb, errorCb)**: no options, just callbacks_
  Resource.prototype.read = function (options, successCallback, errorCallback) {

    var requestOptions = {
      url: this.path
    };

    return _request.call(this, requestOptions, options, successCallback, errorCallback);

  };


  // #### Update

  // Update sends a `PUT` request to the REST API. It always returns an entity
  // or JSON object on success.

  // **The interface is the same as _.create()_**
  Resource.prototype.update = function (data, options, successCallback, errorCallback) {

    var requestOptions = {
      url: this.path,
      method: 'put',
      data: this.jsonify(data)
    };

    return _request.call(this, requestOptions, options, successCallback, errorCallback);

  };


  // #### Delete

  // Delete sends a `DELETE` request to the REST API. It always returns an *null*
  // response on success.

  // **The interface is the same as _.read()_**
  Resource.prototype['delete'] = function (options, successCallback, errorCallback) {

    var requestOptions = {
      url: this.path,
      method: 'delete'
    };

    return _request.call(this, requestOptions, options, successCallback, errorCallback);

  };


  // #### Iterator

  // Iterator is an async generator that cycles through all the 'pages' of a
  // resource, yielding all the results asynchronously.

  // Eventually, in ES7 (https://github.com/tc39/proposal-async-iteration),
  // looping through all the items would become:

  // ```javascript
  // for await(let thngs of user.thng().iterator()){
  //  console.log(thngs);
  // }
  // ```

  // - _**iterator()**: no options_
  // - _**iterator(options)**: forward options to initial request_
  Resource.prototype.iterator = iterator(_request);


  // Given we don't have subclasses of Resource, this static factory method
  // allows to generate a resource constructor given a path and class.

  // By default all resource constructors receive a string ID for single
  // entity resources.
  Resource.constructorFactory = function (path, Entity, nestedResources) {
    return function (id) {
      var fullPath = path || "";

      if (id) {
        if (Utils.isString(id)) {
          fullPath += '/' + encodeURIComponent(id);
        } else {
          throw new TypeError('ID must be a string.');
        }
      }

      var resource = new Resource(this, fullPath, Entity);

      if (nestedResources) {

        // Allow nested resources in single call.
        // E.g. users can access to a thng's nested data directly with:

        //```
        //  user.thng().property().read(...);
        //  user.thng().action().read(...);
        //```

        // instead of fetching the Thng first.
        var rawEntity = new Entity({id: id}, resource);

        if (Utils.isArray(nestedResources)) {
          nestedResources.forEach(function (nestedResource) {

            // If the entity has it, then attach to this resource as well.
            if (rawEntity[nestedResource]) {
              resource[nestedResource] = function () {
                return rawEntity[nestedResource].apply(rawEntity, arguments);
              };
            }

          });
        } else {
          throw new TypeError('Nested resources should be an array.');
        }
      }

      return resource;

    };
  };


  return Resource;

});

// ## ENTITY.JS

// **Entity is a private super class that implements base common methods for
// all Evrythng objects. It establishes the way objects are converted
// to JSON, and provide an *update()* and *delete()* method for all entities.**

define('entity/entity',[
  'resource',
  'utils'
], function (Resource, Utils) {
  'use strict';

  // The entity constructor, and therefore all the standard inheritances,
  // accepts:

  // - _**new Entity()**: create an empty entity_
  // - _**new Entity(obj)**: entity with merged obj properties_
  // - _**new Entity(resource)**: empty entity bound to a Resource_
  // - _**new Entity(obj, resource)**: fully build entity bound to a Resource_

  // *Nevertheless, an Entity without Resource cannot request any
  // update or delete. It can however be passed to resources as
  // 'payload' instead of JSON.*

  // ```js
  //  var prod = new EVT.Entity.Product({ foo: 'bar' };
  //  // prod.update() // throws error
  //  app.product().create(prod); // create product
  // ```

  var Entity = function (objData, resource) {

    if(Utils.isObject(objData)){

      if(objData instanceof Resource){
        this.resource = objData;
      } else {
        this.resource = resource;
        Utils.extend(this, objData, true);
      }

    }
  };

  // Return the JSON object that is stored in engine. All non-function properties
  // except *resource* are properties of the object.
  Entity.prototype.toJSON = function () {
    var json = {};

    for(var prop in this){
      if(this.hasOwnProperty(prop)){
        if(Utils.isDefined(this[prop]) && !Utils.isFunction(this[prop]) && prop != 'resource'){
          json[prop] = this[prop];
        }
      }
    }

    return json;
  };

  // Every entity can update itself via its resource reference. It does so by
  // passing its JSON representation to the *resource.update()*.

  // An entity update, as every request, returns a Promise. Although it also
  // allows callbacks as:

  // - _**update()**: simple update itself with modified properties_
  // - _**update(obj)**: update itself with new properties_
  // - _**update(obj, successCb, errorCb)**: previous, with callbacks_
  // - _**update(successCb, errorCb)**: update itself and use callbacks_
  Entity.prototype.update = function (obj) {
    if(this.resource){

      var args = arguments, $this = this;

      // No object is passed, shift arguments. Add its JSON representation
      // as the first argument.
      if(obj === null || !obj || Utils.isFunction(obj)) {
        args = Array.prototype.slice.call(arguments, 0);
        args.unshift(this.toJSON());
      }

      return this.resource.update.apply(this.resource, args)
        .then(function (updated) {

          // Update itself with the result and return raw response from API.
          Utils.extend($this, updated, true);
          return updated;

        });

    } else {
      throw new Error('This entity has no resource');
    }
  };


  // Delete method also accepts callbacks as:

  // - _**delete()**: handle with promise_
  // - _**delete(successCb, errorCb)**: handle with callbacks_
  Entity.prototype['delete'] = function () {
    if(this.resource) {
      return this.resource['delete'].apply(this.resource, arguments);
    } else {
      throw new Error('This entity has no resource');
    }
  };


  return Entity;

});

// ## PROPERTY.JS

// **Property is a common Entity for Thngs and Products. It is always a
// nested resource and allows some simplified parameters, easing the
// update of properties and making it more fluent/literal.**

define('entity/property',[
  'core',
  './entity',
  'resource',
  'utils'
], function (EVT, Entity, Resource, Utils) {
  'use strict';

  // Setup Property inheritance from Entity.
  var Property = function () {
    Entity.apply(this, arguments);
  };

  Property.prototype = Object.create(Entity.prototype);
  Property.prototype.constructor = Property;


  // The property update normalization of arguments allows to
  // make easier and more intuitive calls, such as:

  // - Single property update:

  // ```
  //  thng.property('status').update('off');
  //  thng.property('status').update({
  //    value: 'off'
  //  });
  // ```

  // - Multi property update:

  // ```
  //  thng.property().update({
  //    status: 'off',
  //    level: '80'
  //  });
  // ```
  function _normalizeArguments(args) {
    var data = args[0];

    if(Utils.isString(data) || typeof data === 'number' || typeof data === 'boolean'){

      // Update single property using string.
      args[0] = [{
        value: data
      }];

    }else if(Utils.isObject(data)) {

      if (Utils.isDefined(data.value)) {

        // Update single property using object notation.
        args[0] = [data];

      } else {

        // Update multiple properties, creating an object for
        // each key-value pair.
        args[0] = [];
        for (var key in data) {
          args[0].push({
            key: key,
            value: data[key]
          });
        }
      }
    }

    return args;
  }


  // Attach class to EVT module.
  EVT.Entity.Property = Property;


  return {

    'class': Property,

    resourceConstructor: function (property) {

      if(!this.resource) {
        throw new Error('This Entity does not have a Resource.');
      }

      var path = this.resource.path + '/properties',
        resource;

      if(property){
        if(Utils.isString(property)){
          path += '/' + encodeURIComponent(property);
        }else{
          throw new TypeError('Property must be a key/name string');
        }
      }

      resource = new Resource(this.resource.scope, path, EVT.Entity.Property);

      // Override property resource create/update to allow custom values params.
      // See *_normalizeArguments()*.
      resource.create = function () {
        return Resource.prototype.create.apply(this, _normalizeArguments(arguments));
      };

      resource.update = function () {
        return Resource.prototype.update.apply(this, _normalizeArguments(arguments));
      };

      return resource;
    }

  };
});

// ## ACTION.JS

// **The Action Entity represents an action in the Engine. It inherits
// from Entity and overload the resource's *create()* method to allow
// empty parameters (no payload).**

define('entity/action',[
  'core',
  './entity',
  'scope/scope',
  'resource',
  'utils',
  'logger'
], function (EVT, Entity, Scope, Resource, Utils, Logger) {
  'use strict';

  // Setup Action inheritance from Entity.
  var Action = function () {
    Entity.apply(this, arguments);
  };

  Action.prototype = Object.create(Entity.prototype);
  Action.prototype.constructor = Action;


  // If the action object is empty (or a callback), generate the
  // simplest action object that just needs the type of the action,
  // which can be obtained from the resource's path.
  function _normalizeArguments(obj) {
    var args = arguments;

    if (!obj || Utils.isFunction(obj)) {
      args = Array.prototype.slice.call(arguments, 0);
      args.unshift({});
    }

    return args;
  }

  // Add the given entity identifier to an object (params or data).
  function _addEntityIdentifier(entity, obj) {
    if (entity.constructor === EVT.Entity.Product) {
      obj.product = entity.id;
    } else if (entity.constructor === EVT.Entity.Thng) {
      obj.thng = entity.id;
    } else if (entity.constructor === EVT.Entity.Collection) {
      obj.collection = entity.id;
    }

    return obj;
  }

  // Set the Entity ID of the entity receiving the action as well
  // as the specified action type in the action data.
  function _fillAction(entity, actionObj, actionType) {

    if (!(entity instanceof Scope) && !entity.id) {
      throw new Error('This entity does not have an ID.');
    }

    var ret = actionObj;

    if (Utils.isArray(actionObj)) {

      ret = actionObj.map(function (singleAction) {
        return _fillAction(entity, singleAction, actionType);
      });

    } else {
      ret.type = actionType !== 'all' && actionType ||  actionObj.type || '';
      _addEntityIdentifier(entity, ret);
    }

    return ret;
  }

  // Use HTML5 geolocation if explicitly defined in the options
  // or set in the global settings.
  function _useBrowserGeolocation(options) {
    return (options && options.geolocation !== undefined)?
      options.geolocation : EVT.settings.geolocation;
  }


  // Attach class to EVT module.
  EVT.Entity.Action = Action;


  // Return the resource factory function. Actions have a custom *resource
  // constructor* that needs an action type and allows an optional ID.

  // - _**product.action('scans')**: creates path '/product/<id>/actions/scans'_
  // - _**product.action('scans', '1')**: creates path '/product/<id>/actions/scans/1'_
  return {

    'class': Action,

    resourceConstructor: function (actionType, id) {
      var path, resource,
        context = this,
        scope = this instanceof Scope ? this : this.resource.scope;

      if (actionType) {
        if (Utils.isString(actionType)) {
          var relativePath = '/actions/' + actionType;

          // Scopes use the absolute path, while Resources use the relative path.
          // Devices create a Resource for its Thng dynamically, which makes them
          // in fact behave like a Resource.
          path = this instanceof Scope ? relativePath : this.resource.path + relativePath;

        } else {
          throw new TypeError('Action type must be a name string');
        }
      } else {
        throw new TypeError('Action type cannot be empty.');
      }

      // Create a resource constructor dynamically and call it with this action's ID.
      resource = Resource.constructorFactory(path, EVT.Entity.Action).call(scope, id);

      // Overload Action resource *create()* method to allow empty object.
      resource.create = function() {

        var $this = this,
          args = _normalizeArguments.apply(this, arguments);

        args[0] = _fillAction(context, args[0], actionType);

        // If geolocation setting is turned on, get current position before
        // registering the action in the Engine.
        if (_useBrowserGeolocation(args[1])) {

          return Utils.getCurrentPosition().then(function (position) {

            args[0].location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            args[0].locationSource = 'sensor';

            return Resource.prototype.create.apply($this, args);

          }, function (err) {

            // Unable to get position, just inform the reason in the console.
            Logger.info(err);

            return Resource.prototype.create.apply($this, args);

          });

        } else {
          return Resource.prototype.create.apply($this, args);
        }
      };

      return resource;
    }

  };
});

// ## PRODUCT.JS

// **The Product is a simple Entity subclass that provides a nested
// Property Resource.**

define('entity/product',[
  'core',
  './entity',
  'resource',
  './property',
  './action',
  'utils'
], function (EVT, Entity, Resource, Property, Action, Utils) {
  'use strict';

  // Setup Product inheritance from Entity.
  var Product = function () {
    Entity.apply(this, arguments);
  };

  Product.prototype = Object.create(Entity.prototype);
  Product.prototype.constructor = Product;


  // Extend Product API by exposing a Property Resource, allowing to
  // manage the properties of this product with a resource pattern.
  // Expose an Action resource as well, for managing Products actions.
  Utils.extend(Product.prototype, {

    property: Property.resourceConstructor,

    action: Action.resourceConstructor

  }, true);


  // Attach class to EVT module.
  EVT.Entity.Product = Product;


  return {

    'class': Product,

    resourceConstructor: Resource.constructorFactory('/products', EVT.Entity.Product, ['property', 'action'])

  };
});

// ## USER.JS

// **The User entity represents the app users stored in the Engine.
// It inherits from Entity and adds a new resource's *validate()* method,
// as well as a *self.validate()* to allow to validate users.**

define('entity/user',[
  'core',
  './entity',
  'resource',
  'utils'
], function (EVT, Entity, Resource, Utils) {
  'use strict';

  // Setup User inheritance from Entity.
  var User = function (objData) {

    // Rename user object argument's *evrythngUser* property to
    // entity-standard-*id*.
    var args = arguments;
    if(objData.evrythngUser){
      objData.id = objData.evrythngUser;
      delete objData.evrythngUser;
    }
    args[0] = objData;

    Entity.apply(this, args);
  };

  User.prototype = Object.create(Entity.prototype);
  User.prototype.constructor = User;

  // The validate method sends a `POST` request to the validate
  // endpoint of a new user. This is only valid when the User
  // resource path is *'/auth/evrythng/users/1'*.
  function validate(activationCode) {

    if(!activationCode || !Utils.isString(activationCode)) {
      throw new Error('Activation code must be a string.');
    }
    if (this.type && this.type === 'anonymous') {
      throw new Error("Anonymous users can't be validated.");
    }

    var scope = this.scope, path = this.path;

    // If validate is called from the entity, the scope is the
    // resource's scope
    if(this.id){
      scope = this.resource.scope;
      path = this.resource.path + '/' + this.id;
    }

    // Activate newly created user.
    return EVT.api({
      url: path + '/validate',
      method: 'post',
      authorization: scope.apiKey,
      data: {
        activationCode: activationCode
      }
    });
  }

  // Create an anonymous user
  // It's a somewhat different process since anonymous users are created
  // "good to go", they don't need validation.
  function _createAnonymousUser() {
    var $this = this;

    return EVT.api({
      url: this.path,
      method: 'post',
      params: {
        anonymous: true // must be set to create anonymous user
      },
      data: {},
      authorization: this.scope.apiKey
    }).then(function (access) {
        // Create User Scope
        return new EVT.User({
          id: access.evrythngUser,
          apiKey: access.evrythngApiKey,
          type: 'anonymous'
        }, $this.scope);
    });
  }


  // Extend User API to allow to validate itself.
  Utils.extend(User.prototype, {

    validate: function () {
      return validate.call(this, this.activationCode);
    }

  }, true);


  // Attach class to EVT module.
  EVT.Entity.User = User;


  // The User resource constructor is a custom constructor that
  // returns the constructor. This allows the path to be variable.

  // GET '/users' and GET '/auth/evrythng/users' return the same
  // entity structure but there are access and back-end differences.
  return {

    'class': User,

    resourceConstructor: function (customPath) {

      var path = customPath || '/users';

      // Return the factory function.
      return function (id) {

        var resource = Resource.constructorFactory(path, EVT.Entity.User).call(this, id);

        // Add *validate()* method to the resource as well
        resource.validate = function () {
          return validate.apply(this, arguments);
        };

        // Overload update() method to disallow updating of anonymous users (they're read-only)
        resource.update = function() {
          if (this.scope.type && this.scope.type === 'anonymous'){
            throw new Error("Anonymous users are read-only.");
          }
          return Resource.prototype.update.apply(this, arguments);
        };

        // Overload User resource *create()* method to allow creating anonymous users
        resource.create = function () {

          var $this = this,
              data = arguments[0];

          // the "anonymous" argument has higher priority, rest will be ignored (consistent with API)
          if (Utils.isObject(data) && data.anonymous === true) {
            return _createAnonymousUser.call($this);
          } else {
            return Resource.prototype.create.call($this, data);
          }
        };

        return resource;
      };
    }

  };
});

// ## PLACE.JS

// **The Place is a simple Entity subclass representing the REST API
// Place object.**

define('entity/place',[
  'core',
  './entity',
  'resource',
  'scope/scope',
  'utils',
  'logger'
], function (EVT, Entity, Resource, Scope, Utils, Logger) {
  'use strict';

  // Setup Place inheritance from Entity.
  var Place = function () {
    Entity.apply(this, arguments);
  };

  Place.prototype = Object.create(Entity.prototype);
  Place.prototype.constructor = Place;

  function _normalizeArguments(args) {
    var data = args[0];

    if (!data || Utils.isFunction(data)) {
      // Add empty data object
      args = Array.prototype.slice.call(args, 0);
      args.unshift({});
    }

    return args;
  }

  // Attach class to EVT module.
  EVT.Entity.Place = Place;

  return {

    'class': Place,

    resourceConstructor: function (id) {
      var resource = Resource.constructorFactory('/places', EVT.Entity.Place).call(this, id);

      // Overload resource read() to send current location by default
      resource.read = function () {
        var $this = this,
            args = _normalizeArguments(arguments),
            params = args[0].params || {};

        if (!id && !params.lat && !params.lon && EVT.settings.geolocation) {
          // If geolocation setting is turned on, get current position
          return Utils.getCurrentPosition().then(function (position) {
            params.lat = position.coords.latitude;
            params.lon = position.coords.longitude;

            args[0].params = params;
            return Resource.prototype.read.apply($this, args);

          }, function (err) {
            // Unable to get position, just inform the reason in the console.
            Logger.info(err);
            return Resource.prototype.read.apply($this, args);
          });

        } else {
          return Resource.prototype.read.apply($this, args);
        }
      };

      return resource;
    }
  };
});

// ## FACEBOOK.JS

// **The Facebook module exports wrapped *login*, *logout* and *init* methods
// from the Facebook SDK, always returning Promises.**

define('social/facebook',[
  'promise',
  'utils'
], function (Promise, Utils) {
  'use strict';
  /*global FB*/

  // Load Facebook SDK asynchronously. This means that by default
  // it is not bundled with EvrythngJS, and is only loaded if an application
  // needs Facebook authentication.

  // The *init()* method also gets the current user information in one
  // is already logged in.
  function init(appId, config) {

    // Return promise and resolve once user status is retrieved.
    return new Promise(function(resolve){

      // Notice that the FB SDK only works in the browser. Thus, an Evrtyhng
      // application cannot use Facebook authentication if it is not intended
      // to run in the browser, as well.
      window.fbAsyncInit = function () {

        FB.init(Utils.extend({
          appId: appId,
          version: 'v2.8'
        }, config, true));

        // Get Login status and user info if connected. Build response as we
        // fetch more information.
        FB.getLoginStatus(function (response) {

          /*response = authResponse + status*/
          _getUser(response).then(function(userResponse){

            /*userResponse = authResponse + status + user*/
            resolve(userResponse);

          });

        });
      };

      // Inject Facebook SDK script in document (see
      // [Facebook Developer Docs](https://developers.facebook.com/docs/javascript/quickstart/v2.0)).
      (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));

    });
  }

  // Invoke standard Facebook login popup, using specified options.
  function login(options) {

    // Return promise and resolve once user info is retrieved.
    return new Promise(function (resolve, reject) {

      FB.login(function (response) {

        /*response = authResponse + status*/
        _getUser(response).then(function (userResponse) {

          if(userResponse.user) {

            /*userResponse = authResponse + status + user*/
            resolve(userResponse);

          } else {

            // Reject login promise if the user canceled the FB login.
            reject(userResponse);

          }

        });

      }, options);

    });
  }

  // Invoke Facebook's logout and return promise.
  function logout() {

    return new Promise(function (resolve) {
      FB.logout(resolve);
    });
  }

  // Fetch user info from Facebook if user is successfully connected.
  function _getUser(response) {

    if(response.status == 'connected') {

      // Return a Promise for the response with user details.
      return new Promise(function (resolve) {

        // Until here, `response` was FB's auth response. Here
        // we start to build bigger response by appending the Facebook's
        // user info in the `user` property.
        FB.api('/me', {
          fields: [
            'id',
            'first_name',
            'last_name' ,
            'gender',
            'link',
            'picture',
            'locale',
            'name',
            'timezone',
            'updated_time',
            'verified'
          ].toString()
        }, function (userInfo) {
          resolve(Utils.extend(response, { user: userInfo }));
        });

      });

    }else{

      // Return an already resolved promise.
      return new Promise(function (resolve) {
        resolve(response);
      });

    }

  }

  // Expose only the higher level methods.
  return {
    init: init,
    login: login,
    logout: logout
  };

});

// ## AUTHENTICATION.JS

// **Authentication provides a complete abstraction layer on top of
// the provided *'/auth/...'* endpoints in the REST API. Logging in with
// Evrythng or Facebook uses the same method and provide a similar response.**

// **Authentication with Facebook needs an app that has been created using the
// `facebook: true` option, which will load and init the Facebook SDK.**

define('authentication',[
  'core',
  'promise',
  'social/facebook',
  'utils',
  'logger'
], function (EVT, Promise, Facebook, Utils, Logger) {
  'use strict';

  // Login into Evryhtng. This method is attached to the `EVT.App` API methods.
  // Currently allowed authentication methods are **evrythng** and **facebook**.
  // The login  accepts:

  // - _**login('facebook')**: the normal third-party Facebook login pop-up_
  // - _**login('facebook', fbOptions)**: use fbOptions to pass facebook scope
  // permissions (see the
  // [Facebook login API reference](https://developers.facebook.com/docs/reference/javascript/FB.login/v2.0))._
  // - _**login('facebook', fbOptions, successCb, errorCb)**: same as previous,
  // with callbacks_
  // - _**login('facebook', successCb, errorCb)**: no custom Facebook options_
  // - _**login('evrythng', evtCredentials)**: evtCredentials is an object with
  // `email` or `id` and `password` properties_
  // - _**login('evrythng', evtCredentials, successCb, errorCb)**: same as previous,
  // with callbacks_

  // The *evrythng* login methods allow to omit the first parameter. Thus, the
  // following authenticates with Evrythng:

  // ```
  //  app.login({
  //    email/id: "userEmailOrId",
  //    password: "pass"
  //  });
  // ```

  function login(type, customOptions, successCallback, errorCallback) {
    var successCb = successCallback,
      errorCb = errorCallback;

    if(!type){
      throw new TypeError('Credentials (for Evrythng) or type (for Third party) are missing.');
    }

    // Authenticate using third parties' OAuth.
    if(Utils.isString(type)){

      if(type === 'facebook'){
        return _loginFacebook.call(this, customOptions, successCb, errorCb);

      }else if(type === 'evrythng') {
        return _loginEvrythng.call(this, customOptions, successCb, errorCb);
      }

      /*TODO: add more authentication methods here.*/

    }else{

      // Evrythng login does not need first param. Simply call *_loginEvrythng()*
      // with shifted arguments.
      return _loginEvrythng.call(this, type, customOptions, successCb);

    }
  }


  // Login with Facebook. Custom Options are optional.

  // **Default Facebook scope permission is simply *'email'*. If your application
  // needs more than that, please read about Facebook login options and permissions
  // on their
  // [Developer Docs](https://developers.facebook.com/docs/reference/javascript/FB.login/v2.0)**.
  function _loginFacebook(customOptions, successCallback, errorCallback) {
    var options = {scope: 'email'},
      $this = this;

    // If there are no facebook custom options, callbacks can start in first param.
    if(Utils.isFunction(customOptions) || customOptions === null){

      var tmp = successCallback;
      successCallback = customOptions;
      errorCallback = tmp;

    }else if(Utils.isObject(customOptions)){

      // If there are custom FB options, use this instead of the defaults.
      options = customOptions;

    }

    // Return promise and resolve only once authenticated with EVRYTHNG.
    return new Promise(function(resolve, reject) {

      // Login using Facebook with options above.
      Facebook.login(options).then(function (userResponse) {

        // If successful, authenticate with Evrythng, apply *successCb* and resolve
        // promise. Our own *Facebook.login()* method (defined in the [`social/facebook`
        // module](social/facebook.html)) already resolves with the user information.
        // In this case, we add Evrythng access data to this already wrapped response.
        authFacebook.call($this, userResponse).then(function (fullResponse) {

          if (successCallback) {
            Logger.warnCallbackDeprecation();
            successCallback(fullResponse);
          }
          resolve(fullResponse);

        });

      }, function (response) {

        // Login was not successful, apply *errorCb* and reject promise. Response
        // has Facebook's *authResponse* and *status* objects.
        if (errorCallback) {
          Logger.warnCallbackDeprecation();
          errorCallback(response);
        }
        reject(response);

      });

    });
  }


  // Login with Evrythng using either the *email* or *id* properties.
  function _loginEvrythng(credentials, successCallback, errorCallback) {

    if(!credentials || Utils.isFunction(credentials)) {
      throw new TypeError('Credentials are missing.');
    }

    // Send the authentication request to the REST API, which is a Promise.
    // Note that the context is passed from the above *app.login()* method
    // until the raw call in order to pass the correct scope's Api Key.
    return _authEvrythng.call(this, credentials).then(function (userResponse) {

      // Login was successful, apply callback and propagate response to the
      // next promise handler.
      if(successCallback) {
        Logger.warnCallbackDeprecation();
        successCallback(userResponse);
      }
      return userResponse;

    }, function (response) {

      // Login was not successful, call error callback and re-throw error.
      if(errorCallback) {
        Logger.warnCallbackDeprecation();
        errorCallback(response);
      }
      throw response;

    });
  }

  // Send authentication request with the Facebook auth token. This method is
  // used on explicit login and when Facebook is initialized in the `EVT.App`
  // constructor.
  function authFacebook(response) {
    var $this = this;

    return EVT.api({
      url: '/auth/facebook',
      method: 'post',
      data: {
        access: {
          token: response.authResponse.accessToken
        }
      },
      authorization: this.apiKey
    }).then(function (access) {

      // Create User Scope with the user information and Api Key returned
      // from the REST API.
      var user = new EVT.User({
        id: access.evrythngUser,
        apiKey: access.evrythngApiKey
      }, $this);

      // Fetch user dto from the platform and then
      // return initial response
      // TODO: Introduce proper read when DEV-190 merged
      return EVT.api({
        url: '/users/' + user.id,
        authorization: user.apiKey
      }).then(function(userDetails) {
        // Prepare resolve object. Move Facebook user data to
        // 'user.facebook' object
        Utils.extend(user, { facebook: response.user }, true);

        // Merge user data from the platform to User Scope
        Utils.extend(user, userDetails, true);

        response.user = user;

        return response;
      });
    });
  }

  // Send authentication request using Evrythng credentials.
  function _authEvrythng(credentials) {
    var $this = this;

    return EVT.api({
      url: '/auth/evrythng',
      method: 'post',
      data: credentials,
      authorization: this.apiKey
    }).then(function (access) {

      // Once it is authenticated, get this user information as well.
      return EVT.api({
        url: '/users/' + access.evrythngUser,
        authorization: access.evrythngApiKey
      }).then(function (userInfo) {

        // Keep nested success handler because we also need the *access*
        // object returned form the previous call to create the User Scope.
        var userObj = Utils.extend(userInfo, {
          id: access.evrythngUser,
          apiKey: access.evrythngApiKey
        });

        // Create User Scope
        var user = new EVT.User(userObj, $this);

        return { user: user };

      });

    });
  }


  // The *logout()* method behaves similarly to *login()*. The user should
  // specify the type of logout they want (**_evrythng_ is default**).

  // If an application logs in with Facebook, and simply logs out of
  // Evrythng, then the Facebook user will continue connected until its FB
  // token expires (which is most of the times not what you want).

  // **As a good practice, if you log into an app with Facebook, also log
  // out with Facebook. This allows app users to switch Facebook accounts.**
  function logout(type, successCallback, errorCallback) {

    if(type && Utils.isString(type)){

      if(type === 'facebook') {
        return _logoutFacebook.call(this, successCallback, errorCallback);

      } else if(type === 'evrythng') {
        return _logoutEvrythng.call(this, successCallback, errorCallback);
      }

    }else{
      return _logoutEvrythng.call(this, type, successCallback);
    }

  }

  // Logging out with Facebook, logs out out from Facebook and also from
  // Evrythng.
  function _logoutFacebook(successCallback, errorCallback) {
    var $this = this;

    return Facebook.logout().then(function () {

      // If successful (always), also logout from Evrythng.
      return _logoutEvrythng.call($this, successCallback, errorCallback);

    });
  }


  function _logoutEvrythng(successCallback, errorCallback) {

    return EVT.api({
      url: '/auth/all/logout',
      method: 'post',
      authorization: this.apiKey

    }).then(function (response) {

      if(successCallback) {
        Logger.warnCallbackDeprecation();
        successCallback(response);
      }
      return response;

    }, function (err) {

      // If the logout from Evrythng fails, by some reason, throw error
      // which would go to the promise error handler of the caller.
      if(errorCallback) {
        Logger.warnCallbackDeprecation();
        errorCallback(err);
      }
      throw err;

    });
  }

  // Expose only the higher level methods.
  return {
    login: login,
    logout: logout,
    authFacebook: authFacebook
  };

});

// ## APPLICATION.JS

// **Here it is defined the ApplicationScope or `EVT.App`. EVT.App
// is a sub-class of scope and it defines the public API that an App Api Key
// can access to.**

// An Application scope currently has access to:

// - Product resource (`R`)
// - Action resource (`C`) - Scans only
// - App User resource (`C`)
// - Login

define('scope/application',[
  'core',
  './scope',
  'entity/product',
  'entity/action',
  'entity/user',
  'entity/place',
  'authentication',
  'social/facebook',
  'utils',
  'logger'
], function (EVT, Scope, Product, Action, User, Place, Authentication,
             Facebook, Utils, Logger) {
  'use strict';

  // Application Scope constructor. It can be called with the parameters:

  // - _**new EVT.App(apiKey)** - API Key string_
  // - _**new EVT.App(options)** - Options object should contain `apiKey`,
  // and optionally `facebook` boolean. Passing `facebook: true` automatically
  // initializes Facebook SDK with this application's FB App Id - setup in
  // EVRYTHNG's Dashboard Project Preferences._
  var ApplicationScope = function(obj, parentScope){

    var $this = this;

    // Setup base Scope with the provided API Key.
    if(Utils.isObject(obj)){
      Scope.call(this, obj.apiKey);
      Utils.extend(this, obj, true);
    }else{
      Scope.call(this, obj);
    }

    // Set parent scope
    if (parentScope instanceof Scope) {
      this.parentScope = parentScope;
    }

    // Get app information asynchronously from the Engine using already
    // defined scope. Use **new EVT.App('apiKey').$init.then(success)** if need
    // to wait for app information.
    this.$init = this.$init
      .then(function () {
        return EVT.api({
          url: '/applications/me',
          authorization: $this.apiKey
        });
      })
      .then(function(application) {
        delete application.appApiKey;
        return application;
      })
      .then(Utils.extendCurried($this))
      .catch(function () {

        var error = 'There is no application with this API Key.';
        Logger.error(error);
        throw new Error(error);

      })
      .then(function (app) {

        // If using Facebook, the $init promise is only resolved after FB
        // is initialized and user login status is retrieved. In this situation,
        // the resolved object of `$init` is a wrapped object:

        // ```
        //  {
        //    status: <Facebook's connected status>,
        //    authResponse: <Facebook's auth response>,
        //    user: {
        //      facebook: { <Facebook's user info>}
        //      <Evrythng's user information>
        //    },
        //    app: {
        //      <Evrythng's app information>
        //    }
        //  }
        // ```
        if (obj.facebook) {

          if (!app.socialNetworks || !app.socialNetworks.facebook) {
            Logger.error('The Facebook configuration for this application is incorrect.');
            return;
          }

          // Get Facebook App ID from the Evrythng App social networks list.
          return Facebook.init(app.socialNetworks.facebook.appId, obj.facebook)
            .then(function (response) {

              if (response.status === 'connected') {

                // If user is connected with Facebook, return a promise with his details.
                return Authentication.authFacebook.call($this, response);

              } else {
                return response;
              }

            }).then(Utils.extendCurried({ app: app }));

        } else {

          // If not using Facebook, simply return app details after they are received.
          return app;
        }

      });

  };

  // Setup Scope inheritance.
  ApplicationScope.prototype = Object.create(Scope.prototype);
  ApplicationScope.prototype.constructor = ApplicationScope;


  // Implement Public API by extending the prototype.

  // By default all resource constructors are themselves factory functions
  // that are called by the scopes, can receive an ID and return a Resource.
  // However, in some situations in our API, the output of different endpoints can
  // be the same. Thus we need to setup the resource constructor to use a certain
  // path, and return the correct factory function. This is what happens here with the
  // **appUser()** resource constructor.
  Utils.extend(ApplicationScope.prototype, {

    product: Product.resourceConstructor,

    action: Action.resourceConstructor,

    // Setup AppUser resource to use *'/auth/evrythng/users'* instead
    // of the default *'/users'*. Both endpoints return a list of User entities.
    appUser: User.resourceConstructor('/auth/evrythng/users'),

    place: Place.resourceConstructor,

    login: Authentication.login

  }, true);


  // Attach ApplicationScope class to the EVT module.
  return (EVT.App = ApplicationScope);

});

// ## ACCESS.JS

// **The Access help to create a new Application User access for another Application User
// by specifying their email address and role to be assigned**

define('entity/access',[
  'core',
  './entity',
  'resource',
  'utils'
], function (EVT, Entity, Resource, Utils) {
  'use strict';

  // Setup Access inheritance from Entity.
  var Access = function () {
    Entity.apply(this, arguments);
  };

  Access.prototype = Object.create(Entity.prototype);
  Access.prototype.constructor = Access;


  // Attach class to EVT module.
  EVT.Entity.Access = Access;


  return {

    'class': Access,

    resourceConstructor: Resource.constructorFactory('/accesses', EVT.Entity.Access)

  };
});

// ## LOCATION.JS

// **The Location Entity represents a location in the Engine. It inherits
// from Entity and overload the resource's *update()* method to allow
// empty parameters (no payload).**

define('entity/location',[
  'core',
  './entity',
  'resource',
  'utils',
  'logger'
], function (EVT, Entity, Resource, Utils, Logger) {
  'use strict';

  // Setup Location inheritance from Entity.
  var Location = function () {
    Entity.apply(this, arguments);
  };

  Location.prototype = Object.create(Entity.prototype);
  Location.prototype.constructor = Location;

  // Attach class to EVT module.
  EVT.Entity.Location = Location;

  // The location update normalization of arguments allows to
  // make easier and more intuitive calls, such as:

  // - Single location update:

  // ```
  //  thng.location().update({
  //    position: GeoJSON
  //  });
  // ```

  // - Multi location update:

  // ```
  //  thng.location().update([
  //    {
  //      position: GeoJSON
  //    },
  //    {
  //      position: GeoJSON,
  //      timestamp: Timestamp
  //    }
  // ]);
  // ```

  function _normalizeArguments(args) {
    var data = args[0];

    if (Utils.isObject(data)){
      // Convert single object to array
      args[0] = [data];
    } else if (!data || Utils.isFunction(data)) {
      // Add empty data object
      args = Array.prototype.slice.call(args, 0);
      args.unshift([]);
    }

    return args;
  }

  return {

    'class': Location,

    resourceConstructor: function () {
      var path = this.resource.path + '/location',
          args = arguments[0] || [];

      // This endpoint is a bit special, does not allow getting location by ID
      if (Utils.isString(args) ||
        Utils.isObject(args) && Utils.isString(args.id)) {
        throw new TypeError('IDs not allowed here');
      }

      var resource = new Resource(this.resource.scope, path, EVT.Entity.Location);

      // Overload resource update() to send current location if none provided
      resource.update = function () {
        var $this = this,
            args = _normalizeArguments(arguments);

        if (args[0].length === 0 && EVT.settings.geolocation) {
          // If geolocation setting is turned on, get current position
          return Utils.getCurrentPosition().then(function (position) {

            args[0] =[{
              position: {
                type: "Point",
                coordinates: [ position.coords.longitude, position.coords.latitude]
              }
            }];

            return Resource.prototype.update.apply($this, args);

          }, function (err) {

            // Unable to get position, just inform the reason in the console.
            Logger.info(err);

            return Resource.prototype.update.apply($this, args);

          });

        } else {
          return Resource.prototype.update.apply($this, args);
        }
      };

      return resource;
    }

  };
});

// ## SHARE.JS

// ** help an Application User to share access to Thngs they are scoped to with other Application Users within the same Platform account.**

define('entity/share',[
  'core',
  './entity',
  'scope/scope',
  'resource',
  'utils'
], function (EVT, Entity, Scope, Resource, Utils) {
  'use strict';

  // Setup Share inheritance from Entity.
  var Share = function () {
    Entity.apply(this, arguments);
  };

  Share.prototype = Object.create(Entity.prototype);
  Share.prototype.constructor = Share;


  // Attach class to EVT module.
  EVT.Entity.Share = Share;


  return {

    'class': Share,

   //../thngs/:thngId/shares
    resourceConstructor: function() {
      var scope = this.resource.scope;
      var path = this.resource.path + '/shares';
      return new Resource(scope, path, EVT.Entity.Share);
    }

  };
});

// ## THNG.JS

// **The Thng is a simple Entity subclass that provides a nested
// Property Resource and a direct method to read the Thng's Product.**

define('entity/thng',[
  'core',
  './entity',
  'resource',
  './property',
  './action',
  './location',
  './share',
  'utils'
], function (EVT, Entity, Resource, Property, Action, Location, Share, Utils) {
  'use strict';

  // Setup Thng inheritance from Entity.
  var Thng = function () {
    Entity.apply(this, arguments);
  };

  Thng.prototype = Object.create(Entity.prototype);
  Thng.prototype.constructor = Thng;


  // When not using `fetchCascade`, this method allows to easily
  // fetch the Product entity of this Thng. It fowards the call
  // to this thng's scope's product resource.
  function readProduct() {

    if (!this.product) {
      throw new Error('Thng does not have a product.');
    }

    if (!this.resource) {
      throw new Error('Thng does not have a resource.');
    }

    return this.resource.scope.product(this.product).read();
  }


  // Extend Thng API by exposing a Property Resource, allowing to
  // manage the properties of this product with a resource pattern.
  // Expose an Action resource as well, for managing Thngs actions.
  // Also attach the *readProduct()* method to every Thng.
  Utils.extend(Thng.prototype, {

    property: Property.resourceConstructor,

    action: Action.resourceConstructor,

    location: Location.resourceConstructor,

    share: Share.resourceConstructor,

    /*TODO API not very consistent - thng.product().read/update() better?*/
    readProduct: readProduct

  }, true);


  // Attach class to EVT module.
  EVT.Entity.Thng = Thng;


  return {

    'class': Thng,

    resourceConstructor: Resource.constructorFactory('/thngs', EVT.Entity.Thng, ['property', 'action', 'location', 'share'])

  };
});

// ## ACTIONTYPE.JS

// **The ActionType Entity represents an action type in the Engine. It inherits
// from Entity and overload the resource's *create()* method to allow
// empty parameters (no payload).**

define('entity/actionType',[
  'core',
  './entity',
  'resource',
  'utils',
  'logger'
], function (EVT, Entity, Resource, Utils, Logger) {
  'use strict';

  // Setup Action inheritance from Entity.
  var ActionType = function () {
    Entity.apply(this, arguments);
  };

  ActionType.prototype = Object.create(Entity.prototype);
  ActionType.prototype.constructor = ActionType;

  // Normalize arguments for single request. Override resource
  // url to use action types root path and use name filter.
  // Extend params if user defines other params.
  function _normalizeArguments(obj) {
    var args = arguments;

    if (!obj || Utils.isFunction(obj)) {
      args = Array.prototype.slice.call(arguments, 0);
      args.unshift({});
    }

    // Split full path (/actions/_custom) - we get three parts:
    // 1) empty, 2) root path and 3) encoded action type name
    var url = this.path.split('/');

    args[0].url = '/' + url[1];
    args[0].params = Utils.extend(args[0].params, {
      filter: {
        name: decodeURIComponent(url[2])
      }
    });

    return args;
  }

  // Attach class to EVT module.
  EVT.Entity.ActionType = ActionType;

  return {

    'class': ActionType,

    resourceConstructor: function (actionTypeName) {
      var path = '/actions', resource;

      if (actionTypeName) {
        if (Utils.isString(actionTypeName)) {
          path += '/' + encodeURIComponent(actionTypeName);
        } else {
          throw new TypeError('Action type must be a key/name string');
        }
      }

      resource = new Resource(this, path, EVT.Entity.ActionType);

      // Action types are a bit special, has there is no GET method available.
      // In order to do so, we need to make a filtered request to the root path,
      // and parse the response normally. An empty result list, means not found.
      resource.read = function () {
        if (!actionTypeName) {
          return Resource.prototype.read.apply(this, arguments);
        } else {
          var args = _normalizeArguments.apply(this, arguments);
          return Resource.prototype.read.apply(this, args).then(function (actionTypes) {
            if (!actionTypes.length) {
              // Fake 404
              var error = {
                status: 404,
                errors: ["The action type was not found."],
                url: path
              };

              Logger.error(error);
              throw error;
            } else {
              return actionTypes[0];
            }
          });
        }
      };

      return resource;
    }

  };
});

// ## COLLECTION.JS

// **The Collection is a simple Entity subclass that provides a nested
// Thng Resource.**

define('entity/collection',[
  'core',
  './entity',
  'resource',
  './action',
  'utils'
], function (EVT, Entity, Resource, Action, Utils) {
  'use strict';

  // Setup Collection inheritance from Entity.
  var Collection = function () {
    Entity.apply(this, arguments);
  };

  Collection.prototype = Object.create(Entity.prototype);
  Collection.prototype.constructor = Collection;


  // Custom nested resource constructor for Thngs of a Collection.
  function thng(id) {

    // To create nested Resources, the collection itself needs
    // a resource.
    if(!this.resource) {
      throw new Error('This Entity does not have a Resource.');
    }

    var path = this.resource.path + '/thngs';

    return Resource.constructorFactory(path, EVT.Entity.Thng)
      .call(this.resource.scope, id);
  }

  // Custom nested resource constructor for Collections of a Collection.
  function collection(id) {
    if(!this.resource) {
      throw new Error('This Entity does not have a Resource.');
    }

    var path = this.resource.path + '/collections';

    return Resource.constructorFactory(path, EVT.Entity.Collection)
      .call(this.resource.scope, id);
  }


  // Extend Collection API by exposing nested Resources.
  Utils.extend(Collection.prototype, {

    thng: thng,
    collection: collection,
    action: Action.resourceConstructor

  }, true);


  // Attach class to EVT module.
  EVT.Entity.Collection = Collection;


  return {

    'class': Collection,

    resourceConstructor: Resource.constructorFactory('/collections', EVT.Entity.Collection, ['thng', 'collection', 'action'])

  };
});

// ## PERMISSION.JS

// **Permission defines a unique endpoint permission assigned to a role.**

define('entity/permission',[
  'core',
  './entity',
  'resource'
], function (EVT, Entity, Resource) {
  'use strict';

  // Setup Permission inheritance from Entity.
  var Permission = function () {
    Entity.apply(this, arguments);
  };

  Permission.prototype = Object.create(Entity.prototype);
  Permission.prototype.constructor = Permission;

  // Attach class to EVT module.
  EVT.Entity.Permission = Permission;

  return {
    'class': Permission,
    resourceConstructor: function () {
      // TODO relax validation to support old permission API
      // var args = arguments[0] || [];
      //
      // // Permission endpoint does not allow single resource ID.
      // if (Utils.isString(args) ||
      //   Utils.isObject(args) && Utils.isString(args.id)) {
      //   throw new TypeError('IDs not allowed here');
      // }

      if (!this.resource) {
        throw new Error('This Entity does not have a Resource.');
      }

      var path = this.resource.path + '/permissions',
        scope = this.resource.scope;

      return Resource.constructorFactory(path, EVT.Entity.Permission).call(scope);
    }
  };
});

// ## POLICY.JS

// **Policy defines the relationship between a role and schema.**

define('entity/policy',[
  'core',
  './entity',
  'resource'
], function (EVT, Entity, Resource) {
  'use strict';

  // Setup Policy inheritance from Entity.
  var Policy = function () {
    Entity.apply(this, arguments);
  };

  Policy.prototype = Object.create(Entity.prototype);
  Policy.prototype.constructor = Policy;

  // Attach class to EVT module.
  EVT.Entity.Policy = Policy;

  return {
    'class': Policy,
    resourceConstructor: function (id) {
      if (!this.resource) {
        throw new Error('This Entity does not have a Resource.');
      }

      var path = this.resource.path + '/policies',
        scope = this.resource.scope;

      return Resource.constructorFactory(path, EVT.Entity.Policy).call(scope, id);
    }
  };
});

// ## ROLE.JS

// **Role defines a set of API access permissions, containing a nested
// Permission resource.**

define('entity/role',[
  'core',
  './entity',
  './permission',
  './policy',
  'resource',
  'utils'
], function (EVT, Entity, Permission, Policy, Resource, Utils) {
  'use strict';

  // Setup Role inheritance from Entity.
  var Role = function () {
    Entity.apply(this, arguments);
  };

  Role.prototype = Object.create(Entity.prototype);
  Role.prototype.constructor = Role;

  // Attach class to EVT module.
  EVT.Entity.Role = Role;

  // Extend Role API.
  Utils.extend(Role.prototype, {
    permission: Permission.resourceConstructor,
    policy: Policy.resourceConstructor
  }, true);

  return {
    'class': Role,
    resourceConstructor: Resource.constructorFactory('/roles', EVT.Entity.Role, ['permission', 'policy'])
  };
});

// ## USER.JS

// **Here it is defined the UserScope or `EVT.User`. EVT.User
// is a sub-class of scope and it defines the public API that the
// user and its API Keys can access to.**

// A User scope currently has access to:

// - Product resource (`C`, `R`, `U`)
// - Thng resource (`C`, `R`, `U`)
// - ActionType resource (`R`)
// - Action resource (`C`, `R`)
// - Collection resource (`C`, `R`, `U`)
// - Logout
// - Update itself (the user information)
// - Role resource (`R`)
// - (`C`, `R`, `U` actions via products/thngs)
// - Accesses (`C`, `R`, `U`)

define('scope/user',[
  'core',
  './scope',
  'entity/product',
  'entity/access',
  'entity/thng',
  'entity/user',
  'entity/actionType',
  'entity/action',
  'entity/collection',
  'entity/place',
  'entity/role',
  'authentication',
  'utils',
  'logger'
], function (EVT, Scope, Product, Access, Thng, User, ActionType, Action, Collection,
             Place, Role, Authentication, Utils, Logger) {
  'use strict';

  // User Scope constructor. It can be called with the parameters:

  // - _**new EVT.User(apiKey, parentScope)** - API Key string.
  // Optional parent scope._
  // - _**new EVT.User(options, parentScope)** - Options object should
  // contain `apiKey` and optionally user information (user entity retrieved
  // from the engine). Optional parent scope._
  var UserScope = function(obj, parentScope){

    var $this = this;

    // Setup base Scope with the provided API Key.
    if(Utils.isObject(obj)){
      Scope.call(this, obj.apiKey);

      // Merge user information into the scope, as we do with the ApplicationScope.
      Utils.extend(this, obj, true);

    }else{
      Scope.call(this, obj);
    }

    // Store parent scope. *Currently not used.*
    if(parentScope instanceof Scope) {
      this.parentScope = parentScope;
    }

    this.$init = this.$init
      .then(function (access) {
        return EVT.api({
          url: '/users/' + access.actor.id,
          authorization: $this.apiKey
        });
      })
      .then(Utils.extendCurried($this))
      .catch(function () {

        var error = 'There is no user with this API Key';
        Logger.error(error);
        throw new Error(error);

      });
  };

  // Setup Scope inheritance.
  UserScope.prototype = Object.create(Scope.prototype);
  UserScope.prototype.constructor = UserScope;


  // Allow to update the current user without an explicit API call. Simply update
  // the user scope object and call update will make the request to update the user
  // in the *'/users'* endpoint.
  function update() {
    var $this = this,
      self = User.resourceConstructor().call(this, this.id);

    return self.update.apply(self, arguments).then(function (updated) {
      Utils.extend($this, updated, true);
      return updated;
    });
  }


  // Implement Public API by extending the prototype.

  // See explanation of resource constructors in ApplicationScope. The
  // **thng()** resource builds a custom resource constructor by using
  // the default *'/thngs'* endpoint.
  Utils.extend(UserScope.prototype, {

    product: Product.resourceConstructor,

    access: Access.resourceConstructor,

    thng: Thng.resourceConstructor,

    actionType: ActionType.resourceConstructor,

    action: Action.resourceConstructor,

    collection: Collection.resourceConstructor,

    place: Place.resourceConstructor,

    role: Role.resourceConstructor,

    logout: Authentication.logout,

    update: update

  }, true);


  // Attach UserScope class to the EVT module.
  return (EVT.User = UserScope);

});

// ## DEVICE.JS

// **Here it is defined the DeviceScope or `EVT.Device`. EVT.Device
// is a sub-class of scope and it defines the public API that the
// device can access to.**

// A Device scope currently has access to:

// - Thng resource (`R`, `U`)
// - (`C`, `R`, `U` properties/actions via thngs)

define('scope/device',[
  'core',
  './scope',
  'entity/thng',
  'utils',
  'logger'
], function (EVT, Scope, Thng, Utils, Logger) {
  'use strict';

  // Device Scope constructor. It can be called with the parameters:

  // - _**new EVT.Device(options, parentScope)** - Options object should
  // contain `apiKey` and optionally device information (thng entity retrieved
  // from the engine). Optional parent scope._
  var DeviceScope = function(obj, parentScope){

    var $this = this;

    // Setup base Scope with the provided API Key.
    if(Utils.isObject(obj)){
      Scope.call(this, obj.apiKey);

      // Merge device information into the scope, as we do with the UserScope.
      Utils.extend(this, obj, true);

    }else{
      throw new TypeError('DeviceScope constructor should be called with object' +
      ' containing API Key and ID of device.');
    }

    // Store parent scope. *Currently not used.*
    if(parentScope instanceof Scope) {
      this.parentScope = parentScope;
    }

    this.$init = this.$init
      .then(function (access) {
        return Thng.resourceConstructor.call($this, access.actor.id).read();
      })
      .then(Utils.extendCurried($this))
      .catch(function () {

        var error = 'There is no device with this API Key.';
        Logger.error(error);
        throw new Error(error);

      });

  };

  // Setup Scope inheritance.
  DeviceScope.prototype = Object.create(Scope.prototype);
  DeviceScope.prototype.constructor = DeviceScope;


  // Allow to update the current device without an explicit API call. Simply update
  // the device scope object and call update will make the request to update the device
  // in the *'/thngs'* endpoint.
  function update() {
    var $this = this,
      self = Thng.resourceConstructor.call(this, this.id);

    return self.update.apply(self, arguments).then(function (updated) {
      Utils.extend($this, updated, true);
      return updated;
    });
  }

  // The device property resource is in fact just an alias for the
  // inherited Thng.property() resource.
  function property() {
    var self = Thng.resourceConstructor.call(this, this.id);
    return self.property.apply(self, arguments);
  }

  // The device action resource is in fact just an alias for the
  // inherited Thng.action() resource.
  function action() {
    var self = Thng.resourceConstructor.call(this, this.id);
    return self.action.apply(self, arguments);
  }


  // Implement Public API by extending the prototype.

  // See explanation of resource constructors in ApplicationScope. The
  // **thng()** resource builds a custom resource constructor by using
  // the default *'/thngs'* endpoint.
  Utils.extend(DeviceScope.prototype, {

    property: property,

    action: action,

    update: update

  }, true);


  // Attach DeviceScope class to the EVT module.
  return (EVT.Device = DeviceScope);

});

// # **[EVRYTHNG](https://www.evrythng.com)'s JavaScript SDK**

// ## EVRYTHNG.JS

// EvrythngJS uses AMD ([RequireJS](http://requirejs.org/)) to load all of its
// building modules.

// This is the higher level module that requires the `EVT.App`, `EVT.User` and
// and `EVT.Device` classes representing the Application, User and Device scopes respectively.
// All other modules are loaded as dependencies of these.

// ### UMD

// EvrythngJS is wrapped in a [UMD](https://github.com/umdjs/umd) definition which makes it
// available as an **AMD** (RequireJS) module, **CommonJS** (Node.js) or **browser globals**.

// EvrythngJS bundle also includes:

// - [Almond](https://github.com/jrburke/almond): a minimal AMD script loader
// - [NPO](https://github.com/getify/native-promise-only): an ES6 Promise polyfill,
// strict Promises/A+ (1.1) implementation
// - [Regenerator](https://github.com/facebook/regenerator): an ES6 Generator + ES7 Async-await
// functions polyfill

define('evrythng',[
  'core',
  'api',
  'scope/application',
  'scope/user',
  'scope/device'
], function(EVT) {
  'use strict';

  // Return fully built EVT module.
  return EVT;

});

    //Use almond's special top-level, synchronous require to trigger factory
    //functions, get the final module value, and export it as the public
    //value.
    return require('evrythng');
}));
