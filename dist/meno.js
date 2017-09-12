module.exports =
/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 33);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assert = __webpack_require__(1);

var _assert2 = _interopRequireDefault(_assert);

var _checkType = __webpack_require__(34);

var _checkType2 = _interopRequireDefault(_checkType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Asserts the specified condition and throws a warning if assertion fails.
 * Internal use only.
 *
 * @param {*} value - Value used for the assertion.
 * @param {String|Class} type - Type(s) to evaluate against. If this is a
 *                              string, this method will use 'typeof' operator.
 *                              Otherwise 'instanceof' operator will be used. If
 *                              this parameter is an array, all elements in the
 *                              array will be evaluated against.
 * @param {boolean} [allowUndefined=false] - Specifies whether assertion should
 *                                           pass if the supplied value is
 *                                           undefined.
 * @param {string} [message] - Message to be displayed when assertion fails.
 *
 * @return {boolean} True if assert passed, false otherwise.
 *
 * @throws Error if assert fails.
 *
 * @alias module:meno~helpers.assertType
 */
function assertType(value, type, allowUndefined, message) {
  if (!(0, _assert2.default)(type !== undefined, 'Paremeter \'type\' must be a string or a class')) return;
  if (!(0, _assert2.default)(allowUndefined === undefined || typeof allowUndefined === 'boolean', 'Paremeter \'allowUndefined\', if specified, must be a boolean')) return;
  if (!(0, _assert2.default)(message === undefined || typeof message === 'string', 'Parameter \'message\', if specified, must be a string')) return;

  allowUndefined = allowUndefined === undefined ? false : allowUndefined;

  if (allowUndefined && value === undefined) return true;

  if (type instanceof Array) {
    var n = type.length;

    for (var i = 0; i < n; i++) {
      if ((0, _checkType2.default)(value, type[i])) return true;
    }

    throw new Error(message || 'AssertType failed');
  }

  if ((0, _checkType2.default)(value, type)) return true;

  throw new Error(message || 'AssertType failed');
}

exports.default = assertType;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// © Andrew Wei



/**
 * Asserts the specified condition and throws a warning if assertion fails.
 *
 * @param {boolean} condition - Condition to validate against.
 * @param {string} [message] - Message to be displayed when assertion fails.
 *
 * @return {boolean} True if assert passed, false otherwise.
 *
 * @throws Error is assert fails.
 *
 * @alias module:meno~helpers.assert
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assert failed');
  return condition;
}

exports.default = assert;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assert = __webpack_require__(1);

var _assert2 = _interopRequireDefault(_assert);

var _assertType = __webpack_require__(0);

var _assertType2 = _interopRequireDefault(_assertType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets the global child registry.
 *
 * @param {Node} [element] - Target element.
 * @param {Node} [findClosest] - Specifies whether to keep seeking for a child
 *                               registry upwards in the DOM tree if the
 *                               target element doesn't have one.
 *
 * @return {Object} The child registry.
 *
 * @alias module:meno~dom.getChildRegistry
 */
function getChildRegistry(element, findClosest) {
  (0, _assert2.default)(element === window || element instanceof Node || !element, 'Invalid element specified');
  (0, _assertType2.default)(findClosest, 'boolean', true, 'The parameter \'findClosest\', if specified, must be a boolean value');

  if (!element || element === document || element === document.body) element = window;

  if (element === window) {
    if (!window.__private__) window.__private__ = {};
    if (window.__private__.childRegistry === undefined) window.__private__.childRegistry = {};
  }

  if (element.__private__ && element.__private__.childRegistry) {
    return element.__private__.childRegistry;
  } else if (findClosest === true) {
    return getChildRegistry(element.parentNode);
  } else {
    return null;
  }
}

exports.default = getChildRegistry;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// © Andrew Wei



/**
 * Enum for custom DOM directives/attributes.
 *
 * @readonly
 * @enum {string}
 * @alias module:meno~enums.Directive
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Directive = {
  IS: 'is',

  /**
   * Use this directive for managing DOM element states.
   */
  STATE: 'state',

  /**
   * Use this directive for referencing global shared data.
   */
  REF: 'data-ref',

  /**
   * Use this directive to map any property from the DOM to the controller.
   */
  DATA: 'data-'
};

exports.default = Directive;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

// © Andrew Wei



/**
 * Enum for custom UI dirty types. Dirty types help identify what needs to be
 * redrawn/updated in the UI.
 *
 * @readonly
 * @enum {number}
 * @alias module:meno~enums.DirtyType
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
var DirtyType = {
  /**
   * Indicates that nothing in the UI has changed.
   */
  NONE: 0x00000000,

  /**
   * Indicates that UI element positions have changed.
   */
  POSITION: 1 << 0,

  /**
   * Indicates that UI element sizes have changed.
   */
  SIZE: 1 << 1,
  /**
   * Indicates that UI element layouts have changed.
   */
  LAYOUT: 1 << 2,

  /**
   * Indicates that UI element states have changed.
   */
  STATE: 1 << 3,

  /**
   * Indicates that UI element data has changed.
   */
  DATA: 1 << 4,

  /**
   * Indicates that UI element locale has changed.
   */
  LOCALE: 1 << 5,

  /**
   * Indicates that UI element depths have changed.
   */
  DEPTH: 1 << 6,

  /**
   * Indicates that UI element configurations have changed.
   */
  CONFIG: 1 << 7,

  /**
   * Indicates that UI element styles have changed.
   */
  STYLE: 1 << 8,

  /**
   * Indicates that UI input elements have changed.
   */
  INPUT: 1 << 9,

  /**
   * Indicates that UI element orientations have changed.
   */
  ORIENTATION: 1 << 10,

  /**
   * Indicates that UI element frames have advanced.
   */
  FRAME: 1 << 11,

  /**
   * Indicates that UI element should rerender.
   */
  RENDER: 1 << 12,

  /**
   * Custom type used as a base for creating new types.
   */
  CUSTOM: 1 << 13,

  /**
   * Indicates that everything has changed in the UI.
   */
  ALL: 0xFFFFFFFF,

  /**
   * Gets the name of the dirty type.
   *
   * @param {DirtyType} dirtyType - Dirty type.
   *
   * @return {string} - Name of the dirty type.
   */
  toString: function toString(dirtyType) {
    if (dirtyType === DirtyType.NONE) return 'NONE';
    if (dirtyType >= DirtyType.ALL) return 'ALL';

    var o = '';
    var n = 8 * 4;

    for (var i = 0; i < n; i++) {
      var bit = dirtyType >> i & 1;
      if (bit === 0) continue;
      switch (1 << i) {
        case DirtyType.POSITION:
          o += 'POSITION';break;
        case DirtyType.SIZE:
          o += 'SIZE';break;
        case DirtyType.LAYOUT:
          o += 'LAYOUT';break;
        case DirtyType.STATE:
          o += 'STATE';break;
        case DirtyType.DATA:
          o += 'DATA';break;
        case DirtyType.LOCALE:
          o += 'LOCALE';break;
        case DirtyType.DEPTH:
          o += 'DEPTH';break;
        case DirtyType.CONFIG:
          o += 'CONFIG';break;
        case DirtyType.STYLE:
          o += 'STYLE';break;
        case DirtyType.INPUT:
          o += 'INPUT';break;
        case DirtyType.ORIENTATION:
          o += 'ORIENTATION';break;
        case DirtyType.FRAME:
          o += 'FRAME';break;
        case DirtyType.RENDER:
          o += 'RENDER';break;
        default:
          o += String(1 << i);
      }
    }

    return o;
  }
};

exports.default = DirtyType;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

// © Andrew Wei



/**
 * Gets the element registry.
 *
 * @param {string|Function} [identifier] - Either a tag or the element class to
 *                                         look for. If unspecified the entire
 *                                         registry will be returned.
 *
 * @return {Object} The element registry.
 *
 * @alias module:meno~dom.getElementRegistry
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
function getElementRegistry(identifier) {
  if (!window.__private__) window.__private__ = {};
  if (window.__private__.elementRegistry === undefined) window.__private__.elementRegistry = {};
  if (typeof identifier === 'string') {
    if (!~identifier.indexOf('-')) identifier = identifier + '-element';
    return window.__private__.elementRegistry[identifier];
  }
  if (typeof identifier === 'function') {
    for (var tag in window.__private__.elementRegistry) {
      var Class = window.__private__.elementRegistry[tag];
      if (Class.__proto__ === identifier) return Class;
    }
    return null;
  }
  return window.__private__.elementRegistry;
}

exports.default = getElementRegistry;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getChildRegistry = __webpack_require__(2);

var _getChildRegistry2 = _interopRequireDefault(_getChildRegistry);

var _assertType = __webpack_require__(0);

var _assertType2 = _interopRequireDefault(_assertType);

var _noval = __webpack_require__(7);

var _noval2 = _interopRequireDefault(_noval);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets the a child from the global display tree consisting of all sightread
 * Element instances.
 *
 * @param {Node} [element] - Specifies the parent element instance to fetch the
 *                           child from.
 * @param {string} [name] - Name of the child, depth separated by '.' (i.e.
 *                          'foo.bar'). If unspecified, the entire child list of
 *                          this Element will be returned.
 * @param {boolean} [recursive=true] - Speciifies whether to search for the
 *                                     child recursively down the tree.
 *
 * @return {Node|Array|Object}
 *
 * @alias module:meno~dom.getChild
 */
function getChild() {
  var element = undefined;
  var name = undefined;
  var recursive = undefined;

  var arg1 = arguments[0];
  if (arg1 === window || arg1 === document || arg1 instanceof Node || arg1 === null || arg1 === undefined) element = arg1;else if (typeof arg1 === 'string') name = arg1;else if (typeof arg1 === 'boolean') recursive = arg1;

  var arg2 = arguments[1];
  if (name === undefined && (typeof arg2 === 'string' || arg2 === null || arg2 === undefined)) name = arg2;else if (recursive === undefined && typeof arg2 === 'boolean') recursive = arg2;

  var arg3 = arguments[2];
  if (recursive === undefined && typeof arg3 === 'boolean') recursive = arg3;

  if (!(0, _assertType2.default)(name, 'string', true, 'Child name must be string')) return null;
  if (!(0, _assertType2.default)(recursive, 'boolean', true, 'Parameter \'recursive\', if specified, must be a boolean')) return null;

  var childRegistry = (0, _getChildRegistry2.default)(element);
  if (!childRegistry) return typeof (element || document).querySelector === 'function' ? (element || document).querySelector(name) : null;
  if (!name) return childRegistry;

  recursive = typeof recursive === 'boolean' ? recursive : true;

  var targets = name.split('.');
  var currentTarget = targets.shift();
  var child = childRegistry[currentTarget];

  if (recursive && targets.length > 0) {
    if (child instanceof Array) {
      var children = [];
      var n = child.length;

      for (var i = 0; i < n; i++) {
        children.push(getChild(child[i], targets.join('.'), recursive));
      }return (0, _noval2.default)(children, true) ? null : children;
    } else {
      return getChild(child, targets.join('.'), recursive);
    }
  } else {
    if ((0, _noval2.default)(child, true)) return typeof (element || document).querySelector === 'function' ? (element || document).querySelector(name) : null;
    return child;
  }
}

exports.default = getChild;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _assertType = __webpack_require__(0);

