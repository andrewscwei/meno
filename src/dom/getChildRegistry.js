// © Andrew Wei

'use strict';

if (process.env.NODE_ENV === 'development') {
  var assert = require('assert');
  var assertType = require('debug/assertType');
}

/**
 * Gets the current or closest child registry of the target element.
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
  if (process.env.NODE_ENV === 'development') {
    assert((element === window) || (element instanceof Node) || !element, 'Invalid element specified');
    assertType(findClosest, 'boolean', true, `The parameter 'findClosest', if specified, must be a boolean value`);
  }

  if (!element || element === document || element === document.body) element = window;

  if (element === window) {
    if (!window.__private__) window.__private__ = {};
    if (window.__private__.childRegistry === undefined) window.__private__.childRegistry = {};
  }

  if (element.__private__ && element.__private__.childRegistry) {
    return element.__private__.childRegistry;
  }
  else if (findClosest === true) {
    return getChildRegistry(element.parentNode);
  }
  else {
    return null;
  }
}

export default getChildRegistry;
