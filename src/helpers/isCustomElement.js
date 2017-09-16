// © Andrew Wei

'use strict';

import assertType from 'helpers/assertType';
import getAttribute from 'dom/getAttribute';
import getElementRegistry from 'dom/getElementRegistry';
import Directive from 'enums/Directive';

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
  assertType(element, Node, false, 'Invalid element specified');

  const is = getAttribute(element, Directive.IS);
  const tag = element.tagName.toLowerCase();

  if (is && (getElementRegistry(is) !== undefined)) return true;
  if (tag && (getElementRegistry(tag) !== undefined)) return true;
  return false;
}

export default isCustomElement;

