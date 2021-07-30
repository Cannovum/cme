// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === "function" && parcelRequire
  var nodeRequire = typeof require === "function" && require

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof parcelRequire === "function" && parcelRequire
        if (!jumped && currentRequire) {
          return currentRequire(name, true)
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true)
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === "string") {
          return nodeRequire(name)
        }

        var err = new Error("Cannot find module '" + name + "'")
        err.code = "MODULE_NOT_FOUND"
        throw err
      }

      localRequire.resolve = resolve
      localRequire.cache = {}

      var module = (cache[name] = new newRequire.Module(name))

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      )
    }

    return cache[name].exports

    function localRequire(x) {
      return newRequire(localRequire.resolve(x))
    }

    function resolve(x) {
      return modules[name][1][x] || x
    }
  }

  function Module(moduleName) {
    this.id = moduleName
    this.bundle = newRequire
    this.exports = {}
  }

  newRequire.isParcelRequire = true
  newRequire.Module = Module
  newRequire.modules = modules
  newRequire.cache = cache
  newRequire.parent = previousRequire
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports
      },
      {},
    ]
  }

  var error
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i])
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1])

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports

      // RequireJS
    } else if (typeof define === "function" && define.amd) {
      define(function () {
        return mainExports
      })

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error
  }

  return newRequire
})(
  {
    "../node_modules/process/browser.js": [
      function (require, module, exports) {
        // shim for using process in browser
        var process = (module.exports = {}) // cached from whatever global is present so that test runners that stub it
        // don't break things.  But we need to wrap it in a try catch in case it is
        // wrapped in strict mode code which doesn't define any globals.  It's inside a
        // function because try/catches deoptimize in certain engines.

        var cachedSetTimeout
        var cachedClearTimeout

        function defaultSetTimout() {
          throw new Error("setTimeout has not been defined")
        }

        function defaultClearTimeout() {
          throw new Error("clearTimeout has not been defined")
        }

        ;(function () {
          try {
            if (typeof setTimeout === "function") {
              cachedSetTimeout = setTimeout
            } else {
              cachedSetTimeout = defaultSetTimout
            }
          } catch (e) {
            cachedSetTimeout = defaultSetTimout
          }

          try {
            if (typeof clearTimeout === "function") {
              cachedClearTimeout = clearTimeout
            } else {
              cachedClearTimeout = defaultClearTimeout
            }
          } catch (e) {
            cachedClearTimeout = defaultClearTimeout
          }
        })()

        function runTimeout(fun) {
          if (cachedSetTimeout === setTimeout) {
            //normal enviroments in sane situations
            return setTimeout(fun, 0)
          } // if setTimeout wasn't available but was latter defined

          if (
            (cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) &&
            setTimeout
          ) {
            cachedSetTimeout = setTimeout
            return setTimeout(fun, 0)
          }

          try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedSetTimeout(fun, 0)
          } catch (e) {
            try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
              return cachedSetTimeout.call(null, fun, 0)
            } catch (e) {
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
              return cachedSetTimeout.call(this, fun, 0)
            }
          }
        }

        function runClearTimeout(marker) {
          if (cachedClearTimeout === clearTimeout) {
            //normal enviroments in sane situations
            return clearTimeout(marker)
          } // if clearTimeout wasn't available but was latter defined

          if (
            (cachedClearTimeout === defaultClearTimeout ||
              !cachedClearTimeout) &&
            clearTimeout
          ) {
            cachedClearTimeout = clearTimeout
            return clearTimeout(marker)
          }

          try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedClearTimeout(marker)
          } catch (e) {
            try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
              return cachedClearTimeout.call(null, marker)
            } catch (e) {
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
              // Some versions of I.E. have different rules for clearTimeout vs setTimeout
              return cachedClearTimeout.call(this, marker)
            }
          }
        }

        var queue = []
        var draining = false
        var currentQueue
        var queueIndex = -1

        function cleanUpNextTick() {
          if (!draining || !currentQueue) {
            return
          }

          draining = false

          if (currentQueue.length) {
            queue = currentQueue.concat(queue)
          } else {
            queueIndex = -1
          }

          if (queue.length) {
            drainQueue()
          }
        }

        function drainQueue() {
          if (draining) {
            return
          }

          var timeout = runTimeout(cleanUpNextTick)
          draining = true
          var len = queue.length

          while (len) {
            currentQueue = queue
            queue = []

            while (++queueIndex < len) {
              if (currentQueue) {
                currentQueue[queueIndex].run()
              }
            }

            queueIndex = -1
            len = queue.length
          }

          currentQueue = null
          draining = false
          runClearTimeout(timeout)
        }

        process.nextTick = function (fun) {
          var args = new Array(arguments.length - 1)

          if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
              args[i - 1] = arguments[i]
            }
          }

          queue.push(new Item(fun, args))

          if (queue.length === 1 && !draining) {
            runTimeout(drainQueue)
          }
        } // v8 likes predictible objects

        function Item(fun, array) {
          this.fun = fun
          this.array = array
        }

        Item.prototype.run = function () {
          this.fun.apply(null, this.array)
        }

        process.title = "browser"
        process.env = {}
        process.argv = []
        process.version = "" // empty string to avoid regexp issues

        process.versions = {}

        function noop() {}

        process.on = noop
        process.addListener = noop
        process.once = noop
        process.off = noop
        process.removeListener = noop
        process.removeAllListeners = noop
        process.emit = noop
        process.prependListener = noop
        process.prependOnceListener = noop

        process.listeners = function (name) {
          return []
        }

        process.binding = function (name) {
          throw new Error("process.binding is not supported")
        }

        process.cwd = function () {
          return "/"
        }

        process.chdir = function (dir) {
          throw new Error("process.chdir is not supported")
        }

        process.umask = function () {
          return 0
        }
      },
      {},
    ],
    "../node_modules/process-nextick-args/index.js": [
      function (require, module, exports) {
        var process = require("process")
        ;("use strict")

        if (
          typeof process === "undefined" ||
          !process.version ||
          process.version.indexOf("v0.") === 0 ||
          (process.version.indexOf("v1.") === 0 &&
            process.version.indexOf("v1.8.") !== 0)
        ) {
          module.exports = { nextTick: nextTick }
        } else {
          module.exports = process
        }

        function nextTick(fn, arg1, arg2, arg3) {
          if (typeof fn !== "function") {
            throw new TypeError('"callback" argument must be a function')
          }
          var len = arguments.length
          var args, i
          switch (len) {
            case 0:
            case 1:
              return process.nextTick(fn)
            case 2:
              return process.nextTick(function afterTickOne() {
                fn.call(null, arg1)
              })
            case 3:
              return process.nextTick(function afterTickTwo() {
                fn.call(null, arg1, arg2)
              })
            case 4:
              return process.nextTick(function afterTickThree() {
                fn.call(null, arg1, arg2, arg3)
              })
            default:
              args = new Array(len - 1)
              i = 0
              while (i < args.length) {
                args[i++] = arguments[i]
              }
              return process.nextTick(function afterTick() {
                fn.apply(null, args)
              })
          }
        }
      },
      { process: "../node_modules/process/browser.js" },
    ],
    "../node_modules/isarray/index.js": [
      function (require, module, exports) {
        var toString = {}.toString

        module.exports =
          Array.isArray ||
          function (arr) {
            return toString.call(arr) == "[object Array]"
          }
      },
      {},
    ],
    "../node_modules/events/events.js": [
      function (require, module, exports) {
        // Copyright Joyent, Inc. and other Node contributors.
        //
        // Permission is hereby granted, free of charge, to any person obtaining a
        // copy of this software and associated documentation files (the
        // "Software"), to deal in the Software without restriction, including
        // without limitation the rights to use, copy, modify, merge, publish,
        // distribute, sublicense, and/or sell copies of the Software, and to permit
        // persons to whom the Software is furnished to do so, subject to the
        // following conditions:
        //
        // The above copyright notice and this permission notice shall be included
        // in all copies or substantial portions of the Software.
        //
        // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
        // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
        // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
        // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
        // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
        // USE OR OTHER DEALINGS IN THE SOFTWARE.
        "use strict"

        var R = typeof Reflect === "object" ? Reflect : null
        var ReflectApply =
          R && typeof R.apply === "function"
            ? R.apply
            : function ReflectApply(target, receiver, args) {
                return Function.prototype.apply.call(target, receiver, args)
              }
        var ReflectOwnKeys

        if (R && typeof R.ownKeys === "function") {
          ReflectOwnKeys = R.ownKeys
        } else if (Object.getOwnPropertySymbols) {
          ReflectOwnKeys = function ReflectOwnKeys(target) {
            return Object.getOwnPropertyNames(target).concat(
              Object.getOwnPropertySymbols(target)
            )
          }
        } else {
          ReflectOwnKeys = function ReflectOwnKeys(target) {
            return Object.getOwnPropertyNames(target)
          }
        }

        function ProcessEmitWarning(warning) {
          if (console && console.warn) console.warn(warning)
        }

        var NumberIsNaN =
          Number.isNaN ||
          function NumberIsNaN(value) {
            return value !== value
          }

        function EventEmitter() {
          EventEmitter.init.call(this)
        }

        module.exports = EventEmitter
        module.exports.once = once // Backwards-compat with node 0.10.x

        EventEmitter.EventEmitter = EventEmitter
        EventEmitter.prototype._events = undefined
        EventEmitter.prototype._eventsCount = 0
        EventEmitter.prototype._maxListeners = undefined // By default EventEmitters will print a warning if more than 10 listeners are
        // added to it. This is a useful default which helps finding memory leaks.

        var defaultMaxListeners = 10

        function checkListener(listener) {
          if (typeof listener !== "function") {
            throw new TypeError(
              'The "listener" argument must be of type Function. Received type ' +
                typeof listener
            )
          }
        }

        Object.defineProperty(EventEmitter, "defaultMaxListeners", {
          enumerable: true,
          get: function () {
            return defaultMaxListeners
          },
          set: function (arg) {
            if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
              throw new RangeError(
                'The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' +
                  arg +
                  "."
              )
            }

            defaultMaxListeners = arg
          },
        })

        EventEmitter.init = function () {
          if (
            this._events === undefined ||
            this._events === Object.getPrototypeOf(this)._events
          ) {
            this._events = Object.create(null)
            this._eventsCount = 0
          }

          this._maxListeners = this._maxListeners || undefined
        } // Obviously not all Emitters should be limited to 10. This function allows
        // that to be increased. Set to zero for unlimited.

        EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
          if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
            throw new RangeError(
              'The value of "n" is out of range. It must be a non-negative number. Received ' +
                n +
                "."
            )
          }

          this._maxListeners = n
          return this
        }

        function _getMaxListeners(that) {
          if (that._maxListeners === undefined)
            return EventEmitter.defaultMaxListeners
          return that._maxListeners
        }

        EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
          return _getMaxListeners(this)
        }

        EventEmitter.prototype.emit = function emit(type) {
          var args = []

          for (var i = 1; i < arguments.length; i++) args.push(arguments[i])

          var doError = type === "error"
          var events = this._events
          if (events !== undefined)
            doError = doError && events.error === undefined
          else if (!doError) return false // If there is no 'error' event listener then throw.

          if (doError) {
            var er
            if (args.length > 0) er = args[0]

            if (er instanceof Error) {
              // Note: The comments on the `throw` lines are intentional, they show
              // up in Node's output if this results in an unhandled exception.
              throw er // Unhandled 'error' event
            } // At least give some kind of context to the user

            var err = new Error(
              "Unhandled error." + (er ? " (" + er.message + ")" : "")
            )
            err.context = er
            throw err // Unhandled 'error' event
          }

          var handler = events[type]
          if (handler === undefined) return false

          if (typeof handler === "function") {
            ReflectApply(handler, this, args)
          } else {
            var len = handler.length
            var listeners = arrayClone(handler, len)

            for (var i = 0; i < len; ++i) ReflectApply(listeners[i], this, args)
          }

          return true
        }

        function _addListener(target, type, listener, prepend) {
          var m
          var events
          var existing
          checkListener(listener)
          events = target._events

          if (events === undefined) {
            events = target._events = Object.create(null)
            target._eventsCount = 0
          } else {
            // To avoid recursion in the case that type === "newListener"! Before
            // adding it to the listeners, first emit "newListener".
            if (events.newListener !== undefined) {
              target.emit(
                "newListener",
                type,
                listener.listener ? listener.listener : listener
              ) // Re-assign `events` because a newListener handler could have caused the
              // this._events to be assigned to a new object

              events = target._events
            }

            existing = events[type]
          }

          if (existing === undefined) {
            // Optimize the case of one listener. Don't need the extra array object.
            existing = events[type] = listener
            ++target._eventsCount
          } else {
            if (typeof existing === "function") {
              // Adding the second element, need to change to array.
              existing = events[type] = prepend
                ? [listener, existing]
                : [existing, listener] // If we've already got an array, just append.
            } else if (prepend) {
              existing.unshift(listener)
            } else {
              existing.push(listener)
            } // Check for listener leak

            m = _getMaxListeners(target)

            if (m > 0 && existing.length > m && !existing.warned) {
              existing.warned = true // No error code for this since it is a Warning
              // eslint-disable-next-line no-restricted-syntax

              var w = new Error(
                "Possible EventEmitter memory leak detected. " +
                  existing.length +
                  " " +
                  String(type) +
                  " listeners " +
                  "added. Use emitter.setMaxListeners() to " +
                  "increase limit"
              )
              w.name = "MaxListenersExceededWarning"
              w.emitter = target
              w.type = type
              w.count = existing.length
              ProcessEmitWarning(w)
            }
          }

          return target
        }

        EventEmitter.prototype.addListener = function addListener(
          type,
          listener
        ) {
          return _addListener(this, type, listener, false)
        }

        EventEmitter.prototype.on = EventEmitter.prototype.addListener

        EventEmitter.prototype.prependListener = function prependListener(
          type,
          listener
        ) {
          return _addListener(this, type, listener, true)
        }

        function onceWrapper() {
          if (!this.fired) {
            this.target.removeListener(this.type, this.wrapFn)
            this.fired = true
            if (arguments.length === 0) return this.listener.call(this.target)
            return this.listener.apply(this.target, arguments)
          }
        }

        function _onceWrap(target, type, listener) {
          var state = {
            fired: false,
            wrapFn: undefined,
            target: target,
            type: type,
            listener: listener,
          }
          var wrapped = onceWrapper.bind(state)
          wrapped.listener = listener
          state.wrapFn = wrapped
          return wrapped
        }

        EventEmitter.prototype.once = function once(type, listener) {
          checkListener(listener)
          this.on(type, _onceWrap(this, type, listener))
          return this
        }

        EventEmitter.prototype.prependOnceListener =
          function prependOnceListener(type, listener) {
            checkListener(listener)
            this.prependListener(type, _onceWrap(this, type, listener))
            return this
          } // Emits a 'removeListener' event if and only if the listener was removed.

        EventEmitter.prototype.removeListener = function removeListener(
          type,
          listener
        ) {
          var list, events, position, i, originalListener
          checkListener(listener)
          events = this._events
          if (events === undefined) return this
          list = events[type]
          if (list === undefined) return this

          if (list === listener || list.listener === listener) {
            if (--this._eventsCount === 0) this._events = Object.create(null)
            else {
              delete events[type]
              if (events.removeListener)
                this.emit("removeListener", type, list.listener || listener)
            }
          } else if (typeof list !== "function") {
            position = -1

            for (i = list.length - 1; i >= 0; i--) {
              if (list[i] === listener || list[i].listener === listener) {
                originalListener = list[i].listener
                position = i
                break
              }
            }

            if (position < 0) return this
            if (position === 0) list.shift()
            else {
              spliceOne(list, position)
            }
            if (list.length === 1) events[type] = list[0]
            if (events.removeListener !== undefined)
              this.emit("removeListener", type, originalListener || listener)
          }

          return this
        }

        EventEmitter.prototype.off = EventEmitter.prototype.removeListener

        EventEmitter.prototype.removeAllListeners = function removeAllListeners(
          type
        ) {
          var listeners, events, i
          events = this._events
          if (events === undefined) return this // not listening for removeListener, no need to emit

          if (events.removeListener === undefined) {
            if (arguments.length === 0) {
              this._events = Object.create(null)
              this._eventsCount = 0
            } else if (events[type] !== undefined) {
              if (--this._eventsCount === 0) this._events = Object.create(null)
              else delete events[type]
            }

            return this
          } // emit removeListener for all listeners on all events

          if (arguments.length === 0) {
            var keys = Object.keys(events)
            var key

            for (i = 0; i < keys.length; ++i) {
              key = keys[i]
              if (key === "removeListener") continue
              this.removeAllListeners(key)
            }

            this.removeAllListeners("removeListener")
            this._events = Object.create(null)
            this._eventsCount = 0
            return this
          }

          listeners = events[type]

          if (typeof listeners === "function") {
            this.removeListener(type, listeners)
          } else if (listeners !== undefined) {
            // LIFO order
            for (i = listeners.length - 1; i >= 0; i--) {
              this.removeListener(type, listeners[i])
            }
          }

          return this
        }

        function _listeners(target, type, unwrap) {
          var events = target._events
          if (events === undefined) return []
          var evlistener = events[type]
          if (evlistener === undefined) return []
          if (typeof evlistener === "function")
            return unwrap ? [evlistener.listener || evlistener] : [evlistener]
          return unwrap
            ? unwrapListeners(evlistener)
            : arrayClone(evlistener, evlistener.length)
        }

        EventEmitter.prototype.listeners = function listeners(type) {
          return _listeners(this, type, true)
        }

        EventEmitter.prototype.rawListeners = function rawListeners(type) {
          return _listeners(this, type, false)
        }

        EventEmitter.listenerCount = function (emitter, type) {
          if (typeof emitter.listenerCount === "function") {
            return emitter.listenerCount(type)
          } else {
            return listenerCount.call(emitter, type)
          }
        }

        EventEmitter.prototype.listenerCount = listenerCount

        function listenerCount(type) {
          var events = this._events

          if (events !== undefined) {
            var evlistener = events[type]

            if (typeof evlistener === "function") {
              return 1
            } else if (evlistener !== undefined) {
              return evlistener.length
            }
          }

          return 0
        }

        EventEmitter.prototype.eventNames = function eventNames() {
          return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : []
        }

        function arrayClone(arr, n) {
          var copy = new Array(n)

          for (var i = 0; i < n; ++i) copy[i] = arr[i]

          return copy
        }

        function spliceOne(list, index) {
          for (; index + 1 < list.length; index++) list[index] = list[index + 1]

          list.pop()
        }

        function unwrapListeners(arr) {
          var ret = new Array(arr.length)

          for (var i = 0; i < ret.length; ++i) {
            ret[i] = arr[i].listener || arr[i]
          }

          return ret
        }

        function once(emitter, name) {
          return new Promise(function (resolve, reject) {
            function errorListener(err) {
              emitter.removeListener(name, resolver)
              reject(err)
            }

            function resolver() {
              if (typeof emitter.removeListener === "function") {
                emitter.removeListener("error", errorListener)
              }

              resolve([].slice.call(arguments))
            }

            eventTargetAgnosticAddListener(emitter, name, resolver, {
              once: true,
            })

            if (name !== "error") {
              addErrorHandlerIfEventEmitter(emitter, errorListener, {
                once: true,
              })
            }
          })
        }

        function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
          if (typeof emitter.on === "function") {
            eventTargetAgnosticAddListener(emitter, "error", handler, flags)
          }
        }

        function eventTargetAgnosticAddListener(
          emitter,
          name,
          listener,
          flags
        ) {
          if (typeof emitter.on === "function") {
            if (flags.once) {
              emitter.once(name, listener)
            } else {
              emitter.on(name, listener)
            }
          } else if (typeof emitter.addEventListener === "function") {
            // EventTarget does not have `error` event semantics like Node
            // EventEmitters, we do not listen for `error` events here.
            emitter.addEventListener(name, function wrapListener(arg) {
              // IE does not have builtin `{ once: true }` support so we
              // have to do it manually.
              if (flags.once) {
                emitter.removeEventListener(name, wrapListener)
              }

              listener(arg)
            })
          } else {
            throw new TypeError(
              'The "emitter" argument must be of type EventEmitter. Received type ' +
                typeof emitter
            )
          }
        }
      },
      {},
    ],
    "../node_modules/readable-stream/lib/internal/streams/stream-browser.js": [
      function (require, module, exports) {
        module.exports = require("events").EventEmitter
      },
      { events: "../node_modules/events/events.js" },
    ],
    "../node_modules/base64-js/index.js": [
      function (require, module, exports) {
        "use strict"

        exports.byteLength = byteLength
        exports.toByteArray = toByteArray
        exports.fromByteArray = fromByteArray

        var lookup = []
        var revLookup = []
        var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array

        var code =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
        for (var i = 0, len = code.length; i < len; ++i) {
          lookup[i] = code[i]
          revLookup[code.charCodeAt(i)] = i
        }

        // Support decoding URL-safe base64 strings, as Node.js does.
        // See: https://en.wikipedia.org/wiki/Base64#URL_applications
        revLookup["-".charCodeAt(0)] = 62
        revLookup["_".charCodeAt(0)] = 63

        function getLens(b64) {
          var len = b64.length

          if (len % 4 > 0) {
            throw new Error("Invalid string. Length must be a multiple of 4")
          }

          // Trim off extra bytes after placeholder bytes are found
          // See: https://github.com/beatgammit/base64-js/issues/42
          var validLen = b64.indexOf("=")
          if (validLen === -1) validLen = len

          var placeHoldersLen = validLen === len ? 0 : 4 - (validLen % 4)

          return [validLen, placeHoldersLen]
        }

        // base64 is 4/3 + up to two characters of the original data
        function byteLength(b64) {
          var lens = getLens(b64)
          var validLen = lens[0]
          var placeHoldersLen = lens[1]
          return ((validLen + placeHoldersLen) * 3) / 4 - placeHoldersLen
        }

        function _byteLength(b64, validLen, placeHoldersLen) {
          return ((validLen + placeHoldersLen) * 3) / 4 - placeHoldersLen
        }

        function toByteArray(b64) {
          var tmp
          var lens = getLens(b64)
          var validLen = lens[0]
          var placeHoldersLen = lens[1]

          var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

          var curByte = 0

          // if there are placeholders, only get up to the last complete 4 chars
          var len = placeHoldersLen > 0 ? validLen - 4 : validLen

          var i
          for (i = 0; i < len; i += 4) {
            tmp =
              (revLookup[b64.charCodeAt(i)] << 18) |
              (revLookup[b64.charCodeAt(i + 1)] << 12) |
              (revLookup[b64.charCodeAt(i + 2)] << 6) |
              revLookup[b64.charCodeAt(i + 3)]
            arr[curByte++] = (tmp >> 16) & 0xff
            arr[curByte++] = (tmp >> 8) & 0xff
            arr[curByte++] = tmp & 0xff
          }

          if (placeHoldersLen === 2) {
            tmp =
              (revLookup[b64.charCodeAt(i)] << 2) |
              (revLookup[b64.charCodeAt(i + 1)] >> 4)
            arr[curByte++] = tmp & 0xff
          }

          if (placeHoldersLen === 1) {
            tmp =
              (revLookup[b64.charCodeAt(i)] << 10) |
              (revLookup[b64.charCodeAt(i + 1)] << 4) |
              (revLookup[b64.charCodeAt(i + 2)] >> 2)
            arr[curByte++] = (tmp >> 8) & 0xff
            arr[curByte++] = tmp & 0xff
          }

          return arr
        }

        function tripletToBase64(num) {
          return (
            lookup[(num >> 18) & 0x3f] +
            lookup[(num >> 12) & 0x3f] +
            lookup[(num >> 6) & 0x3f] +
            lookup[num & 0x3f]
          )
        }

        function encodeChunk(uint8, start, end) {
          var tmp
          var output = []
          for (var i = start; i < end; i += 3) {
            tmp =
              ((uint8[i] << 16) & 0xff0000) +
              ((uint8[i + 1] << 8) & 0xff00) +
              (uint8[i + 2] & 0xff)
            output.push(tripletToBase64(tmp))
          }
          return output.join("")
        }

        function fromByteArray(uint8) {
          var tmp
          var len = uint8.length
          var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
          var parts = []
          var maxChunkLength = 16383 // must be multiple of 3

          // go through the array every three bytes, we'll deal with trailing stuff later
          for (
            var i = 0, len2 = len - extraBytes;
            i < len2;
            i += maxChunkLength
          ) {
            parts.push(
              encodeChunk(
                uint8,
                i,
                i + maxChunkLength > len2 ? len2 : i + maxChunkLength
              )
            )
          }

          // pad the end with zeros, but make sure to not forget the extra bytes
          if (extraBytes === 1) {
            tmp = uint8[len - 1]
            parts.push(lookup[tmp >> 2] + lookup[(tmp << 4) & 0x3f] + "==")
          } else if (extraBytes === 2) {
            tmp = (uint8[len - 2] << 8) + uint8[len - 1]
            parts.push(
              lookup[tmp >> 10] +
                lookup[(tmp >> 4) & 0x3f] +
                lookup[(tmp << 2) & 0x3f] +
                "="
            )
          }

          return parts.join("")
        }
      },
      {},
    ],
    "../node_modules/ieee754/index.js": [
      function (require, module, exports) {
        /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
        exports.read = function (buffer, offset, isLE, mLen, nBytes) {
          var e, m
          var eLen = nBytes * 8 - mLen - 1
          var eMax = (1 << eLen) - 1
          var eBias = eMax >> 1
          var nBits = -7
          var i = isLE ? nBytes - 1 : 0
          var d = isLE ? -1 : 1
          var s = buffer[offset + i]

          i += d

          e = s & ((1 << -nBits) - 1)
          s >>= -nBits
          nBits += eLen
          for (
            ;
            nBits > 0;
            e = e * 256 + buffer[offset + i], i += d, nBits -= 8
          ) {}

          m = e & ((1 << -nBits) - 1)
          e >>= -nBits
          nBits += mLen
          for (
            ;
            nBits > 0;
            m = m * 256 + buffer[offset + i], i += d, nBits -= 8
          ) {}

          if (e === 0) {
            e = 1 - eBias
          } else if (e === eMax) {
            return m ? NaN : (s ? -1 : 1) * Infinity
          } else {
            m = m + Math.pow(2, mLen)
            e = e - eBias
          }
          return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
        }

        exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
          var e, m, c
          var eLen = nBytes * 8 - mLen - 1
          var eMax = (1 << eLen) - 1
          var eBias = eMax >> 1
          var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0
          var i = isLE ? 0 : nBytes - 1
          var d = isLE ? 1 : -1
          var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

          value = Math.abs(value)

          if (isNaN(value) || value === Infinity) {
            m = isNaN(value) ? 1 : 0
            e = eMax
          } else {
            e = Math.floor(Math.log(value) / Math.LN2)
            if (value * (c = Math.pow(2, -e)) < 1) {
              e--
              c *= 2
            }
            if (e + eBias >= 1) {
              value += rt / c
            } else {
              value += rt * Math.pow(2, 1 - eBias)
            }
            if (value * c >= 2) {
              e++
              c /= 2
            }

            if (e + eBias >= eMax) {
              m = 0
              e = eMax
            } else if (e + eBias >= 1) {
              m = (value * c - 1) * Math.pow(2, mLen)
              e = e + eBias
            } else {
              m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
              e = 0
            }
          }

          for (
            ;
            mLen >= 8;
            buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8
          ) {}

          e = (e << mLen) | m
          eLen += mLen
          for (
            ;
            eLen > 0;
            buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8
          ) {}

          buffer[offset + i - d] |= s * 128
        }
      },
      {},
    ],
    "../node_modules/buffer/index.js": [
      function (require, module, exports) {
        var global = arguments[3]
        /*!
         * The buffer module from node.js, for the browser.
         *
         * @author   Feross Aboukhadijeh <http://feross.org>
         * @license  MIT
         */
        /* eslint-disable no-proto */

        ;("use strict")

        var base64 = require("base64-js")
        var ieee754 = require("ieee754")
        var isArray = require("isarray")

        exports.Buffer = Buffer
        exports.SlowBuffer = SlowBuffer
        exports.INSPECT_MAX_BYTES = 50

        /**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
        Buffer.TYPED_ARRAY_SUPPORT =
          global.TYPED_ARRAY_SUPPORT !== undefined
            ? global.TYPED_ARRAY_SUPPORT
            : typedArraySupport()

        /*
         * Export kMaxLength after typed array support is determined.
         */
        exports.kMaxLength = kMaxLength()

        function typedArraySupport() {
          try {
            var arr = new Uint8Array(1)
            arr.__proto__ = {
              __proto__: Uint8Array.prototype,
              foo: function () {
                return 42
              },
            }
            return (
              arr.foo() === 42 && // typed array instances can be augmented
              typeof arr.subarray === "function" && // chrome 9-10 lack `subarray`
              arr.subarray(1, 1).byteLength === 0
            ) // ie10 has broken `subarray`
          } catch (e) {
            return false
          }
        }

        function kMaxLength() {
          return Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff
        }

        function createBuffer(that, length) {
          if (kMaxLength() < length) {
            throw new RangeError("Invalid typed array length")
          }
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            // Return an augmented `Uint8Array` instance, for best performance
            that = new Uint8Array(length)
            that.__proto__ = Buffer.prototype
          } else {
            // Fallback: Return an object instance of the Buffer class
            if (that === null) {
              that = new Buffer(length)
            }
            that.length = length
          }

          return that
        }

        /**
         * The Buffer constructor returns instances of `Uint8Array` that have their
         * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
         * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
         * and the `Uint8Array` methods. Square bracket notation works as expected -- it
         * returns a single octet.
         *
         * The `Uint8Array` prototype remains unmodified.
         */

        function Buffer(arg, encodingOrOffset, length) {
          if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
            return new Buffer(arg, encodingOrOffset, length)
          }

          // Common case.
          if (typeof arg === "number") {
            if (typeof encodingOrOffset === "string") {
              throw new Error(
                "If encoding is specified then the first argument must be a string"
              )
            }
            return allocUnsafe(this, arg)
          }
          return from(this, arg, encodingOrOffset, length)
        }

        Buffer.poolSize = 8192 // not used by this implementation

        // TODO: Legacy, not needed anymore. Remove in next major version.
        Buffer._augment = function (arr) {
          arr.__proto__ = Buffer.prototype
          return arr
        }

        function from(that, value, encodingOrOffset, length) {
          if (typeof value === "number") {
            throw new TypeError('"value" argument must not be a number')
          }

          if (
            typeof ArrayBuffer !== "undefined" &&
            value instanceof ArrayBuffer
          ) {
            return fromArrayBuffer(that, value, encodingOrOffset, length)
          }

          if (typeof value === "string") {
            return fromString(that, value, encodingOrOffset)
          }

          return fromObject(that, value)
        }

        /**
         * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
         * if value is a number.
         * Buffer.from(str[, encoding])
         * Buffer.from(array)
         * Buffer.from(buffer)
         * Buffer.from(arrayBuffer[, byteOffset[, length]])
         **/
        Buffer.from = function (value, encodingOrOffset, length) {
          return from(null, value, encodingOrOffset, length)
        }

        if (Buffer.TYPED_ARRAY_SUPPORT) {
          Buffer.prototype.__proto__ = Uint8Array.prototype
          Buffer.__proto__ = Uint8Array
          if (
            typeof Symbol !== "undefined" &&
            Symbol.species &&
            Buffer[Symbol.species] === Buffer
          ) {
            // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
            Object.defineProperty(Buffer, Symbol.species, {
              value: null,
              configurable: true,
            })
          }
        }

        function assertSize(size) {
          if (typeof size !== "number") {
            throw new TypeError('"size" argument must be a number')
          } else if (size < 0) {
            throw new RangeError('"size" argument must not be negative')
          }
        }

        function alloc(that, size, fill, encoding) {
          assertSize(size)
          if (size <= 0) {
            return createBuffer(that, size)
          }
          if (fill !== undefined) {
            // Only pay attention to encoding if it's a string. This
            // prevents accidentally sending in a number that would
            // be interpretted as a start offset.
            return typeof encoding === "string"
              ? createBuffer(that, size).fill(fill, encoding)
              : createBuffer(that, size).fill(fill)
          }
          return createBuffer(that, size)
        }

        /**
         * Creates a new filled Buffer instance.
         * alloc(size[, fill[, encoding]])
         **/
        Buffer.alloc = function (size, fill, encoding) {
          return alloc(null, size, fill, encoding)
        }

        function allocUnsafe(that, size) {
          assertSize(size)
          that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
          if (!Buffer.TYPED_ARRAY_SUPPORT) {
            for (var i = 0; i < size; ++i) {
              that[i] = 0
            }
          }
          return that
        }

        /**
         * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
         * */
        Buffer.allocUnsafe = function (size) {
          return allocUnsafe(null, size)
        }
        /**
         * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
         */
        Buffer.allocUnsafeSlow = function (size) {
          return allocUnsafe(null, size)
        }

        function fromString(that, string, encoding) {
          if (typeof encoding !== "string" || encoding === "") {
            encoding = "utf8"
          }

          if (!Buffer.isEncoding(encoding)) {
            throw new TypeError('"encoding" must be a valid string encoding')
          }

          var length = byteLength(string, encoding) | 0
          that = createBuffer(that, length)

          var actual = that.write(string, encoding)

          if (actual !== length) {
            // Writing a hex string, for example, that contains invalid characters will
            // cause everything after the first invalid character to be ignored. (e.g.
            // 'abxxcd' will be treated as 'ab')
            that = that.slice(0, actual)
          }

          return that
        }

        function fromArrayLike(that, array) {
          var length = array.length < 0 ? 0 : checked(array.length) | 0
          that = createBuffer(that, length)
          for (var i = 0; i < length; i += 1) {
            that[i] = array[i] & 255
          }
          return that
        }

        function fromArrayBuffer(that, array, byteOffset, length) {
          array.byteLength // this throws if `array` is not a valid ArrayBuffer

          if (byteOffset < 0 || array.byteLength < byteOffset) {
            throw new RangeError("'offset' is out of bounds")
          }

          if (array.byteLength < byteOffset + (length || 0)) {
            throw new RangeError("'length' is out of bounds")
          }

          if (byteOffset === undefined && length === undefined) {
            array = new Uint8Array(array)
          } else if (length === undefined) {
            array = new Uint8Array(array, byteOffset)
          } else {
            array = new Uint8Array(array, byteOffset, length)
          }

          if (Buffer.TYPED_ARRAY_SUPPORT) {
            // Return an augmented `Uint8Array` instance, for best performance
            that = array
            that.__proto__ = Buffer.prototype
          } else {
            // Fallback: Return an object instance of the Buffer class
            that = fromArrayLike(that, array)
          }
          return that
        }

        function fromObject(that, obj) {
          if (Buffer.isBuffer(obj)) {
            var len = checked(obj.length) | 0
            that = createBuffer(that, len)

            if (that.length === 0) {
              return that
            }

            obj.copy(that, 0, 0, len)
            return that
          }

          if (obj) {
            if (
              (typeof ArrayBuffer !== "undefined" &&
                obj.buffer instanceof ArrayBuffer) ||
              "length" in obj
            ) {
              if (typeof obj.length !== "number" || isnan(obj.length)) {
                return createBuffer(that, 0)
              }
              return fromArrayLike(that, obj)
            }

            if (obj.type === "Buffer" && isArray(obj.data)) {
              return fromArrayLike(that, obj.data)
            }
          }

          throw new TypeError(
            "First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object."
          )
        }

        function checked(length) {
          // Note: cannot use `length < kMaxLength()` here because that fails when
          // length is NaN (which is otherwise coerced to zero.)
          if (length >= kMaxLength()) {
            throw new RangeError(
              "Attempt to allocate Buffer larger than maximum " +
                "size: 0x" +
                kMaxLength().toString(16) +
                " bytes"
            )
          }
          return length | 0
        }

        function SlowBuffer(length) {
          if (+length != length) {
            // eslint-disable-line eqeqeq
            length = 0
          }
          return Buffer.alloc(+length)
        }

        Buffer.isBuffer = function isBuffer(b) {
          return !!(b != null && b._isBuffer)
        }

        Buffer.compare = function compare(a, b) {
          if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
            throw new TypeError("Arguments must be Buffers")
          }

          if (a === b) return 0

          var x = a.length
          var y = b.length

          for (var i = 0, len = Math.min(x, y); i < len; ++i) {
            if (a[i] !== b[i]) {
              x = a[i]
              y = b[i]
              break
            }
          }

          if (x < y) return -1
          if (y < x) return 1
          return 0
        }

        Buffer.isEncoding = function isEncoding(encoding) {
          switch (String(encoding).toLowerCase()) {
            case "hex":
            case "utf8":
            case "utf-8":
            case "ascii":
            case "latin1":
            case "binary":
            case "base64":
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return true
            default:
              return false
          }
        }

        Buffer.concat = function concat(list, length) {
          if (!isArray(list)) {
            throw new TypeError('"list" argument must be an Array of Buffers')
          }

          if (list.length === 0) {
            return Buffer.alloc(0)
          }

          var i
          if (length === undefined) {
            length = 0
            for (i = 0; i < list.length; ++i) {
              length += list[i].length
            }
          }

          var buffer = Buffer.allocUnsafe(length)
          var pos = 0
          for (i = 0; i < list.length; ++i) {
            var buf = list[i]
            if (!Buffer.isBuffer(buf)) {
              throw new TypeError('"list" argument must be an Array of Buffers')
            }
            buf.copy(buffer, pos)
            pos += buf.length
          }
          return buffer
        }

        function byteLength(string, encoding) {
          if (Buffer.isBuffer(string)) {
            return string.length
          }
          if (
            typeof ArrayBuffer !== "undefined" &&
            typeof ArrayBuffer.isView === "function" &&
            (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)
          ) {
            return string.byteLength
          }
          if (typeof string !== "string") {
            string = "" + string
          }

          var len = string.length
          if (len === 0) return 0

          // Use a for loop to avoid recursion
          var loweredCase = false
          for (;;) {
            switch (encoding) {
              case "ascii":
              case "latin1":
              case "binary":
                return len
              case "utf8":
              case "utf-8":
              case undefined:
                return utf8ToBytes(string).length
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return len * 2
              case "hex":
                return len >>> 1
              case "base64":
                return base64ToBytes(string).length
              default:
                if (loweredCase) return utf8ToBytes(string).length // assume utf8
                encoding = ("" + encoding).toLowerCase()
                loweredCase = true
            }
          }
        }
        Buffer.byteLength = byteLength

        function slowToString(encoding, start, end) {
          var loweredCase = false

          // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
          // property of a typed array.

          // This behaves neither like String nor Uint8Array in that we set start/end
          // to their upper/lower bounds if the value passed is out of range.
          // undefined is handled specially as per ECMA-262 6th Edition,
          // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
          if (start === undefined || start < 0) {
            start = 0
          }
          // Return early if start > this.length. Done here to prevent potential uint32
          // coercion fail below.
          if (start > this.length) {
            return ""
          }

          if (end === undefined || end > this.length) {
            end = this.length
          }

          if (end <= 0) {
            return ""
          }

          // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
          end >>>= 0
          start >>>= 0

          if (end <= start) {
            return ""
          }

          if (!encoding) encoding = "utf8"

          while (true) {
            switch (encoding) {
              case "hex":
                return hexSlice(this, start, end)

              case "utf8":
              case "utf-8":
                return utf8Slice(this, start, end)

              case "ascii":
                return asciiSlice(this, start, end)

              case "latin1":
              case "binary":
                return latin1Slice(this, start, end)

              case "base64":
                return base64Slice(this, start, end)

              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return utf16leSlice(this, start, end)

              default:
                if (loweredCase)
                  throw new TypeError("Unknown encoding: " + encoding)
                encoding = (encoding + "").toLowerCase()
                loweredCase = true
            }
          }
        }

        // The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
        // Buffer instances.
        Buffer.prototype._isBuffer = true

        function swap(b, n, m) {
          var i = b[n]
          b[n] = b[m]
          b[m] = i
        }

        Buffer.prototype.swap16 = function swap16() {
          var len = this.length
          if (len % 2 !== 0) {
            throw new RangeError("Buffer size must be a multiple of 16-bits")
          }
          for (var i = 0; i < len; i += 2) {
            swap(this, i, i + 1)
          }
          return this
        }

        Buffer.prototype.swap32 = function swap32() {
          var len = this.length
          if (len % 4 !== 0) {
            throw new RangeError("Buffer size must be a multiple of 32-bits")
          }
          for (var i = 0; i < len; i += 4) {
            swap(this, i, i + 3)
            swap(this, i + 1, i + 2)
          }
          return this
        }

        Buffer.prototype.swap64 = function swap64() {
          var len = this.length
          if (len % 8 !== 0) {
            throw new RangeError("Buffer size must be a multiple of 64-bits")
          }
          for (var i = 0; i < len; i += 8) {
            swap(this, i, i + 7)
            swap(this, i + 1, i + 6)
            swap(this, i + 2, i + 5)
            swap(this, i + 3, i + 4)
          }
          return this
        }

        Buffer.prototype.toString = function toString() {
          var length = this.length | 0
          if (length === 0) return ""
          if (arguments.length === 0) return utf8Slice(this, 0, length)
          return slowToString.apply(this, arguments)
        }

        Buffer.prototype.equals = function equals(b) {
          if (!Buffer.isBuffer(b))
            throw new TypeError("Argument must be a Buffer")
          if (this === b) return true
          return Buffer.compare(this, b) === 0
        }

        Buffer.prototype.inspect = function inspect() {
          var str = ""
          var max = exports.INSPECT_MAX_BYTES
          if (this.length > 0) {
            str = this.toString("hex", 0, max).match(/.{2}/g).join(" ")
            if (this.length > max) str += " ... "
          }
          return "<Buffer " + str + ">"
        }

        Buffer.prototype.compare = function compare(
          target,
          start,
          end,
          thisStart,
          thisEnd
        ) {
          if (!Buffer.isBuffer(target)) {
            throw new TypeError("Argument must be a Buffer")
          }

          if (start === undefined) {
            start = 0
          }
          if (end === undefined) {
            end = target ? target.length : 0
          }
          if (thisStart === undefined) {
            thisStart = 0
          }
          if (thisEnd === undefined) {
            thisEnd = this.length
          }

          if (
            start < 0 ||
            end > target.length ||
            thisStart < 0 ||
            thisEnd > this.length
          ) {
            throw new RangeError("out of range index")
          }

          if (thisStart >= thisEnd && start >= end) {
            return 0
          }
          if (thisStart >= thisEnd) {
            return -1
          }
          if (start >= end) {
            return 1
          }

          start >>>= 0
          end >>>= 0
          thisStart >>>= 0
          thisEnd >>>= 0

          if (this === target) return 0

          var x = thisEnd - thisStart
          var y = end - start
          var len = Math.min(x, y)

          var thisCopy = this.slice(thisStart, thisEnd)
          var targetCopy = target.slice(start, end)

          for (var i = 0; i < len; ++i) {
            if (thisCopy[i] !== targetCopy[i]) {
              x = thisCopy[i]
              y = targetCopy[i]
              break
            }
          }

          if (x < y) return -1
          if (y < x) return 1
          return 0
        }

        // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
        // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
        //
        // Arguments:
        // - buffer - a Buffer to search
        // - val - a string, Buffer, or number
        // - byteOffset - an index into `buffer`; will be clamped to an int32
        // - encoding - an optional encoding, relevant is val is a string
        // - dir - true for indexOf, false for lastIndexOf
        function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
          // Empty buffer means no match
          if (buffer.length === 0) return -1

          // Normalize byteOffset
          if (typeof byteOffset === "string") {
            encoding = byteOffset
            byteOffset = 0
          } else if (byteOffset > 0x7fffffff) {
            byteOffset = 0x7fffffff
          } else if (byteOffset < -0x80000000) {
            byteOffset = -0x80000000
          }
          byteOffset = +byteOffset // Coerce to Number.
          if (isNaN(byteOffset)) {
            // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
            byteOffset = dir ? 0 : buffer.length - 1
          }

          // Normalize byteOffset: negative offsets start from the end of the buffer
          if (byteOffset < 0) byteOffset = buffer.length + byteOffset
          if (byteOffset >= buffer.length) {
            if (dir) return -1
            else byteOffset = buffer.length - 1
          } else if (byteOffset < 0) {
            if (dir) byteOffset = 0
            else return -1
          }

          // Normalize val
          if (typeof val === "string") {
            val = Buffer.from(val, encoding)
          }

          // Finally, search either indexOf (if dir is true) or lastIndexOf
          if (Buffer.isBuffer(val)) {
            // Special case: looking for empty string/buffer always fails
            if (val.length === 0) {
              return -1
            }
            return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
          } else if (typeof val === "number") {
            val = val & 0xff // Search for a byte value [0-255]
            if (
              Buffer.TYPED_ARRAY_SUPPORT &&
              typeof Uint8Array.prototype.indexOf === "function"
            ) {
              if (dir) {
                return Uint8Array.prototype.indexOf.call(
                  buffer,
                  val,
                  byteOffset
                )
              } else {
                return Uint8Array.prototype.lastIndexOf.call(
                  buffer,
                  val,
                  byteOffset
                )
              }
            }
            return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
          }

          throw new TypeError("val must be string, number or Buffer")
        }

        function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
          var indexSize = 1
          var arrLength = arr.length
          var valLength = val.length

          if (encoding !== undefined) {
            encoding = String(encoding).toLowerCase()
            if (
              encoding === "ucs2" ||
              encoding === "ucs-2" ||
              encoding === "utf16le" ||
              encoding === "utf-16le"
            ) {
              if (arr.length < 2 || val.length < 2) {
                return -1
              }
              indexSize = 2
              arrLength /= 2
              valLength /= 2
              byteOffset /= 2
            }
          }

          function read(buf, i) {
            if (indexSize === 1) {
              return buf[i]
            } else {
              return buf.readUInt16BE(i * indexSize)
            }
          }

          var i
          if (dir) {
            var foundIndex = -1
            for (i = byteOffset; i < arrLength; i++) {
              if (
                read(arr, i) ===
                read(val, foundIndex === -1 ? 0 : i - foundIndex)
              ) {
                if (foundIndex === -1) foundIndex = i
                if (i - foundIndex + 1 === valLength)
                  return foundIndex * indexSize
              } else {
                if (foundIndex !== -1) i -= i - foundIndex
                foundIndex = -1
              }
            }
          } else {
            if (byteOffset + valLength > arrLength)
              byteOffset = arrLength - valLength
            for (i = byteOffset; i >= 0; i--) {
              var found = true
              for (var j = 0; j < valLength; j++) {
                if (read(arr, i + j) !== read(val, j)) {
                  found = false
                  break
                }
              }
              if (found) return i
            }
          }

          return -1
        }

        Buffer.prototype.includes = function includes(
          val,
          byteOffset,
          encoding
        ) {
          return this.indexOf(val, byteOffset, encoding) !== -1
        }

        Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
          return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
        }

        Buffer.prototype.lastIndexOf = function lastIndexOf(
          val,
          byteOffset,
          encoding
        ) {
          return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
        }

        function hexWrite(buf, string, offset, length) {
          offset = Number(offset) || 0
          var remaining = buf.length - offset
          if (!length) {
            length = remaining
          } else {
            length = Number(length)
            if (length > remaining) {
              length = remaining
            }
          }

          // must be an even number of digits
          var strLen = string.length
          if (strLen % 2 !== 0) throw new TypeError("Invalid hex string")

          if (length > strLen / 2) {
            length = strLen / 2
          }
          for (var i = 0; i < length; ++i) {
            var parsed = parseInt(string.substr(i * 2, 2), 16)
            if (isNaN(parsed)) return i
            buf[offset + i] = parsed
          }
          return i
        }

        function utf8Write(buf, string, offset, length) {
          return blitBuffer(
            utf8ToBytes(string, buf.length - offset),
            buf,
            offset,
            length
          )
        }

        function asciiWrite(buf, string, offset, length) {
          return blitBuffer(asciiToBytes(string), buf, offset, length)
        }

        function latin1Write(buf, string, offset, length) {
          return asciiWrite(buf, string, offset, length)
        }

        function base64Write(buf, string, offset, length) {
          return blitBuffer(base64ToBytes(string), buf, offset, length)
        }

        function ucs2Write(buf, string, offset, length) {
          return blitBuffer(
            utf16leToBytes(string, buf.length - offset),
            buf,
            offset,
            length
          )
        }

        Buffer.prototype.write = function write(
          string,
          offset,
          length,
          encoding
        ) {
          // Buffer#write(string)
          if (offset === undefined) {
            encoding = "utf8"
            length = this.length
            offset = 0
            // Buffer#write(string, encoding)
          } else if (length === undefined && typeof offset === "string") {
            encoding = offset
            length = this.length
            offset = 0
            // Buffer#write(string, offset[, length][, encoding])
          } else if (isFinite(offset)) {
            offset = offset | 0
            if (isFinite(length)) {
              length = length | 0
              if (encoding === undefined) encoding = "utf8"
            } else {
              encoding = length
              length = undefined
            }
            // legacy write(string, encoding, offset, length) - remove in v0.13
          } else {
            throw new Error(
              "Buffer.write(string, encoding, offset[, length]) is no longer supported"
            )
          }

          var remaining = this.length - offset
          if (length === undefined || length > remaining) length = remaining

          if (
            (string.length > 0 && (length < 0 || offset < 0)) ||
            offset > this.length
          ) {
            throw new RangeError("Attempt to write outside buffer bounds")
          }

          if (!encoding) encoding = "utf8"

          var loweredCase = false
          for (;;) {
            switch (encoding) {
              case "hex":
                return hexWrite(this, string, offset, length)

              case "utf8":
              case "utf-8":
                return utf8Write(this, string, offset, length)

              case "ascii":
                return asciiWrite(this, string, offset, length)

              case "latin1":
              case "binary":
                return latin1Write(this, string, offset, length)

              case "base64":
                // Warning: maxLength not taken into account in base64Write
                return base64Write(this, string, offset, length)

              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return ucs2Write(this, string, offset, length)

              default:
                if (loweredCase)
                  throw new TypeError("Unknown encoding: " + encoding)
                encoding = ("" + encoding).toLowerCase()
                loweredCase = true
            }
          }
        }

        Buffer.prototype.toJSON = function toJSON() {
          return {
            type: "Buffer",
            data: Array.prototype.slice.call(this._arr || this, 0),
          }
        }

        function base64Slice(buf, start, end) {
          if (start === 0 && end === buf.length) {
            return base64.fromByteArray(buf)
          } else {
            return base64.fromByteArray(buf.slice(start, end))
          }
        }

        function utf8Slice(buf, start, end) {
          end = Math.min(buf.length, end)
          var res = []

          var i = start
          while (i < end) {
            var firstByte = buf[i]
            var codePoint = null
            var bytesPerSequence =
              firstByte > 0xef
                ? 4
                : firstByte > 0xdf
                ? 3
                : firstByte > 0xbf
                ? 2
                : 1

            if (i + bytesPerSequence <= end) {
              var secondByte, thirdByte, fourthByte, tempCodePoint

              switch (bytesPerSequence) {
                case 1:
                  if (firstByte < 0x80) {
                    codePoint = firstByte
                  }
                  break
                case 2:
                  secondByte = buf[i + 1]
                  if ((secondByte & 0xc0) === 0x80) {
                    tempCodePoint =
                      ((firstByte & 0x1f) << 0x6) | (secondByte & 0x3f)
                    if (tempCodePoint > 0x7f) {
                      codePoint = tempCodePoint
                    }
                  }
                  break
                case 3:
                  secondByte = buf[i + 1]
                  thirdByte = buf[i + 2]
                  if (
                    (secondByte & 0xc0) === 0x80 &&
                    (thirdByte & 0xc0) === 0x80
                  ) {
                    tempCodePoint =
                      ((firstByte & 0xf) << 0xc) |
                      ((secondByte & 0x3f) << 0x6) |
                      (thirdByte & 0x3f)
                    if (
                      tempCodePoint > 0x7ff &&
                      (tempCodePoint < 0xd800 || tempCodePoint > 0xdfff)
                    ) {
                      codePoint = tempCodePoint
                    }
                  }
                  break
                case 4:
                  secondByte = buf[i + 1]
                  thirdByte = buf[i + 2]
                  fourthByte = buf[i + 3]
                  if (
                    (secondByte & 0xc0) === 0x80 &&
                    (thirdByte & 0xc0) === 0x80 &&
                    (fourthByte & 0xc0) === 0x80
                  ) {
                    tempCodePoint =
                      ((firstByte & 0xf) << 0x12) |
                      ((secondByte & 0x3f) << 0xc) |
                      ((thirdByte & 0x3f) << 0x6) |
                      (fourthByte & 0x3f)
                    if (tempCodePoint > 0xffff && tempCodePoint < 0x110000) {
                      codePoint = tempCodePoint
                    }
                  }
              }
            }

            if (codePoint === null) {
              // we did not generate a valid codePoint so insert a
              // replacement char (U+FFFD) and advance only 1 byte
              codePoint = 0xfffd
              bytesPerSequence = 1
            } else if (codePoint > 0xffff) {
              // encode to utf16 (surrogate pair dance)
              codePoint -= 0x10000
              res.push(((codePoint >>> 10) & 0x3ff) | 0xd800)
              codePoint = 0xdc00 | (codePoint & 0x3ff)
            }

            res.push(codePoint)
            i += bytesPerSequence
          }

          return decodeCodePointsArray(res)
        }

        // Based on http://stackoverflow.com/a/22747272/680742, the browser with
        // the lowest limit is Chrome, with 0x10000 args.
        // We go 1 magnitude less, for safety
        var MAX_ARGUMENTS_LENGTH = 0x1000

        function decodeCodePointsArray(codePoints) {
          var len = codePoints.length
          if (len <= MAX_ARGUMENTS_LENGTH) {
            return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
          }

          // Decode in chunks to avoid "call stack size exceeded".
          var res = ""
          var i = 0
          while (i < len) {
            res += String.fromCharCode.apply(
              String,
              codePoints.slice(i, (i += MAX_ARGUMENTS_LENGTH))
            )
          }
          return res
        }

        function asciiSlice(buf, start, end) {
          var ret = ""
          end = Math.min(buf.length, end)

          for (var i = start; i < end; ++i) {
            ret += String.fromCharCode(buf[i] & 0x7f)
          }
          return ret
        }

        function latin1Slice(buf, start, end) {
          var ret = ""
          end = Math.min(buf.length, end)

          for (var i = start; i < end; ++i) {
            ret += String.fromCharCode(buf[i])
          }
          return ret
        }

        function hexSlice(buf, start, end) {
          var len = buf.length

          if (!start || start < 0) start = 0
          if (!end || end < 0 || end > len) end = len

          var out = ""
          for (var i = start; i < end; ++i) {
            out += toHex(buf[i])
          }
          return out
        }

        function utf16leSlice(buf, start, end) {
          var bytes = buf.slice(start, end)
          var res = ""
          for (var i = 0; i < bytes.length; i += 2) {
            res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
          }
          return res
        }

        Buffer.prototype.slice = function slice(start, end) {
          var len = this.length
          start = ~~start
          end = end === undefined ? len : ~~end

          if (start < 0) {
            start += len
            if (start < 0) start = 0
          } else if (start > len) {
            start = len
          }

          if (end < 0) {
            end += len
            if (end < 0) end = 0
          } else if (end > len) {
            end = len
          }

          if (end < start) end = start

          var newBuf
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            newBuf = this.subarray(start, end)
            newBuf.__proto__ = Buffer.prototype
          } else {
            var sliceLen = end - start
            newBuf = new Buffer(sliceLen, undefined)
            for (var i = 0; i < sliceLen; ++i) {
              newBuf[i] = this[i + start]
            }
          }

          return newBuf
        }

        /*
         * Need to make sure that buffer isn't trying to write out of bounds.
         */
        function checkOffset(offset, ext, length) {
          if (offset % 1 !== 0 || offset < 0)
            throw new RangeError("offset is not uint")
          if (offset + ext > length)
            throw new RangeError("Trying to access beyond buffer length")
        }

        Buffer.prototype.readUIntLE = function readUIntLE(
          offset,
          byteLength,
          noAssert
        ) {
          offset = offset | 0
          byteLength = byteLength | 0
          if (!noAssert) checkOffset(offset, byteLength, this.length)

          var val = this[offset]
          var mul = 1
          var i = 0
          while (++i < byteLength && (mul *= 0x100)) {
            val += this[offset + i] * mul
          }

          return val
        }

        Buffer.prototype.readUIntBE = function readUIntBE(
          offset,
          byteLength,
          noAssert
        ) {
          offset = offset | 0
          byteLength = byteLength | 0
          if (!noAssert) {
            checkOffset(offset, byteLength, this.length)
          }

          var val = this[offset + --byteLength]
          var mul = 1
          while (byteLength > 0 && (mul *= 0x100)) {
            val += this[offset + --byteLength] * mul
          }

          return val
        }

        Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
          if (!noAssert) checkOffset(offset, 1, this.length)
          return this[offset]
        }

        Buffer.prototype.readUInt16LE = function readUInt16LE(
          offset,
          noAssert
        ) {
          if (!noAssert) checkOffset(offset, 2, this.length)
          return this[offset] | (this[offset + 1] << 8)
        }

        Buffer.prototype.readUInt16BE = function readUInt16BE(
          offset,
          noAssert
        ) {
          if (!noAssert) checkOffset(offset, 2, this.length)
          return (this[offset] << 8) | this[offset + 1]
        }

        Buffer.prototype.readUInt32LE = function readUInt32LE(
          offset,
          noAssert
        ) {
          if (!noAssert) checkOffset(offset, 4, this.length)

          return (
            (this[offset] |
              (this[offset + 1] << 8) |
              (this[offset + 2] << 16)) +
            this[offset + 3] * 0x1000000
          )
        }

        Buffer.prototype.readUInt32BE = function readUInt32BE(
          offset,
          noAssert
        ) {
          if (!noAssert) checkOffset(offset, 4, this.length)

          return (
            this[offset] * 0x1000000 +
            ((this[offset + 1] << 16) |
              (this[offset + 2] << 8) |
              this[offset + 3])
          )
        }

        Buffer.prototype.readIntLE = function readIntLE(
          offset,
          byteLength,
          noAssert
        ) {
          offset = offset | 0
          byteLength = byteLength | 0
          if (!noAssert) checkOffset(offset, byteLength, this.length)

          var val = this[offset]
          var mul = 1
          var i = 0
          while (++i < byteLength && (mul *= 0x100)) {
            val += this[offset + i] * mul
          }
          mul *= 0x80

          if (val >= mul) val -= Math.pow(2, 8 * byteLength)

          return val
        }

        Buffer.prototype.readIntBE = function readIntBE(
          offset,
          byteLength,
          noAssert
        ) {
          offset = offset | 0
          byteLength = byteLength | 0
          if (!noAssert) checkOffset(offset, byteLength, this.length)

          var i = byteLength
          var mul = 1
          var val = this[offset + --i]
          while (i > 0 && (mul *= 0x100)) {
            val += this[offset + --i] * mul
          }
          mul *= 0x80

          if (val >= mul) val -= Math.pow(2, 8 * byteLength)

          return val
        }

        Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
          if (!noAssert) checkOffset(offset, 1, this.length)
          if (!(this[offset] & 0x80)) return this[offset]
          return (0xff - this[offset] + 1) * -1
        }

        Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
          if (!noAssert) checkOffset(offset, 2, this.length)
          var val = this[offset] | (this[offset + 1] << 8)
          return val & 0x8000 ? val | 0xffff0000 : val
        }

        Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
          if (!noAssert) checkOffset(offset, 2, this.length)
          var val = this[offset + 1] | (this[offset] << 8)
          return val & 0x8000 ? val | 0xffff0000 : val
        }

        Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
          if (!noAssert) checkOffset(offset, 4, this.length)

          return (
            this[offset] |
            (this[offset + 1] << 8) |
            (this[offset + 2] << 16) |
            (this[offset + 3] << 24)
          )
        }

        Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
          if (!noAssert) checkOffset(offset, 4, this.length)

          return (
            (this[offset] << 24) |
            (this[offset + 1] << 16) |
            (this[offset + 2] << 8) |
            this[offset + 3]
          )
        }

        Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
          if (!noAssert) checkOffset(offset, 4, this.length)
          return ieee754.read(this, offset, true, 23, 4)
        }

        Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
          if (!noAssert) checkOffset(offset, 4, this.length)
          return ieee754.read(this, offset, false, 23, 4)
        }

        Buffer.prototype.readDoubleLE = function readDoubleLE(
          offset,
          noAssert
        ) {
          if (!noAssert) checkOffset(offset, 8, this.length)
          return ieee754.read(this, offset, true, 52, 8)
        }

        Buffer.prototype.readDoubleBE = function readDoubleBE(
          offset,
          noAssert
        ) {
          if (!noAssert) checkOffset(offset, 8, this.length)
          return ieee754.read(this, offset, false, 52, 8)
        }

        function checkInt(buf, value, offset, ext, max, min) {
          if (!Buffer.isBuffer(buf))
            throw new TypeError('"buffer" argument must be a Buffer instance')
          if (value > max || value < min)
            throw new RangeError('"value" argument is out of bounds')
          if (offset + ext > buf.length)
            throw new RangeError("Index out of range")
        }

        Buffer.prototype.writeUIntLE = function writeUIntLE(
          value,
          offset,
          byteLength,
          noAssert
        ) {
          value = +value
          offset = offset | 0
          byteLength = byteLength | 0
          if (!noAssert) {
            var maxBytes = Math.pow(2, 8 * byteLength) - 1
            checkInt(this, value, offset, byteLength, maxBytes, 0)
          }

          var mul = 1
          var i = 0
          this[offset] = value & 0xff
          while (++i < byteLength && (mul *= 0x100)) {
            this[offset + i] = (value / mul) & 0xff
          }

          return offset + byteLength
        }

        Buffer.prototype.writeUIntBE = function writeUIntBE(
          value,
          offset,
          byteLength,
          noAssert
        ) {
          value = +value
          offset = offset | 0
          byteLength = byteLength | 0
          if (!noAssert) {
            var maxBytes = Math.pow(2, 8 * byteLength) - 1
            checkInt(this, value, offset, byteLength, maxBytes, 0)
          }

          var i = byteLength - 1
          var mul = 1
          this[offset + i] = value & 0xff
          while (--i >= 0 && (mul *= 0x100)) {
            this[offset + i] = (value / mul) & 0xff
          }

          return offset + byteLength
        }

        Buffer.prototype.writeUInt8 = function writeUInt8(
          value,
          offset,
          noAssert
        ) {
          value = +value
          offset = offset | 0
          if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
          if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
          this[offset] = value & 0xff
          return offset + 1
        }

        function objectWriteUInt16(buf, value, offset, littleEndian) {
          if (value < 0) value = 0xffff + value + 1
          for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
            buf[offset + i] =
              (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
              ((littleEndian ? i : 1 - i) * 8)
          }
        }

        Buffer.prototype.writeUInt16LE = function writeUInt16LE(
          value,
          offset,
          noAssert
        ) {
          value = +value
          offset = offset | 0
          if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset] = value & 0xff
            this[offset + 1] = value >>> 8
          } else {
            objectWriteUInt16(this, value, offset, true)
          }
          return offset + 2
        }

        Buffer.prototype.writeUInt16BE = function writeUInt16BE(
          value,
          offset,
          noAssert
        ) {
          value = +value
          offset = offset | 0
          if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset] = value >>> 8
            this[offset + 1] = value & 0xff
          } else {
            objectWriteUInt16(this, value, offset, false)
          }
          return offset + 2
        }

        function objectWriteUInt32(buf, value, offset, littleEndian) {
          if (value < 0) value = 0xffffffff + value + 1
          for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
            buf[offset + i] =
              (value >>> ((littleEndian ? i : 3 - i) * 8)) & 0xff
          }
        }

        Buffer.prototype.writeUInt32LE = function writeUInt32LE(
          value,
          offset,
          noAssert
        ) {
          value = +value
          offset = offset | 0
          if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset + 3] = value >>> 24
            this[offset + 2] = value >>> 16
            this[offset + 1] = value >>> 8
            this[offset] = value & 0xff
          } else {
            objectWriteUInt32(this, value, offset, true)
          }
          return offset + 4
        }

        Buffer.prototype.writeUInt32BE = function writeUInt32BE(
          value,
          offset,
          noAssert
        ) {
          value = +value
          offset = offset | 0
          if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset] = value >>> 24
            this[offset + 1] = value >>> 16
            this[offset + 2] = value >>> 8
            this[offset + 3] = value & 0xff
          } else {
            objectWriteUInt32(this, value, offset, false)
          }
          return offset + 4
        }

        Buffer.prototype.writeIntLE = function writeIntLE(
          value,
          offset,
          byteLength,
          noAssert
        ) {
          value = +value
          offset = offset | 0
          if (!noAssert) {
            var limit = Math.pow(2, 8 * byteLength - 1)

            checkInt(this, value, offset, byteLength, limit - 1, -limit)
          }

          var i = 0
          var mul = 1
          var sub = 0
          this[offset] = value & 0xff
          while (++i < byteLength && (mul *= 0x100)) {
            if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
              sub = 1
            }
            this[offset + i] = (((value / mul) >> 0) - sub) & 0xff
          }

          return offset + byteLength
        }

        Buffer.prototype.writeIntBE = function writeIntBE(
          value,
          offset,
          byteLength,
          noAssert
        ) {
          value = +value
          offset = offset | 0
          if (!noAssert) {
            var limit = Math.pow(2, 8 * byteLength - 1)

            checkInt(this, value, offset, byteLength, limit - 1, -limit)
          }

          var i = byteLength - 1
          var mul = 1
          var sub = 0
          this[offset + i] = value & 0xff
          while (--i >= 0 && (mul *= 0x100)) {
            if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
              sub = 1
            }
            this[offset + i] = (((value / mul) >> 0) - sub) & 0xff
          }

          return offset + byteLength
        }

        Buffer.prototype.writeInt8 = function writeInt8(
          value,
          offset,
          noAssert
        ) {
          value = +value
          offset = offset | 0
          if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
          if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
          if (value < 0) value = 0xff + value + 1
          this[offset] = value & 0xff
          return offset + 1
        }

        Buffer.prototype.writeInt16LE = function writeInt16LE(
          value,
          offset,
          noAssert
        ) {
          value = +value
          offset = offset | 0
          if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset] = value & 0xff
            this[offset + 1] = value >>> 8
          } else {
            objectWriteUInt16(this, value, offset, true)
          }
          return offset + 2
        }

        Buffer.prototype.writeInt16BE = function writeInt16BE(
          value,
          offset,
          noAssert
        ) {
          value = +value
          offset = offset | 0
          if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset] = value >>> 8
            this[offset + 1] = value & 0xff
          } else {
            objectWriteUInt16(this, value, offset, false)
          }
          return offset + 2
        }

        Buffer.prototype.writeInt32LE = function writeInt32LE(
          value,
          offset,
          noAssert
        ) {
          value = +value
          offset = offset | 0
          if (!noAssert)
            checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset] = value & 0xff
            this[offset + 1] = value >>> 8
            this[offset + 2] = value >>> 16
            this[offset + 3] = value >>> 24
          } else {
            objectWriteUInt32(this, value, offset, true)
          }
          return offset + 4
        }

        Buffer.prototype.writeInt32BE = function writeInt32BE(
          value,
          offset,
          noAssert
        ) {
          value = +value
          offset = offset | 0
          if (!noAssert)
            checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
          if (value < 0) value = 0xffffffff + value + 1
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset] = value >>> 24
            this[offset + 1] = value >>> 16
            this[offset + 2] = value >>> 8
            this[offset + 3] = value & 0xff
          } else {
            objectWriteUInt32(this, value, offset, false)
          }
          return offset + 4
        }

        function checkIEEE754(buf, value, offset, ext, max, min) {
          if (offset + ext > buf.length)
            throw new RangeError("Index out of range")
          if (offset < 0) throw new RangeError("Index out of range")
        }

        function writeFloat(buf, value, offset, littleEndian, noAssert) {
          if (!noAssert) {
            checkIEEE754(
              buf,
              value,
              offset,
              4,
              3.4028234663852886e38,
              -3.4028234663852886e38
            )
          }
          ieee754.write(buf, value, offset, littleEndian, 23, 4)
          return offset + 4
        }

        Buffer.prototype.writeFloatLE = function writeFloatLE(
          value,
          offset,
          noAssert
        ) {
          return writeFloat(this, value, offset, true, noAssert)
        }

        Buffer.prototype.writeFloatBE = function writeFloatBE(
          value,
          offset,
          noAssert
        ) {
          return writeFloat(this, value, offset, false, noAssert)
        }

        function writeDouble(buf, value, offset, littleEndian, noAssert) {
          if (!noAssert) {
            checkIEEE754(
              buf,
              value,
              offset,
              8,
              1.7976931348623157e308,
              -1.7976931348623157e308
            )
          }
          ieee754.write(buf, value, offset, littleEndian, 52, 8)
          return offset + 8
        }

        Buffer.prototype.writeDoubleLE = function writeDoubleLE(
          value,
          offset,
          noAssert
        ) {
          return writeDouble(this, value, offset, true, noAssert)
        }

        Buffer.prototype.writeDoubleBE = function writeDoubleBE(
          value,
          offset,
          noAssert
        ) {
          return writeDouble(this, value, offset, false, noAssert)
        }

        // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
        Buffer.prototype.copy = function copy(target, targetStart, start, end) {
          if (!start) start = 0
          if (!end && end !== 0) end = this.length
          if (targetStart >= target.length) targetStart = target.length
          if (!targetStart) targetStart = 0
          if (end > 0 && end < start) end = start

          // Copy 0 bytes; we're done
          if (end === start) return 0
          if (target.length === 0 || this.length === 0) return 0

          // Fatal error conditions
          if (targetStart < 0) {
            throw new RangeError("targetStart out of bounds")
          }
          if (start < 0 || start >= this.length)
            throw new RangeError("sourceStart out of bounds")
          if (end < 0) throw new RangeError("sourceEnd out of bounds")

          // Are we oob?
          if (end > this.length) end = this.length
          if (target.length - targetStart < end - start) {
            end = target.length - targetStart + start
          }

          var len = end - start
          var i

          if (this === target && start < targetStart && targetStart < end) {
            // descending copy from end
            for (i = len - 1; i >= 0; --i) {
              target[i + targetStart] = this[i + start]
            }
          } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
            // ascending copy from start
            for (i = 0; i < len; ++i) {
              target[i + targetStart] = this[i + start]
            }
          } else {
            Uint8Array.prototype.set.call(
              target,
              this.subarray(start, start + len),
              targetStart
            )
          }

          return len
        }

        // Usage:
        //    buffer.fill(number[, offset[, end]])
        //    buffer.fill(buffer[, offset[, end]])
        //    buffer.fill(string[, offset[, end]][, encoding])
        Buffer.prototype.fill = function fill(val, start, end, encoding) {
          // Handle string cases:
          if (typeof val === "string") {
            if (typeof start === "string") {
              encoding = start
              start = 0
              end = this.length
            } else if (typeof end === "string") {
              encoding = end
              end = this.length
            }
            if (val.length === 1) {
              var code = val.charCodeAt(0)
              if (code < 256) {
                val = code
              }
            }
            if (encoding !== undefined && typeof encoding !== "string") {
              throw new TypeError("encoding must be a string")
            }
            if (typeof encoding === "string" && !Buffer.isEncoding(encoding)) {
              throw new TypeError("Unknown encoding: " + encoding)
            }
          } else if (typeof val === "number") {
            val = val & 255
          }

          // Invalid ranges are not set to a default, so can range check early.
          if (start < 0 || this.length < start || this.length < end) {
            throw new RangeError("Out of range index")
          }

          if (end <= start) {
            return this
          }

          start = start >>> 0
          end = end === undefined ? this.length : end >>> 0

          if (!val) val = 0

          var i
          if (typeof val === "number") {
            for (i = start; i < end; ++i) {
              this[i] = val
            }
          } else {
            var bytes = Buffer.isBuffer(val)
              ? val
              : utf8ToBytes(new Buffer(val, encoding).toString())
            var len = bytes.length
            for (i = 0; i < end - start; ++i) {
              this[i + start] = bytes[i % len]
            }
          }

          return this
        }

        // HELPER FUNCTIONS
        // ================

        var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

        function base64clean(str) {
          // Node strips out invalid characters like \n and \t from the string, base64-js does not
          str = stringtrim(str).replace(INVALID_BASE64_RE, "")
          // Node converts strings with length < 2 to ''
          if (str.length < 2) return ""
          // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
          while (str.length % 4 !== 0) {
            str = str + "="
          }
          return str
        }

        function stringtrim(str) {
          if (str.trim) return str.trim()
          return str.replace(/^\s+|\s+$/g, "")
        }

        function toHex(n) {
          if (n < 16) return "0" + n.toString(16)
          return n.toString(16)
        }

        function utf8ToBytes(string, units) {
          units = units || Infinity
          var codePoint
          var length = string.length
          var leadSurrogate = null
          var bytes = []

          for (var i = 0; i < length; ++i) {
            codePoint = string.charCodeAt(i)

            // is surrogate component
            if (codePoint > 0xd7ff && codePoint < 0xe000) {
              // last char was a lead
              if (!leadSurrogate) {
                // no lead yet
                if (codePoint > 0xdbff) {
                  // unexpected trail
                  if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd)
                  continue
                } else if (i + 1 === length) {
                  // unpaired lead
                  if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd)
                  continue
                }

                // valid lead
                leadSurrogate = codePoint

                continue
              }

              // 2 leads in a row
              if (codePoint < 0xdc00) {
                if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd)
                leadSurrogate = codePoint
                continue
              }

              // valid surrogate pair
              codePoint =
                (((leadSurrogate - 0xd800) << 10) | (codePoint - 0xdc00)) +
                0x10000
            } else if (leadSurrogate) {
              // valid bmp char, but last char was a lead
              if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd)
            }

            leadSurrogate = null

            // encode utf8
            if (codePoint < 0x80) {
              if ((units -= 1) < 0) break
              bytes.push(codePoint)
            } else if (codePoint < 0x800) {
              if ((units -= 2) < 0) break
              bytes.push((codePoint >> 0x6) | 0xc0, (codePoint & 0x3f) | 0x80)
            } else if (codePoint < 0x10000) {
              if ((units -= 3) < 0) break
              bytes.push(
                (codePoint >> 0xc) | 0xe0,
                ((codePoint >> 0x6) & 0x3f) | 0x80,
                (codePoint & 0x3f) | 0x80
              )
            } else if (codePoint < 0x110000) {
              if ((units -= 4) < 0) break
              bytes.push(
                (codePoint >> 0x12) | 0xf0,
                ((codePoint >> 0xc) & 0x3f) | 0x80,
                ((codePoint >> 0x6) & 0x3f) | 0x80,
                (codePoint & 0x3f) | 0x80
              )
            } else {
              throw new Error("Invalid code point")
            }
          }

          return bytes
        }

        function asciiToBytes(str) {
          var byteArray = []
          for (var i = 0; i < str.length; ++i) {
            // Node's code seems to be doing this and not & 0x7F..
            byteArray.push(str.charCodeAt(i) & 0xff)
          }
          return byteArray
        }

        function utf16leToBytes(str, units) {
          var c, hi, lo
          var byteArray = []
          for (var i = 0; i < str.length; ++i) {
            if ((units -= 2) < 0) break

            c = str.charCodeAt(i)
            hi = c >> 8
            lo = c % 256
            byteArray.push(lo)
            byteArray.push(hi)
          }

          return byteArray
        }

        function base64ToBytes(str) {
          return base64.toByteArray(base64clean(str))
        }

        function blitBuffer(src, dst, offset, length) {
          for (var i = 0; i < length; ++i) {
            if (i + offset >= dst.length || i >= src.length) break
            dst[i + offset] = src[i]
          }
          return i
        }

        function isnan(val) {
          return val !== val // eslint-disable-line no-self-compare
        }
      },
      {
        "base64-js": "../node_modules/base64-js/index.js",
        ieee754: "../node_modules/ieee754/index.js",
        isarray: "../node_modules/isarray/index.js",
        buffer: "../node_modules/buffer/index.js",
      },
    ],
    "../node_modules/safe-buffer/index.js": [
      function (require, module, exports) {
        /* eslint-disable node/no-deprecated-api */
        var buffer = require("buffer")
        var Buffer = buffer.Buffer

        // alternative to using Object.keys for old browsers
        function copyProps(src, dst) {
          for (var key in src) {
            dst[key] = src[key]
          }
        }
        if (
          Buffer.from &&
          Buffer.alloc &&
          Buffer.allocUnsafe &&
          Buffer.allocUnsafeSlow
        ) {
          module.exports = buffer
        } else {
          // Copy properties from require('buffer')
          copyProps(buffer, exports)
          exports.Buffer = SafeBuffer
        }

        function SafeBuffer(arg, encodingOrOffset, length) {
          return Buffer(arg, encodingOrOffset, length)
        }

        // Copy static methods from Buffer
        copyProps(Buffer, SafeBuffer)

        SafeBuffer.from = function (arg, encodingOrOffset, length) {
          if (typeof arg === "number") {
            throw new TypeError("Argument must not be a number")
          }
          return Buffer(arg, encodingOrOffset, length)
        }

        SafeBuffer.alloc = function (size, fill, encoding) {
          if (typeof size !== "number") {
            throw new TypeError("Argument must be a number")
          }
          var buf = Buffer(size)
          if (fill !== undefined) {
            if (typeof encoding === "string") {
              buf.fill(fill, encoding)
            } else {
              buf.fill(fill)
            }
          } else {
            buf.fill(0)
          }
          return buf
        }

        SafeBuffer.allocUnsafe = function (size) {
          if (typeof size !== "number") {
            throw new TypeError("Argument must be a number")
          }
          return Buffer(size)
        }

        SafeBuffer.allocUnsafeSlow = function (size) {
          if (typeof size !== "number") {
            throw new TypeError("Argument must be a number")
          }
          return buffer.SlowBuffer(size)
        }
      },
      { buffer: "../node_modules/buffer/index.js" },
    ],
    "../node_modules/core-util-is/lib/util.js": [
      function (require, module, exports) {
        var Buffer = require("buffer").Buffer
        // Copyright Joyent, Inc. and other Node contributors.
        //
        // Permission is hereby granted, free of charge, to any person obtaining a
        // copy of this software and associated documentation files (the
        // "Software"), to deal in the Software without restriction, including
        // without limitation the rights to use, copy, modify, merge, publish,
        // distribute, sublicense, and/or sell copies of the Software, and to permit
        // persons to whom the Software is furnished to do so, subject to the
        // following conditions:
        //
        // The above copyright notice and this permission notice shall be included
        // in all copies or substantial portions of the Software.
        //
        // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
        // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
        // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
        // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
        // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
        // USE OR OTHER DEALINGS IN THE SOFTWARE.

        // NOTE: These type checking functions intentionally don't use `instanceof`
        // because it is fragile and can be easily faked with `Object.create()`.

        function isArray(arg) {
          if (Array.isArray) {
            return Array.isArray(arg)
          }
          return objectToString(arg) === "[object Array]"
        }
        exports.isArray = isArray

        function isBoolean(arg) {
          return typeof arg === "boolean"
        }
        exports.isBoolean = isBoolean

        function isNull(arg) {
          return arg === null
        }
        exports.isNull = isNull

        function isNullOrUndefined(arg) {
          return arg == null
        }
        exports.isNullOrUndefined = isNullOrUndefined

        function isNumber(arg) {
          return typeof arg === "number"
        }
        exports.isNumber = isNumber

        function isString(arg) {
          return typeof arg === "string"
        }
        exports.isString = isString

        function isSymbol(arg) {
          return typeof arg === "symbol"
        }
        exports.isSymbol = isSymbol

        function isUndefined(arg) {
          return arg === void 0
        }
        exports.isUndefined = isUndefined

        function isRegExp(re) {
          return objectToString(re) === "[object RegExp]"
        }
        exports.isRegExp = isRegExp

        function isObject(arg) {
          return typeof arg === "object" && arg !== null
        }
        exports.isObject = isObject

        function isDate(d) {
          return objectToString(d) === "[object Date]"
        }
        exports.isDate = isDate

        function isError(e) {
          return objectToString(e) === "[object Error]" || e instanceof Error
        }
        exports.isError = isError

        function isFunction(arg) {
          return typeof arg === "function"
        }
        exports.isFunction = isFunction

        function isPrimitive(arg) {
          return (
            arg === null ||
            typeof arg === "boolean" ||
            typeof arg === "number" ||
            typeof arg === "string" ||
            typeof arg === "symbol" || // ES6 symbol
            typeof arg === "undefined"
          )
        }
        exports.isPrimitive = isPrimitive

        exports.isBuffer = Buffer.isBuffer

        function objectToString(o) {
          return Object.prototype.toString.call(o)
        }
      },
      { buffer: "../node_modules/buffer/index.js" },
    ],
    "../node_modules/inherits/inherits_browser.js": [
      function (require, module, exports) {
        if (typeof Object.create === "function") {
          // implementation from standard node.js 'util' module
          module.exports = function inherits(ctor, superCtor) {
            if (superCtor) {
              ctor.super_ = superCtor
              ctor.prototype = Object.create(superCtor.prototype, {
                constructor: {
                  value: ctor,
                  enumerable: false,
                  writable: true,
                  configurable: true,
                },
              })
            }
          }
        } else {
          // old school shim for old browsers
          module.exports = function inherits(ctor, superCtor) {
            if (superCtor) {
              ctor.super_ = superCtor
              var TempCtor = function () {}
              TempCtor.prototype = superCtor.prototype
              ctor.prototype = new TempCtor()
              ctor.prototype.constructor = ctor
            }
          }
        }
      },
      {},
    ],
    "../node_modules/parcel-bundler/src/builtins/_empty.js": [
      function (require, module, exports) {},
      {},
    ],
    "../node_modules/readable-stream/lib/internal/streams/BufferList.js": [
      function (require, module, exports) {
        "use strict"

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function")
          }
        }

        var Buffer = require("safe-buffer").Buffer
        var util = require("util")

        function copyBuffer(src, target, offset) {
          src.copy(target, offset)
        }

        module.exports = (function () {
          function BufferList() {
            _classCallCheck(this, BufferList)

            this.head = null
            this.tail = null
            this.length = 0
          }

          BufferList.prototype.push = function push(v) {
            var entry = { data: v, next: null }
            if (this.length > 0) this.tail.next = entry
            else this.head = entry
            this.tail = entry
            ++this.length
          }

          BufferList.prototype.unshift = function unshift(v) {
            var entry = { data: v, next: this.head }
            if (this.length === 0) this.tail = entry
            this.head = entry
            ++this.length
          }

          BufferList.prototype.shift = function shift() {
            if (this.length === 0) return
            var ret = this.head.data
            if (this.length === 1) this.head = this.tail = null
            else this.head = this.head.next
            --this.length
            return ret
          }

          BufferList.prototype.clear = function clear() {
            this.head = this.tail = null
            this.length = 0
          }

          BufferList.prototype.join = function join(s) {
            if (this.length === 0) return ""
            var p = this.head
            var ret = "" + p.data
            while ((p = p.next)) {
              ret += s + p.data
            }
            return ret
          }

          BufferList.prototype.concat = function concat(n) {
            if (this.length === 0) return Buffer.alloc(0)
            if (this.length === 1) return this.head.data
            var ret = Buffer.allocUnsafe(n >>> 0)
            var p = this.head
            var i = 0
            while (p) {
              copyBuffer(p.data, ret, i)
              i += p.data.length
              p = p.next
            }
            return ret
          }

          return BufferList
        })()

        if (util && util.inspect && util.inspect.custom) {
          module.exports.prototype[util.inspect.custom] = function () {
            var obj = util.inspect({ length: this.length })
            return this.constructor.name + " " + obj
          }
        }
      },
      {
        "safe-buffer": "../node_modules/safe-buffer/index.js",
        util: "../node_modules/parcel-bundler/src/builtins/_empty.js",
      },
    ],
    "../node_modules/readable-stream/lib/internal/streams/destroy.js": [
      function (require, module, exports) {
        "use strict"

        /*<replacement>*/

        var pna = require("process-nextick-args")
        /*</replacement>*/

        // undocumented cb() API, needed for core, not for public API
        function destroy(err, cb) {
          var _this = this

          var readableDestroyed =
            this._readableState && this._readableState.destroyed
          var writableDestroyed =
            this._writableState && this._writableState.destroyed

          if (readableDestroyed || writableDestroyed) {
            if (cb) {
              cb(err)
            } else if (
              err &&
              (!this._writableState || !this._writableState.errorEmitted)
            ) {
              pna.nextTick(emitErrorNT, this, err)
            }
            return this
          }

          // we set destroyed to true before firing error callbacks in order
          // to make it re-entrance safe in case destroy() is called within callbacks

          if (this._readableState) {
            this._readableState.destroyed = true
          }

          // if this is a duplex stream mark the writable part as destroyed as well
          if (this._writableState) {
            this._writableState.destroyed = true
          }

          this._destroy(err || null, function (err) {
            if (!cb && err) {
              pna.nextTick(emitErrorNT, _this, err)
              if (_this._writableState) {
                _this._writableState.errorEmitted = true
              }
            } else if (cb) {
              cb(err)
            }
          })

          return this
        }

        function undestroy() {
          if (this._readableState) {
            this._readableState.destroyed = false
            this._readableState.reading = false
            this._readableState.ended = false
            this._readableState.endEmitted = false
          }

          if (this._writableState) {
            this._writableState.destroyed = false
            this._writableState.ended = false
            this._writableState.ending = false
            this._writableState.finished = false
            this._writableState.errorEmitted = false
          }
        }

        function emitErrorNT(self, err) {
          self.emit("error", err)
        }

        module.exports = {
          destroy: destroy,
          undestroy: undestroy,
        }
      },
      {
        "process-nextick-args": "../node_modules/process-nextick-args/index.js",
      },
    ],
    "../node_modules/util-deprecate/browser.js": [
      function (require, module, exports) {
        var global = arguments[3]

        /**
         * Module exports.
         */

        module.exports = deprecate

        /**
         * Mark that a method should not be used.
         * Returns a modified function which warns once by default.
         *
         * If `localStorage.noDeprecation = true` is set, then it is a no-op.
         *
         * If `localStorage.throwDeprecation = true` is set, then deprecated functions
         * will throw an Error when invoked.
         *
         * If `localStorage.traceDeprecation = true` is set, then deprecated functions
         * will invoke `console.trace()` instead of `console.error()`.
         *
         * @param {Function} fn - the function to deprecate
         * @param {String} msg - the string to print to the console when `fn` is invoked
         * @returns {Function} a new "deprecated" version of `fn`
         * @api public
         */

        function deprecate(fn, msg) {
          if (config("noDeprecation")) {
            return fn
          }

          var warned = false
          function deprecated() {
            if (!warned) {
              if (config("throwDeprecation")) {
                throw new Error(msg)
              } else if (config("traceDeprecation")) {
                console.trace(msg)
              } else {
                console.warn(msg)
              }
              warned = true
            }
            return fn.apply(this, arguments)
          }

          return deprecated
        }

        /**
         * Checks `localStorage` for boolean values for the given `name`.
         *
         * @param {String} name
         * @returns {Boolean}
         * @api private
         */

        function config(name) {
          // accessing global.localStorage can trigger a DOMException in sandboxed iframes
          try {
            if (!global.localStorage) return false
          } catch (_) {
            return false
          }
          var val = global.localStorage[name]
          if (null == val) return false
          return String(val).toLowerCase() === "true"
        }
      },
      {},
    ],
    "../node_modules/readable-stream/lib/_stream_writable.js": [
      function (require, module, exports) {
        var process = require("process")

        var global = arguments[3]
        // Copyright Joyent, Inc. and other Node contributors.
        //
        // Permission is hereby granted, free of charge, to any person obtaining a
        // copy of this software and associated documentation files (the
        // "Software"), to deal in the Software without restriction, including
        // without limitation the rights to use, copy, modify, merge, publish,
        // distribute, sublicense, and/or sell copies of the Software, and to permit
        // persons to whom the Software is furnished to do so, subject to the
        // following conditions:
        //
        // The above copyright notice and this permission notice shall be included
        // in all copies or substantial portions of the Software.
        //
        // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
        // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
        // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
        // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
        // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
        // USE OR OTHER DEALINGS IN THE SOFTWARE.
        // A bit simpler than readable streams.
        // Implement an async ._write(chunk, encoding, cb), and it'll handle all
        // the drain event emission and buffering.
        ;("use strict")
        /*<replacement>*/

        var pna = require("process-nextick-args")
        /*</replacement>*/

        module.exports = Writable
        /* <replacement> */

        function WriteReq(chunk, encoding, cb) {
          this.chunk = chunk
          this.encoding = encoding
          this.callback = cb
          this.next = null
        } // It seems a linked list but it is not
        // there will be only 2 of these for each stream

        function CorkedRequest(state) {
          var _this = this

          this.next = null
          this.entry = null

          this.finish = function () {
            onCorkedFinish(_this, state)
          }
        }
        /* </replacement> */

        /*<replacement>*/

        var asyncWrite =
          !true && ["v0.10", "v0.9."].indexOf(process.version.slice(0, 5)) > -1
            ? setImmediate
            : pna.nextTick
        /*</replacement>*/

        /*<replacement>*/

        var Duplex
        /*</replacement>*/

        Writable.WritableState = WritableState
        /*<replacement>*/

        var util = Object.create(require("core-util-is"))
        util.inherits = require("inherits")
        /*</replacement>*/

        /*<replacement>*/

        var internalUtil = {
          deprecate: require("util-deprecate"),
        }
        /*</replacement>*/

        /*<replacement>*/

        var Stream = require("./internal/streams/stream")
        /*</replacement>*/

        /*<replacement>*/

        var Buffer = require("safe-buffer").Buffer

        var OurUint8Array = global.Uint8Array || function () {}

        function _uint8ArrayToBuffer(chunk) {
          return Buffer.from(chunk)
        }

        function _isUint8Array(obj) {
          return Buffer.isBuffer(obj) || obj instanceof OurUint8Array
        }
        /*</replacement>*/

        var destroyImpl = require("./internal/streams/destroy")

        util.inherits(Writable, Stream)

        function nop() {}

        function WritableState(options, stream) {
          Duplex = Duplex || require("./_stream_duplex")
          options = options || {} // Duplex streams are both readable and writable, but share
          // the same options object.
          // However, some cases require setting options to different
          // values for the readable and the writable sides of the duplex stream.
          // These options can be provided separately as readableXXX and writableXXX.

          var isDuplex = stream instanceof Duplex // object stream flag to indicate whether or not this stream
          // contains buffers or objects.

          this.objectMode = !!options.objectMode
          if (isDuplex)
            this.objectMode = this.objectMode || !!options.writableObjectMode // the point at which write() starts returning false
          // Note: 0 is a valid value, means that we always return false if
          // the entire buffer is not flushed immediately on write()

          var hwm = options.highWaterMark
          var writableHwm = options.writableHighWaterMark
          var defaultHwm = this.objectMode ? 16 : 16 * 1024
          if (hwm || hwm === 0) this.highWaterMark = hwm
          else if (isDuplex && (writableHwm || writableHwm === 0))
            this.highWaterMark = writableHwm
          else this.highWaterMark = defaultHwm // cast to ints.

          this.highWaterMark = Math.floor(this.highWaterMark) // if _final has been called

          this.finalCalled = false // drain event flag.

          this.needDrain = false // at the start of calling end()

          this.ending = false // when end() has been called, and returned

          this.ended = false // when 'finish' is emitted

          this.finished = false // has it been destroyed

          this.destroyed = false // should we decode strings into buffers before passing to _write?
          // this is here so that some node-core streams can optimize string
          // handling at a lower level.

          var noDecode = options.decodeStrings === false
          this.decodeStrings = !noDecode // Crypto is kind of old and crusty.  Historically, its default string
          // encoding is 'binary' so we have to make this configurable.
          // Everything else in the universe uses 'utf8', though.

          this.defaultEncoding = options.defaultEncoding || "utf8" // not an actual buffer we keep track of, but a measurement
          // of how much we're waiting to get pushed to some underlying
          // socket or file.

          this.length = 0 // a flag to see when we're in the middle of a write.

          this.writing = false // when true all writes will be buffered until .uncork() call

          this.corked = 0 // a flag to be able to tell if the onwrite cb is called immediately,
          // or on a later tick.  We set this to true at first, because any
          // actions that shouldn't happen until "later" should generally also
          // not happen before the first write call.

          this.sync = true // a flag to know if we're processing previously buffered items, which
          // may call the _write() callback in the same tick, so that we don't
          // end up in an overlapped onwrite situation.

          this.bufferProcessing = false // the callback that's passed to _write(chunk,cb)

          this.onwrite = function (er) {
            onwrite(stream, er)
          } // the callback that the user supplies to write(chunk,encoding,cb)

          this.writecb = null // the amount that is being written when _write is called.

          this.writelen = 0
          this.bufferedRequest = null
          this.lastBufferedRequest = null // number of pending user-supplied write callbacks
          // this must be 0 before 'finish' can be emitted

          this.pendingcb = 0 // emit prefinish if the only thing we're waiting for is _write cbs
          // This is relevant for synchronous Transform streams

          this.prefinished = false // True if the error was already emitted and should not be thrown again

          this.errorEmitted = false // count buffered requests

          this.bufferedRequestCount = 0 // allocate the first CorkedRequest, there is always
          // one allocated and free to use, and we maintain at most two

          this.corkedRequestsFree = new CorkedRequest(this)
        }

        WritableState.prototype.getBuffer = function getBuffer() {
          var current = this.bufferedRequest
          var out = []

          while (current) {
            out.push(current)
            current = current.next
          }

          return out
        }

        ;(function () {
          try {
            Object.defineProperty(WritableState.prototype, "buffer", {
              get: internalUtil.deprecate(
                function () {
                  return this.getBuffer()
                },
                "_writableState.buffer is deprecated. Use _writableState.getBuffer " +
                  "instead.",
                "DEP0003"
              ),
            })
          } catch (_) {}
        })() // Test _writableState for inheritance to account for Duplex streams,
        // whose prototype chain only points to Readable.

        var realHasInstance

        if (
          typeof Symbol === "function" &&
          Symbol.hasInstance &&
          typeof Function.prototype[Symbol.hasInstance] === "function"
        ) {
          realHasInstance = Function.prototype[Symbol.hasInstance]
          Object.defineProperty(Writable, Symbol.hasInstance, {
            value: function (object) {
              if (realHasInstance.call(this, object)) return true
              if (this !== Writable) return false
              return object && object._writableState instanceof WritableState
            },
          })
        } else {
          realHasInstance = function (object) {
            return object instanceof this
          }
        }

        function Writable(options) {
          Duplex = Duplex || require("./_stream_duplex") // Writable ctor is applied to Duplexes, too.
          // `realHasInstance` is necessary because using plain `instanceof`
          // would return false, as no `_writableState` property is attached.
          // Trying to use the custom `instanceof` for Writable here will also break the
          // Node.js LazyTransform implementation, which has a non-trivial getter for
          // `_writableState` that would lead to infinite recursion.

          if (
            !realHasInstance.call(Writable, this) &&
            !(this instanceof Duplex)
          ) {
            return new Writable(options)
          }

          this._writableState = new WritableState(options, this) // legacy.

          this.writable = true

          if (options) {
            if (typeof options.write === "function") this._write = options.write
            if (typeof options.writev === "function")
              this._writev = options.writev
            if (typeof options.destroy === "function")
              this._destroy = options.destroy
            if (typeof options.final === "function") this._final = options.final
          }

          Stream.call(this)
        } // Otherwise people can pipe Writable streams, which is just wrong.

        Writable.prototype.pipe = function () {
          this.emit("error", new Error("Cannot pipe, not readable"))
        }

        function writeAfterEnd(stream, cb) {
          var er = new Error("write after end") // TODO: defer error events consistently everywhere, not just the cb

          stream.emit("error", er)
          pna.nextTick(cb, er)
        } // Checks that a user-supplied chunk is valid, especially for the particular
        // mode the stream is in. Currently this means that `null` is never accepted
        // and undefined/non-string values are only allowed in object mode.

        function validChunk(stream, state, chunk, cb) {
          var valid = true
          var er = false

          if (chunk === null) {
            er = new TypeError("May not write null values to stream")
          } else if (
            typeof chunk !== "string" &&
            chunk !== undefined &&
            !state.objectMode
          ) {
            er = new TypeError("Invalid non-string/buffer chunk")
          }

          if (er) {
            stream.emit("error", er)
            pna.nextTick(cb, er)
            valid = false
          }

          return valid
        }

        Writable.prototype.write = function (chunk, encoding, cb) {
          var state = this._writableState
          var ret = false

          var isBuf = !state.objectMode && _isUint8Array(chunk)

          if (isBuf && !Buffer.isBuffer(chunk)) {
            chunk = _uint8ArrayToBuffer(chunk)
          }

          if (typeof encoding === "function") {
            cb = encoding
            encoding = null
          }

          if (isBuf) encoding = "buffer"
          else if (!encoding) encoding = state.defaultEncoding
          if (typeof cb !== "function") cb = nop
          if (state.ended) writeAfterEnd(this, cb)
          else if (isBuf || validChunk(this, state, chunk, cb)) {
            state.pendingcb++
            ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb)
          }
          return ret
        }

        Writable.prototype.cork = function () {
          var state = this._writableState
          state.corked++
        }

        Writable.prototype.uncork = function () {
          var state = this._writableState

          if (state.corked) {
            state.corked--
            if (
              !state.writing &&
              !state.corked &&
              !state.finished &&
              !state.bufferProcessing &&
              state.bufferedRequest
            )
              clearBuffer(this, state)
          }
        }

        Writable.prototype.setDefaultEncoding = function setDefaultEncoding(
          encoding
        ) {
          // node::ParseEncoding() requires lower case.
          if (typeof encoding === "string") encoding = encoding.toLowerCase()
          if (
            !(
              [
                "hex",
                "utf8",
                "utf-8",
                "ascii",
                "binary",
                "base64",
                "ucs2",
                "ucs-2",
                "utf16le",
                "utf-16le",
                "raw",
              ].indexOf((encoding + "").toLowerCase()) > -1
            )
          )
            throw new TypeError("Unknown encoding: " + encoding)
          this._writableState.defaultEncoding = encoding
          return this
        }

        function decodeChunk(state, chunk, encoding) {
          if (
            !state.objectMode &&
            state.decodeStrings !== false &&
            typeof chunk === "string"
          ) {
            chunk = Buffer.from(chunk, encoding)
          }

          return chunk
        }

        Object.defineProperty(Writable.prototype, "writableHighWaterMark", {
          // making it explicit this property is not enumerable
          // because otherwise some prototype manipulation in
          // userland will fail
          enumerable: false,
          get: function () {
            return this._writableState.highWaterMark
          },
        }) // if we're already writing something, then just put this
        // in the queue, and wait our turn.  Otherwise, call _write
        // If we return false, then we need a drain event, so set that flag.

        function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
          if (!isBuf) {
            var newChunk = decodeChunk(state, chunk, encoding)

            if (chunk !== newChunk) {
              isBuf = true
              encoding = "buffer"
              chunk = newChunk
            }
          }

          var len = state.objectMode ? 1 : chunk.length
          state.length += len
          var ret = state.length < state.highWaterMark // we must ensure that previous needDrain will not be reset to false.

          if (!ret) state.needDrain = true

          if (state.writing || state.corked) {
            var last = state.lastBufferedRequest
            state.lastBufferedRequest = {
              chunk: chunk,
              encoding: encoding,
              isBuf: isBuf,
              callback: cb,
              next: null,
            }

            if (last) {
              last.next = state.lastBufferedRequest
            } else {
              state.bufferedRequest = state.lastBufferedRequest
            }

            state.bufferedRequestCount += 1
          } else {
            doWrite(stream, state, false, len, chunk, encoding, cb)
          }

          return ret
        }

        function doWrite(stream, state, writev, len, chunk, encoding, cb) {
          state.writelen = len
          state.writecb = cb
          state.writing = true
          state.sync = true
          if (writev) stream._writev(chunk, state.onwrite)
          else stream._write(chunk, encoding, state.onwrite)
          state.sync = false
        }

        function onwriteError(stream, state, sync, er, cb) {
          --state.pendingcb

          if (sync) {
            // defer the callback if we are being called synchronously
            // to avoid piling up things on the stack
            pna.nextTick(cb, er) // this can emit finish, and it will always happen
            // after error

            pna.nextTick(finishMaybe, stream, state)
            stream._writableState.errorEmitted = true
            stream.emit("error", er)
          } else {
            // the caller expect this to happen before if
            // it is async
            cb(er)
            stream._writableState.errorEmitted = true
            stream.emit("error", er) // this can emit finish, but finish must
            // always follow error

            finishMaybe(stream, state)
          }
        }

        function onwriteStateUpdate(state) {
          state.writing = false
          state.writecb = null
          state.length -= state.writelen
          state.writelen = 0
        }

        function onwrite(stream, er) {
          var state = stream._writableState
          var sync = state.sync
          var cb = state.writecb
          onwriteStateUpdate(state)
          if (er) onwriteError(stream, state, sync, er, cb)
          else {
            // Check if we're actually ready to finish, but don't emit yet
            var finished = needFinish(state)

            if (
              !finished &&
              !state.corked &&
              !state.bufferProcessing &&
              state.bufferedRequest
            ) {
              clearBuffer(stream, state)
            }

            if (sync) {
              /*<replacement>*/
              asyncWrite(afterWrite, stream, state, finished, cb)
              /*</replacement>*/
            } else {
              afterWrite(stream, state, finished, cb)
            }
          }
        }

        function afterWrite(stream, state, finished, cb) {
          if (!finished) onwriteDrain(stream, state)
          state.pendingcb--
          cb()
          finishMaybe(stream, state)
        } // Must force callback to be called on nextTick, so that we don't
        // emit 'drain' before the write() consumer gets the 'false' return
        // value, and has a chance to attach a 'drain' listener.

        function onwriteDrain(stream, state) {
          if (state.length === 0 && state.needDrain) {
            state.needDrain = false
            stream.emit("drain")
          }
        } // if there's something in the buffer waiting, then process it

        function clearBuffer(stream, state) {
          state.bufferProcessing = true
          var entry = state.bufferedRequest

          if (stream._writev && entry && entry.next) {
            // Fast case, write everything using _writev()
            var l = state.bufferedRequestCount
            var buffer = new Array(l)
            var holder = state.corkedRequestsFree
            holder.entry = entry
            var count = 0
            var allBuffers = true

            while (entry) {
              buffer[count] = entry
              if (!entry.isBuf) allBuffers = false
              entry = entry.next
              count += 1
            }

            buffer.allBuffers = allBuffers
            doWrite(
              stream,
              state,
              true,
              state.length,
              buffer,
              "",
              holder.finish
            ) // doWrite is almost always async, defer these to save a bit of time
            // as the hot path ends with doWrite

            state.pendingcb++
            state.lastBufferedRequest = null

            if (holder.next) {
              state.corkedRequestsFree = holder.next
              holder.next = null
            } else {
              state.corkedRequestsFree = new CorkedRequest(state)
            }

            state.bufferedRequestCount = 0
          } else {
            // Slow case, write chunks one-by-one
            while (entry) {
              var chunk = entry.chunk
              var encoding = entry.encoding
              var cb = entry.callback
              var len = state.objectMode ? 1 : chunk.length
              doWrite(stream, state, false, len, chunk, encoding, cb)
              entry = entry.next
              state.bufferedRequestCount-- // if we didn't call the onwrite immediately, then
              // it means that we need to wait until it does.
              // also, that means that the chunk and cb are currently
              // being processed, so move the buffer counter past them.

              if (state.writing) {
                break
              }
            }

            if (entry === null) state.lastBufferedRequest = null
          }

          state.bufferedRequest = entry
          state.bufferProcessing = false
        }

        Writable.prototype._write = function (chunk, encoding, cb) {
          cb(new Error("_write() is not implemented"))
        }

        Writable.prototype._writev = null

        Writable.prototype.end = function (chunk, encoding, cb) {
          var state = this._writableState

          if (typeof chunk === "function") {
            cb = chunk
            chunk = null
            encoding = null
          } else if (typeof encoding === "function") {
            cb = encoding
            encoding = null
          }

          if (chunk !== null && chunk !== undefined) this.write(chunk, encoding) // .end() fully uncorks

          if (state.corked) {
            state.corked = 1
            this.uncork()
          } // ignore unnecessary end() calls.

          if (!state.ending && !state.finished) endWritable(this, state, cb)
        }

        function needFinish(state) {
          return (
            state.ending &&
            state.length === 0 &&
            state.bufferedRequest === null &&
            !state.finished &&
            !state.writing
          )
        }

        function callFinal(stream, state) {
          stream._final(function (err) {
            state.pendingcb--

            if (err) {
              stream.emit("error", err)
            }

            state.prefinished = true
            stream.emit("prefinish")
            finishMaybe(stream, state)
          })
        }

        function prefinish(stream, state) {
          if (!state.prefinished && !state.finalCalled) {
            if (typeof stream._final === "function") {
              state.pendingcb++
              state.finalCalled = true
              pna.nextTick(callFinal, stream, state)
            } else {
              state.prefinished = true
              stream.emit("prefinish")
            }
          }
        }

        function finishMaybe(stream, state) {
          var need = needFinish(state)

          if (need) {
            prefinish(stream, state)

            if (state.pendingcb === 0) {
              state.finished = true
              stream.emit("finish")
            }
          }

          return need
        }

        function endWritable(stream, state, cb) {
          state.ending = true
          finishMaybe(stream, state)

          if (cb) {
            if (state.finished) pna.nextTick(cb)
            else stream.once("finish", cb)
          }

          state.ended = true
          stream.writable = false
        }

        function onCorkedFinish(corkReq, state, err) {
          var entry = corkReq.entry
          corkReq.entry = null

          while (entry) {
            var cb = entry.callback
            state.pendingcb--
            cb(err)
            entry = entry.next
          }

          if (state.corkedRequestsFree) {
            state.corkedRequestsFree.next = corkReq
          } else {
            state.corkedRequestsFree = corkReq
          }
        }

        Object.defineProperty(Writable.prototype, "destroyed", {
          get: function () {
            if (this._writableState === undefined) {
              return false
            }

            return this._writableState.destroyed
          },
          set: function (value) {
            // we ignore the value if the stream
            // has not been initialized yet
            if (!this._writableState) {
              return
            } // backward compatibility, the user is explicitly
            // managing destroyed

            this._writableState.destroyed = value
          },
        })
        Writable.prototype.destroy = destroyImpl.destroy
        Writable.prototype._undestroy = destroyImpl.undestroy

        Writable.prototype._destroy = function (err, cb) {
          this.end()
          cb(err)
        }
      },
      {
        "process-nextick-args": "../node_modules/process-nextick-args/index.js",
        "core-util-is": "../node_modules/core-util-is/lib/util.js",
        inherits: "../node_modules/inherits/inherits_browser.js",
        "util-deprecate": "../node_modules/util-deprecate/browser.js",
        "./internal/streams/stream":
          "../node_modules/readable-stream/lib/internal/streams/stream-browser.js",
        "safe-buffer": "../node_modules/safe-buffer/index.js",
        "./internal/streams/destroy":
          "../node_modules/readable-stream/lib/internal/streams/destroy.js",
        "./_stream_duplex":
          "../node_modules/readable-stream/lib/_stream_duplex.js",
        process: "../node_modules/process/browser.js",
      },
    ],
    "../node_modules/readable-stream/lib/_stream_duplex.js": [
      function (require, module, exports) {
        // Copyright Joyent, Inc. and other Node contributors.
        //
        // Permission is hereby granted, free of charge, to any person obtaining a
        // copy of this software and associated documentation files (the
        // "Software"), to deal in the Software without restriction, including
        // without limitation the rights to use, copy, modify, merge, publish,
        // distribute, sublicense, and/or sell copies of the Software, and to permit
        // persons to whom the Software is furnished to do so, subject to the
        // following conditions:
        //
        // The above copyright notice and this permission notice shall be included
        // in all copies or substantial portions of the Software.
        //
        // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
        // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
        // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
        // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
        // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
        // USE OR OTHER DEALINGS IN THE SOFTWARE.

        // a duplex stream is just a stream that is both readable and writable.
        // Since JS doesn't have multiple prototypal inheritance, this class
        // prototypally inherits from Readable, and then parasitically from
        // Writable.

        "use strict"

        /*<replacement>*/

        var pna = require("process-nextick-args")
        /*</replacement>*/

        /*<replacement>*/
        var objectKeys =
          Object.keys ||
          function (obj) {
            var keys = []
            for (var key in obj) {
              keys.push(key)
            }
            return keys
          }
        /*</replacement>*/

        module.exports = Duplex

        /*<replacement>*/
        var util = Object.create(require("core-util-is"))
        util.inherits = require("inherits")
        /*</replacement>*/

        var Readable = require("./_stream_readable")
        var Writable = require("./_stream_writable")

        util.inherits(Duplex, Readable)

        {
          // avoid scope creep, the keys array can then be collected
          var keys = objectKeys(Writable.prototype)
          for (var v = 0; v < keys.length; v++) {
            var method = keys[v]
            if (!Duplex.prototype[method])
              Duplex.prototype[method] = Writable.prototype[method]
          }
        }

        function Duplex(options) {
          if (!(this instanceof Duplex)) return new Duplex(options)

          Readable.call(this, options)
          Writable.call(this, options)

          if (options && options.readable === false) this.readable = false

          if (options && options.writable === false) this.writable = false

          this.allowHalfOpen = true
          if (options && options.allowHalfOpen === false)
            this.allowHalfOpen = false

          this.once("end", onend)
        }

        Object.defineProperty(Duplex.prototype, "writableHighWaterMark", {
          // making it explicit this property is not enumerable
          // because otherwise some prototype manipulation in
          // userland will fail
          enumerable: false,
          get: function () {
            return this._writableState.highWaterMark
          },
        })

        // the no-half-open enforcer
        function onend() {
          // if we allow half-open state, or if the writable side ended,
          // then we're ok.
          if (this.allowHalfOpen || this._writableState.ended) return

          // no more data can be written.
          // But allow more writes to happen in this tick.
          pna.nextTick(onEndNT, this)
        }

        function onEndNT(self) {
          self.end()
        }

        Object.defineProperty(Duplex.prototype, "destroyed", {
          get: function () {
            if (
              this._readableState === undefined ||
              this._writableState === undefined
            ) {
              return false
            }
            return (
              this._readableState.destroyed && this._writableState.destroyed
            )
          },
          set: function (value) {
            // we ignore the value if the stream
            // has not been initialized yet
            if (
              this._readableState === undefined ||
              this._writableState === undefined
            ) {
              return
            }

            // backward compatibility, the user is explicitly
            // managing destroyed
            this._readableState.destroyed = value
            this._writableState.destroyed = value
          },
        })

        Duplex.prototype._destroy = function (err, cb) {
          this.push(null)
          this.end()

          pna.nextTick(cb, err)
        }
      },
      {
        "process-nextick-args": "../node_modules/process-nextick-args/index.js",
        "core-util-is": "../node_modules/core-util-is/lib/util.js",
        inherits: "../node_modules/inherits/inherits_browser.js",
        "./_stream_readable":
          "../node_modules/readable-stream/lib/_stream_readable.js",
        "./_stream_writable":
          "../node_modules/readable-stream/lib/_stream_writable.js",
      },
    ],
    "../node_modules/string_decoder/lib/string_decoder.js": [
      function (require, module, exports) {
        // Copyright Joyent, Inc. and other Node contributors.
        //
        // Permission is hereby granted, free of charge, to any person obtaining a
        // copy of this software and associated documentation files (the
        // "Software"), to deal in the Software without restriction, including
        // without limitation the rights to use, copy, modify, merge, publish,
        // distribute, sublicense, and/or sell copies of the Software, and to permit
        // persons to whom the Software is furnished to do so, subject to the
        // following conditions:
        //
        // The above copyright notice and this permission notice shall be included
        // in all copies or substantial portions of the Software.
        //
        // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
        // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
        // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
        // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
        // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
        // USE OR OTHER DEALINGS IN THE SOFTWARE.

        "use strict"

        /*<replacement>*/

        var Buffer = require("safe-buffer").Buffer
        /*</replacement>*/

        var isEncoding =
          Buffer.isEncoding ||
          function (encoding) {
            encoding = "" + encoding
            switch (encoding && encoding.toLowerCase()) {
              case "hex":
              case "utf8":
              case "utf-8":
              case "ascii":
              case "binary":
              case "base64":
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
              case "raw":
                return true
              default:
                return false
            }
          }

        function _normalizeEncoding(enc) {
          if (!enc) return "utf8"
          var retried
          while (true) {
            switch (enc) {
              case "utf8":
              case "utf-8":
                return "utf8"
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return "utf16le"
              case "latin1":
              case "binary":
                return "latin1"
              case "base64":
              case "ascii":
              case "hex":
                return enc
              default:
                if (retried) return // undefined
                enc = ("" + enc).toLowerCase()
                retried = true
            }
          }
        }

        // Do not cache `Buffer.isEncoding` when checking encoding names as some
        // modules monkey-patch it to support additional encodings
        function normalizeEncoding(enc) {
          var nenc = _normalizeEncoding(enc)
          if (
            typeof nenc !== "string" &&
            (Buffer.isEncoding === isEncoding || !isEncoding(enc))
          )
            throw new Error("Unknown encoding: " + enc)
          return nenc || enc
        }

        // StringDecoder provides an interface for efficiently splitting a series of
        // buffers into a series of JS strings without breaking apart multi-byte
        // characters.
        exports.StringDecoder = StringDecoder
        function StringDecoder(encoding) {
          this.encoding = normalizeEncoding(encoding)
          var nb
          switch (this.encoding) {
            case "utf16le":
              this.text = utf16Text
              this.end = utf16End
              nb = 4
              break
            case "utf8":
              this.fillLast = utf8FillLast
              nb = 4
              break
            case "base64":
              this.text = base64Text
              this.end = base64End
              nb = 3
              break
            default:
              this.write = simpleWrite
              this.end = simpleEnd
              return
          }
          this.lastNeed = 0
          this.lastTotal = 0
          this.lastChar = Buffer.allocUnsafe(nb)
        }

        StringDecoder.prototype.write = function (buf) {
          if (buf.length === 0) return ""
          var r
          var i
          if (this.lastNeed) {
            r = this.fillLast(buf)
            if (r === undefined) return ""
            i = this.lastNeed
            this.lastNeed = 0
          } else {
            i = 0
          }
          if (i < buf.length)
            return r ? r + this.text(buf, i) : this.text(buf, i)
          return r || ""
        }

        StringDecoder.prototype.end = utf8End

        // Returns only complete characters in a Buffer
        StringDecoder.prototype.text = utf8Text

        // Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
        StringDecoder.prototype.fillLast = function (buf) {
          if (this.lastNeed <= buf.length) {
            buf.copy(
              this.lastChar,
              this.lastTotal - this.lastNeed,
              0,
              this.lastNeed
            )
            return this.lastChar.toString(this.encoding, 0, this.lastTotal)
          }
          buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length)
          this.lastNeed -= buf.length
        }

        // Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
        // continuation byte. If an invalid byte is detected, -2 is returned.
        function utf8CheckByte(byte) {
          if (byte <= 0x7f) return 0
          else if (byte >> 5 === 0x06) return 2
          else if (byte >> 4 === 0x0e) return 3
          else if (byte >> 3 === 0x1e) return 4
          return byte >> 6 === 0x02 ? -1 : -2
        }

        // Checks at most 3 bytes at the end of a Buffer in order to detect an
        // incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
        // needed to complete the UTF-8 character (if applicable) are returned.
        function utf8CheckIncomplete(self, buf, i) {
          var j = buf.length - 1
          if (j < i) return 0
          var nb = utf8CheckByte(buf[j])
          if (nb >= 0) {
            if (nb > 0) self.lastNeed = nb - 1
            return nb
          }
          if (--j < i || nb === -2) return 0
          nb = utf8CheckByte(buf[j])
          if (nb >= 0) {
            if (nb > 0) self.lastNeed = nb - 2
            return nb
          }
          if (--j < i || nb === -2) return 0
          nb = utf8CheckByte(buf[j])
          if (nb >= 0) {
            if (nb > 0) {
              if (nb === 2) nb = 0
              else self.lastNeed = nb - 3
            }
            return nb
          }
          return 0
        }

        // Validates as many continuation bytes for a multi-byte UTF-8 character as
        // needed or are available. If we see a non-continuation byte where we expect
        // one, we "replace" the validated continuation bytes we've seen so far with
        // a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
        // behavior. The continuation byte check is included three times in the case
        // where all of the continuation bytes for a character exist in the same buffer.
        // It is also done this way as a slight performance increase instead of using a
        // loop.
        function utf8CheckExtraBytes(self, buf, p) {
          if ((buf[0] & 0xc0) !== 0x80) {
            self.lastNeed = 0
            return "\ufffd"
          }
          if (self.lastNeed > 1 && buf.length > 1) {
            if ((buf[1] & 0xc0) !== 0x80) {
              self.lastNeed = 1
              return "\ufffd"
            }
            if (self.lastNeed > 2 && buf.length > 2) {
              if ((buf[2] & 0xc0) !== 0x80) {
                self.lastNeed = 2
                return "\ufffd"
              }
            }
          }
        }

        // Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
        function utf8FillLast(buf) {
          var p = this.lastTotal - this.lastNeed
          var r = utf8CheckExtraBytes(this, buf, p)
          if (r !== undefined) return r
          if (this.lastNeed <= buf.length) {
            buf.copy(this.lastChar, p, 0, this.lastNeed)
            return this.lastChar.toString(this.encoding, 0, this.lastTotal)
          }
          buf.copy(this.lastChar, p, 0, buf.length)
          this.lastNeed -= buf.length
        }

        // Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
        // partial character, the character's bytes are buffered until the required
        // number of bytes are available.
        function utf8Text(buf, i) {
          var total = utf8CheckIncomplete(this, buf, i)
          if (!this.lastNeed) return buf.toString("utf8", i)
          this.lastTotal = total
          var end = buf.length - (total - this.lastNeed)
          buf.copy(this.lastChar, 0, end)
          return buf.toString("utf8", i, end)
        }

        // For UTF-8, a replacement character is added when ending on a partial
        // character.
        function utf8End(buf) {
          var r = buf && buf.length ? this.write(buf) : ""
          if (this.lastNeed) return r + "\ufffd"
          return r
        }

        // UTF-16LE typically needs two bytes per character, but even if we have an even
        // number of bytes available, we need to check if we end on a leading/high
        // surrogate. In that case, we need to wait for the next two bytes in order to
        // decode the last character properly.
        function utf16Text(buf, i) {
          if ((buf.length - i) % 2 === 0) {
            var r = buf.toString("utf16le", i)
            if (r) {
              var c = r.charCodeAt(r.length - 1)
              if (c >= 0xd800 && c <= 0xdbff) {
                this.lastNeed = 2
                this.lastTotal = 4
                this.lastChar[0] = buf[buf.length - 2]
                this.lastChar[1] = buf[buf.length - 1]
                return r.slice(0, -1)
              }
            }
            return r
          }
          this.lastNeed = 1
          this.lastTotal = 2
          this.lastChar[0] = buf[buf.length - 1]
          return buf.toString("utf16le", i, buf.length - 1)
        }

        // For UTF-16LE we do not explicitly append special replacement characters if we
        // end on a partial character, we simply let v8 handle that.
        function utf16End(buf) {
          var r = buf && buf.length ? this.write(buf) : ""
          if (this.lastNeed) {
            var end = this.lastTotal - this.lastNeed
            return r + this.lastChar.toString("utf16le", 0, end)
          }
          return r
        }

        function base64Text(buf, i) {
          var n = (buf.length - i) % 3
          if (n === 0) return buf.toString("base64", i)
          this.lastNeed = 3 - n
          this.lastTotal = 3
          if (n === 1) {
            this.lastChar[0] = buf[buf.length - 1]
          } else {
            this.lastChar[0] = buf[buf.length - 2]
            this.lastChar[1] = buf[buf.length - 1]
          }
          return buf.toString("base64", i, buf.length - n)
        }

        function base64End(buf) {
          var r = buf && buf.length ? this.write(buf) : ""
          if (this.lastNeed)
            return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed)
          return r
        }

        // Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
        function simpleWrite(buf) {
          return buf.toString(this.encoding)
        }

        function simpleEnd(buf) {
          return buf && buf.length ? this.write(buf) : ""
        }
      },
      { "safe-buffer": "../node_modules/safe-buffer/index.js" },
    ],
    "../node_modules/readable-stream/lib/_stream_readable.js": [
      function (require, module, exports) {
        var global = arguments[3]
        var process = require("process")
        // Copyright Joyent, Inc. and other Node contributors.
        //
        // Permission is hereby granted, free of charge, to any person obtaining a
        // copy of this software and associated documentation files (the
        // "Software"), to deal in the Software without restriction, including
        // without limitation the rights to use, copy, modify, merge, publish,
        // distribute, sublicense, and/or sell copies of the Software, and to permit
        // persons to whom the Software is furnished to do so, subject to the
        // following conditions:
        //
        // The above copyright notice and this permission notice shall be included
        // in all copies or substantial portions of the Software.
        //
        // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
        // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
        // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
        // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
        // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
        // USE OR OTHER DEALINGS IN THE SOFTWARE.

        ;("use strict")

        /*<replacement>*/

        var pna = require("process-nextick-args")
        /*</replacement>*/

        module.exports = Readable

        /*<replacement>*/
        var isArray = require("isarray")
        /*</replacement>*/

        /*<replacement>*/
        var Duplex
        /*</replacement>*/

        Readable.ReadableState = ReadableState

        /*<replacement>*/
        var EE = require("events").EventEmitter

        var EElistenerCount = function (emitter, type) {
          return emitter.listeners(type).length
        }
        /*</replacement>*/

        /*<replacement>*/
        var Stream = require("./internal/streams/stream")
        /*</replacement>*/

        /*<replacement>*/

        var Buffer = require("safe-buffer").Buffer
        var OurUint8Array = global.Uint8Array || function () {}
        function _uint8ArrayToBuffer(chunk) {
          return Buffer.from(chunk)
        }
        function _isUint8Array(obj) {
          return Buffer.isBuffer(obj) || obj instanceof OurUint8Array
        }

        /*</replacement>*/

        /*<replacement>*/
        var util = Object.create(require("core-util-is"))
        util.inherits = require("inherits")
        /*</replacement>*/

        /*<replacement>*/
        var debugUtil = require("util")
        var debug = void 0
        if (debugUtil && debugUtil.debuglog) {
          debug = debugUtil.debuglog("stream")
        } else {
          debug = function () {}
        }
        /*</replacement>*/

        var BufferList = require("./internal/streams/BufferList")
        var destroyImpl = require("./internal/streams/destroy")
        var StringDecoder

        util.inherits(Readable, Stream)

        var kProxyEvents = ["error", "close", "destroy", "pause", "resume"]

        function prependListener(emitter, event, fn) {
          // Sadly this is not cacheable as some libraries bundle their own
          // event emitter implementation with them.
          if (typeof emitter.prependListener === "function")
            return emitter.prependListener(event, fn)

          // This is a hack to make sure that our error handler is attached before any
          // userland ones.  NEVER DO THIS. This is here only because this code needs
          // to continue to work with older versions of Node.js that do not include
          // the prependListener() method. The goal is to eventually remove this hack.
          if (!emitter._events || !emitter._events[event]) emitter.on(event, fn)
          else if (isArray(emitter._events[event]))
            emitter._events[event].unshift(fn)
          else emitter._events[event] = [fn, emitter._events[event]]
        }

        function ReadableState(options, stream) {
          Duplex = Duplex || require("./_stream_duplex")

          options = options || {}

          // Duplex streams are both readable and writable, but share
          // the same options object.
          // However, some cases require setting options to different
          // values for the readable and the writable sides of the duplex stream.
          // These options can be provided separately as readableXXX and writableXXX.
          var isDuplex = stream instanceof Duplex

          // object stream flag. Used to make read(n) ignore n and to
          // make all the buffer merging and length checks go away
          this.objectMode = !!options.objectMode

          if (isDuplex)
            this.objectMode = this.objectMode || !!options.readableObjectMode

          // the point at which it stops calling _read() to fill the buffer
          // Note: 0 is a valid value, means "don't call _read preemptively ever"
          var hwm = options.highWaterMark
          var readableHwm = options.readableHighWaterMark
          var defaultHwm = this.objectMode ? 16 : 16 * 1024

          if (hwm || hwm === 0) this.highWaterMark = hwm
          else if (isDuplex && (readableHwm || readableHwm === 0))
            this.highWaterMark = readableHwm
          else this.highWaterMark = defaultHwm

          // cast to ints.
          this.highWaterMark = Math.floor(this.highWaterMark)

          // A linked list is used to store data chunks instead of an array because the
          // linked list can remove elements from the beginning faster than
          // array.shift()
          this.buffer = new BufferList()
          this.length = 0
          this.pipes = null
          this.pipesCount = 0
          this.flowing = null
          this.ended = false
          this.endEmitted = false
          this.reading = false

          // a flag to be able to tell if the event 'readable'/'data' is emitted
          // immediately, or on a later tick.  We set this to true at first, because
          // any actions that shouldn't happen until "later" should generally also
          // not happen before the first read call.
          this.sync = true

          // whenever we return null, then we set a flag to say
          // that we're awaiting a 'readable' event emission.
          this.needReadable = false
          this.emittedReadable = false
          this.readableListening = false
          this.resumeScheduled = false

          // has it been destroyed
          this.destroyed = false

          // Crypto is kind of old and crusty.  Historically, its default string
          // encoding is 'binary' so we have to make this configurable.
          // Everything else in the universe uses 'utf8', though.
          this.defaultEncoding = options.defaultEncoding || "utf8"

          // the number of writers that are awaiting a drain event in .pipe()s
          this.awaitDrain = 0

          // if true, a maybeReadMore has been scheduled
          this.readingMore = false

          this.decoder = null
          this.encoding = null
          if (options.encoding) {
            if (!StringDecoder)
              StringDecoder = require("string_decoder/").StringDecoder
            this.decoder = new StringDecoder(options.encoding)
            this.encoding = options.encoding
          }
        }

        function Readable(options) {
          Duplex = Duplex || require("./_stream_duplex")

          if (!(this instanceof Readable)) return new Readable(options)

          this._readableState = new ReadableState(options, this)

          // legacy
          this.readable = true

          if (options) {
            if (typeof options.read === "function") this._read = options.read

            if (typeof options.destroy === "function")
              this._destroy = options.destroy
          }

          Stream.call(this)
        }

        Object.defineProperty(Readable.prototype, "destroyed", {
          get: function () {
            if (this._readableState === undefined) {
              return false
            }
            return this._readableState.destroyed
          },
          set: function (value) {
            // we ignore the value if the stream
            // has not been initialized yet
            if (!this._readableState) {
              return
            }

            // backward compatibility, the user is explicitly
            // managing destroyed
            this._readableState.destroyed = value
          },
        })

        Readable.prototype.destroy = destroyImpl.destroy
        Readable.prototype._undestroy = destroyImpl.undestroy
        Readable.prototype._destroy = function (err, cb) {
          this.push(null)
          cb(err)
        }

        // Manually shove something into the read() buffer.
        // This returns true if the highWaterMark has not been hit yet,
        // similar to how Writable.write() returns true if you should
        // write() some more.
        Readable.prototype.push = function (chunk, encoding) {
          var state = this._readableState
          var skipChunkCheck

          if (!state.objectMode) {
            if (typeof chunk === "string") {
              encoding = encoding || state.defaultEncoding
              if (encoding !== state.encoding) {
                chunk = Buffer.from(chunk, encoding)
                encoding = ""
              }
              skipChunkCheck = true
            }
          } else {
            skipChunkCheck = true
          }

          return readableAddChunk(this, chunk, encoding, false, skipChunkCheck)
        }

        // Unshift should *always* be something directly out of read()
        Readable.prototype.unshift = function (chunk) {
          return readableAddChunk(this, chunk, null, true, false)
        }

        function readableAddChunk(
          stream,
          chunk,
          encoding,
          addToFront,
          skipChunkCheck
        ) {
          var state = stream._readableState
          if (chunk === null) {
            state.reading = false
            onEofChunk(stream, state)
          } else {
            var er
            if (!skipChunkCheck) er = chunkInvalid(state, chunk)
            if (er) {
              stream.emit("error", er)
            } else if (state.objectMode || (chunk && chunk.length > 0)) {
              if (
                typeof chunk !== "string" &&
                !state.objectMode &&
                Object.getPrototypeOf(chunk) !== Buffer.prototype
              ) {
                chunk = _uint8ArrayToBuffer(chunk)
              }

              if (addToFront) {
                if (state.endEmitted)
                  stream.emit(
                    "error",
                    new Error("stream.unshift() after end event")
                  )
                else addChunk(stream, state, chunk, true)
              } else if (state.ended) {
                stream.emit("error", new Error("stream.push() after EOF"))
              } else {
                state.reading = false
                if (state.decoder && !encoding) {
                  chunk = state.decoder.write(chunk)
                  if (state.objectMode || chunk.length !== 0)
                    addChunk(stream, state, chunk, false)
                  else maybeReadMore(stream, state)
                } else {
                  addChunk(stream, state, chunk, false)
                }
              }
            } else if (!addToFront) {
              state.reading = false
            }
          }

          return needMoreData(state)
        }

        function addChunk(stream, state, chunk, addToFront) {
          if (state.flowing && state.length === 0 && !state.sync) {
            stream.emit("data", chunk)
            stream.read(0)
          } else {
            // update the buffer info.
            state.length += state.objectMode ? 1 : chunk.length
            if (addToFront) state.buffer.unshift(chunk)
            else state.buffer.push(chunk)

            if (state.needReadable) emitReadable(stream)
          }
          maybeReadMore(stream, state)
        }

        function chunkInvalid(state, chunk) {
          var er
          if (
            !_isUint8Array(chunk) &&
            typeof chunk !== "string" &&
            chunk !== undefined &&
            !state.objectMode
          ) {
            er = new TypeError("Invalid non-string/buffer chunk")
          }
          return er
        }

        // if it's past the high water mark, we can push in some more.
        // Also, if we have no data yet, we can stand some
        // more bytes.  This is to work around cases where hwm=0,
        // such as the repl.  Also, if the push() triggered a
        // readable event, and the user called read(largeNumber) such that
        // needReadable was set, then we ought to push more, so that another
        // 'readable' event will be triggered.
        function needMoreData(state) {
          return (
            !state.ended &&
            (state.needReadable ||
              state.length < state.highWaterMark ||
              state.length === 0)
          )
        }

        Readable.prototype.isPaused = function () {
          return this._readableState.flowing === false
        }

        // backwards compatibility.
        Readable.prototype.setEncoding = function (enc) {
          if (!StringDecoder)
            StringDecoder = require("string_decoder/").StringDecoder
          this._readableState.decoder = new StringDecoder(enc)
          this._readableState.encoding = enc
          return this
        }

        // Don't raise the hwm > 8MB
        var MAX_HWM = 0x800000
        function computeNewHighWaterMark(n) {
          if (n >= MAX_HWM) {
            n = MAX_HWM
          } else {
            // Get the next highest power of 2 to prevent increasing hwm excessively in
            // tiny amounts
            n--
            n |= n >>> 1
            n |= n >>> 2
            n |= n >>> 4
            n |= n >>> 8
            n |= n >>> 16
            n++
          }
          return n
        }

        // This function is designed to be inlinable, so please take care when making
        // changes to the function body.
        function howMuchToRead(n, state) {
          if (n <= 0 || (state.length === 0 && state.ended)) return 0
          if (state.objectMode) return 1
          if (n !== n) {
            // Only flow one buffer at a time
            if (state.flowing && state.length)
              return state.buffer.head.data.length
            else return state.length
          }
          // If we're asking for more than the current hwm, then raise the hwm.
          if (n > state.highWaterMark)
            state.highWaterMark = computeNewHighWaterMark(n)
          if (n <= state.length) return n
          // Don't have enough
          if (!state.ended) {
            state.needReadable = true
            return 0
          }
          return state.length
        }

        // you can override either this method, or the async _read(n) below.
        Readable.prototype.read = function (n) {
          debug("read", n)
          n = parseInt(n, 10)
          var state = this._readableState
          var nOrig = n

          if (n !== 0) state.emittedReadable = false

          // if we're doing read(0) to trigger a readable event, but we
          // already have a bunch of data in the buffer, then just trigger
          // the 'readable' event and move on.
          if (
            n === 0 &&
            state.needReadable &&
            (state.length >= state.highWaterMark || state.ended)
          ) {
            debug("read: emitReadable", state.length, state.ended)
            if (state.length === 0 && state.ended) endReadable(this)
            else emitReadable(this)
            return null
          }

          n = howMuchToRead(n, state)

          // if we've ended, and we're now clear, then finish it up.
          if (n === 0 && state.ended) {
            if (state.length === 0) endReadable(this)
            return null
          }

          // All the actual chunk generation logic needs to be
          // *below* the call to _read.  The reason is that in certain
          // synthetic stream cases, such as passthrough streams, _read
          // may be a completely synchronous operation which may change
          // the state of the read buffer, providing enough data when
          // before there was *not* enough.
          //
          // So, the steps are:
          // 1. Figure out what the state of things will be after we do
          // a read from the buffer.
          //
          // 2. If that resulting state will trigger a _read, then call _read.
          // Note that this may be asynchronous, or synchronous.  Yes, it is
          // deeply ugly to write APIs this way, but that still doesn't mean
          // that the Readable class should behave improperly, as streams are
          // designed to be sync/async agnostic.
          // Take note if the _read call is sync or async (ie, if the read call
          // has returned yet), so that we know whether or not it's safe to emit
          // 'readable' etc.
          //
          // 3. Actually pull the requested chunks out of the buffer and return.

          // if we need a readable event, then we need to do some reading.
          var doRead = state.needReadable
          debug("need readable", doRead)

          // if we currently have less than the highWaterMark, then also read some
          if (state.length === 0 || state.length - n < state.highWaterMark) {
            doRead = true
            debug("length less than watermark", doRead)
          }

          // however, if we've ended, then there's no point, and if we're already
          // reading, then it's unnecessary.
          if (state.ended || state.reading) {
            doRead = false
            debug("reading or ended", doRead)
          } else if (doRead) {
            debug("do read")
            state.reading = true
            state.sync = true
            // if the length is currently zero, then we *need* a readable event.
            if (state.length === 0) state.needReadable = true
            // call internal read method
            this._read(state.highWaterMark)
            state.sync = false
            // If _read pushed data synchronously, then `reading` will be false,
            // and we need to re-evaluate how much data we can return to the user.
            if (!state.reading) n = howMuchToRead(nOrig, state)
          }

          var ret
          if (n > 0) ret = fromList(n, state)
          else ret = null

          if (ret === null) {
            state.needReadable = true
            n = 0
          } else {
            state.length -= n
          }

          if (state.length === 0) {
            // If we have nothing in the buffer, then we want to know
            // as soon as we *do* get something into the buffer.
            if (!state.ended) state.needReadable = true

            // If we tried to read() past the EOF, then emit end on the next tick.
            if (nOrig !== n && state.ended) endReadable(this)
          }

          if (ret !== null) this.emit("data", ret)

          return ret
        }

        function onEofChunk(stream, state) {
          if (state.ended) return
          if (state.decoder) {
            var chunk = state.decoder.end()
            if (chunk && chunk.length) {
              state.buffer.push(chunk)
              state.length += state.objectMode ? 1 : chunk.length
            }
          }
          state.ended = true

          // emit 'readable' now to make sure it gets picked up.
          emitReadable(stream)
        }

        // Don't emit readable right away in sync mode, because this can trigger
        // another read() call => stack overflow.  This way, it might trigger
        // a nextTick recursion warning, but that's not so bad.
        function emitReadable(stream) {
          var state = stream._readableState
          state.needReadable = false
          if (!state.emittedReadable) {
            debug("emitReadable", state.flowing)
            state.emittedReadable = true
            if (state.sync) pna.nextTick(emitReadable_, stream)
            else emitReadable_(stream)
          }
        }

        function emitReadable_(stream) {
          debug("emit readable")
          stream.emit("readable")
          flow(stream)
        }

        // at this point, the user has presumably seen the 'readable' event,
        // and called read() to consume some data.  that may have triggered
        // in turn another _read(n) call, in which case reading = true if
        // it's in progress.
        // However, if we're not ended, or reading, and the length < hwm,
        // then go ahead and try to read some more preemptively.
        function maybeReadMore(stream, state) {
          if (!state.readingMore) {
            state.readingMore = true
            pna.nextTick(maybeReadMore_, stream, state)
          }
        }

        function maybeReadMore_(stream, state) {
          var len = state.length
          while (
            !state.reading &&
            !state.flowing &&
            !state.ended &&
            state.length < state.highWaterMark
          ) {
            debug("maybeReadMore read 0")
            stream.read(0)
            if (len === state.length)
              // didn't get any data, stop spinning.
              break
            else len = state.length
          }
          state.readingMore = false
        }

        // abstract method.  to be overridden in specific implementation classes.
        // call cb(er, data) where data is <= n in length.
        // for virtual (non-string, non-buffer) streams, "length" is somewhat
        // arbitrary, and perhaps not very meaningful.
        Readable.prototype._read = function (n) {
          this.emit("error", new Error("_read() is not implemented"))
        }

        Readable.prototype.pipe = function (dest, pipeOpts) {
          var src = this
          var state = this._readableState

          switch (state.pipesCount) {
            case 0:
              state.pipes = dest
              break
            case 1:
              state.pipes = [state.pipes, dest]
              break
            default:
              state.pipes.push(dest)
              break
          }
          state.pipesCount += 1
          debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts)

          var doEnd =
            (!pipeOpts || pipeOpts.end !== false) &&
            dest !== process.stdout &&
            dest !== process.stderr

          var endFn = doEnd ? onend : unpipe
          if (state.endEmitted) pna.nextTick(endFn)
          else src.once("end", endFn)

          dest.on("unpipe", onunpipe)
          function onunpipe(readable, unpipeInfo) {
            debug("onunpipe")
            if (readable === src) {
              if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
                unpipeInfo.hasUnpiped = true
                cleanup()
              }
            }
          }

          function onend() {
            debug("onend")
            dest.end()
          }

          // when the dest drains, it reduces the awaitDrain counter
          // on the source.  This would be more elegant with a .once()
          // handler in flow(), but adding and removing repeatedly is
          // too slow.
          var ondrain = pipeOnDrain(src)
          dest.on("drain", ondrain)

          var cleanedUp = false
          function cleanup() {
            debug("cleanup")
            // cleanup event handlers once the pipe is broken
            dest.removeListener("close", onclose)
            dest.removeListener("finish", onfinish)
            dest.removeListener("drain", ondrain)
            dest.removeListener("error", onerror)
            dest.removeListener("unpipe", onunpipe)
            src.removeListener("end", onend)
            src.removeListener("end", unpipe)
            src.removeListener("data", ondata)

            cleanedUp = true

            // if the reader is waiting for a drain event from this
            // specific writer, then it would cause it to never start
            // flowing again.
            // So, if this is awaiting a drain, then we just call it now.
            // If we don't know, then assume that we are waiting for one.
            if (
              state.awaitDrain &&
              (!dest._writableState || dest._writableState.needDrain)
            )
              ondrain()
          }

          // If the user pushes more data while we're writing to dest then we'll end up
          // in ondata again. However, we only want to increase awaitDrain once because
          // dest will only emit one 'drain' event for the multiple writes.
          // => Introduce a guard on increasing awaitDrain.
          var increasedAwaitDrain = false
          src.on("data", ondata)
          function ondata(chunk) {
            debug("ondata")
            increasedAwaitDrain = false
            var ret = dest.write(chunk)
            if (false === ret && !increasedAwaitDrain) {
              // If the user unpiped during `dest.write()`, it is possible
              // to get stuck in a permanently paused state if that write
              // also returned false.
              // => Check whether `dest` is still a piping destination.
              if (
                ((state.pipesCount === 1 && state.pipes === dest) ||
                  (state.pipesCount > 1 &&
                    indexOf(state.pipes, dest) !== -1)) &&
                !cleanedUp
              ) {
                debug(
                  "false write response, pause",
                  src._readableState.awaitDrain
                )
                src._readableState.awaitDrain++
                increasedAwaitDrain = true
              }
              src.pause()
            }
          }

          // if the dest has an error, then stop piping into it.
          // however, don't suppress the throwing behavior for this.
          function onerror(er) {
            debug("onerror", er)
            unpipe()
            dest.removeListener("error", onerror)
            if (EElistenerCount(dest, "error") === 0) dest.emit("error", er)
          }

          // Make sure our error handler is attached before userland ones.
          prependListener(dest, "error", onerror)

          // Both close and finish should trigger unpipe, but only once.
          function onclose() {
            dest.removeListener("finish", onfinish)
            unpipe()
          }
          dest.once("close", onclose)
          function onfinish() {
            debug("onfinish")
            dest.removeListener("close", onclose)
            unpipe()
          }
          dest.once("finish", onfinish)

          function unpipe() {
            debug("unpipe")
            src.unpipe(dest)
          }

          // tell the dest that it's being piped to
          dest.emit("pipe", src)

          // start the flow if it hasn't been started already.
          if (!state.flowing) {
            debug("pipe resume")
            src.resume()
          }

          return dest
        }

        function pipeOnDrain(src) {
          return function () {
            var state = src._readableState
            debug("pipeOnDrain", state.awaitDrain)
            if (state.awaitDrain) state.awaitDrain--
            if (state.awaitDrain === 0 && EElistenerCount(src, "data")) {
              state.flowing = true
              flow(src)
            }
          }
        }

        Readable.prototype.unpipe = function (dest) {
          var state = this._readableState
          var unpipeInfo = { hasUnpiped: false }

          // if we're not piping anywhere, then do nothing.
          if (state.pipesCount === 0) return this

          // just one destination.  most common case.
          if (state.pipesCount === 1) {
            // passed in one, but it's not the right one.
            if (dest && dest !== state.pipes) return this

            if (!dest) dest = state.pipes

            // got a match.
            state.pipes = null
            state.pipesCount = 0
            state.flowing = false
            if (dest) dest.emit("unpipe", this, unpipeInfo)
            return this
          }

          // slow case. multiple pipe destinations.

          if (!dest) {
            // remove all.
            var dests = state.pipes
            var len = state.pipesCount
            state.pipes = null
            state.pipesCount = 0
            state.flowing = false

            for (var i = 0; i < len; i++) {
              dests[i].emit("unpipe", this, unpipeInfo)
            }
            return this
          }

          // try to find the right one.
          var index = indexOf(state.pipes, dest)
          if (index === -1) return this

          state.pipes.splice(index, 1)
          state.pipesCount -= 1
          if (state.pipesCount === 1) state.pipes = state.pipes[0]

          dest.emit("unpipe", this, unpipeInfo)

          return this
        }

        // set up data events if they are asked for
        // Ensure readable listeners eventually get something
        Readable.prototype.on = function (ev, fn) {
          var res = Stream.prototype.on.call(this, ev, fn)

          if (ev === "data") {
            // Start flowing on next tick if stream isn't explicitly paused
            if (this._readableState.flowing !== false) this.resume()
          } else if (ev === "readable") {
            var state = this._readableState
            if (!state.endEmitted && !state.readableListening) {
              state.readableListening = state.needReadable = true
              state.emittedReadable = false
              if (!state.reading) {
                pna.nextTick(nReadingNextTick, this)
              } else if (state.length) {
                emitReadable(this)
              }
            }
          }

          return res
        }
        Readable.prototype.addListener = Readable.prototype.on

        function nReadingNextTick(self) {
          debug("readable nexttick read 0")
          self.read(0)
        }

        // pause() and resume() are remnants of the legacy readable stream API
        // If the user uses them, then switch into old mode.
        Readable.prototype.resume = function () {
          var state = this._readableState
          if (!state.flowing) {
            debug("resume")
            state.flowing = true
            resume(this, state)
          }
          return this
        }

        function resume(stream, state) {
          if (!state.resumeScheduled) {
            state.resumeScheduled = true
            pna.nextTick(resume_, stream, state)
          }
        }

        function resume_(stream, state) {
          if (!state.reading) {
            debug("resume read 0")
            stream.read(0)
          }

          state.resumeScheduled = false
          state.awaitDrain = 0
          stream.emit("resume")
          flow(stream)
          if (state.flowing && !state.reading) stream.read(0)
        }

        Readable.prototype.pause = function () {
          debug("call pause flowing=%j", this._readableState.flowing)
          if (false !== this._readableState.flowing) {
            debug("pause")
            this._readableState.flowing = false
            this.emit("pause")
          }
          return this
        }

        function flow(stream) {
          var state = stream._readableState
          debug("flow", state.flowing)
          while (state.flowing && stream.read() !== null) {}
        }

        // wrap an old-style stream as the async data source.
        // This is *not* part of the readable stream interface.
        // It is an ugly unfortunate mess of history.
        Readable.prototype.wrap = function (stream) {
          var _this = this

          var state = this._readableState
          var paused = false

          stream.on("end", function () {
            debug("wrapped end")
            if (state.decoder && !state.ended) {
              var chunk = state.decoder.end()
              if (chunk && chunk.length) _this.push(chunk)
            }

            _this.push(null)
          })

          stream.on("data", function (chunk) {
            debug("wrapped data")
            if (state.decoder) chunk = state.decoder.write(chunk)

            // don't skip over falsy values in objectMode
            if (state.objectMode && (chunk === null || chunk === undefined))
              return
            else if (!state.objectMode && (!chunk || !chunk.length)) return

            var ret = _this.push(chunk)
            if (!ret) {
              paused = true
              stream.pause()
            }
          })

          // proxy all the other methods.
          // important when wrapping filters and duplexes.
          for (var i in stream) {
            if (this[i] === undefined && typeof stream[i] === "function") {
              this[i] = (function (method) {
                return function () {
                  return stream[method].apply(stream, arguments)
                }
              })(i)
            }
          }

          // proxy certain important events.
          for (var n = 0; n < kProxyEvents.length; n++) {
            stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]))
          }

          // when we try to consume some more bytes, simply unpause the
          // underlying stream.
          this._read = function (n) {
            debug("wrapped _read", n)
            if (paused) {
              paused = false
              stream.resume()
            }
          }

          return this
        }

        Object.defineProperty(Readable.prototype, "readableHighWaterMark", {
          // making it explicit this property is not enumerable
          // because otherwise some prototype manipulation in
          // userland will fail
          enumerable: false,
          get: function () {
            return this._readableState.highWaterMark
          },
        })

        // exposed for testing purposes only.
        Readable._fromList = fromList

        // Pluck off n bytes from an array of buffers.
        // Length is the combined lengths of all the buffers in the list.
        // This function is designed to be inlinable, so please take care when making
        // changes to the function body.
        function fromList(n, state) {
          // nothing buffered
          if (state.length === 0) return null

          var ret
          if (state.objectMode) ret = state.buffer.shift()
          else if (!n || n >= state.length) {
            // read it all, truncate the list
            if (state.decoder) ret = state.buffer.join("")
            else if (state.buffer.length === 1) ret = state.buffer.head.data
            else ret = state.buffer.concat(state.length)
            state.buffer.clear()
          } else {
            // read part of list
            ret = fromListPartial(n, state.buffer, state.decoder)
          }

          return ret
        }

        // Extracts only enough buffered data to satisfy the amount requested.
        // This function is designed to be inlinable, so please take care when making
        // changes to the function body.
        function fromListPartial(n, list, hasStrings) {
          var ret
          if (n < list.head.data.length) {
            // slice is the same for buffers and strings
            ret = list.head.data.slice(0, n)
            list.head.data = list.head.data.slice(n)
          } else if (n === list.head.data.length) {
            // first chunk is a perfect match
            ret = list.shift()
          } else {
            // result spans more than one buffer
            ret = hasStrings
              ? copyFromBufferString(n, list)
              : copyFromBuffer(n, list)
          }
          return ret
        }

        // Copies a specified amount of characters from the list of buffered data
        // chunks.
        // This function is designed to be inlinable, so please take care when making
        // changes to the function body.
        function copyFromBufferString(n, list) {
          var p = list.head
          var c = 1
          var ret = p.data
          n -= ret.length
          while ((p = p.next)) {
            var str = p.data
            var nb = n > str.length ? str.length : n
            if (nb === str.length) ret += str
            else ret += str.slice(0, n)
            n -= nb
            if (n === 0) {
              if (nb === str.length) {
                ++c
                if (p.next) list.head = p.next
                else list.head = list.tail = null
              } else {
                list.head = p
                p.data = str.slice(nb)
              }
              break
            }
            ++c
          }
          list.length -= c
          return ret
        }

        // Copies a specified amount of bytes from the list of buffered data chunks.
        // This function is designed to be inlinable, so please take care when making
        // changes to the function body.
        function copyFromBuffer(n, list) {
          var ret = Buffer.allocUnsafe(n)
          var p = list.head
          var c = 1
          p.data.copy(ret)
          n -= p.data.length
          while ((p = p.next)) {
            var buf = p.data
            var nb = n > buf.length ? buf.length : n
            buf.copy(ret, ret.length - n, 0, nb)
            n -= nb
            if (n === 0) {
              if (nb === buf.length) {
                ++c
                if (p.next) list.head = p.next
                else list.head = list.tail = null
              } else {
                list.head = p
                p.data = buf.slice(nb)
              }
              break
            }
            ++c
          }
          list.length -= c
          return ret
        }

        function endReadable(stream) {
          var state = stream._readableState

          // If we get here before consuming all the bytes, then that is a
          // bug in node.  Should never happen.
          if (state.length > 0)
            throw new Error('"endReadable()" called on non-empty stream')

          if (!state.endEmitted) {
            state.ended = true
            pna.nextTick(endReadableNT, state, stream)
          }
        }

        function endReadableNT(state, stream) {
          // Check that we didn't get one last unshift.
          if (!state.endEmitted && state.length === 0) {
            state.endEmitted = true
            stream.readable = false
            stream.emit("end")
          }
        }

        function indexOf(xs, x) {
          for (var i = 0, l = xs.length; i < l; i++) {
            if (xs[i] === x) return i
          }
          return -1
        }
      },
      {
        "process-nextick-args": "../node_modules/process-nextick-args/index.js",
        isarray: "../node_modules/isarray/index.js",
        events: "../node_modules/events/events.js",
        "./internal/streams/stream":
          "../node_modules/readable-stream/lib/internal/streams/stream-browser.js",
        "safe-buffer": "../node_modules/safe-buffer/index.js",
        "core-util-is": "../node_modules/core-util-is/lib/util.js",
        inherits: "../node_modules/inherits/inherits_browser.js",
        util: "../node_modules/parcel-bundler/src/builtins/_empty.js",
        "./internal/streams/BufferList":
          "../node_modules/readable-stream/lib/internal/streams/BufferList.js",
        "./internal/streams/destroy":
          "../node_modules/readable-stream/lib/internal/streams/destroy.js",
        "./_stream_duplex":
          "../node_modules/readable-stream/lib/_stream_duplex.js",
        "string_decoder/":
          "../node_modules/string_decoder/lib/string_decoder.js",
        process: "../node_modules/process/browser.js",
      },
    ],
    "../node_modules/readable-stream/lib/_stream_transform.js": [
      function (require, module, exports) {
        // Copyright Joyent, Inc. and other Node contributors.
        //
        // Permission is hereby granted, free of charge, to any person obtaining a
        // copy of this software and associated documentation files (the
        // "Software"), to deal in the Software without restriction, including
        // without limitation the rights to use, copy, modify, merge, publish,
        // distribute, sublicense, and/or sell copies of the Software, and to permit
        // persons to whom the Software is furnished to do so, subject to the
        // following conditions:
        //
        // The above copyright notice and this permission notice shall be included
        // in all copies or substantial portions of the Software.
        //
        // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
        // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
        // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
        // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
        // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
        // USE OR OTHER DEALINGS IN THE SOFTWARE.

        // a transform stream is a readable/writable stream where you do
        // something with the data.  Sometimes it's called a "filter",
        // but that's not a great name for it, since that implies a thing where
        // some bits pass through, and others are simply ignored.  (That would
        // be a valid example of a transform, of course.)
        //
        // While the output is causally related to the input, it's not a
        // necessarily symmetric or synchronous transformation.  For example,
        // a zlib stream might take multiple plain-text writes(), and then
        // emit a single compressed chunk some time in the future.
        //
        // Here's how this works:
        //
        // The Transform stream has all the aspects of the readable and writable
        // stream classes.  When you write(chunk), that calls _write(chunk,cb)
        // internally, and returns false if there's a lot of pending writes
        // buffered up.  When you call read(), that calls _read(n) until
        // there's enough pending readable data buffered up.
        //
        // In a transform stream, the written data is placed in a buffer.  When
        // _read(n) is called, it transforms the queued up data, calling the
        // buffered _write cb's as it consumes chunks.  If consuming a single
        // written chunk would result in multiple output chunks, then the first
        // outputted bit calls the readcb, and subsequent chunks just go into
        // the read buffer, and will cause it to emit 'readable' if necessary.
        //
        // This way, back-pressure is actually determined by the reading side,
        // since _read has to be called to start processing a new chunk.  However,
        // a pathological inflate type of transform can cause excessive buffering
        // here.  For example, imagine a stream where every byte of input is
        // interpreted as an integer from 0-255, and then results in that many
        // bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
        // 1kb of data being output.  In this case, you could write a very small
        // amount of input, and end up with a very large amount of output.  In
        // such a pathological inflating mechanism, there'd be no way to tell
        // the system to stop doing the transform.  A single 4MB write could
        // cause the system to run out of memory.
        //
        // However, even in such a pathological case, only a single written chunk
        // would be consumed, and then the rest would wait (un-transformed) until
        // the results of the previous transformed chunk were consumed.

        "use strict"

        module.exports = Transform

        var Duplex = require("./_stream_duplex")

        /*<replacement>*/
        var util = Object.create(require("core-util-is"))
        util.inherits = require("inherits")
        /*</replacement>*/

        util.inherits(Transform, Duplex)

        function afterTransform(er, data) {
          var ts = this._transformState
          ts.transforming = false

          var cb = ts.writecb

          if (!cb) {
            return this.emit(
              "error",
              new Error("write callback called multiple times")
            )
          }

          ts.writechunk = null
          ts.writecb = null

          if (data != null)
            // single equals check for both `null` and `undefined`
            this.push(data)

          cb(er)

          var rs = this._readableState
          rs.reading = false
          if (rs.needReadable || rs.length < rs.highWaterMark) {
            this._read(rs.highWaterMark)
          }
        }

        function Transform(options) {
          if (!(this instanceof Transform)) return new Transform(options)

          Duplex.call(this, options)

          this._transformState = {
            afterTransform: afterTransform.bind(this),
            needTransform: false,
            transforming: false,
            writecb: null,
            writechunk: null,
            writeencoding: null,
          }

          // start out asking for a readable event once data is transformed.
          this._readableState.needReadable = true

          // we have implemented the _read method, and done the other things
          // that Readable wants before the first _read call, so unset the
          // sync guard flag.
          this._readableState.sync = false

          if (options) {
            if (typeof options.transform === "function")
              this._transform = options.transform

            if (typeof options.flush === "function") this._flush = options.flush
          }

          // When the writable side finishes, then flush out anything remaining.
          this.on("prefinish", prefinish)
        }

        function prefinish() {
          var _this = this

          if (typeof this._flush === "function") {
            this._flush(function (er, data) {
              done(_this, er, data)
            })
          } else {
            done(this, null, null)
          }
        }

        Transform.prototype.push = function (chunk, encoding) {
          this._transformState.needTransform = false
          return Duplex.prototype.push.call(this, chunk, encoding)
        }

        // This is the part where you do stuff!
        // override this function in implementation classes.
        // 'chunk' is an input chunk.
        //
        // Call `push(newChunk)` to pass along transformed output
        // to the readable side.  You may call 'push' zero or more times.
        //
        // Call `cb(err)` when you are done with this chunk.  If you pass
        // an error, then that'll put the hurt on the whole operation.  If you
        // never call cb(), then you'll never get another chunk.
        Transform.prototype._transform = function (chunk, encoding, cb) {
          throw new Error("_transform() is not implemented")
        }

        Transform.prototype._write = function (chunk, encoding, cb) {
          var ts = this._transformState
          ts.writecb = cb
          ts.writechunk = chunk
          ts.writeencoding = encoding
          if (!ts.transforming) {
            var rs = this._readableState
            if (
              ts.needTransform ||
              rs.needReadable ||
              rs.length < rs.highWaterMark
            )
              this._read(rs.highWaterMark)
          }
        }

        // Doesn't matter what the args are here.
        // _transform does all the work.
        // That we got here means that the readable side wants more data.
        Transform.prototype._read = function (n) {
          var ts = this._transformState

          if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
            ts.transforming = true
            this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform)
          } else {
            // mark that we need a transform, so that any data that comes in
            // will get processed, now that we've asked for it.
            ts.needTransform = true
          }
        }

        Transform.prototype._destroy = function (err, cb) {
          var _this2 = this

          Duplex.prototype._destroy.call(this, err, function (err2) {
            cb(err2)
            _this2.emit("close")
          })
        }

        function done(stream, er, data) {
          if (er) return stream.emit("error", er)

          if (data != null)
            // single equals check for both `null` and `undefined`
            stream.push(data)

          // if there's nothing in the write buffer, then that means
          // that nothing more will ever be provided
          if (stream._writableState.length)
            throw new Error("Calling transform done when ws.length != 0")

          if (stream._transformState.transforming)
            throw new Error("Calling transform done when still transforming")

          return stream.push(null)
        }
      },
      {
        "./_stream_duplex":
          "../node_modules/readable-stream/lib/_stream_duplex.js",
        "core-util-is": "../node_modules/core-util-is/lib/util.js",
        inherits: "../node_modules/inherits/inherits_browser.js",
      },
    ],
    "../node_modules/readable-stream/lib/_stream_passthrough.js": [
      function (require, module, exports) {
        // Copyright Joyent, Inc. and other Node contributors.
        //
        // Permission is hereby granted, free of charge, to any person obtaining a
        // copy of this software and associated documentation files (the
        // "Software"), to deal in the Software without restriction, including
        // without limitation the rights to use, copy, modify, merge, publish,
        // distribute, sublicense, and/or sell copies of the Software, and to permit
        // persons to whom the Software is furnished to do so, subject to the
        // following conditions:
        //
        // The above copyright notice and this permission notice shall be included
        // in all copies or substantial portions of the Software.
        //
        // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
        // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
        // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
        // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
        // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
        // USE OR OTHER DEALINGS IN THE SOFTWARE.

        // a passthrough stream.
        // basically just the most minimal sort of Transform stream.
        // Every written chunk gets output as-is.

        "use strict"

        module.exports = PassThrough

        var Transform = require("./_stream_transform")

        /*<replacement>*/
        var util = Object.create(require("core-util-is"))
        util.inherits = require("inherits")
        /*</replacement>*/

        util.inherits(PassThrough, Transform)

        function PassThrough(options) {
          if (!(this instanceof PassThrough)) return new PassThrough(options)

          Transform.call(this, options)
        }

        PassThrough.prototype._transform = function (chunk, encoding, cb) {
          cb(null, chunk)
        }
      },
      {
        "./_stream_transform":
          "../node_modules/readable-stream/lib/_stream_transform.js",
        "core-util-is": "../node_modules/core-util-is/lib/util.js",
        inherits: "../node_modules/inherits/inherits_browser.js",
      },
    ],
    "../node_modules/readable-stream/readable-browser.js": [
      function (require, module, exports) {
        exports = module.exports = require("./lib/_stream_readable.js")
        exports.Stream = exports
        exports.Readable = exports
        exports.Writable = require("./lib/_stream_writable.js")
        exports.Duplex = require("./lib/_stream_duplex.js")
        exports.Transform = require("./lib/_stream_transform.js")
        exports.PassThrough = require("./lib/_stream_passthrough.js")
      },
      {
        "./lib/_stream_readable.js":
          "../node_modules/readable-stream/lib/_stream_readable.js",
        "./lib/_stream_writable.js":
          "../node_modules/readable-stream/lib/_stream_writable.js",
        "./lib/_stream_duplex.js":
          "../node_modules/readable-stream/lib/_stream_duplex.js",
        "./lib/_stream_transform.js":
          "../node_modules/readable-stream/lib/_stream_transform.js",
        "./lib/_stream_passthrough.js":
          "../node_modules/readable-stream/lib/_stream_passthrough.js",
      },
    ],
    "lzutf8.min.js": [
      function (require, module, exports) {
        var process = require("process")
        var global = arguments[3]
        var Buffer = require("buffer").Buffer
        function _typeof(obj) {
          "@babel/helpers - typeof"
          if (
            typeof Symbol === "function" &&
            typeof Symbol.iterator === "symbol"
          ) {
            _typeof = function _typeof(obj) {
              return typeof obj
            }
          } else {
            _typeof = function _typeof(obj) {
              return obj &&
                typeof Symbol === "function" &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? "symbol"
                : typeof obj
            }
          }
          return _typeof(obj)
        }

        /*!
 LZ-UTF8 v0.5.8

 Copyright (c) 2021, Rotem Dan
 Released under the MIT license.

 Build date: 2021-02-24 

 Please report any issue at https://github.com/rotemdan/lzutf8.js/issues
*/
        var IE10SubarrayBugPatcher, LZUTF8
        !(function (n) {
          ;(n.runningInNodeJS = function () {
            return (
              "object" ==
                (typeof process === "undefined"
                  ? "undefined"
                  : _typeof(process)) &&
              "object" == _typeof(process.versions) &&
              "string" == typeof process.versions.node
            )
          }),
            (n.runningInMainNodeJSModule = function () {
              return n.runningInNodeJS() && require.main === module
            }),
            (n.commonJSAvailable = function () {
              return (
                "object" ==
                  (typeof module === "undefined"
                    ? "undefined"
                    : _typeof(module)) && "object" == _typeof(module.exports)
              )
            }),
            (n.runningInWebWorker = function () {
              return (
                "undefined" == typeof window &&
                "object" ==
                  (typeof self === "undefined" ? "undefined" : _typeof(self)) &&
                "function" == typeof self.addEventListener &&
                "function" == typeof self.close
              )
            }),
            (n.runningInNodeChildProcess = function () {
              return n.runningInNodeJS() && "function" == typeof process.send
            }),
            (n.runningInNullOrigin = function () {
              return (
                "object" ==
                  (typeof window === "undefined"
                    ? "undefined"
                    : _typeof(window)) &&
                "object" == _typeof(window.location) &&
                "object" ==
                  (typeof document === "undefined"
                    ? "undefined"
                    : _typeof(document)) &&
                "http:" !== document.location.protocol &&
                "https:" !== document.location.protocol
              )
            }),
            (n.webWorkersAvailable = function () {
              return (
                "function" == typeof Worker &&
                !n.runningInNullOrigin() &&
                !n.runningInNodeJS() &&
                !(
                  navigator &&
                  navigator.userAgent &&
                  0 <= navigator.userAgent.indexOf("Android 4.3")
                )
              )
            }),
            (n.log = function (e, t) {
              void 0 === t && (t = !1),
                "object" ==
                  (typeof console === "undefined"
                    ? "undefined"
                    : _typeof(console)) &&
                  (console.log(e),
                  t &&
                    "object" ==
                      (typeof document === "undefined"
                        ? "undefined"
                        : _typeof(document)) &&
                    (document.body.innerHTML += e + "<br/>"))
            }),
            (n.createErrorMessage = function (e, t) {
              if ((void 0 === t && (t = "Unhandled exception"), null == e))
                return t
              if (((t += ": "), "object" != _typeof(e.content)))
                return "string" == typeof e.content ? t + e.content : t + e
              if (n.runningInNodeJS()) return t + e.content.stack
              var r = JSON.stringify(e.content)
              return "{}" !== r ? t + r : t + e.content
            }),
            (n.printExceptionAndStackTraceToConsole = function (e, t) {
              void 0 === t && (t = "Unhandled exception"),
                n.log(n.createErrorMessage(e, t))
            }),
            (n.getGlobalObject = function () {
              return "object" ==
                (typeof global === "undefined" ? "undefined" : _typeof(global))
                ? global
                : "object" ==
                  (typeof window === "undefined"
                    ? "undefined"
                    : _typeof(window))
                ? window
                : "object" ==
                  (typeof self === "undefined" ? "undefined" : _typeof(self))
                ? self
                : {}
            }),
            (n.toString = Object.prototype.toString),
            n.commonJSAvailable() && (module.exports = n)
        })((LZUTF8 = LZUTF8 || {})),
          (function () {
            if (
              "function" == typeof Uint8Array &&
              0 !== new Uint8Array(1).subarray(1).byteLength
            ) {
              var e = function e(_e, t) {
                var r = function r(e, t, _r) {
                  return e < t ? t : _r < e ? _r : e
                }

                ;(_e |= 0),
                  (t |= 0),
                  arguments.length < 1 && (_e = 0),
                  arguments.length < 2 && (t = this.length),
                  _e < 0 && (_e = this.length + _e),
                  t < 0 && (t = this.length + t),
                  (_e = r(_e, 0, this.length))
                r = (t = r(t, 0, this.length)) - _e
                return (
                  r < 0 && (r = 0),
                  new this.constructor(
                    this.buffer,
                    this.byteOffset + _e * this.BYTES_PER_ELEMENT,
                    r
                  )
                )
              }

              var t = [
                  "Int8Array",
                  "Uint8Array",
                  "Uint8ClampedArray",
                  "Int16Array",
                  "Uint16Array",
                  "Int32Array",
                  "Uint32Array",
                  "Float32Array",
                  "Float64Array",
                ],
                r = void 0
              if (
                ("object" ==
                (typeof window === "undefined" ? "undefined" : _typeof(window))
                  ? (r = window)
                  : "object" ==
                      (typeof self === "undefined"
                        ? "undefined"
                        : _typeof(self)) && (r = self),
                void 0 !== r)
              )
                for (var n = 0; n < t.length; n++) {
                  r[t[n]] && (r[t[n]].prototype.subarray = e)
                }
            }
          })((IE10SubarrayBugPatcher = IE10SubarrayBugPatcher || {})),
          (function (f) {
            var e =
              ((t.compressAsync = function (e, n, o) {
                var i = new f.Timer(),
                  u = new f.Compressor()
                if (!o)
                  throw new TypeError(
                    "compressAsync: No callback argument given"
                  )
                if ("string" == typeof e) e = f.encodeUTF8(e)
                else if (null == e || !(e instanceof Uint8Array))
                  return void o(
                    void 0,
                    new TypeError(
                      "compressAsync: Invalid input argument, only 'string' and 'Uint8Array' are supported"
                    )
                  )

                var s = f.ArrayTools.splitByteArray(e, n.blockSize),
                  a = [],
                  c = function c(e) {
                    if (e < s.length) {
                      var t = void 0

                      try {
                        t = u.compressBlock(s[e])
                      } catch (e) {
                        return void o(void 0, e)
                      }

                      a.push(t),
                        i.getElapsedTime() <= 20
                          ? c(e + 1)
                          : (f.enqueueImmediate(function () {
                              return c(e + 1)
                            }),
                            i.restart())
                    } else {
                      var r = f.ArrayTools.concatUint8Arrays(a)
                      f.enqueueImmediate(function () {
                        var e

                        try {
                          e = f.CompressionCommon.encodeCompressedBytes(
                            r,
                            n.outputEncoding
                          )
                        } catch (e) {
                          return void o(void 0, e)
                        }

                        f.enqueueImmediate(function () {
                          return o(e)
                        })
                      })
                    }
                  }

                f.enqueueImmediate(function () {
                  return c(0)
                })
              }),
              (t.createCompressionStream = function () {
                var o = new f.Compressor(),
                  i = new (require("readable-stream").Transform)({
                    decodeStrings: !0,
                    highWaterMark: 65536,
                  })
                return (
                  (i._transform = function (e, t, r) {
                    var n

                    try {
                      n = f.BufferTools.uint8ArrayToBuffer(
                        o.compressBlock(f.BufferTools.bufferToUint8Array(e))
                      )
                    } catch (e) {
                      return void i.emit("error", e)
                    }

                    i.push(n), r()
                  }),
                  i
                )
              }),
              t)

            function t() {}

            f.AsyncCompressor = e
          })((LZUTF8 = LZUTF8 || {})),
          (function (f) {
            var e =
              ((t.decompressAsync = function (e, n, o) {
                if (!o)
                  throw new TypeError(
                    "decompressAsync: No callback argument given"
                  )
                var i = new f.Timer()

                try {
                  e = f.CompressionCommon.decodeCompressedBytes(
                    e,
                    n.inputEncoding
                  )
                } catch (e) {
                  return void o(void 0, e)
                }

                var u = new f.Decompressor(),
                  s = f.ArrayTools.splitByteArray(e, n.blockSize),
                  a = [],
                  c = function c(e) {
                    if (e < s.length) {
                      var t = void 0

                      try {
                        t = u.decompressBlock(s[e])
                      } catch (e) {
                        return void o(void 0, e)
                      }

                      a.push(t),
                        i.getElapsedTime() <= 20
                          ? c(e + 1)
                          : (f.enqueueImmediate(function () {
                              return c(e + 1)
                            }),
                            i.restart())
                    } else {
                      var r = f.ArrayTools.concatUint8Arrays(a)
                      f.enqueueImmediate(function () {
                        var e

                        try {
                          e = f.CompressionCommon.encodeDecompressedBytes(
                            r,
                            n.outputEncoding
                          )
                        } catch (e) {
                          return void o(void 0, e)
                        }

                        f.enqueueImmediate(function () {
                          return o(e)
                        })
                      })
                    }
                  }

                f.enqueueImmediate(function () {
                  return c(0)
                })
              }),
              (t.createDecompressionStream = function () {
                var o = new f.Decompressor(),
                  i = new (require("readable-stream").Transform)({
                    decodeStrings: !0,
                    highWaterMark: 65536,
                  })
                return (
                  (i._transform = function (e, t, r) {
                    var n

                    try {
                      n = f.BufferTools.uint8ArrayToBuffer(
                        o.decompressBlock(f.BufferTools.bufferToUint8Array(e))
                      )
                    } catch (e) {
                      return void i.emit("error", e)
                    }

                    i.push(n), r()
                  }),
                  i
                )
              }),
              t)

            function t() {}

            f.AsyncDecompressor = e
          })((LZUTF8 = LZUTF8 || {})),
          (function (i) {
            var e, u
            ;((u = e = i.WebWorker || (i.WebWorker = {})).compressAsync =
              function (e, t, r) {
                var n, _o

                "ByteArray" != t.inputEncoding || e instanceof Uint8Array
                  ? ((n = {
                      token: Math.random().toString(),
                      type: "compress",
                      data: e,
                      inputEncoding: t.inputEncoding,
                      outputEncoding: t.outputEncoding,
                    }),
                    (_o = function o(e) {
                      e = e.data
                      e &&
                        e.token == n.token &&
                        (u.globalWorker.removeEventListener("message", _o),
                        "error" == e.type
                          ? r(void 0, new Error(e.error))
                          : r(e.data))
                    }),
                    u.globalWorker.addEventListener("message", _o),
                    u.globalWorker.postMessage(n, []))
                  : r(
                      void 0,
                      new TypeError("compressAsync: input is not a Uint8Array")
                    )
              }),
              (u.decompressAsync = function (e, t, r) {
                var n = {
                    token: Math.random().toString(),
                    type: "decompress",
                    data: e,
                    inputEncoding: t.inputEncoding,
                    outputEncoding: t.outputEncoding,
                  },
                  o = function o(e) {
                    e = e.data
                    e &&
                      e.token == n.token &&
                      (u.globalWorker.removeEventListener("message", o),
                      "error" == e.type
                        ? r(void 0, new Error(e.error))
                        : r(e.data))
                  }

                u.globalWorker.addEventListener("message", o),
                  u.globalWorker.postMessage(n, [])
              }),
              (u.installWebWorkerIfNeeded = function () {
                "object" ==
                  (typeof self === "undefined" ? "undefined" : _typeof(self)) &&
                  void 0 === self.document &&
                  null != self.addEventListener &&
                  (self.addEventListener("message", function (e) {
                    var t = e.data

                    if ("compress" == t.type) {
                      var r = void 0

                      try {
                        r = i.compress(t.data, {
                          outputEncoding: t.outputEncoding,
                        })
                      } catch (e) {
                        return void self.postMessage(
                          {
                            token: t.token,
                            type: "error",
                            error: i.createErrorMessage(e),
                          },
                          []
                        )
                      }

                      ;(n = {
                        token: t.token,
                        type: "compressionResult",
                        data: r,
                        encoding: t.outputEncoding,
                      }).data instanceof Uint8Array &&
                      -1 === navigator.appVersion.indexOf("MSIE 10")
                        ? self.postMessage(n, [n.data.buffer])
                        : self.postMessage(n, [])
                    } else if ("decompress" == t.type) {
                      var n,
                        o = void 0

                      try {
                        o = i.decompress(t.data, {
                          inputEncoding: t.inputEncoding,
                          outputEncoding: t.outputEncoding,
                        })
                      } catch (e) {
                        return void self.postMessage(
                          {
                            token: t.token,
                            type: "error",
                            error: i.createErrorMessage(e),
                          },
                          []
                        )
                      }

                      ;(n = {
                        token: t.token,
                        type: "decompressionResult",
                        data: o,
                        encoding: t.outputEncoding,
                      }).data instanceof Uint8Array &&
                      -1 === navigator.appVersion.indexOf("MSIE 10")
                        ? self.postMessage(n, [n.data.buffer])
                        : self.postMessage(n, [])
                    }
                  }),
                  self.addEventListener("error", function (e) {
                    i.log(
                      i.createErrorMessage(
                        e.error,
                        "Unexpected LZUTF8 WebWorker exception"
                      )
                    )
                  }))
              }),
              (u.createGlobalWorkerIfNeeded = function () {
                return (
                  !!u.globalWorker ||
                  (!!i.webWorkersAvailable() &&
                    (u.scriptURI ||
                      "object" !=
                        (typeof document === "undefined"
                          ? "undefined"
                          : _typeof(document)) ||
                      (null != (e = document.getElementById("lzutf8")) &&
                        (u.scriptURI = e.getAttribute("src") || void 0)),
                    !!u.scriptURI &&
                      ((u.globalWorker = new Worker(u.scriptURI)), !0)))
                )
                var e
              }),
              (u.terminate = function () {
                u.globalWorker &&
                  (u.globalWorker.terminate(), (u.globalWorker = void 0))
              }),
              e.installWebWorkerIfNeeded()
          })((LZUTF8 = LZUTF8 || {})),
          (function (e) {
            var t =
              ((r.prototype.get = function (e) {
                return this.container[this.startPosition + e]
              }),
              (r.prototype.getInReversedOrder = function (e) {
                return this.container[this.startPosition + this.length - 1 - e]
              }),
              (r.prototype.set = function (e, t) {
                this.container[this.startPosition + e] = t
              }),
              r)

            function r(e, t, r) {
              ;(this.container = e), (this.startPosition = t), (this.length = r)
            }

            e.ArraySegment = t
          })((LZUTF8 = LZUTF8 || {})),
          (function (e) {
            ;((e = e.ArrayTools || (e.ArrayTools = {})).copyElements =
              function (e, t, r, n, o) {
                for (; o--; ) {
                  r[n++] = e[t++]
                }
              }),
              (e.zeroElements = function (e, t, r) {
                for (; r--; ) {
                  e[t++] = 0
                }
              }),
              (e.countNonzeroValuesInArray = function (e) {
                for (var t = 0, r = 0; r < e.length; r++) {
                  e[r] && t++
                }

                return t
              }),
              (e.truncateStartingElements = function (e, t) {
                if (e.length <= t)
                  throw new RangeError(
                    "truncateStartingElements: Requested length should be smaller than array length"
                  )

                for (var r = e.length - t, n = 0; n < t; n++) {
                  e[n] = e[r + n]
                }

                e.length = t
              }),
              (e.doubleByteArrayCapacity = function (e) {
                var t = new Uint8Array(2 * e.length)
                return t.set(e), t
              }),
              (e.concatUint8Arrays = function (e) {
                for (var t = 0, r = 0, n = e; r < n.length; r++) {
                  t += (a = n[r]).length
                }

                for (
                  var o = new Uint8Array(t), i = 0, u = 0, s = e;
                  u < s.length;
                  u++
                ) {
                  var a = s[u]
                  o.set(a, i), (i += a.length)
                }

                return o
              }),
              (e.splitByteArray = function (e, t) {
                for (var r = [], n = 0; n < e.length; ) {
                  var o = Math.min(t, e.length - n)
                  r.push(e.subarray(n, n + o)), (n += o)
                }

                return r
              })
          })((LZUTF8 = LZUTF8 || {})),
          (function (e) {
            var t
            ;((t =
              e.BufferTools ||
              (e.BufferTools = {})).convertToUint8ArrayIfNeeded = function (e) {
              return "function" == typeof Buffer && Buffer.isBuffer(e)
                ? t.bufferToUint8Array(e)
                : e
            }),
              (t.uint8ArrayToBuffer = function (e) {
                if (Buffer.prototype instanceof Uint8Array) {
                  var t = new Uint8Array(e.buffer, e.byteOffset, e.byteLength)
                  return Object.setPrototypeOf(t, Buffer.prototype), t
                }

                for (var r = e.length, n = new Buffer(r), o = 0; o < r; o++) {
                  n[o] = e[o]
                }

                return n
              }),
              (t.bufferToUint8Array = function (e) {
                if (Buffer.prototype instanceof Uint8Array)
                  return new Uint8Array(e.buffer, e.byteOffset, e.byteLength)

                for (
                  var t = e.length, r = new Uint8Array(t), n = 0;
                  n < t;
                  n++
                ) {
                  r[n] = e[n]
                }

                return r
              })
          })((LZUTF8 = LZUTF8 || {})),
          (function (o) {
            var e
            ;((e =
              o.CompressionCommon ||
              (o.CompressionCommon = {})).getCroppedBuffer = function (
              e,
              t,
              r,
              n
            ) {
              void 0 === n && (n = 0)
              n = new Uint8Array(r + n)
              return n.set(e.subarray(t, t + r)), n
            }),
              (e.getCroppedAndAppendedByteArray = function (e, t, r, n) {
                return o.ArrayTools.concatUint8Arrays([e.subarray(t, t + r), n])
              }),
              (e.detectCompressionSourceEncoding = function (e) {
                if (null == e)
                  throw new TypeError(
                    "detectCompressionSourceEncoding: input is null or undefined"
                  )
                if ("string" == typeof e) return "String"
                if (
                  e instanceof Uint8Array ||
                  ("function" == typeof Buffer && Buffer.isBuffer(e))
                )
                  return "ByteArray"
                throw new TypeError(
                  "detectCompressionSourceEncoding: input must be of type 'string', 'Uint8Array' or 'Buffer'"
                )
              }),
              (e.encodeCompressedBytes = function (e, t) {
                switch (t) {
                  case "ByteArray":
                    return e

                  case "Buffer":
                    return o.BufferTools.uint8ArrayToBuffer(e)

                  case "Base64":
                    return o.encodeBase64(e)

                  case "BinaryString":
                    return o.encodeBinaryString(e)

                  case "StorageBinaryString":
                    return o.encodeStorageBinaryString(e)

                  default:
                    throw new TypeError(
                      "encodeCompressedBytes: invalid output encoding requested"
                    )
                }
              }),
              (e.decodeCompressedBytes = function (e, t) {
                if (null == t)
                  throw new TypeError(
                    "decodeCompressedData: Input is null or undefined"
                  )

                switch (t) {
                  case "ByteArray":
                  case "Buffer":
                    var r = o.BufferTools.convertToUint8ArrayIfNeeded(e)
                    if (!(r instanceof Uint8Array))
                      throw new TypeError(
                        "decodeCompressedData: 'ByteArray' or 'Buffer' input type was specified but input is not a Uint8Array or Buffer"
                      )
                    return r

                  case "Base64":
                    if ("string" != typeof e)
                      throw new TypeError(
                        "decodeCompressedData: 'Base64' input type was specified but input is not a string"
                      )
                    return o.decodeBase64(e)

                  case "BinaryString":
                    if ("string" != typeof e)
                      throw new TypeError(
                        "decodeCompressedData: 'BinaryString' input type was specified but input is not a string"
                      )
                    return o.decodeBinaryString(e)

                  case "StorageBinaryString":
                    if ("string" != typeof e)
                      throw new TypeError(
                        "decodeCompressedData: 'StorageBinaryString' input type was specified but input is not a string"
                      )
                    return o.decodeStorageBinaryString(e)

                  default:
                    throw new TypeError(
                      "decodeCompressedData: invalid input encoding requested: '" +
                        t +
                        "'"
                    )
                }
              }),
              (e.encodeDecompressedBytes = function (e, t) {
                switch (t) {
                  case "String":
                    return o.decodeUTF8(e)

                  case "ByteArray":
                    return e

                  case "Buffer":
                    if ("function" != typeof Buffer)
                      throw new TypeError(
                        "encodeDecompressedBytes: a 'Buffer' type was specified but is not supported at the current envirnment"
                      )
                    return o.BufferTools.uint8ArrayToBuffer(e)

                  default:
                    throw new TypeError(
                      "encodeDecompressedBytes: invalid output encoding requested"
                    )
                }
              })
          })((LZUTF8 = LZUTF8 || {})),
          (function (o) {
            var t, e, i, u
            ;(e = t = o.EventLoop || (o.EventLoop = {})),
              (u = []),
              (e.enqueueImmediate = function (e) {
                u.push(e), 1 === u.length && i()
              }),
              (e.initializeScheduler = function () {
                function t() {
                  for (var e = 0, t = u; e < t.length; e++) {
                    var r = t[e]

                    try {
                      r.call(void 0)
                    } catch (e) {
                      o.printExceptionAndStackTraceToConsole(
                        e,
                        "enqueueImmediate exception"
                      )
                    }
                  }

                  u.length = 0
                }

                var r, e, n
                o.runningInNodeJS() &&
                  (i = function i() {
                    return setImmediate(t)
                  }),
                  (i =
                    "object" ==
                      (typeof window === "undefined"
                        ? "undefined"
                        : _typeof(window)) &&
                    "function" == typeof window.addEventListener &&
                    "function" == typeof window.postMessage
                      ? ((r = "enqueueImmediate-" + Math.random().toString()),
                        window.addEventListener("message", function (e) {
                          e.data === r && t()
                        }),
                        (e = o.runningInNullOrigin()
                          ? "*"
                          : window.location.href),
                        function () {
                          return window.postMessage(r, e)
                        })
                      : "function" == typeof MessageChannel &&
                        "function" == typeof MessagePort
                      ? (((n = new MessageChannel()).port1.onmessage = t),
                        function () {
                          return n.port2.postMessage(0)
                        })
                      : function () {
                          return setTimeout(t, 0)
                        })
              }),
              e.initializeScheduler(),
              (o.enqueueImmediate = function (e) {
                return t.enqueueImmediate(e)
              })
          })((LZUTF8 = LZUTF8 || {})),
          (function (e) {
            var r
            ;((r = e.ObjectTools || (e.ObjectTools = {})).override = function (
              e,
              t
            ) {
              return r.extend(e, t)
            }),
              (r.extend = function (e, t) {
                if (null == e) throw new TypeError("obj is null or undefined")
                if ("object" != _typeof(e))
                  throw new TypeError("obj is not an object")
                if ((null == t && (t = {}), "object" != _typeof(t)))
                  throw new TypeError("newProperties is not an object")
                if (null != t)
                  for (var r in t) {
                    e[r] = t[r]
                  }
                return e
              })
          })((LZUTF8 = LZUTF8 || {})),
          (function (o) {
            ;(o.getRandomIntegerInRange = function (e, t) {
              return e + Math.floor(Math.random() * (t - e))
            }),
              (o.getRandomUTF16StringOfLength = function (e) {
                for (var t = "", r = 0; r < e; r++) {
                  for (
                    var n = void 0;
                    (n = o.getRandomIntegerInRange(0, 1114112)),
                      55296 <= n && n <= 57343;

                  ) {}

                  t += o.Encoding.CodePoint.decodeToString(n)
                }

                return t
              })
          })((LZUTF8 = LZUTF8 || {})),
          (function (e) {
            var t =
              ((r.prototype.appendCharCode = function (e) {
                ;(this.outputBuffer[this.outputPosition++] = e),
                  this.outputPosition === this.outputBufferCapacity &&
                    this.flushBufferToOutputString()
              }),
              (r.prototype.appendCharCodes = function (e) {
                for (var t = 0, r = e.length; t < r; t++) {
                  this.appendCharCode(e[t])
                }
              }),
              (r.prototype.appendString = function (e) {
                for (var t = 0, r = e.length; t < r; t++) {
                  this.appendCharCode(e.charCodeAt(t))
                }
              }),
              (r.prototype.appendCodePoint = function (e) {
                if (e <= 65535) this.appendCharCode(e)
                else {
                  if (!(e <= 1114111))
                    throw new Error(
                      "appendCodePoint: A code point of " +
                        e +
                        " cannot be encoded in UTF-16"
                    )
                  this.appendCharCode(55296 + ((e - 65536) >>> 10)),
                    this.appendCharCode(56320 + ((e - 65536) & 1023))
                }
              }),
              (r.prototype.getOutputString = function () {
                return this.flushBufferToOutputString(), this.outputString
              }),
              (r.prototype.flushBufferToOutputString = function () {
                this.outputPosition === this.outputBufferCapacity
                  ? (this.outputString += String.fromCharCode.apply(
                      null,
                      this.outputBuffer
                    ))
                  : (this.outputString += String.fromCharCode.apply(
                      null,
                      this.outputBuffer.subarray(0, this.outputPosition)
                    )),
                  (this.outputPosition = 0)
              }),
              r)

            function r(e) {
              void 0 === e && (e = 1024),
                (this.outputBufferCapacity = e),
                (this.outputPosition = 0),
                (this.outputString = ""),
                (this.outputBuffer = new Uint16Array(this.outputBufferCapacity))
            }

            e.StringBuilder = t
          })((LZUTF8 = LZUTF8 || {})),
          (function (n) {
            var e =
              ((t.prototype.restart = function () {
                this.startTime = t.getTimestamp()
              }),
              (t.prototype.getElapsedTime = function () {
                return t.getTimestamp() - this.startTime
              }),
              (t.prototype.getElapsedTimeAndRestart = function () {
                var e = this.getElapsedTime()
                return this.restart(), e
              }),
              (t.prototype.logAndRestart = function (e, t) {
                void 0 === t && (t = !0)
                var r = this.getElapsedTime(),
                  e = e + ": " + r.toFixed(3) + "ms"
                return n.log(e, t), this.restart(), r
              }),
              (t.getTimestamp = function () {
                return (
                  this.timestampFunc || this.createGlobalTimestampFunction(),
                  this.timestampFunc()
                )
              }),
              (t.getMicrosecondTimestamp = function () {
                return Math.floor(1e3 * t.getTimestamp())
              }),
              (t.createGlobalTimestampFunction = function () {
                var t, e, r, n
                "object" ==
                  (typeof process === "undefined"
                    ? "undefined"
                    : _typeof(process)) && "function" == typeof process.hrtime
                  ? ((t = 0),
                    (this.timestampFunc = function () {
                      var e = process.hrtime(),
                        e = 1e3 * e[0] + e[1] / 1e6
                      return t + e
                    }),
                    (t = Date.now() - this.timestampFunc()))
                  : "object" ==
                      (typeof chrome === "undefined"
                        ? "undefined"
                        : _typeof(chrome)) && chrome.Interval
                  ? ((e = Date.now()),
                    (r = new chrome.Interval()).start(),
                    (this.timestampFunc = function () {
                      return e + r.microseconds() / 1e3
                    }))
                  : "object" ==
                      (typeof performance === "undefined"
                        ? "undefined"
                        : _typeof(performance)) && performance.now
                  ? ((n = Date.now() - performance.now()),
                    (this.timestampFunc = function () {
                      return n + performance.now()
                    }))
                  : Date.now
                  ? (this.timestampFunc = function () {
                      return Date.now()
                    })
                  : (this.timestampFunc = function () {
                      return new Date().getTime()
                    })
              }),
              t)

            function t() {
              this.restart()
            }

            n.Timer = e
          })((LZUTF8 = LZUTF8 || {})),
          (function (n) {
            var e =
              ((t.prototype.compressBlock = function (e) {
                if (null == e)
                  throw new TypeError(
                    "compressBlock: undefined or null input received"
                  )
                return (
                  "string" == typeof e && (e = n.encodeUTF8(e)),
                  (e = n.BufferTools.convertToUint8ArrayIfNeeded(e)),
                  this.compressUtf8Block(e)
                )
              }),
              (t.prototype.compressUtf8Block = function (e) {
                if (!e || 0 == e.length) return new Uint8Array(0)
                var t = this.cropAndAddNewBytesToInputBuffer(e),
                  r = this.inputBuffer,
                  n = this.inputBuffer.length
                this.outputBuffer = new Uint8Array(e.length)

                for (
                  var o = (this.outputBufferPosition = 0), i = t;
                  i < n;
                  i++
                ) {
                  var u,
                    s,
                    a = r[i],
                    c = i < o
                  i > n - this.MinimumSequenceLength
                    ? c || this.outputRawByte(a)
                    : ((u = this.getBucketIndexForPrefix(i)),
                      c ||
                        (null != (s = this.findLongestMatch(i, u)) &&
                          (this.outputPointerBytes(s.length, s.distance),
                          (o = i + s.length),
                          (c = !0))),
                      c || this.outputRawByte(a),
                      (a = this.inputBufferStreamOffset + i),
                      this.prefixHashTable.addValueToBucket(u, a))
                }

                return this.outputBuffer.subarray(0, this.outputBufferPosition)
              }),
              (t.prototype.findLongestMatch = function (e, t) {
                var r = this.prefixHashTable.getArraySegmentForBucketIndex(
                  t,
                  this.reusableArraySegmentObject
                )
                if (null == r) return null

                for (
                  var n, o = this.inputBuffer, i = 0, u = 0;
                  u < r.length;
                  u++
                ) {
                  var s =
                      r.getInReversedOrder(u) - this.inputBufferStreamOffset,
                    a = e - s,
                    c = void 0,
                    c =
                      void 0 === n
                        ? this.MinimumSequenceLength - 1
                        : n < 128 && 128 <= a
                        ? i + (i >>> 1)
                        : i
                  if (
                    a > this.MaximumMatchDistance ||
                    c >= this.MaximumSequenceLength ||
                    e + c >= o.length
                  )
                    break
                  if (o[s + c] === o[e + c])
                    for (var f = 0; ; f++) {
                      if (e + f === o.length || o[s + f] !== o[e + f]) {
                        c < f && ((n = a), (i = f))
                        break
                      }

                      if (f === this.MaximumSequenceLength)
                        return {
                          distance: a,
                          length: this.MaximumSequenceLength,
                        }
                    }
                }

                return void 0 !== n
                  ? {
                      distance: n,
                      length: i,
                    }
                  : null
              }),
              (t.prototype.getBucketIndexForPrefix = function (e) {
                return (
                  (7880599 * this.inputBuffer[e] +
                    39601 * this.inputBuffer[e + 1] +
                    199 * this.inputBuffer[e + 2] +
                    this.inputBuffer[e + 3]) %
                  this.PrefixHashTableSize
                )
              }),
              (t.prototype.outputPointerBytes = function (e, t) {
                t < 128
                  ? (this.outputRawByte(192 | e), this.outputRawByte(t))
                  : (this.outputRawByte(224 | e),
                    this.outputRawByte(t >>> 8),
                    this.outputRawByte(255 & t))
              }),
              (t.prototype.outputRawByte = function (e) {
                this.outputBuffer[this.outputBufferPosition++] = e
              }),
              (t.prototype.cropAndAddNewBytesToInputBuffer = function (e) {
                if (void 0 === this.inputBuffer)
                  return (this.inputBuffer = e), 0
                var t = Math.min(
                    this.inputBuffer.length,
                    this.MaximumMatchDistance
                  ),
                  r = this.inputBuffer.length - t
                return (
                  (this.inputBuffer =
                    n.CompressionCommon.getCroppedAndAppendedByteArray(
                      this.inputBuffer,
                      r,
                      t,
                      e
                    )),
                  (this.inputBufferStreamOffset += r),
                  t
                )
              }),
              t)

            function t(e) {
              void 0 === e && (e = !0),
                (this.MinimumSequenceLength = 4),
                (this.MaximumSequenceLength = 31),
                (this.MaximumMatchDistance = 32767),
                (this.PrefixHashTableSize = 65537),
                (this.inputBufferStreamOffset = 1),
                e && "function" == typeof Uint32Array
                  ? (this.prefixHashTable = new n.CompressorCustomHashTable(
                      this.PrefixHashTableSize
                    ))
                  : (this.prefixHashTable = new n.CompressorSimpleHashTable(
                      this.PrefixHashTableSize
                    ))
            }

            n.Compressor = e
          })((LZUTF8 = LZUTF8 || {})),
          (function (s) {
            var e =
              ((t.prototype.addValueToBucket = function (e, t) {
                ;(e <<= 1),
                  this.storageIndex >= this.storage.length >>> 1 &&
                    this.compact()
                var r,
                  n,
                  o = this.bucketLocators[e]
                0 === o
                  ? ((o = this.storageIndex),
                    (r = 1),
                    (this.storage[this.storageIndex] = t),
                    (this.storageIndex += this.minimumBucketCapacity))
                  : ((r = this.bucketLocators[e + 1]) ===
                      this.maximumBucketCapacity - 1 &&
                      (r = this.truncateBucketToNewerElements(
                        o,
                        r,
                        this.maximumBucketCapacity / 2
                      )),
                    (n = o + r),
                    0 === this.storage[n]
                      ? ((this.storage[n] = t),
                        n === this.storageIndex && (this.storageIndex += r))
                      : (s.ArrayTools.copyElements(
                          this.storage,
                          o,
                          this.storage,
                          this.storageIndex,
                          r
                        ),
                        (o = this.storageIndex),
                        (this.storageIndex += r),
                        (this.storage[this.storageIndex++] = t),
                        (this.storageIndex += r)),
                    r++),
                  (this.bucketLocators[e] = o),
                  (this.bucketLocators[e + 1] = r)
              }),
              (t.prototype.truncateBucketToNewerElements = function (e, t, r) {
                var n = e + t - r
                return (
                  s.ArrayTools.copyElements(
                    this.storage,
                    n,
                    this.storage,
                    e,
                    r
                  ),
                  s.ArrayTools.zeroElements(this.storage, e + r, t - r),
                  r
                )
              }),
              (t.prototype.compact = function () {
                var e = this.bucketLocators,
                  t = this.storage
                ;(this.bucketLocators = new Uint32Array(
                  this.bucketLocators.length
                )),
                  (this.storageIndex = 1)

                for (var r = 0; r < e.length; r += 2) {
                  var n = e[r + 1]
                  0 !== n &&
                    ((this.bucketLocators[r] = this.storageIndex),
                    (this.bucketLocators[r + 1] = n),
                    (this.storageIndex += Math.max(
                      Math.min(2 * n, this.maximumBucketCapacity),
                      this.minimumBucketCapacity
                    )))
                }

                this.storage = new Uint32Array(8 * this.storageIndex)

                for (r = 0; r < e.length; r += 2) {
                  var o,
                    i,
                    u = e[r]
                  0 !== u &&
                    ((o = this.bucketLocators[r]),
                    (i = this.bucketLocators[r + 1]),
                    s.ArrayTools.copyElements(t, u, this.storage, o, i))
                }
              }),
              (t.prototype.getArraySegmentForBucketIndex = function (e, t) {
                e <<= 1
                var r = this.bucketLocators[e]
                return 0 === r
                  ? null
                  : (void 0 === t &&
                      (t = new s.ArraySegment(
                        this.storage,
                        r,
                        this.bucketLocators[e + 1]
                      )),
                    t)
              }),
              (t.prototype.getUsedBucketCount = function () {
                return Math.floor(
                  s.ArrayTools.countNonzeroValuesInArray(this.bucketLocators) /
                    2
                )
              }),
              (t.prototype.getTotalElementCount = function () {
                for (var e = 0, t = 0; t < this.bucketLocators.length; t += 2) {
                  e += this.bucketLocators[t + 1]
                }

                return e
              }),
              t)

            function t(e) {
              ;(this.minimumBucketCapacity = 4),
                (this.maximumBucketCapacity = 64),
                (this.bucketLocators = new Uint32Array(2 * e)),
                (this.storage = new Uint32Array(2 * e)),
                (this.storageIndex = 1)
            }

            s.CompressorCustomHashTable = e
          })((LZUTF8 = LZUTF8 || {})),
          (function (n) {
            var e =
              ((t.prototype.addValueToBucket = function (e, t) {
                var r = this.buckets[e]
                void 0 === r
                  ? (this.buckets[e] = [t])
                  : (r.length === this.maximumBucketCapacity - 1 &&
                      n.ArrayTools.truncateStartingElements(
                        r,
                        this.maximumBucketCapacity / 2
                      ),
                    r.push(t))
              }),
              (t.prototype.getArraySegmentForBucketIndex = function (e, t) {
                e = this.buckets[e]
                return void 0 === e
                  ? null
                  : (void 0 === t && (t = new n.ArraySegment(e, 0, e.length)),
                    t)
              }),
              (t.prototype.getUsedBucketCount = function () {
                return n.ArrayTools.countNonzeroValuesInArray(this.buckets)
              }),
              (t.prototype.getTotalElementCount = function () {
                for (var e = 0, t = 0; t < this.buckets.length; t++) {
                  void 0 !== this.buckets[t] && (e += this.buckets[t].length)
                }

                return e
              }),
              t)

            function t(e) {
              ;(this.maximumBucketCapacity = 64), (this.buckets = new Array(e))
            }

            n.CompressorSimpleHashTable = e
          })((LZUTF8 = LZUTF8 || {})),
          (function (f) {
            var e =
              ((t.prototype.decompressBlockToString = function (e) {
                return (
                  (e = f.BufferTools.convertToUint8ArrayIfNeeded(e)),
                  f.decodeUTF8(this.decompressBlock(e))
                )
              }),
              (t.prototype.decompressBlock = function (e) {
                this.inputBufferRemainder &&
                  ((e = f.ArrayTools.concatUint8Arrays([
                    this.inputBufferRemainder,
                    e,
                  ])),
                  (this.inputBufferRemainder = void 0))

                for (
                  var t = this.cropOutputBufferToWindowAndInitialize(
                      Math.max(4 * e.length, 1024)
                    ),
                    r = 0,
                    n = e.length;
                  r < n;
                  r++
                ) {
                  var o = e[r]

                  if (o >>> 6 == 3) {
                    var i = o >>> 5

                    if (r == n - 1 || (r == n - 2 && 7 == i)) {
                      this.inputBufferRemainder = e.subarray(r)
                      break
                    }

                    if (e[r + 1] >>> 7 == 1) this.outputByte(o)
                    else {
                      var u = 31 & o,
                        s = void 0
                      6 == i
                        ? ((s = e[r + 1]), (r += 1))
                        : ((s = (e[r + 1] << 8) | e[r + 2]), (r += 2))

                      for (var a = this.outputPosition - s, c = 0; c < u; c++) {
                        this.outputByte(this.outputBuffer[a + c])
                      }
                    }
                  } else this.outputByte(o)
                }

                return (
                  this.rollBackIfOutputBufferEndsWithATruncatedMultibyteSequence(),
                  f.CompressionCommon.getCroppedBuffer(
                    this.outputBuffer,
                    t,
                    this.outputPosition - t
                  )
                )
              }),
              (t.prototype.outputByte = function (e) {
                this.outputPosition === this.outputBuffer.length &&
                  (this.outputBuffer = f.ArrayTools.doubleByteArrayCapacity(
                    this.outputBuffer
                  )),
                  (this.outputBuffer[this.outputPosition++] = e)
              }),
              (t.prototype.cropOutputBufferToWindowAndInitialize = function (
                e
              ) {
                if (!this.outputBuffer)
                  return (this.outputBuffer = new Uint8Array(e)), 0
                var t = Math.min(this.outputPosition, this.MaximumMatchDistance)

                if (
                  ((this.outputBuffer = f.CompressionCommon.getCroppedBuffer(
                    this.outputBuffer,
                    this.outputPosition - t,
                    t,
                    e
                  )),
                  (this.outputPosition = t),
                  this.outputBufferRemainder)
                ) {
                  for (var r = 0; r < this.outputBufferRemainder.length; r++) {
                    this.outputByte(this.outputBufferRemainder[r])
                  }

                  this.outputBufferRemainder = void 0
                }

                return t
              }),
              (t.prototype.rollBackIfOutputBufferEndsWithATruncatedMultibyteSequence =
                function () {
                  for (var e = 1; e <= 4 && 0 <= this.outputPosition - e; e++) {
                    var t = this.outputBuffer[this.outputPosition - e]
                    if (
                      (e < 4 && t >>> 3 == 30) ||
                      (e < 3 && t >>> 4 == 14) ||
                      (e < 2 && t >>> 5 == 6)
                    )
                      return (
                        (this.outputBufferRemainder =
                          this.outputBuffer.subarray(
                            this.outputPosition - e,
                            this.outputPosition
                          )),
                        void (this.outputPosition -= e)
                      )
                  }
                }),
              t)

            function t() {
              ;(this.MaximumMatchDistance = 32767), (this.outputPosition = 0)
            }

            f.Decompressor = e
          })((LZUTF8 = LZUTF8 || {})),
          (function (s) {
            var e, t, a, c
            ;(e = s.Encoding || (s.Encoding = {})),
              (t = e.Base64 || (e.Base64 = {})),
              (a = new Uint8Array([
                65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
                81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101,
                102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114,
                115, 116, 117, 118, 119, 120, 121, 122, 48, 49, 50, 51, 52, 53,
                54, 55, 56, 57, 43, 47,
              ])),
              (c = new Uint8Array([
                255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
                255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
                255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
                255, 255, 255, 255, 62, 255, 255, 255, 63, 52, 53, 54, 55, 56,
                57, 58, 59, 60, 61, 255, 255, 255, 0, 255, 255, 255, 0, 1, 2, 3,
                4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                21, 22, 23, 24, 25, 255, 255, 255, 255, 255, 255, 26, 27, 28,
                29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44,
                45, 46, 47, 48, 49, 50, 51, 255, 255, 255, 255,
              ])),
              (t.encode = function (e) {
                return e && 0 != e.length
                  ? s.runningInNodeJS()
                    ? s.BufferTools.uint8ArrayToBuffer(e).toString("base64")
                    : t.encodeWithJS(e)
                  : ""
              }),
              (t.decode = function (e) {
                return e
                  ? s.runningInNodeJS()
                    ? s.BufferTools.bufferToUint8Array(Buffer.from(e, "base64"))
                    : t.decodeWithJS(e)
                  : new Uint8Array(0)
              }),
              (t.encodeWithJS = function (e, t) {
                if ((void 0 === t && (t = !0), !e || 0 == e.length)) return ""

                for (
                  var r, n = a, o = new s.StringBuilder(), i = 0, u = e.length;
                  i < u;
                  i += 3
                ) {
                  i <= u - 3
                    ? ((r = (e[i] << 16) | (e[i + 1] << 8) | e[i + 2]),
                      o.appendCharCode(n[(r >>> 18) & 63]),
                      o.appendCharCode(n[(r >>> 12) & 63]),
                      o.appendCharCode(n[(r >>> 6) & 63]),
                      o.appendCharCode(n[63 & r]),
                      (r = 0))
                    : i === u - 2
                    ? ((r = (e[i] << 16) | (e[i + 1] << 8)),
                      o.appendCharCode(n[(r >>> 18) & 63]),
                      o.appendCharCode(n[(r >>> 12) & 63]),
                      o.appendCharCode(n[(r >>> 6) & 63]),
                      t && o.appendCharCode(61))
                    : i === u - 1 &&
                      ((r = e[i] << 16),
                      o.appendCharCode(n[(r >>> 18) & 63]),
                      o.appendCharCode(n[(r >>> 12) & 63]),
                      t && (o.appendCharCode(61), o.appendCharCode(61)))
                }

                return o.getOutputString()
              }),
              (t.decodeWithJS = function (e, t) {
                if (!e || 0 == e.length) return new Uint8Array(0)
                var r = e.length % 4
                if (1 == r)
                  throw new Error("Invalid Base64 string: length % 4 == 1")
                2 == r ? (e += "==") : 3 == r && (e += "="),
                  (t = t || new Uint8Array(e.length))

                for (var n = 0, o = e.length, i = 0; i < o; i += 4) {
                  var u =
                    (c[e.charCodeAt(i)] << 18) |
                    (c[e.charCodeAt(i + 1)] << 12) |
                    (c[e.charCodeAt(i + 2)] << 6) |
                    c[e.charCodeAt(i + 3)]
                  ;(t[n++] = (u >>> 16) & 255),
                    (t[n++] = (u >>> 8) & 255),
                    (t[n++] = 255 & u)
                }

                return (
                  61 == e.charCodeAt(o - 1) && n--,
                  61 == e.charCodeAt(o - 2) && n--,
                  t.subarray(0, n)
                )
              })
          })((LZUTF8 = LZUTF8 || {})),
          (function (s) {
            var e
            ;((e =
              (e = s.Encoding || (s.Encoding = {})).BinaryString ||
              (e.BinaryString = {})).encode = function (e) {
              if (null == e)
                throw new TypeError(
                  "BinaryString.encode: undefined or null input received"
                )
              if (0 === e.length) return ""

              for (
                var t = e.length,
                  r = new s.StringBuilder(),
                  n = 0,
                  o = 1,
                  i = 0;
                i < t;
                i += 2
              ) {
                var u = void 0,
                  u = i == t - 1 ? e[i] << 8 : (e[i] << 8) | e[i + 1]
                r.appendCharCode((n << (16 - o)) | (u >>> o)),
                  (n = u & ((1 << o) - 1)),
                  15 === o ? (r.appendCharCode(n), (n = 0), (o = 1)) : (o += 1),
                  t - 2 <= i && r.appendCharCode(n << (16 - o))
              }

              return r.appendCharCode(32768 | t % 2), r.getOutputString()
            }),
              (e.decode = function (e) {
                if ("string" != typeof e)
                  throw new TypeError("BinaryString.decode: invalid input type")
                if ("" == e) return new Uint8Array(0)

                for (
                  var t,
                    r = new Uint8Array(3 * e.length),
                    n = 0,
                    o = 0,
                    i = 0,
                    u = 0;
                  u < e.length;
                  u++
                ) {
                  var s = e.charCodeAt(u)
                  32768 <= s
                    ? (32769 == s && n--, (i = 0))
                    : ((o =
                        0 == i
                          ? s
                          : ((t = (o << i) | (s >>> (15 - i))),
                            (r[n++] = t >>> 8),
                            (r[n++] = 255 & t),
                            s & ((1 << (15 - i)) - 1))),
                      15 == i ? (i = 0) : (i += 1))
                }

                return r.subarray(0, n)
              })
          })((LZUTF8 = LZUTF8 || {})),
          (function (e) {
            ;((e =
              (e = e.Encoding || (e.Encoding = {})).CodePoint ||
              (e.CodePoint = {})).encodeFromString = function (e, t) {
              var r = e.charCodeAt(t)
              if (r < 55296 || 56319 < r) return r
              t = e.charCodeAt(t + 1)
              if (56320 <= t && t <= 57343)
                return t - 56320 + ((r - 55296) << 10) + 65536
              throw new Error(
                "getUnicodeCodePoint: Received a lead surrogate character, char code " +
                  r +
                  ", followed by " +
                  t +
                  ", which is not a trailing surrogate character code."
              )
            }),
              (e.decodeToString = function (e) {
                if (e <= 65535) return String.fromCharCode(e)
                if (e <= 1114111)
                  return String.fromCharCode(
                    55296 + ((e - 65536) >>> 10),
                    56320 + ((e - 65536) & 1023)
                  )
                throw new Error(
                  "getStringFromUnicodeCodePoint: A code point of " +
                    e +
                    " cannot be encoded in UTF-16"
                )
              })
          })((LZUTF8 = LZUTF8 || {})),
          (function (e) {
            var n
            ;(e =
              (e = e.Encoding || (e.Encoding = {})).DecimalString ||
              (e.DecimalString = {})),
              (n = [
                "000",
                "001",
                "002",
                "003",
                "004",
                "005",
                "006",
                "007",
                "008",
                "009",
                "010",
                "011",
                "012",
                "013",
                "014",
                "015",
                "016",
                "017",
                "018",
                "019",
                "020",
                "021",
                "022",
                "023",
                "024",
                "025",
                "026",
                "027",
                "028",
                "029",
                "030",
                "031",
                "032",
                "033",
                "034",
                "035",
                "036",
                "037",
                "038",
                "039",
                "040",
                "041",
                "042",
                "043",
                "044",
                "045",
                "046",
                "047",
                "048",
                "049",
                "050",
                "051",
                "052",
                "053",
                "054",
                "055",
                "056",
                "057",
                "058",
                "059",
                "060",
                "061",
                "062",
                "063",
                "064",
                "065",
                "066",
                "067",
                "068",
                "069",
                "070",
                "071",
                "072",
                "073",
                "074",
                "075",
                "076",
                "077",
                "078",
                "079",
                "080",
                "081",
                "082",
                "083",
                "084",
                "085",
                "086",
                "087",
                "088",
                "089",
                "090",
                "091",
                "092",
                "093",
                "094",
                "095",
                "096",
                "097",
                "098",
                "099",
                "100",
                "101",
                "102",
                "103",
                "104",
                "105",
                "106",
                "107",
                "108",
                "109",
                "110",
                "111",
                "112",
                "113",
                "114",
                "115",
                "116",
                "117",
                "118",
                "119",
                "120",
                "121",
                "122",
                "123",
                "124",
                "125",
                "126",
                "127",
                "128",
                "129",
                "130",
                "131",
                "132",
                "133",
                "134",
                "135",
                "136",
                "137",
                "138",
                "139",
                "140",
                "141",
                "142",
                "143",
                "144",
                "145",
                "146",
                "147",
                "148",
                "149",
                "150",
                "151",
                "152",
                "153",
                "154",
                "155",
                "156",
                "157",
                "158",
                "159",
                "160",
                "161",
                "162",
                "163",
                "164",
                "165",
                "166",
                "167",
                "168",
                "169",
                "170",
                "171",
                "172",
                "173",
                "174",
                "175",
                "176",
                "177",
                "178",
                "179",
                "180",
                "181",
                "182",
                "183",
                "184",
                "185",
                "186",
                "187",
                "188",
                "189",
                "190",
                "191",
                "192",
                "193",
                "194",
                "195",
                "196",
                "197",
                "198",
                "199",
                "200",
                "201",
                "202",
                "203",
                "204",
                "205",
                "206",
                "207",
                "208",
                "209",
                "210",
                "211",
                "212",
                "213",
                "214",
                "215",
                "216",
                "217",
                "218",
                "219",
                "220",
                "221",
                "222",
                "223",
                "224",
                "225",
                "226",
                "227",
                "228",
                "229",
                "230",
                "231",
                "232",
                "233",
                "234",
                "235",
                "236",
                "237",
                "238",
                "239",
                "240",
                "241",
                "242",
                "243",
                "244",
                "245",
                "246",
                "247",
                "248",
                "249",
                "250",
                "251",
                "252",
                "253",
                "254",
                "255",
              ]),
              (e.encode = function (e) {
                for (var t = [], r = 0; r < e.length; r++) {
                  t.push(n[e[r]])
                }

                return t.join(" ")
              })
          })((LZUTF8 = LZUTF8 || {})),
          (function (e) {
            var t
            ;((e =
              (t = e.Encoding || (e.Encoding = {})).StorageBinaryString ||
              (t.StorageBinaryString = {})).encode = function (e) {
              return t.BinaryString.encode(e).replace(/\0/g, "耂")
            }),
              (e.decode = function (e) {
                return t.BinaryString.decode(e.replace(/\u8002/g, "\0"))
              })
          })((LZUTF8 = LZUTF8 || {})),
          (function (a) {
            var i, t, r, n
            ;(i = a.Encoding || (a.Encoding = {})),
              ((t = i.UTF8 || (i.UTF8 = {})).encode = function (e) {
                return e && 0 != e.length
                  ? a.runningInNodeJS()
                    ? a.BufferTools.bufferToUint8Array(Buffer.from(e, "utf8"))
                    : t.createNativeTextEncoderAndDecoderIfAvailable()
                    ? r.encode(e)
                    : t.encodeWithJS(e)
                  : new Uint8Array(0)
              }),
              (t.decode = function (e) {
                return e && 0 != e.length
                  ? a.runningInNodeJS()
                    ? a.BufferTools.uint8ArrayToBuffer(e).toString("utf8")
                    : t.createNativeTextEncoderAndDecoderIfAvailable()
                    ? n.decode(e)
                    : t.decodeWithJS(e)
                  : ""
              }),
              (t.encodeWithJS = function (e, t) {
                if (!e || 0 == e.length) return new Uint8Array(0)
                t = t || new Uint8Array(4 * e.length)

                for (var r = 0, n = 0; n < e.length; n++) {
                  var o = i.CodePoint.encodeFromString(e, n)
                  if (o <= 127) t[r++] = o
                  else if (o <= 2047)
                    (t[r++] = 192 | (o >>> 6)), (t[r++] = 128 | (63 & o))
                  else if (o <= 65535)
                    (t[r++] = 224 | (o >>> 12)),
                      (t[r++] = 128 | ((o >>> 6) & 63)),
                      (t[r++] = 128 | (63 & o))
                  else {
                    if (!(o <= 1114111))
                      throw new Error(
                        "Invalid UTF-16 string: Encountered a character unsupported by UTF-8/16 (RFC 3629)"
                      )
                    ;(t[r++] = 240 | (o >>> 18)),
                      (t[r++] = 128 | ((o >>> 12) & 63)),
                      (t[r++] = 128 | ((o >>> 6) & 63)),
                      (t[r++] = 128 | (63 & o)),
                      n++
                  }
                }

                return t.subarray(0, r)
              }),
              (t.decodeWithJS = function (e, t, r) {
                if ((void 0 === t && (t = 0), !e || 0 == e.length)) return ""
                void 0 === r && (r = e.length)

                for (
                  var n, o, i = new a.StringBuilder(), u = t, s = r;
                  u < s;

                ) {
                  if ((o = e[u]) >>> 7 == 0) (n = o), (u += 1)
                  else if (o >>> 5 == 6) {
                    if (r <= u + 1)
                      throw new Error(
                        "Invalid UTF-8 stream: Truncated codepoint sequence encountered at position " +
                          u
                      )
                    ;(n = ((31 & o) << 6) | (63 & e[u + 1])), (u += 2)
                  } else if (o >>> 4 == 14) {
                    if (r <= u + 2)
                      throw new Error(
                        "Invalid UTF-8 stream: Truncated codepoint sequence encountered at position " +
                          u
                      )
                    ;(n =
                      ((15 & o) << 12) |
                      ((63 & e[u + 1]) << 6) |
                      (63 & e[u + 2])),
                      (u += 3)
                  } else {
                    if (o >>> 3 != 30)
                      throw new Error(
                        "Invalid UTF-8 stream: An invalid lead byte value encountered at position " +
                          u
                      )
                    if (r <= u + 3)
                      throw new Error(
                        "Invalid UTF-8 stream: Truncated codepoint sequence encountered at position " +
                          u
                      )
                    ;(n =
                      ((7 & o) << 18) |
                      ((63 & e[u + 1]) << 12) |
                      ((63 & e[u + 2]) << 6) |
                      (63 & e[u + 3])),
                      (u += 4)
                  }
                  i.appendCodePoint(n)
                }

                return i.getOutputString()
              }),
              (t.createNativeTextEncoderAndDecoderIfAvailable = function () {
                return (
                  !!r ||
                  ("function" == typeof TextEncoder &&
                    ((r = new TextEncoder("utf-8")),
                    (n = new TextDecoder("utf-8")),
                    !0))
                )
              })
          })((LZUTF8 = LZUTF8 || {})),
          (function (o) {
            ;(o.compress = function (e, t) {
              if ((void 0 === t && (t = {}), null == e))
                throw new TypeError(
                  "compress: undefined or null input received"
                )
              var r = o.CompressionCommon.detectCompressionSourceEncoding(e)
              return (
                (t = o.ObjectTools.override(
                  {
                    inputEncoding: r,
                    outputEncoding: "ByteArray",
                  },
                  t
                )),
                (e = new o.Compressor().compressBlock(e)),
                o.CompressionCommon.encodeCompressedBytes(e, t.outputEncoding)
              )
            }),
              (o.decompress = function (e, t) {
                if ((void 0 === t && (t = {}), null == e))
                  throw new TypeError(
                    "decompress: undefined or null input received"
                  )
                return (
                  (t = o.ObjectTools.override(
                    {
                      inputEncoding: "ByteArray",
                      outputEncoding: "String",
                    },
                    t
                  )),
                  (e = o.CompressionCommon.decodeCompressedBytes(
                    e,
                    t.inputEncoding
                  )),
                  (e = new o.Decompressor().decompressBlock(e)),
                  o.CompressionCommon.encodeDecompressedBytes(
                    e,
                    t.outputEncoding
                  )
                )
              }),
              (o.compressAsync = function (e, t, r) {
                var n
                null == r && (r = function r() {})

                try {
                  n = o.CompressionCommon.detectCompressionSourceEncoding(e)
                } catch (e) {
                  return void r(void 0, e)
                }

                ;(t = o.ObjectTools.override(
                  {
                    inputEncoding: n,
                    outputEncoding: "ByteArray",
                    useWebWorker: !0,
                    blockSize: 65536,
                  },
                  t
                )),
                  o.enqueueImmediate(function () {
                    ;(t.useWebWorker && o.WebWorker.createGlobalWorkerIfNeeded()
                      ? o.WebWorker
                      : o.AsyncCompressor
                    ).compressAsync(e, t, r)
                  })
              }),
              (o.decompressAsync = function (e, t, r) {
                var n
                null == r && (r = function r() {}),
                  null != e
                    ? ((t = o.ObjectTools.override(
                        {
                          inputEncoding: "ByteArray",
                          outputEncoding: "String",
                          useWebWorker: !0,
                          blockSize: 65536,
                        },
                        t
                      )),
                      (n = o.BufferTools.convertToUint8ArrayIfNeeded(e)),
                      o.EventLoop.enqueueImmediate(function () {
                        t.useWebWorker &&
                        o.WebWorker.createGlobalWorkerIfNeeded()
                          ? o.WebWorker.decompressAsync(n, t, r)
                          : o.AsyncDecompressor.decompressAsync(e, t, r)
                      }))
                    : r(
                        void 0,
                        new TypeError(
                          "decompressAsync: undefined or null input received"
                        )
                      )
              }),
              (o.createCompressionStream = function () {
                return o.AsyncCompressor.createCompressionStream()
              }),
              (o.createDecompressionStream = function () {
                return o.AsyncDecompressor.createDecompressionStream()
              }),
              (o.encodeUTF8 = function (e) {
                return o.Encoding.UTF8.encode(e)
              }),
              (o.decodeUTF8 = function (e) {
                return o.Encoding.UTF8.decode(e)
              }),
              (o.encodeBase64 = function (e) {
                return o.Encoding.Base64.encode(e)
              }),
              (o.decodeBase64 = function (e) {
                return o.Encoding.Base64.decode(e)
              }),
              (o.encodeBinaryString = function (e) {
                return o.Encoding.BinaryString.encode(e)
              }),
              (o.decodeBinaryString = function (e) {
                return o.Encoding.BinaryString.decode(e)
              }),
              (o.encodeStorageBinaryString = function (e) {
                return o.Encoding.StorageBinaryString.encode(e)
              }),
              (o.decodeStorageBinaryString = function (e) {
                return o.Encoding.StorageBinaryString.decode(e)
              })
          })((LZUTF8 = LZUTF8 || {}))
      },
      {
        "readable-stream":
          "../node_modules/readable-stream/readable-browser.js",
        process: "../node_modules/process/browser.js",
        buffer: "../node_modules/buffer/index.js",
      },
    ],
    "papaparse.min.js": [
      function (require, module, exports) {
        var define
        function _typeof(obj) {
          "@babel/helpers - typeof"
          if (
            typeof Symbol === "function" &&
            typeof Symbol.iterator === "symbol"
          ) {
            _typeof = function _typeof(obj) {
              return typeof obj
            }
          } else {
            _typeof = function _typeof(obj) {
              return obj &&
                typeof Symbol === "function" &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? "symbol"
                : typeof obj
            }
          }
          return _typeof(obj)
        }

        /* @license
Papa Parse
v5.3.1
https://github.com/mholt/PapaParse
License: MIT
*/
        !(function (e, t) {
          "function" == typeof define && define.amd
            ? define([], t)
            : "object" ==
                (typeof module === "undefined"
                  ? "undefined"
                  : _typeof(module)) && "undefined" != typeof exports
            ? (module.exports = t())
            : (e.Papa = t())
        })(this, function s() {
          "use strict"

          var f =
            "undefined" != typeof self
              ? self
              : "undefined" != typeof window
              ? window
              : void 0 !== f
              ? f
              : {}
          var n = !f.document && !!f.postMessage,
            o = n && /blob:/i.test((f.location || {}).protocol),
            a = {},
            h = 0,
            b = {
              parse: function parse(e, t) {
                var i = (t = t || {}).dynamicTyping || !1
                M(i) && ((t.dynamicTypingFunction = i), (i = {}))

                if (
                  ((t.dynamicTyping = i),
                  (t.transform = !!M(t.transform) && t.transform),
                  t.worker && b.WORKERS_SUPPORTED)
                ) {
                  var r = (function () {
                    if (!b.WORKERS_SUPPORTED) return !1
                    var e =
                        ((i = f.URL || f.webkitURL || null),
                        (r = s.toString()),
                        b.BLOB_URL ||
                          (b.BLOB_URL = i.createObjectURL(
                            new Blob(["(", r, ")();"], {
                              type: "text/javascript",
                            })
                          ))),
                      t = new f.Worker(e)
                    var i, r
                    return (t.onmessage = _), (t.id = h++), (a[t.id] = t)
                  })()

                  return (
                    (r.userStep = t.step),
                    (r.userChunk = t.chunk),
                    (r.userComplete = t.complete),
                    (r.userError = t.error),
                    (t.step = M(t.step)),
                    (t.chunk = M(t.chunk)),
                    (t.complete = M(t.complete)),
                    (t.error = M(t.error)),
                    delete t.worker,
                    void r.postMessage({
                      input: e,
                      config: t,
                      workerId: r.id,
                    })
                  )
                }

                var n = null
                b.NODE_STREAM_INPUT,
                  "string" == typeof e
                    ? (n = t.download ? new l(t) : new p(t))
                    : !0 === e.readable && M(e.read) && M(e.on)
                    ? (n = new g(t))
                    : ((f.File && e instanceof File) || e instanceof Object) &&
                      (n = new c(t))
                return n.stream(e)
              },
              unparse: function unparse(e, t) {
                var n = !1,
                  _ = !0,
                  m = ",",
                  y = "\r\n",
                  s = '"',
                  a = s + s,
                  i = !1,
                  r = null,
                  o = !1

                !(function () {
                  if ("object" != _typeof(t)) return
                  "string" != typeof t.delimiter ||
                    b.BAD_DELIMITERS.filter(function (e) {
                      return -1 !== t.delimiter.indexOf(e)
                    }).length ||
                    (m = t.delimiter)
                  ;("boolean" == typeof t.quotes ||
                    "function" == typeof t.quotes ||
                    Array.isArray(t.quotes)) &&
                    (n = t.quotes)
                  ;("boolean" != typeof t.skipEmptyLines &&
                    "string" != typeof t.skipEmptyLines) ||
                    (i = t.skipEmptyLines)
                  "string" == typeof t.newline && (y = t.newline)
                  "string" == typeof t.quoteChar && (s = t.quoteChar)
                  "boolean" == typeof t.header && (_ = t.header)

                  if (Array.isArray(t.columns)) {
                    if (0 === t.columns.length)
                      throw new Error("Option columns is empty")
                    r = t.columns
                  }

                  void 0 !== t.escapeChar && (a = t.escapeChar + s)
                  "boolean" == typeof t.escapeFormulae && (o = t.escapeFormulae)
                })()
                var h = new RegExp(j(s), "g")
                "string" == typeof e && (e = JSON.parse(e))

                if (Array.isArray(e)) {
                  if (!e.length || Array.isArray(e[0])) return u(null, e, i)
                  if ("object" == _typeof(e[0]))
                    return u(r || Object.keys(e[0]), e, i)
                } else if ("object" == _typeof(e))
                  return (
                    "string" == typeof e.data && (e.data = JSON.parse(e.data)),
                    Array.isArray(e.data) &&
                      (e.fields || (e.fields = e.meta && e.meta.fields),
                      e.fields ||
                        (e.fields = Array.isArray(e.data[0])
                          ? e.fields
                          : "object" == _typeof(e.data[0])
                          ? Object.keys(e.data[0])
                          : []),
                      Array.isArray(e.data[0]) ||
                        "object" == _typeof(e.data[0]) ||
                        (e.data = [e.data])),
                    u(e.fields || [], e.data || [], i)
                  )

                throw new Error("Unable to serialize unrecognized input")

                function u(e, t, i) {
                  var r = ""
                  "string" == typeof e && (e = JSON.parse(e)),
                    "string" == typeof t && (t = JSON.parse(t))
                  var n = Array.isArray(e) && 0 < e.length,
                    s = !Array.isArray(t[0])

                  if (n && _) {
                    for (var a = 0; a < e.length; a++) {
                      0 < a && (r += m), (r += v(e[a], a))
                    }

                    0 < t.length && (r += y)
                  }

                  for (var o = 0; o < t.length; o++) {
                    var h = n ? e.length : t[o].length,
                      u = !1,
                      f = n ? 0 === Object.keys(t[o]).length : 0 === t[o].length

                    if (
                      (i &&
                        !n &&
                        (u =
                          "greedy" === i
                            ? "" === t[o].join("").trim()
                            : 1 === t[o].length && 0 === t[o][0].length),
                      "greedy" === i && n)
                    ) {
                      for (var d = [], l = 0; l < h; l++) {
                        var c = s ? e[l] : l
                        d.push(t[o][c])
                      }

                      u = "" === d.join("").trim()
                    }

                    if (!u) {
                      for (var p = 0; p < h; p++) {
                        0 < p && !f && (r += m)
                        var g = n && s ? e[p] : p
                        r += v(t[o][g], p)
                      }

                      o < t.length - 1 && (!i || (0 < h && !f)) && (r += y)
                    }
                  }

                  return r
                }

                function v(e, t) {
                  if (null == e) return ""
                  if (e.constructor === Date)
                    return JSON.stringify(e).slice(1, 25)
                  !0 === o &&
                    "string" == typeof e &&
                    null !== e.match(/^[=+\-@].*$/) &&
                    (e = "'" + e)

                  var i = e.toString().replace(h, a),
                    r =
                      ("boolean" == typeof n && n) ||
                      ("function" == typeof n && n(e, t)) ||
                      (Array.isArray(n) && n[t]) ||
                      (function (e, t) {
                        for (var i = 0; i < t.length; i++) {
                          if (-1 < e.indexOf(t[i])) return !0
                        }

                        return !1
                      })(i, b.BAD_DELIMITERS) ||
                      -1 < i.indexOf(m) ||
                      " " === i.charAt(0) ||
                      " " === i.charAt(i.length - 1)

                  return r ? s + i + s : i
                }
              },
            }

          if (
            ((b.RECORD_SEP = String.fromCharCode(30)),
            (b.UNIT_SEP = String.fromCharCode(31)),
            (b.BYTE_ORDER_MARK = "\uFEFF"),
            (b.BAD_DELIMITERS = ["\r", "\n", '"', b.BYTE_ORDER_MARK]),
            (b.WORKERS_SUPPORTED = !n && !!f.Worker),
            (b.NODE_STREAM_INPUT = 1),
            (b.LocalChunkSize = 10485760),
            (b.RemoteChunkSize = 5242880),
            (b.DefaultDelimiter = ","),
            (b.Parser = E),
            (b.ParserHandle = i),
            (b.NetworkStreamer = l),
            (b.FileStreamer = c),
            (b.StringStreamer = p),
            (b.ReadableStreamStreamer = g),
            f.jQuery)
          ) {
            var d = f.jQuery

            d.fn.parse = function (o) {
              var i = o.config || {},
                h = []
              return (
                this.each(function (e) {
                  if (
                    !(
                      "INPUT" === d(this).prop("tagName").toUpperCase() &&
                      "file" === d(this).attr("type").toLowerCase() &&
                      f.FileReader
                    ) ||
                    !this.files ||
                    0 === this.files.length
                  )
                    return !0

                  for (var t = 0; t < this.files.length; t++) {
                    h.push({
                      file: this.files[t],
                      inputElem: this,
                      instanceConfig: d.extend({}, i),
                    })
                  }
                }),
                e(),
                this
              )

              function e() {
                if (0 !== h.length) {
                  var e,
                    t,
                    i,
                    r,
                    n = h[0]

                  if (M(o.before)) {
                    var s = o.before(n.file, n.inputElem)

                    if ("object" == _typeof(s)) {
                      if ("abort" === s.action)
                        return (
                          (e = "AbortError"),
                          (t = n.file),
                          (i = n.inputElem),
                          (r = s.reason),
                          void (
                            M(o.error) &&
                            o.error(
                              {
                                name: e,
                              },
                              t,
                              i,
                              r
                            )
                          )
                        )
                      if ("skip" === s.action) return void u()
                      "object" == _typeof(s.config) &&
                        (n.instanceConfig = d.extend(
                          n.instanceConfig,
                          s.config
                        ))
                    } else if ("skip" === s) return void u()
                  }

                  var a = n.instanceConfig.complete
                  ;(n.instanceConfig.complete = function (e) {
                    M(a) && a(e, n.file, n.inputElem), u()
                  }),
                    b.parse(n.file, n.instanceConfig)
                } else M(o.complete) && o.complete()
              }

              function u() {
                h.splice(0, 1), e()
              }
            }
          }

          function u(e) {
            ;(this._handle = null),
              (this._finished = !1),
              (this._completed = !1),
              (this._halted = !1),
              (this._input = null),
              (this._baseIndex = 0),
              (this._partialLine = ""),
              (this._rowCount = 0),
              (this._start = 0),
              (this._nextChunk = null),
              (this.isFirstChunk = !0),
              (this._completeResults = {
                data: [],
                errors: [],
                meta: {},
              }),
              function (e) {
                var t = w(e)
                ;(t.chunkSize = parseInt(t.chunkSize)),
                  e.step || e.chunk || (t.chunkSize = null)
                ;(this._handle = new i(t)),
                  ((this._handle.streamer = this)._config = t)
              }.call(this, e),
              (this.parseChunk = function (e, t) {
                if (this.isFirstChunk && M(this._config.beforeFirstChunk)) {
                  var i = this._config.beforeFirstChunk(e)

                  void 0 !== i && (e = i)
                }

                ;(this.isFirstChunk = !1), (this._halted = !1)
                var r = this._partialLine + e
                this._partialLine = ""

                var n = this._handle.parse(r, this._baseIndex, !this._finished)

                if (!this._handle.paused() && !this._handle.aborted()) {
                  var s = n.meta.cursor
                  this._finished ||
                    ((this._partialLine = r.substring(s - this._baseIndex)),
                    (this._baseIndex = s)),
                    n && n.data && (this._rowCount += n.data.length)
                  var a =
                    this._finished ||
                    (this._config.preview &&
                      this._rowCount >= this._config.preview)
                  if (o)
                    f.postMessage({
                      results: n,
                      workerId: b.WORKER_ID,
                      finished: a,
                    })
                  else if (M(this._config.chunk) && !t) {
                    if (
                      (this._config.chunk(n, this._handle),
                      this._handle.paused() || this._handle.aborted())
                    )
                      return void (this._halted = !0)
                    ;(n = void 0), (this._completeResults = void 0)
                  }
                  return (
                    this._config.step ||
                      this._config.chunk ||
                      ((this._completeResults.data =
                        this._completeResults.data.concat(n.data)),
                      (this._completeResults.errors =
                        this._completeResults.errors.concat(n.errors)),
                      (this._completeResults.meta = n.meta)),
                    this._completed ||
                      !a ||
                      !M(this._config.complete) ||
                      (n && n.meta.aborted) ||
                      (this._config.complete(
                        this._completeResults,
                        this._input
                      ),
                      (this._completed = !0)),
                    a || (n && n.meta.paused) || this._nextChunk(),
                    n
                  )
                }

                this._halted = !0
              }),
              (this._sendError = function (e) {
                M(this._config.error)
                  ? this._config.error(e)
                  : o &&
                    this._config.error &&
                    f.postMessage({
                      workerId: b.WORKER_ID,
                      error: e,
                      finished: !1,
                    })
              })
          }

          function l(e) {
            var r
            ;(e = e || {}).chunkSize || (e.chunkSize = b.RemoteChunkSize),
              u.call(this, e),
              (this._nextChunk = n
                ? function () {
                    this._readChunk(), this._chunkLoaded()
                  }
                : function () {
                    this._readChunk()
                  }),
              (this.stream = function (e) {
                ;(this._input = e), this._nextChunk()
              }),
              (this._readChunk = function () {
                if (this._finished) this._chunkLoaded()
                else {
                  if (
                    ((r = new XMLHttpRequest()),
                    this._config.withCredentials &&
                      (r.withCredentials = this._config.withCredentials),
                    n ||
                      ((r.onload = v(this._chunkLoaded, this)),
                      (r.onerror = v(this._chunkError, this))),
                    r.open(
                      this._config.downloadRequestBody ? "POST" : "GET",
                      this._input,
                      !n
                    ),
                    this._config.downloadRequestHeaders)
                  ) {
                    var e = this._config.downloadRequestHeaders

                    for (var t in e) {
                      r.setRequestHeader(t, e[t])
                    }
                  }

                  if (this._config.chunkSize) {
                    var i = this._start + this._config.chunkSize - 1
                    r.setRequestHeader(
                      "Range",
                      "bytes=" + this._start + "-" + i
                    )
                  }

                  try {
                    r.send(this._config.downloadRequestBody)
                  } catch (e) {
                    this._chunkError(e.message)
                  }

                  n && 0 === r.status && this._chunkError()
                }
              }),
              (this._chunkLoaded = function () {
                4 === r.readyState &&
                  (r.status < 200 || 400 <= r.status
                    ? this._chunkError()
                    : ((this._start += this._config.chunkSize
                        ? this._config.chunkSize
                        : r.responseText.length),
                      (this._finished =
                        !this._config.chunkSize ||
                        this._start >=
                          (function (e) {
                            var t = e.getResponseHeader("Content-Range")
                            if (null === t) return -1
                            return parseInt(t.substring(t.lastIndexOf("/") + 1))
                          })(r)),
                      this.parseChunk(r.responseText)))
              }),
              (this._chunkError = function (e) {
                var t = r.statusText || e

                this._sendError(new Error(t))
              })
          }

          function c(e) {
            var r, n
            ;(e = e || {}).chunkSize || (e.chunkSize = b.LocalChunkSize),
              u.call(this, e)
            var s = "undefined" != typeof FileReader
            ;(this.stream = function (e) {
              ;(this._input = e),
                (n = e.slice || e.webkitSlice || e.mozSlice),
                s
                  ? (((r = new FileReader()).onload = v(
                      this._chunkLoaded,
                      this
                    )),
                    (r.onerror = v(this._chunkError, this)))
                  : (r = new FileReaderSync()),
                this._nextChunk()
            }),
              (this._nextChunk = function () {
                this._finished ||
                  (this._config.preview &&
                    !(this._rowCount < this._config.preview)) ||
                  this._readChunk()
              }),
              (this._readChunk = function () {
                var e = this._input

                if (this._config.chunkSize) {
                  var t = Math.min(
                    this._start + this._config.chunkSize,
                    this._input.size
                  )
                  e = n.call(e, this._start, t)
                }

                var i = r.readAsText(e, this._config.encoding)
                s ||
                  this._chunkLoaded({
                    target: {
                      result: i,
                    },
                  })
              }),
              (this._chunkLoaded = function (e) {
                ;(this._start += this._config.chunkSize),
                  (this._finished =
                    !this._config.chunkSize || this._start >= this._input.size),
                  this.parseChunk(e.target.result)
              }),
              (this._chunkError = function () {
                this._sendError(r.error)
              })
          }

          function p(e) {
            var i
            u.call(this, (e = e || {})),
              (this.stream = function (e) {
                return (i = e), this._nextChunk()
              }),
              (this._nextChunk = function () {
                if (!this._finished) {
                  var e,
                    t = this._config.chunkSize
                  return (
                    t
                      ? ((e = i.substring(0, t)), (i = i.substring(t)))
                      : ((e = i), (i = "")),
                    (this._finished = !i),
                    this.parseChunk(e)
                  )
                }
              })
          }

          function g(e) {
            u.call(this, (e = e || {}))
            var t = [],
              i = !0,
              r = !1
            ;(this.pause = function () {
              u.prototype.pause.apply(this, arguments), this._input.pause()
            }),
              (this.resume = function () {
                u.prototype.resume.apply(this, arguments), this._input.resume()
              }),
              (this.stream = function (e) {
                ;(this._input = e),
                  this._input.on("data", this._streamData),
                  this._input.on("end", this._streamEnd),
                  this._input.on("error", this._streamError)
              }),
              (this._checkIsFinished = function () {
                r && 1 === t.length && (this._finished = !0)
              }),
              (this._nextChunk = function () {
                this._checkIsFinished(),
                  t.length ? this.parseChunk(t.shift()) : (i = !0)
              }),
              (this._streamData = v(function (e) {
                try {
                  t.push(
                    "string" == typeof e ? e : e.toString(this._config.encoding)
                  ),
                    i &&
                      ((i = !1),
                      this._checkIsFinished(),
                      this.parseChunk(t.shift()))
                } catch (e) {
                  this._streamError(e)
                }
              }, this)),
              (this._streamError = v(function (e) {
                this._streamCleanUp(), this._sendError(e)
              }, this)),
              (this._streamEnd = v(function () {
                this._streamCleanUp(), (r = !0), this._streamData("")
              }, this)),
              (this._streamCleanUp = v(function () {
                this._input.removeListener("data", this._streamData),
                  this._input.removeListener("end", this._streamEnd),
                  this._input.removeListener("error", this._streamError)
              }, this))
          }

          function i(m) {
            var a,
              o,
              h,
              r = Math.pow(2, 53),
              n = -r,
              s = /^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/,
              u =
                /^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$/,
              t = this,
              i = 0,
              f = 0,
              d = !1,
              e = !1,
              l = [],
              c = {
                data: [],
                errors: [],
                meta: {},
              }

            if (M(m.step)) {
              var p = m.step

              m.step = function (e) {
                if (((c = e), _())) g()
                else {
                  if ((g(), 0 === c.data.length)) return
                  ;(i += e.data.length),
                    m.preview && i > m.preview
                      ? o.abort()
                      : ((c.data = c.data[0]), p(c, t))
                }
              }
            }

            function y(e) {
              return "greedy" === m.skipEmptyLines
                ? "" === e.join("").trim()
                : 1 === e.length && 0 === e[0].length
            }

            function g() {
              if (
                (c &&
                  h &&
                  (k(
                    "Delimiter",
                    "UndetectableDelimiter",
                    "Unable to auto-detect delimiting character; defaulted to '" +
                      b.DefaultDelimiter +
                      "'"
                  ),
                  (h = !1)),
                m.skipEmptyLines)
              )
                for (var e = 0; e < c.data.length; e++) {
                  y(c.data[e]) && c.data.splice(e--, 1)
                }
              return (
                _() &&
                  (function () {
                    if (!c) return

                    function e(e, t) {
                      M(m.transformHeader) && (e = m.transformHeader(e, t)),
                        l.push(e)
                    }

                    if (Array.isArray(c.data[0])) {
                      for (var t = 0; _() && t < c.data.length; t++) {
                        c.data[t].forEach(e)
                      }

                      c.data.splice(0, 1)
                    } else c.data.forEach(e)
                  })(),
                (function () {
                  if (!c || (!m.header && !m.dynamicTyping && !m.transform))
                    return c

                  function e(e, t) {
                    var i,
                      r = m.header ? {} : []

                    for (i = 0; i < e.length; i++) {
                      var n = i,
                        s = e[i]
                      m.header && (n = i >= l.length ? "__parsed_extra" : l[i]),
                        m.transform && (s = m.transform(s, n)),
                        (s = v(n, s)),
                        "__parsed_extra" === n
                          ? ((r[n] = r[n] || []), r[n].push(s))
                          : (r[n] = s)
                    }

                    return (
                      m.header &&
                        (i > l.length
                          ? k(
                              "FieldMismatch",
                              "TooManyFields",
                              "Too many fields: expected " +
                                l.length +
                                " fields but parsed " +
                                i,
                              f + t
                            )
                          : i < l.length &&
                            k(
                              "FieldMismatch",
                              "TooFewFields",
                              "Too few fields: expected " +
                                l.length +
                                " fields but parsed " +
                                i,
                              f + t
                            )),
                      r
                    )
                  }

                  var t = 1
                  !c.data.length || Array.isArray(c.data[0])
                    ? ((c.data = c.data.map(e)), (t = c.data.length))
                    : (c.data = e(c.data, 0))
                  m.header && c.meta && (c.meta.fields = l)
                  return (f += t), c
                })()
              )
            }

            function _() {
              return m.header && 0 === l.length
            }

            function v(e, t) {
              return (
                (i = e),
                m.dynamicTypingFunction &&
                  void 0 === m.dynamicTyping[i] &&
                  (m.dynamicTyping[i] = m.dynamicTypingFunction(i)),
                !0 === (m.dynamicTyping[i] || m.dynamicTyping)
                  ? "true" === t ||
                    "TRUE" === t ||
                    ("false" !== t &&
                      "FALSE" !== t &&
                      ((function (e) {
                        if (s.test(e)) {
                          var t = parseFloat(e)
                          if (n < t && t < r) return !0
                        }

                        return !1
                      })(t)
                        ? parseFloat(t)
                        : u.test(t)
                        ? new Date(t)
                        : "" === t
                        ? null
                        : t))
                  : t
              )
              var i
            }

            function k(e, t, i, r) {
              var n = {
                type: e,
                code: t,
                message: i,
              }
              void 0 !== r && (n.row = r), c.errors.push(n)
            }

            ;(this.parse = function (e, t, i) {
              var r = m.quoteChar || '"'
              if (
                (m.newline ||
                  (m.newline = (function (e, t) {
                    e = e.substring(0, 1048576)
                    var i = new RegExp(j(t) + "([^]*?)" + j(t), "gm"),
                      r = (e = e.replace(i, "")).split("\r"),
                      n = e.split("\n"),
                      s = 1 < n.length && n[0].length < r[0].length
                    if (1 === r.length || s) return "\n"

                    for (var a = 0, o = 0; o < r.length; o++) {
                      "\n" === r[o][0] && a++
                    }

                    return a >= r.length / 2 ? "\r\n" : "\r"
                  })(e, r)),
                (h = !1),
                m.delimiter)
              )
                M(m.delimiter) &&
                  ((m.delimiter = m.delimiter(e)),
                  (c.meta.delimiter = m.delimiter))
              else {
                var n = (function (e, t, i, r, n) {
                  var s, a, o, h
                  n = n || [",", "\t", "|", ";", b.RECORD_SEP, b.UNIT_SEP]

                  for (var u = 0; u < n.length; u++) {
                    var f = n[u],
                      d = 0,
                      l = 0,
                      c = 0
                    o = void 0

                    for (
                      var p = new E({
                          comments: r,
                          delimiter: f,
                          newline: t,
                          preview: 10,
                        }).parse(e),
                        g = 0;
                      g < p.data.length;
                      g++
                    ) {
                      if (i && y(p.data[g])) c++
                      else {
                        var _ = p.data[g].length
                        ;(l += _),
                          void 0 !== o
                            ? 0 < _ && ((d += Math.abs(_ - o)), (o = _))
                            : (o = _)
                      }
                    }

                    0 < p.data.length && (l /= p.data.length - c),
                      (void 0 === a || d <= a) &&
                        (void 0 === h || h < l) &&
                        1.99 < l &&
                        ((a = d), (s = f), (h = l))
                  }

                  return {
                    successful: !!(m.delimiter = s),
                    bestDelimiter: s,
                  }
                })(
                  e,
                  m.newline,
                  m.skipEmptyLines,
                  m.comments,
                  m.delimitersToGuess
                )

                n.successful
                  ? (m.delimiter = n.bestDelimiter)
                  : ((h = !0), (m.delimiter = b.DefaultDelimiter)),
                  (c.meta.delimiter = m.delimiter)
              }
              var s = w(m)
              return (
                m.preview && m.header && s.preview++,
                (a = e),
                (o = new E(s)),
                (c = o.parse(a, t, i)),
                g(),
                d
                  ? {
                      meta: {
                        paused: !0,
                      },
                    }
                  : c || {
                      meta: {
                        paused: !1,
                      },
                    }
              )
            }),
              (this.paused = function () {
                return d
              }),
              (this.pause = function () {
                ;(d = !0),
                  o.abort(),
                  (a = M(m.chunk) ? "" : a.substring(o.getCharIndex()))
              }),
              (this.resume = function () {
                t.streamer._halted
                  ? ((d = !1), t.streamer.parseChunk(a, !0))
                  : setTimeout(t.resume, 3)
              }),
              (this.aborted = function () {
                return e
              }),
              (this.abort = function () {
                ;(e = !0),
                  o.abort(),
                  (c.meta.aborted = !0),
                  M(m.complete) && m.complete(c),
                  (a = "")
              })
          }

          function j(e) {
            return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
          }

          function E(e) {
            var S,
              O = (e = e || {}).delimiter,
              x = e.newline,
              I = e.comments,
              T = e.step,
              D = e.preview,
              A = e.fastMode,
              L = (S = void 0 === e.quoteChar ? '"' : e.quoteChar)
            if (
              (void 0 !== e.escapeChar && (L = e.escapeChar),
              ("string" != typeof O || -1 < b.BAD_DELIMITERS.indexOf(O)) &&
                (O = ","),
              I === O)
            )
              throw new Error("Comment character same as delimiter")
            !0 === I
              ? (I = "#")
              : ("string" != typeof I || -1 < b.BAD_DELIMITERS.indexOf(I)) &&
                (I = !1),
              "\n" !== x && "\r" !== x && "\r\n" !== x && (x = "\n")
            var F = 0,
              z = !1
            ;(this.parse = function (r, t, i) {
              if ("string" != typeof r)
                throw new Error("Input must be a string")
              var n = r.length,
                e = O.length,
                s = x.length,
                a = I.length,
                o = M(T),
                h = [],
                u = [],
                f = [],
                d = (F = 0)
              if (!r) return C()

              if (A || (!1 !== A && -1 === r.indexOf(S))) {
                for (var l = r.split(x), c = 0; c < l.length; c++) {
                  if (((f = l[c]), (F += f.length), c !== l.length - 1))
                    F += x.length
                  else if (i) return C()

                  if (!I || f.substring(0, a) !== I) {
                    if (o) {
                      if (((h = []), k(f.split(O)), R(), z)) return C()
                    } else k(f.split(O))

                    if (D && D <= c) return (h = h.slice(0, D)), C(!0)
                  }
                }

                return C()
              }

              for (
                var p = r.indexOf(O, F),
                  g = r.indexOf(x, F),
                  _ = new RegExp(j(L) + j(S), "g"),
                  m = r.indexOf(S, F);
                ;

              ) {
                if (r[F] !== S) {
                  if (I && 0 === f.length && r.substring(F, F + a) === I) {
                    if (-1 === g) return C()
                    ;(F = g + s), (g = r.indexOf(x, F)), (p = r.indexOf(O, F))
                  } else if (-1 !== p && (p < g || -1 === g))
                    f.push(r.substring(F, p)),
                      (F = p + e),
                      (p = r.indexOf(O, F))
                  else {
                    if (-1 === g) break
                    if ((f.push(r.substring(F, g)), w(g + s), o && (R(), z)))
                      return C()
                    if (D && h.length >= D) return C(!0)
                  }
                } else
                  for (m = F, F++; ; ) {
                    if (-1 === (m = r.indexOf(S, m + 1)))
                      return (
                        i ||
                          u.push({
                            type: "Quotes",
                            code: "MissingQuotes",
                            message: "Quoted field unterminated",
                            row: h.length,
                            index: F,
                          }),
                        E()
                      )
                    if (m === n - 1) return E(r.substring(F, m).replace(_, S))

                    if (S !== L || r[m + 1] !== L) {
                      if (S === L || 0 === m || r[m - 1] !== L) {
                        ;-1 !== p && p < m + 1 && (p = r.indexOf(O, m + 1)),
                          -1 !== g && g < m + 1 && (g = r.indexOf(x, m + 1))
                        var y = b(-1 === g ? p : Math.min(p, g))

                        if (r[m + 1 + y] === O) {
                          f.push(r.substring(F, m).replace(_, S)),
                            r[(F = m + 1 + y + e)] !== S &&
                              (m = r.indexOf(S, F)),
                            (p = r.indexOf(O, F)),
                            (g = r.indexOf(x, F))
                          break
                        }

                        var v = b(g)

                        if (r.substring(m + 1 + v, m + 1 + v + s) === x) {
                          if (
                            (f.push(r.substring(F, m).replace(_, S)),
                            w(m + 1 + v + s),
                            (p = r.indexOf(O, F)),
                            (m = r.indexOf(S, F)),
                            o && (R(), z))
                          )
                            return C()
                          if (D && h.length >= D) return C(!0)
                          break
                        }

                        u.push({
                          type: "Quotes",
                          code: "InvalidQuotes",
                          message:
                            "Trailing quote on quoted field is malformed",
                          row: h.length,
                          index: F,
                        }),
                          m++
                      }
                    } else m++
                  }
              }

              return E()

              function k(e) {
                h.push(e), (d = F)
              }

              function b(e) {
                var t = 0

                if (-1 !== e) {
                  var i = r.substring(m + 1, e)
                  i && "" === i.trim() && (t = i.length)
                }

                return t
              }

              function E(e) {
                return (
                  i ||
                    (void 0 === e && (e = r.substring(F)),
                    f.push(e),
                    (F = n),
                    k(f),
                    o && R()),
                  C()
                )
              }

              function w(e) {
                ;(F = e), k(f), (f = []), (g = r.indexOf(x, F))
              }

              function C(e) {
                return {
                  data: h,
                  errors: u,
                  meta: {
                    delimiter: O,
                    linebreak: x,
                    aborted: z,
                    truncated: !!e,
                    cursor: d + (t || 0),
                  },
                }
              }

              function R() {
                T(C()), (h = []), (u = [])
              }
            }),
              (this.abort = function () {
                z = !0
              }),
              (this.getCharIndex = function () {
                return F
              })
          }

          function _(e) {
            var t = e.data,
              i = a[t.workerId],
              r = !1
            if (t.error) i.userError(t.error, t.file)
            else if (t.results && t.results.data) {
              var n = {
                abort: function abort() {
                  ;(r = !0),
                    m(t.workerId, {
                      data: [],
                      errors: [],
                      meta: {
                        aborted: !0,
                      },
                    })
                },
                pause: y,
                resume: y,
              }

              if (M(i.userStep)) {
                for (
                  var s = 0;
                  s < t.results.data.length &&
                  (i.userStep(
                    {
                      data: t.results.data[s],
                      errors: t.results.errors,
                      meta: t.results.meta,
                    },
                    n
                  ),
                  !r);
                  s++
                ) {}

                delete t.results
              } else
                M(i.userChunk) &&
                  (i.userChunk(t.results, n, t.file), delete t.results)
            }
            t.finished && !r && m(t.workerId, t.results)
          }

          function m(e, t) {
            var i = a[e]
            M(i.userComplete) && i.userComplete(t), i.terminate(), delete a[e]
          }

          function y() {
            throw new Error("Not implemented.")
          }

          function w(e) {
            if ("object" != _typeof(e) || null === e) return e
            var t = Array.isArray(e) ? [] : {}

            for (var i in e) {
              t[i] = w(e[i])
            }

            return t
          }

          function v(e, t) {
            return function () {
              e.apply(t, arguments)
            }
          }

          function M(e) {
            return "function" == typeof e
          }

          return (
            o &&
              (f.onmessage = function (e) {
                var t = e.data
                void 0 === b.WORKER_ID && t && (b.WORKER_ID = t.workerId)
                if ("string" == typeof t.input)
                  f.postMessage({
                    workerId: b.WORKER_ID,
                    results: b.parse(t.input, t.config),
                    finished: !0,
                  })
                else if (
                  (f.File && t.input instanceof File) ||
                  t.input instanceof Object
                ) {
                  var i = b.parse(t.input, t.config)
                  i &&
                    f.postMessage({
                      workerId: b.WORKER_ID,
                      results: i,
                      finished: !0,
                    })
                }
              }),
            ((l.prototype = Object.create(u.prototype)).constructor = l),
            ((c.prototype = Object.create(u.prototype)).constructor = c),
            ((p.prototype = Object.create(p.prototype)).constructor = p),
            ((g.prototype = Object.create(u.prototype)).constructor = g),
            b
          )
        })
      },
      {},
    ],
    "courseOverview.js": [
      function (require, module, exports) {
        "use strict"

        Object.defineProperty(exports, "__esModule", {
          value: true,
        })
        exports.default = courseOverview

        function asyncGeneratorStep(
          gen,
          resolve,
          reject,
          _next,
          _throw,
          key,
          arg
        ) {
          try {
            var info = gen[key](arg)
            var value = info.value
          } catch (error) {
            reject(error)
            return
          }
          if (info.done) {
            resolve(value)
          } else {
            Promise.resolve(value).then(_next, _throw)
          }
        }

        function _asyncToGenerator(fn) {
          return function () {
            var self = this,
              args = arguments
            return new Promise(function (resolve, reject) {
              var gen = fn.apply(self, args)
              function _next(value) {
                asyncGeneratorStep(
                  gen,
                  resolve,
                  reject,
                  _next,
                  _throw,
                  "next",
                  value
                )
              }
              function _throw(err) {
                asyncGeneratorStep(
                  gen,
                  resolve,
                  reject,
                  _next,
                  _throw,
                  "throw",
                  err
                )
              }
              _next(undefined)
            })
          }
        }

        function courseOverview(_x) {
          return _courseOverview.apply(this, arguments)
        }

        function _courseOverview() {
          _courseOverview = _asyncToGenerator(
            /*#__PURE__*/ regeneratorRuntime.mark(function _callee(data) {
              var result
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      result = document.createElement("div")

                      result.update = function () {
                        return console.log("Update was called")
                      } // Construct inner DOM

                      data
                        .reduce(function (chapters, curr) {
                          // [{lektion},{lektion}...] -> [[chapter{lektion}], [chapter{lektion}]...]
                          if (!chapters[curr.chapter]) {
                            // Hat der accumulator nicht den index ( vom Chapter)
                            chapters[curr.chapter] = [curr] //dann füge die Lektion in einem Array ein
                          } else {
                            // Ansonsten push die Lektion in den Array vom Index des dazugehörigen Chapters
                            chapters[curr.chapter].push(curr)
                          }

                          return chapters
                        }, [])
                        .forEach(function (chapter, index) {
                          // Erstellung der HTML Elemente
                          var chapterWrapper = document.createElement("div")
                          chapterWrapper.classList.add(
                            "tab_curr-chapter_wrapper"
                          )
                          var title = document.createElement("div")
                          title.classList.add("tab_curr-chapter")
                          var chapterIndicator = document.createElement("div")
                          chapterIndicator.classList.add(
                            "tab_cur-chapter_indc",
                            "shadow-lv2"
                          )
                          chapterIndicator.innerText = "L" + index
                          var lessonsWrapper = document.createElement("div")
                          lessonsWrapper.classList.add("tab_cur-content")
                          chapterWrapper.append(title, lessonsWrapper)
                          chapter.forEach(function (arr) {
                            //For each lesson in chapter
                            var lessonContainer = document.createElement("a")
                            lessonContainer.classList.add(
                              "tab_cur-li",
                              "w-inline-block"
                            )
                            lessonContainer.setAttribute("data-spa-link", true)
                            var url = new URL(window.location.href)
                            url.searchParams.set("view", "watch")
                            url.searchParams.set("lesson", arr.episode)
                            lessonContainer.href = url.href
                            var text = document.createElement("div")
                            text.innerText = arr.name
                            var lesson = document.createElement("div")
                            lesson.classList.add("lesson_episode")
                            lesson.innerText = "Lektion " + arr.episode
                            lessonsWrapper.append(lessonContainer)
                            lessonContainer.append(text)
                          })
                          result.append(chapterWrapper)
                        })
                      return _context.abrupt("return", result)

                    case 4:
                    case "end":
                      return _context.stop()
                  }
                }
              }, _callee)
            })
          )
          return _courseOverview.apply(this, arguments)
        }
      },
      {},
    ],
    "videoView.js": [
      function (require, module, exports) {
        "use strict"

        Object.defineProperty(exports, "__esModule", {
          value: true,
        })
        exports.default = VideoView

        function asyncGeneratorStep(
          gen,
          resolve,
          reject,
          _next,
          _throw,
          key,
          arg
        ) {
          try {
            var info = gen[key](arg)
            var value = info.value
          } catch (error) {
            reject(error)
            return
          }
          if (info.done) {
            resolve(value)
          } else {
            Promise.resolve(value).then(_next, _throw)
          }
        }

        function _asyncToGenerator(fn) {
          return function () {
            var self = this,
              args = arguments
            return new Promise(function (resolve, reject) {
              var gen = fn.apply(self, args)
              function _next(value) {
                asyncGeneratorStep(
                  gen,
                  resolve,
                  reject,
                  _next,
                  _throw,
                  "next",
                  value
                )
              }
              function _throw(err) {
                asyncGeneratorStep(
                  gen,
                  resolve,
                  reject,
                  _next,
                  _throw,
                  "throw",
                  err
                )
              }
              _next(undefined)
            })
          }
        }

        function VideoView(_x, _x2) {
          return _VideoView.apply(this, arguments)
        }

        function _VideoView() {
          _VideoView = _asyncToGenerator(
            /*#__PURE__*/ regeneratorRuntime.mark(function _callee(
              course,
              lesson
            ) {
              var videoWrapper,
                playerOptions,
                lessonData,
                vimeoLink,
                playerDiv,
                videoDesc,
                content
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      videoWrapper = document.createElement("div")
                      videoWrapper.classList.add("lesson_wrapper")
                      playerOptions = {
                        byline: false,
                        title: false,
                        width: "600px",
                        id: "https://vimeo.com/270665447",
                      }
                      _context.next = 5
                      return getCoursesData(course, lesson)

                    case 5:
                      lessonData = _context.sent
                      vimeoLink = lessonData["vimeo_link"]
                      playerOptions.id = vimeoLink
                      playerDiv = document.createElement("div")
                      playerDiv.classList.add("player")
                      videoWrapper.player = new Vimeo.Player(
                        playerDiv,
                        playerOptions
                      )
                      videoDesc = document.createElement("div")
                      videoDesc.classList.add("video_desc")
                      content = '\n    <div class="">\n      <h2>'
                        .concat(
                          lessonData["name"],
                          '</h2>\n      <p class="video_desc">'
                        )
                        .concat(lessonData["text"], "</p>\n    </div>")
                      videoDesc.innerHTML = content
                      videoWrapper.append(playerDiv, videoDesc)
                      return _context.abrupt("return", videoWrapper)

                    case 17:
                    case "end":
                      return _context.stop()
                  }
                }
              }, _callee)
            })
          )
          return _VideoView.apply(this, arguments)
        }
      },
      {},
    ],
    "app.js": [
      function (require, module, exports) {
        "use strict"

        var _lzutf8Min = _interopRequireDefault(require("./lzutf8.min.js"))

        var _papaparseMin = _interopRequireDefault(
          require("./papaparse.min.js")
        )

        var _courseOverview = _interopRequireDefault(
          require("./courseOverview.js")
        )

        var _videoView = _interopRequireDefault(require("./videoView.js"))

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }

        function asyncGeneratorStep(
          gen,
          resolve,
          reject,
          _next,
          _throw,
          key,
          arg
        ) {
          try {
            var info = gen[key](arg)
            var value = info.value
          } catch (error) {
            reject(error)
            return
          }
          if (info.done) {
            resolve(value)
          } else {
            Promise.resolve(value).then(_next, _throw)
          }
        }

        function _asyncToGenerator(fn) {
          return function () {
            var self = this,
              args = arguments
            return new Promise(function (resolve, reject) {
              var gen = fn.apply(self, args)
              function _next(value) {
                asyncGeneratorStep(
                  gen,
                  resolve,
                  reject,
                  _next,
                  _throw,
                  "next",
                  value
                )
              }
              function _throw(err) {
                asyncGeneratorStep(
                  gen,
                  resolve,
                  reject,
                  _next,
                  _throw,
                  "throw",
                  err
                )
              }
              _next(undefined)
            })
          }
        }

        var courseWrapper = document.querySelector(".curriulum_c_wrapper")
        var course = document
          .querySelector("#course_data")
          .getAttribute("data-course")
        window.addEventListener("popstate", function (e) {
          router(window.location.href)
        })
        document.addEventListener("DOMContentLoaded", function () {
          return router(window.location.href)
        })

        function navigateTo(_x) {
          return _navigateTo.apply(this, arguments)
        }

        function _navigateTo() {
          _navigateTo = _asyncToGenerator(
            /*#__PURE__*/ regeneratorRuntime.mark(function _callee(url) {
              var replace,
                stateData,
                _args = arguments
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      replace =
                        _args.length > 1 && _args[1] !== undefined
                          ? _args[1]
                          : false
                      stateData =
                        _args.length > 2 && _args[2] !== undefined
                          ? _args[2]
                          : null
                      history.pushState(null, null, url)
                      router(url)

                    case 4:
                    case "end":
                      return _context.stop()
                  }
                }
              }, _callee)
            })
          )
          return _navigateTo.apply(this, arguments)
        }

        function router(_x2) {
          return _router.apply(this, arguments)
        }

        function _router() {
          _router = _asyncToGenerator(
            /*#__PURE__*/ regeneratorRuntime.mark(function _callee5(url) {
              var queries, routes, queryView, match
              return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                  switch ((_context5.prev = _context5.next)) {
                    case 0:
                      queries = new URL(url).searchParams
                      routes = [
                        {
                          name: "courses",
                          view: (function () {
                            var _view = _asyncToGenerator(
                              /*#__PURE__*/ regeneratorRuntime.mark(
                                function _callee2() {
                                  var data
                                  return regeneratorRuntime.wrap(
                                    function _callee2$(_context2) {
                                      while (1) {
                                        switch (
                                          (_context2.prev = _context2.next)
                                        ) {
                                          case 0:
                                            _context2.next = 2
                                            return getCoursesData(course)

                                          case 2:
                                            data = _context2.sent
                                            _context2.t0 = courseWrapper
                                            _context2.next = 6
                                            return (0, _courseOverview.default)(
                                              data
                                            )

                                          case 6:
                                            _context2.t1 = _context2.sent

                                            _context2.t0.append.call(
                                              _context2.t0,
                                              _context2.t1
                                            )

                                          case 8:
                                          case "end":
                                            return _context2.stop()
                                        }
                                      }
                                    },
                                    _callee2
                                  )
                                }
                              )
                            )

                            function view() {
                              return _view.apply(this, arguments)
                            }

                            return view
                          })(),
                        },
                        {
                          name: "watch",
                          view: (function () {
                            var _view2 = _asyncToGenerator(
                              /*#__PURE__*/ regeneratorRuntime.mark(
                                function _callee3() {
                                  return regeneratorRuntime.wrap(
                                    function _callee3$(_context3) {
                                      while (1) {
                                        switch (
                                          (_context3.prev = _context3.next)
                                        ) {
                                          case 0:
                                            _context3.t0 = courseWrapper
                                            _context3.next = 3
                                            return (0, _videoView.default)(
                                              course,
                                              Number(queries.get("lesson"))
                                            )

                                          case 3:
                                            _context3.t1 = _context3.sent
                                            return _context3.abrupt(
                                              "return",
                                              _context3.t0.append.call(
                                                _context3.t0,
                                                _context3.t1
                                              )
                                            )

                                          case 5:
                                          case "end":
                                            return _context3.stop()
                                        }
                                      }
                                    },
                                    _callee3
                                  )
                                }
                              )
                            )

                            function view() {
                              return _view2.apply(this, arguments)
                            }

                            return view
                          })(),
                        },
                        {
                          name: "notFound",
                          view: (function () {
                            var _view3 = _asyncToGenerator(
                              /*#__PURE__*/ regeneratorRuntime.mark(
                                function _callee4() {
                                  var data, overview
                                  return regeneratorRuntime.wrap(
                                    function _callee4$(_context4) {
                                      while (1) {
                                        switch (
                                          (_context4.prev = _context4.next)
                                        ) {
                                          case 0:
                                            console.log("not found")
                                            _context4.next = 3
                                            return getCoursesData(course)

                                          case 3:
                                            data = _context4.sent
                                            _context4.t0 = courseWrapper
                                            _context4.next = 7
                                            return (0, _courseOverview.default)(
                                              data
                                            )

                                          case 7:
                                            _context4.t1 = _context4.sent
                                            overview =
                                              _context4.t0.appendChild.call(
                                                _context4.t0,
                                                _context4.t1
                                              )
                                            overview.update()

                                          case 10:
                                          case "end":
                                            return _context4.stop()
                                        }
                                      }
                                    },
                                    _callee4
                                  )
                                }
                              )
                            )

                            function view() {
                              return _view3.apply(this, arguments)
                            }

                            return view
                          })(),
                        },
                      ]
                      queryView = queries.get("view")
                      match = queryView // If "view" is set
                        ? // find matching view
                          routes.find(function (route) {
                            return queryView === route.name
                          }) ||
                          routes.find(function (route) {
                            return route.name === "notFound"
                          }) // if not found, use notFound
                        : routes[2] // routes.find((route) => route.view === "courses") // else use courses view

                      courseWrapper.innerHTML = ""
                      match.view()

                    case 6:
                    case "end":
                      return _context5.stop()
                  }
                }
              }, _callee5)
            })
          )
          return _router.apply(this, arguments)
        }

        function getCoursesData(_x3) {
          return _getCoursesData.apply(this, arguments)
        }

        function _getCoursesData() {
          _getCoursesData = _asyncToGenerator(
            /*#__PURE__*/ regeneratorRuntime.mark(function _callee7(course) {
              var lesson,
                localData,
                fetchData,
                _fetchData,
                _args7 = arguments

              return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                  switch ((_context7.prev = _context7.next)) {
                    case 0:
                      _fetchData = function _fetchData3() {
                        _fetchData = _asyncToGenerator(
                          /*#__PURE__*/ regeneratorRuntime.mark(
                            function _callee6(course, lesson) {
                              var result
                              return regeneratorRuntime.wrap(function _callee6$(
                                _context6
                              ) {
                                while (1) {
                                  switch ((_context6.prev = _context6.next)) {
                                    case 0:
                                      _context6.next = 2
                                      return fetch(
                                        "https://mocki.io/v1/3172ef8d-e1b7-4769-b4a0-f22918057fb1",
                                        {
                                          // method: "POST",
                                          // body: JSON.stringify({ //?Re-enable later
                                          //   course: "kurs_1",
                                          // }),
                                        }
                                      )
                                        .then(function (res) {
                                          return res.json()
                                        })
                                        .then(function (json) {
                                          var decompressedCSV =
                                            _lzutf8Min.default.decompress(
                                              json.data.toString(),
                                              {
                                                inputEncoding:
                                                  "StorageBinaryString",
                                              }
                                            )

                                          var parsed =
                                            _papaparseMin.default.parse(
                                              decompressedCSV,
                                              {
                                                header: true,
                                                dynamicTyping: true,
                                              }
                                            )

                                          localStorage.setItem(
                                            course,
                                            JSON.stringify(parsed.data)
                                          )
                                          return parsed.data
                                        })

                                    case 2:
                                      result = _context6.sent
                                      return _context6.abrupt("return", result)

                                    case 4:
                                    case "end":
                                      return _context6.stop()
                                  }
                                }
                              },
                              _callee6)
                            }
                          )
                        )
                        return _fetchData.apply(this, arguments)
                      }

                      fetchData = function _fetchData2(_x4, _x5) {
                        return _fetchData.apply(this, arguments)
                      }

                      lesson =
                        _args7.length > 1 && _args7[1] !== undefined
                          ? _args7[1]
                          : null
                      lesson = lesson ? lesson - 1 : null
                      localData = localStorage.getItem(course)

                      if (!localData) {
                        _context7.next = 10
                        break
                      }

                      fetchData(course, lesson)
                      return _context7.abrupt(
                        "return",
                        lesson != null
                          ? JSON.parse(localData)[lesson]
                          : JSON.parse(localData)
                      )

                    case 10:
                      _context7.next = 12
                      return fetchData(course, lesson)

                    case 12:
                      return _context7.abrupt("return", _context7.sent)

                    case 13:
                    case "end":
                      return _context7.stop()
                  }
                }
              }, _callee7)
            })
          )
          return _getCoursesData.apply(this, arguments)
        }

        document.addEventListener("DOMContentLoaded", function () {
          document.body.addEventListener("click", function (e) {
            if (e.target.matches("[data-spa-link]")) {
              e.preventDefault()
              navigateTo(e.target.href)
            }
          })
        })
        document.querySelector(".lecture_content_main div h1").innerHTML =
          "Yo es geht wieder"
      },
      {
        "./lzutf8.min.js": "lzutf8.min.js",
        "./papaparse.min.js": "papaparse.min.js",
        "./courseOverview.js": "courseOverview.js",
        "./videoView.js": "videoView.js",
      },
    ],
  },
  {},
  ["app.js"],
  null
)
//# sourceMappingURL=https://cdn.jsdelivr.net/gh/Cannovum/cme/dist/cme.js.map
