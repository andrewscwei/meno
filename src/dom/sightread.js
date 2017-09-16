// © Andrew Wei

'use strict';

import addToChildRegistry from 'dom/addToChildRegistry';
import getChildRegistry from 'dom/getChildRegistry';
import assert from 'assert';
import isCustomElement from 'helpers/isCustomElement';

/**
 * Crawls a DOM element, creates a child registry for the element and registers
 * all of its children into the child registry, recursively.
 *
 * @param {Node} [element=document] - Target element for sightreading. By
 *                                    default this will be the document.
 * @param {Object} [childRegistry] - Target child registry to register child
 *                                   elements with. If unspecified it will be
 *                                   inferred from the target element.
 *
 * @alias module:meno~dom.sightread
 */
function sightread(element, childRegistry) {
  // If no element is specified or if the element is the document, default it to 
  // the window. It's better to attach the child registry object to to window
  // instead of the document.
  if (!element || element === document) element = window;

  // If no child registry is specified or one cannot be found or created in the
  // element, exit. This is probably not a supported element to sightread.
  if (!childRegistry && !getChildRegistry(element)) return;

  // If there is no target child registry specified, clear the child registry
  // of the element to prepare it for use.
  if (!childRegistry) {
    element.__private__.childRegistry = {};
    childRegistry = getChildRegistry(element);
  }

  // Set the target element to crawl.
  const target = (element === window) ? document.body : (element.shadowRoot ? element.shadowRoot : element);
  assert(target, 'Element is invalid. Too early to sightread?');

  // Begin crawling each child node.
  const n = target.childNodes.length;

  for (let i = 0; i < n; i++) {
    const e = target.childNodes[i];

    // Skip if not a Node. It could be a text node.
    if (!(e instanceof Node)) continue;

    // Try adding the element to the current child registry.
    if (addToChildRegistry(childRegistry, e)) {
      // Check if custom element. Custom elements sightread its children on
      // render. If it's not a custom element, manually sightread it. Any
      // element with a reference will have its own child registry.
      if (!isCustomElement(e)) {
        if (!e.__private__) e.__private__ = {};
        if (!e.__private__.childRegistry) e.__private__.childRegistry = {};
        sightread(e);
      }
    }
    // If it failed, that means this element has no reference. Sightread it to
    // see if any of its children can be added to the current child registry.
    else {
      sightread(e, childRegistry);
    }
  }
}

export default sightread;
