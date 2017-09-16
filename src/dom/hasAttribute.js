// © Andrew Wei

'use strict';

import noval from 'helpers/noval';

if (process.env.NODE_ENV === 'development') {
  var assertType = require('debug/assertType');
}

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
  if (process.env.NODE_ENV === 'development') {
    assertType(element, Node, false, 'Invalid element specified');
  }
  
  let value = element.getAttribute(name);
  if (value === '') return true;
  return !noval(value);
}

export default hasAttribute;
