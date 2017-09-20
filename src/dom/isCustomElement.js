// © Andrew Wei

'use strict';

import getAttribute from 'dom/getAttribute';
import Directive from 'enums/Directive';

if (process.env.NODE_ENV === 'development') {
  var assertType = require('debug/assertType');
}

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
  if (process.env.NODE_ENV === 'development') {
    assertType(element, Node, false, 'Invalid element specified');
  }

  const is = getAttribute(element, Directive.IS);
  const tag = element.tagName;

  if (is && (customElements.get(is) !== undefined)) return true;
  if (tag && (customElements.get(tag) !== undefined)) return true;
  return false;
}

export default isCustomElement;

