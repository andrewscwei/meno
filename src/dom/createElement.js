// © Andrew Wei

'use strict';

import getElementRegistry from 'dom/getElementRegistry';
import assertType from 'helpers/assertType';

/**
 * Creates a DOM element from the provided string.
 *
 * @param {string} htmlString - String describing the DOM element.
 *
 * @return {Node} DOM element.
 *
 * @alias module:meno~dom.createElement
 */
function createElement(htmlString) {
  if (!document) return null;

  assertType(htmlString, 'string', true, 'Argument must be a string');

  const CustomElement = getElementRegistry(htmlString);

  // Check if custom element. Custom element needs to be created from the 
  // element registry.
  if (CustomElement) return new CustomElement();

  // Otherwise create the element from document.
  let div = document.createElement('div');
  if (htmlString.indexOf('<') !== 0 && htmlString.indexOf('>') !== (htmlString.length - 1)) htmlString = `<${htmlString}>`;
  div.innerHTML = htmlString;
  return div.firstChild;
}

export default createElement;