var _assertType2 = _interopRequireDefault(_assertType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Checks if a given value is equal to null. Option to specify recursion, which
 * would further evaluate inner elements, such as when an Array or Object is
 * specified.
 *
 * @param {*} value - Value to evaluate.
 * @param {boolean} [recursive=false] - Specifies whether to recursively
 *                                      evaluate the supplied value's inner
 *                                      values (i.e. an Array or Object).
 *
 * @return {boolean} True if null, false otherwise.
 *
 * @alias module:meno~helpers.noval
 */
function noval(value, recursive) {
  (0, _assertType2.default)(recursive, 'boolean', true, 'Invalid parameter: recursive');

  if (recursive === undefined) recursive = false;

  if (value === undefined || value === null) {
    return true;
  } else if (typeof value === 'string') {
    return value === '';
  } else if (recursive && value instanceof Array) {
    var n = value.length;

    for (var i = 0; i < n; i++) {
      if (!noval(value[i], true)) return false;
    }

    return true;
  } else if (recursive && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.constructor === Object) {
    for (var p in value) {
      if (!noval(value[p], true)) return false;
    }

    return true;
  } else {
    return false;
  }
}

exports.default = noval;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _setAttribute = __webpack_require__(9);

var _setAttribute2 = _interopRequireDefault(_setAttribute);

var _assert = __webpack_require__(1);

var _assert2 = _interopRequireDefault(_assert);

var _assertType = __webpack_require__(0);

var _assertType2 = _interopRequireDefault(_assertType);

var _getInstanceNameFromElement = __webpack_require__(35);

var _getInstanceNameFromElement2 = _interopRequireDefault(_getInstanceNameFromElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Adds a child or an array of children with the same name to the specified
 * child registry.
 *
 * @param {Object} childRegistry - The child registry.
 * @param {Node|Array} child - Either one child element or an array of multiple
 *                             child elements with the same name.
 * @param {string} [name] - Name of the child(ren).
 *
 * @return {boolean} True if the child is successfully added to the child
 *                   registry, false otherwise.
 *
 * @alias module:meno~dom.addToChildRegistry
 */
function addToChildRegistry(childRegistry, child, name) {
  (0, _assertType2.default)(childRegistry, 'object', false, 'Invalid child registry specified');
  (0, _assertType2.default)(child, [Node, Array], false, 'Invalid child(ren) specified');
  (0, _assertType2.default)(name, 'string', true, 'Invalid name specified');

  var inferredName = (0, _getInstanceNameFromElement2.default)(child);

  if (!inferredName) {
    if (typeof name !== 'string' || name === '') return false;
    (0, _setAttribute2.default)(child, 'name', name);
  } else {
    name = inferredName;
  }

  if (childRegistry[name]) childRegistry[name] = [].concat(childRegistry[name], child);else childRegistry[name] = child;

  return true;
}

exports.default = addToChildRegistry;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DirtyType = __webpack_require__(4);

var _DirtyType2 = _interopRequireDefault(_DirtyType);

var _assertType = __webpack_require__(0);

var _assertType2 = _interopRequireDefault(_assertType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Sets an attribute of an element by the attribute name.
 *
 * @param {Node} element - Target element.
 * @param {string} name - Attribute name.
 * @param {*} value - Attribute value.
 *
 * @alias module:meno~dom.setAttribute
 */
function setAttribute(element, name, value) {
  (0, _assertType2.default)(element, Node, false, 'Invalid element specified');
  if (value === undefined || value === null || value === false) element.removeAttribute(name);else if (value === true) element.setAttribute(name, '');else element.setAttribute(name, value);
  if (name === 'disabled' && element.setDirty) element.setDirty(_DirtyType2.default.STATE);
}

exports.default = setAttribute;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assertType = __webpack_require__(0);

var _assertType2 = _interopRequireDefault(_assertType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets an attribute of an element by its name.
 *
 * @param {Node} element - Target element.
 * @param {string} name - Attribute name.
 *
 * @return {string} Attribute value.
 *
 * @alias module:meno~dom.getAttribute
 */
function getAttribute(element, name) {
  (0, _assertType2.default)(element, Node, false, 'Invalid element specified');

  if (!element.getAttribute) return null;

  var value = element.getAttribute(name);
  if (value === '') return true;
  if (value === undefined || value === null) return null;
  try {
    return JSON.parse(value);
  } catch (err) {
    return value;
  }
}

exports.default = getAttribute;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _addToChildRegistry = __webpack_require__(8);

var _addToChildRegistry2 = _interopRequireDefault(_addToChildRegistry);

var _getChildRegistry = __webpack_require__(2);

var _getChildRegistry2 = _interopRequireDefault(_getChildRegistry);

var _assert = __webpack_require__(1);

var _assert2 = _interopRequireDefault(_assert);

var _isCustomElement = __webpack_require__(12);

var _isCustomElement2 = _interopRequireDefault(_isCustomElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Crawls a DOM element, creates a child registry for the element and registers
 * all of its children into the child registry, recursively.
 *
 * @param {Node} [element=document] - Target element for sightreading. By
 *                                    default this will be the document.
 * @param {Object} [childRegistry] - Target child registry to register child
 *                                   elements with. If unspecified it will be
 *                                   inferred from the target element.
 *
 * @alias module:meno~dom.sightread
 */
function sightread(element, childRegistry) {
  if (!element || element === document) element = window;
  if (!childRegistry && !(0, _getChildRegistry2.default)(element)) return;

  // Clear the child registry.
  if (!childRegistry) {
    element.__private__.childRegistry = {};
    childRegistry = (0, _getChildRegistry2.default)(element);
  }

  element = element === window ? document.body : element.shadowRoot ? element.shadowRoot : element;

  (0, _assert2.default)(element, 'Element is invalid. Too early to sightread?');
  var n = element.childNodes.length;

  for (var i = 0; i < n; i++) {
    var e = element.childNodes[i];

    if (!(e instanceof Node)) continue;
    if ((0, _addToChildRegistry2.default)(childRegistry, e)) {
      if (!(0, _isCustomElement2.default)(e)) {
        if (!e.__private__) e.__private__ = {};
        if (!e.__private__.childRegistry) e.__private__.childRegistry = {};
        sightread(e);
      }
    } else {
      sightread(e, childRegistry);
    }
  }
}

exports.default = sightread;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assertType = __webpack_require__(0);

var _assertType2 = _interopRequireDefault(_assertType);

var _getAttribute = __webpack_require__(10);

var _getAttribute2 = _interopRequireDefault(_getAttribute);

var _getElementRegistry = __webpack_require__(5);

var _getElementRegistry2 = _interopRequireDefault(_getElementRegistry);

var _Directive = __webpack_require__(3);

var _Directive2 = _interopRequireDefault(_Directive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Verifies that the specified element is a custom Meno element.
 *
 * @param {Node} element - Target element.
 *
 * @return {boolean} True if recognized as custom Meno element, false
 *                   otherwise.
 *
 * @alias module:meno~helpers.isCustomElement
 */
function isCustomElement(element) {
  (0, _assertType2.default)(element, Node, false, 'Invalid element specified');

  var is = (0, _getAttribute2.default)(element, _Directive2.default.IS);
  var tag = element.tagName.toLowerCase();

  if (is && (0, _getElementRegistry2.default)(is) !== undefined) return true;
  if (tag && (0, _getElementRegistry2.default)(tag) !== undefined) return true;
  return false;
}

exports.default = isCustomElement;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getClassIndex = __webpack_require__(18);

var _getClassIndex2 = _interopRequireDefault(_getClassIndex);

var _assert = __webpack_require__(1);

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Verifies that the specified element(s) has the specified class.
 *
 * @param {Node|Node[]} element - Target element(s).
 * @param {string} className - Class to check.
 *
 * @return {boolean} True if element(s) has given class, false otherwise.
 *
 * @alias module:meno~dom.hasClass
 */
function hasClass(element, className) {
  if (!(0, _assert2.default)(className && typeof className === 'string', 'Invalid class name: ' + className)) return false;

  var elements = [].concat(element);
  var n = elements.length;

  for (var i = 0; i < n; i++) {
    var e = elements[i];
    if ((0, _getClassIndex2.default)(e, className) < 0) return false;
  }

  return true;
}

exports.default = hasClass;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getChildRegistry = __webpack_require__(2);

var _getChildRegistry2 = _interopRequireDefault(_getChildRegistry);

var _assertType = __webpack_require__(0);

var _assertType2 = _interopRequireDefault(_assertType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Removes a child or an array of children with the same name from the specified
 * child registry.
 *
 * @param {Object} childRegistry - The child registry.
 * @param {Node|Array|string} child - Either one child element or an array of
 *                                    multiple child elements with the same name
 *                                    or the name in dot notation.
 *
 * @alias module:meno~dom.removeFromChildRegistry
 */
function removeFromChildRegistry(childRegistry, child) {
  (0, _assertType2.default)(childRegistry, 'object', false, 'Invalid child registry specified');
  (0, _assertType2.default)(child, [Node, Array, 'string'], false, 'Invalid child(ren) or name specified');

  if (typeof child === 'string') {
    var targets = child.split('.');
    var currentTarget = targets.shift();
    var c = childRegistry[currentTarget];

    if (targets.length > 0) {
      if (c instanceof Array) {
        var n = c.length;
        for (var i = 0; i < n; i++) {
          removeFromChildRegistry((0, _getChildRegistry2.default)(c[i]), targets);
        }
      } else {
        removeFromChildRegistry((0, _getChildRegistry2.default)(c), targets);
      }
    } else {
      delete childRegistry[currentTarget];
    }
  } else {
    for (var key in childRegistry) {
      var value = childRegistry[key];

      if (value instanceof Array) {
        var _n = value.length;
        var t = -1;

        for (var _i = 0; _i < _n; _i++) {
          var e = value[_i];

          if (e === child) {
            t = _i;
            break;
          }
        }
        if (~t) value.splice(t, 1);
        if (value.length === 0) delete childRegistry[key];
      } else {
        if (value === child) {
          delete childRegistry[key];
        } else {
          removeFromChildRegistry((0, _getChildRegistry2.default)(child), value);
        }
      }
    }
  }
}

exports.default = removeFromChildRegistry;

/***/ }),
/* 15 */
/***/ (function(module, exports) {

// © Andrew Wei



/**
 * Enum for all node states.
 *
 * @readonly
 * @enum {number}
 * @alias module:meno~enums.NodeState
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
var NodeState = {
  /**
   * Element is instantiated but not initialized yet. This state almost never
   * persists.
   */
  IDLE: 0,

  /**
   * Element is initialized, but not updated yet.
   */
  INITIALIZED: 1,

  /**
   * Element is updated at least once.
   */
  UPDATED: 2,

  /**
   * Element is destroyed.
   */
  DESTROYED: 3,

  /**
   * Gets the name of a node state.
   *
   * @param {NodeState} nodeState - Node state.
   *
   * @return {string} Name of the node state.
   */
  toString: function toString(nodeState) {
    switch (nodeState) {
      case NodeState.IDLE:
        return 'IDLE';
      case NodeState.INITIALIZED:
        return 'INITIALIZED';
      case NodeState.UPDATED:
        return 'UPDATED';
      case NodeState.DESTROYED:
        return 'DESTROYED';
      default:
        return 'UNKNOWN';
    }
  }
};

exports.default = NodeState;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _addToChildRegistry = __webpack_require__(8);

var _addToChildRegistry2 = _interopRequireDefault(_addToChildRegistry);

var _getChildRegistry = __webpack_require__(2);

var _getChildRegistry2 = _interopRequireDefault(_getChildRegistry);

var _sightread = __webpack_require__(11);

var _sightread2 = _interopRequireDefault(_sightread);

var _assertType = __webpack_require__(0);

var _assertType2 = _interopRequireDefault(_assertType);

var _isCustomElement = __webpack_require__(12);

var _isCustomElement2 = _interopRequireDefault(_isCustomElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Adds a child element(s) to an element. By default the added element(s) are
 * appended to the end of the element.
 *
 * @param {Node} [element] - Specifies the element to add the child to.
 * @param {Node|Node[]} child - Single element or an array of elements.
 * @param {string} [name] - The name of the child/children to be added.
 *                          Typically a name is required. If it is not
 *                          specified, this method will attempt to infer the
 *                          name from the provided child/children. This method
 *                          fails if a name cannot be inferred. If there
 *                          exists another child with the same name, the added
 *                          child will be grouped together with the existing
 *                          child.
 * @param {boolean} [prepend=false] - Specifies whether the child is prepended
 *                                    to this element instead of appended.
 *
 * @return {Node|Node[]} The added element(s).
 *
 * @alias module:meno~dom.addChild
 */
function addChild() {
  var element = undefined;
  var child = undefined;
  var name = undefined;
  var prepend = undefined;

  var arg1 = arguments[0];
  if (arg1 === window || arg1 === document || arg1 instanceof Node || arg1 === null || arg1 === undefined) element = arg1;else if (arg1 instanceof Node || arg1 instanceof Array) child = arg1;else throw new Error('Invalid arguments provided');

  var arg2 = arguments[1];
  if (child === undefined && (arg2 instanceof Node || arg2 instanceof Array)) {
    child = arg2;
  } else if (child === undefined && element instanceof Node) {
    child = element;
    element = undefined;
  } else {
    throw new Error('Child must be specified');
  }

  if (child) {
    if (name === undefined && typeof arg2 === 'string') name = arg2;else if (prepend === undefined && typeof arg2 === 'boolean') prepend = arg2;
  }

  var arg3 = arguments[2];
  if (name === undefined && typeof arg3 === 'string') name = arg3;else if (prepend === undefined && typeof arg3 === 'boolean') prepend = arg3;

  var arg4 = arguments[3];
  if (prepend === undefined && typeof arg4 === 'boolean') prepend = arg4;

  (0, _assertType2.default)(child, [Node, Array], false, 'Invalid child specified');
  (0, _assertType2.default)(prepend, 'boolean', true, 'Param \'prepend\' must be a boolean');
  (0, _assertType2.default)(element, Node, true, 'Parameter \'element\', if specified, must be a Node');

  if (typeof prepend !== 'boolean') prepend = false;
  if (!element || element === window || element === document) element = document.body;

  var childRegistry = (0, _getChildRegistry2.default)(element, true);

  if (child instanceof Array) {
    var n = child.length;
    var children = [];

    if (prepend) {
      for (var i = n - 1; i >= 0; i--) {
        children.push(addChild(element, child[i], name, prepend));
      }
    } else {
      for (var _i = 0; _i < n; _i++) {
        children.push(addChild(element, child[_i], name, prepend));
      }
    }

    return children;
  } else {
    if (name) (0, _addToChildRegistry2.default)(childRegistry, child, name);

    if (!(0, _isCustomElement2.default)(child)) (0, _sightread2.default)(child);

    if (element.shadowRoot) element = element.shadowRoot;

    if (prepend) element.insertBefore(child, element.firstChild);else element.appendChild(child);

    return child;
  }
}

exports.default = addChild;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hasClass = __webpack_require__(13);

var _hasClass2 = _interopRequireDefault(_hasClass);

var _assert = __webpack_require__(1);

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Adds class(es) to DOM element(s).
 *
 * @param {Node|Node[]} element - Target element(s).
 * @param {string|string[]} className - Class(es) to add.
 *
 * @alias module:meno~dom.addClass
 */
function addClass(element, className) {
  var elements = [].concat(element);
  var classes = [];
  var n = elements.length;

  if (!(0, _assert2.default)(typeof className === 'string' || className instanceof Array, 'Invalid class name specified. Must be either a string or an array of strings.')) return;

  if (typeof className === 'string') classes.push(className);else classes = className;

  var nClasses = classes.length;

  for (var i = 0; i < n; i++) {
    var e = elements[i];

    for (var j = 0; j < nClasses; j++) {
      var c = classes[j];

      if (!(0, _assert2.default)(typeof c === 'string', 'Invalid class detected: ' + c)) continue;
      if ((0, _hasClass2.default)(e, c)) continue;

      e.className = e.className + (e.className === '' ? '' : ' ') + c;
    }
  }
}

exports.default = addClass;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assertType = __webpack_require__(0);

var _assertType2 = _interopRequireDefault(_assertType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets the index of a specified class in a DOM element,
 *
 * @param {Node} element - Target element.
 * @param {string} className - Target class name.
 *
 * @return {number} Index of given class name. -1 if not found.
 *
 * @alias module:meno~dom.getClassIndex
 */
function getClassIndex(element, className) {
  (0, _assertType2.default)(element, Node, false, 'Invalid element specified');
  (0, _assertType2.default)(className, 'string', false, 'Invalid class name: ' + className);
  var classList = element.className.split(' ');
  return classList.indexOf(className);
}

exports.default = getClassIndex;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getElementRegistry = __webpack_require__(5);

var _getElementRegistry2 = _interopRequireDefault(_getElementRegistry);

var _assertType = __webpack_require__(0);

var _assertType2 = _interopRequireDefault(_assertType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates a DOM element from the provided string.
 *
 * @param {string} value - String describing the DOM element.
 *
 * @return {Node} DOM element.
 *
 * @alias module:meno~dom.createElement
 */
function createElement(value) {
  if (!document) return null;

  (0, _assertType2.default)(value, 'string', true, 'Value must be a string');

  if (value.match(/^([a-z0-9]+-)+[a-z0-9]+$/)) {
    return new ((0, _getElementRegistry2.default)(value))();
  } else {
    var div = document.createElement('div');
    if (value.indexOf('<') !== 0 && value.indexOf('>') !== value.length - 1) value = '<' + value + '>';
    div.innerHTML = value;
    return div.firstChild;
  }
}

exports.default = createElement;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _namespace = __webpack_require__(21);

var _namespace2 = _interopRequireDefault(_namespace);

var _assert = __webpack_require__(1);

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets the data registry or a specific entry inside the data registry.
 *
 * @param {string} [identifier] - The dot notated identifier.
 *
 * @return {Object} The data registry.
 *
 * @alias module:meno~dom.getDataRegistry
 */
function getDataRegistry(identifier) {
  (0, _assert2.default)(!identifier || typeof identifier === 'string', 'Invalid identifier specified: ' + identifier);

  if (!window.__private__) window.__private__ = {};
  if (window.__private__.dataRegistry === undefined) window.__private__.dataRegistry = {};

  if (identifier) return (0, _namespace2.default)(identifier, window.__private__.dataRegistry);else if (identifier === null) return null;else return window.__private__.dataRegistry;
}

exports.default = getDataRegistry;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assertType = __webpack_require__(0);

var _assertType2 = _interopRequireDefault(_assertType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Generates a nested namespace in the specified scope, as described by the dot-
 * notated namespace path.
 *
 * @param {string} [path] - Namespace path with keywords separated by dots.
 * @param {Object|window} [scope=window|{}] - Scope/object to create the nested
 *                                            namespace in. If browser
 *                                            environment is detected, this
 *                                            param will default to window.
 *                                            Otherwise it will be an empty
 *                                            object literal.
 *
 * @return {Object} The generated namespace.
 *
 * @alias module:meno~dom.namespace
 */
function namespace(path, scope) {
  (0, _assertType2.default)(path, 'string', true, 'Invalid parameter: path');
  (0, _assertType2.default)(scope, 'object', true, 'Invalid optional parameter: scope');

  if (!scope) scope = window ? window : {};
  if (path === undefined || path === '') return scope;

  var groups = path.split('.');
  var currentScope = scope;

  for (var i = 0; i < groups.length; i++) {
    currentScope = currentScope[groups[i]] || (currentScope[groups[i]] = {});
  }

  return currentScope;
}

exports.default = namespace;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Directive = __webpack_require__(3);

var _Directive2 = _interopRequireDefault(_Directive);

var _assertType = __webpack_require__(0);

var _assertType2 = _interopRequireDefault(_assertType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets the current state of a DOM element as defined by Directive.STATE.
 *
 * @param {Node} element - Target element.
 *
 * @return {string} State of the target element.
 *
 * @alias module:meno~dom.getState
 */
function getState(element) {
  (0, _assertType2.default)(element, Node, false, 'Invalid element specified');

  var state = element.state || element.getAttribute(_Directive2.default.STATE);

  if (!state || state === '') return null;else return state;
}

exports.default = getState;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assertType = __webpack_require__(0);

var _assertType2 = _interopRequireDefault(_assertType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets the value of an inline CSS rule of a Node by its name.
 *
 * @param {Node} element - Target element.
 * @param {string} key - Name of the CSS rule in camelCase.
 * @param {boolean} [isComputed=false] - Specifies whether the styles are
 *                                       computed.
 * @param {boolean} [isolateUnits=false] - Specifies whether value and units are
 *                                         separated. This affects the return
 *                                         value type.
 *
 * @return {*} Value of the style. If isolateUnits is set to true, this will
 *             return an object containing both 'value' and 'unit' keys.
 *
 * @alias module:meno~dom.getStyle
 */
function getStyle(element, key, isComputed, isolateUnits) {
  (0, _assertType2.default)(element, Node, false, 'Invalid element specified');
  if (typeof isComputed !== 'boolean') isComputed = false;
  if (typeof isolateUnits !== 'boolean') isolateUnits = false;

  var value = isComputed ? window.getComputedStyle(element, null).getPropertyValue(key) : element.style[key];
  var regex = new RegExp('^[+-]?[0-9]+.?([0-9]+)?(px|em|ex|%|in|cm|mm|pt|pc)$', 'i');

  if (value === '') return isolateUnits ? { value: null, unit: null } : null;
  if (!isNaN(Number(value))) return isolateUnits ? { value: Number(value), unit: null } : Number(value);

  if (regex.test(value)) {
    if (isolateUnits) {
      if (value.charAt(value.length - 1) === '%') return { value: Number(value.substr(0, value.length - 1)), unit: value.slice(-1) };
      return { value: Number(value.substr(0, value.length - 2)), unit: value.slice(-2) };
    } else {
      return value;
    }
  }

  return isolateUnits ? { value: value, units: null } : value;
}

exports.default = getStyle;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assertType = __webpack_require__(0);

var _assertType2 = _interopRequireDefault(_assertType);

var _noval = __webpack_require__(7);

var _noval2 = _interopRequireDefault(_noval);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Checks to see if an element has the attribute of the specified name.
 *
 * @param {Node} element - Target element.
 * @param {string} name - Attribute name.
 *
 * @return {boolean} True if attribute with said name exists, false otherwise.
 *
 * @alias module:meno~dom.hasAttribute
 */
function hasAttribute(element, name) {
  (0, _assertType2.default)(element, Node, false, 'Invalid element specified');
  var value = element.getAttribute(name);
  if (value === '') return true;
  return !(0, _noval2.default)(value);
}

exports.default = hasAttribute;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getChild = __webpack_require__(6);

var _getChild2 = _interopRequireDefault(_getChild);

var _assert = __webpack_require__(1);

var _assert2 = _interopRequireDefault(_assert);

var _assertType = __webpack_require__(0);

var _assertType2 = _interopRequireDefault(_assertType);

var _noval = __webpack_require__(7);

var _noval2 = _interopRequireDefault(_noval);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Determines if an element contains the specified child.
 *
 * @param {Node|string} child - A child is a Node. It can also be a string of
 *                              child name(s) separated by '.'.
 * @param {Node} [element] - Specifies the parent Node to fetch the child from.
 *
 * @return {boolean} True if this element has the specified child, false
 *                   otherwise.
 *
 * @alias module:meno~dom.hasChild
 */
function hasChild(child, element) {
  (0, _assert2.default)(child !== undefined, 'Child is undefined');
  (0, _assertType2.default)(element, Node, true, 'Parameter \'element\', if specified, must be a Node');

  if (typeof child === 'string') {
    return !(0, _noval2.default)((0, _getChild2.default)(element, child, true));
  } else {
    if (!element || element === window || element === document) element = document.body;
    if (element.shadowRoot) element = element.shadowRoot;

    while (!(0, _noval2.default)(child) && child !== document) {
      child = child.parentNode;
      if (child === element) return true;
    }

    return false;
  }
}

exports.default = hasChild;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assertType = __webpack_require__(0);

var _assertType2 = _interopRequireDefault(_assertType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Checks to see if a Node has the specified inline CSS rule.
 *
 * @param {Node} element - Target element.
 * @param {string} key - Name of the style.
 *
 * @return {boolean}
 *
 * @alias module:meno~dom.hasStyle
 */
function hasStyle(element, key) {
  (0, _assertType2.default)(element, Node, false, 'Invalid element specified');
  return element.style[key] !== '';
}

exports.default = hasStyle;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _getElementRegistry = __webpack_require__(5);

var _getElementRegistry2 = _interopRequireDefault(_getElementRegistry);

var _assert = __webpack_require__(1);

var _assert2 = _interopRequireDefault(_assert);

var _assertType = __webpack_require__(0);

var _assertType2 = _interopRequireDefault(_assertType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Wraps the native Document.registerElement() and registers a custom element
 * with the DOM while storing it in the registry.
 *
 * @param {string} tagOrClass - <the-tag> of the registered element class or the
 *                              class itself (in this case the second param is
 *                              not needed).
 * @param {Function|Object} options - Either a class to base the element on or
 *                                    an object literal containing additional
 *                                    options of the registration.
 * @param {Class} [options.prototype] - Element class prototype to base the
 *                                      custom element on.
 * @param {Class} [options.class] - Element class to base the custom element on,
 *                                  takes priority over prototype.
 * @param {string} [options.extends] - Existing tag to extend.
 *
 * @return {Class} The registered class.
 *
 * @see Document.registerElement()
 *
 * @alias module:meno~dom.register
 */
function register(tagOrClass, options) {
  (0, _assertType2.default)(tagOrClass, ['string', Function], false, 'Invalid tag or class specified');

  var tag = void 0;
  var o = {};

  if (tagOrClass instanceof Function) {
    tag = tagOrClass.tag;
    o = {
      prototype: tagOrClass.prototype,
      extends: tagOrClass.extends
    };
  } else {
    (0, _assertType2.default)(options, ['object', 'function'], false, 'Second param must be a class or an object literal containing at least the \'prototype\' key');

    tag = tagOrClass;

    if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
      (0, _assertType2.default)(options['prototype'], 'function', true, 'Invalid prototype class provided: ' + options['prototype']);
      (0, _assertType2.default)(options['class'], 'function', true, 'Invalid class provided: ' + options['class']);
      (0, _assert2.default)(!options['extends'] || typeof options['extends'] === 'string', true, 'Invalid value specified for options.extends: ' + options['extends']);
    }

    if (typeof options === 'function') {
      o = options;
    } else {
      if (options['class']) o['prototype'] = options['class'].prototype;else if (options['prototype']) o['prototype'] = options['prototype'];

      if (options['extends']) o['extends'] = options['extends'];
    }
  }

  if (tag.indexOf('-') < 0) tag += '-element';
  tag = tag.toLowerCase();

  if (!(0, _getElementRegistry2.default)()[tag]) (0, _getElementRegistry2.default)()[tag] = document.registerElement(tag, o);

  return (0, _getElementRegistry2.default)()[tag];
}

exports.default = register;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getChild = __webpack_require__(6);

var _getChild2 = _interopRequireDefault(_getChild);

var _getChildRegistry = __webpack_require__(2);

var _getChildRegistry2 = _interopRequireDefault(_getChildRegistry);

var _removeFromChildRegistry = __webpack_require__(14);

var _removeFromChildRegistry2 = _interopRequireDefault(_removeFromChildRegistry);

var _assert = __webpack_require__(1);

var _assert2 = _interopRequireDefault(_assert);

var _assertType = __webpack_require__(0);

var _assertType2 = _interopRequireDefault(_assertType);

var _noval = __webpack_require__(7);

var _noval2 = _interopRequireDefault(_noval);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Removes a child element(s) from an element.
 *
 * @param {Node} [element] - Specifies the parent Node to remove the child from.
 * @param {Node|Array|string} child - Child/children to be removed. This can be
 *                                    a Node or array. It can also be a string
 *                                    namespace of the target child/children.
 *
 * @alias module:meno~dom.removeChild
 */
function removeChild() {
  (0, _assert2.default)(arguments.length > 0 && arguments.length < 3, 'removeChild() expects either 1 or 2 arguments');

  var element = undefined;
  var child = undefined;

  if (arguments.length === 1) {
    child = arguments[0];
  } else {
    element = arguments[0];
    child = arguments[1];
  }

  (0, _assertType2.default)(element, Node, true, 'Parameter \'element\', if specified, must be a Node');

  var childRegistry = (0, _getChildRegistry2.default)(element);

  // If child is a string, treat each entry separated by '.' as a child name.
  if (typeof child === 'string') {
    return removeChild(element, (0, _getChild2.default)(element, child, true));
  }
  // If child is an array, remove each element inside recursively.
  else if (child instanceof Array) {
      var a = [];

      // 'child' here is a direct reference to the corresponding key in this
      // element's child registry.
      while (child.length > 0) {
        var c = removeChild(element, child[0]);
        if (c) a.push(c);else c.shift();
      }

      return a;
    }
    // If child is not an array, assume that it is an object that equates or
    // contains a valid DOM element. Remove it accordingly if this element
    // instance is indeed its parent/ancestor.
    else {
        // No valid DOM element found? Terminate.
        if ((0, _noval2.default)(child)) return null;

        (0, _removeFromChildRegistry2.default)(childRegistry, child);
        child.parentNode.removeChild(child);

        return child;
      }
}

exports.default = removeChild;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assert = __webpack_require__(1);

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Removes a class(es) from DOM element(s).
 *
 * @param {Node|Node[]} element - Target element(s).
 * @param {string|string[]} className - Class(es) to remove.
 *
 * @alias module:meno~dom.removeClass
 */
function removeClass(element, className) {
  var elements = [].concat(element);
  var classes = [];
  var n = elements.length;

  if (!(0, _assert2.default)(typeof className === 'string' || className instanceof Array, 'Invalid class name specified. Must be either a string or an array of strings.')) return;

  if (typeof className === 'string') {
    classes.push(className);
  } else {
    classes = className;
  }

  var nClasses = classes.length;

  for (var i = 0; i < n; i++) {
    var e = elements[i];

    for (var j = 0; j < nClasses; j++) {
      var c = classes[j];

      if (!(0, _assert2.default)(typeof c === 'string', 'Invalid class detected: ' + c)) continue;

      var regex = new RegExp('^' + c + '\\s+|\\s+' + c + '|^' + c + '$', 'g');
      e.className = e.className.replace(regex, '');
    }

    if (e.className === '') {
      e.removeAttribute('class');
    }
  }
}

exports.default = removeClass;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assertType = __webpack_require__(0);

var _assertType2 = _interopRequireDefault(_assertType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Sets an inline CSS rule of a Node.
 *
 * @param {Node} element - Target element.
 * @param {string} key - Name of the CSS rule in camelCase.
 * @param {*} value - Value of the style. If a number is provided, it will be
 *                    automatically suffixed with 'px'.
 *
 * @see {@link http://www.w3schools.com/jsref/dom_obj_style.asp}
 *
 * @alias module:meno~dom.setStyle
 */
function setStyle(element, key, value) {
  (0, _assertType2.default)(element, Node, false, 'Invalid element specified');
  if (typeof value === 'number') value = String(value);
  if (value === null || value === undefined) value = '';

  element.style[key] = value;
}

exports.default = setStyle;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventDispatcher2 = __webpack_require__(41);

var _EventDispatcher3 = _interopRequireDefault(_EventDispatcher2);

var _assert = __webpack_require__(1);

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class
 *
 * A queue that enqueues multiple events of event dispatchers and notifies when
 * all enqueued events have been dispatched.
 *
 * @alias module:meno~events.EventQueue
 */
var EventQueue = function (_EventDispatcher) {
  _inherits(EventQueue, _EventDispatcher);

  function EventQueue() {
    _classCallCheck(this, EventQueue);

    return _possibleConstructorReturn(this, (EventQueue.__proto__ || Object.getPrototypeOf(EventQueue)).apply(this, arguments));
  }

  _createClass(EventQueue, [{
    key: 'enqueue',


    /**
     * Adds an event with the specified event dispatcher and event type to the
     * queue.
     *
     * @param  {EventDispatcher} eventDispatcher - EventDispatcher instance to
     *                                             register the event with.
     * @param  {string} eventType - Name of the event to register.
     */
    value: function enqueue(eventDispatcher, eventType) {
      (0, _assert2.default)(typeof eventDispatcher.dispatchEvent === 'function' && typeof eventDispatcher.addEventListener === 'function', 'Not a valid event dispatcher instance');
      (0, _assert2.default)(!this.isWaiting, 'Cannot enqueue when EventQueue instance is already waiting for events');
      if (this.eventPool[eventType] === undefined) this.eventPool[eventType] = [];

      var pool = this.eventPool[eventType];
      pool.forEach(function (event) {
        return (0, _assert2.default)(event.dispatcher !== eventDispatcher, 'The event \'' + eventType + '\' of ' + eventDispatcher + ' is already in the queue');
      });
      pool.push({ dispatcher: eventDispatcher });
    }

    /**
     * Removes an event with the specified event dispatcher and event type from
     * the queue.
     *
     * @param  {EventDispatcher} eventDispatcher - EventDispatcher instance which
     *                                             the event was registered with.
     * @param  {string} eventType - Name of the event which the event was
     *                              registered with.
     */

  }, {
    key: 'dequeue',
    value: function dequeue(eventDispatcher, eventType) {
      (0, _assert2.default)(!this.isWaiting, 'Cannot dequeue when EventQueue instance is already waiting for events');
      var pool = this.eventPool[eventType];
      if (!pool) return;
      var n = pool.length;
      var t = -1;
      for (var i = 0; i < n; i++) {
        if (pool[i].dispatcher === dispatcher) {
          t = i;
          break;
        }
      }
      if (~t) pool.splice(t, 1);
      if (pool.length === 0) delete this.eventPool[eventType];
    }

    /**
     * Starts waiting for queued up events.
     * 
     * @event 'complete' - Dispatched when every queued event is triggered.
     */

  }, {
    key: 'start',
    value: function start() {
      var _this2 = this;

      var _loop = function _loop(eventType) {
        var pool = _this2.eventPool[eventType];
        pool.forEach(function (eventPair) {
          (0, _assert2.default)(eventPair.handler === undefined, 'Handler not supposed to be defined at this point');
          eventPair.handler = function () {
            eventPair.dispatcher.removeEventListener(eventType, eventPair.handler);
            delete eventPair.handler;

            var allDone = true;

            for (var t in _this2.eventPool) {
              var p = _this2.eventPool[t];
              var n = p.length;
              for (var i = 0; i < n; i++) {
                if (p[i].handler) {
                  allDone = false;
                  break;
                }
              }
              if (!allDone) break;
            }

            if (allDone) {
              _this2.kill();
              _this2.dispatchEvent(new CustomEvent('complete'));
            }
          };

          eventPair.dispatcher.addEventListener(eventType, eventPair.handler);
          _this2.__private__.isWaiting = true;
        });
      };

      for (var eventType in this.eventPool) {
        _loop(eventType);
      }

      if (!this.__private__.isWaiting) {
        this.kill();
        this.dispatchEvent(new CustomEvent('complete'));
      }
    }

    /**
     * Kills this EventQueue instance, setting everything for garbage collection.
     */

  }, {
    key: 'kill',
    value: function kill() {
      var _this3 = this;

      var _loop2 = function _loop2(eventType) {
        var pool = _this3.eventPool[eventType];
        pool.forEach(function (eventPair) {
          if (eventPair.handler) eventPair.dispatcher.removeEventListener(eventType, eventPair.handler);
        });
      };

      for (var eventType in this.eventPool) {
        _loop2(eventType);
      }

      delete this.__private__.eventPool;
      this.__private__.isWaiting = false;
    }
  }, {
    key: 'eventPool',

    /**
     * Gets the queued up event pool.
     *
     * @type {Object}
     */
    get: function get() {
      if (this.__private__ === undefined) this.__private__ = {};
      if (this.__private__.eventPool === undefined) this.__private__.eventPool = {};
      return this.__private__.eventPool;
    }

    /**
     * Specifies whether this EventQueue instance is already waiting for queued
     * events.
     *
     * @type {boolean}
     */

  }, {
    key: 'isWaiting',
    get: function get() {
      if (this.__private__ === undefined) this.__private__ = {};
      return this.__private__.isWaiting || false;
    }
  }]);

  return EventQueue;
}(_EventDispatcher3.default);

exports.default = EventQueue;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assertType = __webpack_require__(0);

var _assertType2 = _interopRequireDefault(_assertType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Checks if an object literal has the specified value in one of its keys.
 *
 * @param {Object} object - Target object literal.
 * @param {*} value - Value to check.
 *
 * @return {boolean} True if value is found, false otherwise.
 *
 * @alias module:meno~helpers.hasOwnValue
 */
function hasOwnValue(object, value) {
  (0, _assertType2.default)(object, 'object', false, 'Invalid object specified');

  for (var k in object) {
    if (object.hasOwnProperty(k) && object[k] === value) return true;
  }

  return false;
}

exports.default = hasOwnValue;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

/*! Meno, @license MIT */


var _assert = __webpack_require__(1);

var _assert2 = _interopRequireDefault(_assert);

var _addChild = __webpack_require__(16);

var _addChild2 = _interopRequireDefault(_addChild);

var _addClass = __webpack_require__(17);

var _addClass2 = _interopRequireDefault(_addClass);

var _addToChildRegistry = __webpack_require__(8);

var _addToChildRegistry2 = _interopRequireDefault(_addToChildRegistry);

var _createElement = __webpack_require__(19);

var _createElement2 = _interopRequireDefault(_createElement);

var _getAttribute = __webpack_require__(10);

var _getAttribute2 = _interopRequireDefault(_getAttribute);

var _getChild = __webpack_require__(6);

var _getChild2 = _interopRequireDefault(_getChild);

var _getChildRegistry = __webpack_require__(2);

var _getChildRegistry2 = _interopRequireDefault(_getChildRegistry);

var _getClassIndex = __webpack_require__(18);

var _getClassIndex2 = _interopRequireDefault(_getClassIndex);

var _getDataRegistry = __webpack_require__(20);

var _getDataRegistry2 = _interopRequireDefault(_getDataRegistry);

var _getElementRegistry = __webpack_require__(5);

var _getElementRegistry2 = _interopRequireDefault(_getElementRegistry);

var _getState = __webpack_require__(22);

var _getState2 = _interopRequireDefault(_getState);

var _getStyle = __webpack_require__(23);

var _getStyle2 = _interopRequireDefault(_getStyle);

var _hasAttribute = __webpack_require__(24);

var _hasAttribute2 = _interopRequireDefault(_hasAttribute);

var _hasChild = __webpack_require__(25);

var _hasChild2 = _interopRequireDefault(_hasChild);

var _hasClass = __webpack_require__(13);

var _hasClass2 = _interopRequireDefault(_hasClass);

var _hasStyle = __webpack_require__(26);

var _hasStyle2 = _interopRequireDefault(_hasStyle);

var _namespace = __webpack_require__(21);

var _namespace2 = _interopRequireDefault(_namespace);

var _register = __webpack_require__(27);

var _register2 = _interopRequireDefault(_register);

var _removeChild = __webpack_require__(28);

var _removeChild2 = _interopRequireDefault(_removeChild);

var _removeClass = __webpack_require__(29);

var _removeClass2 = _interopRequireDefault(_removeClass);

var _removeFromChildRegistry = __webpack_require__(14);

var _removeFromChildRegistry2 = _interopRequireDefault(_removeFromChildRegistry);

var _setAttribute = __webpack_require__(9);

var _setAttribute2 = _interopRequireDefault(_setAttribute);

var _setDataRegistry = __webpack_require__(36);

var _setDataRegistry2 = _interopRequireDefault(_setDataRegistry);

var _setState = __webpack_require__(37);

var _setState2 = _interopRequireDefault(_setState);

var _setStyle = __webpack_require__(30);

var _setStyle2 = _interopRequireDefault(_setStyle);

var _sightread = __webpack_require__(11);

var _sightread2 = _interopRequireDefault(_sightread);

var _Directive = __webpack_require__(3);

var _Directive2 = _interopRequireDefault(_Directive);

var _DirtyType = __webpack_require__(4);

var _DirtyType2 = _interopRequireDefault(_DirtyType);

var _NodeState = __webpack_require__(15);

var _NodeState2 = _interopRequireDefault(_NodeState);

var _Element = __webpack_require__(38);

var _Element2 = _interopRequireDefault(_Element);

var _EventQueue = __webpack_require__(31);

var _EventQueue2 = _interopRequireDefault(_EventQueue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import 'webcomponents.js/CustomElements.js';

(0, _assert2.default)(window && document, 'Meno is a front-end web framework where \'window\' and \'document\' must be defined');

/**
 * @module meno
 */
function meno() {
  return arguments.length > 0 ? _register2.default.apply(null, arguments) : _sightread2.default.apply(null, arguments);
}

meno.version = "0.1.0";

meno.Element = _Element2.default;
meno.EventQueue = _EventQueue2.default;

meno.Directive = _Directive2.default;
meno.DirtyType = _DirtyType2.default;
meno.NodeState = _NodeState2.default;

meno.dom = {
  addChild: _addChild2.default,
  addClass: _addClass2.default,
  addToChildRegistry: _addToChildRegistry2.default,
  createElement: _createElement2.default,
  getAttribute: _getAttribute2.default,
  getChild: _getChild2.default,
  getChildRegistry: _getChildRegistry2.default,
  getClassIndex: _getClassIndex2.default,
  getDataRegistry: _getDataRegistry2.default,
  getElementRegistry: _getElementRegistry2.default,
  getState: _getState2.default,
  getStyle: _getStyle2.default,
  hasAttribute: _hasAttribute2.default,
  hasChild: _hasChild2.default,
  hasClass: _hasClass2.default,
  hasStyle: _hasStyle2.default,
  namespace: _namespace2.default,
  register: _register2.default,
  removeChild: _removeChild2.default,
  removeClass: _removeClass2.default,
  removeFromChildRegistry: _removeFromChildRegistry2.default,
  setAttribute: _setAttribute2.default,
  setDataRegistry: _setDataRegistry2.default,
  setState: _setState2.default,
  setStyle: _setStyle2.default,
  sightread: _sightread2.default
};

meno.register = function () {
  return _register2.default.apply(null, arguments);
};

meno();

module.exports = meno;

/***/ }),
/* 34 */
/***/ (function(module, exports) {

// © Andrew Wei



/**
 * Verifies that a given is of the given type.
 *
 * @param {*} value - Any value.
 * @param {*} type  - Any class or string that describes a type.
 *
 * @return {boolean} True if validation passes, false otherwise.
 *
 * @alias module:meno~helpers.checkType
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function checkType(value, type) {
  if (typeof type === 'string') {
    switch (type) {
      case 'string':
      case 'object':
      case 'number':
      case 'boolean':
      case 'function':
        return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === type;
      case 'class':
        return typeof value === 'function';
      case 'array':
        return value.constructor === Array;
      default:
        return false;
    }
  } else {
    return value instanceof type;
  }
}

exports.default = checkType;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getAttribute = __webpack_require__(10);

var _getAttribute2 = _interopRequireDefault(_getAttribute);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets the instance name from a DOM element.
 *
 * @param {Node} element - The DOM element.
 *
 * @return {string} The instance name.
 *
 * @alias module:meno~helpers.getInstanceNameFromElement
 */
function getInstanceNameFromElement(element) {
  var nameFromName = (0, _getAttribute2.default)(element, 'name');

  if (nameFromName !== null && nameFromName !== undefined && nameFromName !== '') return nameFromName;else return null;
}

exports.default = getInstanceNameFromElement;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assertType = __webpack_require__(0);

var _assertType2 = _interopRequireDefault(_assertType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Sets the data registry.
 *
 * @param {Object} data - Sets the data registry.
 *
 * @alias module:meno~dom.setDataRegistry
 */
function setDataRegistry(data) {
  (0, _assertType2.default)(data, 'object', false, 'Invalid data specified');
  if (!window.__private__) window.__private__ = {};
  window.__private__.dataRegistry = data;
}

exports.default = setDataRegistry;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getState = __webpack_require__(22);

var _getState2 = _interopRequireDefault(_getState);

var _Directive = __webpack_require__(3);

var _Directive2 = _interopRequireDefault(_Directive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Sets the state of a DOM element(s) as defined by Directive.STATE.
 *
 * @param {Node|Node[]} element - Target element(s).
 * @param {string} state - New state.
 *
 * @alias module:meno~dom.setState
 */
function setState(element, state) {
  var elements = [].concat(element);

  if (!elements) return;

  var n = elements.length;

  for (var i = 0; i < n; i++) {
    var e = elements[i];

    if ((0, _getState2.default)(e) === state) continue;

    if (e.state !== undefined) {
      e.state = state;
    } else {
      e.setAttribute(_Directive2.default.STATE, state);
    }
  }
}

exports.default = setState;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _ElementUpdateDelegate = __webpack_require__(39);

var _ElementUpdateDelegate2 = _interopRequireDefault(_ElementUpdateDelegate);

var _addChild2 = __webpack_require__(16);

var _addChild3 = _interopRequireDefault(_addChild2);

var _getChild2 = __webpack_require__(6);

var _getChild3 = _interopRequireDefault(_getChild2);

var _hasChild2 = __webpack_require__(25);

var _hasChild3 = _interopRequireDefault(_hasChild2);

var _addClass2 = __webpack_require__(17);

var _addClass3 = _interopRequireDefault(_addClass2);

var _removeClass2 = __webpack_require__(29);

var _removeClass3 = _interopRequireDefault(_removeClass2);

var _hasClass2 = __webpack_require__(13);

var _hasClass3 = _interopRequireDefault(_hasClass2);

var _hasAttribute2 = __webpack_require__(24);

var _hasAttribute3 = _interopRequireDefault(_hasAttribute2);

var _getStyle2 = __webpack_require__(23);

var _getStyle3 = _interopRequireDefault(_getStyle2);

var _setStyle2 = __webpack_require__(30);

var _setStyle3 = _interopRequireDefault(_setStyle2);

var _hasStyle2 = __webpack_require__(26);

var _hasStyle3 = _interopRequireDefault(_hasStyle2);

var _removeChild2 = __webpack_require__(28);

var _removeChild3 = _interopRequireDefault(_removeChild2);

var _getDataRegistry = __webpack_require__(20);

var _getDataRegistry2 = _interopRequireDefault(_getDataRegistry);

var _getChildRegistry = __webpack_require__(2);

var _getChildRegistry2 = _interopRequireDefault(_getChildRegistry);

var _removeFromChildRegistry = __webpack_require__(14);

var _removeFromChildRegistry2 = _interopRequireDefault(_removeFromChildRegistry);

var _createElement = __webpack_require__(19);

var _createElement2 = _interopRequireDefault(_createElement);

var _register = __webpack_require__(27);

var _register2 = _interopRequireDefault(_register);

var _sightread = __webpack_require__(11);

var _sightread2 = _interopRequireDefault(_sightread);

var _Directive = __webpack_require__(3);

var _Directive2 = _interopRequireDefault(_Directive);

var _DirtyType = __webpack_require__(4);

var _DirtyType2 = _interopRequireDefault(_DirtyType);

var _NodeState = __webpack_require__(15);

var _NodeState2 = _interopRequireDefault(_NodeState);

var _EventQueue = __webpack_require__(31);

var _EventQueue2 = _interopRequireDefault(_EventQueue);

var _assert = __webpack_require__(1);

var _assert2 = _interopRequireDefault(_assert);

var _assertType = __webpack_require__(0);

var _assertType2 = _interopRequireDefault(_assertType);

var _defineProperty = __webpack_require__(42);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _getDirectCustomChildren = __webpack_require__(43);

var _getDirectCustomChildren2 = _interopRequireDefault(_getDirectCustomChildren);

var _hasOwnValue = __webpack_require__(32);

var _hasOwnValue2 = _interopRequireDefault(_hasOwnValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class
 *
 * Abstract class of Node/classes that inherited from Node. Note that this class
 * is an abstract class and must be 'mixed' into an real class.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes}
 *
 * @alias module:meno~ui.Element
 */
var Element = function Element(base, tag) {
  return function (_ref) {
    _inherits(_class, _ref);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
      key: 'createdCallback',


      /** 
       * @inheritdoc 
       * @ignore
       */
      value: function createdCallback() {
        // Define instance properties.
        this.__defineProperties__();

        // Check if this Element needs seed data from the data registry.
        this.setData((0, _getDataRegistry2.default)(this.getAttribute(_Directive2.default.REF)));

        // Scan for internal DOM element attributes prefixed with Directive.DATA
        // and generate data properties from them.
        var attributes = this.attributes;
        var nAtributes = attributes.length;
        var regex = new RegExp('^' + _Directive2.default.DATA, 'i');

        for (var i = 0; i < nAtributes; i++) {
          var attribute = attributes[i];

          if ((0, _hasOwnValue2.default)(_Directive2.default, attribute.name) || !regex.test(attribute.name)) continue;

          // Generate camel case property name from the attribute.
          var propertyName = attribute.name.replace(regex, '').replace(/-([a-z])/g, function (g) {
            return g[1].toUpperCase();
          });
          this.setData(propertyName, this.getAttribute(attribute.name), true);
        }

        // Make element invisible until its first update.
        this.setStyle('visibility', 'hidden');
      }

      /** 
       * @inheritdoc 
       * @ignore
       */

    }, {
      key: 'attachedCallback',
      value: function attachedCallback() {
        this.render();
        this.__setNodeState__(_NodeState2.default.INITIALIZED);
        this.updateDelegate.init();
      }

      /** 
       * @inheritdoc 
       * @ignore
       */

    }, {
      key: 'detachedCallback',
      value: function detachedCallback() {
        this.destroy();
        this.removeAllEventListeners();
        this.updateDelegate.destroy();
        this.__setNodeState__(_NodeState2.default.DESTROYED);
      }

      /**
       * Method invoked every time after this element is rendered.
       * 
       * @alias module:meno~ui.Element#init
       */

    }, {
      key: 'init',
      value: function init() {}
      // Needs to be overridden.


      /**
       * Method invoked every time before this element is rerendered.
       * 
       * @alias module:meno~ui.Element#destroy
       */

    }, {
      key: 'destroy',
      value: function destroy() {
        if (this.__private__.eventQueue) this.__private__.eventQueue.kill();
      }

      /**
       * Handler invoked whenever a visual update is required.
       * 
       * @alias module:meno~ui.Element#update
       */

    }, {
      key: 'update',
      value: function update() {
        if (this.nodeState > _NodeState2.default.UPDATED) return;

        if (this.isDirty(_DirtyType2.default.RENDER) && this.nodeState === _NodeState2.default.UPDATED) this.render();

        if (this.nodeState < _NodeState2.default.UPDATED) {
          this.__setNodeState__(_NodeState2.default.UPDATED);
          this.invisible = this.invisible === undefined ? false : this.invisible;
        }
      }

      /**
       * Renders the template of this element instance.
       * 
       * @alias module:meno~ui.Element#render
       */

    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        if (this.nodeState === _NodeState2.default.UPDATED) this.destroy();

        var d = {
          data: this.data,
          state: this.state,
          name: this.name
        };

        var t = this.template(d);
        if (typeof t === 'string') t = (0, _createElement2.default)(t);

        (0, _assert2.default)(!t || t instanceof Node, 'Element generated from template() must be a Node instance');

        if (t) {
          if (t instanceof HTMLTemplateElement) {
            t = document.importNode(t.content, true);

            // TODO: Add support for shadow DOM in the future when it's easier to style.
            if (false) {
              try {
                if (!this.shadowRoot) this.createShadowRoot();
                while (this.shadowRoot.lastChild) {
                  this.shadowRoot.removeChild(this.shadowRoot.lastChild);
                }this.shadowRoot.appendChild(t);
              } catch (err) {}
            } else {
              while (this.lastChild) {
                this.removeChild(this.lastChild);
              }this.appendChild(t);
            }
          } else {
            var n = t.childNodes.length;

            while (this.lastChild) {
              this.removeChild(this.lastChild);
            }for (var i = 0; i < n; i++) {
              var node = document.importNode(t.childNodes[i], true);
              this.appendChild(node);
            }
          }
        }

        (0, _sightread2.default)(this);

        var customChildren = (0, _getDirectCustomChildren2.default)(this, true);

        if (this.__private__.eventQueue) {
          this.__private__.eventQueue.removeAllEventListeners();
          this.__private__.eventQueue.kill();
        }

        this.__private__.eventQueue = new _EventQueue2.default();

        customChildren.forEach(function (child) {
          if (child.nodeState === undefined || child.nodeState < _NodeState2.default.INITIALIZED) _this2.__private__.eventQueue.enqueue(child, 'nodeinitialize');
        });

        this.__private__.eventQueue.addEventListener('complete', this.init.bind(this));
        this.__private__.eventQueue.start();
      }

      /** 
       * @see module:meno~ui.ElementUpdateDelegate#initResponsiveness 
       * @alias module:meno~ui.Element#respondsTo
       */

    }, {
      key: 'respondsTo',
      value: function respondsTo() {
        this.updateDelegate.initResponsiveness.apply(this.updateDelegate, arguments);
      }

      /** 
       * @see module:meno~dom.addChild 
       * @alias module:meno~ui.Element#addChild
       */

    }, {
      key: 'addChild',
      value: function addChild(child, name, prepend) {
        return (0, _addChild3.default)(this, child, name, prepend);
      }

      /** 
       * @see module:meno~dom.removeChild 
       * @alias module:meno~ui.Element#removeChild
       */

    }, {
      key: 'removeChild',
      value: function removeChild(child) {
        if (child instanceof Node && child.parentNode === this) {
          (0, _removeFromChildRegistry2.default)((0, _getChildRegistry2.default)(this), child);
          return _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'removeChild', this).call(this, child);
        } else {
          return (0, _removeChild3.default)(this, child);
        }
      }

      /** 
       * @see module:meno~dom.getChild 
       * @alias module:meno~ui.Element#getChild
       */

    }, {
      key: 'getChild',
      value: function getChild(name, recursive) {
        return (0, _getChild3.default)(this, name, recursive);
      }

      /** 
       * @see module:meno~dom.hasChild 
       * @alias module:meno~ui.Element#hasChild
       */

    }, {
      key: 'hasChild',
      value: function hasChild(child) {
        return (0, _hasChild3.default)(child, this);
      }

      /** 
       * @see module:meno~dom.addClass 
       * @alias module:meno~ui.Element#addClass
       */

    }, {
      key: 'addClass',
      value: function addClass(className) {
        return (0, _addClass3.default)(this, className);
      }

      /** 
       * @see module:meno~dom.removeClass 
       * @alias module:meno~ui.Element#removeClass
       */

    }, {
      key: 'removeClass',
      value: function removeClass(className) {
        return (0, _removeClass3.default)(this, className);
      }

      /** 
       * @see module:meno~dom.hasClass 
       * @alias module:meno~ui.Element#hasClass
       */

    }, {
      key: 'hasClass',
      value: function hasClass(className) {
        return (0, _hasClass3.default)(this, className);
      }

      /** 
       * @inheritdoc 
       * @ignore
       */

    }, {
      key: 'getAttribute',
      value: function getAttribute(name) {
        var value = _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'getAttribute', this).call(this, name);
        if (value === '') return true;
        if (value === undefined || value === null) return null;
        try {
          return JSON.parse(value);
        } catch (err) {
          return value;
        }
      }

      /** 
       * @inheritdoc 
       * @ignore
       */

    }, {
      key: 'setAttribute',
      value: function setAttribute(name, value) {
        switch (name) {
          case 'name':
            this.name = value;
            break;
          default:
            if (value === undefined || value === null || value === false) this.removeAttribute(name);else if (value === true) _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'setAttribute', this).call(this, name, '');else _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'setAttribute', this).call(this, name, value);
            if (name === 'disabled') this.setDirty(_DirtyType2.default.STATE);
        }
      }

      /** 
       * @see module:meno~dom.hasAttribute 
       * @alias module:meno~ui.Element#hasAttribute
       */

    }, {
      key: 'hasAttribute',
      value: function hasAttribute(name) {
        return (0, _hasAttribute3.default)(this, name);
      }

      /** 
       * @see module:meno~dom.getStyle 
       * @alias module:meno~ui.Element#getStyle
       */

    }, {
      key: 'getStyle',
      value: function getStyle(key, isComputed, isolateUnits) {
        return (0, _getStyle3.default)(this, key, isComputed, isolateUnits);
      }

      /** 
       * @see module:meno~dom.setStyle 
       * @alias module:meno~ui.Element#setStyle
       */

    }, {
      key: 'setStyle',
      value: function setStyle(key, value) {
        return (0, _setStyle3.default)(this, key, value);
      }

      /** 
       * @see module:meno~dom.hasStyle 
       * @alias module:meno~ui.Element#hasStyle
       */

    }, {
      key: 'hasStyle',
      value: function hasStyle(key) {
        return (0, _hasStyle3.default)(this, key);
      }

      /** 
       * @inheritdoc 
       * @ignore
       */

    }, {
      key: 'addEventListener',
      value: function addEventListener() {
        var event = arguments[0];
        var listener = arguments[1];
        var useCapture = arguments[2] || false;

        if (!this.__private__.listenerRegistry[event]) {
          this.__private__.listenerRegistry[event] = [];
        }

        var m = this.__private__.listenerRegistry[event];
        var n = m.length;
        var b = true;

        if (event === 'clickoutside') {
          var l = listener;
          listener = function (event) {
            if (event.target !== this && !this.hasChild(event.target)) {
              l(event);
            }
          }.bind(this);
        }

        for (var i = 0; i < n; i++) {
          var e = m[i];

          if (e.listener === listener) {
            b = false;
            break;
          }
        }

        if (b) {
          m.push({
            listener: listener,
            useCapture: useCapture
          });
        }

        if (event === 'clickoutside') {
          window.addEventListener('click', listener, useCapture);
        } else {
          _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'addEventListener', this).apply(this, arguments);
        }
      }

      /** 
       * @see module:meno~ui.Element#addEventListener 
       * @alias module:meno~ui.Element#on
       */

    }, {
      key: 'on',
      value: function on() {
        this.addEventListener.apply(this, arguments);
      }

      /**
       * Determines if a particular listener (or any listener in the specified
       * event) exist in this Element instance.
       *
       * @param {string} event - Event name.
       * @param {Function} listener - Listener function.
       *
       * @return {boolean}
       * 
       * @alias module:meno~ui.Element#hasEventListener
       */

    }, {
      key: 'hasEventListener',
      value: function hasEventListener(event, listener) {
        if (!this.__private__.listenerRegistry) return false;
        if (!this.__private__.listenerRegistry[event]) return false;

        if (listener) {
          var m = this.__private__.listenerRegistry[event];
          var n = m.length;

          for (var i = 0; i < n; i++) {
            var e = m[i];

            if (e.listener === listener) return true;
          }

          return false;
        } else {
          return true;
        }
      }

      /** 
       * @inheritdoc 
       * @ignore
       */

    }, {
      key: 'removeEventListener',
      value: function removeEventListener() {
        var event = arguments[0];
        var listener = arguments[1];
        var useCapture = arguments[2] || false;

        if (this.__private__.listenerRegistry && this.__private__.listenerRegistry[event]) {
          var m = this.__private__.listenerRegistry[event];
          var n = m.length;
          var s = -1;

          if (listener) {
            for (var i = 0; i < n; i++) {
              var e = m[i];

              if (e.listener === listener) {
                s = i;
                break;
              }
            }

            if (s > -1) {
              m.splice(s, 1);

              if (m.length === 0) {
                this.__private__.listenerRegistry[event] = null;
                delete this.__private__.listenerRegistry[event];
              }
            }
          } else {
            while (this.__private__.listenerRegistry[event] !== undefined) {
              this.removeEventListener(event, this.__private__.listenerRegistry[event][0].listener, this.__private__.listenerRegistry[event][0].useCapture);
            }
          }
        }

        if (listener) {
          if (window && event === 'clickoutside') {
            window.removeEventListener('click', listener, useCapture);
          } else {
            _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'removeEventListener', this).apply(this, arguments);
          }
        }
      }

      /** 
       * @see module:meno~ui.Element#removeEventListener 
       * @alias module:meno~ui.Element#off
       */

    }, {
      key: 'off',
      value: function off() {
        this.removeEventListener.apply(this, arguments);
      }

      /**
       * Removes all cached event listeners from this Element instance.
       * 
       * @alias module:meno~ui.Element#removeAllEventListeners
       */

    }, {
      key: 'removeAllEventListeners',
      value: function removeAllEventListeners() {
        if (this.__private__.listenerRegistry) {
          for (var event in this.__private__.listenerRegistry) {
            this.removeEventListener(event);
          }
        }
      }

      /**
       * Gets the value of the data property with the specified name.
       *
       * @param {string} key - Name of the data property.
       *
       * @return {*} Value of the data property.
       * 
       * @alias module:meno~ui.Element#getData
       */

    }, {
      key: 'getData',
      value: function getData(key) {
        return this.data[key];
      }

      /**
       * Checks to see if this Element instance has the data property of the
       * specified name.
       *
       * @param {string} key - Name of the data property.
       *
       * @return {boolean} True if data property exists, false othwerwise.
       * 
       * @alias module:meno~ui.Element#hasData
       */

    }, {
      key: 'hasData',
      value: function hasData(key) {
        return this.data.hasOwnProperty(key);
      }

      /**
       * Defines multiple data properties if the first argument is an object literal
       * (hence using its key/value pairs) or sets a single data property of the
       * specified name with the specified value. If the data property does not
       * exist, it will be newly defined.
       *
       * @param {string|object} - Name of the data property if defining only one, or
       *                          an object literal containing key/value pairs to be
       *                          merged into this Element instance's data
       *                          properties.
       * @param {*} - Value of the data property (if defining only one).
       * @param {boolean} - If defining only one data property, specifies whether
       *                    the data property should also be a data attribute of the
       *                    element.
       * 
       * @alias module:meno~ui.Element#setData
       */

    }, {
      key: 'setData',
      value: function setData() {
        var descriptor = arguments[0];

        if (typeof descriptor === 'string') {
          var value = arguments[1];
          var attributed = arguments[2] || false;

          if (this.hasData(descriptor)) {
            this.data[descriptor] = value;
          } else {
            (0, _defineProperty2.default)(this, descriptor, {
              defaultValue: value,
              dirtyType: _DirtyType2.default.DATA,
              get: true,
              set: true,
              attributed: attributed
            }, 'data');
          }
        } else {
          (0, _assertType2.default)(descriptor, 'object', false);
          if (!descriptor) return;
          for (var key in descriptor) {
            this.setData(key, descriptor[key]);
          }
        }
      }

      /**
       * Creates the associated DOM element from a template.
       *
       * @return {Node|string}
       * 
       * @alias module:meno~ui.Element#template
       */

    }, {
      key: 'template',
      value: function template(data) {
        return null;
      }

      /** 
       * @see ElementUpdateDelegate#isDirty 
       * @alias module:meno~ui.Element#isDirty
       */

    }, {
      key: 'isDirty',
      value: function isDirty() {
        return this.updateDelegate.isDirty.apply(this.updateDelegate, arguments);
      }

      /** 
       * @see ElementUpdateDelegate#setDirty 
       * @alias module:meno~ui.Element#setDirty
       */

    }, {
      key: 'setDirty',
      value: function setDirty() {
        return this.updateDelegate.setDirty.apply(this.updateDelegate, arguments);
      }

      /**
       * Shorthand for creating/accessing private properties.
       *
       * @param {string} propertyName - Name of private property.
       * @param {*} [defaultInitializer] - Optional default value/initializer to set
       *                                   the private property to if it doesn't
       *                                   exist.
       *
       * @return {*} Value of private property.
       * 
       * @alias module:meno~ui.Element#get
       */

    }, {
      key: 'get',
      value: function get(propertyName, defaultInitializer) {
        (0, _assertType2.default)(propertyName, 'string', false);
        if (!this.__private__) this.__private__ = {};
        if (this.__private__[propertyName] === undefined) {
          if (typeof defaultInitializer === 'function') this.__private__[propertyName] = defaultInitializer();else this.__private__[propertyName] = defaultInitializer;
        }
        return this.__private__[propertyName];
      }

      /**
       * Shorthand for modifying private properties.
       *
       * @param {string} propertyName - Name of private property.
       * @param {*} value - Value of private property to be set.
       * 
       * @alias module:meno~ui.Element#set
       */

    }, {
      key: 'set',
      value: function set(propertyName, value) {
        (0, _assertType2.default)(propertyName, 'string', false);
        if (!this.__private__) this.__private__ = {};
        this.__private__[propertyName] = value;
      }

      /**
       * Defines all properties.
       *
       * @private
       */

    }, {
      key: '__defineProperties__',
      value: function __defineProperties__() {
        var _this3 = this;

        this.__private__ = {};
        this.__private__.childRegistry = {};
        this.__private__.listenerRegistry = {};

        /**
         * Current node state of this Element instance.
         *
         * @type {NodeState}
         */
        (0, _defineProperty2.default)(this, 'nodeState', { defaultValue: _NodeState2.default.IDLE, get: true });

        /**
         * Data properties.
         *
         * @type {Object}
         * @see module:meno~enums.Directive.DATA
         */
        (0, _defineProperty2.default)(this, 'data', { defaultValue: {}, get: true });

        /**
         * ElementUpdateDelegate instance.
         *
         * @type {ElementUpdateDelegate}
         */
        (0, _defineProperty2.default)(this, 'updateDelegate', { defaultValue: new _ElementUpdateDelegate2.default(this), get: true });

        /**
         * Specifies whether this Element instance is invisible. This property
         * follows the rules of the CSS rule 'visibility: hidden'.
         *
         * @type {boolean}
         */
        (0, _defineProperty2.default)(this, 'invisible', {
          get: true,
          set: function set(value) {
            (0, _assertType2.default)(value, 'boolean', false);

            if (_this3.nodeState === _NodeState2.default.UPDATED) {
              if (value) {
                _this3.setStyle('visibility', 'hidden');
              } else {
                if (_this3.getStyle('visibility') === 'hidden') {
                  _this3.setStyle('visibility', null);
                }
              }
            }

            return value;
          }
        });

        if (this.disabled === undefined) {
          /**
           * Specifies whether this Element instance is disabled.
           *
           * @type {boolean}
           */
          Object.defineProperty(this, 'disabled', {
            get: function get() {
              return _this3.hasAttribute('disabled') ? _this3.getAttribute('disabled') : false;
            },
            set: function set(value) {
              return _this3.setAttribute('disabled', value ? true : false);
            }
          });
        }
      }

      /**
       * Sets the Element's node state.
       *
       * @param {NodeState} nodeState - Node state.
       * 
       * @event 'nodeinitialize' - Dispatched when node state is set to
       *                           NodeState.INITIALIZED.
       * @event 'nodeupdate' - Dispatched when node state is set to NodeState.UPDATE.
       * @event 'nodedestroy' - Dispatched when node state is set to
       *                        NodeState.DESTROYED.
       * @event 'nodestate' - Dispatched whenever the note state is changed.
       *
       * @private
       */

    }, {
      key: '__setNodeState__',
      value: function __setNodeState__(nodeState) {
        if (this.__private__.nodeState === nodeState) return;
        var oldVal = this.__private__.nodeState;
        this.__private__.nodeState = nodeState;

        if (nodeState === _NodeState2.default.INITIALIZED) this.dispatchEvent(new CustomEvent('nodeinitialize'));else if (nodeState === _NodeState2.default.UPDATED) this.dispatchEvent(new CustomEvent('nodeupdate'));else if (nodeState === _NodeState2.default.DESTROYED) this.dispatchEvent(new CustomEvent('nodedestroy'));

        this.dispatchEvent(new CustomEvent('nodestate', {
          detail: {
            oldValue: oldVal,
            newValue: nodeState
          }
        }));
      }
    }, {
      key: 'name',


      /**
       * Instance name of this Element instance. Once set, it cannot be changed.
       *
       * @type {string}
       * 
       * @alias module:meno~ui.Element#name
       */
      get: function get() {
        var s = this.getAttribute('name');
        if (!s || s === '') return null;
        return s;
      },
      set: function set(val) {
        // Once set, name cannot change.
        if (!this.name) _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'setAttribute', this).call(this, 'name', val);
      }

      /**
       * State of this Element instance (depicted by Directive.State).
       *
       * @type {string}
       * 
       * @event 'state' - Dispatched when the value is changed.
       * @alias module:meno~ui.Element#state
       */

    }, {
      key: 'state',
      get: function get() {
        var s = this.getAttribute(_Directive2.default.STATE);
        if (!s || s === '') return null;
        return s;
      },
      set: function set(val) {
        if (this.state === val) return;

        var oldValue = this.state;

        if (val === null || val === undefined) this.removeAttribute(_Directive2.default.STATE);else this.setAttribute(_Directive2.default.STATE, val);

        this.updateDelegate.setDirty(_DirtyType2.default.STATE);

        var event = new CustomEvent('state', {
          detail: {
            property: 'state',
            oldValue: oldValue,
            newValue: val
          }
        });

        this.dispatchEvent(event);
      }

      /**
       * Opacity of this Element instance.
       *
       * @type {number}
       * 
       * @alias module:meno~ui.Element#opacity
       */

    }, {
      key: 'opacity',
      get: function get() {
        return this.getStyle('opacity', true);
      },
      set: function set(val) {
        this.setStyle('opacity', val);
      }
    }], [{
      key: 'factory',


      /**
       * Creates a new DOM element from this Element class.
       *
       * @return {Node}
       * 
       * @alias module:meno~ui.Element.factory
       */
      value: function factory() {
        return new ((0, _register2.default)(this))();
      }
    }, {
      key: 'tag',

      /**
       * Gets the tag name of this Element instance. This method is meant to be
       * overridden by sub-classes because this class merely provides the foundation
       * functionality of a custom element, hence this class does not register
       * directly with the element registry. This tag name is used by
       * `document.registerElement()`.
       *
       * @return {string} The tag name.
       * 
       * @alias module:meno~ui.Element.tag
       */
      get: function get() {
        return typeof base === 'string' && base || tag || undefined;
      }

      /**
       * Gets the existing native element which this custom element extends. This
       * value is used in the `options` for `document.registerElement()`.
       *
       * @return {string} The tag of the native element.
       * 
       * @alias module:meno~ui.Element.extends
       */

    }, {
      key: 'extends',
      get: function get() {
        return null;
      }
    }]);

    return _class;
  }(typeof base !== 'string' && base || HTMLElement);
};

exports.default = Element;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DirtyType = __webpack_require__(4);

var _DirtyType2 = _interopRequireDefault(_DirtyType);

var _assert = __webpack_require__(1);

var _assert2 = _interopRequireDefault(_assert);

var _debounce = __webpack_require__(40);

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Default refresh (debounce) rate in milliseconds.
 *
 * @const
 * @memberof module:meno~ui.ElementUpdateDelegate
 * @type {number}
 * @default
 */
var DEFAULT_REFRESH_RATE = 0.0;

/**
 * @class
 *
 * Delegate for managing update calls of a Meno Element.
 *
 * @alias module:meno~ui.ElementUpdateDelegate
 */

var ElementUpdateDelegate =
/**
 * @class
 *
 * Creates a new ElementUpdateDelegate instance.
 *
 * @param {Element} delegate - The Meno Element instance of which this
 *                             ElementUpdateDelgate instance manages.
 *
 * @alias module:meno~ui.ElementUpdateDelegate
 */
function ElementUpdateDelegate(delegate) {
  var _this = this;

  _classCallCheck(this, ElementUpdateDelegate);

  /**
   * Stores mouse properties if this ElementUpdateDelegate responds to mouse
   * events.
   *
   * @property {Object}
   */
  Object.defineProperty(this, 'mouse', { value: {}, writable: false });

  /**
   * Stores orientation properties if this ElementUpdateDelgate responds to
   * device orientations (i.e. device accelerometer).
   *
   * @property {Object}
   */
  Object.defineProperty(this, 'orientation', { value: {}, writable: false });

  /**
   * Stores pressed keycodes if this ElementUpdateDelegate responds to
   * keyboard events.
   *
   * @property {Object}
   */
  Object.defineProperty(this, 'keyCode', { value: {}, writable: false });

  /**
   * Delegate of this ElementUpdateDelegate instance.
   *
   * @property {Element}
   */
  Object.defineProperty(this, 'delegate', { value: delegate, writable: false });

  var mDirtyTable = 0;
  var mConductorTable = {};
  var mResizeHandler = null;
  var mScrollHandler = null;
  var mMouseMoveHandler = null;
  var mOrientationChangeHandler = null;
  var mMouseWheelHandler = null;
  var mKeyUpHandler = null;
  var mKeyPressHandler = null;
  var mKeyDownHandler = null;
  var mEnterFrameHandler = null;

  /**
   * Custom requestAnimationFrame implementation.
   *
   * @param {Function} callback
   *
   * @private
   */
  var _requestAnimationFrame = function _requestAnimationFrame(callback) {
    var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || null;
    if (!raf) raf = function raf(handler) {
      return window.setTimeout(handler, 10.0);
    };
    return raf(callback);
  };

  /**
   * Custom cancelAnimationFrame implementation.
   *
   * @return {Function|Object} callbackOrId
   *
   * @private
   */
  var _cancelAnimationFrame = function _cancelAnimationFrame(callbackOrId) {
    var caf = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || null;
    if (!caf) caf = function caf(handler) {
      return window.clearTimeout(handler);
    };
    return caf(callbackOrId);
  };

  /**
   * Handler invoked when the window resizes.
   *
   * @param {Event} event
   *
   * @private
   */
  var _onWindowResize = function _onWindowResize(event) {
    return _this.setDirty(_DirtyType2.default.SIZE);
  };

  /**
   * Handler invoked when the window scrolls.
   *
   * @param {Event} event
   *
   * @private
   */
  var _onWindowScroll = function _onWindowScroll(event) {
    return _this.setDirty(_DirtyType2.default.POSITION);
  };

  /**
   * Handler invoked when mouse moves in the window.
   *
   * @param {Event} event
   *
   * @private
   */
  var _onWindowMouseMove = function _onWindowMouseMove(event) {
    _this.mouse.pointerX = event.clientX;
    _this.mouse.pointerY = event.clientY;
    _this.setDirty(_DirtyType2.default.INPUT);
  };

  /**
   * Handler invoked when mouse wheel moves in the window.
   *
   * @param {Event} event
   *
   * @private
   */
  var _onWindowMouseWheel = function _onWindowMouseWheel(event) {
    _this.mouse.wheelX = event.deltaX;
    _this.mouse.wheelY = event.deltaY;
    _this.setDirty(_DirtyType2.default.INPUT);
  };

  /**
   * Handler invoked when device orientation changes.
   *
   * @param {Event} event
   *
   * @private
   */
  var _onWindowOrientationChange = function _onWindowOrientationChange(event) {
    var x = void 0,
        y = void 0,
        z = void 0;

    if (event instanceof window.DeviceOrientationEvent) {
      x = event.beta;
      y = event.gamma;
      z = event.alpha;
    } else if (event instanceof window.DeviceMotionEvent) {
      x = event.acceleration.x * 2;
      y = event.acceleration.y * 2;
      z = event.acceleration.z * 2;
    } else {
      x = event.orientation.x * 50;
      y = event.orientation.y * 50;
      z = event.orientation.z * 50;
    }

    _this.orientation.x = x;
    _this.orientation.y = y;
    _this.orientation.z = z;

    _this.setDirty(_DirtyType2.default.ORIENTATION);
  };

  /**
   * Handler invoked when a key is pressed down.
   *
   * @param {Event} event
   *
   * @private
   */
  var _onWindowKeyDown = function _onWindowKeyDown(event) {
    if (_this.keyCode.down === undefined) _this.keyCode.down = [];
    _this.keyCode.down.push(event.keyCode);
    _this.setDirty(_DirtyType2.default.INPUT);
  };

  /**
   * Handler invoked when a key is pressed.
   *
   * @param {Event} event
   *
   * @private
   */
  var _onWindowKeyPress = function _onWindowKeyPress(event) {
    if (_this.keyCode.press === undefined) _this.keyCode.press = [];
    _this.keyCode.press.push(event.keyCode);
    _this.setDirty(_DirtyType2.default.INPUT);
  };

  /**
   * Handler invoked when a key is pressed up.
   *
   * @param {Event} event
   *
   * @private
   */
  var _onWindowKeyUp = function _onWindowKeyUp(event) {
    if (_this.keyCode.up === undefined) _this.keyCode.up = [];
    _this.keyCode.up.push(event.keyCode);
    _this.setDirty(_DirtyType2.default.INPUT);
  };

  /**
   * Handler invoked when frame advances.
   *
   * @param  {Event} event
   *
   * @private
   */
  var _onEnterFrame = function _onEnterFrame(event) {
    _this.setDirty(_DirtyType2.default.FRAME);
  };

  /**
   * Sets a dirty type as dirty.
   *
   * @param {number} dirtyType
   */
  this.setDirty = function (dirtyType, validateNow) {
    if (_this.isDirty(dirtyType) && !validateNow) return;

    switch (dirtyType) {
      case _DirtyType2.default.NONE:
      case _DirtyType2.default.ALL:
        mDirtyTable = dirtyType;
        break;
      default:
        mDirtyTable |= dirtyType;
    }

    if (mDirtyTable === _DirtyType2.default.NONE) return;

    if (validateNow) _this.update();else if (!_this._pendingAnimationFrame) _this._pendingAnimationFrame = _requestAnimationFrame(_this.update.bind(_this));else if (_this._pendingAnimationFrame) window.setTimeout(function () {
      return _this.setDirty(dirtyType, validateNow);
    }, 0.0);
  };

  /**
   * Checks dirty status of a given dirty type.
   *
   * @param {number} dirtyType [description]
   *
   * @return {boolean}
   */
  this.isDirty = function (dirtyType) {
    switch (dirtyType) {
      case _DirtyType2.default.NONE:
      case _DirtyType2.default.ALL:
        return mDirtyTable === dirtyType;
      default:
        return (dirtyType & mDirtyTable) !== 0;
    }
  };

  /**
   * Initializes this ElementUpdateDelegate instance. Must manually invoke.
   */
  this.init = function () {
    _this.setDirty(_DirtyType2.default.ALL);
  };

  /**
   * Destroys this ElementUpdateDelegate instance.
   */
  this.destroy = function () {
    _cancelAnimationFrame(_this._pendingAnimationFrame);

    if (mResizeHandler) {
      window.removeEventListener('resize', mResizeHandler);
      window.removeEventListener('orientationchange', mResizeHandler);
    }

    if (mScrollHandler) {
      var conductor = mConductorTable.scroll || window;
      conductor.removeEventListener('scroll', mScrollHandler);
    }

    if (mMouseWheelHandler) {
      var _conductor = mConductorTable.mouseWheel || window;
      _conductor.removeEventListener('wheel', mMouseWheelHandler);
    }

    if (mMouseMoveHandler) {
      var _conductor2 = mConductorTable.mouseMove || window;
      _conductor2.removeEventListener('mousemove', mMouseMoveHandler);
    }

    if (mOrientationChangeHandler) {
      if (window.DeviceOrientationEvent) window.removeEventListener('deviceorientation', mOrientationChangeHandler);else if (window.DeviceMotionEvent) window.removeEventListener('devicemotion', mOrientationChangeHandler);
    }

    if (mKeyDownHandler) window.removeEventListener('keydown', mKeyDownHandler);
    if (mKeyPressHandler) window.removeEventListener('keypress', mKeyPressHandler);
    if (mKeyUpHandler) window.removeEventListener('keyup', mKeyUpHandler);
    if (mEnterFrameHandler) window.clearInterval(mEnterFrameHandler);

    _this._pendingAnimationFrame = null;

    mResizeHandler = null;
    mScrollHandler = null;
    mMouseWheelHandler = null;
    mMouseMoveHandler = null;
    mOrientationChangeHandler = null;
    mKeyDownHandler = null;
    mKeyPressHandler = null;
    mKeyUpHandler = null;
    mConductorTable = null;
    mEnterFrameHandler = null;
  };

  /**
   * Handler invoked whenever a visual update is required.
   */
  this.update = function () {
    _cancelAnimationFrame(_this._pendingAnimationFrame);

    if (_this.delegate && _this.delegate.update) _this.delegate.update.call(_this.delegate);

    // Reset the dirty status of all types.
    _this.setDirty(_DirtyType2.default.NONE);

    delete _this.mouse.pointerX;
    delete _this.mouse.pointerY;
    delete _this.mouse.wheelX;
    delete _this.mouse.wheelY;
    delete _this.orientation.x;
    delete _this.orientation.y;
    delete _this.orientation.z;
    delete _this.keyCode.up;
    delete _this.keyCode.press;
    delete _this.keyCode.down;

    _this._pendingAnimationFrame = null;
  };

  /**
   * Sets up the responsiveness to the provided conductor. Only the following
   * event types support a custom conductor; the rest uses window as the
   * conductor:
   *   1. 'scroll'
   *   2. 'wheel'
   *   3. 'mousemove'
   *
   * @param {Object|Number|...args} - This could be the conductor (defaults to
   *                                  window if unspecified), refresh rate
   *                                  (defaults to the default value if
   *                                  unspecified) or the event type(s).
   * @param {number|...args}        - Either the refresh rate (defaults to
   *                                  the default value if unspecified) or
   *                                  the event type(s).
   * @param {...args}               - Event type(s) which the delegate will
   *                                  respond to.
   */
  this.initResponsiveness = function () {
    var args = Array.prototype.slice.call(arguments);

    (0, _assert2.default)(args.length > 0, 'Insufficient arguments provided');

    var conductor = typeof args[0] !== 'number' && typeof args[0] !== 'string' ? args.shift() : window;
    var delay = typeof args[0] === 'number' ? args.shift() : DEFAULT_REFRESH_RATE;
    var universal = args.length === 0;

    (0, _assert2.default)(conductor && conductor.addEventListener, 'Invalid conductor specified');

    if (universal || args.indexOf('resize') > -1 || args.indexOf('orientationchange') > -1) {
      if (mResizeHandler) {
        window.removeEventListener('resize', mResizeHandler);
        window.removeEventListener('orientationchange', mResizeHandler);
      }
      mResizeHandler = delay === 0.0 ? _onWindowResize.bind(this) : (0, _debounce2.default)(_onWindowResize.bind(this), delay);
      window.addEventListener('resize', mResizeHandler);
      window.addEventListener('orientationchange', mResizeHandler);
    }

    if (universal || args.indexOf('scroll') > -1) {
      if (mScrollHandler) {
        var c = mConductorTable.scroll || window;
        c.removeEventListener('scroll', mScrollHandler);
      }
      mScrollHandler = delay === 0.0 ? _onWindowScroll.bind(this) : (0, _debounce2.default)(_onWindowScroll.bind(this), delay);
      mConductorTable.scroll = conductor;
      conductor.addEventListener('scroll', mScrollHandler);
    }

    if (universal || args.indexOf('wheel') > -1) {
      if (mMouseWheelHandler) {
        var _c = mConductorTable.mouseWheel || window;
        _c.removeEventListener('wheel', mMouseWheelHandler);
      }
      mMouseWheelHandler = delay === 0.0 ? _onWindowMouseWheel.bind(this) : (0, _debounce2.default)(_onWindowMouseWheel.bind(this), delay);
      mConductorTable.mouseWheel = conductor;
      conductor.addEventListener('wheel', mMouseWheelHandler);
    }

    if (universal || args.indexOf('mousemove') > -1) {
      if (mMouseMoveHandler) {
        var _c2 = mConductorTable.mouseMove || window;
        _c2.removeEventListener('mousemove', mMouseMoveHandler);
      }
      mMouseMoveHandler = delay === 0.0 ? _onWindowMouseMove.bind(this) : (0, _debounce2.default)(_onWindowMouseMove.bind(this), delay);
      mConductorTable.mouseMove = conductor;
      conductor.addEventListener('mousemove', mMouseMoveHandler);
    }

    if (universal || args.indexOf('deviceorientation') > -1 || args.indexOf('devicemotion') > -1 || args.indexOf('deviceorientation') > -1) {
      if (mOrientationChangeHandler) {
        if (window.DeviceOrientationEvent) window.removeEventListener('deviceorientation', mOrientationChangeHandler);else if (window.DeviceMotionEvent) window.removeEventListener('devicemotion', mOrientationChangeHandler);
      }
      mOrientationChangeHandler = delay === 0.0 ? _onWindowOrientationChange.bind(this) : (0, _debounce2.default)(_onWindowOrientationChange.bind(this), delay);
      if (window.DeviceOrientationEvent) window.addEventListener('deviceorientation', mOrientationChangeHandler);else if (window.DeviceMotionEvent) window.addEventListener('devicemotion', mOrientationChangeHandler);
    }

    if (universal || args.indexOf('keydown') > -1) {
      if (mKeyDownHandler) window.removeEventListener('keydown', mKeyDownHandler);
      mKeyDownHandler = _onWindowKeyDown.bind(this);
      window.addEventListener('keydown', mKeyDownHandler);
    }

    if (universal || args.indexOf('keypress') > -1) {
      if (mKeyPressHandler) window.removeEventListener('keypress', mKeyPressHandler);
      mKeyPressHandler = _onWindowKeyPress.bind(this);
      window.addEventListener('keypress', mKeyPressHandler);
    }

    if (universal || args.indexOf('keyup') > -1) {
      if (mKeyUpHandler) window.removeEventListener('keyup', mKeyUpHandler);
      mKeyUpHandler = _onWindowKeyUp.bind(this);
      window.addEventListener('keyup', mKeyUpHandler);
    }

    if (universal || args.indexOf('enterframe') > -1) {
      if (mEnterFrameHandler) window.clearInterval(mEnterFrameHandler);
      mEnterFrameHandler = window.setInterval(_onEnterFrame.bind(this), delay);
    }
  };
};

exports.default = ElementUpdateDelegate;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assertType = __webpack_require__(0);

var _assertType2 = _interopRequireDefault(_assertType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns a function that, as long as it continues to be invoked, will not be
 * triggered. The function will be called after it stops being called for N
 * milliseconds. If 'leading' is passed, the function will be triggered on the
 * leading edge instead of the trailing.
 *
 * @param {Function} method - Method to be debounced.
 * @param {number} [delay=0] - Debounce rate in milliseconds.
 * @param {boolean} [leading=false] - Indicates whether the method is triggered
 *                                    on the leading edge instead of the
 *                                    trailing.
 *
 * @return {Function} The debounced method.
 *
 * @alias module:meno~helpers.debounce
 */
function debounce(method, delay, leading) {
  (0, _assertType2.default)(method, 'function', false, 'Invalid parameter: method');
  (0, _assertType2.default)(delay, 'number', true, 'Invalid optional parameter: delay');
  (0, _assertType2.default)(leading, 'boolean', true, 'Invalid optional parameter: leading');

  if (delay === undefined) delay = 0;
  if (leading === undefined) leading = false;

  var timeout = void 0;

  return function () {
    var context = this;
    var args = arguments;

    var later = function later() {
      timeout = null;
      if (!leading) method.apply(context, args);
    };

    var callNow = leading && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, delay);

    if (callNow) method.apply(context, args);
  };
}

exports.default = debounce;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _assert = __webpack_require__(1);

var _assert2 = _interopRequireDefault(_assert);

var _assertType = __webpack_require__(0);

var _assertType2 = _interopRequireDefault(_assertType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class
 *
 * Custom event dispatcher object.
 *
 * @alias module:meno~events.EventDispatcher
 */
var EventDispatcher = function () {
  /**
   * Creates a new EventDispatcher instance.
   *
   * @return {EventDispatcher} A new EventDispatcher instance.
   */
  function EventDispatcher() {
    _classCallCheck(this, EventDispatcher);

    this.__defineProperties__();
  }

  /**
   * Adds an event listener to this EventDispatcher instance.
   *
   * @param {string} type
   * @param {Function} listener
   */


  _createClass(EventDispatcher, [{
    key: 'addEventListener',
    value: function addEventListener(type, listener) {
      if (!(0, _assertType2.default)(type, 'string', false, 'Invalid parameter: type')) return;
      if (!(0, _assertType2.default)(listener, 'function', false, 'Invalid parameter: listener')) return;

      if (!this.__private__.listenerRegistry[type]) {
        this.__private__.listenerRegistry[type] = [];
      }

      this.__private__.listenerRegistry[type].push(listener);
    }

    /** @see module:meno~events.EventDispatcher#addEventListener */

  }, {
    key: 'on',
    value: function on() {
      this.addEventListener.apply(this, arguments);
    }

    /**
     * Removes an event listener from this EventDispatcher instance. If no
     * listener method is specified, all the listeners of the specified type
     * will be removed.
     *
     * @param {string} type
     * @param {Function} listener:undefined
     */

  }, {
    key: 'removeEventListener',
    value: function removeEventListener(type, listener) {
      if (!(0, _assertType2.default)(type, 'string', false, 'Invalid parameter: type')) return;
      if (!(0, _assertType2.default)(listener, 'function', true, 'Invalid parameter: listener')) return;
      if (!(0, _assert2.default)(this.__private__.listenerRegistry, 'Listener map is null.')) return;
      if (!(0, _assert2.default)(this.__private__.listenerRegistry[type], 'There are no listeners registered for event type: ' + type)) return;

      if (listener) {
        var index = this.__private__.listenerRegistry[type].indexOf(listener);

        if (index > -1) {
          this.__private__.listenerRegistry[type].splice(index, 1);
        }
      } else {
        delete this.__private__.listenerRegistry[type];
      }
    }

    /** @see module:meno~events.EventDispatcher#removeEventListener */

  }, {
    key: 'off',
    value: function off() {
      this.removeEventListener.apply(this, arguments);
    }

    /**
     * Removes all cached event listeners from this Element instance.
     */

  }, {
    key: 'removeAllEventListeners',
    value: function removeAllEventListeners() {
      if (this.__private__.listenerRegistry) {
        for (var event in this.__private__.listenerRegistry) {
          this.removeEventListener(event);
        }
      }
    }

    /**
     * Determines whether this EventDispatcher instance has a specific event
     * listener registered. If no listener is specified, it will check if any
     * listener of the specified event type is registered.
     *
     * @param {string} type
     * @param {Function} [listener]
     *
     * @return {boolean}
     */

  }, {
    key: 'hasEventListener',
    value: function hasEventListener(type, listener) {
      if (!(0, _assertType2.default)(type, 'string', false, 'Invalid parameter: type')) return;
      if (!(0, _assertType2.default)(listener, 'function', true, 'Invalid parameter: listener')) return;
      if (!(0, _assert2.default)(this.__private__.listenerRegistry, 'Listener map is null.')) return;
      if (!(0, _assert2.default)(this.__private__.listenerRegistry[type], 'There are no listeners registered for event type: ' + type)) return;

      if (listener) {
        var index = this.__private__.listenerRegistry[type].indexOf(listener);

        return index > -1;
      } else {
        return true;
      }
    }

    /**
     * Dispatches the specified event.
     *
     * @param {Event} event
     */

  }, {
    key: 'dispatchEvent',
    value: function dispatchEvent(event) {
      if (!(0, _assertType2.default)(event, Event, false, 'Event must be specified.')) return;
      if (!(0, _assert2.default)(this.__private__.listenerRegistry, 'Listener map is null.')) return;

      if (!this.__private__.listenerRegistry[event.type]) return;

      var arrlen = this.__private__.listenerRegistry[event.type].length;

      for (var i = 0; i < arrlen; i++) {
        var listener = this.__private__.listenerRegistry[event.type][i];
        listener.call(this, event);
      }
    }

    /**
     * Defines all properties.
     *
     * @private
     */

  }, {
    key: '__defineProperties__',
    value: function __defineProperties__() {
      if (!this.__private__) this.__private__ = {};

      Object.defineProperty(this.__private__, 'listenerRegistry', {
        value: {},
        writable: true
      });
    }
  }]);

  return EventDispatcher;
}();

exports.default = EventDispatcher;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _setAttribute = __webpack_require__(9);

var _setAttribute2 = _interopRequireDefault(_setAttribute);

var _Directive = __webpack_require__(3);

var _Directive2 = _interopRequireDefault(_Directive);

var _NodeState = __webpack_require__(15);

var _NodeState2 = _interopRequireDefault(_NodeState);

var _assert = __webpack_require__(1);

var _assert2 = _interopRequireDefault(_assert);

var _assertType = __webpack_require__(0);

var _assertType2 = _interopRequireDefault(_assertType);

var _hasOwnValue = __webpack_require__(32);

var _hasOwnValue2 = _interopRequireDefault(_hasOwnValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Defines a property in an element instance.
 *
 * @param {Node} element - Element instance to define the new property in.
 * @param {string} propertyName - Name of the property to be defined.
 * @param {Object} descriptor - An object literal that defines the behavior of
 *                              this new property. This object literal inherits
 *                              that of the descriptor param in
 *                              Object#defineProperty.
 * @param {boolean} [descriptor.unique=true] - Specifies that the modifier
 *                                             method will only invoke if the
 *                                             new value is different from the
 *                                             old value.
 * @param {DirtyType} [descriptor.dirtyType] - Specifies the DirtyType to flag
 *                                             whenever a new value is set.
 * @param {String} [descriptor.eventType] - Specifies the event type to dispatch 
 *                                          whenever a new value is set.
 * @param {boolean} [descriptor.attributed] - Specifies whether the a
 *                                            corresponding DOM attribute will
 *                                            update whenever a new value is
 *                                            set.
 * @param {Function} [descriptor.onChange] - Method invoked when the property
 *                                           changes.
 * @param {Function|boolean} [descriptor.get] - Method invoked when the accessor
 *                                              method is called. This is a good
 *                                              place to manipulate the value
 *                                              before it is returned. If simply
 *                                              set to true, a generic accessor
 *                                              method will be used.
 * @param {Function|boolean} [descriptor.set] - Method invoked when the modifier
 *                                              method is called. This is a good
 *                                              place to manipulate the value
 *                                              before it is set. If simply set
 *                                              to true, a generic modifier
 *                                              method will be used.
 * @param {string} [scope] - Name of the instance property of the Element to
 *                           create the new property in. This property must be
 *                           enumerable.
 *
 * @alias module:meno~helpers.defineProperty
 */
function defineProperty(element, propertyName, descriptor, scope) {
  (0, _assert2.default)(element, 'Parameter \'element\' must be defined');
  (0, _assertType2.default)(descriptor, 'object', false, 'Parameter \'descriptor\' must be an object literal');
  (0, _assertType2.default)(descriptor.configurable, 'boolean', true, 'Optional configurable key in descriptor must be a boolean');
  (0, _assertType2.default)(descriptor.enumerable, 'boolean', true, 'Optional enumerable key in descriptor must be a boolean');
  (0, _assertType2.default)(descriptor.writable, 'boolean', true, 'Optional writable key in descriptor must be a boolean');
  (0, _assertType2.default)(descriptor.unique, 'boolean', true, 'Optional unique key in descriptor must be a boolean');
  (0, _assertType2.default)(descriptor.dirtyType, 'number', true, 'Optional dirty type must be of DirtyType enum (number)');
  (0, _assertType2.default)(descriptor.eventType, 'string', true, 'Optional event type must be a string');
  (0, _assertType2.default)(descriptor.attributed, 'boolean', true, 'Optional attributed must be a boolean');
  (0, _assertType2.default)(descriptor.onChange, 'function', true, 'Optional change handler must be a function');
  (0, _assertType2.default)(scope, 'string', true, 'Optional parameter \'scope\' must be a string');

  var dirtyType = descriptor.dirtyType;
  var defaultValue = descriptor.defaultValue;
  var attributed = descriptor.attributed;
  var attributeName = _Directive2.default.DATA + propertyName.replace(/([A-Z])/g, function ($1) {
    return '-' + $1.toLowerCase();
  });
  var eventType = descriptor.eventType;
  var unique = descriptor.unique;

  (0, _assert2.default)(!attributeName || !(0, _hasOwnValue2.default)(_Directive2.default, attributeName), 'Attribute \'' + attributeName + '\' is reserved');

  if (unique === undefined) unique = true;

  if (scope === undefined) {
    scope = element;
  } else {
    (0, _assert2.default)(element.hasOwnProperty(scope), 'The specified Element instance does not have a property called \'' + scope + '\'');
    scope = element[scope];
  }

  if (defaultValue !== undefined) {
    scope.__private__ = scope.__private__ || {};
    Object.defineProperty(scope.__private__, propertyName, { value: defaultValue, writable: true });
  }

  var newDescriptor = {};

  if (descriptor.configurable !== undefined) newDescriptor.configurable = descriptor.configurable;
  if (descriptor.enumerable !== undefined) newDescriptor.enumerable = descriptor.enumerable;
  if (descriptor.value !== undefined) newDescriptor.value = descriptor.value;
  if (descriptor.writable !== undefined) newDescriptor.writable = descriptor.writable;

  if (descriptor.get) {
    newDescriptor.get = function () {
      return typeof descriptor.get === 'function' ? descriptor.get(scope.__private__[propertyName]) : scope.__private__[propertyName];
    };
  }

  if (descriptor.set) {
    newDescriptor.set = function (val) {
      var oldVal = scope.__private__[propertyName];

      if (typeof descriptor.set === 'function') val = descriptor.set(val);

      if (unique && oldVal === val) return;

      if (oldVal === undefined) {
        scope.__private__ = scope.__private__ || {};
        Object.defineProperty(scope.__private__, propertyName, { value: val, writable: true });
      } else {
        scope.__private__[propertyName] = val;
      }

      if (descriptor.onChange !== undefined) descriptor.onChange(oldVal, val);
      if (attributed === true) (0, _setAttribute2.default)(element, attributeName, val);
      if (dirtyType !== undefined && element.setDirty) element.setDirty(dirtyType);

      if (eventType !== undefined) {
        var event = new CustomEvent(eventType, {
          detail: {
            property: propertyName,
            oldValue: oldVal,
            newValue: val
          }
        });

        if (element.dispatchEvent) element.dispatchEvent(event);
      }
    };
  }

  Object.defineProperty(scope, propertyName, newDescriptor);

  if (defaultValue !== undefined && attributed === true) {
    (0, _setAttribute2.default)(element, attributeName, defaultValue);
  }

  if (defaultValue !== undefined && dirtyType !== undefined && element.nodeState >= _NodeState2.default.UPDATED && element.setDirty) {
    element.setDirty(dirtyType);
  }
}

exports.default = defineProperty;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

// © Andrew Wei



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isCustomElement = __webpack_require__(12);

var _isCustomElement2 = _interopRequireDefault(_isCustomElement);

var _getChildRegistry = __webpack_require__(2);

var _getChildRegistry2 = _interopRequireDefault(_getChildRegistry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets all the direct custom children of an element, flattened to a single
 * array.
 *
 * @param {Node} element - The DOM element to get the direct custom children
 *                         from.
 * @param {boolean} [inclusive] - Specifies whether the element provided should
 *                                be included as part of the search even if
 *                                it is already a custom element.
 *
 * @return {Array} Array of direct custom children.
 *
 * @alias module:meno~helpers.getInstanceNameFromElement
 */
function getDirectCustomChildren(element, inclusive) {
  if (!inclusive && element.nodeState !== undefined) return [];

  var childRegistry = (0, _getChildRegistry2.default)(element);
  var children = [];

  for (var name in childRegistry) {
    var child = [].concat(childRegistry[name]);

    child.forEach(function (c) {
      if ((0, _isCustomElement2.default)(c)) children.push(c);else children = children.concat(getDirectCustomChildren(c));
    });
  }

  return children;
}

exports.default = getDirectCustomChildren;

/***/ })
/******/ ]);