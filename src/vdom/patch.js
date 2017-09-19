// © Andrew Wei

'use strict';

import Directive from 'enums/Directive';
import createElement from 'vdom/createElement';
import setAttribute from 'dom/setAttribute';
import VNode from 'vdom/VNode';
import VTextNode from 'vdom/VTextNode';

if (process.env.NODE_ENV === 'development') {
  var assert = require('assert');
}

/**
 * @alias module:meno~vdom.patch
 */
function patch(element, newTree, oldTree) {
  if (!oldTree) {
    const nNewChildren = newTree.children.length;
  
    for (let i = 0; i < nNewChildren; i++) {
      const child = createElement(newTree.children[i]);
      element.appendChild(child);
    }
  }
  else {
    const nNewChildren = newTree.children.length;
    const nOldChildren = oldTree.children.length;
  
    for (let i = 0; i < nNewChildren || i < nOldChildren; i++) {
      updateElement(element, newTree.children[i], oldTree.children[i], i);
    }
  }

  return newTree;
}

function updateElement(parent, newNode, oldNode, index = 0) {
  if (!oldNode) {
    parent.appendChild(createElement(newNode));
  }
  else if (!newNode) {
    parent.removeChild(parent.childNodes[index]);
  }
  else if (isDifferent(newNode, oldNode)) {
    parent.replaceChild(createElement(newNode), parent.childNodes[index]);
  }
  else if (newNode.tag) {
    updateAttributes(parent.childNodes[index], newNode.attributes, oldNode.attributes);

    const nNewChildren = newNode.children.length;
    const nOldChildren = oldNode.children.length;

    for (let i = 0; i < nNewChildren || i < nOldChildren; i++) {
      updateElement(parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
    }
  }
}

/**
 * Updates all the attributes of an element and does so precisly by comparing 
 * with its old attributes.
 * 
 * @param {Node} element - The element instance to modify.
 * @param {Object} newAttributes - New attributes to apply.
 * @param {Object} oldAttributes - Old attributes to compare against.
 */
function updateAttributes(element, newAttributes, oldAttributes) {
  const attributes = Object.assign({}, newAttributes, oldAttributes);
  
  for (let key in attributes) {
    if (key === Directive.IS) continue;

    const oldVal = oldAttributes[key];
    const newVal = newAttributes[key];

    if (newVal === undefined) {
      setAttribute(element, key, undefined);
    }
    else if (oldVal === undefined || newVal !== oldVal) {
      setAttribute(element, key, newVal);
    }
  }
}

/**
 * Checks if two vnodes are different.
 * 
 * @param {VNode|VTextNode} vnode1 - The first vnode to compare.
 * @param {VNode|VTextNode} vnode2 - The second vnode to compare.
 * 
 * @return {boolean} `true` if the vnodes are different, `false` otherwise.
 */
function isDifferent(vnode1, vnode2) {
  if (process.env.NODE_ENV) {
    assert(vnode1 instanceof VNode || vnode1 instanceof VTextNode, `'vnode1' must be an instance of VNode or VTextNode`);
    assert(vnode2 instanceof VNode || vnode2 instanceof VTextNode, `'vnode2' must be an instance of VNode or VTextNode`);
  }

  if (vnode1.constructor !== vnode2.constructor) return true;
  if (vnode1.tag !== vnode2.tag) return true;
  if ((vnode1.attributes && vnode1.attributes[Directive.IS]) !== (vnode2.attributes && vnode2.attributes[Directive.IS])) return true;
  if ((vnode1.attributes && vnode1.attributes[Directive.NAME]) !== (vnode2.attributes && vnode2.attributes[Directive.NAME])) return true;
  if ((vnode1 instanceof VTextNode) && (vnode2 instanceof VTextNode) && (vnode1.text !== vnode2.text)) return true;

  return false;
}

export default patch;
