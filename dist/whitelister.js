(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["whitelister"] = factory();
	else
		root["whitelister"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _extendableBuiltin(cls) {
  function ExtendableBuiltin() {
    var instance = Reflect.construct(cls, Array.from(arguments));
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    return instance;
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

var _require = __webpack_require__(1),
    isFunc = _require.isFunc;

module.exports.BaseError = function (_extendableBuiltin2) {
  _inherits(_class, _extendableBuiltin2);

  function _class() {
    var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _classCallCheck(this, _class);

    var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this));

    _this.name = 'BaseError';
    _this.message = msg;
    return _this;
  }

  _createClass(_class, [{
    key: 'toJSON',
    value: function toJSON() {
      return {
        message: this.message
      };
    }
  }]);

  return _class;
}(_extendableBuiltin(Error));

module.exports.ArgumentError = function (_module$exports$BaseE) {
  _inherits(_class2, _module$exports$BaseE);

  function _class2(name) {
    var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    _classCallCheck(this, _class2);

    var _this2 = _possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).call(this));

    _this2.name = 'ArgumentError';
    var ending = msg.length > 0 ? ' ' + msg : '';
    _this2.message = '' + name + ending;
    return _this2;
  }

  return _class2;
}(module.exports.BaseError);

module.exports.FieldError = function (_module$exports$BaseE2) {
  _inherits(_class3, _module$exports$BaseE2);

  function _class3(field) {
    var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'is invalid';

    _classCallCheck(this, _class3);

    var _this3 = _possibleConstructorReturn(this, (_class3.__proto__ || Object.getPrototypeOf(_class3)).call(this));

    _this3.name = 'FieldError';
    _this3.field = field;
    _this3.message = message;
    return _this3;
  }

  _createClass(_class3, [{
    key: 'toString',
    value: function toString() {
      return this.field + ' ' + this.message;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        field: this.field,
        message: this.message
      };
    }
  }]);

  return _class3;
}(module.exports.BaseError);

module.exports.WhitelistError = function (_module$exports$BaseE3) {
  _inherits(_class4, _module$exports$BaseE3);

  function _class4() {
    var fieldErrors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    _classCallCheck(this, _class4);

    var _this4 = _possibleConstructorReturn(this, (_class4.__proto__ || Object.getPrototypeOf(_class4)).call(this));

    _this4.name = 'WhitelistError';
    _this4.errors = [];
    _this4.message = '';
    fieldErrors.forEach(function (err) {
      if (err instanceof module.exports.WhitelistError) {
        err.errors.forEach(function (e) {
          _this4.errors.push(e);
        });
        _this4.addToMessage(err.message);
      } else if (isFunc(err.toJSON)) {
        _this4.errors.push(err.toJSON());
        _this4.addToMessage(err.toString());
      } else {
        _this4.errors.push({
          message: err.toString()
        });
        _this4.addToMessage(err.message || err.toString());
      }
    });
    return _this4;
  }

  _createClass(_class4, [{
    key: 'addToMessage',
    value: function addToMessage(msg) {
      if (this.message.length > 0) {
        this.message = this.message + ', ' + msg;
      } else {
        this.message = msg;
      }
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        message: this.message,
        errors: this.errors
      };
    }
  }]);

  return _class4;
}(module.exports.BaseError);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var toString = Object.prototype.toString;

var has = Object.prototype.hasOwnProperty;

var isDefined = function isDefined(obj) {
  return typeof obj !== 'undefined';
};

var isFunc = function isFunc(obj) {
  return toString.call(obj) === '[object Function]';
};

var isString = function isString(obj) {
  return toString.call(obj) === '[object String]';
};

var isObject = function isObject(obj) {
  return toString.call(obj) === '[object Object]';
};

var isNil = function isNil(obj) {
  return !isDefined(obj) || obj === null;
};

var includesOneOf = function includesOneOf(expected, given) {
  var _ref = expected.length < given.length ? [expected, given] : [given, expected],
      _ref2 = _slicedToArray(_ref, 2),
      base = _ref2[0],
      target = _ref2[1];

  return base.some(function (val) {
    return target.includes(val);
  });
};

