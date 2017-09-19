// © Andrew Wei

'use strict';

import isCustomElement from 'dom/isCustomElement';

/**
 * Gets all the direct custom children of an element, flattened to a single
 * array.
 *
 * @param {Element} element - The DOM element to get the direct custom children
 *                            from.
 * @param {boolean} [inclusive] - Specifies whether the element provided should
 *                                be included as part of the search even if
 *                                it is already a custom element.
 *
 * @return {Array} Array of direct custom children.
 *
 * @alias module:meno~helpers.getDirectCustomChildren
 */
function getDirectCustomChildren(element, inclusive) {
  let children = [];
  const n = element.childNodes.length;

  for (let i = 0; i < n; i++) {
    const child = element.childNodes[i];
    if (!(child instanceof Element)) continue;
    children = children.concat(isCustomElement(child) ? [child] : getDirectCustomChildren(child));
  }

  return children;
}

export default getDirectCustomChildren;

