// © Andrew Wei

'use strict';

if (process.env.NODE_ENV === 'development') {
  var assertType = require('../debug/assertType');
}

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
  if (process.env.NODE_ENV === 'development') {
    assertType(element, Node, false, 'Invalid element specified');
  }

  if (!element.getAttribute) return null;

  let value = element.getAttribute(name);
  if (value === '') return true;
  if (value === undefined || value === null) return null;
  try {
    return JSON.parse(value);
  }
  catch (err) {
    return value;
  }
}

export default getAttribute;