module.exports = {
  has: has,
  includesOneOf: includesOneOf,
  isDefined: isDefined,
  isFunc: isFunc,
  isNil: isNil,
  isObject: isObject,
  isString: isString
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(3);
module.exports.errors = __webpack_require__(0);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    ArgumentError = _require.ArgumentError,
    FieldError = _require.FieldError,
    WhitelistError = _require.WhitelistError;

var _require2 = __webpack_require__(1),
    has = _require2.has,
    includesOneOf = _require2.includesOneOf,
    isDefined = _require2.isDefined,
    isFunc = _require2.isFunc,
    isNil = _require2.isNil,
    isObject = _require2.isObject,
    isString = _require2.isString;

var filters = {
  config: {
    nestedNames: true
  },

  setConfig: function setConfig() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (isDefined(opts.nestedNames)) {
      filters.config.nestedNames = opts.nestedNames;
    }
  }
};

filters.byRules = function filterByRules(rules, params, parent, areAttributes) {
  if (!isObject(rules) && !isString(rules) && !isFunc(rules)) {
    throw new ArgumentError('rules', 'is not an object or string');
  }

  var errors = [];

  var done = function done(response) {
    if (errors.length > 0) {
      throw new WhitelistError(errors);
    }

    return response;
  };

  function filterByType(type, opts, target) {
    var parentName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    if (!has.call(filters, type)) {
      throw new ArgumentError(parentName + '.' + type, 'is invalid');
    }

    var filter = filters[type];
    var response = void 0;
    try {
      response = filter(opts, target, parentName);
    } catch (error) {
      errors.push(error);
      response = target;
    }
    return response;
  }

  if (isString(rules)) {
    return filterByType(rules, {}, params, parent);
  }

  if (isFunc(rules)) {
    if (!rules(params)) {
      throw new FieldError('' + (parent || 'value'), 'is invalid');
    }
    return params;
  }

  if (has.call(rules, 'type') && !areAttributes) {
    var val = has.call(rules, 'preTransform') && isFunc(rules.preTransform) ? rules.preTransform(params) : params;
    var response = void 0;
    try {
      response = filterByType(rules.type, rules, val, parent);
    } catch (error) {
      errors.push(error);
    }

    return done(response);
  }

  var filteredParams = {};
  Object.keys(rules).forEach(function (name) {
    var rule = rules[name] || {};
    var properName = filters.config.nestedNames && parent ? parent + '[' + name + ']' : name;

    var val = void 0;
    try {
      if (isString(rule) && has.call(params, name)) {
        val = params[name];
        filteredParams[name] = filterByType(rule, {}, val, properName);
      } else if (isFunc(rule)) {
        val = params[name];
        if (!rule(val)) {
          throw new FieldError(properName, 'is invalid');
        }
        filteredParams[name] = val;
      } else if (has.call(params, name) && isDefined(params[name])) {
        val = params[name];
        if (val === null && (rule.allowNull || rule.type === 'null')) {
          filteredParams[name] = val;
        } else if (isNil(val) && rule.required) {
          throw new FieldError(properName, 'is required');
        } else if (!has.call(filters, rule.type) && !isFunc(rule.filterWith)) {
          throw new ArgumentError(properName + '.type', 'is invalid');
        } else {
          if (has.call(rule, 'preTransform') && isFunc(rule.preTransform)) {
            val = rule.preTransform(val, properName);
          }

          if (!isFunc(rule.filterWith)) {
            val = filters[rule.type](rule, val, properName);
          } else if (!rule.filterWith(val, properName)) {
            throw new FieldError(properName, 'is invalid');
          }

          var validValue = function validValue(acceptedValues) {
            return acceptedValues.some(function (acceptedValue) {
              if (typeof acceptedValue === 'function') return acceptedValue(val);
              return acceptedValue === val;
            });
          };

          if (Array.isArray(rule.acceptedValues) && !validValue(rule.acceptedValues)) {
            throw new FieldError(properName, 'must be one of ' + rule.acceptedValues.join(', '));
          }

          filteredParams[name] = has.call(rule, 'postTransform') && isFunc(rule.postTransform) ? rule.postTransform(val, properName) : val;
        }
      } else if (isDefined(rule.default)) {
        filteredParams[name] = rule.default;
      } else if (rule.required) {
        throw new FieldError(properName, 'is required');
      }
    } catch (error) {
      errors.push(error);
    }
  });

  return done(filteredParams);
};

