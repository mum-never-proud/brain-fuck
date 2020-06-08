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
})({"utils/assert.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assertString = assertString;
exports.assertNumber = assertNumber;
exports.assertObject = assertObject;
exports.assertArray = assertArray;

function assertString(str, name) {
  if (typeof str !== 'string') {
    throw new Error("".concat(name || '', " must be a string").trimLeft());
  }
}

function assertNumber(num, name) {
  if (typeof num !== 'number') {
    throw new Error("".concat(name || '', " must be a number").trimLeft());
  }
}

function assertObject(obj, name) {
  if (!(obj && obj.constructor.name === 'Object')) {
    throw new Error("".concat(name || '', " must be an object").trimLeft());
  }
}

function assertArray(arr, name) {
  if (!(arr && arr.constructor.name === 'Array')) {
    throw new Error("".concat(name || '', " must be an array").trimLeft());
  }
}
},{}],"constants/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MEM_SIZE = exports.MAX_CHAR_VALUE = exports.EXTEND_SIZE = exports.BRAIN_FUCK_CONFIG = void 0;
var MAX_CHAR_VALUE = 256;
exports.MAX_CHAR_VALUE = MAX_CHAR_VALUE;
var EXTEND_SIZE = 10;
exports.EXTEND_SIZE = EXTEND_SIZE;
var MEM_SIZE = 300; // 300 cells

exports.MEM_SIZE = MEM_SIZE;
var BRAIN_FUCK_CONFIG = {
  tokens: ['>', '<', '+', '-', '.', ',', '[', ']'],
  instructions: {
    memoryPointerRight: '>',
    memoryPointerLeft: '<',
    instructionPointerIncrement: '+',
    instructionPointerDecrement: '-',
    output: '.',
    input: ',',
    loopStart: '[',
    loopEnd: ']'
  },
  wordCount: 1,
  splitter: ''
};
exports.BRAIN_FUCK_CONFIG = BRAIN_FUCK_CONFIG;
},{}],"utils/jump.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jumpForward = jumpForward;
exports.jumpBackward = jumpBackward;

var _assert = require("./assert");

function jumpForward(tokens, _iptr) {
  var instructions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  (0, _assert.assertArray)(tokens, 'tokens');
  (0, _assert.assertNumber)(_iptr, 'instruction pointer');
  (0, _assert.assertObject)(instructions, 'instructions');
  var iptr = _iptr,
      openBracketsCount = 1;

  while (openBracketsCount > 0) {
    iptr += instructions.wordCount;

    switch (tokens.slice(iptr, iptr + instructions.wordCount).join(' ')) {
      case instructions.loopStart:
        openBracketsCount++;
        break;

      case instructions.loopEnd:
        openBracketsCount--;
        break;
    }
  }

  return iptr;
}

function jumpBackward(tokens, _iptr, instructions) {
  (0, _assert.assertArray)(tokens, 'tokens');
  (0, _assert.assertNumber)(_iptr, 'instruction pointer');
  (0, _assert.assertObject)(instructions, 'instructions');
  var iptr = _iptr,
      closeBracketsCount = 1;

  while (closeBracketsCount > 0) {
    iptr -= instructions.wordCount;

    switch (tokens.slice(iptr, iptr + instructions.wordCount).join(' ')) {
      case instructions.loopEnd:
        closeBracketsCount++;
        break;

      case instructions.loopStart:
        closeBracketsCount--;
        break;
    }
  }

  return iptr;
}
},{"./assert":"utils/assert.js"}],"utils/santize-program.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _assert = require("./assert");

