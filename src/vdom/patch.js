// © Andrew Wei

'use strict';

import Directive from 'enums/Directive';
import createElement from 'vdom/createElement';
import setAttribute from 'dom/setAttribute';
import vnode from 'vdom/vnode';

if (process.env.NODE_ENV === 'development') {
  var assert = require('assert');
}

/**
 * Patches a DOM element with changes between two virtual trees.
 * 
 * @param {Node} rootNode - The DOM element to patch.
 * @param {Node} newTree - The new vtree.
 * @param {Node} oldTree - The old vtree to diff from.
 * 
 * @alias module:meno~vdom.patch
 */
function patch(rootNode, newTree, oldTree) {
  const isSVG = rootNode.tagName === 'svg';

  if (!oldTree) {
    const nNewChildren = newTree.children.length;
  
    for (let i = 0; i < nNewChildren; i++) {
      const child = createElement(newTree.children[i], isSVG);
      rootNode.appendChild(child);
    }

    if (rootNode.__sync_child_events__) rootNode.__sync_child_events__();
  }
  else {
    const nNewChildren = newTree.children.length;
    const nOldChildren = oldTree.children.length;
  
    for (let i = 0; i < nNewChildren || i < nOldChildren; i++) {
      updateElement(rootNode, rootNode, newTree.children[i], oldTree.children[i], i, isSVG);
    }
  }

  return newTree;
}

/**
 * Applies updates to an element, specified by its parent and its child index.
 * 
 * @param {Node} rootNode - The root element.
 * @param {Node} parent - The parent of the element.
 * @param {VNode} newNode - The new VNode instance with updated properties.
 * @param {VNode} oldNode - The old VNode instance to diff from.
 * @param {number} [index=0] - The child index of the element with respect to 
 *                             the parent.
 * @param {boolean} [isSVG=false] - Specifies whether the updates are for an SVG
 *                                  element or its child nodes.
 */
function updateElement(rootNode, parent, newNode, oldNode, index = 0, isSVG = false) {
  // Old node doesn't exist, that means new node is indeed new. Append it to the
  // parent.
  if (!oldNode) {
    const element = createElement(newNode, parent.tagName === 'svg');
    parent.appendChild(element);
    if (rootNode.__register_all_child_events__ && element instanceof Element) rootNode.__register_all_child_events__(element);
  }
  // New node doesn't exist, that means the old node is deleted.
  else if (!newNode) {
    const element = parent.childNodes[index];
    if (rootNode.__unregister_child_event__ && element instanceof Element) rootNode.__unregister_child_event__(element);
    parent.removeChild(element);
  }
  // New node is different from the old node, replace them.
  else if (isDifferent(newNode, oldNode)) {
    const oldElement = parent.childNodes[index];
    const newElement = createElement(newNode, parent.tagName === 'svg');
    if (rootNode.__unregister_child_event__ && oldElement instanceof Element) rootNode.__unregister_child_event__(oldElement);
    if (rootNode.__register_all_child_events__ && newElement instanceof Element) rootNode.__register_all_child_events__(newElement);
    parent.replaceChild(newElement, oldElement);
  }
  // New node is the same as the old node, but check if its properties have
  // changed.
  else if (newNode.tag) {
    updateAttributes(rootNode, parent.childNodes[index], newNode.attributes, oldNode.attributes, isSVG || parent.tagName === 'svg' || parent.childNodes[index].tagName === 'svg');

    const nNewChildren = newNode.children.length;
    const nOldChildren = oldNode.children.length;

    // Also update its children.
    for (let i = 0; i < nNewChildren || i < nOldChildren; i++) {
      updateElement(rootNode, parent.childNodes[index], newNode.children[i], oldNode.children[i], i, isSVG || parent.tagName === 'svg' || parent.childNodes[index].tagName === 'svg');
    }
  }
}

/**
 * Updates all the attributes of an element and does so precisly by comparing 
 * with its old attributes.
 * 
 * @param {Node} rootNode - The root element.
 * @param {Node} element - The element instance to modify.
 * @param {Object} newAttributes - New attributes to apply.
 * @param {Object} oldAttributes - Old attributes to compare against.
 * @param {boolean} isSVG - Specifies whether the attribute updates are for an
 *                          SVG element or its child nodes.
 */
function updateAttributes(rootNode, element, newAttributes, oldAttributes, isSVG) {
  const attributes = Object.assign({}, newAttributes, oldAttributes);
  isSVG = isSVG || element.tagName === 'svg';
  
  for (let key in attributes) {
    if (key === Directive.IS) continue;

    const oldVal = oldAttributes[key];
    const newVal = newAttributes[key];

    // No new attribute defined, that means the old one is deleted.
    if (newVal === undefined) {
      setAttribute(element, key, undefined, isSVG);

      const regex = new RegExp('^' + Directive.EVENT, 'i');
      if (regex.test(key)) {
        const eventType = key.replace(Directive.EVENT, '');
        if (rootNode.__unregister_child_event__ && element instanceof Element) rootNode.__unregister_child_event__(element, eventType);
      }
    }
    // New attribute is defined or has changed from the old one, update it.
    else if (oldVal === undefined || newVal !== oldVal) {
      setAttribute(element, key, newVal, isSVG);

      const regex = new RegExp('^' + Directive.EVENT, 'i');
      if (regex.test(key)) {
        const eventType = attribute.name.replace(Directive.EVENT, '');
        const handlerName = getAttribute(element, key);
        if (rootNode.__unregister_child_event__ && element instanceof Element) rootNode.__unregister_child_event__(element, eventType);
        if (rootNode.__register_child_event__ && element instanceof Element) rootNode.__register_child_event__(element, eventType, handlerName);
      }
    }
  }
}

/**
 * Checks if two vnodes are different.
 * 
 * @param {VNode} vnode1 - The first vnode to compare.
 * @param {VNode} vnode2 - The second vnode to compare.
 * 
 * @return {boolean} `true` if the vnodes are different, `false` otherwise.
 */
function isDifferent(vnode1, vnode2) {
  if (process.env.NODE_ENV === 'development') {
    assert(typeof vnode1 === 'string' || typeof vnode1.tag === 'string', `Invalid vnode for param 'vnode1'`);
    assert(typeof vnode2 === 'string' || typeof vnode2.tag === 'string', `Invalid vnode for param 'vnode2'`);
  }

  if (typeof vnode1 !== typeof vnode2) return true;
  if (vnode1 === vnode2) return false;
  if (vnode1.tag !== vnode2.tag) return true;
  if ((vnode1.attributes && vnode1.attributes[Directive.IS]) !== (vnode2.attributes && vnode2.attributes[Directive.IS])) return true;
  if ((vnode1.attributes && vnode1.attributes[Directive.NAME]) !== (vnode2.attributes && vnode2.attributes[Directive.NAME])) return true;
  if ((typeof vnode1 === 'string') && (typeof vnode2 === 'string') && (vnode1 !== vnode2)) return true;

  return false;
}

export default patch;
