// © Andrew Wei

'use strict';

if (process.env.NODE_ENV === 'development') {
  var assertType = require('../debug/assertType');
}

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
  if (process.env.NODE_ENV === 'development') {
    assertType(element, Node, false, 'Invalid element specified');
  }

  if (typeof value === 'number') value = String(value);
  if (value === null || value === undefined) value = '';

  element.style[key] = value;
}

export default setStyle;
