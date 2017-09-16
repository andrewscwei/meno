// © Andrew Wei

'use strict';

if (process.env.NODE_ENV === 'development') {
  var assertType = require('debug/assertType');
}

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
  if (process.env.NODE_ENV === 'development') {
    assertType(element, Node, false, 'Invalid element specified');
  }
  
  return element.style[key] !== '';
}

export default hasStyle;
