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
 * Patches a DOM element based on the virtual tree provided.
 * 
 * @param {Node} rootNode - The DOM element to patch.
 * @param {VNode} newVTree - The new vtree.
 * @param {VNode} oldVTree - The old vtree to diff from.
 * 
 * @alias module:meno~vdom.patch
 */
function patch(rootNode, newVTree, oldVTree) {
  // If there is no old tree, the entire tree is inserted.
  if (!oldVTree) {
    const nNewChildren = newVTree.children.length;
  
    for (let i = 0; i < nNewChildren; i++) {
      const child = createElement(newVTree.children[i], isSVGElement(rootNode));
      getTreeRoot(rootNode).appendChild(child);
    }

    if (rootNode.__sync_child_events__) rootNode.__sync_child_events__();
  }
  // Otherwise walk through both old and new trees and patch changes based on 
  // the diff results for every child node, recursively.
  else {
    const nNewChildren = newVTree.children.length;
    const nOldChildren = oldVTree.children.length;
  
    for (let i = 0; i < nNewChildren || i < nOldChildren; i++) {
      updateNodeAt(i, rootNode, rootNode, newVTree.children[i], oldVTree.children[i], isSVGElement(rootNode));
    }
  }

  return newVTree;
}

/**
 * Applies updates to a DOM node as specified by its root node, immediate parent
 * and child index.
 * 
 * @param {number} [index=0] - The child index of the node to update.
 * @param {Node} parentNode - The immediate parent of the node to update.
 * @param {Node} rootNode - The root element.
 * @param {VNode} newVNode - The new VNode instance with updated properties.
 * @param {VNode} oldVNode - The old VNode instance to diff from.
 * @param {boolean} [isSVG=false] - Specifies the node to update is part of an
 *                                  SVG element.
 */
function updateNodeAt(index = 0, parentNode, rootNode, newVNode, oldVNode, isSVG = false) {
  // Old node doesn't exist, that means new node is indeed new. Append it to the
  // parent node and early exit.
  if (!oldVNode) {
    const element = createElement(newVNode, isSVGElement(parentNode));
    getTreeRoot(parentNode).appendChild(element);
    if (rootNode.__register_all_child_events__ && element instanceof Element) rootNode.__register_all_child_events__(element);
    return;
  }

  const childNode = getTreeRoot(parentNode).childNodes[index];

  // New node doesn't exist, that means the old node is deleted.
  if (!newVNode) {
    if (rootNode.__unregister_child_event__ && childNode instanceof Element) rootNode.__unregister_child_event__(childNode);
    getTreeRoot(parentNode).removeChild(childNode);
  }
  // New node is different from the old node, replace them.
  else if (isDifferent(newVNode, oldVNode)) {
    const newChildNode = createElement(newVNode, isSVGElement(parentNode));
    if (rootNode.__unregister_child_event__ && childNode instanceof Element) rootNode.__unregister_child_event__(childNode);
    if (rootNode.__register_all_child_events__ && newChildNode instanceof Element) rootNode.__register_all_child_events__(newChildNode);
    getTreeRoot(parentNode).replaceChild(newChildNode, childNode);
  }
  // New node is the same as the old node, but check if its properties have
  // changed.
  else if (newVNode.tag) {
    updateAttributes(rootNode, childNode, newVNode.attributes, oldVNode.attributes, isSVG || isSVGElement(parentNode));

    const nNewChildren = newVNode.children.length;
    const nOldChildren = oldVNode.children.length;

    // Also update its children.
    for (let i = 0; i < nNewChildren || i < nOldChildren; i++) {
      updateNodeAt(i, childNode, rootNode, newVNode.children[i], oldVNode.children[i], isSVG || isSVGElement(parentNode));
    }
  }
}

/**
 * Updates all the attributes of an element and does so precisly by comparing 
 * with its old attributes.
 * 
 * @param {Node} rootNode - The root element.
 * @param {Node} node - The element instance to modify.
 * @param {Object} newAttributes - New attributes to apply.
 * @param {Object} oldAttributes - Old attributes to compare against.
 * @param {boolean} isSVG - Specifies whether the attribute updates are for an
 *                          SVG element or its child nodes.
 */
function updateAttributes(rootNode, node, newAttributes, oldAttributes, isSVG) {
  const attributes = Object.assign({}, newAttributes, oldAttributes);

  for (let key in attributes) {
    if (key === Directive.IS) continue;

    const oldVal = oldAttributes[key];
    const newVal = newAttributes[key];

    // No new attribute defined, that means the old one is deleted.
    if (newVal === undefined) {
      setAttribute(node, key, undefined, isSVG || isSVGElement(node));

      if (node.__set_data__) {
        const propertyName = Directive.getDataPropertyName(key);
        if (propertyName) node.__set_data__(propertyName, undefined);
      }

      const regex = new RegExp('^' + Directive.EVENT, 'i');
      if (regex.test(key)) {
        const eventType = key.replace(Directive.EVENT, '');
        if (rootNode.__unregister_child_event__ && node instanceof Element) rootNode.__unregister_child_event__(node, eventType);
      }
    }
    // New attribute is defined or has changed from the old one, update it.
    else if (oldVal === undefined || newVal !== oldVal) {
      setAttribute(node, key, newVal, isSVG || isSVGElement(node));

      if (node.__set_data__) {
        const propertyName = Directive.getDataPropertyName(key);
        if (propertyName) node.__set_data__(propertyName, newVal, { attributed: true });
      }

      const regex = new RegExp('^' + Directive.EVENT, 'i');
      if (regex.test(key)) {
        const eventType = attribute.name.replace(Directive.EVENT, '');
        const handlerName = getAttribute(node, key);
        if (rootNode.__unregister_child_event__ && node instanceof Element) rootNode.__unregister_child_event__(node, eventType);
        if (rootNode.__register_child_event__ && node instanceof Element) rootNode.__register_child_event__(node, eventType, handlerName);
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

/**
 * Checks if a DOM element is an SVG element.
 * 
 * @param {Element} element - The DOM element to check.
 * 
 * @return {boolean} `true` if it's an SVG element, `false` otherwise.
 */
function isSVGElement(element) {
  return element && element.tagName && element.tagName.toLowerCase() === 'svg';
}

/**
 * Gets the root node of the element to append children to. If the element has
 * a shadow it will return its shadow root.
 * 
 * @param {Element} element - The target DOM element.
 * 
 * @return {Element} The root node.
 */
function getTreeRoot(element) {
  return element.shadowRoot || element;
}

export default patch;
