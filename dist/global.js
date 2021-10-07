// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"loginModal.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createLoginModal;

function createLoginModal() {
  var modalWrapper = document.createElement("div");
  modalWrapper.classList.add("modal_wrapper-" + (Math.random() + 1).toString(36).substring(2));
  var overlay = document.createElement("div");
  overlay.classList.add("modal-overlay");
  var modal = document.createElement("div");
  modal.classList.add("modal");
  var body = document.createElement("div");
  body.classList.add("modal-body");
  body.innerHTML = "<iframe align=\"left\" frameborder=\"0\" scrolling=\"no\" width=\"467\" height=\"231\" name=\"dc_login_iframe\" id=\"dc_login_iframe\" src=\"https://login.doccheck.com/code/de/2000000016834/login_xl/\" ><a href=\"https://login.doccheck.com/code/de/2000000016834/login_xl/\" target=\"_blank\">LOGIN</a></iframe>";
  var closeButton = document.createElement("div");
  closeButton.classList.add("modal-close-button");
  closeButton.dataset.modalCloseButton = true;
  closeButton.innerHTML = "<div class=\"txt_white mr12 text-small\">Schlie\xDFen</div>\n  <img src=\"https://uploads-ssl.webflow.com/60c715a8f0171b333d99d01c/60c715a8f0171b0df599d0c8_ic_round-close%20-white.svg\" loading=\"lazy\" alt=\"\" class=\"w18 h18\">";
  modalWrapper.append(modal, overlay);
  modal.append(closeButton, body);
  overlay.addEventListener("click", function () {
    return closeModal();
  });
  closeButton.addEventListener("click", function () {
    return closeModal();
  }); // * Return

  return modalWrapper; //the modal
  // * Functions

  function closeModal() {
    if (modal == null) {
      console.error("Modal close error");
      console.error(modal);
      return;
    } // modal.classList.remove("active")
    // overlay.classList.remove("active")


    setTimeout(function () {
      return modalWrapper.remove();
    }, 125);
  }
}

function openModal() {
  if (modal == null) {
    console.error("Modal open error");
    console.error(modal);
    return;
  }

  modal.classList.add("active");
  overlay.classList.add("active");
}
},{}],"global.js":[function(require,module,exports) {
"use strict";

var _loginModal = _interopRequireDefault(require("./loginModal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

MemberStack.onReady.then(function (member) {
  // * MS stuff
  if (member.loggedIn) {
    // Redirect
    var redirect = sessionStorage.getItem("redirect");

    if (redirect) {
      console.log("redirect user");
      $(".dc_login-btn").hide();
      sessionStorage.removeItem("redirect");
      window.location.assign(redirect); // Redirect user
    } // Hide login button


    $("[data-dc-login]").hide();
  } else {
    $("[data-dc-logout]").hide();
  } // ? Global click listener for login / logout buttons


  document.body.addEventListener("click", function (e) {
    if (e.target.matches("[data-dc-login]") || e.target.parentNode.matches("[data-dc-login]")) {
      if (e.target.matches("[data-redirect]")) {
        sessionStorage.setItem("redirect", e.target.getAttribute("data-redirect"));
      } else {
        sessionStorage.setItem("redirect", window.location.href);
      }

      e.preventDefault();
      document.body.append((0, _loginModal.default)());
    } else if (e.target.matches("[data-dc-logout]") || e.target.parentNode.matches("[data-dc-logout]")) {
      MemberStack.logout();
    }
  });
});
},{"./loginModal":"loginModal.js"}]},{},["global.js"], null)
//# sourceMappingURL=/global.js.map