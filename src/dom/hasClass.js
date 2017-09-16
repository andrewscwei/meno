// © Andrew Wei

'use strict';

if (process.env.NODE_ENV === 'development') {
  var assert = require('assert');
}

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
  if (process.env.NODE_ENV === 'development') {
    assert(className && (typeof className === 'string'), 'Invalid class name: ' + className);
  }

  let elements = [].concat(element);
  let n = elements.length;

  for (let i = 0; i < n; i++) {
    let e = elements[i];
    let check = new RegExp(`(^|\\s)${className}(\\s|$)`).test(e.className);
    if (!check) return false;
  }

  return true;
}

export default hasClass;
