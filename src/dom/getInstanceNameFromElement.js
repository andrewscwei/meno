// © Andrew Wei

'use strict';

import getAttribute from 'dom/getAttribute';
import Directive from 'enums/Directive';

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
  let nameFromName = getAttribute(element, Directive.NAME);
  return (nameFromName !== null && nameFromName !== undefined && nameFromName !== '') ? nameFromName : null;
}

export default getInstanceNameFromElement;