filters.array = function filterArray(rules, target, parentName) {
  var val = isString(target) ? target.split(',').map(function (t) {
    return t.trim();
  }) : target;
  if (isDefined(val) && !Array.isArray(val)) {
    throw new FieldError(parentName, 'is not an array');
  }

  if (isDefined(rules.minLength) && (!isDefined(val) || val.length < rules.minLength)) {
    throw new FieldError(parentName, 'has too few elements (min ' + rules.minLength + ' elements)');
  }

  if (isDefined(rules.maxLength) && isDefined(val) && val.length > rules.maxLength) {
    throw new FieldError(parentName, 'has too many elements (max ' + rules.maxLength + ' elements)');
  }

  var rule = rules.attributes;
  if (isDefined(rule)) {
    return val.map(function (child, i) {
      return filters.byRules(rule, child, parentName + '[' + i + ']');
    });
  }
  return val;
};

filters.boolean = function filterBoolean(rules, target, name) {
  var val = target;
  if (['true', '1', 't'].includes(('' + val).toLowerCase())) {
    val = true;
  } else if (['false', '0', 'f'].includes(('' + val).toLowerCase())) {
    val = false;
  } else if (isDefined(val)) {
    throw new FieldError(name, 'is not true or false');
  }
  return val;
};

filters.email = function filterEmail(rules, target, name) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line

  if (!re.test(target)) throw new FieldError(name, 'is not a valid email address');

  return target;
};

filters.null = function filterNull(rules, target, name) {
  if (target !== null) {
    throw new FieldError(name, 'must be null');
  }
  return target;
};

filters.integer = function filterInteger(rules, target, name) {
  var val = target;
  if (!Number.isInteger(val)) {
    val = parseInt(val, 10);
  }
  if (isNaN(val)) {
    throw new FieldError(name, 'is not an integer');
  }
  if (isDefined(rules.max) && val > rules.max) {
    throw new FieldError(name, 'is too large (max ' + rules.max + ')');
  } else if (isDefined(rules.min) && val < rules.min) {
    throw new FieldError(name, 'is too small (min ' + rules.min + ')');
  }
  return val;
};

filters.float = function filterFloat(rules, target, name) {
  var val = parseFloat(target, 10);
  if (isNaN(val)) throw new FieldError(name, 'is not a float');
  if (isDefined(rules.max) && val > rules.max) {
    throw new FieldError(name, 'is too large (max ' + rules.max + ')');
  } else if (isDefined(rules.min) && val < rules.min) {
    throw new FieldError(name, 'is too small (min ' + rules.min + ')');
  }
  return val;
};

filters.object = function filterObject(rules, target, parentName) {
  if ((isNil(target) || Object.keys(target).length < 1) && rules.required) {
    throw new FieldError(parentName, 'is required');
  }

  if (!isObject(target)) {
    throw new FieldError(parentName, 'is not an object');
  }

  if (Array.isArray(rules.requireOneOf) && !includesOneOf(rules.requireOneOf, Object.keys(target))) {
    var oneOf = rules.requireOneOf.join(', ');
    throw new FieldError(parentName, 'must include one of ' + oneOf);
  }

  if (has.call(rules, 'attributes')) {
    var name = filters.config.nestedNames ? parentName : '';
    return filters.byRules(rules.attributes, target, name, true);
  }

  return target;
};

filters.string = function filterString(rules, target, name) {
  var val = void 0;
  if (isDefined(target)) {
    if (!isString(target)) {
      throw new FieldError(name, 'is not a string');
    }
    val = target.toString();
    if (rules.minLength && val.trim().length < rules.minLength) {
      throw new FieldError(name, 'is too short (min ' + rules.minLength + ' characters)');
    } else if (rules.maxLength && val.trim().length > rules.maxLength) {
      throw new FieldError(name, 'is too long (max ' + rules.maxLength + ' characters)');
    }
    return val;
  }
  if (rules.required && !isDefined(val)) throw new FieldError(name, 'is not a string');
  return val;
};

module.exports = function (rules, target) {
  return new Promise(function (resolve, reject) {
    var error = void 0;
    var response = void 0;
    try {
      response = filters.byRules(rules, target);
    } catch (err) {
      error = err;
    }
    if (error) {
      reject(error);
    } else {
      resolve(response);
    }
  });
};

module.exports.sync = function (rules, target) {
  return filters.byRules(rules, target);
};

module.exports.setConfig = function () {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  filters.setConfig(opts);
};

/***/ })
/******/ ]);
});