function _default(program, splitter) {
  var whitelistedWords = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  (0, _assert.assertString)(program, 'program');
  (0, _assert.assertString)(splitter, 'splitter');
  (0, _assert.assertArray)(whitelistedWords, 'whitelisted words');
  return program.replace(/\n/g, '').split(splitter).filter(function (token) {
    return whitelistedWords.includes(token);
  });
}
},{"./assert":"utils/assert.js"}],"utils/converter.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _assert = require("./assert");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _default(program, splitter, from, to) {
  (0, _assert.assertString)(program, 'program');
  (0, _assert.assertString)(splitter, 'splitter');
  (0, _assert.assertObject)(from, 'from');
  (0, _assert.assertObject)(to, 'to');
  var output = '';
  var table = {};
  program.split('').forEach(function (ch) {
    if (table.hasOwnProperty(ch)) {
      output += to[table[ch]] + splitter;
    } else {
      for (var _i = 0, _Object$entries = Object.entries(from); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            key = _Object$entries$_i[0],
            value = _Object$entries$_i[1];

        if (value === ch) {
          table[value] = key;
          output += to[key] + splitter;
          break;
        }
      }
    }
  });
  return output;
}
},{"./assert":"utils/assert.js"}],"brain-fuck.js":[function(require,module,exports) {
"use strict";

var _assert = require("./utils/assert");

var _index = require("./constants/index");

var _jump = require("./utils/jump");

var _santizeProgram = _interopRequireDefault(require("./utils/santize-program"));

var _converter = _interopRequireDefault(require("./utils/converter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BrainFuck = /*#__PURE__*/function () {
  function BrainFuck(program, input) {
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, BrainFuck);

    (0, _assert.assertString)(program, 'program');
    (0, _assert.assertObject)(config, 'config');
    this.program = program;
    this.memory = Array(_index.MEM_SIZE).fill(0);
    this.input = input || '';
    this.output = '';
    this.iptr = 0; // instruction pointer

    this.mptr = 0; // memory pointer

    this.infinite = false;
    this.brainFuckConfig = Object.assign({}, _index.BRAIN_FUCK_CONFIG, config);
  }

  _createClass(BrainFuck, [{
    key: "compile",
    value: function compile() {
      var _this = this;

      var _this$brainFuckConfig = this.brainFuckConfig,
          splitter = _this$brainFuckConfig.splitter,
          tokens = _this$brainFuckConfig.tokens,
          wordCount = _this$brainFuckConfig.wordCount;
      this.tokens = (0, _santizeProgram.default)(this.program, splitter, tokens);

      if (!this.tokens.length) {
        throw new Error('invalid program');
      }

      var _this$brainFuckConfig2 = this.brainFuckConfig.instructions,
          memoryPointerRight = _this$brainFuckConfig2.memoryPointerRight,
          memoryPointerLeft = _this$brainFuckConfig2.memoryPointerLeft,
          instructionPointerIncrement = _this$brainFuckConfig2.instructionPointerIncrement,
          instructionPointerDecrement = _this$brainFuckConfig2.instructionPointerDecrement,
          output = _this$brainFuckConfig2.output,
          input = _this$brainFuckConfig2.input,
          loopStart = _this$brainFuckConfig2.loopStart,
          loopEnd = _this$brainFuckConfig2.loopEnd;

      var fetchInstruction = function fetchInstruction() {
        return _this.tokens.slice(_this.iptr, _this.iptr + wordCount).join(splitter);
      };

      var t1 = performance.now();

      while (this.iptr < this.tokens.length) {
        if (performance.now() - t1 > 20000) {
          // infinite detection, there might be a better way than this :)
          this.infinite = true;
          break;
        }

        switch (fetchInstruction()) {
          case memoryPointerRight:
            if (this.mptr >= this.memory.length - 1) {
              this.memory = this.memory.concat(Array(_index.EXTEND_SIZE).fill(0));
            }

            this.mptr++;
            break;

          case memoryPointerLeft:
            this.mptr = this.mptr - 1 < 0 ? this.mptr : this.mptr - 1;
            break;

          case instructionPointerIncrement:
            this.memory[this.mptr] = (this.memory[this.mptr] + 1) % _index.MAX_CHAR_VALUE;
            break;

          case instructionPointerDecrement:
            var val = this.memory[this.mptr] - 1;

            if (val < 0) {
              val += _index.MAX_CHAR_VALUE * Math.ceil(-val / _index.MAX_CHAR_VALUE);
            }

            this.memory[this.mptr] = val;
            break;

          case output:
            this.output += String.fromCharCode(this.memory[this.mptr]);
            break;

          case input:
            this.memory[this.mptr] = this.input.charCodeAt(0);
            this.input = this.input.slice(1);
            break;

          case loopStart:
            if (!this.memory[this.mptr]) {
              this.iptr = (0, _jump.jumpForward)(this.tokens, this.iptr, {
                loopStart: loopStart,
                loopEnd: loopEnd,
                wordCount: wordCount
              });
            }

            break;

          case loopEnd:
            if (this.memory[this.mptr]) {
              this.iptr = (0, _jump.jumpBackward)(this.tokens, this.iptr, {
                loopStart: loopStart,
                loopEnd: loopEnd,
                wordCount: wordCount
              });
            }

            break;
        }

        this.iptr += wordCount;
      }

      var t2 = performance.now();
      return {
        program: this.program,
        input: this.input,
        output: this.output,
        memory: this.memory,
        compilationTime: t2 - t1,
        infinite: this.infinite
      };
    }
  }, {
    key: "convert",
    value: function convert(program) {
      return (0, _converter.default)(program, this.brainFuckConfig.splitter, _index.BRAIN_FUCK_CONFIG.instructions, this.brainFuckConfig.instructions);
    }
  }]);

  return BrainFuck;
}();

module.exports = BrainFuck;
},{"./utils/assert":"utils/assert.js","./constants/index":"constants/index.js","./utils/jump":"utils/jump.js","./utils/santize-program":"utils/santize-program.js","./utils/converter":"utils/converter.js"}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50981" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","brain-fuck.js"], "$B")
//# sourceMappingURL=/brain-fuck.js.map